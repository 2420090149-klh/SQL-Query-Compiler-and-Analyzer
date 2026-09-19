import { Token, TokenType } from './types';

const KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER', 'BY',
  'GROUP', 'HAVING', 'ASC', 'DESC', 'COUNT', 'SUM', 'AVG'
]);

const OPERATORS = new Set(['=', '>', '<', '>=', '<=', '<>', '!=']);
const SYMBOLS = new Set([',', ';', '(', ')', '*']); // '*' can be aggregate or select all

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let current = 0;
  let line = 1;
  let column = 1;

  while (current < input.length) {
    let char = input[current];

    if (char === '\n') {
      line++;
      column = 1;
      current++;
      continue;
    }
    if (/\s/.test(char)) {
      column++;
      current++;
      continue;
    }

    if (SYMBOLS.has(char)) {
      tokens.push({ type: 'SYMBOL', value: char, line, column });
      column++;
      current++;
      continue;
    }

    // Operators could be 2 chars
    if (/[=<>\!]/.test(char)) {
      let value = char;
      const nextChar = input[current + 1];
      if ((char === '<' && (nextChar === '=' || nextChar === '>')) ||
          (char === '>' && nextChar === '=') ||
          (char === '!' && nextChar === '=')) {
        value += nextChar;
      }
      tokens.push({ type: 'OPERATOR', value, line, column });
      current += value.length;
      column += value.length;
      continue;
    }

    if (/[0-9]/.test(char)) {
      let value = '';
      const startCol = column;
      while (current < input.length && /[0-9.]/.test(input[current])) {
        value += input[current];
        current++;
        column++;
      }
      tokens.push({ type: 'NUMBER', value, line, column: startCol });
      continue;
    }

    if (char === "'" || char === '"') {
      let value = '';
      const quote = char;
      const startCol = column;
      current++;
      column++;
      while (current < input.length && input[current] !== quote) {
        value += input[current];
        current++;
        column++;
      }
      if (input[current] === quote) {
        current++;
        column++;
      }
      tokens.push({ type: 'STRING', value, line, column: startCol });
      continue;
    }

    if (/[a-zA-Z_]/.test(char)) {
      let value = '';
      const startCol = column;
      while (current < input.length && /[a-zA-Z0-9_]/.test(input[current])) {
        value += input[current];
        current++;
        column++;
      }
      const upperValue = value.toUpperCase();
      if (KEYWORDS.has(upperValue)) {
        tokens.push({ type: 'KEYWORD', value: upperValue, line, column: startCol });
      } else {
        tokens.push({ type: 'IDENTIFIER', value, line, column: startCol });
      }
      continue;
    }

    tokens.push({ type: 'ERROR', value: char, line, column });
    current++;
    column++;
  }

  tokens.push({ type: 'EOF', value: '', line, column });
  return tokens;
}
