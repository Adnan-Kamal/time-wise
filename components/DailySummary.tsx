import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Activity, CategoryType, CATEGORY_COLORS } from '../types';
import { PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import { formatDuration } from '../utils/time';

interface DailySummaryProps {
  activities: Activity[];
}

const DailySummary: React.FC<DailySummaryProps> = ({ activities }) => {
  const stats = useMemo(() => {
    const breakdown: Record<string, number> = {};
    let total = 0;

    activities.forEach(a => {
      breakdown[a.category] = (breakdown[a.category] || 0) + a.duration;
      total += a.duration;
    });

    const data = Object.keys(breakdown).map(key => ({
      name: key,
      value: breakdown[key],
      color: CATEGORY_COLORS[key as CategoryType] || '#94a3b8',
    })).sort((a, b) => b.value - a.value);

    return { total, data };
  }, [activities]);

  if (activities.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center min-h-[300px]">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <PieChartIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">No Data Yet</h3>
        <p className="text-gray-500 mt-2 max-w-xs">Start logging your activities to see a breakdown of your day.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Donut Chart Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-brand-600" />
            Distribution
          </h2>
          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-mono">
            {formatDuration(stats.total)} tracked
          </span>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {stats.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [formatDuration(value), 'Duration']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-600" />
            Category Ranking
          </h2>
        </div>
        <div className="h-[300px] w-full">
           <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={100} 
                tick={{ fontSize: 12, fill: '#64748b' }} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                 cursor={{ fill: '#f8fafc' }}
                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                 formatter={(value: number) => [formatDuration(value), 'Duration']}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {stats.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DailySummary;
