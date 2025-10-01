import { Client } from "pg";
import { getSession } from "@/lib/session";

// Basic SQL validation (checks for dangerous statements)
function validateSQL(sql: string): boolean {
  const forbidden = [
    /drop\s+table/i,
    /drop\s+database/i,
    /delete\s+from/i,
    /truncate\s+table/i,
    /alter\s+table/i,
    /update\s+/i,
    /insert\s+into/i,
  ];
  return !forbidden.some((regex) => regex.test(sql));
}

export async function POST(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
    });
  }

  const { sql } = await req.json();

  // Get session data for PostgreSQL URL
  const session = await getSession();
  const postgresURL = session?.postgresUrl || process.env.POSTGRES_URL;

  if (typeof sql !== "string") {
    return new Response(
      JSON.stringify({ error: "SQL query is missing or malformed" }),
      {
        status: 400,
      },
    );
  }

  if (!postgresURL) {
    return new Response(
      JSON.stringify({
        error:
          "PostgreSQL URL is required. Please set it in settings or provide it in the request.",
      }),
      {
        status: 400,
      },
    );
  }

  if (!validateSQL(sql)) {
    return new Response(JSON.stringify({ error: "Unsafe SQL detected" }), {
      status: 400,
    });
  }

  const client = new Client({ connectionString: postgresURL });

  try {
    await client.connect();
    const result = await client.query(sql);
    await client.end();
    return new Response(
      JSON.stringify({ rows: result.rows, fields: result.fields }),
      { status: 200 },
    );
  } catch (error: unknown) {
    await client.end();
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown database error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}
