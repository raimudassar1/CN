/* ═══════════════════════════════════════════════════════════════
   quiz.js — Pronunciation & Vocabulary Quiz Modules
   ═══════════════════════════════════════════════════════════════ */

'use strict';

const QuizModule = (() => {

  // ── Shared Quiz State ────────────────────────────────────────
  let quizState = {
    mode: 'A',
    band: 'a2',
    level: '',
    category: '',
    questionCount: 20,
    questions: [],
    current: 0,
    score: 0,
    wrong: [],
    answered: false,
    timer: null,
    startTime: 0,
  };

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function pickDistractors(correctChar, allChars, field, count = 3) {
    const correctVal = correctChar[field];
    const pool = allChars.filter(c => c.hanzi !== correctChar.hanzi && c[field] !== correctVal);
    return shuffle(pool).slice(0, count);
  }

  function getPool(level, category) {
    let pool = App.state.characters;
    if (level && level !== 'all') pool = pool.filter(c => c.level === level);
    if (category) pool = pool.filter(c => c.category === category);
    return pool;
  }

  function getCategories() {
    return [...new Set(App.state.characters.map(c => c.category).filter(Boolean))].sort();
  }

  // ── Pronunciation Quiz ───────────────────────────────────────
  function buildPronunciationQuestions(mode, pool, count) {
    const questions = [];
    const selected = shuffle(pool).slice(0, count);

    selected.forEach(char => {
      if (mode === 'A') {
        const distractors = pickDistractors(char, pool, 'pinyin', 3);
        if (distractors.length < 3) return;
        const options = shuffle([char, ...distractors]);
        questions.push({
          type: 'pinyin-choice',
          question_hanzi: char.traditional || char.hanzi,
          question_label: 'Choose the correct pinyin:',
          correct: char,
          options: options.map(o => ({
            hanzi: o.traditional || o.hanzi,
            pinyin: o.pinyin,
            zhuyin: o.zhuyin,
            isCorrect: o.hanzi === char.hanzi,
          })),
          display: 'pinyin',
        });
      } else if (mode === 'B') {
        const toneNum = Pinyin.getTone(char.pinyin);
        if (!toneNum || toneNum === 5) return;
        questions.push({
          type: 'tone-choice',
          question_hanzi: char.traditional || char.hanzi,
          question_label: 'Choose the correct tone:',
          correct_tone: toneNum,
          correct: char,
          options: [1,2,3,4].map(t => ({
            label: `${t}${t===1?' (flat)':t===2?' (rising)':t===3?' (falling-rising)':' (falling)'}`,
            tone: t,
            isCorrect: t === toneNum,
          })),
          display: 'tone',
        });
      } else if (mode === 'C') {
        const distractors = pickDistractors(char, pool, 'hanzi', 3);
        if (distractors.length < 3) return;
        const options = shuffle([char, ...distractors]);
        questions.push({
          type: 'hanzi-from-pinyin',
          question_pinyin: char.pinyin,
          question_label: 'Choose the correct character:',
          correct: char,
          options: options.map(o => ({
            hanzi: o.traditional || o.hanzi,
            pinyin: o.pinyin,
            definition: o.definition,
            isCorrect: o.hanzi === char.hanzi,
          })),
          display: 'hanzi',
        });
      } else if (mode === 'D') {
        const distractors = pickDistractors(char, pool, 'hanzi', 3);
        if (distractors.length < 3) return;
        const options = shuffle([char, ...distractors]);
        questions.push({
          type: 'audio-hanzi',
          question_label: 'Listen and choose the correct character:',
          audio_text: char.traditional || char.hanzi,
          correct: char,
          options: options.map(o => ({
            hanzi: o.traditional || o.hanzi,
            pinyin: o.pinyin,
            isCorrect: o.hanzi === char.hanzi,
          })),
          display: 'hanzi',
        });
      } else if (mode === 'E') {
        if (!char.zhuyin || !char.pinyin) return;
        const distractors = pickDistractors(char, pool, 'pinyin', 3).filter(d => d.zhuyin);
        if (distractors.length < 3) return;
        const options = shuffle([char, ...distractors]);
        questions.push({
          type: 'zhuyin-to-pinyin',
          question_zhuyin: char.zhuyin,
          question_label: 'Choose the correct pinyin for this Zhuyin:',
          correct: char,
          options: options.map(o => ({
            pinyin: o.pinyin,
            zhuyin: o.zhuyin,
            isCorrect: o.hanzi === char.hanzi,
          })),
          display: 'pinyin',
        });
      }
    });

    return questions;
  }

  async function renderPronunciation(container) {
    const categories = getCategories();

    container.innerHTML = `
      <div class="page-header">
        <h2>Pronunciation Quiz</h2>
        <p>Master pinyin tones and hanzi recognition across 5 quiz modes.</p>
      </div>

      <div id="quiz-setup" class="card mb-20" style="max-width:600px">
        <h3 style="margin-bottom:16px;font-size:1rem">Configure Quiz</h3>

        <div style="margin-bottom:14px">
          <div class="text-small text-muted mb-8">Quiz Mode</div>
          <div class="tab-switcher" style="flex-wrap:wrap;gap:4px;background:none;padding:0">
            ${[
              {v:'A', label:'A — Pinyin Recognition'},
              {v:'B', label:'B — Tone ID'},
              {v:'C', label:'C — Hanzi from Pinyin'},
              {v:'D', label:'D — Audio Mode'},
              {v:'E', label:'E — Zhuyin Mode'},
            ].map(m => `
              <button class="tab-btn ${quizState.mode===m.v?'active':''}"
                onclick="this.closest('.tab-switcher').querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));this.classList.add('active');quizPronMode='${m.v}'"
                style="flex:none;background:var(--off-white);border:1px solid var(--border)">${m.label}</button>`).join('')}
          </div>
        </div>

        <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:14px">
          <div>
            <div class="text-small text-muted mb-8">Level</div>
            <!-- FIX: id was "qp-level" in HTML but JS read "qp-band" — now unified as qp-level -->
            <select class="input" id="qp-level" style="width:auto">
              <option value="all">All Levels</option>
              <option value="novice">Novice</option>
              <option value="a1">A1</option>
              <option value="a2">A2</option>
              <option value="b1">B1</option>
            </select>
          </div>
          <div>
            <div class="text-small text-muted mb-8">Category</div>
            <select class="input" id="qp-category" style="width:auto">
              <option value="">All</option>
              ${categories.map(c => `<option value="${c}">${c.charAt(0).toUpperCase()+c.slice(1)}</option>`).join('')}
            </select>
          </div>
          <div>
            <div class="text-small text-muted mb-8">Questions</div>
            <select class="input" id="qp-count" style="width:auto">
              <option value="10">10</option>
              <option value="20" selected>20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
        <button class="btn btn-primary" id="qp-start">Start Quiz →</button>
      </div>

      <div id="quiz-area" style="display:none;max-width:600px"></div>
    `;

    window.quizPronMode = quizState.mode;

    document.getElementById('qp-start')?.addEventListener('click', () => {
      quizState.mode = window.quizPronMode || 'A';
      // FIX: was reading 'qp-band' which doesn't exist → now reads 'qp-level'
      quizState.level = document.getElementById('qp-level').value;
      quizState.category = document.getElementById('qp-category').value;
      quizState.questionCount = parseInt(document.getElementById('qp-count').value);

      const pool = getPool(quizState.level, quizState.category);
      if (pool.length < 4) { alert('Not enough characters for this filter. Try a broader selection.'); return; }

      quizState.questions = buildPronunciationQuestions(quizState.mode, pool, quizState.questionCount);
      if (!quizState.questions.length) { alert('Could not generate questions. Try mode A, C, or D with more characters.'); return; }

      quizState.current = 0;
      quizState.score = 0;
      quizState.wrong = [];
      quizState.startTime = Date.now();
      quizState.answered = false;

      document.getElementById('quiz-setup').style.display = 'none';
      document.getElementById('quiz-area').style.display = 'block';
      showPronunciationQuestion();
    });
  }

  function showPronunciationQuestion() {
    const area = document.getElementById('quiz-area');
    if (!area) return;

    const q = quizState.questions[quizState.current];
    if (!q) { showQuizResults('quiz-area', 'pronunciation'); return; }

    const progress = `${quizState.current + 1} / ${quizState.questions.length}`;
    const pct = Math.round((quizState.current / quizState.questions.length) * 100);

    let questionHTML = '';
    if (q.type === 'pinyin-choice') {
      questionHTML = `<div class="hanzi-xl" style="margin-bottom:8px">${q.question_hanzi}</div>`;
    } else if (q.type === 'tone-choice') {
      questionHTML = `<div class="hanzi-xl" style="margin-bottom:8px">${q.question_hanzi}</div>
        <div class="text-muted" style="margin-top:4px">What tone is this character?</div>`;
    } else if (q.type === 'hanzi-from-pinyin') {
      questionHTML = `<div style="font-size:2.5rem;font-weight:700;color:var(--tone1);font-family:var(--font-pinyin)">${q.question_pinyin}</div>`;
    } else if (q.type === 'audio-hanzi') {
      questionHTML = `
        <button class="play-btn-large" id="q-play-btn" onclick="TTS.speak('${q.audio_text}')">▶</button>
        <div class="text-muted">Click play to hear the character</div>`;
    } else if (q.type === 'zhuyin-to-pinyin') {
      questionHTML = `<div style="font-size:2.5rem;font-family:var(--font-zh);letter-spacing:4px">${q.question_zhuyin}</div>`;
    }

    let optionsHTML = '';
    if (q.type === 'tone-choice') {
      optionsHTML = q.options.map((opt, i) => `
        <button class="quiz-option" data-correct="${opt.isCorrect}" onclick="handlePronAnswer(this, ${i})">
          ${opt.label}
        </button>`).join('');
    } else if (q.type === 'hanzi-from-pinyin' || q.type === 'audio-hanzi') {
      optionsHTML = q.options.map((opt, i) => `
        <button class="quiz-option" data-correct="${opt.isCorrect}" onclick="handlePronAnswer(this, ${i})">
          <span class="qo-hanzi">${opt.hanzi}</span>
          <span class="qo-pinyin">${opt.pinyin || ''}</span>
        </button>`).join('');
    } else if (q.type === 'zhuyin-to-pinyin') {
      optionsHTML = q.options.map((opt, i) => `
        <button class="quiz-option" data-correct="${opt.isCorrect}" onclick="handlePronAnswer(this, ${i})">
          <div style="font-size:1.1rem;font-weight:600">${opt.pinyin}</div>
          <div style="font-size:0.8rem;color:var(--text-3);font-family:var(--font-zh)">${opt.zhuyin}</div>
        </button>`).join('');
    } else {
      optionsHTML = q.options.map((opt, i) => `
        <button class="quiz-option" data-correct="${opt.isCorrect}" onclick="handlePronAnswer(this, ${i})">
          <span style="font-size:1.1rem;font-weight:600;color:var(--tone${Pinyin.getTone(opt.pinyin)||1})">${opt.pinyin}</span>
        </button>`).join('');
    }

    area.innerHTML = `
      <div class="quiz-header">
        <div class="progress-bar" style="flex:1"><div class="progress-fill" style="width:${pct}%"></div></div>
        <span class="text-small text-muted">${progress}</span>
        <span class="badge badge-a2">${quizState.score} ✓</span>
      </div>

      <div class="quiz-question-card">
        <div class="text-small text-muted mb-8">${q.question_label}</div>
        ${questionHTML}
      </div>

      <div class="quiz-options">${optionsHTML}</div>

      <div class="quiz-feedback" id="quiz-feedback"></div>

      <div style="display:flex;justify-content:flex-end;margin-top:12px">
        <button class="btn btn-primary hidden" id="q-next-btn" onclick="nextPronQuestion()">Next →</button>
      </div>
    `;

    quizState.answered = false;

    if (q.type === 'audio-hanzi') {
      setTimeout(() => TTS.speak(q.audio_text), 500);
    }
  }

  window.handlePronAnswer = function(btn, idx) {
    if (quizState.answered) return;
    quizState.answered = true;

    const q = quizState.questions[quizState.current];
    const isCorrect = btn.dataset.correct === 'true';

    document.querySelectorAll('.quiz-option').forEach(b => {
      b.disabled = true;
      if (b.dataset.correct === 'true') b.classList.add('correct');
    });
    if (!isCorrect) btn.classList.add('wrong');

    const feedback = document.getElementById('quiz-feedback');
    if (isCorrect) {
      quizState.score++;
      App.unmarkWeak(q.correct.hanzi);
      feedback.className = 'quiz-feedback correct show';
      feedback.innerHTML = `✓ Correct! <strong>${q.correct.traditional || q.correct.hanzi}</strong> — ${Pinyin.colorize(q.correct.pinyin)} — ${q.correct.definition}`;
    } else {
      App.markWeak(q.correct.hanzi);
      quizState.wrong.push(q.correct);
      feedback.className = 'quiz-feedback wrong show';
      feedback.innerHTML = `✗ Incorrect. <strong>${q.correct.traditional || q.correct.hanzi}</strong> — ${Pinyin.colorize(q.correct.pinyin)} — ${q.correct.zhuyin || ''} — ${q.correct.definition}`;
    }

    feedback.innerHTML += `<button class="btn btn-sm btn-ghost" style="margin-left:8px" onclick="TTS.speak('${q.correct.traditional || q.correct.hanzi}')">🔊</button>`;

    document.getElementById('q-next-btn')?.classList.remove('hidden');
  };

  window.nextPronQuestion = function() {
    quizState.current++;
    if (quizState.current >= quizState.questions.length) {
      showQuizResults('quiz-area', 'pronunciation');
    } else {
      showPronunciationQuestion();
    }
  };

  // ── Vocabulary Quiz ──────────────────────────────────────────
  function buildVocabQuestions(submode, pool, count) {
    const questions = [];
    const selected = shuffle(pool).slice(0, count);

    selected.forEach(char => {
      if (submode === 'hanzi-to-def') {
        const distractors = pickDistractors(char, pool, 'definition', 3);
        if (distractors.length < 3) return;
        questions.push({
          type: 'hanzi-to-def',
          question_label: 'What does this character mean?',
          question_hanzi: char.traditional || char.hanzi,
          question_pinyin: char.pinyin,
          correct: char,
          options: shuffle([char, ...distractors]).map(o => ({
            definition: o.definition,
            isCorrect: o.hanzi === char.hanzi,
          })),
        });
      } else if (submode === 'def-to-hanzi') {
        const distractors = pickDistractors(char, pool, 'hanzi', 3);
        if (distractors.length < 3) return;
        questions.push({
          type: 'def-to-hanzi',
          question_label: 'Choose the character for this meaning:',
          question_def: char.definition,
          correct: char,
          options: shuffle([char, ...distractors]).map(o => ({
            hanzi: o.traditional || o.hanzi,
            pinyin: o.pinyin,
            isCorrect: o.hanzi === char.hanzi,
          })),
        });
      } else if (submode === 'pinyin-to-hanzi') {
        const distractors = pickDistractors(char, pool, 'hanzi', 3);
        if (distractors.length < 3) return;
        questions.push({
          type: 'pinyin-to-hanzi',
          question_label: 'Choose the character for this pinyin:',
          question_pinyin: char.pinyin,
          correct: char,
          options: shuffle([char, ...distractors]).map(o => ({
            hanzi: o.traditional || o.hanzi,
            pinyin: o.pinyin,
            definition: o.definition,
            isCorrect: o.hanzi === char.hanzi,
          })),
        });
      } else if (submode === 'cloze') {
        const sentence = char.example_sentence;
        if (!sentence || !sentence.sentence) return;
        const blanked = sentence.sentence.replace(char.traditional || char.hanzi, '___');
        const distractors = pickDistractors(char, pool, 'hanzi', 3);
        if (distractors.length < 3) return;
        questions.push({
          type: 'cloze',
          question_label: 'Fill in the blank:',
          sentence: blanked,
          sentence_pinyin: sentence.pinyin,
          english: sentence.english,
          correct: char,
          options: shuffle([char, ...distractors]).map(o => ({
            hanzi: o.traditional || o.hanzi,
            pinyin: o.pinyin,
            isCorrect: o.hanzi === char.hanzi,
          })),
        });
      }
    });

    return questions;
  }

  async function renderVocabulary(container) {
    const categories = getCategories();

    container.innerHTML = `
      <div class="page-header">
        <h2>Vocabulary Quiz</h2>
        <p>Test character meanings, pinyin recognition, and sentence comprehension.</p>
      </div>

      <div id="vquiz-setup" class="card mb-20" style="max-width:600px">
        <h3 style="margin-bottom:16px;font-size:1rem">Configure Quiz</h3>
        <div style="margin-bottom:14px">
          <div class="text-small text-muted mb-8">Quiz Type</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${[
              {v:'hanzi-to-def', label:'Meaning'},
              {v:'def-to-hanzi', label:'Hanzi'},
              {v:'pinyin-to-hanzi', label:'Pinyin→Hanzi'},
              {v:'cloze', label:'Fill in Blank'},
            ].map(m => `
              <button class="tab-btn ${m.v==='hanzi-to-def'?'active':''}"
                style="flex:none;background:var(--off-white);border:1px solid var(--border)"
                onclick="this.parentElement.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));this.classList.add('active');vocabSubmode='${m.v}'"
                >${m.label}</button>`).join('')}
          </div>
        </div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:14px">
          <div>
            <div class="text-small text-muted mb-8">Level</div>
            <!-- FIX: HTML had "vq-band" but JS was reading "vq-level" → unified as vq-level -->
            <select class="input" id="vq-level" style="width:auto">
              <option value="all">All Levels</option>
              <option value="novice">Novice</option>
              <option value="a1">A1</option>
              <option value="a2" selected>A2</option>
              <option value="b1">B1</option>
            </select>
          </div>
          <div>
            <div class="text-small text-muted mb-8">Category</div>
            <select class="input" id="vq-category" style="width:auto">
              <option value="">All</option>
              ${categories.map(c => `<option value="${c}">${c.charAt(0).toUpperCase()+c.slice(1)}</option>`).join('')}
            </select>
          </div>
          <div>
            <div class="text-small text-muted mb-8">Questions</div>
            <select class="input" id="vq-count" style="width:auto">
              <option value="10">10</option>
              <option value="20" selected>20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
        <button class="btn btn-primary" id="vq-start">Start Quiz →</button>
      </div>

      <div id="vquiz-area" style="display:none;max-width:600px"></div>
    `;

    window.vocabSubmode = 'hanzi-to-def';

    document.getElementById('vq-start')?.addEventListener('click', () => {
      // FIX: was reading 'vq-level' which matched nothing (HTML had 'vq-band') → now both are 'vq-level'
      quizState.level = document.getElementById('vq-level').value;
      quizState.category = document.getElementById('vq-category').value;
      quizState.questionCount = parseInt(document.getElementById('vq-count').value);

      const pool = getPool(quizState.level, quizState.category);
      if (pool.length < 4) { alert('Not enough characters for this filter.'); return; }

      quizState.questions = buildVocabQuestions(window.vocabSubmode, pool, quizState.questionCount);
      if (!quizState.questions.length) { alert('Could not build questions. Try Meaning or Hanzi mode.'); return; }

      quizState.current = 0;
      quizState.score = 0;
      quizState.wrong = [];
      quizState.startTime = Date.now();
      quizState.answered = false;

      document.getElementById('vquiz-setup').style.display = 'none';
      document.getElementById('vquiz-area').style.display = 'block';
      showVocabQuestion();
    });
  }

  function showVocabQuestion() {
    const area = document.getElementById('vquiz-area');
    if (!area) return;

    const q = quizState.questions[quizState.current];
    if (!q) { showQuizResults('vquiz-area', 'vocabulary'); return; }

    const progress = `${quizState.current + 1} / ${quizState.questions.length}`;
    const pct = Math.round((quizState.current / quizState.questions.length) * 100);

    let questionHTML = '';
    if (q.type === 'hanzi-to-def') {
      questionHTML = `
        <div class="hanzi-xl mb-8">${q.question_hanzi}</div>
        <div>${Pinyin.colorize(q.question_pinyin || '')}</div>
        <button class="btn btn-sm btn-ghost mt-8" onclick="TTS.speak('${q.question_hanzi}')">🔊</button>`;
    } else if (q.type === 'def-to-hanzi') {
      questionHTML = `<div style="font-size:1.2rem;font-weight:500;max-width:400px">"${q.question_def}"</div>`;
    } else if (q.type === 'pinyin-to-hanzi') {
      questionHTML = `<div style="font-size:2rem;font-weight:700;font-family:var(--font-pinyin);color:var(--tone1)">${q.question_pinyin}</div>`;
    } else if (q.type === 'cloze') {
      questionHTML = `
        <div class="hanzi-sm mb-8" style="font-family:var(--font-zh);line-height:1.6">${q.sentence}</div>
        <div class="text-small text-muted">${q.sentence_pinyin || ''}</div>
        <div class="text-small" style="font-style:italic;color:var(--text-3)">${q.english || ''}</div>`;
    }

    let optionsHTML = '';
    if (q.type === 'hanzi-to-def') {
      optionsHTML = q.options.map((opt, i) => `
        <button class="quiz-option" data-correct="${opt.isCorrect}" onclick="handleVocabAnswer(this)">
          ${opt.definition}
        </button>`).join('');
    } else if (q.type === 'def-to-hanzi' || q.type === 'cloze') {
      optionsHTML = q.options.map((opt, i) => `
        <button class="quiz-option" data-correct="${opt.isCorrect}" onclick="handleVocabAnswer(this)">
          <span class="qo-hanzi">${opt.hanzi}</span>
          <span class="qo-pinyin">${opt.pinyin || ''}</span>
        </button>`).join('');
    } else if (q.type === 'pinyin-to-hanzi') {
      optionsHTML = q.options.map((opt, i) => `
        <button class="quiz-option" data-correct="${opt.isCorrect}" onclick="handleVocabAnswer(this)">
          <span class="qo-hanzi">${opt.hanzi}</span>
          <span class="qo-pinyin">${opt.pinyin || ''}</span>
        </button>`).join('');
    }

    area.innerHTML = `
      <div class="quiz-header">
        <div class="progress-bar" style="flex:1"><div class="progress-fill" style="width:${pct}%"></div></div>
        <span class="text-small text-muted">${progress}</span>
        <span class="badge badge-a2">${quizState.score} ✓</span>
      </div>

      <div class="quiz-question-card">
        <div class="text-small text-muted mb-8">${q.question_label}</div>
        ${questionHTML}
      </div>

      <div class="quiz-options">${optionsHTML}</div>
      <div class="quiz-feedback" id="quiz-feedback"></div>
      <div style="display:flex;justify-content:flex-end;margin-top:12px">
        <button class="btn btn-primary hidden" id="q-next-btn" onclick="nextVocabQuestion()">Next →</button>
      </div>
    `;

    quizState.answered = false;
  }

  window.handleVocabAnswer = function(btn) {
    if (quizState.answered) return;
    quizState.answered = true;

    const q = quizState.questions[quizState.current];
    const isCorrect = btn.dataset.correct === 'true';

    document.querySelectorAll('.quiz-option').forEach(b => {
      b.disabled = true;
      if (b.dataset.correct === 'true') b.classList.add('correct');
    });
    if (!isCorrect) btn.classList.add('wrong');

    const feedback = document.getElementById('quiz-feedback');
    if (isCorrect) {
      quizState.score++;
      App.unmarkWeak(q.correct.hanzi);
      feedback.className = 'quiz-feedback correct show';
      feedback.innerHTML = `✓ Correct! <strong>${q.correct.traditional || q.correct.hanzi}</strong> — ${Pinyin.colorize(q.correct.pinyin || '')} — ${q.correct.definition}`;
    } else {
      App.markWeak(q.correct.hanzi);
      quizState.wrong.push(q.correct);
      feedback.className = 'quiz-feedback wrong show';
      feedback.innerHTML = `✗ Incorrect. <strong>${q.correct.traditional || q.correct.hanzi}</strong> — ${Pinyin.colorize(q.correct.pinyin || '')} — ${q.correct.definition}`;
    }

    feedback.innerHTML += `<button class="btn btn-sm btn-ghost" style="margin-left:8px" onclick="TTS.speak('${q.correct.traditional||q.correct.hanzi}')">🔊</button>`;
    document.getElementById('q-next-btn')?.classList.remove('hidden');
  };

  window.nextVocabQuestion = function() {
    quizState.current++;
    if (quizState.current >= quizState.questions.length) {
      showQuizResults('vquiz-area', 'vocabulary');
    } else {
      showVocabQuestion();
    }
  };

  // ── Shared Results Screen ────────────────────────────────────
  function showQuizResults(areaId, quizType) {
    const area = document.getElementById(areaId);
    if (!area) return;

    const elapsed = Math.round((Date.now() - quizState.startTime) / 1000);
    const total = quizState.questions.length;
    const pct = total > 0 ? Math.round((quizState.score / total) * 100) : 0;

    let band = 'Keep Practicing';
    let bandColor = 'var(--tone4)';
    if (pct >= 90) { band = 'Excellent! 🏆'; bandColor = 'var(--tone2)'; }
    else if (pct >= 75) { band = 'Good Job! 👍'; bandColor = 'var(--tone2)'; }
    else if (pct >= 60) { band = 'Getting There 📈'; bandColor = 'var(--tone3)'; }

    const historyEntry = {
      type: quizType,
      date: new Date().toISOString(),
      score: quizState.score,
      total,
      pct,
    };
    App.state.progress.quizHistory = [historyEntry, ...(App.state.progress.quizHistory || [])].slice(0, 50);
    App.saveProgress();
    App.logActivity('🎯', `${quizType} quiz: ${quizState.score}/${total} (${pct}%)`);

    const wrongReview = quizState.wrong.length ? `
      <div style="margin-top:24px;text-align:left">
        <h4 style="margin-bottom:12px;font-size:0.85rem;text-transform:uppercase;letter-spacing:1px;color:var(--text-3)">Review Wrong Answers</h4>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${quizState.wrong.map(c => `
            <div class="sentence-block" style="display:flex;align-items:center;gap:12px">
              <span style="font-family:var(--font-zh);font-size:1.8rem;font-weight:700">${c.traditional||c.hanzi}</span>
              <div>
                <div>${Pinyin.colorize(c.pinyin||'')} <span class="zhuyin">${c.zhuyin||''}</span></div>
                <div class="text-small text-muted">${c.definition||''}</div>
              </div>
              <button class="btn btn-sm btn-ghost" style="margin-left:auto" onclick="TTS.speak('${c.traditional||c.hanzi}')">🔊</button>
            </div>`).join('')}
        </div>
      </div>` : '';

    area.innerHTML = `
      <div class="card text-center" style="padding:32px">
        <div style="font-size:3rem;margin-bottom:8px">${pct >= 75 ? '🎉' : '📚'}</div>
        <div class="result-score" style="font-size:3.5rem">${pct}%</div>
        <div class="result-label">${quizState.score} / ${total} correct</div>
        <div style="display:inline-block;padding:6px 18px;background:${bandColor};color:#fff;border-radius:20px;font-weight:700;margin-bottom:16px">${band}</div>
        <div class="text-small text-muted mb-20">Time: ${elapsed < 60 ? elapsed+'s' : Math.floor(elapsed/60)+'m '+elapsed%60+'s'}</div>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-primary" onclick="location.reload()">Try Again</button>
          <button class="btn btn-ghost" onclick="navigate('/')">Dashboard</button>
        </div>
        ${wrongReview}
      </div>
    `;
  }

  return { renderPronunciation, renderVocabulary };

})();
