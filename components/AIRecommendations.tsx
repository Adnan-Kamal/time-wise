import React, { useState } from 'react';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { Activity, Goal, AIResponseState } from '../types';
import { generateDailyCoaching } from '../services/geminiService';

interface AIRecommendationsProps {
  activities: Activity[];
  goals: Goal[];
  recentContext: string;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({ activities, goals, recentContext }) => {
  const [state, setState] = useState<AIResponseState>({
    loading: false,
    error: null,
    content: null,
  });

  const handleGenerateAdvice = async () => {
    setState({ loading: true, error: null, content: null });

    try {
      // Calculate total minutes for the prompt context
      const totalMinutes = activities.reduce((acc, curr) => acc + curr.duration, 0);
      
      const advice = await generateDailyCoaching(activities, totalMinutes, goals, recentContext);
      setState({ loading: false, error: null, content: advice });
    } catch (err) {
      setState({ 
        loading: false, 
        error: "Failed to connect to the AI Coach. Please check your connection or API Key.", 
        content: null 
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-brand-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-brand-400 opacity-10 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-300" />
            AI Habit Coach
          </h2>
          {!state.loading && !state.content && (
             <button
             onClick={handleGenerateAdvice}
             disabled={activities.length === 0}
             className="bg-white text-brand-900 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-brand-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
           >
             Analyze My Day
           </button>
          )}
           {state.content && (
             <button
             onClick={handleGenerateAdvice}
             className="bg-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-white/20 transition-colors backdrop-blur-sm"
           >
             Refresh
           </button>
          )}
        </div>

        {/* Initial State */}
        {!state.loading && !state.content && !state.error && (
          <div className="text-brand-100 text-sm leading-relaxed">
            <p className="mb-2">
              Ready to improve? I can analyze your logs to find hidden time sinks and suggest improvements.
            </p>
            <p className="opacity-75 text-xs italic">
              *Requires activities to be logged first.
            </p>
          </div>
        )}

        {/* Loading State */}
        {state.loading && (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-10 h-10 animate-spin text-brand-200 mb-3" />
            <p className="text-brand-100 animate-pulse">Analyzing your habits...</p>
          </div>
        )}

        {/* Error State */}
        {state.error && (
          <div className="bg-red-500/20 border border-red-500/30 p-4 rounded-lg flex items-start gap-3 text-red-100">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{state.error}</p>
          </div>
        )}

        {/* Content State */}
        {state.content && (
          <div className="prose prose-invert prose-sm max-w-none">
            <div className="whitespace-pre-wrap font-light leading-relaxed">
                {/* Simple markdown rendering */}
                {state.content.split('\n').map((line, i) => {
                    if (line.startsWith('**')) return <h3 key={i} className="font-bold text-yellow-300 mt-4 mb-1 text-base">{line.replace(/\*\*/g, '')}</h3>;
                    if (line.startsWith('###')) return <h3 key={i} className="font-bold text-white mt-4 mb-2">{line.replace(/###/g, '')}</h3>;
                    if (line.startsWith('- ')) return <li key={i} className="ml-4 text-brand-50 mb-1">{line.replace('- ', '')}</li>;
                    if (line.startsWith('1. ')) return <div key={i} className="font-bold text-yellow-300 mt-4 mb-2">{line}</div>;
                    if (line.trim() === '') return <div key={i} className="h-2"></div>;
                    return <p key={i} className="mb-1">{line.replace(/\*\*/g, '')}</p>;
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommendations;