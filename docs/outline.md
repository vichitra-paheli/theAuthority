Political Simulation Game Project Plan & Architecture Outline
Introduction

This project is a single-player political simulation game built with Unity, where the player takes on the role of a young politician managing a local town. The core gameplay revolves around proposing and enacting policies to satisfy various demographics, each with distinct interests. The unique feature is the integration of a Large Language Model (LLM) agent for each demographic, enabling dynamic, open-ended policy inputs from the player and realistic textual feedback. After each turn (e.g. a month or quarter in game time), the game updates the world state through a causal loop simulation similar to Democracy 4 – meaning that policies and events feed into a network of variables and feedback loops that model the economy, social happiness, budget, etc.
steamcommunity.com
. The primary user interface is designed as a realistic email inbox on a PC desktop, immersing the player in a bureaucratic setting: the player receives emails about issues or tasks and responds by formulating policies or allocating budget. In addition, in-game tools (charts, reports, budgets) are accessible via the interface to help track the office’s status. The target platform is PC (Steam), and the art style will mimic real-world email and office software for realism. Although a solo developer will implement this, the architecture emphasizes modding and extensibility, allowing future additions of content (new demographics, policies, events) with minimal code changes.

Project Plan

Overview: Development will proceed in iterative phases focused on building core systems first, then content and polish. Since timeline is not a primary concern (quality is the priority), each phase can be revisited for improvements. The plan ensures a solid foundation (simulation + LLM integration) before adding content and UI polish. Below is a breakdown of key phases and tasks:

Phase 1: Design & Planning

Game Design Definition: Finalize the design document – detailing the four initial demographics (e.g. Youth, Elderly, Business Owners, Environmentalists), their general ideologies, and key attributes to track (happiness, economic activity, support for player, etc.). Define what policy areas or examples might be (even though player can input any policy text, it’s good to have example categories like infrastructure, taxes, social programs for testing). Also decide on world state variables for the causal simulation (e.g. local GDP, unemployment rate, environment quality, public budget level).

Causal Loop Modeling: Sketch a causal loop diagram of how variables and demographics interconnect. For example, a policy affecting “Taxes” might influence the IncomeTax object which in turn affects the happiness of the MiddleClass demographic in Democracy 4
steamcommunity.com
. Similarly, define relationships such as “Unemployment up -> happiness down”, “Budget deficit up -> future spending down” etc. Plan these as a network of influences (nodes and directed links) so that each turn’s state can be computed.

LLM Agent Specification: Decide how the LLM will represent each demographic’s “mind”. Outline prompt formats for the LLM: e.g. a system prompt that defines the demographic’s background and current sentiment, and an instruction for output format. Because we need structured outputs (numbers for happiness, etc.), plan to have the LLM output a consistent format (possibly JSON or a list of values). For example: “Output the demographic’s reaction in JSON with fields happiness_change, budget_comfort_change, economic_activity_change… and a short justification text.” Research how to constrain LLM output format – possibly using a grammar or function-calling approach so the model reliably produces machine-readable results
github.com
.

Technical Research: Investigate Unity integration options for running LLMs locally. Identify the ChatGPT OSS 20B model and how to run it efficiently on PC (likely using a library like llama.cpp or Unity plugin). Confirm that it can run reasonably on targeted hardware and whether quantization is needed to fit in memory. Look into existing Unity assets or libraries (e.g. the open-source LLMUnity plugin) that allow local inference. For example, LLMUnity by UndreamedAI demonstrates running LLMs in Unity offline with support for major models and fast CPU/GPU inference
github.com
. Determining this early will influence how we structure the code (in-process vs. external process for the AI).

Modding Strategy: Outline how mods will work. Given we want future modding, plan to make game data-driven. Take inspiration from Democracy 4, which loads nearly all simulation elements from external CSV/text files that modders can edit
steamcommunity.com
. Decide on a data format (CSV or JSON) for defining demographics, policy effects, events, etc., and a directory structure for mods (e.g. a Mods folder where users can drop files). The planning should include an example of adding a “fifth demographic” via data file to ensure our design can handle it without code changes.

Phase 2: Prototyping Core Systems

