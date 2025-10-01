import { createMistral } from "@ai-sdk/mistral";
import { generateObject, type ModelMessage } from "ai";
import { NextResponse } from "next/server";
import { Client } from "pg";
import { z } from "zod";
import { getSession } from "@/lib/session";

type RequestBody = {
  messages: ModelMessage[];
};

const getUnsafeSystemPrompt = (schemaString: string) => `
You are a SQL (postgres) expert. Your job is to help the user write a SQL query to fulfill the user's request.
The database schema is as follows:

${schemaString}

When you generate the query, make sure it is syntactically correct.
Make sure to use the exact table and column names as provided in the schema.
Do not make up any table or column names.

If the user asks for something that is not possible with SQL, politely inform them that you can only help with SQL queries.
If the user asks for something that is not possible to retrieve from the given schema, politely inform them that it is not possible.

ALWAYS Respond in the following JSON format:
{
  "sqlQuery": "...", // The SQL query to fulfill the user's request. Use newlines and indentation for readability.
  "sqlQueryTitle": "..." // A short title for the query.
  "explanation": "..." // A brief explanation of the query.
}
`;

const getSafeSystemPrompt = (schemaString: string) => `
You are a SQL (postgres) expert. Your job is to help the user write a SQL query to retrieve the data they need.
The database schema is as follows:

${schemaString}

Only retrieval queries are allowed.
Never generate any other type of query.

When you generate the query, make sure it is syntactically correct.
Make sure to use the exact table and column names as provided in the schema.
Do not make up any table or column names.

If the user asks for something that is not possible with SQL, politely inform them that you can only help with SQL queries.
If the user asks for something that is not possible to retrieve from the given schema, politely inform them that it is not possible.

ALWAYS Respond in the following JSON format:
{
  "sqlQuery": "SELECT ...", // The SQL query to retrieve the data. Use newlines and indentation for readability.
  "sqlQueryTitle": "..." // A short title for the query.
  "explanation": "..." // A brief explanation of the query.
}
`;

const getSystemPrompt = process.env.SAFE_SQL_MODE === 'true' ? getSafeSystemPrompt : getUnsafeSystemPrompt;

const responseSchema = z.object({
  sqlQuery: z.string(),
  sqlQueryTitle: z.string(),
  explanation: z.string(),
});

export async function POST(req: Request) {
  const { messages }: RequestBody = await req.json();
  const session = await getSession();
  const mistralApiKey = session?.mistralApiKey || process.env.MISTRAL_API_KEY;
  const postgresURL = session?.postgresUrl || process.env.POSTGRES_URL;
  const schemaString =
    session?.schema || process.env.DB_SCHEMA || "No schema provided";

  if (!mistralApiKey) {
    return NextResponse.json(
      { error: "Mistral API key is required. Please set it in settings" },
      { status: 400 },
    );
  }

  if (!postgresURL) {
    return NextResponse.json(
      { error: "PostgreSQL URL is required. Please set it in settings" },
      { status: 400 },
    );
  }

  const mistral = createMistral({
    apiKey: mistralApiKey,
  });

  const resp = await generateObject({
    system: getSystemPrompt(schemaString),
    schema: responseSchema,
    model: mistral("codestral-2508"),
    messages,
  });

  const client = new Client({ connectionString: postgresURL });
  try {
    // Validate the generated SQL by running EXPLAIN
    await client.connect();
    await client.query(`EXPLAIN ${resp.object.sqlQuery}`);
    await client.end();
    return NextResponse.json(resp.object, { status: 200 });
  } catch (error: unknown) {
    await client.end();
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}
