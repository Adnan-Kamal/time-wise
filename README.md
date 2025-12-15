# TimeWise - Personal Time & Habit Coach

TimeWise is a productivity web application designed to help students and self-learners track their time, visualize their habits, and receive AI-driven coaching to overcome procrastination and "time blindness".

## Features

- **Manual Activity Logging**: Intentionally manual logging to build mindfulness and awareness.
- **Visual Analytics**: Real-time daily breakdowns using Pie and Bar charts.
- **Goal System**: Set specific goals (e.g., "More Sleep", "Less Social Media") and track progress with visual indicators.
- **AI Daily Coach**: Uses Google Gemini to analyze your day, identify time sinks, and suggest specific "Micro-Shifts" to improve your schedule.
- **Weekly History**: A detailed review of past weeks with AI-generated "Reduce/Stop" vs "Increase/Prioritize" lists.
- **Privacy Focused**: All data is stored locally in your browser (`localStorage`). No account required.

## Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: Google Gemini API (`@google/genai`)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Utilities**: date-fns, uuid

## Prerequisites

- **Node.js** (Version 16 or higher)
- **npm** (Node Package Manager)

## Installation & Setup

1. **Download/Unzip** the project files.
2. Open a terminal/command prompt in the project root folder.
3. **Install dependencies**:
   ```bash
   npm install
   ```

## Configuration (API Key)

This application requires a **Google Gemini API Key** to power the AI coaching features.

1. Get a free API Key from [Google AI Studio](https://aistudio.google.com/).
2. The application is configured to read the key from `process.env.API_KEY`.

### Setting the Key for Local Development

Since Vite runs in the browser, you need to expose the API key to the application.

1. Open `vite.config.ts`.
2. Add a `define` object to the configuration to inject your key.

**Example `vite.config.ts`:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_KEY': JSON.stringify("YOUR_PASTED_API_KEY_HERE"),
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
```
*(Note: Be careful not to commit `vite.config.ts` with your real API key to a public repository.)*

## Running the Application

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`).

## Usage Guide

1. **Dashboard**: 
   - Use the **Today's Tracker** form to log what you've done.
   - Check the **Daily Overview** charts to see where your time went.
   - Click **Analyze My Day** in the **Daily Coach** section for instant advice.
2. **Goals**:
   - Create goals in the **Goal Center**. The AI will generate an immediate action plan for each goal.
3. **History**:
   - Switch to the **Weekly History** tab to view past weeks.
   - Click **Analyze This Week** to get a structured "Stop/Start" list for the week.

## Troubleshooting

- **AI not responding?** Check browser console (F12) for errors. Ensure your API Key is valid and correctly placed in `vite.config.ts`.
- **Charts empty?** You need to log at least one activity for the current day.
- **Layout issues?** Ensure the window is wide enough or zoom out; the app is responsive but best viewed on tablet/desktop widths for charts.


# Input & Output Examples:

---

## 1. Feature: Activity Logging (Manual Entry)

**Scenario:** A user logs a study session.

### INPUT
*   **Activity Name:** `Math Homework`
*   **Category:** `Study` (Selected from dropdown)
*   **Duration:** `1.5`
*   **Unit:** `Hr` (Toggled from 'Min')

### OUTPUT
1.  **Recent Logs List:** A new entry appears at the top:
    *   *Display:* `Math Homework • Study • 01:30 • [Current Time]`
    *   *Visual:* Blue color indicator (matching 'Study' category).
2.  **Daily Tracker Header:** Total time increases by 90 minutes.
    *   *Display:* `01:30` (if this was the first log).
3.  **Daily Overview (Charts):**
    *   **Pie Chart:** 'Study' slice appears/expands to take up 100% of the chart.
    *   **Bar Chart:** 'Study' bar grows.

---

## 2. Feature: Goal Creation & Tracking

**Scenario:** A user wants to limit their social media usage.

### INPUT
*   **Goal Title:** `Limit TikTok`
*   **Goal Type:** `Do Less` (Click 'Do Less' button)
*   **Related Category:** `Social Media`
*   **Daily Target Duration:** `30` Minutes

### OUTPUT
1.  **Goal Card:** A new card appears in the "Goal Center".
2.  **Progress Bar:**
    *   If no Social Media logged: `0%` (Empty bar).
    *   If **45 mins** of Social Media was previously logged:
        *   *Display:* `00:45 / 00:30`
        *   *Visual:* Bar is full (100%) and **Red/Orange** warning text appears: *"Over limit by 00:15"*.
3.  **AI Action Plan:**
    *   *Status:* "Thinking..." -> followed by text.
    *   *Text:* "1. Set an app timer for 15 mins. 2. Delete the app from home screen..."

---

## 3. Feature: Daily AI Coach

**Scenario:** The user has logged `4 hours` of Gaming and `0 minutes` of Study, despite having a Study goal.

### INPUT
*   **User Action:** Click **"Analyze My Day"** button.
*   **System Context (Sent to AI):**
    *   *Logs:* Gaming (4h), Sleep (8h).
    *   *Goals:* "Ace Math Exam" (Target: Study).
    *   *History:* Previous 3 days showed low study time.

### OUTPUT
**Display (Markdown Rendered):**

> **📊 Reality Check**
> You spent 33% of your waking hours on Gaming today. This is a significant spike compared to your 3-day average.
>
> **⚠️ Neglected Areas**
> You have logged **0 minutes** for your "Ace Math Exam" goal.
>
> **💡 The Micro-Shift**
> Tomorrow, swap **30 minutes** of Gaming for **30 minutes** of Study immediately after breakfast.
>
> **✅ Action Plan**
> *   Leave your controller in a drawer until 5 PM.
> *   Open your Math textbook before you turn on your computer.

---

## 4. Feature: Weekly History Analysis

**Scenario:** It is Sunday, and the user wants to review their week.

### INPUT
*   **User Action:** Switch to "Weekly History" tab -> Click **"Analyze This Week"**.
*   **Data Context:**
    *   Mon-Fri: High "Work" hours, Low "Sleep".
    *   Sat-Sun: High "Social Media".

### OUTPUT
**Display (Structured Lists):**

**📉 REDUCE / STOP**
*   **Late night scrolling:** You averaged 2 hours of Social Media after 11 PM.
*   **Skipping Lunch:** No "Other/Food" logs found mid-day.

**📈 INCREASE / PRIORITIZE**
*   **Sleep:** You are averaging only 5.5 hours/night. Target 7+.
*   **Exercise:** Only 1 log found this entire week.

---

## 5. Edge Case: Invalid Inputs

**Scenario:** User tries to break the form.

### INPUT
*   **Activity Name:** `` (Empty)
*   **Duration:** `-50`

### OUTPUT
*   **System Action:** The "Add Log" button does nothing (click is ignored).
*   **UI Feedback:** Browser default validation tooltip ("Please fill out this field") or no change in state.
*   **Data:** No new log is added to the list or database.
