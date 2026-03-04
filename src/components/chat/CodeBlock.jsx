import React, { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { IoCopyOutline } from 'react-icons/io5';
import { copyWithFeedback } from '../../utils/copyToClipboard';
import './CodeBlock.css';

const CodeBlock = ({ code, language = 'javascript' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyWithFeedback(code, 'Code copied!');
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Detect language from code if not specified
  const detectLanguage = (code) => {
    if (code.includes('import ') || code.includes('const ') || code.includes('let ')) {
      return 'javascript';
    }
    if (code.includes('def ') || code.includes('import ') || code.includes('print(')) {
      return 'python';
    }
    if (code.includes('public class') || code.includes('public static')) {
      return 'java';
    }
    if (code.includes('#include') || code.includes('int main')) {
      return 'cpp';
    }
    if (code.includes('<!DOCTYPE') || code.includes('<html')) {
      return 'html';
    }
    return 'javascript';
  };

  const detectedLang = detectLanguage(code);

  return (
    <div className="code-block-container">
      <div className="code-block-header">
        <span className="code-language">{detectedLang}</span>
        <button className="code-copy-btn" onClick={handleCopy}>
          <IoCopyOutline size={16} />
          {copied && <span className="copied-label">Copied!</span>}
        </button>
      </div>
      <div className="code-editor-wrapper">
        <Editor
          height="auto"
          defaultLanguage={detectedLang}
          value={code}
          theme="vs-dark"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            fontSize: 13,
            wordWrap: 'on',
            automaticLayout: true,
            scrollbar: {
              vertical: 'hidden',
              horizontal: 'hidden',
            },
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            overviewRulerBorder: false,
            folding: false,
            glyphMargin: false,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 3,
            renderLineHighlight: 'none',
            contextmenu: false,
          }}
          onMount={(editor) => {
            // Auto-adjust height based on content
            const lineCount = editor.getModel()?.getLineCount() || 1;
            const lineHeight = 19;
            const height = Math.min(lineCount * lineHeight + 10, 400);
            editor.layout({ width: editor.getLayoutInfo().width, height });
          }}
        />
      </div>
    </div>
  );
};

export default CodeBlock;
