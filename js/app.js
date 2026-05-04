/* ═══════════════════════════════════════════════════════════════
   app.js — Core: Router, State, Dashboard, Library, Settings
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ─── Global State ─────────────────────────────────────────────────────────────
const App = {
  state: {
    characters: [],
    vocabulary: null,
    settings: {},
    progress: {},
    loading: false,
  },

  // Load settings from localStorage
  loadSettings() {
    const defaults = {
      theme: 'light',
      annotation: 'pinyin',       // pinyin | zhuyin | both | none
      toneColors: true,
      dailyGoal: 10,
      quizDifficulty: 'A2',
      displayName: 'Learner',
      showZhuyinDefault: false,
      unlockAll: true,
    };
    const saved = localStorage.getItem('tocfl_settings');
    this.state.settings = saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    // Force unlockAll to true as requested
    this.state.settings.unlockAll = true;
    this.applyTheme(this.state.settings.theme);
  },

  saveSettings() {
    localStorage.setItem('tocfl_settings', JSON.stringify(this.state.settings));
  },

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('dark-mode-toggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  },

  // Load progress from localStorage
  loadProgress() {
    const saved = localStorage.getItem('tocfl_progress');
    const defaults = {
      learnedChars: [],
      weakChars: [],
      savedSet: [],
      quizHistory: [],
      testHistory: [],
      streak: 999,
      lastStudyDate: new Date().toDateString(),
      totalReviewed: 5000,
      dailyReviewed: 100,
      lastDailyDate: new Date().toDateString(),
      activityLog: [],
      chapters: {},
      onboardingComplete: true,
      mastery: 100
    };
    
    // Always start with maxed out progress for testing as requested
    this.state.progress = { ...defaults };
    
    // Fill all 30 chapters as complete
    for (let i = 1; i <= 30; i++) {
        this.state.progress.chapters[i] = {
            vocabDone: true,
            dialogueDone: true,
            readingDone: true,
            exercisesDone: true,
            score: 100
        };
    }
    
    // Mark all A1/A2/Novice characters as learned if available
    if (this.state.characters && this.state.characters.length > 0) {
        this.state.progress.learnedChars = this.state.characters.map(c => c.hanzi);
    }
    
    this.updateStreak();
  },

  saveProgress() {
    localStorage.setItem('tocfl_progress', JSON.stringify(this.state.progress));
  },

  updateStreak() {
    const today = new Date().toDateString();
    const last = this.state.progress.lastStudyDate;
    if (last === today) return; // already counted today

    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (last === yesterday) {
      this.state.progress.streak = (this.state.progress.streak || 0) + 1;
    } else if (last !== today) {
      this.state.progress.streak = last ? 0 : (this.state.progress.streak || 0);
    }
    this.state.progress.lastStudyDate = today;

    // Reset daily count if new day
    if (this.state.progress.lastDailyDate !== today) {
      this.state.progress.dailyReviewed = 0;
      this.state.progress.lastDailyDate = today;
    }
  },

  logActivity(icon, text) {
    const log = this.state.progress.activityLog || [];
    log.unshift({ icon, text, time: new Date().toISOString() });
    this.state.progress.activityLog = log.slice(0, 20);
    this.saveProgress();
  },

  markLearned(hanzi) {
    if (!this.state.progress.learnedChars.includes(hanzi)) {
      this.state.progress.learnedChars.push(hanzi);
      this.state.progress.totalReviewed++;
      this.state.progress.dailyReviewed++;
      this.state.progress.lastStudyDate = new Date().toDateString();
      this.saveProgress();
    }
  },

  markWeak(hanzi) {
    if (!this.state.progress.weakChars.includes(hanzi)) {
      this.state.progress.weakChars.push(hanzi);
      this.saveProgress();
    }
  },

  unmarkWeak(hanzi) {
    this.state.progress.weakChars = this.state.progress.weakChars.filter(h => h !== hanzi);
    this.saveProgress();
  },

  addToSaved(hanzi) {
    if (!this.state.progress.savedSet.includes(hanzi)) {
      this.state.progress.savedSet.push(hanzi);
      this.saveProgress();
    }
  },

  removeFromSaved(hanzi) {
    this.state.progress.savedSet = this.state.progress.savedSet.filter(h => h !== hanzi);
    this.saveProgress();
  },
};

// ─── TTS Utility ──────────────────────────────────────────────────────────────
const TTS = {
  speak(text, lang = 'zh-TW', rate = 0.85) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang;
    utt.rate = rate;
    utt.pitch = 1.0;

    // Try to get zh-TW voice
    const voices = window.speechSynthesis.getVoices();
    const twVoice = voices.find(v => v.lang === 'zh-TW') ||
                    voices.find(v => v.lang.startsWith('zh'));
    if (twVoice) utt.voice = twVoice;

    window.speechSynthesis.speak(utt);
    return utt;
  },

  ready(cb) {
    if (window.speechSynthesis.getVoices().length) { cb(); return; }
    window.speechSynthesis.addEventListener('voiceschanged', cb, { once: true });
  },
};

// ─── Pinyin Utilities ─────────────────────────────────────────────────────────
const Pinyin = {
  TONE_MAP: {
    'a': ['ā','á','ǎ','à','a'], 'e': ['ē','é','ě','è','e'],
    'i': ['ī','í','ǐ','ì','i'], 'o': ['ō','ó','ǒ','ò','o'],
    'u': ['ū','ú','ǔ','ù','u'], 'v': ['ǖ','ǘ','ǚ','ǜ','ü'],
  },

  // Get tone number from pinyin with diacritics
  getTone(pinyin) {
    if (!pinyin) return 0;
    const p = pinyin.toLowerCase();
    if (/[āēīōūǖ]/.test(p)) return 1;
    if (/[áéíóúǘ]/.test(p)) return 2;
    if (/[ǎěǐǒǔǚ]/.test(p)) return 3;
    if (/[àèìòùǜ]/.test(p)) return 4;
    return 5; // neutral
  },

  // Wrap a pinyin string in a tone-colored span
  colorize(pinyin) {
    if (!App.state.settings.toneColors) return `<span class="pinyin">${pinyin}</span>`;
    const tone = this.getTone(pinyin);
    const cls = tone >= 1 && tone <= 5 ? `tone${tone}` : '';
    return `<span class="pinyin ${cls}">${pinyin}</span>`;
  },

  // Convert numbered pinyin (ni3) → diacritics (nǐ) — simple heuristic
  numberedToMarked(s) {
    if (!s) return '';
    return s.replace(/([a-zA-ZüÜ]+)([1-5])/g, (_, syl, tone) => {
      const t = parseInt(tone) - 1;
      const lower = syl.toLowerCase();
      for (const [base, marks] of Object.entries(this.TONE_MAP)) {
        if (lower.includes(base)) {
          return syl.replace(new RegExp(base, 'i'), marks[t] || base);
        }
      }
      return syl;
    });
  },
};

// ─── API Client (Static Version for GitHub Pages) ───────────────────────────────────
const API = {
  base: 'data', // Relative to public/

  async get(path) {
    // For static files, we just append .json if it's not already there
    let url = `${this.base}/${path}`;
    if (!url.endsWith('.json')) url += '.json';
    
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch ${url} failed: ${res.status}`);
    return res.json();
  },

  async getCharacters(params = {}) {
    // For static, we always load characters_all.json and filter in-memory if needed
    // However, App.boot already preloads App.state.characters
    if (App.state.characters && App.state.characters.length > 0 && Object.keys(params).length > 0) {
        let results = [...App.state.characters];
        const { level, search, limit = 50, offset = 0 } = params;
        if (level) results = results.filter(c => c.level === level.toLowerCase());
        if (search) {
            const q = search.trim().toLowerCase();
            results = results.filter(c => 
                c.hanzi.includes(q) || 
                (c.traditional && c.traditional.includes(q)) ||
                (c.definition && c.definition.toLowerCase().includes(q)) ||
                (c.pinyin && c.pinyin.toLowerCase().includes(q))
            );
        }
        return { total: results.length, data: results.slice(offset, offset + limit) };
    }
    const result = await this.get('characters_all');
    return result;
  },

  async getCharacter(hanzi) {
    if (App.state.characters) {
        const char = App.state.characters.find(c => c.hanzi === hanzi || c.traditional === hanzi);
        if (char) return char;
    }
    const result = await this.getCharacters();
    return result.data.find(c => c.hanzi === hanzi || c.traditional === hanzi);
  },

  async getReadings() {
    const readings = await this.get('readings');
    return readings.map(r => ({
      id: r.id, title: r.title, genre: r.genre, difficulty: r.difficulty,
      char_count: r.text_zh ? r.text_zh.length : 0,
      question_count: r.questions ? r.questions.length : 0,
      description: r.description
    }));
  },

  async getReading(id) {
    const readings = await this.get('readings');
    const reading = readings.find(r => r.id === id);
    if (reading && !reading.tokens) {
        const vocab = await this.get('vocabulary');
        reading.tokens = this.annotateText(reading.text_zh, App.state.characters, vocab);
    }
    return reading;
  },

  async annotate(text) {
    const vocab = await this.get('vocabulary');
    const tokens = this.annotateText(text, App.state.characters, vocab);
    return { tokens };
  },

  async fetchURL(url) {
    throw new Error('URL fetching is not supported in the static version. Please copy-paste text instead.');
  },

  async getMockTests(type) {
    const tests = await this.get('mock-tests');
    let filtered = tests;
    if (type) filtered = tests.filter(t => t.type === type);
    return filtered.map(t => ({
      id: t.id, title: t.title, type: t.type, difficulty: t.difficulty,
      question_count: t.questions ? t.questions.length : 0,
      time_limit: t.time_limit
    }));
  },

  async getMockTest(id) {
    const tests = await this.get('mock-tests');
    return tests.find(t => t.id === id);
  },

  async getStats() {
    const characters = App.state.characters;
    const byLevel = { novice: 0, a1: 0, a2: 0, b1: 0 };
    (characters || []).forEach(c => { if (byLevel[c.level] !== undefined) byLevel[c.level]++; });
    return { total_characters: characters.length, by_level: byLevel, app_version: '2.0.0 (Static)' };
  },

  annotateText(text, characters, vocab) {
    if (!text || !characters) return [];
    const charMap = {};
    characters.forEach(c => { charMap[c.hanzi] = c; if (c.traditional) charMap[c.traditional] = c; });
    const wordMap = {};
    if (vocab && vocab.sets) {
      vocab.sets.forEach(set => {
        (set.words || []).forEach(w => {
          if (w.word && w.word.length > 1) wordMap[w.word] = w;
        });
      });
    }
    const tokens = [];
    let i = 0;
    while (i < text.length) {
      const ch = text[i];
      if (!this.isChinese(ch)) {
        tokens.push({ hanzi: ch, pinyin: '', zhuyin: '', definition: '', type: 'punct' });
        i++; continue;
      }
      let matched = false;
      for (let len = Math.min(6, text.length - i); len > 1; len--) {
        const candidate = text.substring(i, i + len);
        if (wordMap[candidate]) {
          const w = wordMap[candidate];
          tokens.push({ hanzi: candidate, pinyin: w.pinyin || '', zhuyin: w.zhuyin || '', definition: w.definition || '', type: 'word' });
          i += len; matched = true; break;
        }
      }
      if (!matched) {
        const data = charMap[ch];
        if (data) {
          tokens.push({ hanzi: ch, pinyin: data.pinyin || '', zhuyin: data.zhuyin || '', definition: data.definition || '', type: 'char' });
        } else {
          tokens.push({ hanzi: ch, pinyin: '', zhuyin: '', definition: '', type: 'unknown' });
        }
        i++;
      }
    }
    return tokens;
  },

  isChinese(ch) {
    const code = ch.charCodeAt(0);
    return (code >= 0x4e00 && code <= 0x9fff) || (code >= 0x3400 && code <= 0x4dbf) || (code >= 0xf900 && code <= 0xfaff);
  }
};

// ─── Modal ────────────────────────────────────────────────────────────────────
const Modal = {
  show(html) {
    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    content.innerHTML = html;
    overlay.classList.remove('hidden');
    overlay.addEventListener('click', e => {
      if (e.target === overlay) this.hide();
    }, { once: true });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.hide();
    }, { once: true });
  },

  hide() {
    document.getElementById('modal-overlay').classList.add('hidden');
  },
};

// ─── Character Detail Modal ───────────────────────────────────────────────────
async function showCharModal(hanziOrObj) {
  let char;
  if (typeof hanziOrObj === 'object') {
    char = hanziOrObj;
  } else {
    try { char = await API.getCharacter(hanziOrObj); }
    catch { return; }
  }

  const toneClass = `tone${Pinyin.getTone(char.pinyin)}`;
  const isSaved = App.state.progress.savedSet.includes(char.hanzi);
  const isLearned = App.state.progress.learnedChars.includes(char.hanzi);

  const exWords = (char.example_words || []).map(w => `
    <div class="example-word-item">
      <span class="ew-word">${w.word}</span>
      <span class="ew-pinyin">${w.pinyin || ''}</span>
      <span class="ew-def">${w.definition || ''}</span>
    </div>`).join('');

  const sentence = char.example_sentence || {};

  Modal.show(`
    <button class="modal-close" onclick="Modal.hide()">✕</button>

    <div class="modal-hanzi-display">
      <div class="mhd-hanzi hanzi">${char.traditional || char.hanzi}</div>
      <div class="mhd-pinyin pinyin tone-colors <span class="${toneClass}">${char.pinyin || ''}</span>"></div>
      <div class="mhd-pinyin pinyin tone-colors">${Pinyin.colorize(char.pinyin || '')}</div>
      <div class="mhd-zhuyin">${char.zhuyin || ''}</div>
    </div>

    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;align-items:center">
      <span class="badge ${char.tocfl_band === 'A2' ? 'badge-a2' : 'badge-b1'}">${char.tocfl_band || ''}</span>
      <span class="badge badge-gray">${char.category || ''}</span>
      <span class="badge badge-gray">${char.stroke_count || '?'} strokes</span>
      <span class="text-muted text-small" style="margin-left:auto">Rank #${char.frequency_rank || '?'}</span>
    </div>

    <div class="modal-section">
      <h4>Definition</h4>
      <p style="font-size:1rem;color:var(--text)">${char.definition || ''}</p>
    </div>

    ${char.example_words && char.example_words.length ? `
    <div class="modal-section">
      <h4>Example Words</h4>
      ${exWords}
    </div>` : ''}

    ${sentence.sentence ? `
    <div class="modal-section">
      <h4>Example Sentence</h4>
      <div class="sentence-block">
        <div class="sb-zh">${sentence.sentence}</div>
        <div class="sb-py">${sentence.pinyin || ''}</div>
        <div class="sb-en">${sentence.english || ''}</div>
      </div>
    </div>` : ''}

    <div style="display:flex;gap:8px;margin-top:16px;flex-wrap:wrap">
      <button class="btn btn-primary" onclick="TTS.speak('${char.traditional || char.hanzi}')">🔊 Pronounce</button>
      <button class="btn ${isSaved ? 'btn-secondary' : 'btn-outline'}" id="modal-save-btn"
        onclick="toggleSaveChar('${char.hanzi}', this)">
        ${isSaved ? '★ Saved' : '☆ Save'}
      </button>
      <button class="btn ${isLearned ? 'btn-secondary' : 'btn-gold'}" id="modal-learn-btn"
        onclick="markLearnedFromModal('${char.hanzi}', this)">
        ${isLearned ? '✓ Learned' : 'Mark Learned'}
      </button>
    </div>
  `);
}

function toggleSaveChar(hanzi, btn) {
  if (App.state.progress.savedSet.includes(hanzi)) {
    App.removeFromSaved(hanzi);
    btn.textContent = '☆ Save';
    btn.className = 'btn btn-outline';
  } else {
    App.addToSaved(hanzi);
    btn.textContent = '★ Saved';
    btn.className = 'btn btn-secondary';
  }
}

function markLearnedFromModal(hanzi, btn) {
  App.markLearned(hanzi);
  btn.textContent = '✓ Learned';
  btn.className = 'btn btn-secondary';
  App.logActivity('✅', `Marked 「${hanzi}」 as learned`);
  updateStreakDisplay();
}

// ─── Router ───────────────────────────────────────────────────────────────────
const routes = {
  '/':                    { title: 'Dashboard',          render: renderDashboard,         route: 'dashboard' },
  '/onboarding':          { title: 'Pinyin & Tones',     render: renderOnboarding,        route: 'onboarding' },
  '/learn':               { title: 'Learning Path',      render: renderLearnPath,         route: 'learn' },
  '/chapters':            { title: 'Chapters',           render: renderChaptersPage,      route: 'chapters' },
  '/library':             { title: 'Character Library',  render: renderLibrary,           route: 'library' },
  '/flashcards':          { title: 'Flashcards',         render: renderFlashcardsPage,    route: 'flashcards' },
  '/dialogue':            { title: 'Dialogue Practice',  render: renderDialoguePage,      route: 'dialogue' },
  '/quiz/pronunciation':  { title: 'Pronunciation Quiz', render: renderPronunciationQuiz, route: 'quiz-pronunciation' },
  '/quiz/vocabulary':     { title: 'Vocabulary Quiz',    render: renderVocabQuiz,         route: 'quiz-vocabulary' },
  '/reading':             { title: 'Reading',            render: renderReadingPage,       route: 'reading' },
  '/mock-test/reading':   { title: 'Reading Mock Test',  render: renderMockReadingPage,   route: 'mock-reading' },
  '/mock-test/listening': { title: 'Listening Mock Test',render: renderMockListeningPage, route: 'mock-listening' },
  '/settings':            { title: 'Settings',           render: renderSettings,          route: 'settings' },
};

function navigate(path) {
  window.location.hash = '#' + path;
}

function getPath() {
  const hash = window.location.hash;
  if (!hash || hash === '#' || hash === '#/') return '/';
  return hash.replace('#', '') || '/';
}

async function router() {
  const path = getPath();
  const route = routes[path] || routes['/'];

  // Update nav active state
  document.querySelectorAll('.nav-item, .bottom-nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.route === route.route);
  });

  document.getElementById('topbar-title').textContent = route.title;

  const content = document.getElementById('page-content');
  content.innerHTML = '<div class="spinner"></div>';

  try {
    await route.render(content);
  } catch (err) {
    content.innerHTML = `
      <div class="empty-state">
        <div class="es-icon">⚠️</div>
        <h3>Something went wrong</h3>
        <p>${err.message}</p>
        <button class="btn btn-primary mt-8" onclick="location.reload()">Reload</button>
      </div>`;
    console.error('Route error:', err);
  }
}

window.addEventListener('hashchange', router);

// ─── Dashboard ────────────────────────────────────────────────────────────────
async function renderDashboard(container) {
  const prog  = App.state.progress;
  const chars = App.state.characters;
  const totalChars = chars.length || 0;
  const learned    = prog.learnedChars.length;
  const pct        = totalChars > 0 ? Math.round((learned / totalChars) * 100) : 0;
  const daily      = prog.dailyReviewed || 0;
  const goal       = App.state.settings.dailyGoal || 10;
  const dailyPct   = Math.min(100, Math.round((daily / goal) * 100));

  // SRS stats
  const srs = SRS.getStats();
  const dueToday = srs.due_today || 0;

  // Per-level breakdown
  const LEVELS = ['novice','a1','a2','b1'];
  const LMETA  = { novice:{name:'Novice',color:'#27ae60',icon:'🌱'}, a1:{name:'A1',color:'#2980b9',icon:'🌿'}, a2:{name:'A2',color:'#e67e22',icon:'🌳'}, b1:{name:'B1',color:'#8e44ad',icon:'🏆'} };
  const levelStats = LEVELS.map(lvl => {
    const total   = chars.filter(c => c.level === lvl).length;
    const done    = chars.filter(c => c.level === lvl && prog.learnedChars.includes(c.hanzi)).length;
    return { lvl, ...LMETA[lvl], total, done, pct: total > 0 ? Math.round((done/total)*100) : 0 };
  }).filter(l => l.total > 0);

  // Character of the day
  let cotd = null;
  if (chars.length) {
    const idx = Math.floor(Date.now() / 86400000) % chars.length;
    cotd = chars[idx];
  }

  const recentActivity = (prog.activityLog || []).slice(0, 5);
  const isFirstTime = learned === 0 && !prog.lastStudyDate;

  container.innerHTML = `
    <div class="page-header">
      <h2>歡迎回來，${App.state.settings.displayName}！</h2>
      <p>${isFirstTime ? '👋 New here? Start with <a href="#/onboarding" style="color:var(--red);font-weight:600">Pinyin & Tones</a> to build your foundation.' : 'Keep up your daily practice. Consistency is everything.'}</p>
    </div>

    ${isFirstTime ? `
    <!-- First-time onboarding banner -->
    <div style="background:linear-gradient(135deg,var(--red),var(--red-dark));color:#fff;border-radius:var(--radius);padding:24px;margin-bottom:24px;display:flex;gap:20px;align-items:center;flex-wrap:wrap">
      <div style="flex:1;min-width:200px">
        <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:2px;opacity:0.7;margin-bottom:6px">Getting Started</div>
        <h3 style="font-size:1.15rem;font-weight:700;margin-bottom:6px;color:#fff">New to Chinese? Start here.</h3>
        <p style="font-size:0.85rem;opacity:0.85;line-height:1.6">Learn the pinyin sound system and 4 tones before studying characters. This takes 20–30 minutes and makes everything easier.</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <a href="#/onboarding" class="btn" style="background:#fff;color:var(--red);font-weight:700">🎵 Start: Pinyin & Tones →</a>
        <a href="#/learn" class="btn" style="background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.3)">🗺️ View Learning Path</a>
      </div>
    </div>` : ''}

    <!-- SRS due today alert -->
    ${dueToday > 0 ? `
    <div style="background:rgba(243,156,18,0.1);border:1.5px solid var(--gold);border-radius:var(--radius);padding:14px 18px;margin-bottom:20px;display:flex;align-items:center;gap:14px;flex-wrap:wrap">
      <div style="font-size:1.5rem">🔔</div>
      <div style="flex:1">
        <div style="font-weight:700;color:var(--gold)">${dueToday} cards due for review today</div>
        <div style="font-size:0.82rem;color:var(--text-2)">Regular review prevents forgetting. It only takes a few minutes.</div>
      </div>
      <a href="#/learn" class="btn btn-gold btn-sm">Review Now →</a>
    </div>` : ''}

    <!-- Stats row -->
    <div class="dashboard-grid" style="margin-bottom:20px">
      <div class="stat-card">
        <div class="stat-icon">📚</div>
        <div class="stat-value">${learned}</div>
        <div class="stat-label">Characters Learned</div>
        <div class="progress-bar mt-8"><div class="progress-fill" style="width:${pct}%"></div></div>
        <div class="text-small text-muted mt-8">${pct}% of ${totalChars} total</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🧠</div>
        <div class="stat-value">${srs.total||0}</div>
        <div class="stat-label">In SRS Queue</div>
        <div class="text-small text-muted mt-8">${srs.mature||0} mature · ${dueToday} due today</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🔥</div>
        <div class="stat-value">${prog.streak||0}</div>
        <div class="stat-label">Day Streak</div>
        <div class="progress-bar mt-8"><div class="progress-fill" style="width:${dailyPct}%;background:var(--gold)"></div></div>
        <div class="text-small text-muted mt-8">Today: ${daily}/${goal} reviews</div>
      </div>
    </div>

    <!-- Level progress -->
    ${levelStats.length ? `
    <div class="section-title">Level Progress</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-bottom:24px">
      ${levelStats.map(l => `
        <div style="background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius);padding:14px;border-left:4px solid ${l.color}">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <span style="font-size:1.1rem">${l.icon}</span>
            <span style="font-weight:600;font-size:0.9rem">${l.name}</span>
            <span style="margin-left:auto;font-weight:700;font-size:1rem;color:${l.color}">${l.pct}%</span>
          </div>
          <div class="progress-bar"><div class="progress-fill" style="width:${l.pct}%;background:${l.color}"></div></div>
          <div class="text-small text-muted mt-8">${l.done}/${l.total} characters</div>
        </div>`).join('')}
    </div>` : ''}

    <!-- Character of the day -->
    ${cotd ? `
    <div class="cotd-card" data-char="${cotd.traditional || cotd.hanzi}" style="margin-bottom:24px">
      <div class="cotd-hanzi" onclick="TTS.speak('${cotd.traditional || cotd.hanzi}')" style="cursor:pointer" title="Click to hear">${cotd.traditional || cotd.hanzi}</div>
      <div class="cotd-info">
        <div style="font-size:0.65rem;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:2px;margin-bottom:4px">Character of the Day</div>
        <div class="cotd-pinyin tone-colors">${Pinyin.colorize(cotd.pinyin || '')}</div>
        <div class="cotd-def">${cotd.definition || ''}</div>
        ${cotd.example_sentence ? `<div class="cotd-sentence" style="margin-top:8px">${cotd.example_sentence.sentence || ''}<br><em style="font-size:0.78rem;opacity:0.7">${cotd.example_sentence.english || ''}</em></div>` : ''}
        <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-sm" style="background:rgba(255,255,255,0.12);color:#fff;border:1px solid rgba(255,255,255,0.2)" onclick="TTS.speak('${cotd.traditional || cotd.hanzi}')">🔊 Hear</button>
          <button class="btn btn-sm" style="background:rgba(255,255,255,0.12);color:#fff;border:1px solid rgba(255,255,255,0.2)" onclick="showCharModal(${JSON.stringify(cotd).replace(/"/g,'&quot;')})">Details →</button>
        </div>
      </div>
    </div>` : ''}

    <!-- Quick tiles -->
    <div class="section-title">Quick Access</div>
    <div class="quick-tiles mb-24">
      <a class="quick-tile" href="#/onboarding"><span class="tile-icon">🎵</span><span class="tile-name">Pinyin Trainer</span><span class="tile-desc">Tones & sounds</span></a>
      <a class="quick-tile" href="#/learn"><span class="tile-icon">🗺️</span><span class="tile-name">Learning Path</span><span class="tile-desc">Guided progress</span></a>
      <a class="quick-tile" href="#/chapters"><span class="tile-icon">📖</span><span class="tile-name">Chapters</span><span class="tile-desc">Structured lessons</span></a>
      <a class="quick-tile" href="#/dialogue"><span class="tile-icon">💬</span><span class="tile-name">Dialogues</span><span class="tile-desc">Real conversations</span></a>
      <a class="quick-tile" href="#/flashcards"><span class="tile-icon">🃏</span><span class="tile-name">Flashcards</span><span class="tile-desc">Study & review</span></a>
      <a class="quick-tile" href="#/quiz/pronunciation"><span class="tile-icon">🔤</span><span class="tile-name">Pinyin Quiz</span><span class="tile-desc">Practice tones</span></a>
    </div>

    <!-- Recent Activity -->
    <div class="section-title">Recent Activity</div>
    <div class="card">
      ${recentActivity.length ? `
        <div class="activity-list">
          ${recentActivity.map(a => `
            <div class="activity-item">
              <span class="activity-icon">${a.icon}</span>
              <span class="activity-text">${a.text}</span>
              <span class="activity-time">${timeAgo(a.time)}</span>
            </div>`).join('')}
        </div>` : `
        <div class="empty-state" style="padding:24px">
          <div class="es-icon">📋</div>
          <p>No activity yet — <a href="#/onboarding" style="color:var(--red)">start with Pinyin & Tones!</a></p>
        </div>`}
    </div>
  `;

  updateStreakDisplay();
  updateTopbarBadge();
}

function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function updateStreakDisplay() {
  const el = document.getElementById('streak-count');
  if (el) el.textContent = App.state.progress.streak || 0;
}

// ─── Library ──────────────────────────────────────────────────────────────────
let libraryState = {
  search: '', band: '', category: '', offset: 0, limit: 60,
  total: 0, data: [],
};

async function renderLibrary(container) {
  // Render skeleton immediately
  container.innerHTML = `
    <div class="page-header">
      <h2>Character Library</h2>
      <p>Browse all ${App.state.characters.length || '1000+'} TOCFL characters with pinyin, zhuyin & definitions.</p>
    </div>
    <div class="library-controls">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="text" class="input" id="lib-search" placeholder="Search hanzi, pīnyīn, or English…" value="${libraryState.search}">
      </div>
      <select class="input" id="lib-level" style="width:auto;min-width:100px">
        <option value="">All Levels</option>
        <option value="novice" ${libraryState.level==='novice'?'selected':''}>Novice</option>
        <option value="a1" ${libraryState.level==='a1'?'selected':''}>A1</option>
        <option value="a2" ${libraryState.level==='a2'?'selected':''}>A2</option>
        <option value="b1" ${libraryState.level==='b1'?'selected':''}>B1</option>
      </select>
      <select class="input" id="lib-category" style="width:auto;min-width:130px">
        <option value="">All Categories</option>
      </select>
      <button class="btn btn-ghost btn-sm" id="lib-reset">Reset</button>
    </div>
    <div id="lib-results-info" class="text-small text-muted mb-12"></div>
    <div class="char-grid" id="char-grid"><div class="spinner"></div></div>
    <div class="pagination" id="lib-pagination"></div>
  `;

  // Load categories
  try {
    const cats = await API.get('/meta/categories');
    const catSel = document.getElementById('lib-category');
    if (catSel) {
      cats.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c; opt.textContent = c.charAt(0).toUpperCase() + c.slice(1);
        if (c === libraryState.category) opt.selected = true;
        catSel.appendChild(opt);
      });
    }
  } catch {}

  // Wire up controls
  let searchTimeout;
  document.getElementById('lib-search')?.addEventListener('input', e => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      libraryState.search = e.target.value;
      libraryState.offset = 0;
      loadLibraryPage();
    }, 300);
  });

  document.getElementById('lib-level')?.addEventListener('change', e => {
    libraryState.level = e.target.value;
    libraryState.offset = 0;
    loadLibraryPage();
  });

  document.getElementById('lib-category')?.addEventListener('change', e => {
    libraryState.category = e.target.value;
    libraryState.offset = 0;
    loadLibraryPage();
  });

  document.getElementById('lib-reset')?.addEventListener('click', () => {
    libraryState = { search: '', band: '', category: '', offset: 0, limit: 60, total: 0, data: [] };
    document.getElementById('lib-search').value = '';
    document.getElementById('lib-band').value = '';
    document.getElementById('lib-category').value = '';
    loadLibraryPage();
  });

  await loadLibraryPage();
}

async function loadLibraryPage() {
  const grid = document.getElementById('char-grid');
  const info = document.getElementById('lib-results-info');
  if (!grid) return;

  grid.innerHTML = '<div class="spinner"></div>';

  try {
    const params = {
      limit: libraryState.limit,
      offset: libraryState.offset,
    };
    if (libraryState.search) params.search = libraryState.search;
    if (libraryState.level) params.level = libraryState.level;
    if (libraryState.category) params.category = libraryState.category;

    const result = await API.getCharacters(params);
    libraryState.total = result.total;
    libraryState.data = result.data;

    if (info) info.textContent = `Showing ${result.data.length} of ${result.total} characters`;

    if (!result.data.length) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="es-icon">🔍</div><h3>No characters found</h3><p>Try a different search term or filter.</p></div>`;
      renderPagination();
      return;
    }

    grid.innerHTML = result.data.map(c => {
      const isLearned = App.state.progress.learnedChars.includes(c.hanzi);
      const isWeak = App.state.progress.weakChars.includes(c.hanzi);
      const toneClass = Pinyin.getTone(c.pinyin) ? `tone${Pinyin.getTone(c.pinyin)}` : '';
      return `
        <div class="char-card ${isLearned ? 'learned' : ''} ${isWeak ? 'weak' : ''}"
             onclick="showCharModal(${JSON.stringify(c).replace(/"/g, '&quot;')})">
          <span class="char-badge card-badge">
            <span class="badge badge-${c.level || 'a2'}">${(c.level || '').toUpperCase()}</span>
          </span>
          <span class="char-hanzi">${c.traditional || c.hanzi}</span>
          <div class="char-pinyin tone-colors ${toneClass}" style="color:var(--tone${Pinyin.getTone(c.pinyin) || 1})">${c.pinyin || ''}</div>
          <div class="char-zhuyin">${c.zhuyin || ''}</div>
          <div class="char-def">${c.definition || ''}</div>
        </div>`;
    }).join('');

    renderPagination();
  } catch (err) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="es-icon">⚠️</div><h3>Failed to load characters</h3><p>${err.message}</p></div>`;
  }
}

function renderPagination() {
  const container = document.getElementById('lib-pagination');
  if (!container) return;

  const { total, limit, offset } = libraryState;
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit);

  if (totalPages <= 1) { container.innerHTML = ''; return; }

  let html = `<button class="page-btn" onclick="libGoPage(${currentPage - 1})" ${currentPage === 0 ? 'disabled' : ''}>← Prev</button>`;

  const pages = [];
  for (let i = 0; i < totalPages; i++) {
    if (i === 0 || i === totalPages - 1 || (i >= currentPage - 2 && i <= currentPage + 2)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…');
    }
  }

  pages.forEach(p => {
    if (p === '…') {
      html += `<span style="padding:6px 4px;color:var(--text-3)">…</span>`;
    } else {
      html += `<button class="page-btn ${p === currentPage ? 'active' : ''}" onclick="libGoPage(${p})">${p + 1}</button>`;
    }
  });

  html += `<button class="page-btn" onclick="libGoPage(${currentPage + 1})" ${currentPage >= totalPages - 1 ? 'disabled' : ''}>Next →</button>`;

  container.innerHTML = html;
}

function libGoPage(page) {
  const totalPages = Math.ceil(libraryState.total / libraryState.limit);
  if (page < 0 || page >= totalPages) return;
  libraryState.offset = page * libraryState.limit;
  loadLibraryPage();
  document.getElementById('char-grid')?.scrollIntoView({ behavior: 'smooth' });
}

// ─── Settings ─────────────────────────────────────────────────────────────────
function renderSettings(container) {
  const s = App.state.settings;
  const p = App.state.progress;

  container.innerHTML = `
    <div class="page-header">
      <h2>Settings</h2>
      <p>Customize your learning experience.</p>
    </div>
    <div style="max-width:600px">

      <div class="card mb-16">
        <div class="settings-section">
          <h3>Profile</h3>
          <div class="setting-row">
            <div class="setting-info">
              <div class="setting-label">Display Name</div>
            </div>
            <input type="text" class="input" id="set-name" value="${s.displayName || 'Learner'}" style="width:180px">
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <div class="setting-label">Daily Character Goal</div>
              <div class="setting-desc">Characters to review per day</div>
            </div>
            <input type="number" class="input" id="set-goal" value="${s.dailyGoal || 10}" min="1" max="100" style="width:80px">
          </div>
        </div>
      </div>

      <div class="card mb-16">
        <div class="settings-section">
          <h3>Display</h3>
          <div class="setting-row">
            <div class="setting-info">
              <div class="setting-label">Dark Mode</div>
            </div>
            <label class="toggle">
              <input type="checkbox" id="set-dark" ${s.theme === 'dark' ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <div class="setting-label">Tone Colors</div>
              <div class="setting-desc">Color pinyin by tone: <span style="color:var(--tone1)">1st</span> <span style="color:var(--tone2)">2nd</span> <span style="color:var(--tone3)">3rd</span> <span style="color:var(--tone4)">4th</span></div>
            </div>
            <label class="toggle">
              <input type="checkbox" id="set-tones" ${s.toneColors ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <div class="setting-label">Annotation Mode</div>
              <div class="setting-desc">What to show above characters</div>
            </div>
            <div class="radio-group">
              ${['pinyin','zhuyin','both','none'].map(v => `
                <label class="radio-option">
                  <input type="radio" name="annotation" value="${v}" ${s.annotation === v ? 'checked' : ''}>
                  <label>${v.charAt(0).toUpperCase()+v.slice(1)}</label>
                </label>`).join('')}
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-16">
        <div class="settings-section">
          <h3>Quiz</h3>
          <div class="setting-row">
            <div class="setting-info">
              <div class="setting-label">Default Difficulty</div>
            </div>
            <div class="radio-group">
              ${['A2','B1','Both'].map(v => `
                <label class="radio-option">
                  <input type="radio" name="difficulty" value="${v}" ${s.quizDifficulty === v ? 'checked' : ''}>
                  <label>${v}</label>
                </label>`).join('')}
            </div>
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <div class="setting-label">Unlock All Content</div>
              <div class="setting-desc">Bypass level locks for testing</div>
            </div>
            <label class="toggle">
              <input type="checkbox" id="set-unlock-all" ${s.unlockAll ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div class="card mb-16">
        <div class="settings-section">
          <h3>Progress</h3>
          <div class="setting-row">
            <div class="setting-info">
              <div class="setting-label">Learned Characters</div>
            </div>
            <span class="font-bold">${p.learnedChars.length}</span>
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <div class="setting-label">Saved Set</div>
            </div>
            <span class="font-bold">${p.savedSet.length}</span>
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <div class="setting-label">Weak Characters</div>
            </div>
            <span class="font-bold">${p.weakChars.length}</span>
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <div class="setting-label">Tests Completed</div>
            </div>
            <span class="font-bold">${(p.testHistory || []).length}</span>
          </div>
        </div>
      </div>

      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-primary" id="set-save-btn">Save Settings</button>
        <button class="btn btn-ghost" id="set-reset-btn">Reset All Progress</button>
      </div>
      <div id="set-saved-msg" class="hidden" style="margin-top:10px;color:var(--tone2);font-weight:600">✓ Settings saved!</div>
    </div>
  `;

  document.getElementById('set-save-btn')?.addEventListener('click', () => {
    App.state.settings.displayName = document.getElementById('set-name').value || 'Learner';
    App.state.settings.dailyGoal = parseInt(document.getElementById('set-goal').value) || 10;
    App.state.settings.theme = document.getElementById('set-dark').checked ? 'dark' : 'light';
    App.state.settings.toneColors = document.getElementById('set-tones').checked;
    App.state.settings.annotation = document.querySelector('input[name="annotation"]:checked')?.value || 'pinyin';
    App.state.settings.quizDifficulty = document.querySelector('input[name="difficulty"]:checked')?.value || 'A2';
    App.state.settings.unlockAll = document.getElementById('set-unlock-all').checked;
    App.saveSettings();
    App.applyTheme(App.state.settings.theme);
    const msg = document.getElementById('set-saved-msg');
    msg.classList.remove('hidden');
    setTimeout(() => msg.classList.add('hidden'), 2000);
  });

  document.getElementById('set-reset-btn')?.addEventListener('click', () => {
    if (confirm('Reset ALL progress? This cannot be undone.')) {
      localStorage.removeItem('tocfl_progress');
      App.loadProgress();
      navigate('/');
    }
  });
}

// ─── Stub renders (implemented in other JS files) ─────────────────────────────
// These are defined in their respective files but need to exist at load time
function renderFlashcardsPage(container) {
  if (typeof FlashcardsModule !== 'undefined') return FlashcardsModule.render(container);
  container.innerHTML = '<div class="spinner"></div><p class="text-center text-muted mt-8">Loading flashcards…</p>';
}

function renderPronunciationQuiz(container) {
  if (typeof QuizModule !== 'undefined') return QuizModule.renderPronunciation(container);
}

function renderVocabQuiz(container) {
  if (typeof QuizModule !== 'undefined') return QuizModule.renderVocabulary(container);
}

function renderReadingPage(container) {
  if (typeof ReaderModule !== 'undefined') return ReaderModule.render(container);
}

function renderMockReadingPage(container) {
  if (typeof MockTestModule !== 'undefined') return MockTestModule.renderReading(container);
}

function renderMockListeningPage(container) {
  if (typeof MockTestModule !== 'undefined') return MockTestModule.renderListening(container);
}

// ─── Topbar level badge ──────────────────────────────────────────────────────
function updateTopbarBadge() {
  const chars = App.state.characters;
  const learned = App.state.progress.learnedChars;
  const badge = document.getElementById('topbar-level');
  if (!badge || !chars.length) return;

  // Find highest level with any learned chars
  const levels = ['b1','a2','a1','novice'];
  let currentLevel = 'Novice';
  let badgeClass = 'badge-gray';
  for (const lvl of levels) {
    const lvlChars = chars.filter(c => c.level === lvl);
    const lvlLearned = lvlChars.filter(c => learned.includes(c.hanzi));
    if (lvlLearned.length > 0) {
      const map = { novice:'Novice', a1:'A1', a2:'A2', b1:'B1' };
      const clsMap = { novice:'badge-gray', a1:'badge-a2', a2:'badge-b1', b1:'badge-red' };
      currentLevel = map[lvl] || lvl.toUpperCase();
      badgeClass = clsMap[lvl] || 'badge-gray';
      break;
    }
  }
  badge.textContent = currentLevel;
  badge.className = 'badge ' + badgeClass;
}

// ─── New module stubs ────────────────────────────────────────
function renderOnboarding(container) {
  if (typeof OnboardingModule !== 'undefined') return OnboardingModule.render(container);
  container.innerHTML = '<div class="spinner"></div>';
}

function renderLearnPath(container) {
  if (typeof LearnModule !== 'undefined') return LearnModule.render(container);
  container.innerHTML = '<div class="spinner"></div>';
}

function renderChaptersPage(container) {
  if (typeof ChapterModule !== 'undefined') return ChapterModule.render(container);
  container.innerHTML = '<div class="spinner"></div>';
}

function renderDialoguePage(container) {
  if (typeof DialogueModule !== 'undefined') return DialogueModule.render(container);
  container.innerHTML = '<div class="spinner"></div>';
}

// ─── Boot ─────────────────────────────────────────────────────────────────────
async function boot() {
  App.loadSettings();
  App.loadProgress();

  // Dark mode toggle
  document.getElementById('dark-mode-toggle')?.addEventListener('click', () => {
    const dark = App.state.settings.theme !== 'dark';
    App.state.settings.theme = dark ? 'dark' : 'light';
    App.saveSettings();
    App.applyTheme(App.state.settings.theme);
  });

  // TTS test
  document.getElementById('tts-test-btn')?.addEventListener('click', () => {
    TTS.speak('你好，歡迎使用漢語學習應用程式。');
  });

  // Preload characters into memory for client-side operations
  try {
    const result = await API.getCharacters({ limit: 9999 });
    App.state.characters = result.data || [];
    updateTopbarBadge();
  } catch (err) {
    console.warn('Could not preload characters:', err.message);
  }

  // Run router
  router();
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
