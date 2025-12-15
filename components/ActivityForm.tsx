import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PlusCircle, Clock, Tag } from 'lucide-react';
import { Activity, CategoryType } from '../types';

interface ActivityFormProps {
  onAddActivity: (activity: Activity) => void;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ onAddActivity }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryType>(CategoryType.STUDY);
  const [durationInput, setDurationInput] = useState<string>(''); 
  const [unit, setUnit] = useState<'minutes' | 'hours'>('minutes');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(durationInput);

    if (!name.trim() || !val || val <= 0) return;

    // Convert to minutes for storage
    const durationInMinutes = unit === 'hours' ? Math.round(val * 60) : Math.round(val);

    const newActivity: Activity = {
      id: uuidv4(),
      name: name.trim(),
      category,
      duration: durationInMinutes,
      timestamp: Date.now(),
    };

    onAddActivity(newActivity);
    setName('');
    setDurationInput('');
    // Keep category and unit as is
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
        <PlusCircle className="w-5 h-5 text-brand-600" />
        Log Activity
      </h2>
      
      <div className="space-y-5">
        {/* Activity Name - Full Width */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Activity Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Math Homework..."
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Category Selection - Half Width */}
          <div>
             <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide flex items-center gap-1">
               <Tag className="w-3 h-3" /> Category
             </label>
             <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryType)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all cursor-pointer"
            >
              {Object.values(CategoryType).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Duration Input - Half Width */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide flex items-center gap-1">
              <Clock className="w-3 h-3" /> Duration
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0.1"
                step="any"
                value={durationInput}
                onChange={(e) => setDurationInput(e.target.value)}
                placeholder={unit === 'minutes' ? '30' : '1.5'}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                required
              />
              <div className="flex bg-gray-100 rounded-lg p-1 shrink-0 h-[46px] items-center">
                 <button
                   type="button"
                   onClick={() => setUnit('minutes')}
                   className={`px-3 h-full text-xs font-bold rounded-md transition-all flex items-center ${unit === 'minutes' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                 >
                   Min
                 </button>
                 <button
                   type="button"
                   onClick={() => setUnit('hours')}
                   className={`px-3 h-full text-xs font-bold rounded-md transition-all flex items-center ${unit === 'hours' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                 >
                   Hr
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="bg-brand-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-brand-700 shadow-lg shadow-brand-500/30 active:scale-95 transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <PlusCircle className="w-5 h-5" />
          Add Log
        </button>
      </div>
    </form>
  );
};

export default ActivityForm;