# Problem Statement: TimeWise - Personal Time & Habit Coach

## 1. The Core Problem
**"Time Blindness" and Unseen Procrastination.**

Students and self-directed individuals often underestimate how much time they waste on low-value activities (e.g., "doom-scrolling" on social media, excessive gaming, or aimless browsing). Because this wasted time isn’t effectively quantified or visualized, they:
1.  Struggle to manage their day effectively.
2.  Fail to stay consistent with study or personal growth habits.
3.  Feel unproductive and guilty but cannot identify exactly where their hours went.

This lack of **awareness** leads to poor planning, stalled progress on personal goals, and a cycle of stress.

## 2. Primary Users
*   **Students (High School / University):** Need to balance study, sleep, and social life but are easily distracted.
*   **Self-Learners / Freelancers:** Individuals who lack a boss or strict schedule and must self-regulate their time.
*   **Habit Builders:** People trying to integrate new routines (reading, exercise) into a busy schedule.

## 3. Why It Matters
Time is a finite resource. Without a clear picture of how it is spent, it is impossible to optimize. Existing solutions are often:
*   **Too passive:** Automatic screen-time trackers run in the background but are easily ignored.
*   **Too complex:** Professional project management tools (Jira, Asana) are overkill for personal habits.

TimeWise bridges this gap by enforcing **active, manual logging** (which builds mindfulness) combined with **AI-driven coaching** that acts as a compassionate accountability partner.

## 4. MVP Goal
To build a **web-based, privacy-first application** that allows users to manually log activities, immediately visualize their daily breakdown, and receive specific, actionable feedback from an AI Coach to improve their time allocation without needing complex setups or user accounts.

## 5. Scope

### In-Scope (MVP Features)
1.  **Manual Activity Logging:**
    *   Input Name, Category (Study, Work, Social Media, Family, etc.), and Duration (Minutes/Hours).
    *   "Active" logging forces the user to acknowledge the time spent.
2.  **Visual Dashboard:**
    *   Daily distribution Pie Chart.
    *   Category Ranking Bar Chart.
    *   Daily total time tracked.
3.  **Goal System:**
    *   Define goals (e.g., "Less Social Media", "More Reading").
    *   Track progress bars against daily targets.
4.  **AI Coaching (Gemini API):**
    *   **Daily Coach:** Context-aware advice comparing today to recent history.
    *   **Micro-Shifts:** Specific suggestions (e.g., "Swap 15m of TikTok for Reading").
    *   **Weekly Analysis:** Strict "Reduce/Stop" vs "Increase/Prioritize" evaluation.
5.  **Weekly History:**
    *   Scrollable view of past weeks with summaries and trends.
6.  **Data Persistence:**
    *   Local Storage (Browser-based) for privacy and simplicity.

### Out-of-Scope (Future Phases)
1.  **Automatic Time Tracking:** No background monitoring of apps or websites.
2.  **User Authentication:** No login/signup or cloud database (SaaS).
3.  **Native Mobile App:** Web-app only (responsive design).
4.  **Social Features:** No leaderboards or sharing with friends.
5.  **Calendar Integration:** No sync with Google Calendar/Outlook.

## 6. Assumptions & Constraints
*   **Honesty:** The system relies on the user truthfully logging their time.
*   **Connectivity:** An active internet connection is required for AI features (Gemini API), though logging and charts work offline.
*   **API Key:** The user (or host) must provide a valid Google Gemini API Key.
*   **Browser Storage:** Data is tied to the specific browser and device used; clearing cache deletes data (unless exported/persisted elsewhere in future versions).


# 🗂 High-Level Design & Dataflow

---

## 1. Main Components

| Component | Description |
| :--- | :--- |
| **User Interface (UI)** | Built with Streamlit/React. Allows users to log activities, view dashboard charts, set goals, and access AI coaching feedback. |
| **Activity Logger** | Accepts activity name, category, and duration (minutes/hours). Converts durations into a consistent format (HH:MM). |
| **Goal Manager** | Users can define multiple goals with priorities (High, Medium, Low). Tracks progress and computes goal-related metrics. |
| **Data Storage** | Local CSV or IndexedDB to persist activities and goals. Ensures all logged data survives page reloads or browser closures. |
| **Analytics Engine** | Generates daily/weekly summaries: Pie Charts, Bar Charts, total tracked time, goal progress, and trends. |
| **AI Coach (Gemini API)** | Evaluates activity logs, compares with historical data, and provides daily actionable suggestions and weekly recommendations. |

---

## 2. High-Level Dataflow

```text
  ┌───────────────┐        ┌────────────────┐
  │               │        │                │
  │   User Logs   │──────▶ │ Activity Logger│
  │ Activity Data │        │                │
  └───────────────┘        └────────┬───────┘
                                       │
                                       ▼
                               ┌───────────────┐
                               │ Data Storage  │
                               │ (CSV/IndexedDB)│
                               └───────┬───────┘
                                       │
           ┌───────────────────────────┴───────────────────────────┐
           │                                                       │
           ▼                                                       ▼
  ┌────────────────┐                                     ┌────────────────┐
  │ Analytics Engine│                                     │ AI Coach Engine│
  │ - Pie Charts    │                                     │ (Gemini API)   │
  │ - Bar Charts    │                                     │ - Daily Advice │
  │ - Summaries     │                                     │ - Micro-Shifts │
  │ - Trends        │                                     │ - Weekly Report│
  └───────────────┬─┘                                     └───────┬────────┘
                  │                                               │
                  └──────────────────────┬────────────────────────┘
                                         ▼
                                ┌────────────────┐
                                │     Dashboard  │
                                │ - Display Charts│
                                │ - Show AI Tips │
                                │ - Goal Progress │
                                └────────────────┘
