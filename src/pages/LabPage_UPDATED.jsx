import React, { useState, useRef, useEffect } from 'react';
import { Play, Trash2, Plus, X, Download, Copy } from 'lucide-react';
import { AiOutlineEdit } from 'react-icons/ai';
import { MdOutlineHelpCenter } from 'react-icons/md';
import { FaChevronDown } from 'react-icons/fa';
import { RiCloseLargeFill, RiSparkling2Fill } from 'react-icons/ri';
import { IoCopyOutline } from 'react-icons/io5';
import Editor from '@monaco-editor/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell 
} from 'recharts';
import { executeQuantumCircuit, exampleCircuits } from '../utils/quantumExecutor';
import './LabPage.css';

const LabPage = () => {
  const [files, setFiles] = useState([
    { 
      id: 1, 
      name: 'bell_state.js', 
      content: exampleCircuits.bellState,
      active: true
    }
  ]);
  const [activeFileId, setActiveFileId] = useState(1);
  const [shots, setShots] = useState(1024);
  const [results, setResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showShotsModal, setShowShotsModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorStack, setErrorStack] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [activeView, setActiveView] = useState('histogram');
  const [nextFileId, setNextFileId] = useState(2);
  const [showResults, setShowResults] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  
  const editorRef = useRef(null);

  const activeFile = files.find(f => f.id === activeFileId);

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#f97316'];

  const shotsOptions = [
    { value: 100, label: '100 shots' },
    { value: 256, label: '256 shots' },
    { value: 512, label: '512 shots' },
    { value: 1024, label: '1024 shots' },
    { value: 2048, label: '2048 shots' },
    { value: 4096, label: '4096 shots' },
    { value: 8192, label: '8192 shots' }
  ];

  useEffect(() => {
    // Check if jsqubits is loaded
    const checkJsqubits = setInterval(() => {
      if (window.jsqubits || window.jsqubitsLoaded) {
        console.log('✅ jsqubits is ready');
        clearInterval(checkJsqubits);
      }
    }, 100);

    return () => clearInterval(checkJsqubits);
  }, []);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    monaco.languages.registerCompletionItemProvider('javascript', {
      provideCompletionItems: () => {
        const suggestions = [
          {
            label: 'jsqubits',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: "jsqubits('|${1:00}>')",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Create quantum state: jsqubits("|00>")'
          },
          {
            label: 'hadamard',
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: 'hadamard(${1:0})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Apply Hadamard gate'
          },
          {
            label: 'cnot',
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: 'cnot(${1:0}, ${2:1})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Apply CNOT gate'
          },
          {
            label: 'x',
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: 'x(${1:0})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Apply X (NOT) gate'
          },
          {
            label: 'measure',
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: 'measure()',
            documentation: 'Measure quantum state'
          },
        ];
        return { suggestions };
      },
    });
  };

  const handleEditorChange = (value) => {
    setFiles(files.map(f => 
      f.id === activeFileId ? { ...f, content: value } : f
    ));
  };

  const createNewFile = () => {
    const newFile = {
      id: nextFileId,
      name: `circuit_${nextFileId}.js`,
      content: exampleCircuits.bellState,
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
      const newActiveIndex = fileIndex > 0 ? fileIndex - 1 : 0;
      setActiveFileId(newFiles[newActiveIndex].id);
    }
    
    setFiles(newFiles);
  };

  const renameFile = () => {
    if (!newFileName.trim()) return;
    
    setFiles(files.map(f => 
      f.id === activeFileId ? { ...f, name: newFileName } : f
    ));
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
    setFiles(files.map(f => 
      f.id === activeFileId ? { 
        ...f, 
        content: exampleCircuits.bellState
      } : f
    ));
    setResults(null);
    setShowResults(false);
  };

  const handleRun = async () => {
    if (!activeFile) return;
    
    setIsRunning(true);
    setErrorMessage('');
    setAiResponse('');
    
    setTimeout(() => {
      try {
        const result = executeQuantumCircuit(activeFile.content, shots);
        
        if (result.success) {
          setResults({
            counts: result.counts,
            shots: result.shots,
            status: 'Complete'
          });
          setShowResults(true);
        } else {
          setErrorMessage(result.error || 'Unknown error');
          setErrorStack(result.stack || '');
          setShowErrorModal(true);
        }
      } catch (error) {
        setErrorMessage(error.message || 'Error executing circuit');
        setErrorStack(error.stack || '');
        setShowErrorModal(true);
      } finally {
        setIsRunning(false);
      }
    }, 800);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const askAI = async () => {
    setIsAiThinking(true);
    
    // Simulate AI response
    setTimeout(() => {
      const response = `// Fixed code - Bell State
let state = jsqubits('|00>');
state = state.hadamard(0).cnot(0, 1);

const counts = {};
for (let i = 0; i < shots; i++) {
  const measurement = state.measure();
  const result = measurement.result.toString(2).padStart(2, '0');
  counts[result] = (counts[result] || 0) + 1;
  state = jsqubits('|00>').hadamard(0).cnot(0, 1);
}

results.counts = counts;`;
      
      setAiResponse(response);
      setIsAiThinking(false);
    }, 2000);
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

  const getAIExplanation = () => {
    alert('AI Explanation:\n\nThis Bell state circuit creates quantum entanglement. The Hadamard gate puts qubit 0 in superposition, and the CNOT gate entangles it with qubit 1, resulting in equal probability of measuring |00⟩ or |11⟩.');
  };

  const handleConfirm = (action, callback) => {
    setConfirmAction({ message: action, callback });
    setShowConfirmModal(true);
  };

  const executeConfirm = () => {
    if (confirmAction && confirmAction.callback) {
      confirmAction.callback();
    }
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  const renderHistogram = () => {
    if (!results) return null;
    
    const data = Object.entries(results.counts).map(([state, count]) => ({
      state: `|${state}⟩`,
      count: count,
      percentage: ((count / results.shots) * 100).toFixed(1)
    }));
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis 
            dataKey="state" 
            stroke="var(--color-text)" 
            style={{ fontSize: '0.9rem', fontWeight: 600 }}
          />
          <YAxis stroke="var(--color-text)" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--color-surface)', 
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              color: 'var(--color-text)'
            }}
            formatter={(value, name, props) => [
              `${value} (${props.payload.percentage}%)`,
              'Count'
            ]}
          />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  // ... (rest of render methods - graph, table, etc. - same as before)

  return (
    <div className="quantum-ide">
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="confirm-modal" onClick={e => e.stopPropagation()}>
            <h3>Confirm Action</h3>
            <p>{confirmAction?.message}</p>
            <div className="confirm-actions">
              <button className="cancel-btn" onClick={() => setShowConfirmModal(false)}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={executeConfirm}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal - REDESIGNED */}
      {showErrorModal && (
        <div className="error-modal-overlay" onClick={() => setShowErrorModal(false)}>
          <div className="error-modal" onClick={e => e.stopPropagation()}>
            <button className="error-close-btn" onClick={() => setShowErrorModal(false)}>
              <X size={20} />
            </button>
            
            <div className="error-content">
              <h3>Execution Error</h3>
              <div className="error-message-box">
                <p className="error-text">{errorMessage}</p>
                <button 
                  className="error-copy-btn"
                  onClick={() => copyToClipboard(errorMessage + '\n\n' + errorStack)}
                  title="Copy error"
                >
                  <IoCopyOutline size={18} />
                </button>
              </div>
              
              {!aiResponse && (
                <button className="ask-ai-btn" onClick={askAI} disabled={isAiThinking}>
                  <RiSparkling2Fill size={18} />
                  {isAiThinking ? 'AI is thinking...' : 'Ask AI to fix'}
                </button>
              )}
              
              {aiResponse && (
                <div className="ai-response-box">
                  <div className="ai-response-header">
                    <span>AI Fixed Code:</span>
                    <button 
                      className="copy-ai-btn"
                      onClick={() => copyToClipboard(aiResponse)}
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                  <pre className="ai-code">{aiResponse}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Shots Modal - REDESIGNED */}
      {showShotsModal && (
        <div className="modal-overlay" onClick={() => setShowShotsModal(false)}>
          <div className="shots-modal" onClick={e => e.stopPropagation()}>
            <h3>Select Shots</h3>
            <div className="shots-options">
              {shotsOptions.map(option => (
                <label key={option.value} className="radio-option">
                  <input
                    type="radio"
                    name="shots"
                    value={option.value}
                    checked={shots === option.value}
                    onChange={() => {
                      setShots(option.value);
                      setShowShotsModal(false);
                    }}
                  />
                  <span className="radio-label">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rest of component - Header, File Tabs, Controls, Editor... */}
      {/* (Copy from previous LabPage.jsx) */}
    </div>
  );
};

export default LabPage;
