import React, { useState } from 'react';
import Card from './ui/Card.jsx';
import CopyBlock from './ui/CopyBlock.jsx';
import AccentBox from './ui/AccentBox.jsx';
import Icon from './ui/Icon.jsx';

const CONFIDENCE_LEVELS = ['high', 'medium', 'low', 'hunch'];

export default function AddContextView({ projectName }) {
  const [topic, setTopic] = useState('');
  const [observation, setObservation] = useState('');
  const [confidence, setConfidence] = useState('medium');
  const [trigger, setTrigger] = useState('');
  const [generated, setGenerated] = useState(null);

  const canGenerate = topic.trim() && observation.trim();

  const generate = () => {
    const lines = [
      `I'm adding a field observation to the ${projectName || 'project'} research base.`,
      '',
      `**Topic:** ${topic.trim()}`,
      `**Observation:** ${observation.trim()}`,
      `**Confidence:** ${confidence}`,
    ];
    if (trigger.trim()) {
      lines.push(`**Trigger:** ${trigger.trim()}`);
    }
    lines.push('');
    lines.push('Please:');
    lines.push('1. Create a field note in 01_Sources/ with this observation');
    lines.push('2. Run /extract on the new file');
    lines.push('3. Run /analyze to integrate with existing insights');
    lines.push('4. Report what insights were affected or created');

    setGenerated(lines.join('\n'));
  };

  return (
    <div style={{ maxWidth: 700 }}>
      <div className="section-header">
        <h1 className="section-title">Add Context</h1>
      </div>

      <AccentBox>
        Capture observations from field research, meetings, or spontaneous insights.
        This generates a prompt you paste into your PD-Spec agent session.
      </AccentBox>

      <Card style={{ marginTop: 16 }}>
        <div className="form-group">
          <label className="form-label">Topic</label>
          <input
            className="form-input"
            placeholder="e.g., User onboarding, Data migration..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Observation</label>
          <textarea
            className="context-textarea"
            style={{ minHeight: 100 }}
            placeholder="What did you observe, hear, or realize?"
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Confidence</label>
          <div className="confidence-group">
            {CONFIDENCE_LEVELS.map(level => (
              <button
                key={level}
                className={`confidence-btn ${confidence === level ? 'active' : ''}`}
                onClick={() => setConfidence(level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Trigger (optional)</label>
          <input
            className="form-input"
            placeholder="What prompted this observation?"
            value={trigger}
            onChange={(e) => setTrigger(e.target.value)}
          />
        </div>

        <button
          className={`btn ${canGenerate ? 'btn-accent' : ''}`}
          onClick={generate}
          disabled={!canGenerate}
          style={!canGenerate ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
        >
          <Icon name="send" size={14} />
          Generate Prompt
        </button>
      </Card>

      {generated && (
        <div style={{ marginTop: 16 }}>
          <div className="label-mono" style={{ marginBottom: 8 }}>Copy and paste into your agent session</div>
          <CopyBlock text={generated} />
        </div>
      )}
    </div>
  );
}
