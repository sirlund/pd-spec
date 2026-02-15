/* PD-Spec Base JS — Shared rendering logic for Template+JSON outputs */

(function() {
  'use strict';

  // === JSON Data Loader ===
  function loadData() {
    const el = document.getElementById('pd-data');
    if (!el) { console.error('PD-Spec: No <script id="pd-data"> found.'); return null; }
    try { return JSON.parse(el.textContent); }
    catch(e) { console.error('PD-Spec: Invalid JSON in pd-data.', e); return null; }
  }

  // === Reference Link Converter ===
  // Converts [IG-XX] and [CF-XX] text to clickable links
  function convertRefs(container, targetBlank) {
    const target = targetBlank ? ' target="_blank"' : '';
    const selectors = '.ref-link-target, td, p, li, .callout, .implication, .open-question, .module-card, .gap-marker';
    container.querySelectorAll(selectors).forEach(function(el) {
      el.innerHTML = el.innerHTML.replace(
        /\[(IG-\d+|CF-\d+)\]/g,
        '<a href="STATUS.html#$1" class="ref-link"' + target + '>[$1]</a>'
      );
    });
  }

  // === Doc Meta Header Renderer ===
  function renderDocMeta(meta, container) {
    if (!meta) return;
    var snap = meta.snapshot || {};
    var html = '<div class="doc-meta">';
    html += '<strong>' + esc(meta.version || 'v1.0') + '</strong>';
    html += ' · Generated ' + esc(meta.generated || '—');
    html += ' · PD-Spec snapshot: ' + (snap.insights_total || 0) + ' insights';
    html += ' (' + (snap.insights_verified || 0) + ' verified)';
    html += ', ' + (snap.conflicts_pending || 0) + ' conflicts';

    if (meta.changelog && meta.changelog.length > 0) {
      html += '<details><summary>Document changelog</summary><ul>';
      meta.changelog.forEach(function(entry) {
        html += '<li><strong>' + esc(entry.version) + '</strong> (' + esc(entry.date) + '): ' + esc(entry.description) + '</li>';
      });
      html += '</ul></details>';
    }
    html += '</div>';
    container.insertAdjacentHTML('afterbegin', html);
  }

  // === Section Renderers ===
  var renderers = {
    text: function(section) {
      var html = '<h2>' + esc(section.heading) + '</h2>';
      html += '<div class="ref-link-target">' + renderContent(section.content) + '</div>';
      html += renderRefs(section.refs);
      return html;
    },

    callout: function(section) {
      var html = '<div class="callout"><p>';
      if (section.heading) html += '<strong>' + esc(section.heading) + ':</strong> ';
      html += esc(section.content);
      if (section.refs && section.refs.length) html += ' <span class="insight-ref">' + section.refs.map(function(r){ return '['+r+']'; }).join(', ') + '</span>';
      html += '</p></div>';
      return html;
    },

    table: function(section) {
      var html = '<h2>' + esc(section.heading) + '</h2>';
      html += '<table><thead><tr>';
      (section.headers || []).forEach(function(h) { html += '<th>' + esc(h) + '</th>'; });
      html += '</tr></thead><tbody>';
      (section.rows || []).forEach(function(row) {
        html += '<tr>';
        row.forEach(function(cell) { html += '<td>' + esc(cell) + '</td>'; });
        html += '</tr>';
      });
      html += '</tbody></table>';
      html += renderRefs(section.refs);
      return html;
    },

    'module-list': function(section) {
      var html = '<h2>' + esc(section.heading) + '</h2>';
      (section.items || []).forEach(function(mod) {
        html += '<div class="module-card">';
        html += '<h4>' + esc(mod.name);
        if (mod.status) html += ' <span class="badge badge-' + esc(mod.status.toLowerCase()) + '">' + esc(mod.status) + '</span>';
        html += '</h4>';
        if (mod.refs && mod.refs.length) html += '<div class="module-status ref-link-target">Refs: ' + mod.refs.map(function(r){ return '['+r+']'; }).join(', ') + '</div>';
        if (mod.implications && mod.implications.length) {
          mod.implications.forEach(function(imp) {
            html += '<div class="implication">• ' + esc(imp.text);
            if (imp.ref) html += ' [' + imp.ref + ']';
            html += '</div>';
          });
        }
        html += '</div>';
      });
      return html;
    },

    'open-questions': function(section) {
      var html = '<h2>' + esc(section.heading) + '</h2>';
      if (section.items) {
        section.items.forEach(function(q) {
          html += '<div class="open-question">• ' + esc(typeof q === 'string' ? q : q.text || '') + '</div>';
        });
      } else if (section.content) {
        html += '<div class="ref-link-target">' + renderContent(section.content) + '</div>';
      }
      html += renderRefs(section.refs);
      return html;
    },

    gap: function(section) {
      var html = '<h2>' + esc(section.heading) + '</h2>';
      html += '<div class="gap-marker">[GAP — no source backing, inferred from context]</div>';
      if (section.content) html += '<div class="ref-link-target">' + renderContent(section.content) + '</div>';
      return html;
    }
  };

  // === Helpers ===
  function esc(str) {
    if (typeof str !== 'string') return '';
    var el = document.createElement('span');
    el.textContent = str;
    return el.innerHTML;
  }

  function renderContent(content) {
    if (!content) return '';
    // Split paragraphs on double newlines
    return content.split(/\n\n+/).map(function(p) {
      return '<p>' + esc(p.trim()) + '</p>';
    }).join('');
  }

  function renderRefs(refs) {
    if (!refs || !refs.length) return '';
    return '<p class="insight-ref ref-link-target">Sources: ' + refs.map(function(r){ return '['+r+']'; }).join(', ') + '</p>';
  }

  // === Main Render Function ===
  function renderSections(data, container, options) {
    options = options || {};
    if (!data || !data.sections) return;

    data.sections.forEach(function(section) {
      var renderer = renderers[section.type] || renderers.text;
      container.insertAdjacentHTML('beforeend', renderer(section));
    });

    convertRefs(container, options.targetBlank || false);
  }

  // === Public API ===
  window.PDSpec = {
    loadData: loadData,
    renderDocMeta: renderDocMeta,
    renderSections: renderSections,
    convertRefs: convertRefs,
    renderers: renderers,
    esc: esc
  };
})();
