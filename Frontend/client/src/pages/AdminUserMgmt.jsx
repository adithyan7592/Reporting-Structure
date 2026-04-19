import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ALL_DEPARTMENTS = [
  'KP', 'AYUSH', 'Theertha', 'Bioclean', 'Happiness',
  'Purchase', 'Media', 'KP(Outlet)', 'KP Warehouse',
  'Ayush/Bioclean/Theertha Warehouse', 'Accounts'
];

const ROLE_PRESETS = [
  { label: 'AYUSH Team Lead', role: 'manager', jobTitle: 'Team Lead', depts: ['AYUSH'] },
  { label: 'KP AGM', role: 'manager', jobTitle: 'AGM', depts: ['KP', 'KP(Outlet)', 'KP Warehouse'] },
  { label: 'KP OM', role: 'manager', jobTitle: 'Operations Manager', depts: ['KP', 'KP(Outlet)'] },
  { label: 'KP TL', role: 'manager', jobTitle: 'Team Lead', depts: ['KP'] },
  { label: 'Factory Outlet AGM', role: 'manager', jobTitle: 'AGM', depts: ['KP(Outlet)', 'KP Warehouse'] },
  { label: 'Factory Outlet OM', role: 'manager', jobTitle: 'Operations Manager', depts: ['KP(Outlet)'] },
  { label: 'Purchase Manager', role: 'manager', jobTitle: 'Purchase Manager', depts: ['Purchase'] },
  { label: 'Technical Lead', role: 'manager', jobTitle: 'Technical Lead', depts: ['KP', 'AYUSH', 'Theertha', 'Bioclean'] },
  { label: 'Custom Manager', role: 'manager', jobTitle: '', depts: [] },
  { label: 'Staff', role: 'staff', jobTitle: '', depts: [] },
];

const API_BASE = 'https://reporting-structure.onrender.com/api';

