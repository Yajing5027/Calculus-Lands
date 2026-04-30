/**
 * This file runs the whole game: it loads art and question data, moves Sigma
 * through each land, starts battles, checks answers, and shows story letters.
 */

'use strict';

/* Image paths for Sigma, the enemies, and Dr. H. */
const BASE = 'assets/animations/';
const PROF_AVATAR = 'assets/animations/Dr.H.png';

const PATHS = {
  hero: {
    idle: [
      BASE + 'characters/protagonist_redreaper/protagonist_redreaper_idle/frames/frame_000.png',
      BASE + 'characters/protagonist_redreaper/protagonist_redreaper_idle/frames/frame_001.png',
      BASE + 'characters/protagonist_redreaper/protagonist_redreaper_idle/frames/frame_002.png',
      BASE + 'characters/protagonist_redreaper/protagonist_redreaper_idle/frames/frame_003.png',
    ],
    run: [
      BASE + 'characters/protagonist_redreaper/protagonist_redreaper_run/frames/frame_000.png',
      BASE + 'characters/protagonist_redreaper/protagonist_redreaper_run/frames/frame_001.png',
      BASE + 'characters/protagonist_redreaper/protagonist_redreaper_run/frames/frame_002.png',
      BASE + 'characters/protagonist_redreaper/protagonist_redreaper_run/frames/frame_003.png',
      BASE + 'characters/protagonist_redreaper/protagonist_redreaper_run/frames/frame_004.png',
      BASE + 'characters/protagonist_redreaper/protagonist_redreaper_run/frames/frame_005.png',
      BASE + 'characters/protagonist_redreaper/protagonist_redreaper_run/frames/frame_006.png',
      BASE + 'characters/protagonist_redreaper/protagonist_redreaper_run/frames/frame_007.png',
      BASE + 'characters/protagonist_redreaper/protagonist_redreaper_run/frames/frame_008.png',
    ],
    attack: [
      BASE + 'characters/protagonist_redreaper/protagonist_redreaper_attack/frames/frame_000.png',
      BASE + 'characters/protagonist_redreaper/protagonist_redreaper_attack/frames/frame_001.png',
      BASE + 'characters/protagonist_redreaper/protagonist_redreaper_attack/frames/frame_002.png',
      BASE + 'characters/protagonist_redreaper/protagonist_redreaper_attack/frames/frame_003.png',
      BASE + 'characters/protagonist_redreaper/protagonist_redreaper_attack/frames/frame_004.png',
      BASE + 'characters/protagonist_redreaper/protagonist_redreaper_attack/frames/frame_005.png',
      BASE + 'characters/protagonist_redreaper/protagonist_redreaper_attack/frames/frame_006.png',
      BASE + 'characters/protagonist_redreaper/protagonist_redreaper_attack/frames/frame_007.png',
    ],
  },
  limitus: {
    idle: [
      BASE + 'characters/enemies/minion/red_warrior/idle_01.png',
      BASE + 'characters/enemies/minion/red_warrior/idle_02.png',
      BASE + 'characters/enemies/minion/red_warrior/idle_03.png',
      BASE + 'characters/enemies/minion/red_warrior/idle_04.png',
      BASE + 'characters/enemies/minion/red_warrior/idle_05.png',
    ],
    attack: [
      BASE + 'characters/enemies/minion/red_warrior/attack_01.png',
      BASE + 'characters/enemies/minion/red_warrior/attack_02_long.png',
    ],
    hurt: [
      BASE + 'characters/enemies/minion/red_warrior/idle_01.png',
    ],
    die: [
      BASE + 'characters/enemies/minion/red_warrior/death_01.png',
    ],
  },
  owlculus: {
    idle: [
      BASE + 'characters/enemies/owl_boss/owl_boss_idle_front_01.png',
    ],
    move: [
      BASE + 'characters/enemies/owl_boss/owl_boss_move_01.png',
      BASE + 'characters/enemies/owl_boss/owl_boss_move_02.png',
      BASE + 'characters/enemies/owl_boss/owl_boss_move_03.png',
    ],
    attack: [
      BASE + 'characters/enemies/owl_boss/owl_boss_move_01.png',
      BASE + 'characters/enemies/owl_boss/owl_boss_move_02.png',
      BASE + 'characters/enemies/owl_boss/owl_boss_move_03.png',
    ],
    hurt: [
      BASE + 'characters/enemies/owl_boss/owl_boss_hit_01.png',
      BASE + 'characters/enemies/owl_boss/owl_boss_hit_02.png',
      BASE + 'characters/enemies/owl_boss/owl_boss_hit_03_fx.png',
    ],
    die: [
      BASE + 'characters/enemies/owl_boss/owl_boss_die_01.png',
      BASE + 'characters/enemies/owl_boss/owl_boss_die_02.png',
      BASE + 'characters/enemies/owl_boss/owl_boss_die_03_burn.png',
      BASE + 'characters/enemies/owl_boss/owl_boss_die_04_explode.png',
    ],
  },
};

/* Basic world numbers: how large the map is, how fast Sigma moves, and how large each sprite should appear. */
const WORLD_W      = 3400;
const HERO_START_X = 80;
const HERO_SPEED   = 1.8;
const HERO_MAX_HP  = 5;
const TRIGGER_DIST = 75;

