import "server-only";
import { type JWTPayload, jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { fetchDatabaseSchema, generateSchemaString } from "./database";

export interface UserSettings extends JWTPayload {
  mistralApiKey?: string;
  postgresUrl?: string;
  schema?: string;
}

const secretKey = process.env.SESSION_SECRET;
if (!secretKey) {
  throw new Error(
    "SESSION_SECRET environment variable is not defined. This is required for secure session management.",
  );
}
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: UserSettings) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as UserSettings;
  } catch (error) {
    console.log("Failed to verify session:", error);
    return null;
  }
}

export async function createSession(settings: UserSettings) {
  let enrichedSettings = settings;
  if (settings.postgresUrl) {
    try {
      const schema = await fetchDatabaseSchema(settings.postgresUrl);
      if (schema) {
        const schemaString = generateSchemaString(schema);
        enrichedSettings = { ...settings, schema: schemaString };
      }
    } catch (error) {
      console.error(
        "Failed to fetch database schema during session creation:",
        error,
      );
    }
  }

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt(enrichedSettings);
  const cookieStore = await cookies();

  cookieStore.set("user-settings", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession(): Promise<UserSettings | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("user-settings")?.value;

  if (!session) {
    return null;
  }

  return await decrypt(session);
}

export async function updateSession(newSettings: Partial<UserSettings>) {
  const currentSettings = (await getSession()) || {};
  let updatedSettings = { ...currentSettings, ...newSettings };
  if (
    newSettings.postgresUrl &&
    newSettings.postgresUrl !== currentSettings.postgresUrl
  ) {
    try {
      const schema = await fetchDatabaseSchema(newSettings.postgresUrl);
      if (schema) {
        const schemaString = generateSchemaString(schema);
        updatedSettings = { ...updatedSettings, schema: schemaString };
      }
    } catch (error) {
      console.error(
        "Failed to fetch database schema during session update:",
        error,
      );
    }
  }

  await createSession(updatedSettings);
  return updatedSettings;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("user-settings");
}
