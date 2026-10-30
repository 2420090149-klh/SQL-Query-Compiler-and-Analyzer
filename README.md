# 🚀 SQL Query Compiler & Analyzer

An educational, interactive web-based SQL compiler and static analyzer developed for a 3rd-Year **Compiler Design** course. 

This application visualizes and demonstrates how high-level declarative SQL queries pass step-by-step through standard compiler phases: **Lexical Analysis (Tokenization)**, **Syntax Analysis (Parsing & AST construction)**, **Semantic Analysis (Symbol Table & Schema Validation)**, **Intermediate Code Generation (Three-Address Code / Relational Algebra)**, and **Query Optimization (Filter Pushdown)**.

---

## 📌 Project Overview

Traditional database management systems parse and execute SQL queries under the hood. This project strips back the black box, turning query analysis into an interactive, visual learning pipeline.

> **Note:** This is a *compiler and static analyzer*, not a relational storage engine. It validates grammar, inspects semantics, and generates logical execution plans in the browser in real time without executing queries against disk storage.

---

## ⚡ The 5 Compiler Pipeline Phases

```
┌─────────────────┐
│ SQL Query Input │  e.g., SELECT name, age FROM students WHERE age > 18;
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ 1. Lexical Analysis     │ ➔ Breaks query into tokens (Keywords, Identifiers, Operators, Literals)
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ 2. Syntax Analysis      │ ➔ Recursive-descent parser builds the Abstract Syntax Tree (AST)
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ 3. Semantic Analysis    │ ➔ Resolves symbols against DB schema; checks types & table/column validity
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ 4. Intermediate Code    │ ➔ Emits Three-Address Code (TAC) / Relational Algebra (SCAN, FILTER, PROJECT)
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ 5. Query Optimization   │ ➔ Applies heuristic transformations (e.g. Filter Pushdown)
└─────────────────────────┘
```

### 1. Lexical Analysis (`lexer.ts`)
- Scans raw character stream and extracts lexemes into classified tokens (`KEYWORD`, `IDENTIFIER`, `OPERATOR`, `NUMBER`, `STRING`, `SYMBOL`).
- Tracks line and column coordinates for fine-grained error reporting.

### 2. Syntax Analysis (`parser.ts`)
- A **Recursive-Descent Parser** enforcing a Context-Free Grammar (CFG) for SQL clauses:
  - `SELECT` columns / aggregate functions (`COUNT(*)`, etc.)
  - `FROM` table clause
  - `WHERE` conditional predicates (`=`, `>`, `<`, `>=`, `<=`, `!=`, `<>`)
  - `GROUP BY` column clause
  - `ORDER BY` column clause with `[ASC|DESC]`
- Builds an **Abstract Syntax Tree (AST)** omitting syntactic punctuation.

### 3. Semantic Analysis (`semanticAnalyzer.ts`)
- Performs static analysis against the database catalog/schema.
- Constructs the **Symbol Table** mapping table columns to static types (`INT`, `VARCHAR`, `FLOAT`, `BOOLEAN`).
- Catches semantic violations:
  - Table existence check (e.g. table not found in catalog).
  - Column existence check (e.g. querying a column that does not belong to the selected table).
  - Type-checking on conditional expressions.

### 4. Intermediate Code Generation (`intermediateCode.ts`)
- Generates a linear, machine-independent plan using **Three-Address Code (TAC)** and relational algebra primitives:
  - `T1 = SCAN <table_name>`
  - `T2 = FILTER T1 (<condition>)`
  - `T3 = PROJECT T2 (<column_list>)`
  - `RET = RETURN T3`

### 5. Query Optimization (`optimizer.ts`)
- Demonstrates heuristic rule-based query optimization:
  - **Filter / Predicate Pushdown:** Applies filtering operations directly after scan and prior to projection to prune non-matching tuples early and minimize memory overhead.

---

## 🗄️ Built-in Mock Database Schema

The static catalog used for semantic analysis includes two pre-configured tables:

