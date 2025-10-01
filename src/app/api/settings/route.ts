import { type NextRequest, NextResponse } from "next/server";
import {
  deleteSession,
  getSession,
  type UserSettings,
  updateSession,
} from "@/lib/session";

export async function GET() {
  try {
    const settings = await getSession();
    return NextResponse.json(settings || {});
  } catch (error) {
    console.error("Error getting settings:", error);
    return NextResponse.json(
      { error: "Failed to get settings" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mistralApiKey, postgresUrl }: UserSettings = body;

    if (mistralApiKey !== undefined && typeof mistralApiKey !== "string") {
      return NextResponse.json(
        { error: "Invalid mistralApiKey" },
        { status: 400 },
      );
    }

    if (postgresUrl !== undefined && typeof postgresUrl !== "string") {
      return NextResponse.json(
        { error: "Invalid postgresUrl" },
        { status: 400 },
      );
    }

    const updatedSettings = await updateSession({ mistralApiKey, postgresUrl });

    return NextResponse.json({
      message: "Settings updated successfully",
      settings: updatedSettings,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    await deleteSession();
    return NextResponse.json({ message: "Settings cleared successfully" });
  } catch (error) {
    console.error("Error clearing settings:", error);
    return NextResponse.json(
      { error: "Failed to clear settings" },
      { status: 500 },
    );
  }
}
