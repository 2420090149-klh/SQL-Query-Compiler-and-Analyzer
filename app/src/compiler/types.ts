export type TokenType = 
  | 'KEYWORD'
  | 'IDENTIFIER'
  | 'NUMBER'
  | 'STRING'
  | 'OPERATOR'
  | 'SYMBOL'
  | 'EOF'
  | 'ERROR';

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

export interface ASTNode {
  type: string;
  value?: string;
  children?: ASTNode[];
}

export interface SemanticError {
  message: string;
  line?: number;
}

export interface IRInstruction {
  id: string;
  op: string;
  arg1?: string;
  arg2?: string;
  result?: string;
}

export interface OptimizationResult {
  before: IRInstruction[];
  after: IRInstruction[];
  ruleApplied: string;
}

export interface AnalysisResult {
  lexical: { success: boolean; tokens: Token[]; error?: string };
  syntax: { success: boolean; ast: ASTNode | null; error?: string };
  semantic: { success: boolean; errors: SemanticError[]; symbolTable: any[] };
  ir: { success: boolean; code: IRInstruction[]; error?: string };
  optimization: { success: boolean; result: OptimizationResult | null };
}
