import React, { useState } from 'react';
import { signInWithGoogle, signInWithGithub, signUpWithEmail, signInWithEmail } from '../../lib/auth';
import { LogIn, Github, ArrowRight, UserPlus, Mail, Lock, User } from 'lucide-react';

export function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, name);
        setMessage('Registration successful! Please check your email to verify.');
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-3 mb-10 text-center">
          <div className="w-16 h-16 bg-surface-bright rounded-none flex items-center justify-center text-primary font-bold text-4xl shadow-lg border border-white/5">
            s
          </div>
          <h1 className="text-text-primary text-4xl font-black tracking-tight leading-none mt-2">TaskSync</h1>
          <p className="text-text-muted text-xs font-bold uppercase tracking-widest mt-1">AI-Powered Productivity</p>
        </div>

        {/* Auth Card */}
        <div className="glass-card p-8 rounded-none border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-none blur-3xl pointer-events-none" />
          
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-text-muted text-sm mb-8 font-medium">
            {isSignUp ? 'Start your journey to peak productivity.' : 'Sign in to sync your progress.'}
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-5 mb-8">
            {isSignUp && (
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/50" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required={isSignUp}
                    className="w-full bg-surface-dim border border-white/5 text-text-primary pl-10 pr-4 py-3 rounded-none focus:outline-none focus:border-primary/50 transition-all placeholder:text-text-muted/30 text-sm"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/50" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-surface-dim border border-white/5 text-text-primary pl-10 pr-4 py-3 rounded-none focus:outline-none focus:border-primary/50 transition-all placeholder:text-text-muted/30 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/50" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-surface-dim border border-white/5 text-text-primary pl-10 pr-4 py-3 rounded-none focus:outline-none focus:border-primary/50 transition-all placeholder:text-text-muted/30 text-sm"
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-text-on-primary font-black py-4 rounded-none flex items-center justify-center gap-2 hover:bg-primary-hover transition-all shadow-xl shadow-primary/10 group"
            >
              {loading ? (
                <span className="flex items-center gap-2">Processing...</span>
              ) : (
                <>
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            
            {message && (
              <div className="p-3 bg-primary/10 border border-primary/20 text-xs font-bold text-primary animate-in fade-in slide-in-from-top-2 duration-300">
                {message}
              </div>
            )}
          </form>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[10px]">
              <span className="bg-[#1a1825] px-4 text-text-muted font-black uppercase tracking-[0.2em]">Third Party Auth</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <button 
              onClick={signInWithGoogle}
              className="flex items-center justify-center gap-3 bg-surface-dim hover:bg-white/5 text-text-primary font-bold px-4 py-3 rounded-none border border-white/5 transition-all text-sm"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button 
              onClick={signInWithGithub}
              className="flex items-center justify-center gap-3 bg-surface-dim hover:bg-white/5 text-text-primary font-bold px-4 py-3 rounded-none border border-white/5 transition-all text-sm"
            >
              <Github size={18} />
              GitHub
            </button>
          </div>

          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-center text-xs font-bold text-text-muted hover:text-primary transition-colors"
          >
            {isSignUp ? (
              <span className="flex items-center justify-center gap-2">
                Already have an account? <span className="text-primary underline decoration-2 underline-offset-4">Sign In</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                New to TaskSync? <span className="text-primary underline decoration-2 underline-offset-4">Create Account</span>
              </span>
            )}
          </button>
          
        </div>
      </div>
    </div>
  );
}