Minimal Turn Cycle Prototype: Implement a simple end-to-end loop to prove the concept. For example, hard-code one test demographic and one test policy input, and see if the LLM can output a response and update a variable. This involves coding a TurnManager that on start calls the LLM with a prompt and receives output. Keep the UI minimal (even just Unity Console or a simple text UI) for now. The goal is to de-risk the two hardest pieces: LLM integration and simulation update logic.

LLM Integration Setup: Integrate the chosen LLM model locally. If using a Unity plugin or wrapper (like LLMUnity), follow its setup to load the 20B model and create an LLMCharacter or equivalent for each demographic
github.com
github.com
. If writing a custom integration, perhaps set up a simple Python server with flask or use Unity’s C# to call a library – but a ready plugin is preferred for a solo developer to save time. Ensure the LLM can be invoked asynchronously (so it doesn’t freeze the game while generating text). Run a test prompt to verify responses. For example, prompt: “Demographic: Youth. Context: They have high unemployment. Player proposes: ‘Open a new tech training program.’ How do the Youth respond? Give numeric happiness impact.” Check if the output is reasonable. This step is crucial for validating that ChatGPT-OSS 20B can handle the task; adjust the prompt or parameters (temperature, etc.) as needed to get deterministic or at least consistent outputs.

Basic Simulation Logic: Implement classes for State Variables and Demographics. State variables might include economy metrics (GDP, budget), social metrics (crime, environment) and can be represented as values 0–1 or real numbers. Demographics will have properties like current happiness, size (population percentage), and perhaps memory of previous turn’s satisfaction. Code a simple function that takes all LLM responses and external event effects, and updates the state variables accordingly. At this stage, keep it straightforward (e.g. directly add the changes). Later phases will refine this into a more interlinked causal graph.

Iteration & Validation: With one or two sample demographics working, iterate on the prompting and parsing. Possibly implement a parser for the LLM output: if using JSON output, parse it into a C# object; if using plain text, do basic keyword parsing. Validate that extreme or unexpected inputs still yield valid output (put constraints in prompt if necessary). For instance, ensure the LLM doesn’t produce values out of a reasonable range or completely off-topic text. We may use the plugin’s features to enforce output format via a grammar
github.com
 or use few-shot examples in the prompt to demonstrate the desired output format.

Phase 3: Core Gameplay Systems Development

This phase expands the prototype into the full game loop with all core features:

Demographic LLM Agents (4 Total): Set up four distinct LLM personas, one per demographic. Each will have a profile defining their priorities and initial sentiment. For example, Wealthy Elites might prioritize low taxes and economic growth, Working Class might prioritize social welfare and jobs, etc. Implement a system to maintain demographic sentiment state: this could be a summary or a few key numbers that get passed into the LLM prompt each turn (e.g. their current happiness level, whether they feel neglected, etc.). The prompt template might look like: “You represent [Demographic X]. Current conditions: [summary of economy and any issues affecting this group]. The player proposes: [policy text]. As [Demographic X], respond with how this affects your happiness, economic outlook, and comfort with the budget, in the format… etc.” By consistently providing current state info, the agent’s output will reflect evolving sentiment. We will refine these prompts through testing.

Causal Loop Simulation Engine: Build out the cause-and-effect relationships among variables using a graph data structure. Each node (variable or demographic) can have input links and output links. For example, the policy effects will be represented as links that feed from a policy decision into certain variables (like “new tax policy -> GDP down slightly, budget up”). Democracy 4 stores these as formulae in CSV (e.g. IncomeTax -> MiddleClass happiness effect)
steamcommunity.com
. We can hard-code some initial relationships or also load from data. Implement the evaluation algorithm: each turn’s end, compute new values for all variables by summing contributions from all active effects. Use inertia (lag) for gradual changes, if needed – e.g. a policy might not fully impact happiness in one turn but over several turns (D4 uses an “inertia” parameter to spread an effect over N turns)
steamcommunity.com
steamcommunity.com
. Initially, we can keep it simpler (immediate effects) and add inertia or smoothing once basics work. Ensure that feedback loops are considered: e.g., if economy crashes, unemployment rises, which might further hurt economy due to lower spending – these can be modeled as circular links. Use caution to avoid instability or oscillation; perhaps clamp values between realistic bounds each turn.

