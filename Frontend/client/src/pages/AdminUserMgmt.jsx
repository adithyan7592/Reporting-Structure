import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Org Structure ────────────────────────────────────────────────────────────

const ALL_DEPARTMENTS = [
  'AYUSH',
  'Bioclean',
  'Theertha',
  'KP – ICP (CRM)',
  'KP – Factory Outlet',
  'KP – Exclusive Outlet',
  'Happiness',
  'Purchase',
  'Warehouse',
  'Media',
  'Marketing',
  'Accounts',
];

// Dept groupings for display
const DEPT_GROUPS = [
  { label: 'CRM – Ayush',         depts: ['AYUSH', 'Bioclean', 'Theertha'] },
  { label: 'KP / ICP',            depts: ['KP – ICP (CRM)', 'KP – Factory Outlet', 'KP – Exclusive Outlet'] },
  { label: 'Support Departments', depts: ['Happiness', 'Purchase', 'Warehouse', 'Media', 'Marketing', 'Accounts'] },
];

// Role presets matching actual org hierarchy
const ROLE_PRESETS = [
  // ── CRM Ayush ──
  {
    group: 'CRM – Ayush',
    label: 'AYUSH / Bioclean / Theertha — Team Lead',
    jobTitle: 'Team Lead',
    depts: ['AYUSH', 'Bioclean', 'Theertha'],
    primaryDept: 'AYUSH',
  },
  {
    group: 'CRM – Ayush',
    label: 'AYUSH Team Lead',
    jobTitle: 'Team Lead',
    depts: ['AYUSH'],
    primaryDept: 'AYUSH',
  },
  {
    group: 'CRM – Ayush',
    label: 'Bioclean Team Lead',
    jobTitle: 'Team Lead',
    depts: ['Bioclean'],
    primaryDept: 'Bioclean',
  },
  {
    group: 'CRM – Ayush',
    label: 'Theertha Team Lead',
    jobTitle: 'Team Lead',
    depts: ['Theertha'],
    primaryDept: 'Theertha',
  },
  // ── KP / ICP (CRM) ──
  {
    group: 'KP – ICP (CRM)',
    label: 'ICP CRM — AGM',
    jobTitle: 'AGM',
    depts: ['KP – ICP (CRM)', 'KP – Factory Outlet', 'KP – Exclusive Outlet'],
    primaryDept: 'KP – ICP (CRM)',
  },
  {
    group: 'KP – ICP (CRM)',
    label: 'ICP CRM — OM',
    jobTitle: 'Operations Manager',
    depts: ['KP – ICP (CRM)', 'KP – Factory Outlet', 'KP – Exclusive Outlet'],
    primaryDept: 'KP – ICP (CRM)',
  },
  {
    group: 'KP – ICP (CRM)',
    label: 'ICP CRM — Team Lead',
    jobTitle: 'Team Lead',
    depts: ['KP – ICP (CRM)'],
    primaryDept: 'KP – ICP (CRM)',
  },
  {
    group: 'KP – ICP (CRM)',
    label: 'ICP — Technical Head',
    jobTitle: 'Technical Head',
    depts: ['KP – ICP (CRM)', 'KP – Factory Outlet', 'KP – Exclusive Outlet', 'Happiness'],
    primaryDept: 'KP – ICP (CRM)',
  },
  // ── Factory Outlet ──
  {
    group: 'KP – Factory Outlet',
    label: 'Factory Outlet — AGM',
    jobTitle: 'AGM',
    depts: ['KP – Factory Outlet'],
    primaryDept: 'KP – Factory Outlet',
  },
  {
    group: 'KP – Factory Outlet',
    label: 'Factory Outlet — OM',
    jobTitle: 'Operations Manager',
    depts: ['KP – Factory Outlet'],
    primaryDept: 'KP – Factory Outlet',
  },
  {
    group: 'KP – Factory Outlet',
    label: 'Factory Outlet — Purchase Manager',
    jobTitle: 'Purchase Manager',
    depts: ['KP – Factory Outlet', 'Purchase'],
    primaryDept: 'KP – Factory Outlet',
  },
  // ── Exclusive Outlet ──
  {
    group: 'KP – Exclusive Outlet',
    label: 'Exclusive Outlet — Manager',
    jobTitle: 'Manager',
    depts: ['KP – Exclusive Outlet'],
    primaryDept: 'KP – Exclusive Outlet',
  },
  {
    group: 'KP – Exclusive Outlet',
    label: 'Exclusive Outlet — Outlet Co-ordinator',
    jobTitle: 'Outlet Co-ordinator',
    depts: ['KP – Exclusive Outlet'],
    primaryDept: 'KP – Exclusive Outlet',
  },
  {
    group: 'KP – Exclusive Outlet',
    label: 'Exclusive Outlet — AGM / OM',
    jobTitle: 'AGM / OM',
    depts: ['KP – Exclusive Outlet', 'KP – Factory Outlet'],
    primaryDept: 'KP – Exclusive Outlet',
  },
  // ── Happiness ──
  {
    group: 'Happiness',
    label: 'Happiness — Technical Head',
    jobTitle: 'Technical Head',
    depts: ['Happiness'],
    primaryDept: 'Happiness',
  },
  {
    group: 'Happiness',
    label: 'Happiness — Technical Co-ordinator',
    jobTitle: 'Technical Co-ordinator',
    depts: ['Happiness'],
    primaryDept: 'Happiness',
  },
  {
    group: 'Happiness',
    label: 'Happiness — Insurance Co-ordinator',
    jobTitle: 'Insurance Co-ordinator',
    depts: ['Happiness'],
    primaryDept: 'Happiness',
  },
  // ── Purchase ──
  {
    group: 'Purchase',
    label: 'Purchase Manager',
    jobTitle: 'Purchase Manager',
    depts: ['Purchase'],
    primaryDept: 'Purchase',
  },
  // ── Warehouse ──
  {
    group: 'Warehouse',
    label: 'Warehouse Manager',
    jobTitle: 'Warehouse Manager',
    depts: ['Warehouse'],
    primaryDept: 'Warehouse',
  },
  // ── Media ──
  {
    group: 'Media',
    label: 'Media — Head',
    jobTitle: 'Head',
    depts: ['Media'],
    primaryDept: 'Media',
  },
  // ── Marketing ──
  {
    group: 'Marketing',
    label: 'Marketing — Head',
    jobTitle: 'Head',
    depts: ['Marketing'],
    primaryDept: 'Marketing',
  },
];

