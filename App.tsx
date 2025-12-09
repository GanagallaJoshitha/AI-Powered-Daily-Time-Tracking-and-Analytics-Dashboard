import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Tracker } from './components/Tracker';
import { Dashboard } from './components/Dashboard';
import { User, Activity } from './types';
import { storageService } from './services/storageService';
import { 
  LayoutDashboard, 
  LogOut, 
  PlayCircle, 
  User as UserIcon, 
  ListTodo, 
  ChevronLeft, 
  ChevronRight,
  Calendar
} from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'tracker' | 'dashboard'>('tracker');
  
  // Date State
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const init = async () => {
      const storedUser = storageService.getCurrentUser();
      if (storedUser) setUser(storedUser);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (user && selectedDate) {
      loadDayData(selectedDate);
    }
  }, [user, selectedDate]);

  const loadDayData = async (date: string) => {
    const log = await storageService.getDayLog(date);
    if (log) {
      setActivities(log.activities);
    } else {
      setActivities([]);
    }
  };

  const handleUpdateActivities = async (newActivities: Activity[]) => {
    setActivities(newActivities);
    await storageService.saveDayLog(selectedDate, newActivities);
  };

  const handleLogout = () => {
    storageService.logout();
    setUser(null);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-pink"></div>
    </div>
  );

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans flex">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-brand-dark text-white fixed h-full z-50">
        <div className="p-6 flex items-center gap-2 mb-6">
           <div className="w-8 h-8 bg-brand-pink rounded-lg flex items-center justify-center text-brand-dark shadow-sm">
              <PlayCircle size={20} fill="currentColor" className="ml-0.5" />
            </div>
            <span className="text-xl font-bold tracking-tight">TaskNest</span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
           <button 
              onClick={() => setCurrentView('tracker')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                currentView === 'tracker' 
                ? 'bg-brand-pink text-brand-dark shadow-lg shadow-pink-900/20' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ListTodo size={20} />
              Timer
            </button>
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                currentView === 'dashboard' 
                ? 'bg-brand-pink text-brand-dark shadow-lg shadow-pink-900/20' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard size={20} />
              Reports
            </button>
        </nav>

        <div className="p-4 border-t border-white/10 space-y-4">
           <div className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300">
              <div className="w-8 h-8 rounded-full bg-brand-purple flex items-center justify-center border border-white/10 text-white font-bold">
                 <UserIcon size={14} />
              </div>
              <div className="flex-1 truncate font-medium">
                {user.email.split('@')[0]}
              </div>
              <button onClick={handleLogout} className="text-gray-500 hover:text-white transition-colors" title="Logout">
                <LogOut size={16} />
              </button>
           </div>
           
           <div className="px-4 text-[10px] text-gray-600 text-center font-medium">
              Created by  Joshitha Ganagalla<span className="text-gray-500 hover:text-brand-pink transition-colors cursor-pointer">Joshitha Ganagalla</span>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col relative">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-brand-dark text-white p-4 flex justify-between items-center sticky top-0 z-50">
           <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-pink rounded-md flex items-center justify-center text-brand-dark">
              <PlayCircle size={14} fill="currentColor" className="ml-0.5" />
            </div>
            <span className="text-lg font-bold">TaskNest</span>
           </div>
           <button onClick={handleLogout} className="text-gray-400">
             <LogOut size={20} />
           </button>
        </header>

        {/* Top Bar (Date Picker & Title) */}
        <div className="sticky top-0 md:static z-40 bg-[#F8F9FA]/95 backdrop-blur-sm border-b md:border-b-0 border-slate-200 px-4 md:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <h2 className="text-2xl font-bold text-slate-800 hidden md:block">
             {currentView === 'tracker' ? 'Time Log' : 'Productivity Report'}
           </h2>

           <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto bg-white p-1.5 rounded-xl shadow-sm border border-slate-200">
              <button 
                onClick={() => {
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() - 1);
                  setSelectedDate(d.toISOString().split('T')[0]);
                }}
                className="p-2 hover:bg-brand-light rounded-lg text-slate-500 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex items-center gap-2 px-2 text-slate-700 font-medium text-sm">
                <Calendar size={16} className="text-brand-pink" />
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent outline-none uppercase tracking-wide cursor-pointer"
                />
              </div>

               <button 
                onClick={() => {
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() + 1);
                  setSelectedDate(d.toISOString().split('T')[0]);
                }}
                className="p-2 hover:bg-brand-light rounded-lg text-slate-500 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
           </div>
        </div>

        {/* View Content */}
        <div className="p-4 md:p-8 max-w-6xl w-full mx-auto pb-24 md:pb-8">
          {currentView === 'tracker' ? (
            <Tracker 
              date={selectedDate} 
              activities={activities} 
              onUpdate={handleUpdateActivities}
              onAnalyze={() => setCurrentView('dashboard')}
            />
          ) : (
            <Dashboard 
              date={selectedDate}
              activities={activities}
              username={user.displayName || 'User'}
            />
          )}
        </div>
      </main>

      {/* Mobile Navigation Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-16">
          <button 
            onClick={() => setCurrentView('tracker')}
            className={`flex flex-col items-center gap-1 w-full h-full justify-center ${currentView === 'tracker' ? 'text-brand-pink' : 'text-slate-400'}`}
          >
            <ListTodo size={24} strokeWidth={currentView === 'tracker' ? 2.5 : 2} />
            <span className="text-[10px] font-bold">Timer</span>
          </button>
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col items-center gap-1 w-full h-full justify-center ${currentView === 'dashboard' ? 'text-brand-pink' : 'text-slate-400'}`}
          >
            <LayoutDashboard size={24} strokeWidth={currentView === 'dashboard' ? 2.5 : 2} />
            <span className="text-[10px] font-bold">Reports</span>
          </button>
        </div>
      </nav>

    </div>
  );
}