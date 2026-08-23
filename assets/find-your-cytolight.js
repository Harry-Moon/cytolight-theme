(function () {
  'use strict';

  const root = document.querySelector('[data-fyc]');
  if (!root) return;

  const steps = Array.from(root.querySelectorAll('[data-fyc-step]'));
  const dots = Array.from(root.querySelectorAll('[data-fyc-dot]'));
  const backBtn = root.querySelector('[data-fyc-back]');
  const stepCount = root.querySelector('[data-fyc-stepcount]');
  const startBtn = root.querySelector('[data-fyc-start]');
  const retakeBtn = root.querySelector('[data-fyc-retake]');
  const resultCards = Array.from(root.querySelectorAll('[data-fyc-product]'));
  const resultStepIndex = steps.findIndex((s) => s.dataset.fycKind === 'result');
  const PRIORITY = [
    'cytolight-desk',
    'cytolight-pano-ultra',
    'cytolight-sauna-dome',
    'cytolight-cap',
    'cytolight-mask',
    'cytolight-knee',
    'cytolight-foot'
  ];

  let current = 0;
  let scores = {};

  const announce = () => {
    if (stepCount) {
      stepCount.textContent = 'Step ' + (current + 1) + ' of ' + steps.length;
    }
  };

  const render = () => {
    steps.forEach((step, i) => step.classList.toggle('is-active', i === current));
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === current);
      dot.classList.toggle('is-done', i < current);
    });
    if (backBtn) backBtn.classList.toggle('is-visible', current > 0);
    announce();
  };

  const goTo = (index) => {
    current = Math.max(0, Math.min(steps.length - 1, index));
    if (current === resultStepIndex) showResult();
    render();
  };

  const showResult = () => {
    let winner = PRIORITY[0];
    let best = -1;
    PRIORITY.forEach((handle) => {
      const val = scores[handle] || 0;
      if (val > best) {
        best = val;
        winner = handle;
      }
    });
    resultCards.forEach((card) => {
      card.hidden = card.dataset.fycProduct !== winner;
    });
  };

  const addScores = (json) => {
    let parsed = {};
    try {
      parsed = JSON.parse(json || '{}');
    } catch (e) {
      parsed = {};
    }
    Object.keys(parsed).forEach((handle) => {
      scores[handle] = (scores[handle] || 0) + parsed[handle];
    });
  };

  const reset = () => {
    scores = {};
    root.querySelectorAll('.fyc-option.is-selected').forEach((el) => el.classList.remove('is-selected'));
    goTo(0);
  };

  if (startBtn) {
    startBtn.addEventListener('click', () => goTo(current + 1));
  }

  root.querySelectorAll('[data-fyc-option]').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.parentElement.querySelectorAll('.fyc-option').forEach((el) => el.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      addScores(btn.dataset.scores);
      window.setTimeout(() => goTo(current + 1), 220);
    });
  });

  if (backBtn) {
    backBtn.addEventListener('click', () => goTo(current - 1));
  }

  if (retakeBtn) {
    retakeBtn.addEventListener('click', reset);
  }

  render();
})();
