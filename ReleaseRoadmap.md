# Release Roadmap: TimeWise

## Phase 1: Stability & Retention (0 - 3 Months)
**Focus:** Refining the core loop, improving data safety, and enhancing the immediate user experience.

*   **PWA Support (Progressive Web App):**
    *   Make the app installable on mobile home screens.
    *   Enable offline support for loading the UI without internet (caching assets).
*   **Data Portability:**
    *   **Export/Import JSON:** Allow users to backup their data or move it to another browser since `localStorage` is device-specific.
    *   **CSV Export:** Enable users to download their logs for analysis in Excel/Google Sheets.
*   **UI/UX Polish:**
    *   **Dark Mode:** A toggle for late-night study sessions.
    *   **Custom Categories:** Allow users to define their own category labels and colors beyond the default set.
*   **Smart Defaults:**
    *   Remember the last used category or duration to speed up logging for repetitive tasks.

## Phase 2: Growth & Ecosystem (3 Months - 1 Year)
**Focus:** Breaking the "manual entry" barrier and enabling multi-device usage.

*   **Optional Cloud Sync (Freemium):**
    *   Introduce lightweight user accounts (Firebase/Supabase).
    *   Sync data between Desktop (study) and Mobile (on the go).
*   **Calendar Integration (Read-Only):**
    *   Connect Google Calendar to import "Planned" events.
    *   **Feature:** "Planned vs. Actual" visualization. Did you actually study during the block you scheduled?
*   **Gamification:**
    *   **Streaks:** visual counters for consecutive days of hitting specific goals.
    *   **Badges:** Unlockable achievements (e.g., "Early Bird" for logging before 8 AM).
*   **Advanced AI Chat:**
    *   Upgrade from static "Daily Reports" to a conversational interface where users can ask: *"Why am I so tired on Tuesdays?"*

## Phase 3: Automation & Intelligence (1 - 2 Years)
**Focus:** Reducing friction and providing predictive insights.

*   **Browser Extension Companion:**
    *   Automatically track time spent on specific websites (YouTube, Instagram) to reduce manual logging effort for screen-based distractions.
*   **Mobile App (React Native):**
    *   Native notifications for reminders: *"You haven't logged anything in 4 hours. What are you up to?"*
    *   Lock-screen widgets for quick logging.
*   **Predictive Analytics:**
    *   Use long-term historical data to predict burnout.
    *   *Insight:* "You historically crash 2 days after a 10-hour study binge. Schedule a break tomorrow."
*   **Social/Group features:**
    *   **Study Groups:** Anonymous or private leaderboards for study hours (e.g., "Exam Prep Squad").
    *   **Accountability Partners:** Share specific goal progress with a friend automatically.