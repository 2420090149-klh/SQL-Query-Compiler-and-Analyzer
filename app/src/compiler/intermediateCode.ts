import { ASTNode, IRInstruction } from './types';

export function generateIR(ast: ASTNode): IRInstruction[] {
  const ir: IRInstruction[] = [];
  if (!ast || ast.type !== 'QUERY') return ir;

  let varCount = 1;
  const newVar = () => `T${varCount++}`;

  const fromNode = ast.children?.find(c => c.type === 'FROM');
  let currentVar = newVar();
  ir.push({ id: currentVar, op: 'SCAN', arg1: fromNode?.children?.[0]?.value });

  const whereNode = ast.children?.find(c => c.type === 'WHERE');
  if (whereNode && whereNode.children) {
    const cond = whereNode.children[0];
    const left = cond.children?.[0]?.value;
    const right = cond.children?.[1]?.value;
    const nextVar = newVar();
    ir.push({ id: nextVar, op: 'FILTER', arg1: currentVar, arg2: `${left} ${cond.type} ${right}` });
    currentVar = nextVar;
  }

  const selectNode = ast.children?.find(c => c.type === 'SELECT');
  const colsNode = selectNode?.children?.find(c => c.type === 'COLUMNS');
  const cols = colsNode?.children?.map(c => c.value).join(', ');
  const nextVar = newVar();
  ir.push({ id: nextVar, op: 'PROJECT', arg1: currentVar, arg2: cols });
  currentVar = nextVar;

  ir.push({ id: 'RET', op: 'RETURN', arg1: currentVar });

  return ir;
}
