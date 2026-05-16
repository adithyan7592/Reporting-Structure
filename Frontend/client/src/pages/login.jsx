import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://reporting-structure.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('dept', data.department);
        localStorage.setItem('role', data.role);
        localStorage.setItem('name', data.name || '');
        localStorage.setItem('jobTitle', data.jobTitle || '');
        localStorage.setItem('managedDepts', JSON.stringify(data.managedDepts || []));
        if (data.role === 'superadmin') navigate('/admin', { replace: true });
        else navigate('/dashboard', { replace: true });
      } else {
        setError(data.msg || 'Invalid credentials');
        setLoading(false);
      }
    } catch {
      setError('Server error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040c1a] flex overflow-hidden relative">

      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none opacity-40"
        style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.06) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Orbs */}
      <div className="absolute -top-36 -left-24 w-[420px] h-[420px] bg-blue-700 rounded-full blur-[100px] opacity-20 pointer-events-none" />
      <div className="absolute -bottom-24 right-[8%] w-[320px] h-[320px] bg-sky-500 rounded-full blur-[90px] opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 right-[36%] w-[220px] h-[220px] bg-indigo-500 rounded-full blur-[80px] opacity-10 pointer-events-none" />

      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 py-16 border-r border-white/5 bg-white/[0.015] relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-6 shadow-[0_0_32px_rgba(59,130,246,0.5)]">
          <span className="text-white text-lg font-black tracking-tight">TS</span>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight leading-none mb-2">Trendsetters</h1>
        <p className="text-white/40 text-sm mb-12">Kerala Paints Reporting System</p>
        <div className="flex gap-3 mb-12">
          {[{ val: '15+', lbl: 'Departments' }, { val: '∞', lbl: 'Daily Reports' }, { val: 'v2.0', lbl: 'Version' }].map(s => (
            <div key={s.lbl} className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <span className="block text-blue-400 text-2xl font-bold">{s.val}</span>
              <span className="text-white/30 text-[10px] uppercase tracking-widest font-semibold">{s.lbl}</span>
            </div>
          ))}
        </div>
        <p className="text-white/20 text-xs">Authorized personnel only</p>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-[440px] flex items-center justify-center px-8 py-12 relative z-10 flex-shrink-0">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              <span className="text-white text-sm font-black">TS</span>
            </div>
            <div>
              <p className="text-white font-black text-lg leading-none">Trendsetters</p>
              <p className="text-white/40 text-xs">Internal Reporting</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight mb-1">Welcome back</h2>
          <p className="text-white/40 text-sm mb-8">Sign in to your department portal</p>

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-2">Email address</label>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  type="email" required autoComplete="email"
                  placeholder="you@keralapaints.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-white/20 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'} required autoComplete="current-password"
                  placeholder="••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white text-sm placeholder:text-white/20 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition"
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-red-300 text-xs">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 flex-shrink-0">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition active:scale-[0.98] text-sm mt-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </>
              )}
            </button>

          </form>

          <p className="text-white/20 text-xs text-center mt-8">© 2026 Trendsetters · Confidential</p>
        </div>
      </div>
    </div>
  );
}

