/* ═══════════════════════════════════════════════════════════════
   vocabulary.js — Vocabulary Module with Interactive Drawing Pad
   ═══════════════════════════════════════════════════════════════ */

'use strict';

window.VocabularyModule = (() => {

  let vocabState = {
    category: 'all',
    showPinyin: true,
    showEnglish: true,
    search: '',
  };

  let drawingPad = null;

  function getUniqueVocab() {
    if (!App.state.vocabulary) return [];
    const uniqueMap = new Map();
    
    App.state.vocabulary.forEach(set => {
      set.words.forEach(w => {
        if (!uniqueMap.has(w.word)) {
          // Merge with character library metadata if available
          const charMeta = App.state.characters.find(c => c.hanzi === w.word || c.traditional === w.word);
          uniqueMap.set(w.word, {
            ...w,
            category: charMeta?.category || 'general',
            examples: w.example_words || charMeta?.example_words || [],
            sentence: w.example_sentence || charMeta?.example_sentence || null
          });
        }
      });
    });
    return Array.from(uniqueMap.values());
  }

  function render(container) {
    const allVocab = getUniqueVocab();
    const categories = ['all', ...new Set(allVocab.map(v => v.category).filter(Boolean))].sort();

    container.innerHTML = `
      <div class="page-header">
        <h2>Vocabulary Library</h2>
        <p>Master all ${allVocab.length} words with definitions, context, and interactive writing practice.</p>
      </div>

      <div class="library-controls mb-24">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" class="input" id="vocab-search" placeholder="Search words or meanings..." value="${vocabState.search}">
        </div>
        
        <select class="input" id="vocab-cat-select" style="width:auto">
          ${categories.map(c => `<option value="${c}" ${vocabState.category === c ? 'selected' : ''}>${c.charAt(0).toUpperCase() + c.slice(1)}</option>`).join('')}
        </select>

        <div class="flex gap-8">
          <button class="btn ${vocabState.showPinyin ? 'btn-primary' : 'btn-ghost'} btn-sm" onclick="VocabularyModule.toggleAnnotation('pinyin')">Pinyin</button>
          <button class="btn ${vocabState.showEnglish ? 'btn-primary' : 'btn-ghost'} btn-sm" onclick="VocabularyModule.toggleAnnotation('english')">English</button>
        </div>
      </div>

      <div class="vocab-grid" id="vocab-grid"></div>
    `;

    // Wire up search
    let searchTimeout;
    document.getElementById('vocab-search')?.addEventListener('input', e => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        vocabState.search = e.target.value.toLowerCase();
        updateGrid();
      }, 300);
    });

    document.getElementById('vocab-cat-select')?.addEventListener('change', e => {
      vocabState.category = e.target.value;
      updateGrid();
    });

    updateGrid();
  }

  function updateGrid() {
    const grid = document.getElementById('vocab-grid');
    if (!grid) return;

    let filtered = getUniqueVocab();
    if (vocabState.category !== 'all') {
      filtered = filtered.filter(v => v.category === vocabState.category);
    }
    if (vocabState.search) {
      filtered = filtered.filter(v => 
        v.word.includes(vocabState.search) || 
        v.definition.toLowerCase().includes(vocabState.search) ||
        v.pinyin.toLowerCase().includes(vocabState.search)
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = `<div class="empty-state" style="grid-column: 1/-1"><h3>No matching vocabulary</h3></div>`;
      return;
    }

    grid.innerHTML = filtered.map(v => `
      <div class="vocab-card animate-fade-in" onclick="VocabularyModule.showDetail('${v.word.replace(/'/g, "\\'")}')">
        <div class="vocab-info" style="padding:24px 12px">
          <div class="vocab-hanzi" style="font-size:2.5rem; margin-bottom:8px">${v.word}</div>
          <div class="vocab-py ${vocabState.showPinyin ? '' : 'hidden'}" style="font-size:1rem">${v.pinyin}</div>
          <div class="vocab-def ${vocabState.showEnglish ? '' : 'hidden'}">${v.definition}</div>
        </div>
      </div>
    `).join('');
  }

  let drawState = { penOnly: false, strokeWidth: 6 };
  let hw = null;
  let currentWordChars = [];
  let currentCharIndex = 0;

  function showDetail(wordStr) {
    const vocab = getUniqueVocab().find(v => v.word === wordStr);
    if (!vocab) return;

    currentWordChars = Array.from(vocab.word).filter(c => /[\u4e00-\u9fa5]/.test(c));
    currentCharIndex = 0;

    const modal = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    
    // Ensure modal is wide enough for the 2-column layout
    content.style.maxWidth = '800px';

    content.innerHTML = `
      <div class="vocab-detail-modal">
        <button class="modal-close" onclick="VocabularyModule.closeModal()">✕</button>
        
        <div class="vd-layout">
          <!-- Left: Context & Explanation -->
          <div class="vd-left" style="text-align:left">
            <div class="vd-word-header" onclick="TTS.speak('${vocab.word}')" style="cursor:pointer; display:inline-block; margin-bottom:16px">
              <div class="vd-hanzi" style="text-align:left; line-height:1">${vocab.word}</div>
              <div style="display:flex; align-items:center; gap:8px; margin-top:8px">
                <span class="vd-pinyin tone-colors" style="margin-top:0">${Pinyin.colorize(vocab.pinyin)}</span>
                <span class="vd-audio-icon">🔊</span>
              </div>
            </div>

            <div class="vd-section">
              <h4>Meaning</h4>
              <p class="vd-definition">${vocab.definition}</p>
            </div>

            ${vocab.sentence ? `
              <div class="vd-section">
                <h4>Context Example</h4>
                <div class="sentence-block">
                  <div class="sb-zh">${vocab.sentence.sentence}</div>
                  <div class="sb-py">${vocab.sentence.pinyin}</div>
                  <div class="sb-en">${vocab.sentence.english}</div>
                </div>
              </div>
            ` : ''}

            ${vocab.examples && vocab.examples.length > 0 ? `
              <div class="vd-section">
                <h4>Related Words</h4>
                <div class="vd-examples-list">
                  ${vocab.examples.map(ex => `
                    <div class="vd-ex-item">
                      <span class="ex-zh">${ex.word}</span>
                      <span class="ex-py">${ex.pinyin}</span>
                      <span class="ex-def">${ex.def}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Right: Interactive Drawing Canvas -->
          <div class="vd-right" style="display:flex; flex-direction:column;">
            <div class="vd-section" style="flex:1; display:flex; flex-direction:column; margin-bottom:0">
              
              ${currentWordChars.length > 1 ? `
              <div style="display:flex; gap:8px; margin-bottom:12px; justify-content:center">
                ${currentWordChars.map((c, i) => `
                  <button class="btn btn-sm ${i === 0 ? 'btn-primary' : 'btn-outline'} char-select-btn" onclick="VocabularyModule.selectCanvasChar(${i}, this)">${c}</button>
                `).join('')}
              </div>
              ` : ''}

              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:8px">
                <div class="flex items-center gap-8 text-small">
                  <span class="text-muted">Practice writing the character</span>
                </div>
              </div>
              <div class="canvas-container" style="flex:1; min-height:300px; background:var(--off-white); border:2px dashed var(--border); border-radius:var(--radius); position:relative; overflow:hidden; touch-action:none;">
                <div id="vocab-drawing-board" style="width:100%; height:100%;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    // Close on backdrop click
    modal.onclick = (e) => {
      if (e.target === modal) VocabularyModule.closeModal();
    };

    // Initialize Drawing Board after rendering
    setTimeout(() => {
        const char = currentWordChars[currentCharIndex];
        DrawingBoard.init('vocab-drawing-board', char);
    }, 50);
  }

  return {
    drawState,
    render,
    toggleAnnotation(type) {
      if (type === 'pinyin') vocabState.showPinyin = !vocabState.showPinyin;
      if (type === 'english') vocabState.showEnglish = !vocabState.showEnglish;
      const container = document.getElementById('page-content');
      this.render(container);
    },
    showDetail,
    selectCanvasChar(idx, btn) {
      document.querySelectorAll('.char-select-btn').forEach(b => b.classList.replace('btn-primary', 'btn-outline'));
      btn.classList.replace('btn-outline', 'btn-primary');
      currentCharIndex = idx;
      const char = currentWordChars[currentCharIndex];
      DrawingBoard.init('vocab-drawing-board', char);
    },
    animateStrokes() {
      DrawingBoard.animate();
    },
    clearCanvas() {
      DrawingBoard.reset();
    },
    closeModal() {
      document.getElementById('modal-overlay').classList.add('hidden');
      const content = document.getElementById('modal-content');
      content.style.maxWidth = ''; // Reset inline style
    }
  };

})();
