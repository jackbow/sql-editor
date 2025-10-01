import { CompletionCopilot, type CompletionRequestBody } from "monacopilot";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  // Get session data for Mistral API key
  const session = await getSession();
  const mistralApiKey = session?.mistralApiKey || process.env.MISTRAL_API_KEY;
  const schemaString = session?.schema || "No schema provided";

  if (!mistralApiKey) {
    return NextResponse.json(
      { error: "Mistral API key is required. Please set it in settings." },
      { status: 400 },
    );
  }

  const copilot = new CompletionCopilot(mistralApiKey, {
    provider: "mistral",
    model: "codestral",
  });
  const body: CompletionRequestBody = await req.json();
  const completion = await copilot.complete({
    body,
    options: {
      customPrompt: () => ({
        context: `This is a postgrs SQL file. ONLY reference tables and columns which exist in the schema. The database schema is as follows:\n\n${schemaString}`,
      }),
    },
  });
  return NextResponse.json(completion, { status: 200 });
}
