# 🤖 AI-Log.md: TimeWise - Personal Time & Habit Coach Development (Prompt-by-Prompt)

This log tracks the development of the TimeWise application, presenting each original user prompt followed immediately by its corresponding log entry detailing the AI's role, the help provided, and the risks considered.

---

## I. Tools Used (Primary Purpose)

| Tool Name | Primary Use |
| :--- | :--- |
| **Gemini (Large Language Model)** | Core assistant for generating project documentation, use cases, architectural file structures, specific component logic, and complex AI analysis logic. |
| **ChatGPT** | Formatting all Markdown files (`problem_statement.md`, `requirements.md`, etc.) and ensuring consistent structure. |
| **Google AI Studio – Build** | Developing the complete WebApp, Designing `roadmap.md` and UI sketches for long-term planning and wireframes. |

---

## II. Development Log (**Google AI Studio – Build**)

### Prompt 1: Initial Project Statement

> **Prompt:** Generate a complete detailed project statement for TimeWise – Personal Time & Habit Coach. The response must be fully documented in Markdown and titled Problem Statement. Include the following: **Problem Statement:** The problem is that students and self-learners often underestimate how much time they waste on low-value activities like scrolling or gaming. Their time is not tracked or visualized, causing them to struggle with managing their day, staying consistent with study or personal goals, and building productive habits. They frequently feel unproductive and guilty but cannot identify where their hours went. This lack of awareness directly affects their ability to make progress on personal goals. **Primary users:** Students and self-learners who want to track time, build habits, and achieve goals. **Why It Matters:** Time is precious, and without proper tracking or visualization, optimizing it is impossible. Existing time-management tools like Jira are overly complex and not suitable for simple daily activity tracking. TimeWise is simple, easy to use, and AI-driven, helping users utilize their time more effectively. **MVP Goal:** A simple web app that lets users log their daily activities, visualize their daily breakdown, and receive specific, actionable suggestions from an AI coach—without any complex setup or login. **Scope:** Manual activity logging: name, category, duration (hours/minutes); Dashboard: visual breakdown of daily time spent; Goal system: define goals (e.g., less social media, exam preparation); AI Coaching: Daily coaching based on logged activities, Small actionable suggestions aligned with goals, Weekly analysis comparing previous days and pointing out what to increase or reduce, Weekly history visualization; Data storage: use local DB to store activities and analyze past days. **Out-of-Scope (Future Phases):** Background monitoring of apps/websites; Login/signup or cloud database (SaaS); Native app; only responsive web app; Leaderboards or friend sharing; Integration with Google Calendar/Outlook. **Assumptions:** Users log their activities and durations correctly, and internet is available for AI processing even though logging and charts work offline.

| Used For | Help Provided (Benefits) | Risks Encountered (Potential Drawbacks) |
| :--- | :--- | :--- |
| **Project Scoping & Documentation.** Establishing a clear, formalized document for the project vision and constraints. | Rapid, comprehensive generation of professional-grade project documentation, ensuring all stakeholders are aligned from the start. | The generated scope required manual verification to ensure it strictly met all internal requirements and lacked ambiguity. |

---

### Prompt 2: Use Cases & Activity Diagram

> **Prompt:** Generate 3 Use Cases for this Habit Coach. 1. User logs an activity (e.g., 'Study', 2 hours). 2. User views their daily summary chart. 3. User sets a goal (e.g., 'Limit Social Media'). Include Actor, Trigger, Preconditions, Main Flow, and Alternate Flow. and also draw a activity diagram.

| Used For | Help Provided (Benefits) | Risks Encountered (Potential Drawbacks) |
| :--- | :--- | :--- |
| **Requirements Elicitation & Flow Design.** Defining functional requirements and user interaction pathways. | Quickly defined complex interaction logic (Preconditions, Alternate Flows) and visualized it with an Activity Diagram, saving significant time in initial design. | The AI's Use Case structure might not perfectly align with specific company standards, requiring minor adaptation. |

---

### Prompt 3: Initial Project Request (Setup)

> **Prompt:** The Personal Time & Habit Coach (AI) aims to reveal this hidden time loss. It offers a simple way for students to manually log activities and immediately see where their time is being spent... you must create react + vite app and add a packages.json file so i can add all the packages later when running locally

| Used For | Help Provided (Benefits) | Risks Encountered (Potential Drawbacks) |
| :--- | :--- | :--- |
| **Architectural Setup.** Initiating the core technical environment. | Instantly generated the correct boilerplate code and `packages.json` structure for a modern React/Vite app, accelerating the setup process. | Potential for relying on outdated or non-optimal package versions if not specified precisely in the prompt. |

---

### Prompt 4: Goals System & Formatting

> **Prompt:** Add a full **Goals System** to the app where users can create multiple goals such as improving their physique, scoring better marks, reducing social-media time, or fixing their sleep cycle. Each goal should allow a title, description, and optional target metrics or time horizon. Once a goal is created, the AI should automatically analyze the user’s existing activity history and generate personalized action steps that help achieve that goal. These suggestions must update over time based on newly logged activities. The system should also track progress toward each goal by mapping relevant activities to the appropriate goals and showing how close the user is—using percentages, timeline trends, and daily/weekly summaries. Additionally, replace the duration input with a toggle that lets users choose between minutes and hours; store everything internally in minutes, and display all durations everywhere in a clean **HH:MM format**, correctly converting anything over 59 minutes. This formatting must be consistent across activity breakdowns, history, stats, goals, and AI suggestions.

