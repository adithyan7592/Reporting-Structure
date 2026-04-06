import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 1. Store credentials
        localStorage.setItem('token', data.token);
        localStorage.setItem('dept', data.department);
        localStorage.setItem('role', data.role);

        // 2. Immediate Redirect based on role returned from server
        if (data.role === 'superadmin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        alert(data.msg || "Invalid Credentials");
      }
    } catch (err) {
      alert("Server error. Is your backend running?");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white py-8 px-10 shadow-xl rounded-xl border border-slate-100">
        <h2 className="text-center text-3xl font-extrabold text-slate-900 mb-6">Department Portal</h2>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email Address</label>
            <input 
              type="email" 
              required 
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="admin@system.com"
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input 
              type="password" 
              required 
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}