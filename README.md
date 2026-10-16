# ∑ Calculus Lands: The Infinite Trek

**A browser-based RPG that turns Calculus II into an adventure where mathematical reasoning becomes your weapon.**

Individual Project · Spring 2026 · JavaScript, HTML, CSS, KaTeX

[**Play the Game →**](https://yajing5027.github.io/Calculus-Lands/) · [Gameplay](#the-adventure) · [Creator Mode](#create-your-own-quest) · [Implementation](#design--implementation)

---

## Why I Built It

Calculus Lands began as my final project for Calculus II. Instead of preparing a traditional presentation, I wanted to build something interactive—something where mathematical concepts could become part of an experience rather than simply appear on slides.

That idea became a browser-based RPG in which every battle is driven by a mathematical decision. Players must recognize which method applies, distinguish between convincing and misleading approaches, and discover the consequences of their choices through combat and feedback.

As the project developed, I also wanted to explore whether the game could support subjects beyond Calculus II. This led to Creator Mode, which lets users transform their own learning materials into playable adventures using the same battle system.

## Project Highlights

- **Five Mathematical Lands:** An original Calculus II campaign with themed environments, enemies, and increasingly challenging encounters.
- **Reasoning-Driven Combat:** Mathematical choices determine attacks, dodges, damage, and feedback.
- **Creator Mode:** Transform Simple Text, Markdown, or JSON learning materials into custom RPG quests.
- **Content-Driven Design:** Separate mathematical content from combat logic so the same game mechanics support different subjects.
- **Animated Experience:** Pixel-art characters, sprite-based combat, parallax backgrounds, and KaTeX-rendered mathematics.

## The Adventure

### Enter the Calculus Continent

A mysterious letter arrives from Dr. H. The Calculus Continent is filled with illusions—mathematical expressions that appear simple but hide dangerous traps for anyone who acts without thinking.

You play as **Sigma**, a wandering adventurer traveling through five mathematical lands.

Along the way, **Chaos Knight Limitus** challenges your mathematical intuition. Some enemies disguise divergent series as convergent ones. Others tempt you into choosing a familiar method even when it cannot solve the problem.

Your weapon is mathematical reasoning. Choosing the right approach can deliver a powerful strike; choosing carelessly may cost you a heart.

At the end of each land stands **Owlculus**, the Guardian of the Five Lands. And when the final battle ends, Owlculus reveals his true role: the final examiner placed there by Dr. H.

### Explore the Five Lands

| Land                       | Mathematical Challenge                   |
| -------------------------- | ---------------------------------------- |
| **Silicon Depths**         | Applications of Integration              |
| **Substitution Labyrinth** | Integration Techniques                   |
| **Parametric Veil**        | Parametric and Polar Coordinates         |
| **Infinite Chasm**         | Sequences, Series, and Convergence Tests |
| **Alternating Spire**      | Alternating, Power, and Taylor Series    |

Each land contains two Limitus encounters followed by an Owlculus boss battle, moving from introductory recognition toward more challenging mathematical decisions.

### Battle With Mathematics

Every turn presents a mathematical question and several possible moves. But not every reasonable-looking answer is equally effective.

| Outcome          | What Happens                                       |
| ---------------- | -------------------------------------------------- |
| **Critical Hit** | A precise mathematical choice strikes for 2 damage |
| **Normal Hit**   | A useful but incomplete choice deals 1 damage      |
| **Dodge**        | Sigma avoids danger without dealing damage         |
| **Fail**         | The enemy counterattacks and Sigma loses a heart   |

Dr. H explains the mathematical reasoning after each move, including why tempting alternatives do not work. Players can also enable hints that reveal the quality of their available moves.

The goal is not simply to remember a formula, but to recognize when—and why—a mathematical method works.

## Create Your Own Quest

The original campaign takes place in Calculus II, but the battle system is designed to work with other learning content.

With **Creator Mode**, users can turn a lesson into a playable RPG without changing the underlying game code.

Creator Mode supports:

- **Simple Text, Markdown, and JSON** input
- Custom levels, enemies, questions, and answer feedback
- Automatic parsing and content validation
- Quest previews before gameplay
- Session-level learning reports
- Local draft saving and JSON export

For example, a player can create an Algebra Quest where solving equations defeats enemies, or a Physics Quest where choosing the right formula determines an attack.

The game includes sample Algebra and Physics Motion quests to demonstrate these possibilities.

## Design & Implementation

Calculus Lands runs entirely in the browser using JavaScript, HTML, and CSS, with KaTeX for mathematical rendering.

A key design decision was to separate learning content from the game's interaction mechanics.

| Component              | Purpose                                                   |
| ---------------------- | --------------------------------------------------------- |
| **Game System**        | Battle logic, animations, navigation, and player feedback |
| **Content Engine**     | Parsing, validation, and normalization of custom quests   |
| **JSON Question Sets** | Mathematical content for the five original lands          |
| **Visual System**      | Canvas sprite animation and layered scrolling backgrounds |
| **KaTeX**              | Rendering mathematical expressions                        |

The original campaign loads questions from JSON files, while Creator Mode converts user-written materials into the same playable structure.

This allows different educational topics to share the game's combat mechanics and visual presentation without rebuilding the game for each subject.

## Play Online or Run Locally

[**Launch Calculus Lands →**](https://yajing5027.github.io/Calculus-Lands/)

Play directly in your browser. No account or installation is required.

To run the published version locally:

```bash
git clone https://github.com/Yajing5027/Calculus-Lands.git
cd Calculus-Lands
python3 -m http.server 8080
```

Open `http://localhost:8080`.

A local server is needed to load the campaign's JSON question files.

## Project Scope & Credits

Calculus Lands was developed as an individual Spring 2026 Calculus II final project.

The current version includes the five-land campaign and Creator Mode, supporting up to five playable levels per custom quest. Custom drafts are saved in the current browser, and learning reports cover individual sessions rather than long-term academic progress.

The public repository contains the playable release. Original development source and history are maintained separately.

**Concept, game design, and development:** Yajing Ren  
**Educational content:** Calculus II curriculum  
**Visual assets:** Third-party pixel-art assets from itch.io creators  
**Math rendering:** [KaTeX](https://katex.org/)

This project is presented for educational and personal use. Third-party assets remain subject to their respective licenses.
