import React, { useState, useEffect, useMemo } from 'react';
import { Activity, Goal, CategoryType } from './types';
import { loadActivities, saveActivities, loadGoals, saveGoals } from './services/storageService';
import ActivityForm from './components/ActivityForm';
import ActivityList from './components/ActivityList';
import DailySummary from './components/DailySummary';
import AIRecommendations from './components/AIRecommendations';
import GoalManager from './components/GoalManager';
import WeeklyHistory from './components/WeeklyHistory';
import { CalendarClock, LayoutDashboard, History, CalendarDays, Loader2 } from 'lucide-react';
import { format, isSameDay, isWithinInterval, endOfDay } from 'date-fns';
import { formatDuration } from './utils/time';

const App: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard');
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Load initial data (Async from IndexedDB)
  useEffect(() => {
    const initializeData = async () => {
      try {
        const [loadedActivities, loadedGoals] = await Promise.all([
          loadActivities(),
          loadGoals()
        ]);
        setActivities(loadedActivities);
        setGoals(loadedGoals);
      } catch (error) {
        console.error("Failed to initialize application data:", error);
      } finally {
        setIsDataLoaded(true);
      }
    };

    initializeData();
  }, []);

  // Save on change (Only if data has been loaded to prevent overwriting with empty state)
  useEffect(() => {
    if (isDataLoaded) {
      saveActivities(activities);
    }
  }, [activities, isDataLoaded]);

  useEffect(() => {
    if (isDataLoaded) {
      saveGoals(goals);
    }
  }, [goals, isDataLoaded]);

  const addActivity = (activity: Activity) => {
    setActivities(prev => [...prev, activity]);
  };

  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
  };

  const addGoal = (goal: Goal) => {
    setGoals(prev => [goal, ...prev]);
  };

  const updateGoal = (updatedGoal: Goal) => {
    setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  // Filter for only "Today's" activities for the dashboard
  const todaysActivities = activities.filter(a => isSameDay(a.timestamp, new Date()));
  
  // Total tracked time today
  const totalMinutesTracked = todaysActivities.reduce((acc, curr) => acc + curr.duration, 0);

  // Generate Recent Context (Last 3 days excluding today)
  const recentContext = useMemo(() => {
    const today = new Date();
    
    // Replacement for subDays(today, 3)
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);
    
    // Replacement for subDays(today, 1)
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Replacement for startOfDay(threeDaysAgo)
    const startOfThreeDaysAgo = new Date(threeDaysAgo);
    startOfThreeDaysAgo.setHours(0, 0, 0, 0);

    const recentLogs = activities.filter(a => 
      isWithinInterval(a.timestamp, { start: startOfThreeDaysAgo, end: endOfDay(yesterday) })
    );

    if (recentLogs.length === 0) return "No data from the last 3 days.";

    // Group by day and category
    const summary: Record<string, Record<string, number>> = {};
    recentLogs.forEach(log => {
      const dateKey = format(log.timestamp, 'MMM d');
      if (!summary[dateKey]) summary[dateKey] = {};
      summary[dateKey][log.category] = (summary[dateKey][log.category] || 0) + log.duration;
    });

    return Object.entries(summary).map(([date, cats]) => {
       const topCats = Object.entries(cats)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([c, m]) => `${c}: ${m}m`)
        .join(', ');
       return `${date}: ${topCats}`;
    }).join('\n');

  }, [activities]);

  if (!isDataLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
          <p className="text-gray-500 font-medium">Loading your planner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-brand-600 p-2 rounded-lg shadow-sm">
                <CalendarClock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-tight">TimeWise</h1>
                <p className="text-xs text-gray-500 font-medium hidden sm:block">Personal Time & Habit Coach</p>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
              {format(new Date(), 'EEEE, MMM do')}
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
               <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'dashboard' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
               >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
               </button>
               <button
                  onClick={() => setActiveTab('history')}
                  className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'history' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
               >
                  <History className="w-4 h-4" />
                  Weekly History
               </button>
            </div>
         </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Input and List */}
            <div className="lg:col-span-5 space-y-6">
              <section>
                <div className="flex items-center justify-between mb-4 px-1">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-gray-400" />
                    Today's Tracker
                  </h2>
                  <div className="text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-100 font-mono">
                    {formatDuration(totalMinutesTracked)}
                  </div>
                </div>
                <ActivityForm onAddActivity={addActivity} />
              </section>
              
              <section className="h-full">
                <ActivityList 
                  activities={todaysActivities} 
                  onDeleteActivity={deleteActivity} 
                />
              </section>
            </div>

            {/* Right Column: Visuals, Goals and AI */}
            <div className="lg:col-span-7 space-y-8">
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4 px-1">Goal Center</h2>
                <GoalManager 
                  goals={goals} 
                  activities={activities} 
                  onAddGoal={addGoal}
                  onUpdateGoal={updateGoal}
                  onDeleteGoal={deleteGoal}
                />
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4 px-1">Daily Overview</h2>
                <DailySummary activities={todaysActivities} />
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4 px-1">Daily Coach</h2>
                <AIRecommendations 
                  activities={todaysActivities} 
                  goals={goals} 
                  recentContext={recentContext}
                />
              </section>
            </div>

          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
             <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Weekly History</h2>
                <p className="text-gray-500 mt-1">Review your productivity trends week by week.</p>
             </div>
             <WeeklyHistory activities={activities} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;