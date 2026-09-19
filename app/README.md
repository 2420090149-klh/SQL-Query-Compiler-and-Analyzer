# SQL Query Compiler and Analyzer

## Project Description
This is an educational web application built for a Compiler Design academic project. It demonstrates how a simple SQL query passes through the various phases of a compiler. 

**Note:** This is a *simplified SQL compiler and analyzer*, not a full database engine. It does not execute SQL queries against a real database. Everything runs locally in the browser.

## Objectives
- Perform lexical analysis (tokenization) of SQL queries.
- Validate SQL syntax by generating a parse tree (AST).
- Perform semantic analysis against a static database schema.
- Generate intermediate representation (IR) code.
- Apply basic query optimization rules (e.g., filter pushdown).
- Display errors clearly and visually demonstrate the compiler pipeline.

## Supported SQL Syntax
The parser supports a simplified subset of SQL:
- `SELECT` columns, `*`, or aggregate functions like `COUNT(*)`.
- `FROM` a single table.
- `WHERE` basic conditions (`=, >, <, >=, <=, !=`).
- `GROUP BY` column.
- `ORDER BY` column `[ASC|DESC]`.

## Compiler Phases
1. **Lexical Analysis:** Breaks the input query string into a sequence of tokens (Keywords, Identifiers, Operators, etc.).
2. **Syntax Analysis (Parser):** Validates the token sequence against a defined grammar and builds an Abstract Syntax Tree (AST).
3. **Semantic Analysis:** Checks the AST against the symbol table (database schema) to verify table existence, column validity, and perform rudimentary type checking.
4. **Intermediate Code Generation:** Converts the AST into a Three-Address Code or Relational Algebra style logical plan (e.g., `SCAN`, `FILTER`, `PROJECT`).
5. **Query Optimization:** Performs simple rule-based transformations on the intermediate code, such as executing `FILTER` before `PROJECT`.

## Technology Stack
- **Frontend Framework:** React 18
- **TypeScript:** For strict typing of the compiler nodes and tokens
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (Dark Theme)
- **Icons:** Lucide React

## Project Structure
- `src/compiler/`: Contains the core compiler logic (`lexer.ts`, `parser.ts`, `semanticAnalyzer.ts`, `intermediateCode.ts`, `optimizer.ts`, `types.ts`).
- `src/data/schema.ts`: Holds the static mock database schema for semantic validation.
- `src/App.tsx`: Main UI component containing the editor and the visual dashboard.

## How to Run

1. Ensure you have Node.js installed.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the provided `localhost` link in your browser.

## Example Queries
Try these in the application:
1. `SELECT name FROM students;`
2. `SELECT name, age FROM students WHERE age > 18;`
3. `SELEC name FORM students;` (Demonstrates Syntax Error)
4. `SELECT salary FROM students;` (Demonstrates Semantic Error)

## Limitations
- Only supports basic `SELECT` queries (No `INSERT`, `UPDATE`, `JOIN`).
- Parsing of complex boolean logic (`AND`/`OR`) is simplified.
- Does not connect to a real SQL database.

## Future Enhancements
- Support for `JOIN` statements.
- Deeper AST visualizations using D3.js.
- Execution engine to actually evaluate the IR against mock JSON data.
