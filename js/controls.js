/**
 * Political Constellation — UI Controls
 *
 * Generates the accordion control panel from ISSUE_DEFINITIONS
 * and wires slider events back to the visualization.
 *
 * Public API (via window.Controls):
 *   build(panelEl, definitions, issues)   — inject accordion HTML
 *   initLabels(definitions, issues)       — set initial label text
 */
(function (global) {
  'use strict';

  // ── Public: build ──────────────────────────────────────
  /**
   * Generate the issue accordion inside the given panel element.
   * Appends after any existing children (e.g. the panel-header).
   */
  function build(panelEl, definitions, issues) {
    definitions.forEach(function (def) {
      var item = document.createElement('div');
      item.className = 'issue-item';
      item.setAttribute('data-issue', def.key);

      item.innerHTML =
        '<div class="issue-header">' +
          '<span class="issue-name">' + def.name + '</span>' +
          '<span class="issue-expand">\u25BC</span>' +
        '</div>' +
        '<div class="issue-controls">' +
          '<div class="issue-controls-inner">' +
            sliderBlock('Position', def.key, 'position', 'position',
                        def.leftLabel, def.rightLabel) +
            sliderBlock('Authority Level', def.key, 'authority', 'authority',
                        'Individual', 'Federal') +
            sliderBlock('Commitment Level', def.key, 'commitment', '',
                        'Undecided', 'Strongly Held') +
            sliderBlock('Priority', def.key, 'priority', '',
                        'Low', 'Critical') +
          '</div>' +
        '</div>';

      // Accordion toggle
      item.querySelector('.issue-header').addEventListener('click', function () {
        item.classList.toggle('expanded');
      });

      // Slider change handlers
      var sliders = item.querySelectorAll('input[type="range"]');
      sliders.forEach(function (slider) {
        slider.addEventListener('input', function () {
          var param = slider.getAttribute('data-param');
          issues[def.key][param] = parseInt(slider.value, 10);
          updateLabels(def.key, issues);
          Constellation.updateShape(def.key);
        });
      });

      panelEl.appendChild(item);
    });
  }

  // ── Public: initLabels ─────────────────────────────────
  function initLabels(definitions, issues) {
    definitions.forEach(function (def) {
      updateLabels(def.key, issues);
    });
  }

  // ── Internal helpers ───────────────────────────────────

  /** Generate the HTML for a single slider row. */
  function sliderBlock(label, key, param, extraClass, leftText, rightText) {
    var cls = 'dimension-slider' + (extraClass ? ' ' + extraClass : '');
    return (
      '<div class="dimension-control">' +
        '<label class="dimension-label">' + label + '</label>' +
        '<input type="range" min="0" max="100" value="50"' +
        ' class="' + cls + '"' +
        ' data-issue="' + key + '" data-param="' + param + '">' +
        '<div class="slider-labels">' +
          '<span>' + leftText + '</span>' +
          '<span>' + rightText + '</span>' +
        '</div>' +
        '<div class="slider-value" id="' + key + '-' + param + '-val"></div>' +
      '</div>'
    );
  }

  /** Refresh the text labels beneath each slider for one issue. */
  function updateLabels(key, issues) {
    var d = issues[key];

    setText(key + '-position-val',
      d.position < 35 ? 'Left' : d.position > 65 ? 'Right' : 'Center');

    setText(key + '-authority-val',
      d.authority < 33 ? 'Individual' : d.authority < 67 ? 'State' : 'Federal');

    setText(key + '-commitment-val',
      d.commitment < 35 ? 'Undecided' : d.commitment > 65 ? 'Strong' : 'Moderate');

    setText(key + '-priority-val',
      d.priority < 35 ? 'Low' : d.priority > 65 ? 'Critical' : 'Medium');
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  // ── Expose ─────────────────────────────────────────────
  global.Controls = {
    build:      build,
    initLabels: initLabels
  };

})(window);