export default function AdminUserMgmt() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '',
    department: 'KP',
    role: 'staff',
    jobTitle: '',
    managedDepts: []
  });
  const [selectedPreset, setSelectedPreset] = useState('');
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [filterRole, setFilterRole] = useState('all');
  const navigate = useNavigate();

  useEffect(() => { fetchUsers(); }, []);

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

  const applyPreset = (presetLabel) => {
    const preset = ROLE_PRESETS.find(p => p.label === presetLabel);
    if (!preset) return;
    setSelectedPreset(presetLabel);
    setFormData(prev => ({
      ...prev,
      role: preset.role,
      jobTitle: preset.jobTitle,
      managedDepts: preset.depts,
      department: preset.depts[0] || prev.department
    }));
  };

  const toggleManagedDept = (dept, isEditing = false) => {
    if (isEditing) {
      const current = editingUser.managedDepts || [];
      const updated = current.includes(dept)
        ? current.filter(d => d !== dept)
        : [...current, dept];
      setEditingUser({ ...editingUser, managedDepts: updated });
    } else {
      const current = formData.managedDepts;
      const updated = current.includes(dept)
        ? current.filter(d => d !== dept)
        : [...current, dept];
      setFormData({ ...formData, managedDepts: updated });
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
      const data = await response.json();
      if (response.ok) {
        alert(`✅ ${data.msg}`);
        setFormData({ name: '', email: '', password: '', department: 'KP', role: 'staff', jobTitle: '', managedDepts: [] });
        setSelectedPreset('');
        fetchUsers();
      } else {
        alert(`❌ ${data.msg}`);
      }
    } catch { alert("Connection Error"); }
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
        alert("✅ User updated!");
        setEditingUser(null);
        fetchUsers();
      }
    } catch { alert("Update failed"); }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`Delete ${userName}? This cannot be undone.`)) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) { fetchUsers(); }
    } catch { alert("Delete failed"); }
  };

  const filteredUsers = users.filter(u =>
    filterRole === 'all' ? true : u.role === filterRole
  );

  const roleColor = (role) => ({
    manager: 'bg-emerald-100 text-emerald-700',
    staff: 'bg-blue-50 text-blue-600',
    superadmin: 'bg-purple-100 text-purple-700'
  }[role] || 'bg-slate-100 text-slate-600');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">

      {/* Sidebar */}
      <div className="w-full md:w-64 bg-slate-900 text-white p-6 shrink-0 flex flex-col">
        <h1 className="text-2xl font-bold text-blue-400 mb-8">Admin Panel</h1>
        <nav className="space-y-4 flex-1">
          <button onClick={() => navigate('/dashboard')} className="w-full text-left p-3 rounded hover:bg-slate-800 transition text-slate-300">← Back to Dashboard</button>
          <div className="p-3 rounded bg-blue-600 text-white font-medium">User Management</div>
        </nav>
        <div className="mt-8 p-4 bg-slate-800 rounded-2xl text-[10px] text-slate-400 space-y-1 leading-relaxed">
          <p className="font-bold text-slate-300 uppercase tracking-wider mb-2">Role Guide</p>
          <p>🔵 <strong className="text-slate-300">Staff</strong> — Submits & sees only their dept</p>
          <p>🟢 <strong className="text-slate-300">Manager</strong> — Views multiple assigned depts</p>
          <p>🟣 <strong className="text-slate-300">Superadmin</strong> — Full access</p>
        </div>
      </div>

      <div className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-10">

          {/* CREATE FORM */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-xl font-bold mb-2 text-slate-800">Add New Account</h2>
            <p className="text-slate-400 text-sm mb-6">Use a preset to quickly configure a manager role, or set up a custom staff account.</p>

            {/* Presets */}
            <div className="mb-6">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Quick Preset</label>
              <div className="flex flex-wrap gap-2">
                {ROLE_PRESETS.map(p => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => applyPreset(p.label)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                      selectedPreset === p.label
                        ? 'bg-slate-900 text-white border-slate-900'
                        : p.role === 'manager'
                        ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {p.role === 'manager' ? '🟢' : '🔵'} {p.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Full Name</label>
                  <input className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-medium" placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email</label>
                  <input className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-medium" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Password</label>
                  <input className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-medium" type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Job Title (optional)</label>
                  <input className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-medium" placeholder="e.g. Team Lead, AGM..." value={formData.jobTitle} onChange={e => setFormData({ ...formData, jobTitle: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Role</label>
                  <select className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-medium" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Primary Department</label>
                  <select className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-medium" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
                    {ALL_DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* Managed Depts — only for manager */}
              {formData.role === 'manager' && (
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    Departments This Manager Can View
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_DEPARTMENTS.map(dept => (
                      <button
                        key={dept}
                        type="button"
                        onClick={() => toggleManagedDept(dept)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                          formData.managedDepts.includes(dept)
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'border-slate-200 text-slate-500 hover:border-emerald-300'
                        }`}
                      >
                        {formData.managedDepts.includes(dept) ? '✓ ' : ''}{dept}
                      </button>
                    ))}
                  </div>
                  {formData.managedDepts.length > 0 && (
                    <p className="text-xs text-emerald-600 font-bold mt-2">
                      ✓ Access to: {formData.managedDepts.join(', ')}
                    </p>
                  )}
                </div>
              )}

              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20">
                Create Account
              </button>
            </form>
          </div>

          {/* USER LIST */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-xl font-bold">Active Accounts</h2>
              <div className="flex gap-2">
                {['all', 'manager', 'staff'].map(r => (
                  <button
                    key={r}
                    onClick={() => setFilterRole(r)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                      filterRole === r ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {r === 'all' ? 'All' : r === 'manager' ? '🟢 Managers' : '🔵 Staff'}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Role / Title</th>
                    <th className="p-4">Dept / Access</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-50">
                  {filteredUsers.map(u => (
                    <tr key={u._id} className="hover:bg-slate-50 transition">
                      <td className="p-4">
                        <p className="font-bold text-slate-900">{u.name}</p>
                        <p className="text-slate-400 text-xs">{u.email}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${roleColor(u.role)}`}>
                          {u.role}
                        </span>
                        {u.jobTitle && (
                          <p className="text-slate-500 text-xs mt-1">{u.jobTitle}</p>
                        )}
                      </td>
                      <td className="p-4">
                        {u.role === 'manager' && u.managedDepts?.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {u.managedDepts.map(d => (
                              <span key={d} className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">{d}</span>
                            ))}
                          </div>
                        ) : (
                          <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-[10px] font-bold">{u.department}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-3">
                          <button onClick={() => setEditingUser({ ...u, password: '' })} className="text-blue-600 font-bold hover:underline text-xs">Edit</button>
                          <button onClick={() => handleDeleteUser(u._id, u.name)} className="text-red-400 font-bold hover:underline text-xs">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-slate-400 italic">No accounts found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* EDIT MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black mb-6 text-slate-900">Edit {editingUser.name}</h2>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                <input className="w-full p-3 bg-slate-50 border rounded-xl mt-1 font-medium" value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Job Title</label>
                <input className="w-full p-3 bg-slate-50 border rounded-xl mt-1 font-medium" placeholder="e.g. AGM, Team Lead..." value={editingUser.jobTitle || ''} onChange={e => setEditingUser({ ...editingUser, jobTitle: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Role</label>
                <select className="w-full p-3 bg-slate-50 border rounded-xl mt-1 font-medium" value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}>
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Primary Department</label>
                <select className="w-full p-3 bg-slate-50 border rounded-xl mt-1 font-medium" value={editingUser.department} onChange={e => setEditingUser({ ...editingUser, department: e.target.value })}>
                  {ALL_DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {editingUser.role === 'manager' && (
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Departments This Manager Can View</label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_DEPARTMENTS.map(dept => (
                      <button
                        key={dept}
                        type="button"
                        onClick={() => toggleManagedDept(dept, true)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                          (editingUser.managedDepts || []).includes(dept)
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'border-slate-200 text-slate-500 hover:border-emerald-300'
                        }`}
                      >
                        {(editingUser.managedDepts || []).includes(dept) ? '✓ ' : ''}{dept}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">New Password (leave blank to keep)</label>
                <input className="w-full p-3 bg-slate-50 border rounded-xl mt-1 font-medium" type="password" placeholder="Enter new password" onChange={e => setEditingUser({ ...editingUser, password: e.target.value })} />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setEditingUser(null)} className="flex-1 py-3 text-slate-400 font-bold border rounded-xl hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
