import React, { useMemo, useState } from 'react';
import { Activity, Category, AnalysisResult } from '../types';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, CartesianGrid 
} from 'recharts';
import { 
  BrainCircuit, Sparkles, TrendingUp, 
  BarChart3, Clock, Target, Zap, 
  AlertCircle, Battery
} from 'lucide-react';
import { Button } from './Button';
import { geminiService } from '../services/geminiService';

interface DashboardProps {
  date: string;
  activities: Activity[];
  username?: string;
}

const COLORS = {
  primary: '#E57CD8', // Pink
  secondary: '#2C1338', // Dark Purple
  tertiary: '#412A4C', // Light Purple
  accent: '#F97316', // Orange
  success: '#10B981', // Emerald
  info: '#3B82F6', // Blue
  warning: '#F59E0B', // Amber
  slate: '#94A3B8'
};

const CATEGORY_COLORS: Record<string, string> = {
  [Category.WORK]: '#F43F5E', // Rose
  [Category.STUDY]: '#8B5CF6', // Violet
  [Category.SLEEP]: '#1E293B', // Slate
  [Category.ENTERTAINMENT]: '#F59E0B', // Amber
  [Category.EXERCISE]: '#10B981', // Emerald
  [Category.CHORES]: '#F97316', // Orange
  [Category.SOCIAL]: '#EC4899', // Pink
  [Category.OTHER]: '#64748B'  // Gray
};