const PRESET_GROUPS = [...new Set(ROLE_PRESETS.map(p => p.group))];

const API_BASE = 'https://reporting-structure.onrender.com/api';

// ── Component ────────────────────────────────────────────────────────────────

export default function AdminUserMgmt() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '',
    department: 'AYUSH',
    role: 'staff',
    jobTitle: '',
    managedDepts: [],
  });
  const [activePresetGroup, setActivePresetGroup] = useState(PRESET_GROUPS[0]);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [filterRole, setFilterRole] = useState('all');
  const navigate = useNavigate();

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setUsers(await res.json());
  };

  const applyPreset = (preset) => {
    setSelectedPreset(preset.label);
    setFormData(prev => ({
      ...prev,
      role:         'manager',
      jobTitle:     preset.jobTitle,
      managedDepts: preset.depts,
      department:   preset.primaryDept,
    }));
  };

  const toggleManagedDept = (dept, isEditing = false) => {
    if (isEditing) {
      const cur = editingUser.managedDepts || [];
      setEditingUser({
        ...editingUser,
        managedDepts: cur.includes(dept) ? cur.filter(d => d !== dept) : [...cur, dept],
      });
    } else {
      const cur = formData.managedDepts;
      setFormData({
        ...formData,
        managedDepts: cur.includes(dept) ? cur.filter(d => d !== dept) : [...cur, dept],
      });
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (res.ok) {
      alert(`✅ ${data.msg}`);
      setFormData({ name: '', email: '', password: '', department: 'AYUSH', role: 'staff', jobTitle: '', managedDepts: [] });
      setSelectedPreset(null);
      fetchUsers();
    } else {
      alert(`❌ ${data.msg}`);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/users/${editingUser._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(editingUser),
    });
    if (res.ok) { alert('✅ Updated!'); setEditingUser(null); fetchUsers(); }
    else alert('❌ Update failed');
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchUsers();
  };

  const filteredUsers = users.filter(u =>
    filterRole === 'all' ? true : u.role === filterRole
  );

  const roleChip = (role) => ({
    manager:    'bg-emerald-100 text-emerald-700',
    staff:      'bg-blue-50 text-blue-600',
    superadmin: 'bg-purple-100 text-purple-700',
  }[role] || 'bg-slate-100 text-slate-600');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">

      {/* Sidebar */}
      <div className="w-full md:w-64 bg-slate-900 text-white p-6 shrink-0 flex flex-col">
        <h1 className="text-xl font-bold text-blue-400 mb-8">Admin Panel</h1>
        <nav className="space-y-3 flex-1">
          <button onClick={() => navigate('/dashboard')} className="w-full text-left p-3 rounded-xl hover:bg-slate-800 transition text-slate-300 text-sm">
            ← Back to Dashboard
          </button>
          <div className="p-3 rounded-xl bg-blue-600 text-white font-semibold text-sm">User Management</div>
        </nav>

        {/* Role guide */}
        <div className="mt-8 p-4 bg-slate-800 rounded-2xl text-[10px] text-slate-400 space-y-2 leading-relaxed">
          <p className="font-bold text-slate-200 uppercase tracking-wider text-[9px] mb-3">Role Guide</p>
          <p>🔵 <strong className="text-slate-300">Staff</strong><br/>Submits + views own dept only</p>
          <p>🟢 <strong className="text-slate-300">Manager</strong><br/>Views assigned depts' reports</p>
          <p>🟣 <strong className="text-slate-300">Superadmin</strong><br/>Full access + user management</p>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-10">

          {/* ── CREATE FORM ── */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-xl font-black text-slate-900 mb-1">Add New Account</h2>
            <p className="text-slate-400 text-sm mb-8">Pick a preset to auto-fill a manager role, or manually set up a staff account.</p>

            {/* Preset Browser */}
            <div className="mb-8">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                Role Presets — Manager Hierarchy
              </label>

              {/* Group tabs */}
              <div className="flex flex-wrap gap-2 mb-4">
                {PRESET_GROUPS.map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setActivePresetGroup(g)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border transition ${
                      activePresetGroup === g
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>

              {/* Preset buttons for active group */}
              <div className="flex flex-wrap gap-2">
                {ROLE_PRESETS.filter(p => p.group === activePresetGroup).map(p => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                      selectedPreset === p.label
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    🟢 {p.label}
                  </button>
                ))}
                {/* Staff shortcut */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPreset('staff');
                    setFormData(prev => ({ ...prev, role: 'staff', jobTitle: '', managedDepts: [] }));
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                    selectedPreset === 'staff'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-blue-200 text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  🔵 Staff / Agent
                </button>
              </div>

              {/* Preview of what was selected */}
              {selectedPreset && selectedPreset !== 'staff' && formData.managedDepts.length > 0 && (
                <div className="mt-3 px-4 py-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wider mb-1">Access Preview</p>
                  <div className="flex flex-wrap gap-1">
                    {formData.managedDepts.map(d => (
                      <span key={d} className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">{d}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <form onSubmit={handleCreate} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Full Name</label>
                  <input
                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-medium text-sm"
                    placeholder="Name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email</label>
                  <input
                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-medium text-sm"
                    placeholder="Email"
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Password</label>
                  <input
                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-medium text-sm"
                    placeholder="Password"
                    type="password"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Job Title</label>
                  <input
                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-medium text-sm"
                    placeholder="e.g. Team Lead, AGM, Manager..."
                    value={formData.jobTitle}
                    onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Role</label>
                  <select
                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-medium text-sm"
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="staff">Staff / Agent</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Primary Department</label>
                  <select
                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-medium text-sm"
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                  >
                    {ALL_DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* Dept Access (managers only) */}
              {formData.role === 'manager' && (
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Departments This Manager Can View
                  </label>
                  <div className="space-y-3">
                    {DEPT_GROUPS.map(group => (
                      <div key={group.label}>
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">{group.label}</p>
                        <div className="flex flex-wrap gap-2">
                          {group.depts.map(dept => (
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
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 text-sm"
              >
                Create Account
              </button>
            </form>
          </div>

          {/* ── USER LIST ── */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-xl font-black text-slate-900">Active Accounts</h2>
              <div className="flex gap-2">
                {['all', 'manager', 'staff'].map(r => (
                  <button
                    key={r}
                    onClick={() => setFilterRole(r)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                      filterRole === r
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
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
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${roleChip(u.role)}`}>{u.role}</span>
                        {u.jobTitle && <p className="text-slate-500 text-xs mt-1">{u.jobTitle}</p>}
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
                          <button onClick={() => handleDelete(u._id, u.name)} className="text-red-400 font-bold hover:underline text-xs">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr><td colSpan="4" className="p-8 text-center text-slate-400 italic">No accounts found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ── EDIT MODAL ── */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black mb-6 text-slate-900">Edit {editingUser.name}</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                <input className="w-full p-3 bg-slate-50 border rounded-xl mt-1 font-medium text-sm" value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Title</label>
                <input className="w-full p-3 bg-slate-50 border rounded-xl mt-1 font-medium text-sm" placeholder="e.g. AGM, Team Lead..." value={editingUser.jobTitle || ''} onChange={e => setEditingUser({ ...editingUser, jobTitle: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</label>
                <select className="w-full p-3 bg-slate-50 border rounded-xl mt-1 font-medium text-sm" value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}>
                  <option value="staff">Staff / Agent</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Department</label>
                <select className="w-full p-3 bg-slate-50 border rounded-xl mt-1 font-medium text-sm" value={editingUser.department} onChange={e => setEditingUser({ ...editingUser, department: e.target.value })}>
                  {ALL_DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {editingUser.role === 'manager' && (
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Departments This Manager Can View</label>
                  <div className="space-y-3">
                    {DEPT_GROUPS.map(group => (
                      <div key={group.label}>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{group.label}</p>
                        <div className="flex flex-wrap gap-2">
                          {group.depts.map(dept => (
                            <button
                              key={dept}
                              type="button"
                              onClick={() => toggleManagedDept(dept, true)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
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
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Password (leave blank to keep)</label>
                <input className="w-full p-3 bg-slate-50 border rounded-xl mt-1 font-medium text-sm" type="password" placeholder="Enter new password" onChange={e => setEditingUser({ ...editingUser, password: e.target.value })} />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setEditingUser(null)} className="flex-1 py-3 text-slate-400 font-bold border rounded-xl hover:bg-slate-50 text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition text-sm">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
