/**
 * drawing-board.js
 * A non-intrusive controller for HanziWriter and a freehand canvas.
 */

window.DrawingBoard = (() => {
    let state = {
        mode: 'guided', // 'guided' or 'freehand'
        penOnly: false,
        strokeWidth: 4,
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

    function init(writerTargetId, canvasId, hanzi) {
        state.writerTarget = document.getElementById(writerTargetId);
        state.canvas = document.getElementById(canvasId);
        if (!state.writerTarget || !state.canvas) return;

        state.hanzi = hanzi;
        state.theme = document.documentElement.getAttribute('data-theme') || 'light';
        state.strokeColor = state.theme === 'dark' ? '#e8e4df' : '#2C3E50';
        state.outlineColor = state.theme === 'dark' ? '#333333' : '#EAEAEA';

        state.ctx = state.canvas.getContext('2d');
        
        // Ensure canvas is correctly sized
        resizeCanvas();

        // Initialize HanziWriter
        initHanziWriter();

        // Canvas events
        state.canvas.onpointerdown = handlePointerDown;
        state.canvas.onpointermove = handlePointerMove;
        state.canvas.onpointerup = handlePointerUp;
        state.canvas.onpointercancel = handlePointerUp;

        // Auto-resize handling
        window.removeEventListener('resize', resizeCanvas);
        window.addEventListener('resize', resizeCanvas);
        
        // Synchronize UI
        syncUI();
        
        // Initial visibility
        setMode(state.mode);
    }

    function syncUI() {
        const modeSelects = document.querySelectorAll('select[onchange*="DrawingBoard.setMode"]');
        modeSelects.forEach(s => s.value = state.mode);

        const penControls = [document.getElementById('pen-controls'), document.getElementById('app-pen-controls')];
        penControls.forEach(c => {
            if (c) c.style.display = state.mode === 'freehand' ? 'flex' : 'none';
        });

        const penOnlyChecks = document.querySelectorAll('input[onchange*="DrawingBoard.setPenOnly"]');
        penOnlyChecks.forEach(c => c.checked = state.penOnly);

        const widthSliders = document.querySelectorAll('input[oninput*="DrawingBoard.setPenWidth"]');
        widthSliders.forEach(s => s.value = state.strokeWidth);
    }

    function initHanziWriter() {
        if (typeof HanziWriter === 'undefined' || !state.writerTarget) return;
        state.writerTarget.innerHTML = '';
        
        const rect = state.writerTarget.getBoundingClientRect();
        const size = Math.min(rect.width, rect.height) - 20;
        
        state.hw = HanziWriter.create(state.writerTarget.id, state.hanzi, {
            width: size > 0 ? size : 280,
            height: size > 0 ? size : 280,
            padding: 10,
            showCharacter: false,
            showOutline: true,
            strokeAnimationSpeed: 1.5,
            delayBetweenStrokes: 50,
            strokeColor: state.strokeColor,
            outlineColor: state.outlineColor,
            highlightColor: '#C0392B',
            drawingWidth: 15
        });

        if (state.mode === 'guided') {
            state.hw.quiz();
        }
    }

    function resizeCanvas() {
        if (!state.canvas) return;
        const rect = state.canvas.parentElement.getBoundingClientRect();
        state.canvas.width = rect.width;
        state.canvas.height = rect.height;
        // Redrawing on resize is tricky, so we just clear for now
        clearFreehand();
    }

    function setMode(mode) {
        state.mode = mode;
        if (!state.canvas) return;

        if (mode === 'guided') {
            state.canvas.style.display = 'none';
            if (state.hw) {
                state.hw.showOutline();
                state.hw.quiz();
            }
        } else {
            state.canvas.style.display = 'block';
            if (state.hw) {
                state.hw.cancelQuiz();
            }
        }
        syncUI();
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

    let frameId = null;
    let points = [];

    function handlePointerDown(e) {
        if (state.mode !== 'freehand') return;
        if (state.penOnly && e.pointerType !== 'pen') return;
        state.isDrawing = true;
        state.lastPos = getPos(e);
        state.canvas.setPointerCapture(e.pointerId);
        
        points = [state.lastPos];
        
        state.ctx.beginPath();
        state.ctx.lineCap = 'round';
        state.ctx.lineJoin = 'round';
        state.ctx.strokeStyle = state.strokeColor;
        state.ctx.lineWidth = state.strokeWidth;
        state.ctx.moveTo(state.lastPos.x, state.lastPos.y);

        if (!frameId) {
            frameId = requestAnimationFrame(drawFrame);
        }
    }

    function handlePointerMove(e) {
        if (!state.isDrawing) return;
        if (state.penOnly && e.pointerType !== 'pen') return;
        
        // Use coalesced events for higher fidelity if available
        const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
        for (const ev of events) {
            points.push(getPos(ev));
        }
    }

    function drawFrame() {
        if (points.length > 1) {
            state.ctx.beginPath();
            state.ctx.lineWidth = state.strokeWidth;
            state.ctx.lineCap = 'round';
            state.ctx.lineJoin = 'round';
            state.ctx.strokeStyle = state.strokeColor;
            
            state.ctx.moveTo(state.lastPos.x, state.lastPos.y);
            
            for (let i = 1; i < points.length; i++) {
                state.ctx.lineTo(points[i].x, points[i].y);
                state.lastPos = points[i];
            }
            state.ctx.stroke();
            points = [state.lastPos];
        }
        
        if (state.isDrawing) {
            frameId = requestAnimationFrame(drawFrame);
        } else {
            frameId = null;
        }
    }

    function handlePointerUp(e) {
        if (state.isDrawing) {
            // Draw any remaining points
            const currentPos = getPos(e);
            points.push(currentPos);
            drawFrame();
        }
        state.isDrawing = false;
        if (state.canvas && e.pointerId) {
            try { state.canvas.releasePointerCapture(e.pointerId); } catch(err) {}
        }
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
        setPenWidth: (v) => { state.strokeWidth = parseInt(v); },
        getState: () => state
    };
})();
