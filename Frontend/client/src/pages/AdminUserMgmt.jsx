import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminUserMgmt() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', department: 'Media' });
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null); // Track user being edited
  const navigate = useNavigate();

  const departments = ['KP', 'AYUSH', 'Theertha', 'Bioclean', 'Happiness', 'Purchase', 'Media'];
  const API_BASE = 'https://reporting-structure.onrender.com/api';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert("Staff created successfully!");
        setFormData({ name: '', email: '', password: '', department: 'Media' });
        fetchUsers();
      }
    } catch (err) { alert("Connection Error"); }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE}/users/${editingUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(editingUser)
      });
      if (response.ok) {
        alert("User updated!");
        setEditingUser(null);
        fetchUsers();
      }
    } catch (err) { alert("Update failed"); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar (Same as before) */}
      <div className="w-full md:w-64 bg-slate-900 text-white p-6 shrink-0">
        <h1 className="text-2xl font-bold text-blue-400 mb-8">Admin Panel</h1>
        <nav className="space-y-4">
          <button onClick={() => navigate('/dashboard')} className="w-full text-left p-3 rounded hover:bg-slate-800 transition text-slate-300">← Back</button>
          <div className="p-3 rounded bg-blue-600 text-white font-medium">User Management</div>
        </nav>
      </div>

      <div className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Creation Form (Same as before) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-10">
             <h2 className="text-xl font-bold mb-6 text-slate-800">Add New Staff</h2>
             <form onSubmit={handleCreateStaff} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="p-3 border rounded-lg" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                <input className="p-3 border rounded-lg" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                <input className="p-3 border rounded-lg" type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                <select className="p-3 border rounded-lg" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <button type="submit" className="md:col-span-2 bg-blue-600 text-white py-3 rounded-xl font-bold">Create Account</button>
             </form>
          </div>

          {/* NEW: User List Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100"><h2 className="text-xl font-bold">Active Staff</h2></div>
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {users.map(u => (
                  <tr key={u._id} className="border-t border-slate-50 hover:bg-slate-50">
                    <td className="p-4 font-bold">{u.name}</td>
                    <td className="p-4 text-slate-500">{u.email}</td>
                    <td className="p-4"><span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-[10px] font-bold">{u.department}</span></td>
                    <td className="p-4">
                      <button onClick={() => setEditingUser(u)} className="text-blue-600 font-bold hover:underline">Edit / Reset Pass</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-black mb-6 text-slate-900">Edit {editingUser.name}</h2>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                <input className="w-full p-3 bg-slate-50 border rounded-xl mt-1" value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">New Password (leave blank to keep current)</label>
                <input className="w-full p-3 bg-slate-50 border rounded-xl mt-1" type="password" placeholder="Enter new password" onChange={e => setEditingUser({...editingUser, password: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Department</label>
                <select className="w-full p-3 bg-slate-50 border rounded-xl mt-1" value={editingUser.department} onChange={e => setEditingUser({...editingUser, department: e.target.value})}>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setEditingUser(null)} className="flex-1 py-3 text-slate-400 font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}