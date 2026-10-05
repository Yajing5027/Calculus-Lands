(function(k){"use strict";const w=["crit","normal","dodge","fail"],A=new WeakMap;function o(t){return t==null?"":String(t).trim()}function g(t,e){return o(t).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||e}function d(t){return Array.isArray(t)?t:t==null||t===""?[]:[t]}function x(t){return Array.isArray(t)?t.map(o).filter(Boolean):o(t).split(/[,;]+/).map(o).filter(Boolean)}function T(){return{id:"",title:"",subtitle:"",subject:"",description:"",heroName:"Sigma",levels:[]}}function E(t){const e=o(t);return e?/^[\[{]/.test(e)?"json":/^#{1,3}\s+\S/m.test(e)||/^[-*]\s+.+\|\s*(crit|normal|dodge|fail)\b/im.test(e)?"markdown":"simple":"simple"}function b(t){const e=T(),a=String(t||"").replace(/\r\n?/g,`
`).split(`
`);let s=null,n=null,i=null;function l(){return s||(s={name:"",theme:"",description:"",enemies:[]},e.levels.push(s)),s}function r(){return n||(n={name:"",role:"",hp:null,avatarType:"",questions:[]},l().enemies.push(n)),n}for(const f of a){const u=f.trim();if(!u||/^\/\//.test(u))continue;const p=u.replace(/^[-*]\s+/,"").match(/^(?:A|Answer)\s*:\s*(.+)$/i);if(p){i||(i={prompt:"",formula:"",explanation:"",tags:[],difficulty:"",moves:[]},r().questions.push(i));const $=p[1].split("|").map(o);i.moves.push({text:$[0]||"",effect:($[1]||"normal").toLowerCase(),feedback:$.slice(2).join(" | ")});continue}const y=u.match(/^([A-Za-z][A-Za-z ]*)\s*:\s*(.*)$/);if(!y)continue;const c=y[1].trim().toLowerCase(),m=y[2].trim();c==="title"?e.title=m:c==="subtitle"?e.subtitle=m:c==="subject"?e.subject=m:c==="hero"||c==="hero name"?e.heroName=m:c==="level"?(s={name:m,theme:"",description:"",enemies:[]},e.levels.push(s),n=null,i=null):c==="theme"?l().theme=m:c==="enemy"?(n={name:m,role:"",hp:null,avatarType:"",questions:[]},l().enemies.push(n),i=null):c==="hp"||c==="health"?r().hp=m:c==="role"?r().role=m:c==="avatar"||c==="avatar type"?r().avatarType=m:c==="q"||c==="question"?(i={prompt:m,formula:"",explanation:"",tags:[],difficulty:"",moves:[]},r().questions.push(i)):c==="formula"?i&&(i.formula=m):c==="explanation"?i&&(i.explanation=m):c==="tags"?i&&(i.tags=x(m)):c==="difficulty"?i&&(i.difficulty=m):c==="description"&&(n&&!i?n.description=m:s?s.description=m:e.description=m)}return e}function q(t){const e=String(t||"").replace(/\r\n?/g,`
`);let a=!1;const s=e.split(`
`).map(i=>{const l=i.trim();let r=l.match(/^#\s+(.+)$/);return r?(a=!0,`Title: ${r[1]}`):(r=l.match(/^##\s+(.+)$/),r?`Level: ${r[1]}`:(r=l.match(/^###\s+(.+)$/),r?`Enemy: ${r[1]}`:(r=l.match(/^[-*]\s+(.+\|\s*(?:crit|normal|dodge|fail)\b.*)$/i),r?`A: ${r[1]}`:i)))}).join(`
`),n=b(s);if(!a&&!n.title){const i=e.match(/^#{1,3}\s+(.+)$/m);i&&(n.title=i[1].trim())}return n}function S(t){try{return JSON.parse(String(t||""))}catch(e){const a=/position\s+(\d+)/i.exec(e.message||"");let s="";throw a&&(s=` near line ${String(t||"").slice(0,Number(a[1])).split(`
`).length}`),new Error(`JSON could not be read${s}. ${e.message}`)}}function F(t,e){if(typeof t=="string")return{text:o(t),effect:"normal",feedback:""};const a=t||{};return{text:o(a.text||a.name||a.answer||a.label||`Answer ${e+1}`),effect:o(a.effect||a.result||a.outcome||"normal").toLowerCase(),feedback:o(a.feedback||a.professor||a.explanation||a.reason)}}function P(t,e,a,s){const n=typeof t=="string"?{prompt:t}:t||{},i=n.moves||n.answers||n.options||n.choices||[],l=o(n.prompt||n.question||n.text||n.label);return l||a.push(`${s}, question ${e+1} had no prompt; a readable placeholder was added.`),{id:o(n.id)||`question-${e+1}`,prompt:l||`Question ${e+1}`,formula:o(n.formula||n.latex||n.equation),explanation:o(n.explanation||n.rationale||n.feedback),tags:x(n.tags||n.tag||n.topic),difficulty:o(n.difficulty||n.level),moves:d(i).map(F)}}function D(t,e,a,s){const n=t||{},i=n.enemy&&typeof n.enemy=="object"?n.enemy:{},l=o(n.name||n.title||i.name),r=l||`Enemy ${e+1}`;l||a.push(`${s}, enemy ${e+1} had no name; \u201C${r}\u201D was added.`);const f=n.hp??n.maxHP??i.hp??i.maxHP;let u=Number.parseInt(f,10);(!Number.isFinite(u)||u<1)&&(u=3,a.push(`${s}, ${r} had no valid HP; it now has 3 HP.`));const h=n.questions||n.items||n.prompts||[];return{id:o(n.id)||g(r,`enemy-${e+1}`),name:r,role:o(n.role||i.role),hp:u,avatarType:o(n.avatarType||n.avatar||i.avatarType),questions:d(h).map((p,y)=>P(p,y,a,`${s}, ${r}`))}}function H(t,e,a){const s=t||{},n=o(s.name||s.title||s.level||s.land),i=n||`Level ${e+1}`;n||a.push(`Level ${e+1} had no name; \u201C${i}\u201D was added.`);let l=s.enemies||s.encounters||s.opponents||[];return!d(l).length&&d(s.questions).length&&(l=[{name:s.enemyName||"",hp:s.hp,questions:s.questions}]),{id:o(s.id)||g(i,`level-${e+1}`),name:i,theme:o(s.theme||s.topic||s.subject),description:o(s.description||s.desc),enemies:d(l).map((r,f)=>D(r,f,a,i))}}function L(t){let e=t;Array.isArray(e)&&(e={questions:e}),e=e&&typeof e=="object"?e.pack||e.quest||e:{};const a=[],s=o(e.title||e.name),n=s||"Untitled Learning Quest";s||a.push("The quest had no title; \u201CUntitled Learning Quest\u201D was added.");let i=e.levels||e.lands||e.maps||e.stages||[];!d(i).length&&d(e.enemies).length&&(i=[{name:e.levelName||"",theme:e.theme,enemies:e.enemies}]),!d(i).length&&d(e.questions).length&&(i=[{name:e.levelName||"",theme:e.theme,enemies:[{name:e.enemyName||"",hp:e.hp,questions:e.questions}]}]);const l={id:o(e.id)||g(n,"learning-quest"),title:n,subtitle:o(e.subtitle),subject:o(e.subject||e.topic||"General Learning"),description:o(e.description||e.desc),heroName:o(e.heroName||e.hero||"Sigma"),levels:d(i).map((r,f)=>H(r,f,a))};return A.set(l,a),l}function N(t){const e=[],a=[...A.get(t)||[]];return!t||typeof t!="object"?{isValid:!1,errors:["No quest pack was created."],warnings:a}:(o(t.title)||e.push("Add a quest title."),(!Array.isArray(t.levels)||!t.levels.length)&&e.push("Add at least one level."),(t.levels||[]).length>5&&a.push("Only the first 5 levels can be played in this version."),(t.levels||[]).forEach((s,n)=>{const i=o(s.name)||`Level ${n+1}`;if(!Array.isArray(s.enemies)||!s.enemies.length){e.push(`${i} needs at least one enemy.`);return}s.enemies.length>3&&a.push(`${i} has ${s.enemies.length} enemies; enemies 3+ will combine into one boss battle.`),s.enemies.forEach((l,r)=>{const f=o(l.name)||`Enemy ${r+1}`;if(!Array.isArray(l.questions)||!l.questions.length){e.push(`${i} \u2192 ${f} needs at least one question.`);return}l.questions.forEach((u,h)=>{const p=`${i} \u2192 ${f} \u2192 question ${h+1}`;if(o(u.prompt)||e.push(`${p} needs a prompt.`),!Array.isArray(u.moves)||u.moves.length<2){e.push(`${p} needs at least two answer moves.`);return}const y=u.moves.map(c=>o(c.effect).toLowerCase());y.forEach((c,m)=>{w.includes(c)||e.push(`${p}, answer ${m+1} uses \u201C${c||"blank"}\u201D. Use crit, normal, dodge, or fail.`)}),y.includes("crit")||a.push(`${p} has no crit (best) answer.`),u.moves.forEach((c,m)=>{o(c.text)||e.push(`${p}, answer ${m+1} needs text.`),o(c.feedback)||a.push(`${p}, answer ${m+1} has no feedback.`)})})})}),{isValid:e.length===0,errors:e,warnings:a})}function C(t){const e={title:t&&t.title?t.title:"",subject:t&&t.subject?t.subject:"",levelCount:0,enemyCount:0,questionCount:0,outline:[]};return(t&&t.levels||[]).forEach((a,s)=>{const n={id:a.id,name:a.name||`Level ${s+1}`,enemies:[]};e.levelCount+=1,(a.enemies||[]).forEach((i,l)=>{const r=(i.questions||[]).length;e.enemyCount+=1,e.questionCount+=r,n.enemies.push({id:i.id,name:i.name||`Enemy ${l+1}`,questionCount:r})}),e.outline.push(n)}),e}function M(t){return{id:t.id,question:t.prompt,formula:t.formula,explanation:t.explanation,tags:[...t.tags||[]],difficulty:t.difficulty,moves:t.moves.map(e=>({name:e.text,effect:e.effect,professor:e.feedback||t.explanation||"Review the idea and try another move."}))}}function z(t){return(t.levels||[]).slice(0,5).map((e,a)=>{const s=(e.enemies||[]).slice();let n;return s.length<=2?n=s.map(i=>[i]):n=[[s[0]],[s[1]],s.slice(2)],{id:a+1,sourceId:e.id,name:e.name,theme:e.theme,desc:e.description,enemies:n.map((i,l)=>{const r=n.length>=3&&l===2,f=i[0],u=i.length>1?`${f.name} & allies`:f.name;return{id:r?"boss":`enemy${l+1}`,sourceId:i.map(h=>h.id).join("+"),name:u,role:f.role||(r?"boss":"guardian"),avatarType:f.avatarType||(r?"boss":"minion"),maxHP:i.reduce((h,p)=>h+Math.max(1,Number(p.hp)||3),0),questions:i.flatMap(h=>h.questions.map(M))}})}})}function j(t,e){const a=e&&e!=="auto"?e:E(t);let s;if(a==="json")s=S(t);else if(a==="markdown")s=q(t);else if(a==="simple")s=b(t);else throw new Error(`Unsupported format: ${a}`);const n=L(s);return{format:a,pack:n,validation:N(n),summary:C(n)}}const v=[{id:"algebra",label:"Algebra Quest",format:"simple",content:`Title: Algebra Quest
Subject: Algebra I
Description: Restore balance to the Valley of Variables.
Hero: Nova

Level: Valley of Variables
Theme: Linear equations
Description: Solve equations and spot equivalent expressions.

Enemy: Coefficient Goblin
Role: Gatekeeper
HP: 3

Q: Solve 3x + 5 = 20.
Formula: 3x + 5 = 20
Tags: equations, inverse operations
Difficulty: easy
A: x = 5 | crit | Correct. Subtract 5, then divide by 3.
A: x = 15 | fail | You subtracted 5 but forgot to divide by 3.
A: x = 25/3 | normal | Check the subtraction: 20 - 5 is 15, not 25.

Q: Which expression is equivalent to 2(x + 4)?
Tags: distributive property
Difficulty: easy
A: 2x + 8 | crit | Correct. Distribute 2 to both terms.
A: 2x + 4 | fail | The 4 must also be multiplied by 2.
A: x + 8 | fail | The x term must also be multiplied by 2.

Enemy: Slope Warden
HP: 4

Q: What is the slope through (1, 2) and (4, 11)?
Formula: m = (y_2-y_1)/(x_2-x_1)
Tags: slope, coordinate plane
Difficulty: medium
A: 3 | crit | Correct. The rise is 9 and the run is 3.
A: 1/3 | dodge | You inverted rise and run.
A: 9 | fail | Nine is the rise, not the slope.`},{id:"physics-motion",label:"Physics Motion Quest",format:"markdown",content:`# Physics Motion Quest

Subject: Introductory Physics
Description: Cross the Kinetic Frontier by reasoning about motion.
Hero: Vector

## Kinetic Frontier

Theme: Motion and forces
Description: Read velocity, acceleration, and force relationships.

### Velocity Shade

HP: 3

Q: A runner travels 100 m in 20 s at constant speed. What is the speed?
Formula: v = d/t
Tags: speed, units
Difficulty: easy

* 5 m/s | crit | Correct. Divide distance by elapsed time.
* 80 m/s | fail | Subtracting time from distance does not produce speed.
* 2000 m/s | fail | Multiplying distance and time uses the wrong relationship.

Q: A car's velocity changes from 4 m/s to 10 m/s in 3 s. What is its average acceleration?
Formula: a = (v_f-v_i)/t
Tags: acceleration, motion
Difficulty: medium

* 2 m/s^2 | crit | Correct. The velocity changes by 6 m/s over 3 s.
* 6 m/s^2 | normal | Six is the velocity change; divide it by 3 seconds.
* 14 m/s^2 | fail | Adding the velocities does not give acceleration.

### Force Sentinel

HP: 4

Q: A 2 kg object accelerates at 3 m/s^2. What net force acts on it?
Formula: F = ma
Tags: Newton's second law, force
Difficulty: medium

* 6 N | crit | Correct. Multiply mass by acceleration.
* 1.5 N | dodge | Dividing mass by acceleration does not match F = ma.
* 5 N | fail | Adding mass and acceleration mixes unlike units.`}];function W(){return v.map(t=>({...t}))}function _(t){const e=v.find(a=>a.id===t)||v[0];return j(e.content,e.format).pack}const Q={ALLOWED_EFFECTS:[...w],createEmptyPack:T,createSamplePack:_,getSampleQuests:W,detectInputFormat:E,parseSimpleText:b,parseMarkdownQuest:q,parseJsonQuest:S,parseQuestInput:j,normalizePack:L,validatePack:N,packToRuntimeLevels:z,summarizePack:C};k.ContentEngine=Q,typeof module<"u"&&module.exports&&(module.exports=Q)})(typeof window<"u"?window:globalThis);
