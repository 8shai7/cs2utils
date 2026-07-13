// A hover magnifier ("loupe") for the crosshair preview canvas. Because the
// preview draws the crosshair at its real in-game pixel size, small details
// (1px lines, gaps, dots, outlines) can be hard to see — this zooms into the
// area under the cursor with nearest-neighbour scaling so every pixel is crisp.

const LENS = 132; // lens diameter in CSS pixels

/**
 * @param {object} opts
 * @param {HTMLCanvasElement} opts.source  the preview canvas to magnify
 * @param {HTMLElement} opts.stage         positioned container the lens lives in
 * @param {HTMLElement} opts.toggleBtn     button that turns the magnifier on/off
 * @param {HTMLSelectElement} [opts.zoomSelect] optional zoom-level <select>
 */
export function initMagnifier({ source, stage, toggleBtn, zoomSelect }) {
  const lens = document.createElement('canvas');
  lens.className = 'magnifier-lens hidden';
  lens.width = LENS;
  lens.height = LENS;
  stage.appendChild(lens);
  const lctx = lens.getContext('2d');

  let enabled = false;
  let zoom = Number(zoomSelect?.value) || 4;
  let last = null; // { sx, sy } in source-canvas pixels

  function setEnabled(on) {
    enabled = on;
    toggleBtn.classList.toggle('active', on);
    toggleBtn.setAttribute('aria-pressed', String(on));
    stage.classList.toggle('magnifier-on', on);
    if (!on) {
      lens.classList.add('hidden');
      last = null;
    }
  }

  function draw() {
    if (!enabled || !last || !lctx) return;
    const srcSize = LENS / zoom;
    lctx.imageSmoothingEnabled = false;
    lctx.clearRect(0, 0, LENS, LENS);
    lctx.fillStyle = '#0e1017';
    lctx.fillRect(0, 0, LENS, LENS);
    try {
      lctx.drawImage(source, last.sx - srcSize / 2, last.sy - srcSize / 2, srcSize, srcSize, 0, 0, LENS, LENS);
    } catch {
      /* drawImage can throw if the source has zero size mid-layout */
    }
    // Center reticle so the exact pixel under the cursor is obvious.
    lctx.strokeStyle = 'rgba(255,255,255,0.28)';
    lctx.lineWidth = 1;
    lctx.beginPath();
    lctx.moveTo(LENS / 2 + 0.5, 0);
    lctx.lineTo(LENS / 2 + 0.5, LENS);
    lctx.moveTo(0, LENS / 2 + 0.5);
    lctx.lineTo(LENS, LENS / 2 + 0.5);
    lctx.stroke();
  }

  function point(clientX, clientY) {
    if (!enabled) return;
    const rect = source.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      lens.classList.add('hidden');
      return;
    }
    last = { sx: x * (source.width / rect.width), sy: y * (source.height / rect.height) };
    const stageRect = stage.getBoundingClientRect();
    lens.style.left = `${clientX - stageRect.left - LENS / 2}px`;
    lens.style.top = `${clientY - stageRect.top - LENS / 2}px`;
    lens.classList.remove('hidden');
    draw();
  }

  source.addEventListener('mousemove', (e) => point(e.clientX, e.clientY));
  source.addEventListener('mouseleave', () => {
    if (enabled) lens.classList.add('hidden');
  });
  // Touch support: drag a finger across the preview to magnify on mobile.
  const onTouch = (e) => {
    if (!enabled || !e.touches[0]) return;
    e.preventDefault();
    point(e.touches[0].clientX, e.touches[0].clientY);
  };
  source.addEventListener('touchstart', onTouch, { passive: false });
  source.addEventListener('touchmove', onTouch, { passive: false });
  toggleBtn.addEventListener('click', () => setEnabled(!enabled));
  if (zoomSelect) {
    zoomSelect.addEventListener('change', () => {
      zoom = Number(zoomSelect.value) || 4;
      draw();
    });
  }

  // refresh() lets the caller re-draw the lens after the preview changes so the
  // magnified view stays live even when the cursor is stationary.
  return { refresh: draw, setEnabled };
}
