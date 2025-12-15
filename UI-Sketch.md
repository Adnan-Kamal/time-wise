# 🎨 UI Sketch & Vision: TimeWise

## 1. High-Level Vision

**"Clean, Calm, and Conscious."**

The interface is designed to reduce **cognitive load**. Unlike cluttered project management tools, TimeWise uses plenty of **whitespace**, **soft colors** (Sky Blue, Slate Gray), and distinct **"Cards"** to separate different mental modes (Inputting vs. Reviewing vs. Planning).

---

## 2. Wireframes (MVP Phase)

### A. Dashboard View (Main Tab)
The command center for the current day, focused on manual logging and immediate insights.

```text
+-----------------------------------------------------------------------+
|  🕒 TimeWise       [ Dashboard ]  [ Weekly History ]     Oct 25, 2023 |
+-----------------------------------------------------------------------+
|                                                                       |
|  [ LEFT COLUMN: INPUT & LOGS ]       [ RIGHT COLUMN: INSIGHTS ]       |
|                                                                       |
|  +-----------------------------+     +------------------------------+
|  | 📅 Today's Tracker   04:30h |     | 🎯 Goal Center               |
|  |                             |     |                              |
|  | Activity Name:              |     |  [ Goal: Less Social Media ] |
|  | [_________________________] |     |  Progress: [████░░░░░░] 40%  |
|  |                             |     |  [✨ AI Action Plan........] |
|  | Category:      Duration:    |     |                              |
|  | [Study v]      [ 45 ][Min]  |     |  [+ New Goal Button]         |
|  |                             |     +------------------------------+
|  | [ (+) Add Log Button      ] |
|  +-----------------------------+     +------------------------------+
|                                      | 📊 Daily Overview            |
|  +-----------------------------+     |                              |
|  | 📝 Recent Logs              |     |  [ Donut Chart ] [ Bar Ch ]  |
|  |                             |     |   Distribution    Ranking    |
|  | • Math Homework             |     |                              |
|  |   [Study] 45m  02:30 PM [x] |     +------------------------------+
|  |                             |
|  | • Lunch Break               |     +------------------------------+
|  |   [Other] 30m  01:45 PM [x] |     | ✨ Daily Coach (AI)          |
|  |                             |     |                              |
|  | • Morning Jog               |     | "Good job on the Exercise!   |
|  |   [Exer.] 30m  08:00 AM [x] |     |  However, you've neglected   |
|  |                             |     |  your Reading goal..."       |
|  +-----------------------------+     +------------------------------+
|                                                                       |
+-----------------------------------------------------------------------+
```

---

## 3. Future Vision (Full App)

This evolved UI incorporates **Gamification**, **Calendar Integration**, and **Conversational AI**.

### A. Advanced Dashboard (Gamified)

This design introduces a **Streaks and Levels** header and shifts the AI coach into a conversational chat interface.

```text
+-----------------------------------------------------------------------------+
|  🕒 TimeWise   [Dash] [Calendar] [History]     🔥 12 Day Streak | 👤 Profile |
+-----------------------------------------------------------------------------+
|  🏆 Level 5: Time Keeper  [=====------] 500/1000 XP                         |
+-----------------------------------------------------------------------------+
|                                                                             |
|  [ LEFT: QUICK LOG ]                 [ RIGHT: SMART ANALYTICS ]             |
|                                                                             |
|  +---------------------------+       +------------------------------------+
|  | ⚡ Quick Add               |       | 📅 Planned vs Actual (Today)       |
|  | [ Math ] [ Gym ] [ Sleep ]|       |                                    |
|  | (Smart Suggestions)       |       | 09:00 [ PLANNED: Study Math ]      |
|  |                           |       |       [ ACTUAL : Scrolled TikTok ] |
|  | [ Manual Entry Form ... ] |       | ⚠️ Deviation: -45 mins             |
|  +---------------------------+       +------------------------------------+
|                                                                             |
|  +---------------------------+       +------------------------------------+
|  | 🎯 Live Goals              |       | ✨ AI Coach Chat (Minimized)       |
|  |                           |       |                                    |
|  | 🏃 Gym (3/4 this week)    |       | "Hey! I noticed you missed your     |
|  | [████████░░] 80%          |       | morning study block. Want to       |
|  | 🏅 Badge: Early Riser     |       | reschedule it for 6 PM?"           |
|  +---------------------------+       |                                    |
|                                      | [ Type a reply...              ]   |
|                                      +------------------------------------+
|                                                                             |
+-----------------------------------------------------------------------------+
|  [Floating Action Button: 💬 Ask AI]                                        |
+-----------------------------------------------------------------------------+
```

### B. Calendar View (Planned vs. Actual)

A visual comparison to explicitly reveal **execution gaps** and **time blindness**.

```text
+-----------------------------------------------------------------------+
|  <  Oct 25, 2023  >      View: [Day] [Week]      Sync: [G-Cal ✅]     |
+-----------------------------------------------------------------------+
|  Time   |  📝 PLANNED (From Calendar)   |  ✅ ACTUAL (Logged)         |
+---------+-------------------------------+-----------------------------+
|  08:00  | [ 📘 Study: History       ]   | [ 😴 Sleep (Overslept)    ] |
|         |                               |                             |
|  09:00  | [ ☕ Breakfast            ]   | [ ☕ Breakfast            ] |
|         |                               |                             |
|  10:00  | [ 🏃 Gym                  ]   | [ 📘 Study: History       ] |
|         |                               |   (Late Start)             |
|  11:00  |                               |                             |
+---------+-------------------------------+-----------------------------+
|  SUMMARY|  ⚠️ 80% Adherence Score                                     |
|         |  "You tend to start your day 1 hour later than planned."    |
+---------+-------------------------------------------------------------+
```

---

## 4. Key UI Decisions (Roadmap Updates)

### A. The "Planned vs. Actual" Split

- **Decision:** The Calendar view strictly separates scheduled activities (imported from Google Calendar) vs. logged activities inside TimeWise.
- **Why:**  
  - Creates a clear **reality check**.  
  - Makes "execution gaps" obvious.  
  - Reveals **time blindness** when users log different activities than planned.

---

### B. Gamification Header (Streaks and Levels)

- **Decision:** Persistent top header showing streak count, XP, and user level.
- **Why:**  
  - Streaks increase daily retention.  
  - Levels provide long-term progression.

---

### C. Conversational Chat FAB (Floating Action Button)

- **Decision:** Replace the static AI card with an interactive chat bubble.
- **Why:**  
  - Users can ask contextual questions.  
  - Reduces navigation friction.  
  - Keeps coaching dynamic and personalized.

