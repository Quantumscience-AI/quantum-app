import { useState, useRef } from 'react';
import { Play, Trash2, Plus, X, Download } from 'lucide-react';
import { AiOutlineEdit } from 'react-icons/ai';
import { MdOutlineHelpCenter } from 'react-icons/md';
import { RiCloseLargeFill, RiSparkling2Fill } from 'react-icons/ri';
import Editor from '@monaco-editor/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell 
} from 'recharts';
import { executeQuantumCircuit } from '../utils/quantumExecutor';
import ErrorModal from '../components/common/ErrorModal';
import ShotsSelector from '../components/lab/ShotsSelector';
import ExplainModal from '../components/lab/ExplainModal';
import { copyWithFeedback } from '../utils/copyToClipboard';
import './LabPage.css';

const DEFAULT_CODE = `// Bell State - Quantum Entanglement

let state = jsqubits('|00>');

state = state.hadamard(0);
state = state.cnot(0, 1);

// Expected: ~50% |00⟩, ~50% |11⟩
`;

const NEW_FILE_CODE = `// Quantum Circuit

let state = jsqubits('|00>');

state = state.hadamard(0);

// Add more gates here...
`;

const LabPage = () => {
  const [files, setFiles] = useState([
    { id: 1, name: 'bell_state.js', content: DEFAULT_CODE, active: true }
  ]);
  const [activeFileId, setActiveFileId] = useState(1);
  const [shots, setShots] = useState(1024);
  const [results, setResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showShotsModal, setShowShotsModal] = useState(false);
  const [showExplainModal, setShowExplainModal] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null);
  const [newFileName, setNewFileName] = useState('');
  const [activeView, setActiveView] = useState('histogram');
  const [nextFileId, setNextFileId] = useState(2);
  const [showResults, setShowResults] = useState(false);
  const editorRef = useRef(null);
  const activeFile = files.find(f => f.id === activeFileId);
  const COLORS = ['#8b5cf6','#3b82f6','#10b981','#f59e0b','#ef4444','#ec4899','#14b8a6','#f97316'];

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monaco.languages.registerCompletionItemProvider('javascript', {
      provideCompletionItems: () => ({
        suggestions: [
          {
            label: "jsqubits('|00>')",
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: "jsqubits('|${1:00}>')",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Create quantum state'
          },
          {
            label: 'hadamard',
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: 'hadamard(${1:0})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Hadamard gate - creates superposition'
          },
          {
            label: 'cnot',
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: 'cnot(${1:0}, ${2:1})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'CNOT gate - controlled NOT'
          },
          {
            label: 'x',
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: 'x(${1:0})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Pauli-X gate (bit flip)'
          },
          {
            label: 'y',
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: 'y(${1:0})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Pauli-Y gate'
          },
          {
            label: 'z',
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: 'z(${1:0})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Pauli-Z gate (phase flip)'
          },
          {
            label: 'toffoli',
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: 'toffoli(${1:0}, ${2:1}, ${3:2})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Toffoli gate (CCNOT)'
          },
        ]
      })
    });
  };

  const handleEditorChange = (value) => {
    setFiles(files.map(f => f.id === activeFileId ? { ...f, content: value } : f));
  };

  const createNewFile = () => {
    const newFile = {
      id: nextFileId,
      name: `circuit_${nextFileId}.js`,
      content: NEW_FILE_CODE,
      active: false
    };
    setFiles([...files, newFile]);
    setNextFileId(nextFileId + 1);
    setActiveFileId(newFile.id);
  };

  const closeFile = (fileId, e) => {
    e.stopPropagation();
    if (files.length === 1) return;
    const fileIndex = files.findIndex(f => f.id === fileId);
    const newFiles = files.filter(f => f.id !== fileId);
    if (fileId === activeFileId && newFiles.length > 0) {
      setActiveFileId(newFiles[Math.max(0, fileIndex - 1)].id);
    }
    setFiles(newFiles);
  };

  const renameFile = () => {
    if (!newFileName.trim()) return;
    setFiles(files.map(f => f.id === activeFileId ? { ...f, name: newFileName } : f));
    setShowRenameModal(false);
    setNewFileName('');
  };

  const exportFile = () => {
    if (!activeFile) return;
    const blob = new Blob([activeFile.content], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setFiles(files.map(f => f.id === activeFileId ? { ...f, content: NEW_FILE_CODE } : f));
    setResults(null);
    setShowResults(false);
  };

  const handleRun = () => {
    if (!activeFile) return;
    setIsRunning(true);
    setErrorInfo(null);

    setTimeout(() => {
      const result = executeQuantumCircuit(activeFile.content, shots);

      if (result.success) {
        setResults({
          counts: result.counts,
          shots: result.shots,
          numQubits: result.numQubits,
          status: 'Complete'
        });
        setShowResults(true);
      } else {
        setErrorInfo({
          error: result.error,
          code: activeFile.content
        });
      }
      setIsRunning(false);
    }, 100);
  };

  const exportResults = () => {
    if (!results) return;
    const data = {
      results: results.counts,
      shots: results.shots,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quantum_results.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderHistogram = () => {
    if (!results) return null;
    const data = Object.entries(results.counts).map(([state, count]) => ({
      state: `|${state}⟩`,
      count,
      percentage: ((count / results.shots) * 100).toFixed(1)
    }));
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="state" stroke="var(--color-text)" style={{ fontSize: '0.9rem', fontWeight: 600 }} />
          <YAxis stroke="var(--color-text)" />
          <Tooltip
            contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text)' }}
            formatter={(value, name, props) => [`${value} (${props.payload.percentage}%)`, 'Count']}
          />
          <Bar dataKey="count" radius={[8,8,0,0]}>
            {data.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderGraph = () => {
    if (!results) return null;
    const data = Object.entries(results.counts).map(([state, count]) => ({
      state: `|${state}⟩`,
      probability: parseFloat(((count / results.shots) * 100).toFixed(2))
    }));
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="state" stroke="var(--color-text)" style={{ fontSize: '0.9rem', fontWeight: 600 }} />
          <YAxis stroke="var(--color-text)" label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft', style: { fill: 'var(--color-text)' } }} />
          <Tooltip
            contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text)' }}
            formatter={(value) => [`${value}%`, 'Probability']}
          />
          <Bar dataKey="probability" radius={[8,8,0,0]}>
            {data.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderTable = () => {
    if (!results) return null;
    return (
      <div className="table-view">
        <table className="results-table">
          <thead>
            <tr>
              <th>State</th>
              <th>Count</th>
              <th>Probability</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(results.counts).sort((a,b) => b[1]-a[1]).map(([state, count]) => (
              <tr key={state}>
                <td className="state-cell">|{state}⟩</td>
                <td>{count}</td>
                <td>{(count / results.shots).toFixed(4)}</td>
                <td>{((count / results.shots) * 100).toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (showResults && results) {
    return (
      <div className="results-page">
        <div className="results-page-header">
          <div className="results-info">
            <h2>Results</h2>
            <span className="results-meta">Quantum Simulation • {results.shots} shots</span>
          </div>
          <button className="close-results-btn" onClick={() => setShowResults(false)}>
            <RiCloseLargeFill size={24} />
          </button>
        </div>
        <div className="view-selector">
          {['histogram','graph','table'].map(v => (
            <button key={v} className={`view-option ${activeView === v ? 'active' : ''}`} onClick={() => setActiveView(v)}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
        <div className="results-visualization">
          {activeView === 'histogram' && renderHistogram()}
          {activeView === 'graph' && renderGraph()}
          {activeView === 'table' && renderTable()}
        </div>
        <div className="results-page-actions">
          <button className="export-results-btn" onClick={exportResults}>
            <Download size={18} />Export Results
          </button>
          <button className="explain-btn" onClick={() => setShowExplainModal(true)}>
            <RiSparkling2Fill size={18} />Explain
          </button>
        </div>

        <ExplainModal
          isOpen={showExplainModal}
          onClose={() => setShowExplainModal(false)}
          results={results}
          code={activeFile?.content || ''}
        />
      </div>
    );
  }

  return (
    <div className="quantum-ide">
      {errorInfo && (
        <ErrorModal error={errorInfo.error} code={errorInfo.code} onClose={() => setErrorInfo(null)} />
      )}

      {showDisclaimer && (
        <div className="modal-overlay" onClick={() => setShowDisclaimer(false)}>
          <div className="disclaimer-modal" onClick={e => e.stopPropagation()}>
            <h2>Code Lab</h2>
            <p>Write quantum circuits using jsqubits syntax. Create a state, apply gates, and run to see results.</p>
            <p className="cta-text">Let's go code!</p>
            <button className="dismiss-btn" onClick={() => setShowDisclaimer(false)}>Get Started</button>
          </div>
        </div>
      )}

      {showRenameModal && (
        <div className="modal-overlay" onClick={() => setShowRenameModal(false)}>
          <div className="rename-modal" onClick={e => e.stopPropagation()}>
            <h3>Rename File</h3>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && renameFile()}
              placeholder={activeFile?.name}
              className="rename-input"
              autoFocus
            />
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowRenameModal(false)}>Cancel</button>
              <button className="save-btn" onClick={renameFile}>Rename</button>
            </div>
          </div>
        </div>
      )}

      <ShotsSelector isOpen={showShotsModal} onClose={() => setShowShotsModal(false)} currentShots={shots} onSelect={setShots} />

      <div className="mode-tabs-container">
        <div className="mode-tabs">
          <span className="mode-label">Code Lab</span>
        </div>
        <div className="header-actions">
          <button className="header-icon-btn" onClick={exportFile} title="Export file">
            <Download size={20} />
          </button>
          <button className="header-icon-btn" onClick={() => setShowDisclaimer(true)} title="Help">
            <MdOutlineHelpCenter size={24} />
          </button>
        </div>
      </div>

      <div className="file-tabs">
        {files.map(file => (
          <div key={file.id} className={`file-tab ${file.id === activeFileId ? 'active' : ''}`} onClick={() => setActiveFileId(file.id)}>
            <span className="file-name">{file.name}</span>
            <button className="rename-file-btn" onClick={(e) => { e.stopPropagation(); setActiveFileId(file.id); setNewFileName(file.name); setShowRenameModal(true); }} title="Rename">
              <AiOutlineEdit size={14} />
            </button>
            {files.length > 1 && (
              <button className="close-tab-btn" onClick={(e) => closeFile(file.id, e)} title="Close">
                <X size={14} />
              </button>
            )}
          </div>
        ))}
        <button className="add-tab-btn" onClick={createNewFile} title="New file">
          <Plus size={16} />
        </button>
      </div>

      <div className="controls-bar">
        <button className="run-btn" onClick={handleRun} disabled={isRunning}>
          <Play size={16} />
          {isRunning ? 'Running...' : 'Run'}
        </button>
        <button className="shots-btn" onClick={() => setShowShotsModal(true)}>
          <span className="shots-label">Shots:</span>
          <span className="shots-value">{shots}</span>
        </button>
        <button className="clear-btn" onClick={handleClear}>
          <Trash2 size={16} />Clear
        </button>
      </div>

      <div className="ide-content">
        <div className="code-editor-container">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={activeFile?.content}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
              scrollbar: {
                vertical: 'visible',
                horizontal: 'visible',
                useShadows: false,
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LabPage;
