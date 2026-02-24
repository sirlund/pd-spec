import React, { useState } from 'react';
import Card from './ui/Card.jsx';
import CopyBlock from './ui/CopyBlock.jsx';
import AccentBox from './ui/AccentBox.jsx';
import Icon from './ui/Icon.jsx';

export default function ActionsView({ insightDecisions, conflictDecisions, decisionCount }) {
  const [generated, setGenerated] = useState(null);

  const approvals = Object.entries(insightDecisions).filter(([, d]) => d === 'approve').map(([id]) => id);
  const rejections = Object.entries(insightDecisions).filter(([, d]) => d === 'reject').map(([id]) => id);
  const conflictActions = Object.entries(conflictDecisions);

  const generate = () => {
    const lines = ['/resolve with these inputs:'];
    lines.push('');

    if (approvals.length > 0) {
      lines.push(`**Approve these insights:** ${approvals.join(', ')}`);
      lines.push('Update their status from PENDING to VERIFIED.');
      lines.push('');
    }

    if (rejections.length > 0) {
      lines.push(`**Reject these insights:** ${rejections.join(', ')}`);
      lines.push('Update their status to INVALIDATED with reason: "Rejected during review."');
      lines.push('');
    }

    if (conflictActions.length > 0) {
      lines.push('**Conflict decisions:**');
      for (const [id, decision] of conflictActions) {
        if (decision.type === 'flag') {
          lines.push(`- ${id}: Flag for team discussion`);
        } else if (decision.type === 'research') {
          lines.push(`- ${id}: Needs more research before resolution`);
        } else if (decision.type === 'context') {
          lines.push(`- ${id}: Additional context: "${decision.text || '(no text provided)'}"`);
        }
      }
      lines.push('');
    }

    lines.push('After processing, update SYSTEM_MAP.md with any new verified insights.');

    setGenerated(lines.join('\n'));
  };

  return (
    <div style={{ maxWidth: 700 }}>
      <div className="section-header">
        <h1 className="section-title">Actions</h1>
      </div>

      <AccentBox>
        Generate a <code>/resolve</code> prompt from your accumulated decisions.
        This captures insight approvals, rejections, and conflict resolutions into
        a single prompt you paste into your agent session.
      </AccentBox>

      <Card style={{ marginTop: 16 }}>
        <div className="label-mono" style={{ marginBottom: 10 }}>Decision Summary</div>

        {decisionCount === 0 ? (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            No decisions yet. Go to <strong>Insights</strong> to approve/reject, or <strong>Conflicts</strong> to choose options.
          </p>
        ) : (
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {approvals.length > 0 && (
              <div style={{ marginBottom: 6 }}>
                <span style={{ color: 'var(--verified-fg)' }}>{approvals.length} approved:</span>{' '}
                {approvals.join(', ')}
              </div>
            )}
            {rejections.length > 0 && (
              <div style={{ marginBottom: 6 }}>
                <span style={{ color: 'var(--conflict-fg)' }}>{rejections.length} rejected:</span>{' '}
                {rejections.join(', ')}
              </div>
            )}
            {conflictActions.length > 0 && (
              <div style={{ marginBottom: 6 }}>
                <span style={{ color: 'var(--accent-cyan)' }}>{conflictActions.length} conflict decision{conflictActions.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          <button
            className={`btn ${decisionCount > 0 ? 'btn-accent' : ''}`}
            onClick={generate}
            disabled={decisionCount === 0}
            style={decisionCount === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          >
            <Icon name="send" size={14} />
            Generate /resolve Prompt
          </button>
        </div>
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
