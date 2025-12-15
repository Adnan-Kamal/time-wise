# Use Cases & High-Level Design: TimeWise

## Part 1: Use Cases

### Use Case 1: Logging a Daily Activity
**Actor:** Student / User  
**Description:** The user manually records a completed task or activity to track their time usage.  
**Trigger:** The user finishes an activity (e.g., studying) or reviews their day.

**Preconditions:**
1. The application is loaded in the browser.

**Main Flow:**
1. User navigates to the "Dashboard" tab.
2. User focuses on the "Today's Tracker" form.
3. User enters the **Activity Name** (e.g., "Math Homework").
4. User selects a **Category** from the dropdown (e.g., "Study").
5. User enters the **Duration** and selects the unit (Minutes or Hours).
6. User clicks the **"Add Log"** button.
7. **System** validates inputs (checks for non-empty name and positive duration).
8. **System** calculates the duration in minutes.
9. **System** updates the "Recent Logs" list, recalculates daily totals, and updates the "Daily Overview" charts immediately.
10. **System** persists the data to Local Storage.

**Alternate Flow (Invalid Input):**
1. User enters a negative duration or leaves the name blank.
2. User clicks "Add Log".
3. **System** ignores the click and does not clear the form (or shows a validation cue).
4. No data is saved.

---

### Use Case 2: Setting a Goal and Receiving AI Strategy
**Actor:** Student / User  
**Description:** The user defines a specific objective (e.g., "Sleep more") and receives immediate, personalized advice from the AI.  
**Trigger:** User decides to change a habit.

**Preconditions:**
1. User is on the Dashboard.
2. API Key is configured for Gemini.

**Main Flow:**
1. User locates the "Goal Center" section.
2. User clicks **"New Goal"**.
3. User fills in the goal details:
   - **Title:** "Fix Sleep Schedule"
   - **Type:** "Do More"
   - **Category:** "Sleep"
   - **Daily Target:** "8 Hours"
4. User clicks **"Create Goal"**.
5. **System** immediately adds the goal to the visual list and saves it to Local Storage.
6. **System** (in the background) sends the goal details + recent relevant activity history to the **Gemini API**.
7. **System** receives a text response containing 3 actionable steps.
8. **System** updates the goal card to display the **"AI Action Plan"**.

**Alternate Flow (API Failure):**
1. API fails to respond (network error or quota limit).
2. **System** logs the error.
3. **System** displays "No advice generated yet" or a retry button on the goal card.
4. User can click **"Refresh"** later to try again.

---

### Use Case 3: Weekly Review & AI Analysis
**Actor:** Student / User  
**Description:** The user reviews their past week's performance and asks the AI to identify what to stop doing and what to do more of.  
**Trigger:** It is the end of the week, or the user wants to see trends.

**Preconditions:**
1. User has logged activities for at least a few days.

**Main Flow:**
1. User switches to the **"Weekly History"** tab.
2. **System** aggregates activities by week and displays a summary card for the current week.
3. User views the "Time by Category" breakdown and "Daily Activity Trend" bar chart.
4. User clicks the **"Analyze This Week"** button.
5. **System** sends the week's logs to the **Gemini API** requesting a structured JSON response.
6. **Gemini API** analyzes the text logs and returns a JSON object with `reduce` and `increase` arrays.
7. **System** parses the JSON and renders two distinct lists:
   - **📉 Reduce / Stop:** (e.g., "Doomscrolling", " excessive gaming").
   - **📈 Increase / Prioritize:** (e.g., "Morning study", "Exercise").

**Alternate Flow (No Data):**
1. User clicks "Weekly History" but has just started using the app.
2. **System** displays "No History Yet" empty state.

---

## Part 2: High-Level Design & Data Flow

### 1. Architecture
TimeWise is a **Client-Side Single Page Application (SPA)** built with:
*   **Frontend:** React (UI components), Vite (Build tool), TypeScript (Type safety).
*   **Styling:** Tailwind CSS (Utility-first styling).
*   **State Management:** React `useState` / `useEffect` (Local component state).
*   **Persistence:** Browser `localStorage` (No backend database).
*   **AI Service:** Direct integration with Google Gemini API via `@google/genai` SDK.

### 2. Data Flow Diagram

```mermaid
graph TD
    User[User] -->|Inputs Data| Form[ActivityForm Component]
    Form -->|Updates State| AppState[App.tsx State]
    
    AppState -->|Writes JSON| LocalStorage[(Browser LocalStorage)]
    LocalStorage -->|Reads JSON on Load| AppState
    
    AppState -->|Props| Charts[DailySummary / Recharts]
    AppState -->|Props| List[ActivityList Component]
    
    User -->|Clicks Analyze| AI_UI[AIRecommendations / WeeklyHistory]
    AI_UI -->|Sends History Context| GeminiService[geminiService.ts]
    
    GeminiService -->|HTTPS Request (Prompt)| GoogleAPI[Google Gemini API]
    GoogleAPI -->|JSON or Text Response| GeminiService
    GeminiService -->|Returns Data| AI_UI
    AI_UI -->|Updates State| AppState
```

### 3. Key Components & Responsibilities

1.  **`App.tsx` (Controller):**
    *   Holds the "Source of Truth" for `activities` and `goals`.
    *   Calculates derived data (e.g., "Recent Context" for the last 3 days).
    *   Handles tab switching (`Dashboard` vs `History`).

2.  **`storageService.ts` (Persistence Layer):**
    *   Abstracts `localStorage` operations.
    *   `saveActivities()` / `loadActivities()`.
    *   Ensures data persists across page reloads.

3.  **`geminiService.ts` (AI Layer):**
    *   **`generateDailyCoaching`**: Takes today's logs + goals + recent history -> Returns Markdown advice.
    *   **`generateWeeklyAnalysis`**: Takes weekly logs -> Returns JSON (`{ reduce: [], increase: [] }`).
    *   **`generateGoalAdvice`**: Takes a specific goal -> Returns actionable steps.

4.  **`GoalManager.tsx` (Goal Logic):**
    *   Calculates progress percentages based on category matches.
    *   Displays progress bars.
    *   Manages individual AI calls for goal strategy.

### 4. Data Model (Simplified)

**Activity Object:**
```typescript
{
  id: string;
  name: string;      // "Math Homework"
  category: string;  // "Study"
  duration: number;  // 60 (minutes)
  timestamp: number; // Unix Epoch
}
```

**Goal Object:**
```typescript
{
  id: string;
  title: string;     // "Read More"
  targetType: "MORE" | "LESS";
  targetCategory: string;
  targetMinutes: number;
  aiAdvice: string;  // "1. Start small..."
}
```