export const Dashboard: React.FC<DashboardProps> = ({ date, activities, username }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // --- Data Processing ---
  const { categoryData, totalMinutes, focusMinutes, leisureMinutes, sleepMinutes } = useMemo(() => {
    const map = new Map<string, number>();
    let focus = 0;
    let leisure = 0;
    let sleep = 0;

    activities.forEach(a => {
      map.set(a.category, (map.get(a.category) || 0) + a.minutes);
      
      // Calculate split
      if ([Category.WORK, Category.STUDY, Category.EXERCISE, Category.CHORES].includes(a.category)) {
        focus += a.minutes;
      } else if ([Category.SLEEP].includes(a.category)) {
        sleep += a.minutes;
      } else {
        leisure += a.minutes;
      }
    });

    const data = Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return { 
      categoryData: data, 
      totalMinutes: activities.reduce((acc, curr) => acc + curr.minutes, 0),
      focusMinutes: focus,
      leisureMinutes: leisure,
      sleepMinutes: sleep
    };
  }, [activities]);

  const totalHours = totalMinutes / 60;
  const utilizationPercentage = Math.min(100, Math.round((totalMinutes / 1440) * 100));

  const handleAIAnalyze = async () => {
    setAnalyzing(true);
    const result = await geminiService.analyzeDay(activities);
    setAnalysis(result);
    setAnalyzing(false);
  };

  // --- Empty State ---
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
        <div className="w-32 h-32 bg-gradient-to-tr from-brand-light to-white rounded-full flex items-center justify-center mb-8 shadow-xl shadow-purple-900/5 border border-white">
          <BarChart3 size={48} className="text-brand-pink opacity-80" />
        </div>
        <h2 className="text-3xl font-bold text-brand-dark mb-4">No data for {new Date(date).toLocaleDateString(undefined, { weekday: 'long' })}</h2>
        <p className="text-slate-500 max-w-md mb-8 leading-relaxed text-lg">
          Your dashboard is waiting. Log your first activity to unlock powerful insights about your day.
        </p>
        <div className="flex gap-2 text-sm text-slate-400 font-medium bg-slate-100 px-4 py-2 rounded-full">
            <AlertCircle size={16} />
            <span>Select 'Timer' in the sidebar to start</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-brand-dark">
             {username ? `Hello, ${username}` : 'Dashboard'}
           </h1>
           <p className="text-slate-500 mt-1 font-medium flex items-center gap-2">
             Analytics for <span className="text-brand-pink font-bold">{date}</span>
             {utilizationPercentage < 100 && (
                <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                    {1440 - totalMinutes}m remaining
                </span>
             )}
           </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
            <div className="text-right">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Day Logged</div>
                <div className="text-lg font-bold text-brand-dark">{utilizationPercentage}%</div>
            </div>
            <div className="w-10 h-10 relative">
               <svg className="w-full h-full transform -rotate-90">
                  <circle cx="20" cy="20" r="16" stroke="#f1f5f9" strokeWidth="4" fill="none" />
                  <circle 
                    cx="20" cy="20" r="16" stroke="#E57CD8" strokeWidth="4" fill="none" 
                    strokeDasharray={100} strokeDashoffset={100 - utilizationPercentage} 
                    className="transition-all duration-1000 ease-out"
                  />
               </svg>
            </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <StatCard 
            icon={<Clock className="text-white" size={20} />}
            label="Total Logged"
            value={`${totalHours.toFixed(1)}h`}
            subValue={`${activities.length} entries`}
            color="bg-brand-dark"
            textColor="text-white"
         />
         <StatCard 
            icon={<Target className="text-brand-pink" size={20} />}
            label="Top Focus"
            value={categoryData[0]?.name || '-'}
            subValue={`${Math.round(categoryData[0]?.value / 60 * 10) / 10} hours`}
            color="bg-white"
         />
         <StatCard 
            icon={<Zap className="text-amber-500" size={20} />}
            label="Focus Time"
            value={`${Math.round(focusMinutes / 60 * 10) / 10}h`}
            subValue={`${Math.round((focusMinutes / totalMinutes) * 100)}% of logged`}
            color="bg-white"
         />
         <StatCard 
            icon={<Battery className="text-emerald-500" size={20} />}
            label="Rest & Leisure"
            value={`${Math.round((leisureMinutes + sleepMinutes) / 60 * 10) / 10}h`}
            subValue="Recharge time"
            color="bg-white"
         />
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Visualizations */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Category Bar Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-brand-dark mb-6 flex items-center gap-2">
                    <BarChart3 size={18} className="text-slate-400" />
                    Time by Category
                </h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} layout="vertical" margin={{ left: 20, right: 30, top: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                        <XAxis type="number" hide />
                        <YAxis 
                            dataKey="name" 
                            type="category" 
                            tick={{fill: '#475569', fontSize: 12, fontWeight: 600}} 
                            width={100}
                            axisLine={false}
                            tickLine={false}
                        />
                        <RechartsTooltip 
                            cursor={{fill: '#f8fafc'}}
                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)'}}
                            formatter={(value: number) => [`${Math.round(value / 60 * 10) / 10}h`, 'Duration']}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || COLORS.slate} />
                            ))}
                        </Bar>
                    </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Split Chart */}
            <div className="grid md:grid-cols-2 gap-6">
                 {/* Focus Distribution */}
                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Focus vs Rest</h3>
                    <div className="h-[200px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Focus', value: focusMinutes },
                                        { name: 'Leisure', value: leisureMinutes },
                                        { name: 'Sleep', value: sleepMinutes },
                                    ]}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    <Cell fill={CATEGORY_COLORS[Category.WORK]} />
                                    <Cell fill={CATEGORY_COLORS[Category.ENTERTAINMENT]} />
                                    <Cell fill={CATEGORY_COLORS[Category.SLEEP]} />
                                </Pie>
                                <RechartsTooltip contentStyle={{borderRadius: '8px'}} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                 </div>

                 {/* Detailed List */}
                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 overflow-y-auto max-h-[300px]">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Category Details</h3>
                    <div className="space-y-4">
                        {categoryData.map((cat) => (
                            <div key={cat.name} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: CATEGORY_COLORS[cat.name] || COLORS.slate}}></div>
                                    <span className="text-sm font-semibold text-slate-700">{cat.name}</span>
                                </div>
                                <div className="text-sm font-mono text-slate-500">
                                    {Math.floor(cat.value / 60)}h {cat.value % 60}m
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
            </div>

        </div>

        {/* Right Column: AI & Insights */}
        <div className="space-y-6">
            
            {/* AI Assistant Card */}
            <div className="bg-gradient-to-br from-[#2C1338] to-[#1F1029] rounded-2xl p-1 shadow-xl text-white">
                <div className="bg-[#2C1338]/50 backdrop-blur-xl p-6 rounded-xl h-full flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-pink/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="p-2 bg-white/10 rounded-lg shadow-inner">
                            <BrainCircuit className="text-brand-pink" size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight">AI Coach</h3>
                            <p className="text-xs text-purple-200/60 font-medium">Powered by Gemini</p>
                        </div>
                    </div>

                    {!analysis ? (
                         <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                            <p className="text-purple-200/80 text-sm mb-6 leading-relaxed">
                                Ready to analyze your day? I can review your logs and suggest ways to improve your routine.
                            </p>
                            <Button 
                                onClick={handleAIAnalyze} 
                                isLoading={analyzing} 
                                variant="primary" 
                                className="w-full shadow-lg shadow-pink-500/20"
                            >
                                <Sparkles size={16} />
                                Generate Report
                            </Button>
                         </div>
                    ) : (
                        <div className="animate-slide-up relative z-10">
                             <div className="mb-6">
                                <div className="text-xs text-purple-300 font-bold uppercase tracking-wider mb-2">Productivity Score</div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black text-white">{analysis.productivityScore}</span>
                                    <span className="text-purple-300/50 text-xl font-bold">/100</span>
                                </div>
                             </div>

                             <div className="space-y-4 mb-6">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <p className="text-sm text-purple-100 leading-relaxed italic">"{analysis.summary}"</p>
                                </div>
                             </div>

                             <div className="space-y-2">
                                {analysis.suggestions.map((s, i) => (
                                    <div key={i} className="flex gap-3 text-xs text-purple-200 p-2 hover:bg-white/5 rounded-lg transition-colors">
                                        <TrendingUp size={14} className="text-brand-pink shrink-0 mt-0.5" />
                                        <span>{s}</span>
                                    </div>
                                ))}
                             </div>

                             <Button 
                                onClick={handleAIAnalyze} 
                                isLoading={analyzing} 
                                variant="ghost" 
                                className="w-full mt-6 text-white hover:bg-white/10 border border-white/10"
                            >
                                Refresh Analysis
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Tips or Quote (Static for visual balance) */}
            <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100/50">
                <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-indigo-100 rounded-md text-indigo-600">
                        <Zap size={16} fill="currentColor" />
                    </div>
                    <div>
                        <h4 className="text-indigo-900 font-bold text-sm mb-1">Did you know?</h4>
                        <p className="text-indigo-800/70 text-xs leading-relaxed">
                            Research suggests that taking a break every 90 minutes can improve long-term focus by up to 30%.
                        </p>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, subValue, color, textColor = 'text-slate-800' }: any) => (
  <div className={`${color} p-6 rounded-2xl shadow-sm border border-slate-100 transition-transform hover:-translate-y-1 duration-300`}>
    <div className="flex justify-between items-start mb-4">
       <div className={`text-3xl font-bold ${textColor} tracking-tight`}>{value}</div>
       <div className={`p-2 rounded-lg ${textColor === 'text-white' ? 'bg-white/10' : 'bg-slate-50'}`}>
         {icon}
       </div>
    </div>
    <div>
        <div className={`text-xs font-bold uppercase tracking-wider ${textColor === 'text-white' ? 'text-white/60' : 'text-slate-400'}`}>{label}</div>
        <div className={`text-sm font-medium mt-1 ${textColor === 'text-white' ? 'text-white/80' : 'text-slate-500'}`}>{subValue}</div>
    </div>
  </div>
);
