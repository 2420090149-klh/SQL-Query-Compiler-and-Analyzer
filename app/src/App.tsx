import React, { useState } from 'react';
import { Play, RotateCcw, Database, Code, ShieldCheck, Cpu, Zap, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { compileSQL } from './compiler';
import { AnalysisResult, Token, ASTNode } from './compiler/types';

const EXAMPLES = [
  { name: 'Basic SELECT', query: 'SELECT name FROM students;' },
  { name: 'WHERE Query', query: 'SELECT name, age FROM students WHERE age > 18;' },
  { name: 'ORDER BY', query: 'SELECT name, marks FROM students WHERE marks > 70 ORDER BY marks DESC;' },
  { name: 'GROUP BY', query: 'SELECT department, COUNT(*) FROM students GROUP BY department;' },
  { name: 'Semantic Error', query: 'SELECT salary FROM students WHERE age > 18;' },
  { name: 'Syntax Error', query: 'SELEC name FORM students;' }
];

export default function App() {
  const [query, setQuery] = useState(EXAMPLES[0].query);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'tokens'|'ast'|'semantic'|'ir'|'opt'>('tokens');

  const handleAnalyze = () => {
    setResult(compileSQL(query));
  };

  const renderAST = (node: ASTNode, depth = 0): React.ReactNode => {
    return (
      <div key={Math.random()} className={`ml-${depth > 0 ? 4 : 0} pl-4 border-l border-slate-700`}>
        <div className="flex items-center gap-2 py-1">
          <span className="font-mono text-purple-400 font-semibold">{node.type}</span>
          {node.value && <span className="font-mono text-green-300">{node.value}</span>}
        </div>
        {node.children && node.children.map(child => renderAST(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6 font-sans">
      {/* Header */}
      <header className="mb-8 border-b border-slate-800 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-3">
            <Database className="text-blue-400" />
            SQL Query Compiler & Analyzer
          </h1>
          <p className="text-slate-400 mt-2">Understand how SQL passes through compiler design phases</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full text-sm">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          Compiler Ready
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT PANE: Editor */}
        <div className="space-y-4">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2"><Code size={18} /> SQL Editor</h2>
              <div className="flex gap-2">
                <button onClick={() => setQuery('')} className="p-2 hover:bg-slate-700 rounded-md transition-colors text-slate-400" title="Clear">
                  <RotateCcw size={16} />
                </button>
                <button onClick={handleAnalyze} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md flex items-center gap-2 font-medium transition-colors shadow-lg shadow-blue-900/20">
                  <Play size={16} fill="currentColor" /> Analyze Query
                </button>
              </div>
            </div>
            
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-48 bg-slate-950 text-slate-100 font-mono p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-800 resize-none"
              spellCheck={false}
              placeholder="Enter SQL query here..."
            />
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Example Queries</h3>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map(ex => (
                <button key={ex.name} onClick={() => setQuery(ex.query)} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-md text-sm transition-colors border border-slate-600">
                  {ex.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANE: Analysis Summary & Results */}
        <div className="space-y-4 flex flex-col h-full">
          {result ? (
            <>
              {/* Pipeline Status */}
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 flex justify-between items-center">
                {[
                  { id: 'tokens', label: 'Lexical', ok: result.lexical.success },
                  { id: 'ast', label: 'Syntax', ok: result.syntax.success },
                  { id: 'semantic', label: 'Semantic', ok: result.semantic.success },
                  { id: 'ir', label: 'IR Gen', ok: result.ir.success },
                  { id: 'opt', label: 'Optimize', ok: result.optimization.success }
                ].map((step, i) => (
                  <React.Fragment key={step.id}>
                    <div 
                      onClick={() => setActiveTab(step.id as any)}
                      className={`flex flex-col items-center cursor-pointer p-2 rounded-md transition-colors ${activeTab === step.id ? 'bg-slate-700' : 'hover:bg-slate-700/50'}`}
                    >
                      <div className="mb-1">
                        {step.ok ? <CheckCircle className="text-green-500" size={20} /> : <XCircle className="text-red-500" size={20} />}
                      </div>
                      <span className="text-xs font-medium">{step.label}</span>
                    </div>
                    {i < 4 && <div className="h-0.5 w-8 bg-slate-700"></div>}
                  </React.Fragment>
                ))}
              </div>

              {/* Detailed View */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-xl flex-grow flex flex-col">
                <div className="p-4 border-b border-slate-700 bg-slate-800/50">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    {activeTab === 'tokens' && <><Code size={18} /> Lexical Analysis</>}
                    {activeTab === 'ast' && <><Database size={18} /> Syntax Analysis (AST)</>}
                    {activeTab === 'semantic' && <><ShieldCheck size={18} /> Semantic Analysis</>}
                    {activeTab === 'ir' && <><Cpu size={18} /> Intermediate Code</>}
                    {activeTab === 'opt' && <><Zap size={18} /> Query Optimization</>}
                  </h2>
                </div>
                
                <div className="p-4 flex-grow overflow-auto bg-slate-900/50">
                  {/* Lexical Tab */}
                  {activeTab === 'tokens' && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm font-mono">
                        <thead className="bg-slate-800 text-slate-300">
                          <tr><th className="p-2 rounded-tl-md">Lexeme</th><th className="p-2">Token Type</th><th className="p-2">Line</th><th className="p-2 rounded-tr-md">Col</th></tr>
                        </thead>
                        <tbody>
                          {result.lexical.tokens.map((t, i) => (
                            <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800">
                              <td className="p-2 text-blue-300">{t.value}</td>
                              <td className="p-2">
                                <span className={`px-2 py-0.5 rounded-full text-xs bg-opacity-20 ${t.type === 'KEYWORD' ? 'bg-purple-500 text-purple-300' : t.type === 'IDENTIFIER' ? 'bg-blue-500 text-blue-300' : 'bg-slate-500 text-slate-300'}`}>
                                  {t.type}
                                </span>
                              </td>
                              <td className="p-2">{t.line}</td>
                              <td className="p-2">{t.column}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* AST Tab */}
                  {activeTab === 'ast' && (
                    <div>
                      {result.syntax.error ? (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md flex items-start gap-3">
                           <AlertTriangle className="mt-0.5 shrink-0" />
                           <div>
                             <p className="font-bold">Syntax Error</p>
                             <p className="font-mono mt-1 text-sm">{result.syntax.error}</p>
                           </div>
                        </div>
                      ) : result.syntax.ast ? (
                        <div className="bg-slate-950 p-4 rounded-md overflow-auto font-mono text-sm border border-slate-800">
                          {renderAST(result.syntax.ast)}
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Semantic Tab */}
                  {activeTab === 'semantic' && (
                    <div className="space-y-6">
                      {result.semantic.errors.length > 0 ? (
                        <div className="space-y-2">
                          {result.semantic.errors.map((err, i) => (
                            <div key={i} className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md flex items-start gap-3">
                              <AlertTriangle className="shrink-0" size={18} />
                              <span className="font-mono text-sm">{err.message}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                         <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-md flex items-center gap-2">
                           <CheckCircle size={18} />
                           Semantic validation passed. Schema looks good!
                         </div>
                      )}

                      <div>
                        <h4 className="text-sm font-semibold text-slate-400 mb-3 uppercase">Symbol Table</h4>
                        <table className="w-full text-left text-sm font-mono">
                          <thead className="bg-slate-800 text-slate-300">
                            <tr><th className="p-2 rounded-tl-md">Table</th><th className="p-2">Column</th><th className="p-2 rounded-tr-md">Data Type</th></tr>
                          </thead>
                          <tbody>
                            {result.semantic.symbolTable.map((s, i) => (
                              <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800">
                                <td className="p-2 text-slate-300">{s.table}</td>
                                <td className="p-2 text-blue-300">{s.column}</td>
                                <td className="p-2 text-purple-300">{s.type}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* IR Tab */}
                  {activeTab === 'ir' && (
                    <div>
                      {result.ir.code.length > 0 ? (
                        <div className="bg-slate-950 p-4 rounded-md font-mono text-sm border border-slate-800">
                          {result.ir.code.map((inst, i) => (
                            <div key={i} className="py-1">
                              <span className="text-slate-500 mr-4">{(i+1).toString().padStart(2, '0')}</span>
                              <span className="text-blue-300">{inst.id}</span> = <span className="text-purple-400">{inst.op}</span> {inst.arg1} {inst.arg2 ? <span className="text-green-300">{inst.arg2}</span> : ''}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-400 italic">IR generation did not complete.</p>
                      )}
                    </div>
                  )}

                  {/* Optimization Tab */}
                  {activeTab === 'opt' && (
                    <div>
                      {result.optimization.result ? (
                        <div className="space-y-4">
                          <div className="bg-slate-800 p-3 rounded-md border border-slate-700 flex items-center gap-3">
                            <Zap className="text-yellow-400" />
                            <span className="text-sm font-medium">{result.optimization.result.ruleApplied}</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-950 p-4 rounded-md font-mono text-sm border border-slate-800 opacity-70">
                              <div className="text-xs text-slate-500 mb-2 pb-2 border-b border-slate-800">BEFORE</div>
                              {result.optimization.result.before.map((inst, i) => (
                                <div key={i} className="py-0.5">{inst.id} = {inst.op} {inst.arg1}</div>
                              ))}
                            </div>
                            <div className="bg-slate-950 p-4 rounded-md font-mono text-sm border border-green-900/30 ring-1 ring-green-500/20">
                              <div className="text-xs text-green-500 mb-2 pb-2 border-b border-green-900/30 flex justify-between">AFTER <span>⚡</span></div>
                              {result.optimization.result.after.map((inst, i) => (
                                <div key={i} className="py-0.5"><span className="text-blue-300">{inst.id}</span> = <span className="text-purple-400">{inst.op}</span> {inst.arg1}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-400 italic">Optimization did not run.</p>
                      )}
                    </div>
                  )}

                </div>
              </div>
            </>
          ) : (
            <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 h-full flex flex-col items-center justify-center text-slate-500">
              <Database size={48} className="mb-4 opacity-50" />
              <p className="text-lg">Enter a SQL query and click Analyze.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
