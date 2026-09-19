export interface SchemaColumn {
  name: string;
  type: 'INT' | 'VARCHAR' | 'FLOAT' | 'BOOLEAN';
}

export interface SchemaTable {
  name: string;
  columns: SchemaColumn[];
}

export const schema: Record<string, SchemaTable> = {
  students: {
    name: 'students',
    columns: [
      { name: 'id', type: 'INT' },
      { name: 'name', type: 'VARCHAR' },
      { name: 'age', type: 'INT' },
      { name: 'marks', type: 'FLOAT' },
      { name: 'department', type: 'VARCHAR' }
    ]
  },
  courses: {
    name: 'courses',
    columns: [
      { name: 'course_id', type: 'INT' },
      { name: 'course_name', type: 'VARCHAR' },
      { name: 'credits', type: 'INT' }
    ]
  }
};
