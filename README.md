# Fullstack PostgreSQL Editor with AI Assistance

### Features

1. SQL editor can run a SQL query on a postgres database
2. Al has the context of the schema of the postgres database (not the actual data)
3. you can have a conversation with Al chat, and chat can suggest SQL queries
4. the SQL queries surfaced in the ai chat should have 2 buttons on them

    a. run (replaces the SQL query in the SQL editor)
    
    b. copy (copies SQL editor to clipboard)
5. Al generated queries should be validated (ex: no hallucinated fields or tables should be surfaced to the end user, no queries that are invalid)
6. Al powered autocomplete in the SQL editor, similar to cursor. autocomplete suggestions should come up as long as the user is focused in the SQL editor

![./screenshot](screenshot.png)