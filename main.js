/**
 * ════════════════════════════════════════════════════════
 *  Calculus Lands — 级数讨伐   main.js
 *  Canvas sprite animation · Parallax · Turn-based battle
 * ════════════════════════════════════════════════════════
 */

'use strict';

/* ─────────────────────────────────────────
   ASSET PATHS  (relative to index.html)
───────────────────────────────────────── */
const BASE = 'assets/animations/';

const PATHS = {
  // ── Hero: Red Reaper ──
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

  // ── Enemy 1 & 2: Red Warrior (minion) ──
  minion: {
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
      BASE + 'characters/enemies/minion/red_warrior/idle_01.png', // fallback to idle flash
    ],
    die: [
      BASE + 'characters/enemies/minion/red_warrior/death_01.png',
    ],
  },

  // ── Boss: Owl Boss ──
  owl: {
    idle: [
      BASE + 'characters/enemies/owl_boss/owl_boss_idle_front_01.png',
    ],
    idle_back: [
      BASE + 'characters/enemies/owl_boss/owl_boss_idle_back_01.png',
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

/* ─────────────────────────────────────────
   GAME CONSTANTS
───────────────────────────────────────── */
const WORLD_W      = 3400;   // px — total scrollable world width
const HERO_START_X = 80;
const HERO_SPEED   = 1.8;    // px / frame while walking
const HERO_MAX_HP  = 5;
const HERO_SCALE   = 2.5;    // canvas pixel scale
const ENEMY_SCALE  = 2.8;
const BOSS_SCALE   = 3.2;
const TRIGGER_DIST = 70;     // px from hero to enemy to start battle

// Where each enemy stands in world coordinates
const ENEMY_POS = { enemy1: 820, enemy2: 1680, boss: 2520 };

/* ─────────────────────────────────────────
   IMAGE CACHE
───────────────────────────────────────── */
const imgCache = {};

function loadImg(src) {
  if (imgCache[src]) return imgCache[src];
  return new Promise(resolve => {
    const img = new Image();
    img.onload  = () => { imgCache[src] = img; resolve(img); };
    img.onerror = () => {
      console.warn('[IMG MISSING]', src);
      // Resolve with a tiny 1×1 transparent placeholder
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

/* ─────────────────────────────────────────
   SPRITE ANIMATOR
   Draws frame sequences onto a <canvas>
───────────────────────────────────────── */
class Animator {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {number} scale  — pixel scaling factor
   */
  constructor(canvas, scale = 2) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.scale  = scale;

    this._frames   = [];
    this._frameIdx = 0;
    this._timer    = 0;
    this._fps      = 8;      // frames per second
    this._loop     = true;
    this._onDone   = null;
    this._paused   = false;
  }

  /** Play a frame array. Returns Promise resolved when done (or immediately if loop). */
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

  pause() { this._paused = true; }
  resume(){ this._paused = false; }

  /** Called each game tick with delta-time in ms */
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
    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
  }
}

/* ─────────────────────────────────────────
   DOM REFERENCES
───────────────────────────────────────── */
const $ = id => document.getElementById(id);

const screenStart = $('screen-start');
const screenGame  = $('screen-game');
const screenWin   = $('screen-win');
const screenLose  = $('screen-lose');
const btnStart    = $('btn-start');

const world       = $('world');
const heroEl      = $('hero');
const heroCanvas  = $('hero-canvas');

const hudEl          = $('hud');
const hudEnemyName   = $('hud-enemy-name');
const hudEnemyHearts = $('hud-enemy-hearts');
const hudHeroHearts  = $('hud-hero-hearts');

const movePanel  = $('move-panel');
const moveList   = $('move-list');

const dialogueEl = $('dialogue');
const dlgText    = $('dlg-text');
const dlgAvatarL = $('dlg-avatar-l');
const dlgAvatarR = $('dlg-avatar-r');
const dlgHint    = $('dlg-hint');

const bgLayers = document.querySelectorAll('.bg-layer');

/* ─────────────────────────────────────────
   GAME STATE
───────────────────────────────────────── */
let heroX      = HERO_START_X;
let heroHP     = HERO_MAX_HP;
let walking    = false;   // set true after start
let inBattle   = false;
let gameOver   = false;
let defeated   = new Set();
let enemyData  = {};      // loaded JSON per id

// Hero animator
const heroAnim = new Animator(heroCanvas, HERO_SCALE);

// Per-enemy animators (created in setup)
const enemyAnims = {};

let lastTs = 0;

/* ─────────────────────────────────────────
   UTILITIES
───────────────────────────────────────── */
const wait = ms => new Promise(r => setTimeout(r, ms));

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function renderMath(el) {
  const run = () => {
    if (window.renderMathInElement && window.__katexReady) {
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
      setTimeout(run, 200);
    }
  };
  run();
}

/* Temporarily add a CSS class for a set duration */
function withClass(el, cls, ms) {
  return new Promise(resolve => {
    el.classList.add(cls);
    setTimeout(() => { el.classList.remove(cls); resolve(); }, ms);
  });
}

/* ─────────────────────────────────────────
   HEARTS / HUD
───────────────────────────────────────── */
function renderHearts(container, cur, max) {
  container.innerHTML = '';
  for (let i = 0; i < max; i++) {
    const s = document.createElement('span');
    s.className = 'heart' + (i >= cur ? ' lost' : '');
    s.textContent = i < cur ? '❤️' : '🖤';
    container.appendChild(s);
  }
}
const refreshHeroHearts  = ()         => renderHearts(hudHeroHearts,  heroHP, HERO_MAX_HP);
const refreshEnemyHearts = (hp, max)  => renderHearts(hudEnemyHearts, hp,    max);

/* ─────────────────────────────────────────
   DAMAGE POPUP
───────────────────────────────────────── */
function spawnDmg(anchorEl, label, type) {
  const d = document.createElement('div');
  d.className = 'dmg-popup ' + type;
  d.textContent = label;
  d.style.left = (anchorEl.offsetLeft + anchorEl.offsetWidth / 2 - 14) + 'px';
  d.style.top  = (anchorEl.offsetTop  - 24) + 'px';
  world.appendChild(d);
  d.addEventListener('animationend', () => d.remove(), { once: true });
}

/* ─────────────────────────────────────────
   CAMERA / PARALLAX
───────────────────────────────────────── */
function computeTx(cx) {
  const vw  = window.innerWidth;
  const raw = -(cx - vw / 2);
  return Math.min(0, Math.max(-(WORLD_W - vw), raw));
}

function applyCamera(x) {
  const tx = computeTx(x);
  world.style.transform = `translateX(${tx}px)`;
  bgLayers.forEach(layer => {
    const depth = parseFloat(layer.style.getPropertyValue('--depth')) || 0.1;
    layer.style.backgroundPositionX = (tx * depth) + 'px';
  });
}

function applyBattleZoom(heroWorldX, enemyWorldX) {
  const vw   = window.innerWidth;
  const vh   = window.innerHeight - 52 - 140; // viewport minus hud + dialogue
  const cx   = (heroWorldX + enemyWorldX) / 2;
  const tx   = computeTx(cx);
  const s    = 1.9;
  const ox   = cx + tx;
  const oy   = vh * 0.55;

  world.classList.add('zoom');
  world.style.transformOrigin = `${ox}px ${oy}px`;
  world.style.transform = `translateX(${tx}px) scale(${s})`;

  bgLayers.forEach(layer => {
    const depth = parseFloat(layer.style.getPropertyValue('--depth')) || 0.1;
    layer.style.backgroundPositionX = (tx * depth) + 'px';
  });
}

function clearBattleZoom() {
  world.classList.remove('zoom');
  world.style.transformOrigin = 'left top';
  applyCamera(heroX);
}

/* ─────────────────────────────────────────
   HERO POSITION
───────────────────────────────────────── */
function placeHero(x) {
  heroEl.style.left = x + 'px';
}

/* ─────────────────────────────────────────
   LOAD & SETUP ENEMIES
───────────────────────────────────────── */
async function loadEnemyJSON(id, file) {
  if (enemyData[id]) return enemyData[id];
  try {
    const r = await fetch(file);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const d = await r.json();
    enemyData[id] = d;
    return d;
  } catch(e) {
    console.error('Could not load', file, e);
    return null;
  }
}

/** Build animators and position enemies in the world */
function setupEnemySlot(id, worldX, frames, scale) {
  const slot   = $(id);
  const canvas = slot.querySelector('.enemy-canvas');
  slot.style.left = (worldX - canvas.width / 2) + 'px';

  const anim = new Animator(canvas, scale);
  enemyAnims[id] = anim;
  anim.play(frames, 6, true);   // idle loop
  return anim;
}

/* ─────────────────────────────────────────
   DIALOGUE HELPERS
───────────────────────────────────────── */
function showDlg({ left = null, right = null, html }) {
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

  dlgText.innerHTML = html;
  renderMath(dlgText);
}

function hideDlg() { dialogueEl.classList.add('hidden'); }

/** Returns a Promise that resolves on next document click (ignoring panel clicks) */
function waitClick() {
  return new Promise(resolve => {
    const handler = e => {
      if (e.target.closest('#move-panel') || e.target.closest('.move-btn')) return;
      document.removeEventListener('click', handler, true);
      resolve();
    };
    setTimeout(() => document.addEventListener('click', handler, true), 380);
  });
}

/* ─────────────────────────────────────────
   BATTLE STATE MACHINE
───────────────────────────────────────── */
const ENEMY_CONFIG = [
  {
    id: 'enemy1',
    json: 'data/enemy1.json',
    worldX: ENEMY_POS.enemy1,
    frameSets: PATHS.minion,
    scale: ENEMY_SCALE,
    avatarSrc: PATHS.minion.idle[0],
  },
  {
    id: 'enemy2',
    json: 'data/enemy2.json',
    worldX: ENEMY_POS.enemy2,
    frameSets: PATHS.minion,
    scale: ENEMY_SCALE,
    avatarSrc: PATHS.minion.idle[0],
  },
  {
    id: 'boss',
    json: 'data/boss.json',
    worldX: ENEMY_POS.boss,
    frameSets: PATHS.owl,
    scale: BOSS_SCALE,
    avatarSrc: PATHS.owl.idle[0],
  },
];

async function runBattle(cfg) {
  inBattle = true;
  walking  = false;

  // Switch hero to idle anim
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
  const fs       = cfg.frameSets;

  // HUD
  hudEnemyName.textContent = data.enemy.name;
  hudEl.classList.remove('hidden');
  refreshEnemyHearts(enemyHP, enemyMax);
  refreshHeroHearts();

  // Zoom camera to battle area
  applyBattleZoom(heroX, cfg.worldX);
  await wait(680);

  // Prepare shuffled question queue
  let qPool = shuffle([...data.questions]);
  let qIdx  = 0;

  /* ── Battle loop ── */
  while (enemyHP > 0 && heroHP > 0) {
    if (qIdx >= qPool.length) { qPool = shuffle([...data.questions]); qIdx = 0; }
    const q = qPool[qIdx++];

    /* 1 ── Show question */
    showDlg({ right: cfg.avatarSrc, html: q.question });
    buildMoveButtons(q.moves);
    movePanel.classList.add('open');

    /* 2 ── Wait for player choice */
    const chosen = await awaitMoveChoice(q.moves);
    movePanel.classList.remove('open');
    await wait(200);

    /* 3 ── Execute effect animation */
    const fx = chosen.effect;

    if (fx === 'crit') {
      // Hero attacks → enemy hurt x2
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
      // Enemy attacks, hero jumps (MISS)
      await playSingleAnim(eAnim, fs.attack, 10);
      eAnim.play(fs.idle, 6, true);
      spawnDmg(heroEl, 'MISS', 'miss');
      await withClass(heroEl, 'anim-jump', 460);

    } else /* fail */ {
      // Enemy attacks, hero hurt
      await playSingleAnim(eAnim, fs.attack, 10);
      eAnim.play(fs.idle, 6, true);
      await withClass(heroEl, 'anim-hurt', 460);
      spawnDmg(heroEl, '−1 💔', 'fail');
      heroHP = Math.max(0, heroHP - 1);
      refreshHeroHearts();
    }

    if (enemyHP <= 0 || heroHP <= 0) break;

    /* 4 ── Professor comment, wait click */
    showDlg({
      left: data.professor.image || cfg.avatarSrc,
      html: `<strong>${data.professor.name}：</strong>${chosen.professor}`,
    });
    await waitClick();
  }

  /* ── Battle resolution ── */
  movePanel.classList.remove('open');

  if (heroHP <= 0) {
    showDlg({
      left: data.professor.image || cfg.avatarSrc,
      html: `<strong>${data.professor.name}：</strong>你被无穷的力量压倒了……休息一下，重新研究判别法再来！`,
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

  /* Victory */
  // Play enemy death anim
  if (fs.die && fs.die.length) {
    await playSingleAnim(eAnim, fs.die, 8);
  }

  showDlg({
    left: data.professor.image || cfg.avatarSrc,
    html: `<strong>${data.professor.name}：</strong>精彩！「${data.enemy.name}」已被收敛！前进！`,
  });
  await wait(1300);
  hideDlg();
  hudEl.classList.add('hidden');

  // Clear zoom
  clearBattleZoom();
  heroAnim.play(PATHS.hero.idle, 6, true);
  await wait(150);

  // Victory jumps ×3
  for (let i = 0; i < 3; i++) {
    await withClass(heroEl, 'anim-vjump', 540);
    await wait(60);
  }

  // Fade out defeated enemy slot
  const slot = $(cfg.id);
  slot.style.transition = 'opacity .6s';
  slot.style.opacity    = '0';
  await wait(650);
  slot.style.display    = 'none';

  defeated.add(cfg.id);
  inBattle = false;
  walking  = true;
  heroAnim.play(PATHS.hero.run, 12, true);

  if (defeated.size === ENEMY_CONFIG.length) {
    walking = false;
    heroAnim.play(PATHS.hero.idle, 6, true);
    await wait(800);
    screenWin.classList.remove('hidden');
    gameOver = true;
  }
}

/* Play a frame sequence once on an Animator, then stop */
function playSingleAnim(anim, frames, fps) {
  return new Promise(resolve => {
    if (!frames || frames.length === 0) { resolve(); return; }
    anim.play(frames, fps, false).then(resolve);
  });
}

/* Build move buttons */
function buildMoveButtons(moves) {
  const NUMS = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ'];
  moveList.innerHTML = '';
  moves.forEach((m, i) => {
    const btn = document.createElement('button');
    btn.className = 'move-btn';
    btn.dataset.effect = m.effect;
    btn.textContent = `${NUMS[i]} ${m.name}`;
    moveList.appendChild(btn);
  });
}

/* Returns Promise<move> when player clicks a button */
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

/* ─────────────────────────────────────────
   MAIN GAME LOOP
───────────────────────────────────────── */
function gameLoop(ts) {
  const dt = Math.min(ts - lastTs, 50); // cap dt to avoid huge jumps
  lastTs = ts;

  // Tick hero sprite
  heroAnim.tick(dt);
  // Tick enemy sprites
  Object.values(enemyAnims).forEach(a => a.tick(dt));

  if (!gameOver && walking && !inBattle) {
    heroX = Math.min(heroX + HERO_SPEED, WORLD_W - 120);
    placeHero(heroX);
    applyCamera(heroX);

    // Check enemy triggers
    for (const cfg of ENEMY_CONFIG) {
      if (defeated.has(cfg.id)) continue;
      if (Math.abs(heroX - cfg.worldX) < TRIGGER_DIST) {
        runBattle(cfg);
        break;
      }
    }
  }

  requestAnimationFrame(gameLoop);
}

/* ─────────────────────────────────────────
   INIT
───────────────────────────────────────── */
async function init() {
  // Position hero
  placeHero(heroX);
  applyCamera(heroX);
  refreshHeroHearts();

  // Preload all hero frames
  await Promise.all([
    preloadGroup(PATHS.hero),
    preloadGroup(PATHS.minion),
    preloadGroup(PATHS.owl),
  ]);

  // Start hero idle animation
  heroAnim.play(PATHS.hero.idle, 6, true);

  // Set up enemy slots with idle animations
  setupEnemySlot('enemy1', ENEMY_POS.enemy1, PATHS.minion.idle, ENEMY_SCALE);
  setupEnemySlot('enemy2', ENEMY_POS.enemy2, PATHS.minion.idle, ENEMY_SCALE);
  setupEnemySlot('boss',   ENEMY_POS.boss,   PATHS.owl.idle,    BOSS_SCALE);

  // Preload all JSON data
  await Promise.all(ENEMY_CONFIG.map(c => loadEnemyJSON(c.id, c.json)));
}

/* ─────────────────────────────────────────
   BOOT
───────────────────────────────────────── */
btnStart.addEventListener('click', async () => {
  // Fade out start screen
  screenStart.style.transition = 'opacity .6s';
  screenStart.style.opacity    = '0';
  await wait(620);
  screenStart.classList.add('hidden');

  // Show game screen
  screenGame.classList.remove('hidden');

  // Init assets & world
  await init();

  // Start game loop
  requestAnimationFrame(ts => { lastTs = ts; gameLoop(ts); });

  // Slight delay then start walking
  await wait(400);
  walking = true;
  heroAnim.play(PATHS.hero.run, 12, true);
});
