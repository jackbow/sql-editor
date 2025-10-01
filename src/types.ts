export type DatabaseValue = string | number | boolean | null | Date;
export type DatabaseRow = Record<string, DatabaseValue>;

export type TableData = {
  rows: DatabaseRow[];
  fields: { name: string }[];
};

export type QueryResponse = {
  error?: string;
} & Partial<TableData>;