External Events & Random Factors: Implement an Event Manager system that introduces non-player influences each turn or periodically. These can include weather events, natural disasters, or global events (pandemic, war) as described. We’ll maintain a list of possible events (with conditions or probabilities) and each turn, roll to see if any occur. For inspiration, Democracy 4 evaluates events every few turns by scoring them based on conditions (“influences”) and a bit of randomness, triggering the top event if its probability exceeds a threshold
steamcommunity.com
. We can do similar: e.g., each event has a trigger formula depending on state (a drought event more likely if climate variable is bad and a random roll) and a certain small random chance to keep it unpredictable. When an event triggers, apply its effects to the game state. Effects could be one-time hits or temporary modifiers. A temporary effect can be handled by something like a “Timed Modifier” object that decays over a few turns – for instance, a hurricane might immediately reduce local GDP and happiness, then these effects recover slowly over 3 turns. (This is analogous to Democracy’s grudge system, where an event creates a hidden modifier that decays each turn
steamcommunity.com
.) Implement support for these timed effects so that after each turn, active event modifiers reduce in intensity or expire. The Event Manager should also send the player an “email” about the event (e.g., Email from News: “Hurricane hit the coast, causing damage…”).

Policy Proposal System: Develop the mechanism for the player to input any policy. The UI will allow the player to compose a policy proposal as an email or form. Since this is open-ended text, guide the player with constraints: maybe a character limit or suggested format (“<action> to <target> for <purpose>”). Internally, when the player submits a policy, the game will create an object representing that policy for this turn. Even though it’s free text, we can internally classify it for the simulation: e.g., do a quick check for keywords or use a tiny prompt to the LLM to categorize the policy (like is it economic, social, environmental? which demographic is most affected?). This classification can help apply the right effects in the simulation model (for example, a “tax increase” policy could inherently affect economy and budget variables). This step might use either rule-based keyword matching or a secondary LLM call. Since timeline isn’t tight, a safe approach is to maintain a manual mapping of keywords to effects for common policy types initially, and only if necessary, incorporate an AI classification for more exotic inputs.

Turn Processing Flow: Tie everything together in the TurnManager. The flow for each turn will be:

Input Phase: Player reads new incoming emails (issues, results from last turn, news). Player chooses an action – either replies to an issue (which is essentially deciding on a policy) or initiates a policy via the compose interface.

LLM Response Phase: For the chosen action, query each demographic’s LLM agent with the policy and current context. Collect each demographic’s response values. (This can be done sequentially for each demographic agent each turn. With a local model, this might take a few seconds per agent on CPU; we will attempt to optimize or allow multi-thread if using GPU. Four agents with a 20B model might be just within acceptable turn time on a decent PC, but we’ll monitor performance).

State Update Phase: Feed the demographic responses (e.g. +5 happiness for youth, -3 happiness for wealthy, etc.) into the simulation. Also apply any event effects this turn. Then compute the new global state via the causal loop calculations (update all interconnected variables). Ensure to update each demographic’s internal sentiment based on what happened (for example, if a demographic’s happiness drops a lot, record that; it might influence their LLM persona next turn as they become more upset).

Output/Feedback Phase: Generate results for the player. This includes drafting new emails that the player will see at the start of the next turn reflecting the outcomes. For instance, if a policy was enacted, the player might get an email from an advisor summarizing “Policy X has been implemented. Youth reactions are positive, Seniors are upset…” and maybe news headlines or data reports (graphs updated). Use either static templates filled with data or short LLM generations to spice up the text (we could use the same model or a smaller one to generate a one-paragraph news summary of the turn).

Advance to next turn, loop back to Input Phase.

Basic UI Implementation: At this stage, implement the main interface screens without final polish. Create the Email Inbox UI in Unity using the UI Toolkit or Canvas: a list of messages (subject, sender, date) and a pane to read the selected email content. Also create a simple form or pop-up for composing a policy (subject line, body text). Integrate this with the turn logic: when player “sends” a policy proposal email, treat it as the action and progress the turn. Additionally, create placeholder UIs for analysis tools, e.g. a budget overview panel (show current budget, spending, maybe a pie chart) and a demographics panel (show each group’s approval rating or happiness on a bar). These can be simple at first (even just text values) to be fleshed out later. The key is to have the interactive loop in place: reading emails, choosing actions, and seeing updated stats.

