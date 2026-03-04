import { X, Copy, Sparkles } from 'lucide-react';
import { copyWithFeedback } from '../../utils/copyToClipboard';
import './ExplainModal.css';

const ExplainModal = ({ isOpen, onClose, results, code, onExplainFurther }) => {
  if (!isOpen) return null;

  const generateExplanation = () => {
    let explanation = [];

    explanation.push({
      title: 'Circuit Analysis',
      content: 'Your quantum circuit has been executed successfully.'
    });

    if (code.includes('hadamard')) {
      explanation.push({
        title: 'Hadamard Gates',
        content: 'Creates superposition - puts qubits in a state where they are simultaneously 0 and 1.'
      });
    }

    if (code.includes('cnot')) {
      explanation.push({
        title: 'CNOT Gates',
        content: 'Creates entanglement - links qubits so measuring one instantly affects the other.'
      });
    }

    if (code.includes('.x(')) {
      explanation.push({
        title: 'X Gates',
        content: 'Bit flip operation - flips |0> to |1> and vice versa.'
      });
    }

    if (code.includes('toffoli')) {
      explanation.push({
        title: 'Toffoli Gates',
        content: 'Controlled-controlled-NOT - flips target qubit only if both control qubits are |1>.'
      });
    }

    explanation.push({
      title: 'Results',
      content: Object.entries(results.counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([state, count]) =>
          `|${state}>: ${((count/results.shots)*100).toFixed(1)}% (${count} measurements)`
        )
        .join('\n')
    });

    return explanation;
  };

  const sections = generateExplanation();

  const buildCopyText = () => {
    return sections.map(s => s.title + ':\n' + s.content).join('\n\n');
  };

  const handleCopy = () => {
    copyWithFeedback(buildCopyText(), 'Copied!');
  };

  const handleExplainFurther = () => {
    onClose();
    if (onExplainFurther) {
      onExplainFurther(buildCopyText());
    }
  };

  return (
    <div className="explain-modal-overlay" onClick={onClose}>
      <div className="explain-modal" onClick={e => e.stopPropagation()}>

        <div className="explain-modal-header">
          <h3>Circuit Explanation</h3>
          <div className="explain-header-actions">
            <button className="explain-icon-btn" onClick={handleCopy} title="Copy results">
              <Copy size={18} />
            </button>
            <button className="explain-close-btn" onClick={onClose} title="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="explain-modal-body">
          {sections.map((section, index) => (
            <div key={index} className="explain-section">
              <h4>{section.title}</h4>
              <p>{section.content}</p>
            </div>
          ))}
        </div>



      </div>
    </div>
  );
};

export default ExplainModal;
