/**
 * drawing-board.js
 * A reusable writing board component supporting HanziWriter (guided) 
 * and freehand canvas drawing with palm rejection.
 */

window.DrawingBoard = (() => {
    let state = {
        mode: 'guided', // 'guided' or 'freehand'
        penOnly: false,
        strokeWidth: 4,
        showOutline: true,
        hanzi: '',
        hw: null,
        canvas: null,
        ctx: null,
        isDrawing: false,
        lastPos: null,
        container: null,
        writerTarget: null,
        theme: 'light'
    };

    function init(containerId, hanzi) {
        state.container = document.getElementById(containerId);
        if (!state.container) return;

        state.hanzi = hanzi;
        state.theme = document.documentElement.getAttribute('data-theme') || 'light';
        state.strokeColor = state.theme === 'dark' ? '#e8e4df' : '#2C3E50';
        state.outlineColor = state.theme === 'dark' ? '#333333' : '#EAEAEA';

        // Clear container
        state.container.innerHTML = '';
        state.container.style.position = 'relative';
        state.container.style.display = 'flex';
        state.container.style.flexDirection = 'column';

        // Create UI Toolbar
        const toolbar = document.createElement('div');
        toolbar.className = 'db-toolbar';
        toolbar.style = 'display:flex; gap:8px; padding:8px; border-bottom:1px solid var(--border); flex-wrap:wrap; align-items:center; background:var(--card-bg); font-size:0.8rem';
        toolbar.innerHTML = `
            <div class="db-group" style="display:flex; background:var(--off-white); border-radius:6px; padding:2px">
                <button class="db-btn ${state.mode === 'guided' ? 'active' : ''}" data-mode="guided" style="padding:4px 8px; border:none; border-radius:4px; cursor:pointer; font-size:0.75rem; background:${state.mode === 'guided' ? 'var(--red)' : 'transparent'}; color:${state.mode === 'guided' ? '#fff' : 'var(--text-2)'}">Guided</button>
                <button class="db-btn ${state.mode === 'freehand' ? 'active' : ''}" data-mode="freehand" style="padding:4px 8px; border:none; border-radius:4px; cursor:pointer; font-size:0.75rem; background:${state.mode === 'freehand' ? 'var(--red)' : 'transparent'}; color:${state.mode === 'freehand' ? '#fff' : 'var(--text-2)'}">Freehand</button>
            </div>
            
            <div class="db-separator" style="width:1px; height:16px; background:var(--border)"></div>

            <div class="db-control" id="db-width-control" style="display:${state.mode === 'freehand' ? 'flex' : 'none'}; align-items:center; gap:4px">
                <span style="color:var(--text-3)">Width:</span>
                <input type="range" min="1" max="20" value="${state.strokeWidth}" id="db-stroke-width" style="width:60px; height:4px; cursor:pointer">
                <span id="db-width-val" style="min-width:14px">${state.strokeWidth}</span>
            </div>

            <div class="db-control" style="display:flex; align-items:center; gap:6px; cursor:pointer" title="Only detect pen/stylus input">
                <input type="checkbox" id="db-pen-only" ${state.penOnly ? 'checked' : ''}>
                <label for="db-pen-only" style="cursor:pointer; user-select:none; color:var(--text-2)">Pen Only</label>
            </div>

            <div class="db-control" id="db-outline-control" style="display:${state.mode === 'freehand' ? 'flex' : 'none'}; align-items:center; gap:6px; cursor:pointer">
                <input type="checkbox" id="db-show-outline" ${state.showOutline ? 'checked' : ''}>
                <label for="db-show-outline" style="cursor:pointer; user-select:none; color:var(--text-2)">Outline</label>
            </div>

            <div style="margin-left:auto; display:flex; gap:8px">
                <button class="btn btn-ghost btn-sm" id="db-animate" style="padding:2px 8px">Animate</button>
                <button class="btn btn-ghost btn-sm" id="db-reset" style="padding:2px 8px">Reset 🔄</button>
            </div>
        `;
        state.container.appendChild(toolbar);

        // Create Canvas Wrapper
        const wrapper = document.createElement('div');
        wrapper.style = 'position:relative; flex:1; width:100%; display:flex; align-items:center; justify-content:center; touch-action:none';
        state.container.appendChild(wrapper);

        // Create HanziWriter Target
        const hwTarget = document.createElement('div');
        hwTarget.id = 'db-hw-target';
        hwTarget.style = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center;';
        wrapper.appendChild(hwTarget);
        state.writerTarget = hwTarget;

        // Create Freehand Canvas
        const canvas = document.createElement('canvas');
        canvas.id = 'db-freehand-canvas';
        canvas.style = 'position:absolute; inset:0; width:100%; height:100%; cursor:crosshair;';
        canvas.style.display = state.mode === 'freehand' ? 'block' : 'none';
        wrapper.appendChild(canvas);
        state.canvas = canvas;
        state.ctx = canvas.getContext('2d');

        // Initialize HanziWriter
        initHanziWriter();

        // Wire up events
        toolbar.querySelectorAll('.db-btn').forEach(btn => {
            btn.onclick = () => setMode(btn.dataset.mode);
        });
        toolbar.querySelector('#db-stroke-width').oninput = (e) => {
            state.strokeWidth = e.target.value;
            document.getElementById('db-width-val').textContent = state.strokeWidth;
        };
        toolbar.querySelector('#db-pen-only').onchange = (e) => {
            state.penOnly = e.target.checked;
        };
        toolbar.querySelector('#db-show-outline').onchange = (e) => {
            state.showOutline = e.target.checked;
            updateHWVisibility();
        };
        toolbar.querySelector('#db-animate').onclick = () => animate();
        toolbar.querySelector('#db-reset').onclick = () => reset();

        // Canvas events
        canvas.onpointerdown = handlePointerDown;
        canvas.onpointermove = handlePointerMove;
        canvas.onpointerup = handlePointerUp;
        canvas.onpointercancel = handlePointerUp;

        // Resize observer
        const ro = new ResizeObserver(() => {
            resizeCanvas();
            if (state.hw) initHanziWriter();
        });
        ro.observe(wrapper);

        setTimeout(resizeCanvas, 10);
    }

    function initHanziWriter() {
        if (typeof HanziWriter === 'undefined') return;
        state.writerTarget.innerHTML = '';
        
        const rect = state.writerTarget.getBoundingClientRect();
        const size = Math.min(rect.width, rect.height) - 20;
        
        state.hw = HanziWriter.create('db-hw-target', state.hanzi, {
            width: size > 0 ? size : 280,
            height: size > 0 ? size : 280,
            padding: 10,
            showCharacter: false,
            showOutline: state.showOutline,
            strokeAnimationSpeed: 1.5,
            delayBetweenStrokes: 50,
            strokeColor: state.strokeColor,
            outlineColor: state.outlineColor,
            highlightColor: '#C0392B',
            drawingWidth: 15
        });

        if (state.mode === 'guided') {
            state.hw.quiz();
        } else {
            updateHWVisibility();
        }
    }

    function resizeCanvas() {
        if (!state.canvas) return;
        const rect = state.canvas.getBoundingClientRect();
        state.canvas.width = rect.width;
        state.canvas.height = rect.height;
        clearFreehand();
    }

    function setMode(mode) {
        state.mode = mode;
        const btns = state.container.querySelectorAll('.db-btn');
        btns.forEach(b => {
            const isActive = b.dataset.mode === mode;
            b.style.background = isActive ? 'var(--red)' : 'transparent';
            b.style.color = isActive ? '#fff' : 'var(--text-2)';
        });

        document.getElementById('db-width-control').style.display = mode === 'freehand' ? 'flex' : 'none';
        document.getElementById('db-outline-control').style.display = mode === 'freehand' ? 'flex' : 'none';
        state.canvas.style.display = mode === 'freehand' ? 'block' : 'none';
        
        if (mode === 'guided') {
            state.hw.showOutline();
            state.hw.quiz();
        } else {
            state.hw.cancelQuiz();
            updateHWVisibility();
        }
    }

    function updateHWVisibility() {
        if (!state.hw) return;
        if (state.mode === 'guided') {
            state.hw.showOutline();
        } else {
            if (state.showOutline) state.hw.showOutline();
            else state.hw.hideOutline();
        }
    }

    function animate() {
        if (state.hw) {
            state.hw.cancelAnimation();
            state.hw.animateCharacter();
        }
    }

    function reset() {
        clearFreehand();
        initHanziWriter();
    }

    function clearFreehand() {
        if (!state.ctx) return;
        state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
    }

    function handlePointerDown(e) {
        if (state.penOnly && e.pointerType !== 'pen') return;
        state.isDrawing = true;
        state.lastPos = getPos(e);
        state.ctx.beginPath();
        state.ctx.moveTo(state.lastPos.x, state.lastPos.y);
        state.canvas.setPointerCapture(e.pointerId);
    }

    function handlePointerMove(e) {
        if (!state.isDrawing) return;
        if (state.penOnly && e.pointerType !== 'pen') return;
        
        const currentPos = getPos(e);
        state.ctx.lineWidth = state.strokeWidth;
        state.ctx.lineCap = 'round';
        state.ctx.lineJoin = 'round';
        state.ctx.strokeStyle = state.strokeColor;
        
        state.ctx.lineTo(currentPos.x, currentPos.y);
        state.ctx.stroke();
        state.lastPos = currentPos;
    }

    function handlePointerUp(e) {
        state.isDrawing = false;
        state.canvas.releasePointerCapture(e.pointerId);
    }

    function getPos(e) {
        const rect = state.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    return {
        init,
        reset,
        animate,
        setMode,
        setPenOnly: (v) => { state.penOnly = v; },
        setPenWidth: (v) => { state.strokeWidth = v; }
    };
})();
