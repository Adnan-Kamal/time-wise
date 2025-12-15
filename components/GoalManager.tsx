import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Target, Plus, Wand2, Trash, TrendingUp, TrendingDown } from 'lucide-react';
import { Activity, Goal, CategoryType } from '../types';
import { formatDuration } from '../utils/time';
import { generateGoalAdvice } from '../services/geminiService';

interface GoalManagerProps {
  goals: Goal[];
  activities: Activity[];
  onAddGoal: (goal: Goal) => void;
  onUpdateGoal: (goal: Goal) => void;
  onDeleteGoal: (id: string) => void;
}

const GoalManager: React.FC<GoalManagerProps> = ({ goals, activities, onAddGoal, onUpdateGoal, onDeleteGoal }) => {
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [targetType, setTargetType] = useState<'MORE' | 'LESS'>('MORE');
  const [targetCategory, setTargetCategory] = useState<CategoryType | ''>('');
  const [targetDurationInput, setTargetDurationInput] = useState('');
  const [targetUnit, setTargetUnit] = useState<'minutes' | 'hours'>('minutes');
  const [loadingAI, setLoadingAI] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let targetMinutes = 0;
    if (targetDurationInput) {
       const val = parseFloat(targetDurationInput);
       targetMinutes = targetUnit === 'hours' ? Math.round(val * 60) : Math.round(val);
    }

    const newGoal: Goal = {
      id: uuidv4(),
      title: title.trim(),
      description: desc.trim(),
      targetType,
      targetCategory: targetCategory ? (targetCategory as CategoryType) : undefined,
      targetMinutes: targetMinutes > 0 ? targetMinutes : undefined,
    };

    // Auto-generate advice on create
    onAddGoal(newGoal); // Add optimistically first
    setShowForm(false);
    resetForm();

    // Trigger AI
    fetchAdvice(newGoal);
  };

  const fetchAdvice = async (goal: Goal) => {
    setLoadingAI(goal.id);
    const advice = await generateGoalAdvice(goal, activities);
    onUpdateGoal({ ...goal, aiAdvice: advice });
    setLoadingAI(null);
  };

  const resetForm = () => {
    setTitle('');
    setDesc('');
    setTargetType('MORE');
    setTargetCategory('');
    setTargetDurationInput('');
    setTargetUnit('minutes');
  };

  // Calculate Progress
  const getGoalProgress = (goal: Goal) => {
    if (!goal.targetCategory || !goal.targetMinutes) return null;

    const today = new Date().setHours(0,0,0,0);
    const currentMinutes = activities
      .filter(a => a.category === goal.targetCategory && a.timestamp >= today)
      .reduce((acc, curr) => acc + curr.duration, 0);
    
    const percentage = Math.min(100, Math.round((currentMinutes / goal.targetMinutes) * 100));
    return { currentMinutes, percentage };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-brand-600" />
            Goals & Focus
          </h2>
          <p className="text-xs text-gray-500 mt-1">Track your ambitions and get AI guidance</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 text-sm font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cancel' : 'New Goal'}
        </button>
      </div>

      {/* Add Goal Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Goal Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Ace my Math Exam" 
                className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">I want to...</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setTargetType('MORE')} className={`flex-1 py-2.5 text-xs font-bold rounded-lg border transition-all ${targetType === 'MORE' ? 'bg-green-50 border-green-200 text-green-700 shadow-sm' : 'bg-white border-gray-200 text-gray-500'}`}>
                      Do More
                    </button>
                    <button type="button" onClick={() => setTargetType('LESS')} className={`flex-1 py-2.5 text-xs font-bold rounded-lg border transition-all ${targetType === 'LESS' ? 'bg-red-50 border-red-200 text-red-700 shadow-sm' : 'bg-white border-gray-200 text-gray-500'}`}>
                      Do Less
                    </button>
                  </div>
               </div>
               
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Related Category</label>
                  <select 
                    value={targetCategory} 
                    onChange={e => setTargetCategory(e.target.value as CategoryType)}
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white outline-none cursor-pointer"
                  >
                    <option value="">-- General Goal --</option>
                    {Object.values(CategoryType).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
               </div>
            </div>

            {targetCategory && (
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Daily Target Duration</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      value={targetDurationInput}
                      onChange={e => setTargetDurationInput(e.target.value)}
                      placeholder="Amount"
                      className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                    <div className="flex bg-white border border-gray-200 rounded-lg p-1 shrink-0 items-center">
                      <button type="button" onClick={() => setTargetUnit('minutes')} className={`px-4 h-full text-xs font-bold rounded flex items-center ${targetUnit === 'minutes' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}>Min</button>
                      <button type="button" onClick={() => setTargetUnit('hours')} className={`px-4 h-full text-xs font-bold rounded flex items-center ${targetUnit === 'hours' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}>Hr</button>
                    </div>
                  </div>
               </div>
            )}

            <button type="submit" className="w-full py-3 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700 shadow-lg shadow-brand-500/20 active:scale-95 transition-all">
              Create Goal
            </button>
          </div>
        </form>
      )}

      {/* Goal List */}
      <div className="divide-y divide-gray-100">
        {goals.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            No goals set yet. Define your first goal to get started!
          </div>
        ) : (
          goals.map(goal => {
            const progress = getGoalProgress(goal);
            const isLoading = loadingAI === goal.id;

            return (
              <div key={goal.id} className="p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      {goal.title}
                      {goal.targetType === 'MORE' ? <TrendingUp className="w-3 h-3 text-green-500" /> : <TrendingDown className="w-3 h-3 text-red-500" />}
                    </h3>
                    <p className="text-xs text-gray-500">{goal.description || 'Tracking progress...'}</p>
                  </div>
                  <button onClick={() => onDeleteGoal(goal.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Bar */}
                {progress && goal.targetMinutes && (
                  <div className="mb-4 bg-white p-3 border border-gray-100 rounded-lg">
                    <div className="flex justify-between text-xs mb-2 font-medium text-gray-600">
                      <span>Daily Progress ({goal.targetCategory})</span>
                      <span className="font-mono">
                        {formatDuration(progress.currentMinutes)} / {formatDuration(goal.targetMinutes)}
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${goal.targetType === 'MORE' ? 'bg-brand-500' : 'bg-orange-500'}`}
                        style={{ width: `${progress.percentage}%` }}
                      ></div>
                    </div>
                    {goal.targetType === 'LESS' && progress.percentage > 100 && (
                      <p className="text-xs text-red-500 mt-2 font-bold flex items-center gap-1">
                         Over limit by {formatDuration(progress.currentMinutes - goal.targetMinutes)}
                      </p>
                    )}
                  </div>
                )}

                {/* AI Advice Section */}
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                      <Wand2 className="w-3 h-3 text-indigo-500" />
                      AI Action Plan
                    </span>
                    <button 
                      onClick={() => fetchAdvice(goal)}
                      disabled={isLoading}
                      className="text-[10px] bg-white border border-indigo-200 text-indigo-600 px-2.5 py-1 rounded hover:bg-indigo-50 disabled:opacity-50 font-medium"
                    >
                      {isLoading ? 'Thinking...' : 'Refresh'}
                    </button>
                  </div>
                  
                  {goal.aiAdvice ? (
                     <div className="text-xs text-indigo-800 space-y-1.5 leading-relaxed">
                        {goal.aiAdvice.split('\n').filter(l => l.trim()).map((line, idx) => (
                           <p key={idx}>{line.replace(/^-\s*/, '• ')}</p>
                        ))}
                     </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">No advice generated yet.</p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GoalManager;