const SCALE_SIGMA = 2.5;
const HERO_SOURCE_H = 36;
const LIMITUS_SOURCE_H = 15;
const OWLCULUS_SOURCE_H = 256;
const HERO_VISUAL_H = HERO_SOURCE_H * SCALE_SIGMA;
const SCALE_LIMITUS = (HERO_VISUAL_H * 1.5) / LIMITUS_SOURCE_H;
const SCALE_OWLCULUS = (HERO_VISUAL_H * 2.5) / OWLCULUS_SOURCE_H;

const BATTLE_ZOOM_SCALE = 1.65;
const BATTLE_GAP_MINION = 150;
const BATTLE_GAP_BOSS = 235;

// Where each enemy waits along the side-scrolling world.
const ENEMY_POS = { enemy1: 900, enemy2: 1800, boss: 2700 };

/* The five lands and the JSON files that supply their questions. */
const MAP_COUNT = 5;
const mapPath = id => `data/map${id}`;
const LAND_NAMES = [
  'Silicon Depths',
  'Substitution Labyrinth',
  'Parametric Veil',
  'Infinite Chasm',
  'Alternating Spire',
];

const LEVEL_DEFS = Array.from({ length: MAP_COUNT }, (_, i) => {
  const id = i + 1;
  const base = mapPath(id);
  return {
    id,
    name: LAND_NAMES[i],
    desc: '',
    enemies: [
      { id: 'enemy1', json: `${base}/enemy1.json`, worldX: ENEMY_POS.enemy1, name: 'Limitus', frames: PATHS.limitus, scale: SCALE_LIMITUS },
      { id: 'enemy2', json: `${base}/enemy2.json`, worldX: ENEMY_POS.enemy2, name: 'Limitus', frames: PATHS.limitus, scale: SCALE_LIMITUS },
      { id: 'boss',   json: `${base}/boss.json`,   worldX: ENEMY_POS.boss,   name: 'Owlculus', frames: PATHS.owlculus, scale: SCALE_OWLCULUS },
    ],
  };
});

const LEVEL_MAP_LAYOUT = [
  { id: 1, x: 13, y: 68, size: 'sm', tilt: -8, terrain: 'ruins' },
  { id: 2, x: 30, y: 39, size: 'md', tilt: 5, terrain: 'grove' },
  { id: 3, x: 52, y: 62, size: 'lg', tilt: -3, terrain: 'rift' },
  { id: 4, x: 71, y: 34, size: 'md', tilt: 8, terrain: 'tower' },
  { id: 5, x: 87, y: 64, size: 'sm', tilt: -5, terrain: 'gate' },
];

const FINAL_LETTER_HTML = `
  <p><strong>Dear Adventurer Sigma,</strong></p>
  <p>The exploration of the five lands has come to an end. I am Owlculus, the guardian you faced at the end of every map. You might have thought I was your final obstacle, but the truth is simpler — and stranger. I was never your enemy. I was your final examiner, placed here by an old friend of mine. That friend's name is Dr. H.</p>
  <p>Dr. H and I share the same belief: mathematics is not a cage — it is a lantern. And every trick I played on you in those lands was designed by the two of us to make your intuition sharper and your mind more honest.</p>
  <p>Now, as you stand at the summit, I want you to see what you have truly conquered.</p>
  <hr>
  <p><strong>The Land of Silicon Depths</strong> (Applications of Integration) was your first trial. You started from small areas and used integrals to build infinite slices and shells. You turned infinite additions into exact volumes and areas. This land trained your intuition to translate the real world into the language of integrals. You learned that every solid shape is just a stack of infinitely thin pieces, waiting to be summed.</p>
  <p>But soon, you found that some integrals are impossible to solve directly. Not because you lacked skill, but because the functions could not be expressed simply. So, you entered <strong>the Land of the Substitution Labyrinth</strong> (Integration Techniques). You learned to use substitution, integration by parts, and partial fractions to turn stubborn integrals into shapes you could handle. You were asking: "Can I change the coordinate system to see the hidden structure of these infinite accumulations?" In the labyrinth, the shortest path was never the most obvious one — and your intuition had to learn to sniff it out.</p>
  <p>However, coordinates can hide the truth. In <strong>the Land of the Parametric Veil</strong> (Parametric and Polar Coordinates), you discovered that curves can wear masks. A shape you thought you knew could be disguised by a parameter t or an angle θ. The substitution thinking you learned in the Labyrinth became the tool to tear away this veil. Using polar coordinates or parameterization to find arc length is just changing your perspective to make the integral possible again. You learned to see through the disguise.</p>
  <p>Next, you faced the biggest anti-intuition bomb: infinite sequences and series. In <strong>the Land of the Infinite Chasm</strong> (Sequences, Series, and Convergence Tests), you stood at the edge and stared into the abyss. Terms going to zero no longer meant safety. The harmonic series was your first betrayal. You were surprised to see that the Integral Test uses the improper integral skills you practiced in the Silicon Depths and the Labyrinth. The Comparison Test asks you to recognize at a glance if a series looks like a p‑series or a geometric series. This "pattern recognition" is exactly what you trained for in the earlier lands. The chasm taught you that "very small" is not the same as "safe."</p>
  <p>Finally, at <strong>the Land of the Alternating Spire</strong> (Alternating Series, Power Series, and Taylor Series), your power from the Infinite Chasm decided if you could handle the two-phase battles. You learned that every alternating enemy wears double armor: strip the absolute value first, then check the alternating form. Absolute convergence is victory on solid ground; conditional convergence is balance on a tightrope. Taylor series brought everything full circle: using polynomials to approximate functions is the same "infinite approximation" philosophy as using slices to approximate volume in the Silicon Depths.</p>
  <p>Every theme tells the same story: infinite approximation, and how to know if that process is safe.</p>
  <p>The shell method in the Land of Silicon Depths is an approximation. The algebraic changes in the Land of the Substitution Labyrinth make approximation possible. The Land of the Parametric Veil is a different way to look at the path of approximation. The Land of the Infinite Chasm and the Land of the Alternating Spire create safety rules for the most dangerous form of approximation: the sum of infinite terms.</p>
  <p>You have traveled a long way, from the solid ground of shapes to the ethereal clouds of infinite series. You have learned that in the world of Calculus, "infinity" is not a destination, but a way of seeing the truth.</p>
  <p>My old friend Dr. H and I have always been fond of a saying by Malcolm Gladwell: <em>"If you are getting bored with it, you probably haven't done enough work on it. Boredom is an intermediate stage. It's the plateau you get on after you've scraped the surface. Everything is interesting if you dig deep enough."</em></p>
  <p>You came to each land and dug deeper. You moved past the surface, past memorization, past first intuitions. And you found that beneath every formula, every test, every series, there is a structure worth uncovering.</p>
  <p>You have sharpened your sword and cleared your vision. You are no longer just a traveler; you are becoming a master of the infinite.</p>
  <p>Farewell for now, adventurer. May the lantern of mathematics light your path.</p>
  <p>— Owlculus<br>Guardian of the Five Lands</p>
`;