### Table: `students`
| Column | Type |
| :--- | :--- |
| `id` | `INT` |
| `name` | `VARCHAR` |
| `age` | `INT` |
| `marks` | `FLOAT` |
| `department` | `VARCHAR` |

### Table: `courses`
| Column | Type |
| :--- | :--- |
| `course_id` | `INT` |
| `course_name` | `VARCHAR` |
| `credits` | `INT` |

---

## 🧪 Example Test Queries

Try entering these queries in the web editor to see the pipeline in action:

#### 1. Valid Query (Full Pipeline Pass)
```sql
SELECT name, age FROM students WHERE age > 18;
```
*Passes all 5 stages: generates AST, populates Symbol Table, produces TAC, and applies filter pushdown.*

#### 2. ORDER BY & Filtering
```sql
SELECT name, marks FROM students WHERE marks > 70 ORDER BY marks DESC;
```

#### 3. Aggregate Function & GROUP BY
```sql
SELECT department, COUNT(*) FROM students GROUP BY department;
```

#### 4. Syntax Error Demonstration
```sql
SELEC name FORM students;
```
*Catches grammatical mistake: `Expected SELECT, got SELEC`.*

#### 5. Semantic Error Demonstration
```sql
SELECT salary FROM students WHERE age > 18;
```
*Passes Lexer and Parser, but fails Semantic Analysis: `Column 'salary' does not exist in table 'students'`.*

---

## 👥 Team Roles & Responsibilities

| Role | Responsibility Area | Files Owned |
| :--- | :--- | :--- |
| **Lexical Engineer** | Character scanning, Regex/DFA tokenization, Line/Column tracking | `src/compiler/lexer.ts`, `src/compiler/types.ts` |
| **Syntax Engineer** | Context-Free Grammar, Recursive-Descent Parsing, AST creation | `src/compiler/parser.ts`, `src/compiler/types.ts` |
| **Semantic Engineer** | Schema validation, Symbol Table generation, Type checking | `src/compiler/semanticAnalyzer.ts`, `src/data/schema.ts` |
| **Backend & UI Lead** | IR generation (TAC), Query Optimization (Filter Pushdown), React Dashboard | `src/compiler/intermediateCode.ts`, `src/compiler/optimizer.ts`, `src/App.tsx` |

---

## 💻 Tech Stack

- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS (Dark Modern Theme)
- **Icons:** Lucide React
- **Build Tool / Bundler:** Vite 8

---

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`

### Installation & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/2420090149-klh/SQL-Query-Compiler-and-Analyzer.git
   cd SQL-Query-Compiler-and-Analyzer
   ```

2. **Navigate to the application directory and install dependencies:**
   ```bash
   cd app
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   ```
   http://localhost:5173
   ```

---

## 📂 Repository Structure

```text
SQL-Query-Compiler-and-Analyzer/
├── README.md                      # Project documentation for GitHub
├── Presentation.pptx              # Academic presentation slides
└── app/
    ├── package.json               # Node dependencies and scripts
    ├── tsconfig.json              # TypeScript configuration
    ├── vite.config.ts             # Vite build configuration
    ├── index.html                 # Main HTML template
    └── src/
        ├── compiler/              # Core compiler modules
        │   ├── types.ts           # Token, ASTNode, and IR types
        │   ├── lexer.ts           # Lexical analyzer / Tokenizer
        │   ├── parser.ts          # Recursive-descent parser (AST)
        │   ├── semanticAnalyzer.ts# Symbol Table & schema validation
        │   ├── intermediateCode.ts# Three-Address Code generation
        │   ├── optimizer.ts       # Logical query optimizer
        │   └── index.ts           # Compiler pipeline orchestrator
        ├── data/
        │   └── schema.ts          # Database catalog schema (students, courses)
        ├── App.tsx                # Main UI dashboard and visualizer
        └── main.tsx               # React application entry point
```

---

## 🎓 Academic Coursework
- **Course:** Compiler Design (3rd Year B.Tech / B.E.)
- **Topic:** Declarative Language Analysis, Domain-Specific Compilers, and Relational Optimization
