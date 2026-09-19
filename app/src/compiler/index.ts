import { tokenize } from './lexer';
import { parse } from './parser';
import { analyzeSemantics } from './semanticAnalyzer';
import { generateIR } from './intermediateCode';
import { optimizeIR } from './optimizer';
import { AnalysisResult } from './types';

export function compileSQL(query: string): AnalysisResult {
  const result: AnalysisResult = {
    lexical: { success: false, tokens: [] },
    syntax: { success: false, ast: null },
    semantic: { success: false, errors: [], symbolTable: [] },
    ir: { success: false, code: [] },
    optimization: { success: false, result: null }
  };

  try {
    const tokens = tokenize(query);
    result.lexical = { success: !tokens.some(t => t.type === 'ERROR'), tokens };
    
    if (result.lexical.success) {
      const ast = parse(tokens);
      result.syntax = { success: true, ast };

      const { errors, symbolTable } = analyzeSemantics(ast);
      result.semantic = { success: errors.length === 0, errors, symbolTable };

      if (result.semantic.success) {
        const ir = generateIR(ast);
        result.ir = { success: true, code: ir };

        const opt = optimizeIR(ir);
        result.optimization = { success: true, result: opt };
      }
    }
  } catch (e: any) {
    if (!result.syntax.success && !result.syntax.error) {
       result.syntax.error = e.message;
    }
  }

  return result;
}
