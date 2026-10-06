# ∑ Calculus Lands: The Infinite Trek

> A 2026 Spring Calculus II course project that turns mathematical intuition into a playable adventure.

**[Play Calculus Lands →](https://yajing5027.github.io/Calculus-Lands/)**

## What is this?

Calculus Lands is a browser-based side-scrolling RPG built to make Calculus II *feel* like something. Instead of drilling series tests through repetition, the original campaign puts you in battles where each move is a mathematical choice—and your job is to decide which idea applies.

Your weapon is intuition. Your opponent is the illusion that every test works every time. Creator Mode also lets you bring another lesson and turn it into a quest. You can play in your browser without installing anything.

## The story

A letter arrives from Dr. H:

> “Our Calculus Continent is filled with illusions. They pretend to be convergent series, perfect elementary functions, or simple integrals. If you act without thinking, the abyss will swallow you.”

You play as Sigma, a wandering adventurer traveling through five mathematical lands. In each land, the Chaos Knight Limitus sets traps for your intuition. Owlculus, Guardian of the Five Lands, waits as the final boss. When the journey ends, Owlculus reveals that he was your final examiner, placed there by Dr. H.

## Play the built-in campaign

Choose **Begin Trek** to travel through the five lands. Each land has two Limitus encounters followed by an Owlculus battle.

| Land | What you explore |
| --- | --- |
| Silicon Depths | Applications of Integration |
| Substitution Labyrinth | Integration Techniques |
| Parametric Veil | Parametric and Polar Coordinates |
| Infinite Chasm | Sequences, Series, and Convergence Tests |
| Alternating Spire | Alternating, Power, and Taylor Series |

## Battle system

The three encounters in a land grow from introductory recognition through more demanding questions to an Owlculus boss fight. In the original fifth land, the two Limitus opponents have four health points each and Owlculus has eight.

Every turn presents a mathematical question and a choice of moves. The result plays out in the battle animation:

| Outcome | What happens |
| --- | --- |
| **Crit** | Sigma lands a precision strike; the enemy loses two health points. |
| **Normal** | Sigma lands a standard hit; the enemy loses one health point. |
| **Dodge** | Sigma avoids a counterattack; neither side loses health. |
| **Fail** | The enemy counterattacks; Sigma loses one heart. |

Dr. H explains the reasoning after each move, including why a tempting answer does not work. A hint toggle can show the quality of the moves before you choose.

The campaign includes series and convergence ideas such as:

- alternating, ratio, root, direct and limit comparison, integral, and nth-term divergence tests;
- p-series and geometric series;
- absolute versus conditional convergence;
- radius and interval of convergence; and
- Taylor and Maclaurin series.

The other lands bring in integration and parametric or polar topics.

## Create your own quest

Choose **Create / Load Quest** to turn a lesson into a playable journey. Creator Mode accepts **Simple Text, Markdown, or JSON**; Auto Detect can choose the format for you. You can also load the included Algebra and Physics Motion samples.

The builder lets you name the quest, paste learning content, and preview its levels, enemies, questions, and any validation warnings before play. Then you can play through the same battle system and see a learning report with attempts, feedback, and ideas to revisit. You can save the current draft in this browser and export a normalized JSON quest to share or keep.

### Start with Simple Text

```text
Title: Derivatives Quest
Subject: Calculus I
Description: Practice derivative rules through RPG battles.

Level: Chain Rule Forest
Theme: Derivatives

Enemy: Product Goblin
HP: 3

Q: Differentiate f(x)=x^2 sin(x).
Formula: f'(x)=?
Tags: derivatives, product rule
Difficulty: medium
A: 2x sin(x) + x^2 cos(x) | crit | Correct. Use the product rule.
A: 2x cos(x) | fail | This ignores the product structure.
A: x^2 cos(x) | normal | This differentiates only the sine part.
```

Add more `Level:`, `Enemy:`, `Q:`, and `A:` blocks as your lesson grows. An answer line has the form `A: answer | effect | feedback`; the effects are `crit`, `normal`, `dodge`, and `fail`.

### Markdown and JSON

In Markdown, use a `#` heading for the quest, `##` for a level, `###` for an enemy, and bullets for answer moves. Labels such as `Subject:`, `Theme:`, `Formula:`, and `Tags:` work in the content too.

JSON can load an exported quest or compatible level, enemy, and question objects. **Export Quest** produces the normalized format, which is the safest choice when moving a finished quest between browsers.

Creator Mode checks that your quest has playable levels, enemies, questions, and answer moves. If something is missing, it shows a readable warning instead of starting a broken battle. Custom quests can use up to five playable levels and reuse the existing art and battle scene; additional enemies in a level are combined into the boss encounter.

## Your progress and current limits

Creator drafts are stored in the current browser. There are no accounts, cloud sync, classroom assignments, or shared progress. Export a quest if you want a portable copy. The learning report describes the current play session; it is not a long-term grade record.

## Play online or locally

**Online:** [Open Calculus Lands](https://yajing5027.github.io/Calculus-Lands/).

**Local copy of the playable release:**

```bash
git clone https://github.com/Yajing5027/Calculus-Lands.git
cd Calculus-Lands
python3 -m http.server 8080
```

Open <http://localhost:8080>. A local server is needed because the built-in campaign loads its question files from JSON. The public repository contains the playable release; the original development source and history live separately.

The game uses canvas sprite animation, layered scrolling backgrounds, and KaTeX for mathematical expressions. The published question data can be inspected under `data/map1` through `data/map5`.

## Credits

- **Concept and game design:** Yajing Ren
- **Learning content:** Calculus II curriculum
- **Art:** Pixel sprite assets from itch.io creators
- **Math rendering:** [KaTeX](https://katex.org/)

## License

This project is for educational and personal use.
