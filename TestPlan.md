# Test Plan: TimeWise - Personal Time & Habit Coach

## Test Environment
*   **OS:** Any (Browser-based)
*   **Browser:** Chrome / Edge / Firefox (Latest)
*   **Pre-requisites:** `npm run dev` is running; Valid API Key is configured in `vite.config.ts`.

---

## Test Cases

### TC-01: Log Valid Activity (Minutes)
*   **Type:** Normal / Positive
*   **Description:** Verify that a user can log a standard activity using minutes.
*   **Input:**
    *   Name: "Morning Jog"
    *   Category: "Exercise"
    *   Duration: "30"
    *   Unit: "Min"
*   **Steps:**
    1. Open Dashboard.
    2. Enter inputs into "Today's Tracker".
    3. Click "Add Log".
*   **Expected Result:** Activity appears in "Recent Logs" list. Daily Total increases by 30m. Charts update.
*   **Actual Result:** Activity is added successfully. Time shows "00:30". Charts reflect "Exercise" category.

### TC-02: Log Activity with Unit Conversion (Hours)
*   **Type:** Normal / Calculation
*   **Description:** Verify that entering hours correctly converts to minutes for storage and display.
*   **Input:**
    *   Name: "Physics Project"
    *   Category: "Study"
    *   Duration: "1.5"
    *   Unit: "Hr"
*   **Steps:**
    1. Toggle unit button to "Hr".
    2. Enter "1.5" in duration.
    3. Click "Add Log".
*   **Expected Result:** System converts 1.5 hours to 90 minutes. Display shows "01:30". Total increases by 90m.
*   **Actual Result:** Log added. Display shows "01:30" in Recent Logs.

### TC-03: Invalid Activity Logging (Negative/Empty)
*   **Type:** Negative
*   **Description:** Verify that the system rejects invalid inputs.
*   **Input:**
    *   Name: "" (Empty) OR Duration: "-10"
*   **Steps:**
    1. Leave name empty.
    2. Enter duration "-10".
    3. Click "Add Log".
*   **Expected Result:** Form does not submit. No new activity is added. List count remains unchanged.
*   **Actual Result:** Browser HTML5 validation prevents submission (or React state check blocks it). No data added.

### TC-04: Goal Progress Tracking (Exact Match)
*   **Type:** Functional
*   **Description:** Verify that logging an activity updates the specific Goal progress bar linked to that category.
*   **Input:**
    *   **Goal Setup:** Title="Read More", Category="Other", Target="60m", Type="MORE".
    *   **Activity:** Name="Novel", Category="Other", Duration="30m".
*   **Steps:**
    1. Create the Goal.
    2. Log the Activity matching the goal's category.
*   **Expected Result:** Goal progress bar should show exactly 50%. Text should read "00:30 / 01:00".
*   **Actual Result:** Progress bar updates to 50% immediately after logging.

### TC-05: Goal "Do Less" Overflow (Edge Case)
*   **Type:** Edge Case
*   **Description:** Verify visual feedback when a user exceeds a limit they set for a "Do Less" goal.
*   **Input:**
    *   **Goal:** Title="Less TikTok", Category="Social Media", Target="30m", Type="LESS".
    *   **Activity:** Name="Scrolling", Category="Social Media", Duration="45m".
*   **Steps:**
    1. Create "Do Less" goal.
    2. Log activity that exceeds target.
*   **Expected Result:** Progress bar fills completely (100%+). A warning message "Over limit by 00:15" appears in red.
*   **Actual Result:** Red warning text appears below the progress bar indicating the excess time.

### TC-06: AI Analysis Button State (Empty State)
*   **Type:** UI / Logic
*   **Description:** Verify that the "Analyze My Day" button prevents API calls when there is no data.
*   **Input:**
    *   Clear all data (or fresh load).
    *   No activities in list.
*   **Steps:**
    1. Locate "Daily Coach" section.
    2. Attempt to click "Analyze My Day".
*   **Expected Result:** Button should be disabled (grayed out) or show a tooltip saying data is needed.
*   **Actual Result:** Button is disabled (`disabled={activities.length === 0}`).

### TC-07: Weekly History Aggregation
*   **Type:** Data Logic
*   **Description:** Verify that activities are grouped correctly by week and daily totals are accurate.
*   **Input:**
    *   Log 1 activity for "Today".
    *   (Simulated) Log 1 activity for "Last Week" (requires manipulating local storage or system date, or simply logging over multiple actual days).
*   **Steps:**
    1. Log varied activities.
    2. Switch to "Weekly History" tab.
*   **Expected Result:** Activities are grouped into specific date ranges (e.g., "Oct 23 - Oct 29"). Daily chart shows bars only for days with data.
*   **Actual Result:** Week cards are generated. Bar chart correctly visualizes the daily distribution.