/* Loads images once and reuses them so animation frames stay smooth. */
const imgCache = {};

function loadImg(src) {
  if (imgCache[src]) return imgCache[src];
  return new Promise(resolve => {
    const img = new Image();
    img.onload  = () => { imgCache[src] = img; resolve(img); };
    img.onerror = () => {
      console.warn('[IMG MISSING]', src);
      const ph = document.createElement('canvas');
      ph.width = ph.height = 1;
      imgCache[src] = ph;
      resolve(ph);
    };
    img.src = src;
  });
}

async function preloadGroup(group) {
  return Promise.all(Object.values(group).flat().map(loadImg));
}

/* Draws frame-by-frame character animations on canvas. */
class Animator {
  constructor(canvas, scale = 2, options = {}) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.scale  = scale;
    this.flipX  = Boolean(options.flipX);
    this._frames   = [];
    this._frameIdx = 0;
    this._timer    = 0;
    this._fps      = 8;
    this._loop     = true;
    this._onDone   = null;
    this._paused   = false;
  }

  play(frames, fps = 8, loop = true) {
    return new Promise(resolve => {
      this._frames   = frames;
      this._frameIdx = 0;
      this._timer    = 0;
      this._fps      = fps;
      this._loop     = loop;
      this._paused   = false;
      this._onDone   = resolve;
      this._drawFrame();
    });
  }

  pause()  { this._paused = true; }
  resume() { this._paused = false; }

  tick(dt) {
    if (this._paused || this._frames.length === 0) return;
    this._timer += dt;
    const frameDur = 1000 / this._fps;
    if (this._timer >= frameDur) {
      this._timer -= frameDur;
      this._frameIdx++;
      if (this._frameIdx >= this._frames.length) {
        if (this._loop) {
          this._frameIdx = 0;
        } else {
          this._frameIdx = this._frames.length - 1;
          this._drawFrame();
          if (this._onDone) { const cb = this._onDone; this._onDone = null; cb(); }
          return;
        }
      }
      this._drawFrame();
    }
  }

  _drawFrame() {
    const src = this._frames[this._frameIdx];
    if (!src) return;
    const img = imgCache[src];
    if (!img) { loadImg(src).then(() => this._drawFrame()); return; }

    const w = img.width  || img.naturalWidth  || 1;
    const h = img.height || img.naturalHeight || 1;
    this.canvas.width  = w * this.scale;
    this.canvas.height = h * this.scale;
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    if (this.flipX) {
      this.ctx.translate(this.canvas.width, 0);
      this.ctx.scale(-1, 1);
    }
    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
  }
}

/* Short names for the HTML elements the game updates while running. */
const $ = id => document.getElementById(id);

const screenStart  = $('screen-start');
const screenLevels = $('screen-levels');
const screenGame   = $('screen-game');
const screenWin    = $('screen-win');
const screenLose   = $('screen-lose');
const btnStart     = $('btn-start');
const letterOverlay = $('letter-overlay');
const finalLetterOverlay = $('final-letter-overlay');
const finalLetterPaper = $('final-letter-paper');

const world       = $('world');
const heroEl      = $('hero');
const heroCanvas  = $('hero-canvas');

const hudEl          = $('hud');
const hudHeroName    = $('hud-hero-name');
const hudHeroHearts  = $('hud-hero-hearts');
const hudEnemyName   = $('hud-enemy-name');
const hudEnemyHearts = $('hud-enemy-hearts');
const hintToggle     = $('hint-toggle');