Saving/Loading: Implement a basic save system to persist the game state (demographic stats, world variables, turn number, any ongoing event effects). This can be as simple as writing JSON to a file, given the data-driven nature (Unity’s JSONUtility or a third-party JSON lib can help). This ensures the player can continue a session and also is useful for testing (to reload a certain scenario repeatedly).

Phase 4: Content Expansion & Balancing

With core mechanics functional, the focus shifts to populating the game with content and ensuring the simulation provides a fun, believable experience:

Content Creation (Emails & Events): Author a variety of email texts to simulate the world. These include: introductory emails (from the Mayor or mentor character giving the player objectives), issue emails (constituent complaints, department requests – e.g. “The town’s schools are underfunded, what will you do?”), and result emails (reports on what happened after policies). Since our game allows open-ended policies, the content should encourage creativity: for example, an email might describe a problem but not list choices, prompting the player to think of a policy. We’ll also create some optional guidance like hints or examples in a policy handbook (maybe accessible via an “Help” email or menu) for players who aren’t sure what to do.

Demographics Tuning: Fine-tune the four demographics’ behavior. This might involve adjusting the LLM prompt for each. For instance, if the Environmentalists demographic always reacts mildly even to huge environmental changes, we might sharpen their prompt to be more passionate about certain issues (“You are an environmental activist group; you strongly approve of green policies and are outraged by pollution or corporate tax cuts that ignore climate.”). We may incorporate a memory or simple state tracking in the prompt, like: “Previously, you felt the government was neglecting your concerns.” This can be updated as turns go by (for example, if a demographic’s happiness stays low for many turns, mention growing resentment). Trial and error here will help achieve more varied and realistic responses.

Balance Simulation Variables: Playtest various scenarios to see if the causal simulation produces logical results. Adjust the strength of effects: e.g., does increasing taxes always crash the economy in the simulation? If so, maybe tone down that effect to allow recovery. The goal is to avoid any single strategy that immediately wins or loses the game. Since it’s a sandbox style (no fixed win condition initially, apart from keeping everyone reasonably happy), balance means making the relationships neither trivial nor completely unpredictable. Use real-world intuition and perhaps references (like making sure a big budget deficit eventually causes problems, or high unemployment triggers unrest). We can use Democracy 4’s known values as a baseline (the modding CSVs can guide reasonable ranges for effects) – indeed, D4 had many debates on whether effects were too strong or weak
positech.co.uk
positech.co.uk
. We’ll aim for plausibility, and where realism conflicts with fun, err on the side of fun gameplay.

Feedback & Metrics: Improve how the game communicates the state to the player. Introduce an approval rating or score for the player’s political career, influenced by demographic happiness or other metrics. Perhaps if any demographic’s satisfaction falls under a threshold for too long, the player could lose (e.g. get voted out or forced to resign). Or conversely, high overall satisfaction could be a “win” condition (re-election). While the initial scope didn’t specify victory conditions, defining some implicit goals gives the player motivation. We’ll add these metrics and possibly an end-of-term election event to summarize performance.

UI Refinement: Now build out the immersive UI as envisioned. This means styling the email client with realistic touches – e.g. an interface skin that looks like a professional email app (Outlook/Gmail style), including sender avatars or department logos, timestamps, and perhaps a “desktop background” visible behind windows to simulate a computer OS. Unity UI can be styled with custom images and fonts to achieve this. Implement features like sorting or filtering emails (optional, for realism). Also flesh out the analysis tools: for example, a line graph showing budget over time, or happiness trends, accessible via a button in the UI (this could open a window with Unity’s UI Graph or a simple texture graph). These tools enhance player understanding of the complex simulation loops by visualizing changes.

Sound and Feedback: Add audio-visual feedback for important events – e.g., a notification ding when a new email arrives, or a crowd murmuring sound if public anger rises. Background music could be a subtle office ambient or news channel soundtrack to fit the theme. Visual feedback could include desktop notifications for critical issues (a pop-up alert icon if, say, a crisis event happens). These polishing touches make the game more engaging and the interface more lively.

