import { Token, ASTNode } from './types';

export class ParserError extends Error {
  constructor(message: string, public line: number) {
    super(message);
  }
}

export function parse(tokens: Token[]): ASTNode {
  let current = 0;

  function peek(): Token {
    return tokens[current];
  }
  function advance(): Token {
    return tokens[current++];
  }
  function match(type: string, value?: string): boolean {
    const t = peek();
    if (t.type === type && (!value || t.value === value)) {
      advance();
      return true;
    }
    return false;
  }
  function expect(type: string, value?: string): Token {
    const t = peek();
    if (t.type === type && (!value || t.value === value)) {
      return advance();
    }
    throw new ParserError(`Expected ${value || type}, got ${t.value || t.type}`, t.line);
  }

  function parseQuery(): ASTNode {
    const node: ASTNode = { type: 'QUERY', children: [] };
    node.children!.push(parseSelect());
    if (peek().value === 'FROM') {
      node.children!.push(parseFrom());
    } else {
      throw new ParserError("Expected FROM clause", peek().line);
    }
    if (peek().value === 'WHERE') {
      node.children!.push(parseWhere());
    }
    if (peek().value === 'GROUP') {
      node.children!.push(parseGroup());
    }
    if (peek().value === 'ORDER') {
      node.children!.push(parseOrder());
    }
    return node;
  }

  function parseSelect(): ASTNode {
    expect('KEYWORD', 'SELECT');
    const node: ASTNode = { type: 'SELECT', children: [] };
    const cols: ASTNode = { type: 'COLUMNS', children: [] };
    
    while (current < tokens.length && peek().value !== 'FROM' && peek().type !== 'EOF') {
      if (peek().type === 'IDENTIFIER' || peek().value === '*') {
        const t = advance();
        if (peek().value === '(') { // aggregate function like COUNT(*)
          const funcName = t.value;
          advance(); // skip (
          const arg = advance();
          expect('SYMBOL', ')');
          cols.children!.push({ type: 'AGGREGATE', value: `${funcName}(${arg.value})` });
        } else {
          cols.children!.push({ type: 'COLUMN', value: t.value });
        }
      }
      if (peek().value === ',') {
        advance();
      } else {
        break;
      }
    }
    node.children!.push(cols);
    return node;
  }

  function parseFrom(): ASTNode {
    expect('KEYWORD', 'FROM');
    const t = expect('IDENTIFIER');
    return { type: 'FROM', children: [{ type: 'TABLE', value: t.value }] };
  }

  function parseWhere(): ASTNode {
    expect('KEYWORD', 'WHERE');
    return { type: 'WHERE', children: [parseCondition()] };
  }

  function parseCondition(): ASTNode {
    let left: ASTNode;
    const t = advance();
    if (t.type === 'IDENTIFIER' || t.type === 'NUMBER' || t.type === 'STRING') {
      left = { type: 'OPERAND', value: t.value };
    } else {
      throw new ParserError(`Invalid operand in condition: ${t.value}`, t.line);
    }

    if (peek().type !== 'OPERATOR') {
      throw new ParserError(`Expected operator in condition`, peek().line);
    }
    const op = advance();

    let right: ASTNode;
    const t2 = advance();
    if (t2.type === 'IDENTIFIER' || t2.type === 'NUMBER' || t2.type === 'STRING') {
      right = { type: 'OPERAND', value: t2.value };
    } else {
      throw new ParserError(`Invalid operand in condition: ${t2.value}`, t2.line);
    }

    return { type: op.value, children: [left, right] };
  }

  function parseGroup(): ASTNode {
    expect('KEYWORD', 'GROUP');
    expect('KEYWORD', 'BY');
    const t = expect('IDENTIFIER');
    return { type: 'GROUP_BY', children: [{ type: 'COLUMN', value: t.value }] };
  }

  function parseOrder(): ASTNode {
    expect('KEYWORD', 'ORDER');
    expect('KEYWORD', 'BY');
    const t = expect('IDENTIFIER');
    const orderNode: ASTNode = { type: 'ORDER_BY', children: [{ type: 'COLUMN', value: t.value }] };
    if (match('KEYWORD', 'ASC') || match('KEYWORD', 'DESC')) {
      orderNode.children!.push({ type: 'DIRECTION', value: tokens[current - 1].value });
    }
    return orderNode;
  }

  return parseQuery();
}