const movePanel  = $('move-panel');
const moveList   = $('move-list');

const dialogueEl = $('dialogue');
const dlgText    = $('dlg-text');
const dlgAvatarL = $('dlg-avatar-l');
const dlgAvatarR = $('dlg-avatar-r');

const bgLayers = document.querySelectorAll('.bg-layer');

/* Current game progress: level, position, health, battle state, and used questions. */
let currentLevel = null;
let heroX      = HERO_START_X;
let heroHP     = HERO_MAX_HP;
let walking    = false;
let inBattle   = false;
let gameOver   = false;
let defeated   = new Set();
let enemyData  = {};
let usedQuestionKeys = new Set();
let hintColorsEnabled = false;

const heroAnim = new Animator(heroCanvas, SCALE_SIGMA);
const enemyAnims = {};

let lastTs = 0;

/* Small helper functions used in many parts of the game. */
const wait = ms => new Promise(r => setTimeout(r, ms));

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function questionKey(q) {
  if (!q || typeof q !== 'object') return String(q || '').trim();
  return [
    q.question || q.text || q.prompt || '',
    q.formula || '',
  ].map(part => String(part).trim()).join('::');
}

function uniqueQuestions(questions) {
  const seen = new Set();
  return (questions || []).filter(q => {
    const key = questionKey(q);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildQuestionPool(questions) {
  const available = uniqueQuestions(questions).filter(q => !usedQuestionKeys.has(questionKey(q)));
  return shuffle(available);
}

function applyHintColorSetting() {
  document.body.classList.toggle('hint-colors-off', !hintColorsEnabled);
  if (!hintToggle) return;
  hintToggle.textContent = `Hint: ${hintColorsEnabled ? 'On' : 'Off'}`;
  hintToggle.setAttribute('aria-checked', String(hintColorsEnabled));
}

// Turns formulas in the dialogue and answer buttons into readable math.
function renderMath(el) {
  const attempt = () => {
    if (window.renderMathInElement && window.__katexLoaded) {
      try {
        renderMathInElement(el, {
          delimiters: [
            { left: '$$', right: '$$', display: true  },
            { left: '$',  right: '$',  display: false },
          ],
          throwOnError: false,
        });
      } catch(_) {}
    } else {
      setTimeout(attempt, 250);
    }
  };
  attempt();
}

function withClass(el, cls, ms) {
  return new Promise(resolve => {
    el.classList.add(cls);
    setTimeout(() => { el.classList.remove(cls); resolve(); }, ms);
  });
}

/* Draws the heart icons for Sigma and the enemy. */
function renderHearts(container, cur, max) {
  container.innerHTML = '';
  for (let i = 0; i < max; i++) {
    const s = document.createElement('span');
    s.className = 'heart' + (i >= cur ? ' lost' : '');
    s.textContent = i < cur ? '❤️' : '🖤';
    container.appendChild(s);
  }
}
const refreshHeroHearts  = ()        => renderHearts(hudHeroHearts,  heroHP, HERO_MAX_HP);
const refreshEnemyHearts = (hp, max) => renderHearts(hudEnemyHearts, hp,    max);

/* Shows floating damage or miss text after an attack. */
function spawnDmg(anchorEl, label, type) {
  const d = document.createElement('div');
  d.className = 'dmg-popup ' + type;
  d.textContent = label;
  d.style.left = (anchorEl.offsetLeft + anchorEl.offsetWidth / 2 - 14) + 'px';
  d.style.top  = (anchorEl.offsetTop  - 24) + 'px';
  world.appendChild(d);
  d.addEventListener('animationend', () => d.remove(), { once: true });
}

/* Moves the camera during walking and zooms in during battle. */
function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function computeTx(cx, scale = 1) {
  const vw = window.innerWidth;
  const scaledWorldW = WORLD_W * scale;
  const raw = (vw / 2) - (cx * scale);
  return clamp(raw, Math.min(0, vw - scaledWorldW), 0);
}

function applyCamera(x) {
  const tx = computeTx(x, 1);
  world.style.transformOrigin = '0 0';
  world.style.transform = `translate3d(${tx}px, 0, 0) scale(1)`;
  bgLayers.forEach(layer => {
    const depth = parseFloat(layer.style.getPropertyValue('--depth')) || 0.1;
    layer.style.backgroundPositionX = (tx * depth) + 'px';
  });
}

function applyBattleZoom(heroWorldX, enemyWorldX) {
  const centerX = (heroWorldX + enemyWorldX) / 2;
  const vh = Math.max(1, window.innerHeight - 52 - 140);
  const scale = BATTLE_ZOOM_SCALE;
  const tx = computeTx(centerX, scale);
  const ty = vh - (vh * scale);

  world.classList.add('zoom');
  world.style.transformOrigin = '0 0';
  world.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`;

  bgLayers.forEach(layer => {
    const depth = parseFloat(layer.style.getPropertyValue('--depth')) || 0.1;
    layer.style.backgroundPositionX = ((tx / scale) * depth) + 'px';
  });
}

function clearBattleZoom() {
  world.classList.remove('zoom');
  world.style.transformOrigin = 'left top';
  applyCamera(heroX);
}

/* Places Sigma at the correct horizontal position. */
function placeHero(x) {
  heroEl.style.left = x + 'px';
}

/* Reads question data for an enemy from its JSON file. */
async function loadEnemyJSON(id, file) {
  const cacheKey = file;
  if (enemyData[cacheKey]) return enemyData[cacheKey];
  try {
    const r = await fetch(file);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const d = await r.json();
    enemyData[cacheKey] = d;
    return d;
  } catch(e) {
    console.error('Could not load', file, e);
    return null;
  }
}

/* Prepares an enemy's canvas, position, and idle animation. */
function setupEnemySlot(id, worldX, frames, scale, options = {}) {
  const slot   = $(id);
  const canvas = slot.querySelector('.enemy-canvas');
  slot.style.left = worldX + 'px';
  slot.style.transform = 'translateX(-50%)';

  const anim = new Animator(canvas, scale, options);
  enemyAnims[id] = anim;
  anim.play(frames, 6, true);
  return anim;
}

/* Builds the question, formula, and professor text shown at the bottom of the screen. */
function escapeHTML(value) {
  const div = document.createElement('div');
  div.textContent = value == null ? '' : String(value);
  return div.innerHTML;
}

function normalizeDialogueParts(question, formula) {
  if (question && typeof question === 'object') {
    return {
      question: question.question || question.text || question.prompt || '',
      formula: question.formula || formula || '',
    };
  }
  return { question: question || '', formula: formula || '' };
}

function showDlg({ left = null, right = null, html = null, question = null, formula = null }) {
  dialogueEl.classList.remove('hidden');

  if (left) {
    dlgAvatarL.classList.remove('hidden');
    dlgAvatarL.src = left;
    dlgAvatarL.onerror = () => dlgAvatarL.classList.add('hidden');
  } else {
    dlgAvatarL.classList.add('hidden');
  }

  if (right) {
    dlgAvatarR.classList.remove('hidden');
    dlgAvatarR.src = right;
    dlgAvatarR.onerror = () => dlgAvatarR.classList.add('hidden');
  } else {
    dlgAvatarR.classList.add('hidden');
  }

  if (html !== null) {
    dlgText.innerHTML = html;
  } else {
    const parts = normalizeDialogueParts(question, formula);
    dlgText.innerHTML = '';
    if (parts.question) {
      const qEl = document.createElement('div');
      qEl.className = 'dlg-question';
      qEl.textContent = parts.question;
      dlgText.appendChild(qEl);
    }
    if (parts.formula) {
      const fEl = document.createElement('div');
      fEl.className = 'dlg-formula';
      fEl.textContent = `$$${parts.formula}$$`;
      dlgText.appendChild(fEl);
    }
  }
  renderMath(dlgText);
}

function professorHTML(value) {
  if (value && typeof value === 'object') {
    const parts = normalizeDialogueParts(value.text || value.answer || value.professor || '', value.formula || '');
    const lines = [`<strong>Dr. H:</strong> ${formatProfessorText(parts.question)}`];
    if (parts.formula) lines.push(`<div class="dlg-formula">$$${escapeHTML(parts.formula)}$$</div>`);
    return lines.join('');
  }
  return `<strong>Dr. H:</strong> ${formatProfessorText(value || '')}`;
}

function formatProfessorText(value) {
  return escapeHTML(value || '');
}

function hideDlg() { dialogueEl.classList.add('hidden'); }

function waitClick() {
  return new Promise(resolve => {
    const handler = e => {
      if (e.target.closest('#move-panel') || e.target.closest('.move-btn')) return;
      document.removeEventListener('click', handler, true);
      resolve();
    };
    setTimeout(() => document.addEventListener('click', handler, true), 400);
  });
}

/* Runs one full fight: pick questions, show choices, apply damage, and end the battle. */
async function runBattle(cfg) {
  inBattle = true;
  walking  = false;
  heroAnim.play(PATHS.hero.idle, 6, true);

  const data = await loadEnemyJSON(cfg.id, cfg.json);
  if (!data) {
    defeated.add(cfg.id);
    inBattle = false;
    walking  = true;
    return;
  }

  let enemyHP    = data.enemy.maxHP;
  const enemyMax = data.enemy.maxHP;
  const eAnim    = enemyAnims[cfg.id];
  const eSlot    = $(cfg.id);
  const fs       = cfg.frames;

  const battleGap = cfg.id === 'boss' ? BATTLE_GAP_BOSS : BATTLE_GAP_MINION;
  const targetHeroX = Math.max(40, cfg.worldX - battleGap);
  heroX = targetHeroX;
  placeHero(heroX);

  // Show the enemy name and both health bars before the fight starts.
  hudEnemyName.textContent = cfg.name;
  hudEl.classList.remove('hidden');
  refreshEnemyHearts(enemyHP, enemyMax);
  refreshHeroHearts();

  // Bring the camera closer so the fight feels focused.
  applyBattleZoom(heroX, cfg.worldX);
  await wait(700);

  let qPool = buildQuestionPool(data.questions);
  let qIdx  = 0;

  /* Repeat questions and attacks until someone runs out of hearts. */
  while (enemyHP > 0 && heroHP > 0) {
    if (qIdx >= qPool.length) {
      qPool = buildQuestionPool(data.questions);
      qIdx = 0;
    }
    if (!qPool.length) {
      console.warn('Question pool exhausted for', cfg.json);
      qPool = shuffle(uniqueQuestions(data.questions));
      qIdx = 0;
    }
    const q = qPool[qIdx++];
    usedQuestionKeys.add(questionKey(q));

    /* Show the question and randomize the answer positions. */
    const enemyAvatar = fs.idle[0];
    const moveChoices = shuffle(q.moves);
    showDlg({ right: enemyAvatar, question: q.question, formula: q.formula || null });
    buildMoveButtons(moveChoices);
    movePanel.classList.add('open');

    /* Wait until the player chooses one move. */
    const chosen = await awaitMoveChoice(moveChoices);
    movePanel.classList.remove('open');
    await wait(200);

    /* Apply the result of the chosen move. */
    const fx = chosen.effect;

    if (fx === 'crit') {
      heroAnim.play(PATHS.hero.attack, 12, false);
      await withClass(heroEl, 'anim-attack', 380);
      await playSingleAnim(eAnim, fs.hurt, 10);
      eAnim.play(fs.idle, 6, true);
      spawnDmg(eSlot, '−2 💥', 'crit');
      enemyHP = Math.max(0, enemyHP - 2);
      refreshEnemyHearts(enemyHP, enemyMax);
      heroAnim.play(PATHS.hero.idle, 6, true);

    } else if (fx === 'normal') {
      heroAnim.play(PATHS.hero.attack, 12, false);
      await withClass(heroEl, 'anim-attack', 380);
      await playSingleAnim(eAnim, fs.hurt, 10);
      eAnim.play(fs.idle, 6, true);
      spawnDmg(eSlot, '−1', 'normal');
      enemyHP = Math.max(0, enemyHP - 1);
      refreshEnemyHearts(enemyHP, enemyMax);
      heroAnim.play(PATHS.hero.idle, 6, true);

    } else if (fx === 'dodge') {
      await playSingleAnim(eAnim, fs.attack, 10);
      eAnim.play(fs.idle, 6, true);
      spawnDmg(heroEl, 'MISS', 'miss');
      await withClass(heroEl, 'anim-jump', 460);

    } else {
      await playSingleAnim(eAnim, fs.attack, 10);
      eAnim.play(fs.idle, 6, true);
      await withClass(heroEl, 'anim-hurt', 460);
      spawnDmg(heroEl, '−1 💔', 'fail');
      heroHP = Math.max(0, heroHP - 1);
      refreshHeroHearts();
    }

    if (enemyHP <= 0 || heroHP <= 0) break;

    /* Let Dr. H explain why the choice worked or failed. */
    showDlg({
      left: PROF_AVATAR,
      html: professorHTML(chosen.professor),
    });
    await waitClick();
  }

  /* Close the fight and decide whether the player won or lost. */
  movePanel.classList.remove('open');

  if (heroHP <= 0) {
    showDlg({
      left: PROF_AVATAR,
      html: `<strong>Dr. H:</strong> Infinity overwhelmed you. Rest, review the methods, and return when your intuition is ready.`,
    });
    await wait(900);
    clearBattleZoom();
    hideDlg();
    hudEl.classList.add('hidden');
    await wait(300);
    screenLose.classList.remove('hidden');
    gameOver = true;
    return;
  }

  /* Play the enemy defeat animation and return Sigma to walking. */
  if (fs.die && fs.die.length) {
    await playSingleAnim(eAnim, fs.die, 8);
  }

  showDlg({
    left: PROF_AVATAR,
    html: `<strong>Dr. H:</strong> Excellent. ${cfg.name} has been conquered. Press onward!`,
  });
  await wait(1300);
  hideDlg();
  hudEl.classList.add('hidden');

  clearBattleZoom();
  heroAnim.play(PATHS.hero.idle, 6, true);
  await wait(150);

  // Give Sigma a short victory celebration.
  for (let i = 0; i < 3; i++) {
    await withClass(heroEl, 'anim-vjump', 540);
    await wait(60);
  }

  // Remove the defeated enemy from the map.
  eSlot.style.transition = 'opacity .6s';
  eSlot.style.opacity    = '0';
  await wait(650);
  eSlot.style.display    = 'none';

  defeated.add(cfg.id);
  inBattle = false;
  walking  = true;
  heroAnim.play(PATHS.hero.run, 12, true);

  // If every enemy in the land is gone, show the win flow.
  const allDefeated = currentLevel.enemies.every(e => defeated.has(e.id));
  if (allDefeated) {
    walking = false;
    heroAnim.play(PATHS.hero.idle, 6, true);
    await wait(800);
    if (currentLevel && currentLevel.id === MAP_COUNT) {
      await showFinalLetter();
    }
    screenWin.classList.remove('hidden');
    gameOver = true;
  }
}

function playSingleAnim(anim, frames, fps) {
  return new Promise(resolve => {
    if (!frames || frames.length === 0) { resolve(); return; }
    anim.play(frames, fps, false).then(resolve);
  });
}

function buildMoveButtons(moves) {
  const NUMS = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ'];
  moveList.innerHTML = '';
  moves.forEach((m, i) => {
    const btn = document.createElement('button');
    btn.className = 'move-btn';
    btn.dataset.effect = m.effect;
    btn.innerHTML = `
      <span class="move-num">${NUMS[i]}</span>
      <span class="move-label">${formatMoveLabel(m.name)}</span>
    `;
    moveList.appendChild(btn);
  });
  renderMath(moveList);
}

function awaitMoveChoice(moves) {
  return new Promise(resolve => {
    const btns = moveList.querySelectorAll('.move-btn');
    btns.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        btns.forEach(b => { b.disabled = true; });
        resolve(moves[i]);
      }, { once: true });
    });
  });
}

function showIntroLetter() {
  return new Promise(resolve => {
    if (!letterOverlay) {
      resolve();
      return;
    }

    letterOverlay.classList.remove('hidden', 'dismiss');
    const closeLetter = () => {
      letterOverlay.removeEventListener('click', closeLetter);
      letterOverlay.classList.add('dismiss');
      setTimeout(() => {
        letterOverlay.classList.add('hidden');
        letterOverlay.classList.remove('dismiss');
        resolve();
      }, 300);
    };
    setTimeout(() => letterOverlay.addEventListener('click', closeLetter), 300);
  });
}

function showFinalLetter() {
  return new Promise(resolve => {
    if (!finalLetterOverlay || !finalLetterPaper) {
      resolve();
      return;
    }

    finalLetterPaper.innerHTML = FINAL_LETTER_HTML;
    finalLetterPaper.scrollTop = 0;
    finalLetterOverlay.classList.remove('hidden', 'dismiss');

    const closeLetter = () => {
      finalLetterOverlay.removeEventListener('click', closeLetter);
      finalLetterOverlay.classList.add('dismiss');
      setTimeout(() => {
        finalLetterOverlay.classList.add('hidden');
        finalLetterOverlay.classList.remove('dismiss');
        resolve();
      }, 300);
    };
    setTimeout(() => finalLetterOverlay.addEventListener('click', closeLetter), 300);
  });
}

function toLatexSnippet(value) {
  return String(value || '')
    .trim()
    .replace(/π/g, '\\pi ')
    .replace(/∞/g, '\\infty ')
    .replace(/∫/g, '\\int ')
    .replace(/∑/g, '\\sum ')
    .replace(/√\(([^)]+)\)/g, '\\sqrt{$1}')
    .replace(/√([A-Za-z0-9]+)/g, '\\sqrt{$1}')
    .replace(/·/g, '\\cdot ')
    .replace(/≤|&lt;=/g, '\\le ')
    .replace(/≥|&gt;=/g, '\\ge ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/θ/g, '\\theta')
    .replace(/\barctan\b/g, '\\arctan')
    .replace(/\bsin\b/g, '\\sin')
    .replace(/\bcos\b/g, '\\cos')
    .replace(/\btan\b/g, '\\tan')
    .replace(/\bsec\b/g, '\\sec')
    .replace(/\bcsc\b/g, '\\csc')
    .replace(/\bcot\b/g, '\\cot')
    .replace(/\bln\b/g, '\\ln')
    .replace(/\bdx\b/g, '\\,dx')
    .replace(/\bdv\b/g, 'dv')
    .replace(/\bdu\b/g, 'du')
    .replace(/\balone\b/gi, '')
    .replace(/\*/g, '\\cdot ')
    .replace(/\s+/g, ' ');
}

function mathInline(value) {
  return `$${toLatexSnippet(value)}$`;
}

function isMathLike(value) {
  return /[=^_\/\\]|[π∫√θ]|dy\/d[xt]|dP\/dt|s'\(t\)|y'|y''|\b(sin|cos|tan|sec|csc|cot|ln|arctan|dx|du|dv)\b/.test(String(value || ''));
}

function formatMoveLabel(name) {
  const raw = String(name || '');
  const safe = escapeHTML(raw);

  const multiplyFraction = raw.match(/^Multiply by \((.+)\)\/\((.+)\)(.*)$/);
  if (multiplyFraction) {
    return `Multiply by <span class="move-math">$\\frac{${toLatexSnippet(multiplyFraction[1])}}{${toLatexSnippet(multiplyFraction[2])}}$</span>${escapeHTML(multiplyFraction[3])}`;
  }

  const parenthesized = raw.match(/^(.+?)\s*\((.+)\)$/);
  if (parenthesized && isMathLike(parenthesized[2])) {
    return `${escapeHTML(parenthesized[1])} <span class="move-math">${mathInline(parenthesized[2])}</span>`;
  }

  const colonMath = raw.match(/^([^:]+):\s*(.+)$/);
  if (colonMath && isMathLike(colonMath[2])) {
    return `${escapeHTML(colonMath[1])}: <span class="move-math">${mathInline(colonMath[2])}</span>`;
  }

  if (/^[A-Za-z]('|''|\([^)]+\))?\s*=/.test(raw) || /^[A-Za-z]+\/d[xt]\s*=/.test(raw) || /^[π∫√]/.test(raw)) {
    return `<span class="move-math">${mathInline(raw)}</span>`;
  }

  const substituted = safe
    .replace(/\bu = ([^,]+)(?=,|$)/g, (_, expr) => mathInline(`u = ${expr}`))
    .replace(/\bx = ([^,]+)(?=,|$)/g, (_, expr) => mathInline(`x = ${expr}`))
    .replace(/\bdv = ([^,]+)(?=,|$)/g, (_, expr) => mathInline(`dv = ${expr}`))
    .replace(/\bdu = ([^,]+)(?=,|$)/g, (_, expr) => mathInline(`du = ${expr}`))
    .replace(/([A-Za-z0-9^+\\\- ]+\/[A-Za-z0-9^+\\\- ]+)/g, match => isMathLike(match) ? mathInline(match) : match)
    .replace(/\b(ln\|[^|]+\||[a-zA-Z]+\^[0-9]+|[0-9]+π|π\s*∫|∫[^,.;]+)/g, match => mathInline(match));

  return substituted;
}

/* Builds the clickable map where the player chooses a land. */
function buildLevelSelect() {
  const map = $('level-map');
  map.innerHTML = `
    <svg class="map-trails" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path class="map-trail shadow" d="M13 68 C20 58, 22 48, 30 39 S44 52, 52 62 S64 46, 71 34 S80 45, 87 64" />
      <path class="map-trail main" d="M13 68 C20 58, 22 48, 30 39 S44 52, 52 62 S64 46, 71 34 S80 45, 87 64" />
    </svg>
    <div class="map-label map-label-nw">CALCULUS LANDS</div>
    <div class="map-label map-label-se">MAP ARCHIVE 01</div>
  `;
  LEVEL_DEFS.forEach(lvl => {
    const spot = LEVEL_MAP_LAYOUT.find(item => item.id === lvl.id);
    const node = document.createElement('button');
    node.type = 'button';
    node.className = `level-node size-${spot ? spot.size : 'md'} terrain-${spot ? spot.terrain : 'grove'}`;
    node.style.left = (spot ? spot.x : 50) + '%';
    node.style.top = (spot ? spot.y : 50) + '%';
    node.style.setProperty('--tilt', `${spot ? spot.tilt : 0}deg`);
    node.innerHTML = `
      <span class="level-node-num">${lvl.id}</span>
      <span class="level-node-title">${lvl.name}</span>
      <span class="level-node-mark"></span>
    `;
    node.setAttribute('aria-label', `Map ${lvl.id}: ${lvl.name}`);
    node.addEventListener('click', () => startLevel(lvl));
    map.appendChild(node);
  });
}

async function startLevel(lvl) {
  currentLevel = lvl;
  defeated.clear();
  enemyData = {};
  usedQuestionKeys.clear();
  heroX  = HERO_START_X;
  heroHP = HERO_MAX_HP;
  walking  = false;
  inBattle = false;
  gameOver = false;

  // Leave the map screen and enter the side-scrolling game.
  screenLevels.classList.add('hidden');
  screenGame.classList.remove('hidden');

  // Put Sigma and the camera back at the start of the land.
  placeHero(heroX);
  applyCamera(heroX);
  refreshHeroHearts();

  // Load all question files for this land before walking begins.
  await Promise.all(lvl.enemies.map(e => loadEnemyJSON(e.id, e.json)));

  // Place each enemy sprite in the world.
  lvl.enemies.forEach(e => {
    const slot = $(e.id);
    slot.style.display = 'flex';
    slot.style.opacity  = '1';
    setupEnemySlot(e.id, e.worldX, e.frames.idle, e.scale, { flipX: e.id === 'boss' });
  });

  heroAnim.play(PATHS.hero.idle, 6, true);
  await wait(400);
  walking = true;
  heroAnim.play(PATHS.hero.run, 12, true);
}

// Return from a win or loss screen to the land selection map.
window.goToLevels = function() {
  screenWin.classList.add('hidden');
  screenLose.classList.add('hidden');
  screenGame.classList.add('hidden');
  screenLevels.classList.remove('hidden');
};

if (hintToggle) {
  hintToggle.addEventListener('click', () => {
    hintColorsEnabled = !hintColorsEnabled;
    applyHintColorSetting();
  });
  applyHintColorSetting();
}

/* Keeps animation, walking, camera movement, and battle triggers running every frame. */
function gameLoop(ts) {
  const dt = Math.min(ts - lastTs, 50);
  lastTs = ts;

  heroAnim.tick(dt);
  Object.values(enemyAnims).forEach(a => a.tick(dt));

  if (!gameOver && walking && !inBattle && currentLevel) {
    heroX = Math.min(heroX + HERO_SPEED, WORLD_W - 120);
    placeHero(heroX);
    applyCamera(heroX);

    for (const e of currentLevel.enemies) {
      if (defeated.has(e.id)) continue;
      if (Math.abs(heroX - e.worldX) < TRIGGER_DIST) {
        runBattle(e);
        break;
      }
    }
  }

  requestAnimationFrame(gameLoop);
}

/* Starts the game after the player presses Begin. */
async function init() {
  // Load character frames before the first screen transition.
  await Promise.all([
    preloadGroup(PATHS.hero),
    preloadGroup(PATHS.limitus),
    preloadGroup(PATHS.owlculus),
    loadImg(PROF_AVATAR),
  ]);

  heroAnim.play(PATHS.hero.idle, 6, true);
  buildLevelSelect();
}

btnStart.addEventListener('click', async () => {
  btnStart.disabled = true;
  screenStart.style.transition = 'opacity .6s';
  screenStart.style.opacity    = '0';
  await wait(620);
  screenStart.classList.add('hidden');
  screenLevels.classList.remove('hidden');
  await init();
  await showIntroLetter();
  requestAnimationFrame(ts => { lastTs = ts; gameLoop(ts); });
});