Phase 5: Testing, Polish & Modding Support

Extensive Testing: Conduct thorough testing of the game loop. As a solo dev, this includes self-playtesting and possibly engaging a small group of external testers (friends or a closed beta) to try creative policy inputs. We need to test edge cases: what if the player inputs something nonsensical or extreme? The system should handle it gracefully (the LLM might say “That policy is not feasible” or we pre-empt with a message). Also test performance: ensure that the LLM responses (with a 20B model) are not too slow. If they are sluggish, consider optimizations like using a smaller model or optimizing context length. Test saving/loading across different points in the game.

AI Output Refinement: Based on testing, refine the LLM agent outputs. If the numeric outputs from the LLM are inconsistent or unrealistic, we might add a post-processing step – e.g., clamp the values or weighted-average them with previous turn to smooth volatility. We could also introduce a determinism mode for the LLM by setting a low temperature or using a fixed random seed, so that the same input yields predictable output – this might be useful for balancing (though it can reduce surprise). Experiment with the grammar enforcement to directly get JSON from the model
github.com
, which can greatly simplify parsing and reliability of the numbers. If this grammar approach works, lock that in for final build to ensure modders and players get consistent behavior.

Finalizing Modding Interfaces: Implement the data-driven mod support fully. This means finalizing the format of external data files and making sure the game loads them on startup or when a mod is selected. For example, we decide to use CSV files similar to Democracy 4’s structure for familiarity: demographics.csv, policies.csv, events.csv, etc. Ensure that if someone adds a new row (e.g. a new policy or a new demographic), the game will incorporate it. This might require writing parsing code for each file and creating corresponding objects at runtime. We’ll also support a Mods folder structure, possibly with subfolders for each mod. Following Democracy 4’s example, each mod could mirror the game’s data folder structure and include a config file
steamcommunity.com
. The game at launch can scan a Mods directory, list available mods (by reading their config name/description), and allow the player to activate one (for now, since we’re solo, a simple approach is to auto-load any data that’s placed in the folder, or a command-line flag to load a certain mod during development). Test modding by actually creating a small sample mod: e.g., add a “Fifth demographic: Tourists” via CSV, run the game and confirm it appears and the LLM agent can be created for it with a provided persona. Update documentation for modders on how to format files and what each field means (this can be a text file shipped with the game).

Performance Optimization: Profile the game for any slowdowns. The likely heavy part is the LLM inference. If using the GPU via a library, ensure it’s leveraging it. If CPU-only, consider using a quantized model (like 4-bit quantization of the 20B model) to speed up inference at some accuracy cost. Also optimize the simulation calculations – though those are relatively light (just arithmetic over a few dozen variables). Unity-specific optimizations: ensure garbage collection is managed (e.g. reuse objects for parsing JSON, etc.), and that UI redraws aren’t excessive (the email UI might involve many text elements; use pooling if necessary for lists). Since realism is more important than flashy 3D graphics here, we likely have headroom on rendering performance.

Polish & Finishing Touches: At this final stage, fix any bugs found in testing, and polish the game’s presentation. This includes refining text (grammar, spelling in all written content and LLM prompt phrasing), adding tooltips or help for any complex mechanics (e.g. hovering over a demographic’s happiness score could show what policies affected it most). Ensure the UI scaling works for various resolutions (especially since it’s a desktop UI style, it should accommodate 1080p up to 4K nicely – perhaps include a UI scale option for 4K
steamcommunity.com
). Prepare for the Steam release by integrating Steamworks features if desired, like achievements (e.g. an achievement for reaching 100% approval, or surviving 50 turns). Although timeline isn’t a factor, we want a high-quality product: double-check that everything (LLM, simulation, UI) comes together cohesively for an immersive player experience.

Architecture Outline

High-Level Architecture: The game is organized into a set of systems running within Unity. It follows a model-view-controller style separation where possible, to keep the simulation logic (model) decoupled from the UI (view) and input handling (controller). The design is also data-oriented to facilitate modding – much of the content is loaded from external files rather than hard-coded. The major components are outlined below:

