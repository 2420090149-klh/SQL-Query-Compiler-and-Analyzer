import { ASTNode, SemanticError } from './types';
import { schema } from '../data/schema';

export function analyzeSemantics(ast: ASTNode): { errors: SemanticError[], symbolTable: any[] } {
  const errors: SemanticError[] = [];
  const symbolTable: any[] = [];
  
  if (!ast || ast.type !== 'QUERY') return { errors, symbolTable };

  let tableName = '';
  const fromNode = ast.children?.find(c => c.type === 'FROM');
  if (fromNode && fromNode.children && fromNode.children.length > 0) {
    tableName = fromNode.children[0].value || '';
  }

  const tableSchema = schema[tableName];
  if (!tableSchema) {
    errors.push({ message: `Table '${tableName}' does not exist.` });
    return { errors, symbolTable };
  }

  // Populate symbol table for the active table
  tableSchema.columns.forEach(col => {
    symbolTable.push({ table: tableName, column: col.name, type: col.type });
  });

  function validateColumn(colName: string) {
    if (colName === '*') return;
    const exists = tableSchema!.columns.find(c => c.name === colName);
    if (!exists) {
      errors.push({ message: `Column '${colName}' does not exist in table '${tableName}'.` });
    }
  }

  function validateConditionOperand(op: string) {
    // Check if it's a number
    if (!isNaN(Number(op))) return;
    // Check if it's a string literal (rudimentary check - parser leaves quotes off or we strip them, but let's assume if it starts with quote it's string. Our parser stores the bare value if identifier, or value for string)
    if (op.startsWith("'") || op.startsWith('"')) return;
    
    // Otherwise it must be a column
    validateColumn(op);
  }

  // Validate SELECT columns
  const selectNode = ast.children?.find(c => c.type === 'SELECT');
  const columnsNode = selectNode?.children?.find(c => c.type === 'COLUMNS');
  columnsNode?.children?.forEach(c => {
    if (c.type === 'COLUMN' && c.value) {
      validateColumn(c.value);
    }
  });

  // Validate WHERE columns
  const whereNode = ast.children?.find(c => c.type === 'WHERE');
  if (whereNode && whereNode.children && whereNode.children.length > 0) {
    const condNode = whereNode.children[0];
    if (condNode.children && condNode.children.length === 2) {
      validateConditionOperand(condNode.children[0].value!);
      validateConditionOperand(condNode.children[1].value!);
      
      // Basic type checking
      const leftCol = tableSchema.columns.find(c => c.name === condNode.children![0].value);
      const rightVal = condNode.children![1].value!;
      if (leftCol) {
        const isRightNum = !isNaN(Number(rightVal));
        if (leftCol.type === 'INT' || leftCol.type === 'FLOAT') {
          if (!isRightNum && !tableSchema.columns.find(c => c.name === rightVal)) {
            errors.push({ message: `Type mismatch: ${leftCol.name} is ${leftCol.type} but operand is not a number.` });
          }
        }
      }
    }
  }

  return { errors, symbolTable };
}
