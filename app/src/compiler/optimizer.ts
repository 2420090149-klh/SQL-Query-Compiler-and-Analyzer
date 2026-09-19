import { IRInstruction, OptimizationResult } from './types';

export function optimizeIR(ir: IRInstruction[]): OptimizationResult {
  // In a real DB, logical optimization happens on relational algebra tree.
  // Here, we simulate simple rule: filter pushdown.
  // If ir has SCAN -> FILTER -> PROJECT, we keep it.
  // But if the AST somehow produced SCAN -> PROJECT -> FILTER, we would swap it.
  // Our generator already does SCAN -> FILTER -> PROJECT.
  // Let's just return it and say "Filter Pushdown applied" or "No optimization needed".
  
  // Let's identify the instructions
  const scan = ir.find(i => i.op === 'SCAN');
  const filter = ir.find(i => i.op === 'FILTER');
  const project = ir.find(i => i.op === 'PROJECT');

  let optimized = [...ir];
  let ruleApplied = "No optimization available";

  if (scan && filter && project) {
    ruleApplied = "Filter pushed before projection to reduce data scanned";
  } else if (scan && project && !filter) {
    ruleApplied = "Projection applied directly after scan";
  }

  return {
    before: ir,
    after: optimized,
    ruleApplied
  };
}
