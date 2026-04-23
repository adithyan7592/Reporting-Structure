import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
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
        // managedDepts is now array of { dept, fields } objects
        localStorage.setItem('managedDepts', JSON.stringify(data.managedDepts || []));

        if (data.role === 'superadmin') navigate('/admin');
        else navigate('/dashboard');
      } else {
        alert(data.msg || 'Invalid Credentials');
      }
    } catch {
      alert('Server error. Is your backend running?');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-900/40 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/30 mb-4">
            <span className="text-white text-3xl font-bold">R</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Department Portal</h2>
          <p className="mt-2 text-slate-400 text-sm">Internal Reporting System v2.0</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl py-8 px-10 shadow-2xl rounded-3xl border border-slate-700/50">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email" required
                className="w-full bg-slate-900/50 border border-slate-700 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-slate-600"
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <input
                type="password" required
                className="w-full bg-slate-900/50 border border-slate-700 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-slate-600"
                placeholder="••••••••"
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className="pt-2">
              <button type="submit" className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition active:scale-[0.98]">
                Sign In to Portal
              </button>
            </div>
          </form>
          <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
            <p className="text-slate-500 text-xs">Authorized Personnel Only.<br />© 2026 Reporting Structure</p>
          </div>
        </div>
      </div>
    </div>
  );
}
