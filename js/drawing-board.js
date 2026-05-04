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
        window.addEventListener('resize', resizeCanvas);
        
        // Initial visibility
        setMode(state.mode);
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
        if (state.mode !== 'freehand') return;
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
