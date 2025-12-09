import React, { useState } from 'react';
import { Button } from './Button';
import { storageService } from '../services/storageService';
import { updateFirebaseConfig, resetFirebaseConfig, isConfigured } from '../services/firebase';
import { User } from '../types';
import { Clock, BarChart3, Zap, Sparkles, CheckCircle, PlayCircle, Lock, Mail, ArrowLeft, Layout, User as UserIcon, ListTodo, LayoutDashboard, ChevronRight, ChevronLeft, Calendar, Tag, PlusCircle, Trash2, Settings, X, Database, Cloud, Edit, Shield, Eye, EyeOff } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [view, setView] = useState<'landing' | 'login'>('landing');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        setError("Please fill in all required fields");
        return;
    }
    if (isRegistering && !name) {
        setError("Please enter your name");
        return;
    }

    setLoading(true);
    setError('');
    
    try {
      let user;
      if (isRegistering) {
        user = await storageService.register(email, password, name);
      } else {
        user = await storageService.login(email, password);
      }
      onLogin(user);
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          setError("Invalid email or password.");
      } else if (error.code === 'auth/email-already-in-use') {
          setError("Email is already registered. Please log in.");
      } else if (error.code === 'auth/weak-password') {
          setError("Password should be at least 6 characters.");
      } else {
          setError(error.message || "Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
        const user = await storageService.loginWithGoogle();
        onLogin(user);
    } catch (error: any) {
        console.error(error);
        setError("Google sign in failed. Check your configuration.");
    } finally {
        setLoading(false);
    }
  };

  const toggleMode = () => {
      setIsRegistering(!isRegistering);
      setError('');
  }

  // --- LOGIN VIEW ---
  if (view === 'login') {
    return (
      <div className="min-h-screen bg-[#1F1029] flex items-center justify-center p-4 relative overflow-hidden font-sans">
         {/* Background elements */}
         <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-brand-pink/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

         <div className="w-full max-w-md relative z-10 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
              <button 
                  onClick={() => setView('landing')} 
                  className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors font-medium text-sm group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
              </button>

              <button
                onClick={() => setShowConfigModal(true)}
                className={`p-2 rounded-full transition-colors ${isConfigured ? 'bg-teal-500/10 text-teal-400 hover:bg-teal-500/20' : 'text-gray-500 hover:text-white hover:bg-white/10'}`}
                title="Configure Backend"
              >
                <Settings size={18} />
              </button>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-brand-pink rounded-xl flex items-center justify-center text-brand-dark shadow-[0_0_15px_rgba(229,124,216,0.3)]">
                        <PlayCircle size={24} fill="currentColor" className="ml-0.5" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white tracking-tight">
                          {isRegistering ? 'Create Account' : 'Welcome back'}
                      </h2>
                      {isConfigured && (
                        <div className="flex items-center gap-1 text-[10px] text-teal-400 font-bold uppercase tracking-wider mt-1">
                          <CheckCircle size={10} /> Live Backend
                        </div>
                      )}
                    </div>
                </div>

                {/* Google Button */}
                <button 
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors mb-6 shadow-sm"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    {isRegistering ? 'Sign up with Google' : 'Sign in with Google'}
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="h-px bg-white/10 flex-1"></div>
                    <span className="text-xs text-gray-500 font-semibold uppercase">Or with email</span>
                    <div className="h-px bg-white/10 flex-1"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {isRegistering && (
                        <div className="space-y-1.5 animate-fade-in">
                            <label className="text-xs font-bold text-gray-400 ml-1">Full Name</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink transition-all"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <UserIcon className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-brand-pink transition-colors" size={18} />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 ml-1">Email</label>
                        <div className="relative group">
                            <input
                                type="email"
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink transition-all"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Mail className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-brand-pink transition-colors" size={18} />
                        </div>
                    </div>
                    
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 ml-1">Password</label>
                        <div className="relative group">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 pl-10 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Lock className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-brand-pink transition-colors" size={18} />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3.5 text-gray-500 hover:text-white transition-colors focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && <p className="text-rose-400 text-sm font-medium bg-rose-500/10 p-3 rounded-lg border border-rose-500/20 animate-slide-up">{error}</p>}

                    <Button type="submit" variant="primary" isLoading={loading} className="w-full py-3.5 text-base rounded-xl shadow-[0_0_20px_rgba(229,124,216,0.2)] hover:shadow-[0_0_30px_rgba(229,124,216,0.4)]">
                        {isRegistering ? 'Create Account' : 'Log In'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <button 
                        onClick={toggleMode}
                        className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                        {isRegistering ? "Already have an account? " : "Don't have an account? "}
                        <span className="text-brand-pink font-bold hover:underline">
                            {isRegistering ? 'Log In' : 'Sign Up'}
                        </span>
                    </button>
                </div>
             </div>
         </div>

         {/* Configuration Modal */}
         {showConfigModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                <div className="bg-[#1F1029] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
                    <button 
                        onClick={() => setShowConfigModal(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                    
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-brand-pink/10 rounded-lg text-brand-pink">
                            <Database size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white">Backend Configuration</h3>
                    </div>

                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                        To connect a real backend, paste your Firebase config object below. 
                        You can find this in your Firebase Console under <strong>Project Settings</strong>.
                    </p>

                    <ConfigForm />
                </div>
            </div>
         )}
      </div>
    );
  }

  // --- LANDING PAGE VIEW ---
  return (
    <div className="min-h-screen bg-[#1F1029] text-white font-sans selection:bg-brand-pink selection:text-brand-dark">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-[#1F1029]/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-pink rounded-lg flex items-center justify-center text-brand-dark shadow-[0_0_15px_rgba(229,124,216,0.3)]">
              <PlayCircle size={20} fill="currentColor" className="ml-0.5" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">TaskNest</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-300">
            <a href="#features" className="hover:text-brand-pink transition-colors">Features</a>
            <div className="border-l border-white/20 h-6 mx-2"></div>
            <button 
                onClick={() => { setView('login'); setIsRegistering(false); }}
                className="hover:text-white transition-colors"
            >
                Log In
            </button>
            <Button variant="primary" onClick={() => { setView('login'); setIsRegistering(true); }} className="shadow-[0_0_20px_rgba(229,124,216,0.4)] hover:shadow-[0_0_30px_rgba(229,124,216,0.6)]">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-brand-pink/15 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center relative z-10">
          
          {/* Left Column: Content */}
          <div className="max-w-xl animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-pink/10 border border-brand-pink/20 text-brand-pink text-xs font-bold uppercase tracking-wider mb-8">
               <Sparkles size={12} fill="currentColor" />
               New AI Features
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[1.05] mb-8 tracking-tight">
              Reclaim your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-indigo-400">productivity.</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed mb-10 max-w-lg font-light">
              Simple time tracking. Powerful AI reporting. <br/>
              See where your time goes and optimize your workflow. <br/>
              <span className="text-white font-semibold">Completely free. No credit card required.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                    variant="primary" 
                    onClick={() => { setView('login'); setIsRegistering(true); }} 
                    className="py-4 px-8 text-lg rounded-xl shadow-[0_0_30px_rgba(229,124,216,0.3)] hover:shadow-[0_0_40px_rgba(229,124,216,0.5)]"
                >
                    Start Tracking Free
                </Button>
                <Button 
                    variant="ghost" 
                    onClick={() => setView('login')}
                    className="py-4 px-8 text-lg rounded-xl text-white border border-white/10 hover:bg-white/5"
                >
                    Log In
                </Button>
            </div>

            <div className="flex items-center gap-6 mt-12 text-sm text-gray-400 font-medium">
               <span className="flex items-center gap-2"><CheckCircle size={14} className="text-brand-pink"/> No credit card required</span>
               <span className="flex items-center gap-2"><CheckCircle size={14} className="text-brand-pink"/> Forever Free</span>
            </div>
          </div>

          {/* Right Column: Visual Mockup (App Interface Demo) */}
          <div className="relative perspective-1000 hidden lg:block animate-fade-in" style={{animationDelay: '0.2s'}}>
              {/* App UI Container */}
              <div className="relative w-full aspect-[16/10] bg-[#F8F9FA] rounded-xl shadow-2xl overflow-hidden transform rotate-y-[-12deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-all duration-700 ease-out border-8 border-[#2C1338] group">
                  
                  {/* Mockup Top Bar (Window Controls) */}
                  <div className="absolute top-0 left-0 right-0 h-3 bg-[#2C1338] flex items-center px-2 gap-1.5 z-20">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  </div>

                  <div className="flex h-full pt-3">
                      {/* Mockup Sidebar */}
                      <div className="w-16 bg-[#2C1338] flex flex-col items-center py-4 gap-4 z-10">
                          <div className="w-8 h-8 bg-brand-pink rounded-lg flex items-center justify-center text-brand-dark shadow-sm">
                            <PlayCircle size={16} fill="currentColor" className="ml-0.5" />
                          </div>
                          <div className="flex flex-col gap-3 mt-2 w-full px-2">
                             <div className="w-full aspect-square bg-brand-pink rounded-md flex items-center justify-center text-brand-dark">
                                <ListTodo size={18} />
                             </div>
                             <div className="w-full aspect-square text-gray-400 hover:bg-white/5 rounded-md flex items-center justify-center">
                                <LayoutDashboard size={18} />
                             </div>
                          </div>
                          <div className="mt-auto mb-2 w-8 h-8 rounded-full bg-brand-purple border border-white/10 flex items-center justify-center text-white text-[10px] font-bold">
                             JD
                          </div>
                      </div>

                      {/* Mockup Main Content */}
                      <div className="flex-1 flex flex-col bg-[#F8F9FA]">
                          {/* Mockup Header */}
                          <div className="h-12 border-b border-slate-200 flex items-center justify-between px-4 bg-white/50 backdrop-blur-sm">
                              <span className="text-slate-800 font-bold text-sm">Time Log</span>
                              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-2 py-1 shadow-sm">
                                  <ChevronLeft size={12} className="text-slate-400" />
                                  <span className="text-slate-600 text-xs font-bold flex items-center gap-1">
                                      <Calendar size={10} className="text-brand-pink"/> TODAY
                                  </span>
                                  <ChevronRight size={12} className="text-slate-400" />
                              </div>
                          </div>

                          {/* Mockup Body */}
                          <div className="p-4 space-y-4">
                              
                              {/* Floating Timer Bar Mockup */}
                              <div className="bg-white rounded-full shadow-sm p-1.5 pl-4 flex items-center gap-3 border border-slate-100">
                                  <span className="text-slate-400 text-xs font-medium flex-1">Working on UI design...</span>
                                  <div className="flex items-center gap-1 text-slate-500">
                                      <Tag size={12} className="text-brand-pink" />
                                      <span className="text-[10px] font-bold uppercase">WORK</span>
                                  </div>
                                  <div className="text-slate-800 font-bold font-mono text-xs bg-slate-50 px-2 py-0.5 rounded flex items-center gap-1">
                                      0h : 25m
                                  </div>
                                  <div className="w-7 h-7 bg-brand-pink rounded-full flex items-center justify-center text-brand-dark shadow-sm">
                                      <PlusCircle size={16} />
                                  </div>
                              </div>

                              {/* List Header */}
                              <div className="flex justify-between items-end px-1 mt-4">
                                  <div className="h-2 w-20 bg-slate-200 rounded-full"></div>
                                  <div className="h-4 w-16 bg-white border border-slate-100 rounded-full shadow-sm"></div>
                              </div>

                              {/* Mockup List Item 1 */}
                              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3 flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                      <div className="w-2 h-2 rounded-full bg-rose-500 shadow-sm"></div>
                                      <span className="text-slate-800 text-xs font-bold">Client Meeting</span>
                                  </div>
                                  <div className="flex items-center gap-4">
                                      <span className="text-[10px] font-bold text-slate-300 uppercase">WORK</span>
                                      <span className="text-slate-700 font-bold font-mono text-xs">01:30:00</span>
                                  </div>
                              </div>

                               {/* Mockup List Item 2 */}
                               <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3 flex items-center justify-between opacity-80">
                                  <div className="flex items-center gap-3">
                                      <div className="w-2 h-2 rounded-full bg-purple-500 shadow-sm"></div>
                                      <span className="text-slate-800 text-xs font-bold">React Research</span>
                                  </div>
                                  <div className="flex items-center gap-4">
                                      <span className="text-[10px] font-bold text-slate-300 uppercase">STUDY</span>
                                      <span className="text-slate-700 font-bold font-mono text-xs">00:45:00</span>
                                  </div>
                              </div>

                               {/* Mockup List Item 3 */}
                               <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3 flex items-center justify-between opacity-60">
                                  <div className="flex items-center gap-3">
                                      <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-sm"></div>
                                      <span className="text-slate-800 text-xs font-bold">Lunch Break</span>
                                  </div>
                                  <div className="flex items-center gap-4">
                                      <span className="text-[10px] font-bold text-slate-300 uppercase">OTHER</span>
                                      <span className="text-slate-700 font-bold font-mono text-xs">00:30:00</span>
                                  </div>
                              </div>

                          </div>
                      </div>
                  </div>

                  {/* Glass Overlay Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none mix-blend-overlay"></div>
              </div>
              
              {/* Floating Element - Productivity Badge */}
              <div className="absolute -bottom-6 -right-6 bg-white p-3 rounded-lg shadow-xl flex items-center gap-3 animate-slide-up border border-slate-100 z-30" style={{animationDelay: '0.5s'}}>
                   <div className="w-8 h-8 bg-brand-pink/20 rounded-full flex items-center justify-center text-brand-pink">
                       <Zap size={16} fill="currentColor" />
                   </div>
                   <div>
                       <div className="text-[10px] text-gray-400 font-bold uppercase">Focus Score</div>
                       <div className="text-sm font-black text-brand-dark">94/100</div>
                   </div>
              </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-[#F8F9FA] text-brand-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Built for deep work. Free forever.</h2>
            <p className="text-gray-600 text-lg">
              We believe great productivity tools should be accessible to everyone. <br/>
              Enjoy premium features without the premium price tag.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Clock className="text-brand-pink" size={28} />}
              title="Smart Time Logging"
              description="Log your day in hours and minutes with our new floating timer bar. Fast, intuitive, and distraction-free."
            />
             <FeatureCard 
              icon={<Cloud className="text-indigo-600" size={28} />}
              title="Cloud Sync"
              description="Securely save your data with Google Authentication. Access your logs from any device, anytime."
            />
            <FeatureCard 
              icon={<Sparkles className="text-purple-600" size={28} />}
              title="AI Productivity Coach"
              description="Get personalized, AI-powered suggestions on how to improve your routine and focus scores."
            />
            <FeatureCard 
              icon={<BarChart3 className="text-brand-dark" size={28} />}
              title="Visual Reporting"
              description="Deep dive into your habits with breakdown charts, focus distribution graphs, and day utilization rings."
            />
            <FeatureCard 
              icon={<Edit className="text-teal-600" size={28} />}
              title="Total Control"
              description="Made a mistake? No problem. Easily edit or delete past entries to keep your history accurate."
            />
            <FeatureCard 
              icon={<Shield className="text-rose-500" size={28} />}
              title="Zero Cost"
              description="TaskNest is completely free. No hidden fees, no subscriptions, and no credit card required."
            />
          </div>

          {/* CTA Banner */}
          <div className="bg-brand-dark text-white py-16 mt-20 rounded-3xl relative overflow-hidden text-center px-6 shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-pink to-transparent"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-pink/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <h3 className="text-3xl font-bold mb-4 relative z-10">Productivity shouldn't cost a premium.</h3>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8 relative z-10">
                TaskNest is built for individuals who want to master their time without subscriptions or limitations. 
                Enjoy all features, including AI insights and unlimited history, completely free.
            </p>
            <Button variant="primary" onClick={() => { setView('login'); setIsRegistering(true); }} className="mx-auto py-4 px-10 text-lg shadow-[0_0_30px_rgba(229,124,216,0.4)]">
                Create Free Account
            </Button>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1F1029] border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2 text-white font-bold text-xl">
             <div className="w-6 h-6 bg-brand-pink rounded-lg flex items-center justify-center text-brand-dark">
               <PlayCircle size={14} fill="currentColor" className="ml-0.5" />
             </div>
             TaskNest
           </div>
           
           <div className="flex flex-col md:items-end items-center gap-1">
             <p className="text-gray-500 text-sm">© {new Date().getFullYear()} TaskNest. Open Source & Free.</p>
             <p className="text-gray-600 text-xs flex items-center gap-1">
                Designed & Developed by<a href="#" className="text-brand-pink hover:text-white transition-colors font-bold">Joshitha Ganagalla</a>
             </p>
           </div>
        </div>
      </footer>
    </div>
  );
};

const ConfigForm = () => {
    const [config, setConfig] = useState('');
    
    const handleSave = () => {
        try {
            const parsed = JSON.parse(config);
            updateFirebaseConfig(parsed);
        } catch (e) {
            alert("Invalid JSON");
        }
    }

    return (
        <div className="space-y-4">
            <textarea
                className="w-full h-40 bg-black/30 border border-white/10 rounded-xl p-4 text-xs font-mono text-gray-300 focus:outline-none focus:border-brand-pink"
                placeholder='{ "apiKey": "...", "authDomain": "..." }'
                value={config}
                onChange={e => setConfig(e.target.value)}
            />
            <div className="flex gap-3">
                <Button onClick={handleSave} className="flex-1">Save & Reload</Button>
                {isConfigured && (
                    <Button variant="danger" onClick={resetFirebaseConfig}>Reset</Button>
                )}
            </div>
        </div>
    )
}

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:-translate-y-2 transition-transform duration-300 border border-slate-100">
    <div className="w-16 h-16 bg-brand-beige rounded-2xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-brand-dark mb-3">{title}</h3>
    <p className="text-gray-500 leading-relaxed font-medium">{description}</p>
  </div>
);