Unity Engine & Scenes: The project will use Unity as the engine, with the game likely contained in a single main scene (since most of the game is GUI-based, we don’t need multiple gameplay scenes). We might have separate scenes for main menu or loading, but once in-game, the player stays on a “desktop interface” scene. Unity’s usual game loop runs continuously, but our simulation updates on a turn basis (player triggers the next turn). We make use of Unity’s update loop mostly for UI interactions and perhaps animated elements (like blinking notifications), while the core simulation advances in discrete steps when the turn ends.

Data Models (ScriptableObjects/JSON): Key game data such as definitions of demographics, policies, and simulation variables are stored in data files. During development, we can utilize ScriptableObject assets for easily editing and visualizing this data in the Unity Editor (e.g., a ScriptableObject for a Demographic with fields: name, description, LLM prompt template, initial sentiment values, etc.)
reddit.com
reddit.com
. At runtime (especially for mod support), these may be loaded from JSON or CSV files so that changing them doesn’t require rebuilding the game. The architecture includes a DataManager that on game start reads all required data files (first from core game data, then overrides from an active mod, if any) and instantiates the relevant objects in memory. For example, it will parse simulation.csv to set up all simulation variables and their relationships (mirroring Democracy 4’s approach where each row defines a variable and lists of inputs/outputs
steamcommunity.com
steamcommunity.com
). Because almost all simulation elements are loaded from simple text or CSV, the simulation engine is essentially configuration-driven, which not only aids modding but also makes it easier to tweak gameplay without code changes
steamcommunity.com
steamcommunity.com
.

Simulation Engine: The simulation engine is the heart of the game’s logic. Internally, one can think of it as a directed graph of nodes (also akin to a simple neural network as Cliff Harris describes Democracy 4’s engine
steamcommunity.com
). Each node can be of several types:

Demographic (with properties like happiness, etc., and maybe treated as a special kind of node that also has an LLM agent attached),

Policy (which might be a transient node created when the player enacts something, holding values like intensity/cost),

Situation/Event (persistent conditions like “Recession” or temporary events like “Hurricane” that influence other nodes while active),

Generic Simulation Variable (economy, crime, etc., which usually are continuous values 0–1 or percentages).
The Effect Links between nodes carry influence, often with a magnitude and formula. For example, a link from “Unemployment” to “Crime” might say Crime = Crime + f(Unemployment) where f could be a direct proportional formula. We will implement a system to evaluate these links each turn to update node values. Likely, we iterate through each node and compute newValue = sum(all incoming effects). Some effects may use the current value of the source node and an operator (like the formulas in Democracy 4’s CSV where you can have linear or nonlinear relationships
steamcommunity.com
steamcommunity.com
). We might reuse the concept of inertia by storing previous values and smoothing changes over a number of turns
steamcommunity.com
. The Simulation Engine is designed to be agnostic of specific content – it just knows how to update nodes given the effect definitions. This means adding a new policy or variable via data is automatically handled by the same engine code, preserving mod flexibility.

TurnManager (Game Loop Controller): This controller orchestrates each turn’s sequence as described in the project plan. It interacts with other systems in order: asks the UI for player input, calls LLM agents, then calls the Simulation Engine to update states, then triggers the UI to show results. The TurnManager also keeps track of turn number and timing (for example, it might increment a “month” counter, and trigger an election event every 12 turns or so). It’s effectively the game’s main state machine, moving between phases: idle (waiting for player), processing (when the player hits “Submit” on a policy and we gather outcomes), and resolution (showing summary, then back to waiting). If events are scheduled or random, TurnManager invokes the EventManager at turn end to see if any event happens that turn.

LLM Agent System: Each demographic has an associated LLM Agent. In implementation, this could be a Unity MonoBehaviour or plain C# class that holds:

The persona prompt or description for that demographic (loaded from data, possibly with placeholders for dynamic info like current happiness level).

A method to construct the full prompt given the current world state and the player’s proposed action.

