import { Client } from "pg";

export interface DatabaseColumn {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
  character_maximum_length: number | null;
  numeric_precision: number | null;
  numeric_scale: number | null;
}

export interface DatabaseTable {
  table_name: string;
  table_schema: string;
  columns: DatabaseColumn[];
}

export interface DatabaseSchema {
  tables: DatabaseTable[];
  views: DatabaseTable[];
  last_updated: string;
}

/**
 * Fetches the complete database schema from a PostgreSQL database
 */
export const fetchDatabaseSchema = async (
  connectionString: string,
): Promise<DatabaseSchema | null> => {
  const isLocalhost =
    connectionString.includes("localhost") ||
    connectionString.includes("127.0.0.1");
  const matches = connectionString.match(/\/\/([^:/\s]+)/);
  const hostname = matches?.[1] ?? "";
  const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
  const sslConfig =
    isLocalhost || isIpAddress
      ? {
          rejectUnauthorized: false,
          checkServerIdentity: () => undefined, // This is the key change
        }
      : {
          rejectUnauthorized: false,
        };
  const client = new Client({
    connectionString,
    ssl: sslConfig,
  });

  try {
    await client.connect();

    // Query to get all tables and their columns
    const tablesQuery = `
      SELECT 
        t.table_name,
        t.table_schema,
        c.column_name,
        c.data_type,
        c.is_nullable,
        c.column_default,
        c.character_maximum_length,
        c.numeric_precision,
        c.numeric_scale
      FROM information_schema.tables t
      LEFT JOIN information_schema.columns c 
        ON t.table_name = c.table_name 
        AND t.table_schema = c.table_schema
      WHERE t.table_schema NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
        AND t.table_type = 'BASE TABLE'
      ORDER BY t.table_schema, t.table_name, c.ordinal_position;
    `;

    // Query to get all views and their columns
    const viewsQuery = `
      SELECT 
        v.table_name,
        v.table_schema,
        c.column_name,
        c.data_type,
        c.is_nullable,
        c.column_default,
        c.character_maximum_length,
        c.numeric_precision,
        c.numeric_scale
      FROM information_schema.views v
      LEFT JOIN information_schema.columns c 
        ON v.table_name = c.table_name 
        AND v.table_schema = c.table_schema
      WHERE v.table_schema NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
      ORDER BY v.table_schema, v.table_name, c.ordinal_position;
    `;

    const [tablesResult, viewsResult] = await Promise.all([
      client.query(tablesQuery),
      client.query(viewsQuery),
    ]);

    // Process tables
    const tablesMap = new Map<string, DatabaseTable>();
    for (const row of tablesResult.rows) {
      const tableKey = `${row.table_schema}.${row.table_name}`;

      if (!tablesMap.has(tableKey)) {
        tablesMap.set(tableKey, {
          table_name: row.table_name,
          table_schema: row.table_schema,
          columns: [],
        });
      }

      if (row.column_name) {
        const table = tablesMap.get(tableKey);
        if (table) {
          table.columns.push({
            column_name: row.column_name,
            data_type: row.data_type,
            is_nullable: row.is_nullable,
            column_default: row.column_default,
            character_maximum_length: row.character_maximum_length,
            numeric_precision: row.numeric_precision,
            numeric_scale: row.numeric_scale,
          });
        }
      }
    }

    // Process views
    const viewsMap = new Map<string, DatabaseTable>();
    for (const row of viewsResult.rows) {
      const viewKey = `${row.table_schema}.${row.table_name}`;

      if (!viewsMap.has(viewKey)) {
        viewsMap.set(viewKey, {
          table_name: row.table_name,
          table_schema: row.table_schema,
          columns: [],
        });
      }

      if (row.column_name) {
        const view = viewsMap.get(viewKey);
        if (view) {
          view.columns.push({
            column_name: row.column_name,
            data_type: row.data_type,
            is_nullable: row.is_nullable,
            column_default: row.column_default,
            character_maximum_length: row.character_maximum_length,
            numeric_precision: row.numeric_precision,
            numeric_scale: row.numeric_scale,
          });
        }
      }
    }

    return {
      tables: Array.from(tablesMap.values()),
      views: Array.from(viewsMap.values()),
      last_updated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Failed to fetch database schema:", error);
    return null;
  } finally {
    await client.end();
  }
};

/**
 * Generates a human-readable schema string from the database schema
 */
export const generateSchemaString = (schema: DatabaseSchema): string => {
  const lines: string[] = [];

  // Add tables
  if (schema.tables.length > 0) {
    lines.push("-- TABLES");
    for (const table of schema.tables) {
      lines.push(`\nTABLE ${table.table_schema}.${table.table_name} (`);

      const columnDefinitions = table.columns.map((col) => {
        let definition = `    ${col.column_name} ${col.data_type.toUpperCase()}`;

        if (col.character_maximum_length) {
          definition += `(${col.character_maximum_length})`;
        } else if (col.numeric_precision && col.numeric_scale !== null) {
          definition += `(${col.numeric_precision},${col.numeric_scale})`;
        } else if (col.numeric_precision) {
          definition += `(${col.numeric_precision})`;
        }

        if (col.is_nullable === "NO") {
          definition += " NOT NULL";
        }

        if (col.column_default) {
          definition += ` DEFAULT ${col.column_default}`;
        }

        return definition;
      });

      lines.push(columnDefinitions.join(",\n"));
      lines.push(");");
    }
  }

  // Add views
  if (schema.views.length > 0) {
    lines.push("\n-- VIEWS");
    for (const view of schema.views) {
      lines.push(`\nVIEW ${view.table_schema}.${view.table_name} (`);

      const columnDefinitions = view.columns.map((col) => {
        return `    ${col.column_name} ${col.data_type.toUpperCase()}`;
      });

      lines.push(columnDefinitions.join(",\n"));
      lines.push(");");
    }
  }

  return lines.join("\n");
};
