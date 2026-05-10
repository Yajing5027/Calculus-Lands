# ∑ Calculus Lands: The Infinite Trek

> This project is a 2026 Spring Calculus II course project. While coding was not a curriculum requirement, this is an innovative project built to apply and master course knowledge through interactive mechanics and real-time conceptual feedback.

**🎮 [Play Now → yajing5027.github.io/Calculus-Lands](https://yajing5027.github.io/Calculus-Lands/)**

---

## What Is This?

**Calculus Lands** is a browser-based side-scrolling RPG built to make Calculus II *feel* like something. Instead of drilling series tests through repetition, the game puts you in turn-based battles where each move is a convergence test — and your job is to read the series in front of you and pick the right one.

There are no calculations. Your weapon is intuition. Your opponent is the illusion that every test works every time.

---

## Story

A letter arrives from **Dr. H**:

> *"Our Calculus Continent is filled with illusions. They pretend to be convergent series, perfect elementary functions, or simple integrals. If you act without thinking, the abyss will swallow you."*

You play as **Sigma**, a wandering adventurer traveling through five mathematical lands. In each land, the **Chaos Knight Limitus** has planted intuition traps among the soldiers. At the end of every land, **Owlculus** — Guardian of the Five Lands — waits as the final boss.

When the journey ends, Owlculus reveals the truth: he was never your enemy. He was your final examiner, placed there by Dr. H.

---

## The Five Lands

Each land covers a major theme from Calculus II, with battles designed around the intuition traps specific to that topic:

| Land | Theme |
|---|---|
| 🏚️ **Silicon Depths** | Applications of Integration |
| 🌿 **Substitution Labyrinth** | Integration Techniques |
| 🌀 **Parametric Veil** | Parametric & Polar Coordinates |
| 🕳️ **Infinite Chasm** | Sequences, Series & Convergence Tests |
| 🗼 **Alternating Spire** | Alternating Series, Power Series & Taylor Series |

---

## Battle System & Difficulty Scaling

Every battle (taking **Map 5: Alternating Spire** as the representative model) is a **turn-based question round**. Each land consists of **three encounters** with increasing difficulty:

### 1. The Encounter Flow

You play as Sigma, In each land, you must defeat three enemies in sequence. The question difficulty and enemy stats scale accordingly:

* **Round 1:** 🗡️ **Limitus (Weak)** — HP 2. Focuses on basic recognition.
* **Round 2:** 🗡️ **Limitus (Elite)** — HP 4. Introduces complex series forms.
* **Round 3:** 🦉 **Owlculus (Boss)** — HP 8. Tests comprehensive mastery and edge cases.

### 2. Turn Mechanics

1. **The enemy presents a series** (rendered in LaTeX via KaTeX).
2. **You choose one move** from four tactical options (Convergence Tests).
3. **The Result Plays Out:** The combat animations reflect your mathematical accuracy:

| Outcome | Animation & Narrative | Effect |
| --- | --- | --- |
| 💥 **Crit** | **Precision Strike:** Sigma attacks; enemy sustains heavy hit. | Enemy takes **2 damage** |
| ⚔️ **Normal** | **Standard Hit:** Sigma attacks; enemy sustains hit. | Enemy takes **1 damage** |
| 🌀 **Dodge** | **Evasion:** Enemy attacks; Sigma performs a jump dodge. | **No damage** (Inconclusive) |
| 💔 **Fail** | **Counter-hit:** Enemy attacks; Sigma sustains damage. | **Sigma loses 1 Heart** |

### 3. Conceptual Feedback

After every move—regardless of the outcome—**Dr. H** appears to provide instant pedagogical feedback. He explains the "why" behind the result, addressing specific misconceptions associated with that particular series and the test you selected.

---

## Topics Tested

Questions are drawn from across Calculus II convergence theory:

- Alternating Series Test (Leibniz criterion)
- Ratio Test and Root Test
- Direct and Limit Comparison Tests
- Integral Test
- p-Series and Geometric Series recognition
- Absolute vs. Conditional convergence classification
- Radius and Interval of Convergence for Power Series
- Taylor and Maclaurin Series recognition
- nth-Term Divergence Test (and why it cannot prove convergence)

---

## How to Play

**Online:** [yajing5027.github.io/Calculus-Lands](https://yajing5027.github.io/Calculus-Lands/) — no install needed.

**Local:**
```bash
git clone https://github.com/Yajing5027/Calculus-Lands.git
cd Calculus-Lands
python -m http.server 8080
# Then open http://localhost:8080
```
> A local server is required because the game fetches JSON data files. Opening `index.html` directly in a browser will not work.

---

## Project Structure

```
Calculus-Lands/
├── index.html              # Game shell and all screens
├── main.js                 # Game engine: animation, camera, battle loop
├── styles.css              # All visual styles
├── data/
│   ├── map1/               # Silicon Depths
│   │   ├── enemy1.json
│   │   ├── enemy2.json
│   │   └── boss.json
│   ├── map2/               # Substitution Labyrinth
│   ├── map3/               # Parametric Veil
│   ├── map4/               # Infinite Chasm
│   └── map5/               # Alternating Spire
└── assets/
    └── animations/
        ├── background/forest/layers/   # 12 parallax background layers
        ├── characters/
        │   ├── protagonist_redreaper/  # Sigma: idle, run, attack frames
        │   └── enemies/
        │       ├── minion/red_warrior/ # Limitus sprites
        │       └── owl_boss/           # Owlculus sprites + death sequence
        └── Dr.H.png                    # Professor avatar
```

---

## Technical Notes

- **Pure vanilla** HTML + CSS + JavaScript — no framework, no build step
- **Canvas-based sprite animation** with a custom `Animator` class (frame-by-frame, pixel-perfect)
- **KaTeX** renders all mathematical formulas in the dialogue box
- **Parallax scrolling** across 12 independent background layers
- **Battle zoom** focuses the camera on the midpoint between Sigma and the enemy during combat
- **Question data** is loaded from JSON at runtime, making it easy to add or swap content per land
- A **hint toggle** lets players see color-coded move quality (Crit / Normal / Dodge / Fail) before choosing

---

## Credits

- **Concept & Game Design:** Yajing Ren
- **Question Content:** Calculus II curriculum — series convergence, power series, Taylor series
- **Art:** Pixel sprite assets ([itch.io free assets](https://itch.io))
- **Math Rendering:** [KaTeX](https://katex.org/)

---

## License

This project is for educational and personal use.
