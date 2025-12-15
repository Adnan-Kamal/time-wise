import React from 'react';
import { Trash2, List } from 'lucide-react';
import { Activity, CATEGORY_COLORS } from '../types';
import { format } from 'date-fns';
import { formatDuration } from '../utils/time';

interface ActivityListProps {
  activities: Activity[];
  onDeleteActivity: (id: string) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({ activities, onDeleteActivity }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <List className="w-4 h-4 text-gray-500" />
          Recent Logs
        </h3>
        <span className="text-xs text-gray-400 font-medium">
          {activities.length} entries
        </span>
      </div>
      
      <div className="overflow-y-auto max-h-[400px] p-2">
        {activities.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            No activities logged today.
          </div>
        ) : (
          <ul className="space-y-2">
            {[...activities].reverse().map((activity) => (
              <li key={activity.id} className="group flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-3">
                   <div 
                     className="w-2 h-10 rounded-full shrink-0" 
                     style={{ backgroundColor: CATEGORY_COLORS[activity.category] }} 
                   />
                   <div>
                     <p className="font-medium text-gray-800 text-sm">{activity.name}</p>
                     <div className="flex items-center gap-2 text-xs text-gray-500">
                       <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-medium">
                         {activity.category}
                       </span>
                       <span>•</span>
                       <span className="font-mono text-gray-700">{formatDuration(activity.duration)}</span>
                       <span>•</span>
                       <span>{format(activity.timestamp, 'h:mm a')}</span>
                     </div>
                   </div>
                </div>
                
                <button
                  onClick={() => onDeleteActivity(activity.id)}
                  className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                  aria-label="Delete activity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ActivityList;