A function to call the LLM model and obtain a response.
All agents likely share one underlying model instance for efficiency, loading ChatGPT-OSS 20B once at start. We can prompt the same model with different prefixes for each agent sequentially. The architecture might use a singleton or central LLMService that loads the model (via the integration library) and exposes a function to get a completion given a prompt. The Demographic agents then use this service. For example, if using LLMUnity, we would create a single LLM object (with the 20B model) and multiple LLMCharacter objects for each demographic with their role definition
github.com
github.com
. Then our code can do something like llmCharacter.Chat(message, callback) for each demographic’s character
github.com
github.com
. The callback will handle the returned text, parse it into structured data, and pass it to the Simulation Engine. The LLM Agent System must also manage the asynchronous nature of calls – possibly the TurnManager waits for all 4 agents to complete their responses (which we can do via Unity’s coroutine or async/await pattern, gathering results). We will incorporate error handling here (if the model fails to respond or gives invalid output, perhaps have a fallback response or default to no change, and log the issue for debugging).
Performance: Running a 20B model 4 times per turn might be heavy; the architecture should allow for adjustments, such as using a smaller model or running in parallel if hardware allows. It’s conceivable to also limit the length of each response (we don’t need very long answers, just concise outputs) to keep inference time down. The system could also cache or reuse computations – e.g., if the same policy is repeated, though in our game that’s unlikely because input can vary. Another optimization is to use the streaming output feature: as soon as the model produces output, we parse it without waiting for a long tail of text. All these considerations are encapsulated in the LLM Agent component.

Event Manager: This subsystem handles external events and situations. It loads event definitions from data (likely one file per event or a list in a file). Each event definition includes triggers/influences and effects. At the end of each turn, the Event Manager evaluates all eligible events: for each, computes a score or probability based on the current state (e.g., an event might have an influence “if GDP < 0.5 then +0.3 to probability” plus a random factor
steamcommunity.com
). If any event’s chance exceeds a threshold or a random draw, it triggers. The Event Manager then informs the TurnManager of the event. The effects of the event are applied to the simulation as described (often via creating temporary modifiers with decay
steamcommunity.com
). Architecturally, an event could be implemented as a class with a method Apply(simulationState) and perhaps an activeTurns counter if it persists. The Event Manager keeps track of ongoing situations as well (for example, a “Recession” situation might start when GDP falls below X and remain until GDP recovers above Y, similar to Democracy’s situation triggers
steamcommunity.com
steamcommunity.com
). This means each turn it should also check if any new situation should start or an ongoing one should stop based on the thresholds. By separating this from the core simulation engine, we keep random and conditional logic in one place, and the simulation engine can remain a pure calculator of effects. This separation also makes modding easier – new events or situations can be added via data without touching simulation code, as long as the Event Manager interprets the data correctly.

User Interface Layer: The UI is built with Unity’s UI system and handles all interaction and display. It consists of:

Email Client Interface: This is effectively the “game world” view for the player. Implemented with panels for inbox (a scrollable list of email headers) and reading pane. We’ll likely have an EmailManager UI component that stores a list of email objects (with fields like sender, subject, body, etc.). New emails (as generated by events or turn results) are added to this list and displayed. The player can click an email to read details, and some emails may have prompts for action (for example, an email from a constituent might have a “Propose Solution” button that opens the policy compose window). The architecture should allow these emails to be generated either from static templates or dynamically. Possibly we use placeholder tokens in email templates that get filled with current data (e.g. “[POLICY_NAME]” or “[DEMOGRAPHIC_NAME]”) to semi-randomize content and increase variety.

Policy Compose Dialog: A UI panel that appears when the player chooses to initiate a policy. It includes text input fields for the policy title and description. When submitted, this dialog passes the text to the TurnManager as the chosen action. To help the player, this UI might tap into the simulation data – for instance, showing a dropdown of categories or an autocomplete of known terms (if the player starts typing “tax”, suggest “tax increase” etc., drawn from a list of recognized policy keywords). These are nice-to-have features that can be implemented if time permits, but even a basic free-text box would meet the core requirement.

