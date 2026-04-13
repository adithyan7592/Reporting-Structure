import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminUserMgmt() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', department: 'Media'
  });
  const navigate = useNavigate();

  const departments = ['KP', 'AYUSH', 'Theertha', 'Bioclean', 'Happiness', 'Purchase', 'Media'];

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('https://reporting-structure.onrender.com/api/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        alert("Staff created successfully!");
        setFormData({ name: '', email: '', password: '', department: 'Media' });
      } else {
        alert(data.msg);
      }
    } catch (err) {
      alert("Error connecting to server");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar - Same as Dashboard for consistency */}
      <div className="w-full md:w-64 bg-slate-900 text-white p-6">
        <h1 className="text-2xl font-bold text-blue-400 mb-8">Admin Panel</h1>
        <nav className="space-y-4">
          <button onClick={() => navigate('/dashboard')} className="w-full text-left p-3 rounded hover:bg-slate-800 transition text-slate-300">
            ← Back to Dashboard
          </button>
          <div className="p-3 rounded bg-blue-600 text-white font-medium">
            User Management
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Staff Creation</h2>
            <p className="text-slate-500">Register new employees and assign them to specific departments.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <form onSubmit={handleCreateStaff} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter full name" 
                    className="p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    required 
                  />
                </div>

                {/* Email Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="name@company.com" 
                    className="p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    required 
                  />
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">Temporary Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                    required 
                  />
                </div>

                {/* Department Selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">Assign Department</label>
                  <select 
                    className="p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white transition"
                    value={formData.department} 
                    onChange={e => setFormData({...formData, department: e.target.value})}
                  >
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>

          {/* Quick Tip Section */}
          <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-4 items-center">
            <div className="bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold">!</div>
            <p className="text-sm text-blue-800">
              New staff will only see reports relevant to their assigned department after logging in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}