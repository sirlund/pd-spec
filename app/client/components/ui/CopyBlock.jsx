import React, { useState } from 'react';
import Icon from './Icon.jsx';

export default function CopyBlock({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard may not be available */ }
  };

  return (
    <div className="copy-block">
      <button className="copy-btn" onClick={handleCopy}>
        <Icon name={copied ? 'check' : 'clipboard'} size={14} />
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <pre>{text}</pre>
    </div>
  );
}