Dashboard/Analysis Panels: These include the budget panel, graphs, demographic stats, etc. We might group them in a single “Analytics” window with tabs or separate windows accessible from a taskbar (if simulating a desktop OS). Each of these panels is updated at end of turn with the latest data from the Simulation Engine. For example, the budget panel will query the simulation for current income vs expenditures, and any event costs, and display those. The demographics panel can show each group’s happiness (as a percentage or bar) and perhaps a short descriptor (happy, neutral, angry). This UI gets its data via a well-defined interface, e.g., the Simulation Engine can provide a data snapshot or observers that the UI listens to. We ensure that adding a new demographic automatically adds a new UI element (e.g., if using a UI template for demographics and instantiating it for each entry in the demographics list – so if mod adds a 5th demographic, the UI instantiates another bar dynamically).

Main Menu/Settings: A simple main menu for starting a new game, loading, and adjusting settings (especially settings for the LLM, like enabling/disabling the use of the LLM for those who might not have the hardware – perhaps a mode to play without the LLM by using predefined responses, for accessibility). Settings could also include adjusting model parameters if we expose them (temperature, etc.), and toggling mods. The architecture for this is straightforward Unity UI linking to relevant managers (e.g., “Start Game” triggers the DataManager to load fresh state and enters the main scene).

Operating System Simulation: To enhance immersion, our UI might simulate a computer OS (windowed interface). We might implement a basic window manager so that the email client, analysis panels, etc., are draggable “windows”. This is largely cosmetic, but architecturally it means our UI prefabs for windows should be somewhat generic. This doesn’t affect core logic but is an overlay for player experience.

Storage & Persistence: The game state can be saved/loaded via a SaveManager. This manager serializes the necessary state: turn number, all simulation variables, demographic states, any active events and their remaining durations, and the history of actions (maybe for use in summarizing or allowing the player to review past decisions in emails). Because our state is mostly numeric and small text (plus perhaps some LLM prompt history if we store it), this can be serialized to JSON easily. Unity can store save files in Application.persistentDataPath. The SaveManager design will ensure that if new variables or demographics are added (via updates or mods), it can handle them – perhaps by using a dictionary of state values rather than a fixed class structure, making it more flexible with changing content.

Modularity & Mod Support: Throughout the architecture, modding capability is considered:

The data-driven approach (CSV/JSON for content) means most game content can be changed without code changes. The engine reads from those files at runtime, so modders can replace or add files. We will allow a mod to, say, add a new CSV of policies or append to it. The architecture to support this is to have the DataManager load not just a single file but also check a Mods/ActiveMod folder for overriding files. For instance, if a mod provides its own policies.csv, the DataManager could load that after the base file and merge/replace entries accordingly. Alternatively, mods might be total conversions that provide all data anew – in which case, the mod config tells the game to only load files from mod directory. We might implement a simple config.txt for mods (just like Democracy 4 does) to identify the mod and any special loading instructions
steamcommunity.com
.

Scripting for modders: We probably won’t expose a full scripting system beyond what’s in data, but we aim to make data entries powerful enough. Using formulas in effect definitions gives a lot of flexibility (e.g., modders can write nonlinear effects with ^ or conditional via multiplying by other variables, as D4 does
steamcommunity.com
). The event system influences allow simple logic with randomness
steamcommunity.com
. If needed, we might later allow mods to specify custom LLM prompts for new demographics or even custom “AI advisors”.

Architecture Extensibility: We design the systems so that adding a new component is straightforward. For example, if future expansions add a national level politics layer, we could create additional variables and demographics at higher scope, and the same simulation engine can run them (just more nodes in the graph). Or if we integrate a different AI model, we ensure the LLMService is abstracted enough to swap models (maybe loading a different .gguf file or even switching to an API call). The separation of concerns (UI vs simulation vs AI) means each can be modified or replaced with minimal impact on others, which is ideal for long-term modding and maintenance.

In summary, the architecture consists of cooperative systems: a turn-based simulation engine fed by LLM-driven demographic reactions and random events, all presented through an immersive email-based UI. The use of Unity provides the framework for interface and asset management, while the heavy simulation logic lives in data and code structures that mirror proven designs from games like Democracy 4 (nodes and effect links)
steamcommunity.com
. LLM integration is achieved with a local model runtime, leveraging tools like the Llama.cpp-based Unity plugin to ensure offline and fast inference
github.com
. By keeping content externalized in files and designing with modular components, the game will not only fulfill the initial design (4 demographics, one town) but also easily scale up with new content or community mods, making it a robust foundation for a political simulation sandbox.