| Used For | Help Provided (Benefits) | Risks Encountered (Potential Drawbacks) |
| :--- | :--- | :--- |
| **Core Logic & Feature Implementation.** Introducing complex data management and UI logic. | Solved the intricate logic for time conversion (minutes to HH:MM) and structured the integration of AI analysis with dynamic goal progress tracking. | The complexity of the integrated logic increases the need for rigorous unit testing to ensure data integrity across conversions and storage. |

---

### Prompt 5: UI Restructuring & Weekly Tab

> **Prompt:** The app works well, but the UI needs restructuring. Some input fields—especially the duration fields—are squeezed into a single line, leaving too little space to see what’s being typed (hours, minutes, etc.). Adjust the layout so fields are spaced properly and automatically wrap to the next line instead of cramming everything horizontally. Use a more vertical, card-based or column-split layout so each field stays clearly visible on all screen sizes. Additionally, add a dedicated Weekly Activity History tab where users can view their logged activities for the current and past weeks in a clean, scrollable format, with totals and summaries presented clearly.

| Used For | Help Provided (Benefits) | Risks Encountered (Potential Drawbacks) |
| :--- | :--- | :--- |
| **Frontend/UX Design.** Improving usability and component organization. | Provided concrete suggestions for a responsive, clean UI layout (vertical/card-based), directly addressing the initial "cramped fields" problem. | The AI cannot visualize the output; manual review and iterative prompting were required to achieve the desired aesthetic result. |

---

### Prompt 6: AI Analysis Refinement (Weekly & Daily)

> **Prompt:** Add an AI analysis section to the Weekly Activity tab that strictly reports two things: which activities the user should reduce or stop, and which activities they should increase—nothing else. Keep the output short, direct, and purely evaluative based on the past week’s data. At the same time, upgrade the AI insights on the main tab to deliver more precise, actionable feedback that reflects the user’s recent activity patterns and progress toward their goals.

| Used For | Help Provided (Benefits) | Risks Encountered (Potential Drawbacks) |
| :--- | :--- | :--- |
| **AI Prompt Engineering & Functionality.** Fine-tuning the output quality and relevance of the AI coach. | Successfully refined the AI's output to be highly focused and actionable, reducing unnecessary prose and increasing the utility of the weekly analysis. | Ensuring the AI consistently adheres to the "strict reduce/increase only" constraint requires robust prompt instructions and potentially output parsing. |

---

### Prompt 7: Refine Logic (Advanced)

> **Prompt:** Refine the system so it fully supports all intended features: include the missing **FAMILY** category in the activity model, enhance the AI coaching so it not only gives general advice but also recommends specific **minute-shifts** between activities, allow the AI to compare today’s behavior with recent patterns by giving it **short-term history**, enable it to detect when the user is **neglecting areas tied to their goals**, and strengthen the Weekly analysis by having the AI return clean **structured data** instead of markdown so the interface can clearly separate what the user should do less of and what they should do more of.

| Used For | Help Provided (Benefits) | Risks Encountered (Potential Drawbacks) |
| :--- | :--- | :--- |
| **Deep Feature Refinement & Model Enhancement.** Adding nuanced logic for coaching and data handling. | Introduced highly advanced features like "micro-shifts" and goal-neglect detection, significantly increasing the sophistication of the AI coach. | The increased complexity of the AI's logic (history, goals, categories) increases the chance of logical errors or unintended behavior. |

---

### Prompt 8: Add Local Database (Persistence)

> **Prompt:** Extend the existing fully working app by adding a lightweight, persistent local storage mechanism (IndexedDB or an equivalent local database). This storage must save all user-logged activities for the current day and automatically load them when the app opens. Implement this feature without changing current functionality, without breaking existing components, and without altering the app’s workflow. Integrate the new storage layer cleanly into the existing architecture, keeping the UI and logic exactly the same while ensuring all activity and goal data is preserved across sessions.

| Used For | Help Provided (Benefits) | Risks Encountered (Potential Drawbacks) |
| :--- | :--- | :--- |
| **Data Persistence Implementation.** Integrating a local storage solution. | Provided the clean, modular code required to implement **IndexedDB** without altering existing component logic, successfully separating storage concerns. | Care must be taken to ensure the IndexedDB integration handles asynchronous operations correctly and doesn't introduce race conditions in the activity logging workflow. |

---

## III. Additional Contributions from Tools

| File / Component | Tool Used | Contribution |
|------------------|-----------|--------------|
| **roadmap.md** | Google AI Studio – Build | Visualized long-term plan, milestones, feature rollout. |
| **UI Sketch / Layout Concepts** | Google AI Studio – Build | Wireframe design, navigation flow, layout planning. |
| **All Other Markdown Files** | ChatGPT | Formatting, headings, tables, and clean structure.(Generated few) |
| **UI Design Images** | Gemini - Nano Banana Pro | Created the image files from markdown sketches.

---

## IV. Reflection Summary (Benefits vs Risks)

| Area | Benefits | Risks |
|------|----------|-------|
| Documentation | Fast, structured, professional | May include assumptions |
| System Design | Clear logic, fewer blind spots | Complexity requires manual validation |
| UI Design | Visual wireframes, clean layout | Needs pixel-level adjustments |
| Time Tracking Logic | Accurate calculations, goal integration | Needs thorough testing |
| Markdown Formatting | Clean, consistent structure | None (pure formatting) |
| IndexedDB | Full persistence | Async race conditions possible |

---
