import React, { useMemo, useState } from 'react';
import { endOfWeek, format, isSameDay, eachDayOfInterval } from 'date-fns';
import { Activity, CATEGORY_COLORS, CategoryType } from '../types';
import { formatDuration } from '../utils/time';
import { CalendarRange, Clock, Sparkles, Loader2, AlertCircle, TrendingDown, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { generateWeeklyAnalysis, WeeklyAnalysisResult } from '../services/geminiService';

interface WeeklyHistoryProps {
  activities: Activity[];
}

const WeeklyHistory: React.FC<WeeklyHistoryProps> = ({ activities }) => {
  const [loadingWeeks, setLoadingWeeks] = useState<Record<string, boolean>>({});
  const [adviceWeeks, setAdviceWeeks] = useState<Record<string, WeeklyAnalysisResult>>({});
  const [errorWeeks, setErrorWeeks] = useState<Record<string, string>>({});

  const weeks = useMemo(() => {
    const groups: Record<string, { start: Date; end: Date; activities: Activity[] }> = {};

    // Helper to calculate start of week (Monday)
    const getStartOfWeek = (date: number | Date) => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = (day === 0 ? 6 : day - 1); // Monday is 1, Sunday is 0. If 0 (Sun), go back 6 days.
      d.setDate(d.getDate() - diff);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    activities.forEach(activity => {
      const start = getStartOfWeek(activity.timestamp);
      const key = format(start, 'yyyy-MM-dd');
      
      if (!groups[key]) {
        groups[key] = {
          start,
          end: endOfWeek(activity.timestamp, { weekStartsOn: 1 }),
          activities: []
        };
      }
      groups[key].activities.push(activity);
    });

    // Sort by date descending (newest week first)
    return Object.values(groups).sort((a, b) => b.start.getTime() - a.start.getTime());
  }, [activities]);

  const handleAnalyzeWeek = async (weekKey: string, weekActivities: Activity[], totalMinutes: number) => {
    setLoadingWeeks(prev => ({ ...prev, [weekKey]: true }));
    setErrorWeeks(prev => ({ ...prev, [weekKey]: '' }));
    
    try {
      const advice = await generateWeeklyAnalysis(weekActivities, totalMinutes);
      setAdviceWeeks(prev => ({ ...prev, [weekKey]: advice }));
    } catch (err) {
      setErrorWeeks(prev => ({ ...prev, [weekKey]: 'Failed to analyze. Try again.' }));
    } finally {
      setLoadingWeeks(prev => ({ ...prev, [weekKey]: false }));
    }
  };

  if (weeks.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
        <CalendarRange className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No History Yet</h3>
        <p className="text-gray-500 mt-2">Log activities to build your weekly history.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {weeks.map((week) => {
        const weekKey = format(week.start, 'yyyy-MM-dd');
        const totalMinutes = week.activities.reduce((acc, curr) => acc + curr.duration, 0);
        const isLoading = loadingWeeks[weekKey];
        const advice = adviceWeeks[weekKey];
        const error = errorWeeks[weekKey];
        
        // Calculate category breakdown for this week
        const categoryData = Object.values(CategoryType).map(cat => {
            const minutes = week.activities
                .filter(a => a.category === cat)
                .reduce((acc, curr) => acc + curr.duration, 0);
            return { name: cat, value: minutes, color: CATEGORY_COLORS[cat] };
        }).filter(d => d.value > 0).sort((a,b) => b.value - a.value);

        // Daily breakdown data for chart
        const days = eachDayOfInterval({ start: week.start, end: week.end });
        const dailyData = days.map(day => {
            const mins = week.activities
                .filter(a => isSameDay(a.timestamp, day))
                .reduce((acc, curr) => acc + curr.duration, 0);
            return {
                name: format(day, 'EEE'), // Mon, Tue...
                value: mins,
            };
        });

        return (
          <div key={weekKey} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Week Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                   <CalendarRange className="w-5 h-5 text-brand-600" />
                   {format(week.start, 'MMM d')} - {format(week.end, 'MMM d, yyyy')}
                </h3>
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="font-mono font-medium text-gray-900">{formatDuration(totalMinutes)}</span>
                <span className="text-xs text-gray-400">total</span>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Left: Category Breakdown */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Time by Category</h4>
                  <div className="space-y-3">
                    {categoryData.map(cat => (
                      <div key={cat.name} className="flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                              <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                          </div>
                          <div className="flex items-center gap-4">
                              <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div className="h-full rounded-full" style={{ width: `${(cat.value / totalMinutes) * 100}%`, backgroundColor: cat.color }}></div>
                              </div>
                              <span className="text-sm font-mono text-gray-600 min-w-[50px] text-right">{formatDuration(cat.value)}</span>
                          </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Daily Activity Chart */}
                <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Daily Activity Trend</h4>
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={dailyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                              <YAxis hide />
                              <Tooltip 
                                  cursor={{ fill: '#f8fafc' }}
                                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                  formatter={(value: number) => [formatDuration(value), '']}
                              />
                              <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={20}>
                                  {dailyData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#3b82f6' : '#e2e8f0'} />
                                  ))}
                              </Bar>
                          </BarChart>
                      </ResponsiveContainer>
                    </div>
                </div>
              </div>

              {/* Weekly AI Analysis */}
              <div className="border-t border-gray-100 pt-6">
                {!advice && !isLoading ? (
                  <button 
                    onClick={() => handleAnalyzeWeek(weekKey, week.activities, totalMinutes)}
                    className="flex items-center gap-2 text-sm font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-lg transition-colors w-full sm:w-auto justify-center"
                  >
                    <Sparkles className="w-4 h-4" />
                    Analyze This Week
                  </button>
                ) : (
                  <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <h4 className="font-bold text-gray-900 text-sm">Weekly Evaluation</h4>
                    </div>

                    {isLoading && (
                      <div className="flex items-center gap-2 text-gray-500 text-sm py-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Evaluating data...
                      </div>
                    )}

                    {error && (
                      <div className="text-red-500 text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                      </div>
                    )}

                    {advice && (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                          {/* Reduce Section */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-red-600 border-b border-red-100 pb-1.5">
                                <TrendingDown className="w-4 h-4" />
                                <span className="font-bold text-xs uppercase tracking-wider">Reduce / Stop</span>
                            </div>
                            <ul className="space-y-2">
                               {advice.reduce.map((item, i) => (
                                 <li key={i} className="flex items-start gap-2 text-gray-700 bg-red-50/50 p-2 rounded-md">
                                    <span className="text-red-400 mt-0.5">•</span>
                                    {item}
                                 </li>
                               ))}
                               {advice.reduce.length === 0 && <li className="text-gray-400 italic">No major issues found.</li>}
                            </ul>
                          </div>

                          {/* Increase Section */}
                          <div className="space-y-3">
                             <div className="flex items-center gap-2 text-green-600 border-b border-green-100 pb-1.5">
                                <TrendingUp className="w-4 h-4" />
                                <span className="font-bold text-xs uppercase tracking-wider">Increase / Prioritize</span>
                            </div>
                            <ul className="space-y-2">
                               {advice.increase.map((item, i) => (
                                 <li key={i} className="flex items-start gap-2 text-gray-700 bg-green-50/50 p-2 rounded-md">
                                    <span className="text-green-500 mt-0.5">•</span>
                                    {item}
                                 </li>
                               ))}
                               {advice.increase.length === 0 && <li className="text-gray-400 italic">Keep it up!</li>}
                            </ul>
                          </div>
                       </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeeklyHistory;