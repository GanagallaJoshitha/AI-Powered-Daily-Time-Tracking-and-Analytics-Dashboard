import React, { useState, useRef } from 'react';
import { Activity, Category } from '../types';
import { Button } from './Button';
import { Trash2, Tag, Clock, CheckCircle2, Play, PlusCircle, Edit3, X, Save } from 'lucide-react';

interface TrackerProps {
  date: string;
  activities: Activity[];
  onUpdate: (activities: Activity[]) => void;
  onAnalyze: () => void;
}

export const Tracker: React.FC<TrackerProps> = ({ date, activities, onUpdate, onAnalyze }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>(Category.WORK);
  
  // Split time state into Hours and Minutes
  const [durationHours, setDurationHours] = useState<number>(0);
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const titleInputRef = useRef<HTMLInputElement>(null);

  const totalMinutes = activities.reduce((acc, curr) => acc + curr.minutes, 0);
  
  // Calculate remaining minutes. 
  // If editing, we add back the minutes of the item being edited to the "available" pool.
  const activityBeingEdited = activities.find(a => a.id === editingId);
  const minutesInEdit = activityBeingEdited ? activityBeingEdited.minutes : 0;
  const remainingMinutes = 1440 - totalMinutes + minutesInEdit;
  
  const isDayComplete = totalMinutes >= 1440 && !editingId;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate total minutes from inputs
    const totalInputMinutes = (durationHours * 60) + durationMinutes;

    if (totalInputMinutes <= 0 || !title) return;
    
    // Cap minutes to remaining
    const minutesToSave = Math.min(totalInputMinutes, remainingMinutes);
    
    if (editingId) {
      // UPDATE existing activity
      const updatedActivities = activities.map(a => 
        a.id === editingId 
          ? { ...a, title, category, minutes: minutesToSave }
          : a
      );
      onUpdate(updatedActivities);
      setEditingId(null);
    } else {
      // ADD new activity
      const newActivity: Activity = {
        id: crypto.randomUUID(),
        title,
        category,
        minutes: minutesToSave
      };
      onUpdate([...activities, newActivity]);
    }

    // Reset form
    setTitle('');
    setDurationHours(0);
    setDurationMinutes(30);
    // Optional: Reset category or keep previous
  };

  const startEdit = (activity: Activity) => {
    setEditingId(activity.id);
    setTitle(activity.title);
    setCategory(activity.category);
    
    // Convert total minutes back to H:M
    setDurationHours(Math.floor(activity.minutes / 60));
    setDurationMinutes(activity.minutes % 60);
    
    // Focus the input to signal edit mode started
    setTimeout(() => titleInputRef.current?.focus(), 100);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setDurationHours(0);
    setDurationMinutes(30);
    setCategory(Category.WORK);
  };

  const handleDelete = (id: string) => {
    if (editingId === id) cancelEdit();
    onUpdate(activities.filter(a => a.id !== id));
  };

  // Input handlers to keep values clean
  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (isNaN(val)) setDurationHours(0);
    else setDurationHours(Math.max(0, Math.min(24, val)));
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (isNaN(val)) setDurationMinutes(0);
    else setDurationMinutes(Math.max(0, Math.min(59, val)));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Floating Timer Bar */}
      <div className={`transition-all duration-300 ${(!isDayComplete || editingId) ? 'opacity-100 translate-y-0' : 'opacity-50 pointer-events-none'}`}>
        <div className={`rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-2 pl-6 flex flex-col md:flex-row items-center gap-3 md:gap-0 border transition-colors ${editingId ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-100' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
           <form onSubmit={handleSubmit} className="w-full flex flex-col md:flex-row items-center gap-2 flex-1">
             
             {/* Description Input */}
             <div className="flex-1 w-full relative">
               <input
                ref={titleInputRef}
                type="text"
                placeholder={editingId ? "Edit activity description..." : "What are you working on?"}
                className="w-full bg-transparent outline-none text-slate-700 placeholder-slate-400 text-base py-3 font-medium"
                value={title}
                onChange={e => setTitle(e.target.value)}
                autoFocus={!isDayComplete}
                disabled={isDayComplete && !editingId}
              />
              {editingId && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-indigo-200 text-indigo-700 px-2 py-0.5 rounded-full uppercase tracking-wider hidden md:block">
                  Editing
                </span>
              )}
             </div>

             {/* Category Select */}
             <div className={`flex items-center gap-2 w-full md:w-auto border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-4 md:pr-2 ${editingId ? 'border-indigo-200' : 'border-slate-100'}`}>
                <Tag size={18} className={`${editingId ? 'text-indigo-500' : 'text-brand-pink'} shrink-0`} />
                <div className="relative">
                  <select
                    className={`appearance-none bg-transparent outline-none text-sm font-bold cursor-pointer min-w-[120px] transition-colors py-2 uppercase tracking-wide ${editingId ? 'text-indigo-700' : 'text-slate-600 hover:text-brand-pink'}`}
                    value={category}
                    onChange={e => setCategory(e.target.value as Category)}
                    disabled={isDayComplete && !editingId}
                  >
                    {Object.values(Category).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
             </div>

             {/* Duration Inputs (Hours : Minutes) */}
             <div className={`flex items-center gap-1 w-full md:w-auto border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-4 md:pr-4 ${editingId ? 'border-indigo-200' : 'border-slate-100'}`}>
                
                {/* Hours Input */}
                <div className={`text-xl font-mono flex items-center rounded px-2 py-1 ${editingId ? 'bg-indigo-100 text-indigo-900 font-bold' : 'bg-slate-50 text-slate-800 font-bold'}`}>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    className="w-8 bg-transparent outline-none text-right placeholder-slate-300"
                    value={durationHours === 0 ? '' : durationHours}
                    onChange={handleHourChange}
                    disabled={isDayComplete && !editingId}
                    placeholder="0"
                  />
                  <span className={`text-sm ml-0.5 font-sans font-semibold ${editingId ? 'text-indigo-400' : 'text-slate-400'}`}>h</span>
                </div>
                
                <span className="text-slate-300 font-bold pb-1">:</span>

                {/* Minutes Input */}
                <div className={`text-xl font-mono flex items-center rounded px-2 py-1 ${editingId ? 'bg-indigo-100 text-indigo-900 font-bold' : 'bg-slate-50 text-slate-800 font-bold'}`}>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    className="w-10 bg-transparent outline-none text-right placeholder-slate-300"
                    value={durationMinutes === 0 ? '' : durationMinutes}
                    onChange={handleMinuteChange}
                    disabled={isDayComplete && !editingId}
                    placeholder="0"
                  />
                  <span className={`text-sm ml-0.5 font-sans font-semibold ${editingId ? 'text-indigo-400' : 'text-slate-400'}`}>m</span>
                </div>

             </div>
             
             {/* Action Buttons */}
             <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
               {editingId && (
                 <button
                    type="button"
                    onClick={cancelEdit}
                    className="hidden md:flex bg-slate-200 hover:bg-slate-300 text-slate-600 w-12 h-12 rounded-full items-center justify-center transition-all"
                    title="Cancel Edit"
                 >
                    <X size={20} strokeWidth={2.5} />
                 </button>
               )}
               
               <button 
                  type="submit" 
                  disabled={isDayComplete && !editingId}
                  className={`hidden md:flex w-12 h-12 rounded-full items-center justify-center transition-all shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 ${
                    editingId 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200' 
                      : 'bg-brand-pink hover:bg-brand-pinkHover text-brand-dark shadow-pink-200'
                  }`}
               >
                  {editingId ? <Save size={20} strokeWidth={2.5} /> : <PlusCircle size={24} strokeWidth={2.5} />}
               </button>
             </div>
             
             {/* Mobile Buttons */}
             <div className="flex gap-2 w-full md:hidden mt-2">
                {editingId && (
                  <Button type="button" variant="secondary" onClick={cancelEdit} className="flex-1">
                    Cancel
                  </Button>
                )}
                <Button type="submit" variant={editingId ? 'dark' : 'primary'} className="flex-1">
                    {editingId ? 'Save Changes' : 'Add Entry'}
                </Button>
             </div>

           </form>
        </div>
      </div>

      {isDayComplete && !editingId && (
        <div className="bg-teal-50 border border-teal-100 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between text-teal-900 shadow-sm animate-fade-in">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
             <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
               <CheckCircle2 size={24} />
             </div>
             <div>
               <h4 className="font-bold text-lg">Daily Limit Reached</h4>
               <p className="text-teal-700 text-sm">You have logged a full 24 hours.</p>
             </div>
          </div>
          <Button onClick={onAnalyze} variant="dark" className="bg-teal-700 hover:bg-teal-800 text-white shadow-none w-full md:w-auto">
            View Analytics
          </Button>
        </div>
      )}

      {/* List & Summary */}
      <div className="space-y-4">
        <div className="flex justify-between items-end px-2">
           <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Today's Activity</h3>
           <div className="text-sm font-bold text-slate-500 uppercase tracking-wider bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
               Total: <span className="text-brand-dark">{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</span>
            </div>
        </div>

        {/* Activities List */}
        {activities.length === 0 ? (
           <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                 <Clock size={40} className="text-brand-pink/50" />
              </div>
              <h4 className="text-slate-800 font-bold text-lg mb-2">No activities yet</h4>
              <p className="text-slate-500 max-w-xs mx-auto">Start typing in the bar above to log your first activity for the day.</p>
           </div>
        ) : (
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100 overflow-hidden">
             {activities.map((activity) => (
               <div 
                  key={activity.id} 
                  className={`group flex flex-col md:flex-row md:items-center justify-between p-5 transition-colors relative ${editingId === activity.id ? 'bg-indigo-50/50' : 'hover:bg-slate-50/80'}`}
               >
                  <div className="flex items-center gap-4 mb-3 md:mb-0">
                     <div className={`w-3 h-3 rounded-full shadow-sm ${getCategoryColor(activity.category)}`}></div>
                     <span className={`font-semibold text-lg ${editingId === activity.id ? 'text-indigo-900' : 'text-slate-800'}`}>
                        {activity.title}
                     </span>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end gap-6">
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {activity.category}
                     </span>
                     <span className="font-bold text-slate-700 font-mono text-lg w-24 text-right">
                        {formatTime(activity.minutes)}
                     </span>
                     
                     <div className="flex items-center gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => startEdit(activity)}
                          disabled={!!editingId}
                          className="p-2 rounded-full text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                          title="Edit entry"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(activity.id)}
                          disabled={!!editingId}
                          className="p-2 rounded-full text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                          title="Delete entry"
                        >
                          <Trash2 size={18} />
                        </button>
                     </div>
                  </div>
               </div>
             ))}
           </div>
        )}
      </div>
    </div>
  );
};

function formatTime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}:${m.toString().padStart(2, '0')}:00`; 
}

function getCategoryColor(category: Category) {
  switch (category) {
    case Category.WORK: return 'bg-rose-500';
    case Category.STUDY: return 'bg-purple-500';
    case Category.SLEEP: return 'bg-indigo-900';
    case Category.ENTERTAINMENT: return 'bg-yellow-400';
    case Category.EXERCISE: return 'bg-teal-500';
    case Category.CHORES: return 'bg-orange-500';
    case Category.SOCIAL: return 'bg-pink-400';
    default: return 'bg-slate-400';
  }
}