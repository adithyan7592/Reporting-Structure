import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Org & field definitions ───────────────────────────────────────────────────

const ALL_DEPARTMENTS = [
  'CRM – Ayush',
 'KP – (CRM)', 'KP – (CRM) Accounts Assistant', 'KP – Factory Outlet', 'KP – Exclusive Outlet',
'Happiness – Technical Co-ordinator',
'Happiness – Technical Head',
'Happiness – Insurance Co-ordinator',
'Happiness – Outlet Support Co-ordinator',
'Purchase', 'Warehouse – KP', 'Warehouse – Ayush', 'Media – Camera Man', 'Media – Video Editor', 'Media – Designer', 'Marketing', 'Accounts – Staff', 'Accounts – Manager',
];

const DEPT_FIELDS = {
  'CRM – Ayush': ['Brand', 'Total No. of Calls', 'No. of Quality Leads', 'No. of Converted Leads', 'No. of Follow-ups', 'Total Sales Value', 'Remarks if Any'],
  'KP – (CRM)': ['Total No. of Calls', 'Quality Leads', 'No. of Converted Calls', 'No. of Quotations', 'No. of Followups', 'Factory Outlet Leads', 'Exclusive Outlet Leads', 'Total Sales Value', 'Remarks if Any'],
  'KP – (CRM) Accounts Assistant': ['No. of Quotations', 'Follow Up Calls', 'No. of Total Conversions', 'Total Sales Value'],
  'KP – Factory Outlet': ['Total No. of Walkins', 'Total No. of Bills', 'Total No. of Quotations', 'Total Sales Value', 'PO Status', 'GRN Status', 'No. of Home Deliveries', 'Painters Commission in Amt', 'Vehicle Running KM', 'Stock Alert', 'Outlet Remarks','Factory Outlet'],
  'KP – Exclusive Outlet': ['Total No. of Walkins', 'Total No. of Bills', 'Total No. of Quotations', 'Total Sales Value', 'PO Status', 'GRN Status', 'Stock Alert', 'Outlet Remarks','Exclusive Outlet'],
'Happiness – Technical Co-ordinator': ['No. of New Complaints', 'Total No. of Pending Complaints', 'Total No. of Complaints > 6 days', 'No. of complaints solved', 'No of New Positive Reviews', 'No of New Negative Reviews', 'Complaint Resolution Cost', 'Remarks'],
'Happiness – Technical Head': ['Complaint Details', 'Solution Stage', 'Vehicle', 'Status (Service / Insurance / Tax)'],
'Happiness – Insurance Co-ordinator': ['No of new insurance issued', 'No of insurance pending', 'New claims and claim amount', 'No of claims pending', 'Total calls(painters ,bonvoice )', 'No of calls  connected', 'No of calls  nc'],
'Happiness – Outlet Support Co-ordinator': ['Today Opened Outlets (Count & Names)', 'Today Outlet Bookings (Count & Names)', 'Today Outlet Cancellations (Count & Names)', 'MOU Signing (Outlet Names)', 'Outlet Training (Outlet Names)', 'Media Support (Board Design / Inauguration Notice / Painters Meeting Notice)', 'Machine Orders (Count & Outlet Names)', 'Other outlet supports'],
  'Purchase': ['Report Type', 'No. of PO Placed For F. Outlets', 'Amount of PO F. Outlets', 'No. of PO Placed For E. Outlets', 'Amount of PO E. Outlets', 'No of Total Deliveries', 'No of Total GRN Received', 'Brand / Division', 'Item', 'Vendor', 'Amount', 'Exp. Delivery Date', 'Remarks'],
  'Warehouse – KP':    ['No. of Dispatch to F Outlets', 'No. of Dispatch to E Outlets', 'No. of Stock Received', 'Vendors Name', 'No. of Pending Dispatches', 'Reason for Pending', 'Stock Alert', 'Remarks'],
'Warehouse – Ayush': ['No. of List Received', 'No. of List Dispatched', 'Dispatched List Numbers', 'No. of List Pending', 'Pending List Numbers', 'Reason for Pending', 'Stock Received if Any', 'Stock Alert', 'Remarks'],
  'Media – Camera Man':  ['No. of Work Out', 'Work Explanation', 'Next Day Work'],
'Media – Video Editor': ['No. of Videos Out', 'Out Explanation', 'Next Day Work'],
'Media – Designer':    ['No. of Designs Completed', 'Design Explanation', 'Next Day Work'],
  'Marketing': ['Completed Tasks', 'Campaign Activity', 'Issues Reported & Resolved', 'Status of Comments', 'Status of Order Fulfilments'],
 'Accounts – Staff':   ['Total List Prepared', 'Total List Dispatched', 'List Sent to Post Office', 'List Pending', 'List Pending More than 3 Days', 'Accounts Remarks'],
'Accounts – Manager': ['AYUSH – No. of Bills', 'AYUSH – Pending Bills', 'AYUSH – Payments Verified', 'AYUSH – Payments Pending', 'Theertha – No. of Bills', 'Theertha – Pending Bills', 'Theertha – Payments Verified', 'Theertha – Payments Pending', 'Bioclean – No. of Bills', 'Bioclean – Pending Bills', 'Bioclean – Payments Verified', 'Bioclean – Payments Pending', 'Khadi – No. of Bills', 'Khadi – Pending Bills', 'Khadi – Payments Verified', 'Khadi – Payments Pending', 'Suspense', 'Kerala Paints – Receipt', 'Kerala Paints – Expense', 'Bodhamudra – Receipt', 'Bodhamudra – Expense', 'Njavallikunnel Agencies – Amt', 'Njavallikunnel Paints – Amt', 'Other Pending Payments', 'Kerala Paints – Upcoming Expense', 'Bodhamudra – Upcoming Expense', 'Other Upcoming Payments'],
};

const DEPT_GROUPS = [
  { label: 'CRM – AYUSH', depts: ['CRM – Ayush'] },
  { label: 'KP', depts: ['KP – (CRM)', 'KP – (CRM) Accounts Assistant', 'KP – Factory Outlet', 'KP – Exclusive Outlet'] },
  { label: 'Support',         depts: ['Happiness – Technical Co-ordinator', 'Happiness – Technical Head', 'Happiness – Insurance Co-ordinator', 'Happiness – Outlet Support Co-ordinator', 'Purchase', 'Warehouse – KP', 'Warehouse – Ayush', 'Media – Camera Man', 'Media – Video Editor', 'Media – Designer', 'Marketing', 'Accounts – Staff', 'Accounts – Manager'] },
];

const ROLE_PRESETS = [
 { group: 'CRM – AYUSH', label: 'CRM Ayush Team Lead', jobTitle: 'Team Lead', depts: ['CRM – Ayush'], primaryDept: 'CRM – Ayush' },
  { group: 'KP',              label: 'AGM',                             jobTitle: 'AGM',                 depts: ['KP – (CRM)', 'KP – Factory Outlet', 'KP – Exclusive Outlet'],              primaryDept: 'KP – (CRM)' },
  { group: 'KP',              label: 'OM',                              jobTitle: 'Operations Manager',  depts: ['KP – (CRM)', 'KP – Factory Outlet', 'KP – Exclusive Outlet'],              primaryDept: 'KP – (CRM)' },
 { group: 'KP', label: 'Team Lead', jobTitle: 'Team Lead', depts: ['KP – (CRM)'], primaryDept: 'KP – (CRM)' },
 { group: 'KP', label: 'CRM Accounts Assistant', jobTitle: 'Accounts Assistant', depts: ['KP – (CRM) Accounts Assistant'], primaryDept: 'KP – (CRM) Accounts Assistant' },
  { group: 'KP', label: 'Technical Head', jobTitle: 'Technical Head', depts: ['KP – (CRM)', 'KP – Factory Outlet', 'KP – Exclusive Outlet', 'Happiness – Technical Co-ordinator', 'Happiness – Technical Head'], primaryDept: 'KP – (CRM)' },
  { group: 'KP',              label: 'Factory Outlet — AGM',                      jobTitle: 'AGM',                 depts: ['KP – Factory Outlet'],                                                          primaryDept: 'KP – Factory Outlet' },
  { group: 'KP',              label: 'Factory Outlet — OM',                       jobTitle: 'Operations Manager',  depts: ['KP – Factory Outlet'],                                                          primaryDept: 'KP – Factory Outlet' },
  { group: 'KP',              label: 'Factory Outlet — Purchase Manager',          jobTitle: 'Purchase Manager',    depts: ['KP – Factory Outlet', 'Purchase'],                                              primaryDept: 'KP – Factory Outlet' },
  { group: 'KP',              label: 'Exclusive Outlet — Manager',                jobTitle: 'Manager',             depts: ['KP – Exclusive Outlet'],                                                        primaryDept: 'KP – Exclusive Outlet' },
  { group: 'KP',              label: 'Exclusive Outlet — Outlet Co-ordinator',    jobTitle: 'Outlet Co-ordinator', depts: ['KP – Exclusive Outlet'],                                                        primaryDept: 'KP – Exclusive Outlet' },
 { group: 'Support', label: 'Happiness — Technical Head',               jobTitle: 'Technical Head',               depts: ['Happiness – Technical Head'],               primaryDept: 'Happiness – Technical Head' },
 { group: 'Support', label: 'Happiness — Technical Co-ordinator',       jobTitle: 'Technical Co-ordinator',       depts: ['Happiness – Technical Co-ordinator'],       primaryDept: 'Happiness – Technical Co-ordinator' },
 { group: 'Support', label: 'Happiness — Insurance Co-ordinator',       jobTitle: 'Insurance Co-ordinator',       depts: ['Happiness – Insurance Co-ordinator'],       primaryDept: 'Happiness – Insurance Co-ordinator' },
 { group: 'Support', label: 'Happiness — Outlet Support Co-ordinator',  jobTitle: 'Outlet Support Co-ordinator',  depts: ['Happiness – Outlet Support Co-ordinator'],  primaryDept: 'Happiness – Outlet Support Co-ordinator' },
  { group: 'Support',         label: 'Purchase Manager',                           jobTitle: 'Purchase Manager',    depts: ['Purchase'],                                                                     primaryDept: 'Purchase' },
{ group: 'Support', label: 'KP Warehouse Incharge',    jobTitle: 'Warehouse Incharge', depts: ['Warehouse – KP'],    primaryDept: 'Warehouse – KP' },
{ group: 'Support', label: 'Ayush Warehouse Incharge',  jobTitle: 'Warehouse Incharge', depts: ['Warehouse – Ayush'], primaryDept: 'Warehouse – Ayush' },
{ group: 'Support', label: 'Media — Head', jobTitle: 'Head', depts: ['Media – Camera Man', 'Media – Video Editor', 'Media – Designer'], primaryDept: 'Media – Camera Man' },
  { group: 'Support',         label: 'Marketing — Head',                           jobTitle: 'Head',                depts: ['Marketing'],                                                                    primaryDept: 'Marketing' },
];

const PRESET_GROUPS = [...new Set(ROLE_PRESETS.map(p => p.group))];
const API_BASE = 'https://reporting-structure.onrender.com/api';

// ── Helpers ───────────────────────────────────────────────────────────────────

// Build initial managedDepts entry with all fields selected
function buildDeptEntry(deptName) {
  return { dept: deptName, fields: [...(DEPT_FIELDS[deptName] || [])] };
}

function getManagedDeptEntry(managedDepts, deptName) {
  return managedDepts.find(d => d.dept === deptName) || null;
}

function toggleDeptInList(managedDepts, deptName) {
  const exists = managedDepts.find(d => d.dept === deptName);
  if (exists) return managedDepts.filter(d => d.dept !== deptName);
  return [...managedDepts, buildDeptEntry(deptName)];
}

function toggleFieldInDept(managedDepts, deptName, fieldName) {
  return managedDepts.map(d => {
    if (d.dept !== deptName) return d;
    const hasField = d.fields.includes(fieldName);
    return { ...d, fields: hasField ? d.fields.filter(f => f !== fieldName) : [...d.fields, fieldName] };
  });
}

function setAllFields(managedDepts, deptName, selectAll) {
  return managedDepts.map(d => {
    if (d.dept !== deptName) return d;
    return { ...d, fields: selectAll ? [...(DEPT_FIELDS[deptName] || [])] : [] };
  });
}

// ── Dept Access Card with Field Checklist ─────────────────────────────────────

function DeptAccessCard({ deptName, entry, onToggleDept, onToggleField, onSelectAll }) {
  const [expanded, setExpanded] = useState(false);
  const allFields = DEPT_FIELDS[deptName] || [];
  const isActive = !!entry;
  const selectedCount = entry ? entry.fields.length : 0;
  const allSelected = selectedCount === allFields.length;

  return (
    <div className={`rounded-2xl border-2 transition-all ${isActive ? 'border-emerald-400 bg-emerald-50/50' : 'border-slate-200 bg-white'}`}>
      {/* Dept header row */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          {/* Toggle dept on/off */}
          <button
            type="button"
            onClick={() => { onToggleDept(deptName); if (!isActive) setExpanded(true); }}
            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center font-black text-xs transition-all flex-shrink-0 ${
              isActive ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 text-slate-300 hover:border-emerald-400'
            }`}
          >
            {isActive ? '✓' : ''}
          </button>
          <span className={`text-sm font-bold ${isActive ? 'text-emerald-900' : 'text-slate-500'}`}>{deptName}</span>
          {isActive && (
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
              {selectedCount}/{allFields.length} fields
            </span>
          )}
        </div>

        {/* Expand/collapse field list */}
        {isActive && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-emerald-600 text-xs font-black hover:underline flex items-center gap-1"
          >
            {expanded ? 'Hide fields ▲' : 'Edit fields ▼'}
          </button>
        )}
      </div>

      {/* Field checklist (shown when expanded) */}
      {isActive && expanded && (
        <div className="px-4 pb-4 border-t border-emerald-100 pt-3">
          {/* Select all / Clear */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Field Access</span>
            <div className="flex gap-3">
              <button type="button" onClick={() => onSelectAll(deptName, true)} className="text-[10px] font-black text-emerald-600 hover:underline">All</button>
              <button type="button" onClick={() => onSelectAll(deptName, false)} className="text-[10px] font-black text-red-400 hover:underline">None</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {allFields.map(field => {
              const checked = entry.fields.includes(field);
              return (
                <button
                  key={field}
                  type="button"
                  onClick={() => onToggleField(deptName, field)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all border ${
                    checked
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <span className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 font-black text-[10px] border ${
                    checked ? 'bg-white/30 border-white/50 text-white' : 'border-slate-300'
                  }`}>
                    {checked ? '✓' : ''}
                  </span>
                  {field}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AdminUserMgmt() {
  const role = localStorage.getItem('role');
  let managedDepts = [];
  try { managedDepts = JSON.parse(localStorage.getItem('managedDepts') || '[]'); } catch { managedDepts = []; }

  const availableDepts = role === 'manager'
    ? managedDepts.map(d => d.dept)
    : ALL_DEPARTMENTS;

const emptyForm = { name: '', email: '', password: '', department: availableDepts[0] || 'AYUSH', role: 'staff', jobTitle: '', managedDepts: [] };
const [formData, setFormData] = useState(emptyForm);
const [activePresetGroup, setActivePresetGroup] = useState(PRESET_GROUPS[0]);
const [selectedPreset, setSelectedPreset] = useState(null);
const [users, setUsers] = useState([]);
const [editingUser, setEditingUser] = useState(null);
const [filterRole, setFilterRole] = useState('all');
const [expandedUser, setExpandedUser] = useState(null);
const [toast, setToast] = useState(null);
const [confirmDelete, setConfirmDelete] = useState(null);
const navigate = useNavigate();

const showToast = (msg, type = 'success') => {
  setToast({ msg, type });
  setTimeout(() => setToast(null), 3500);
};

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    const res = await fetch(`${API_BASE}/users`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    if (res.ok) setUsers(await res.json());
  };

  const applyPreset = (preset) => {
    setSelectedPreset(preset.label);
    setFormData(prev => ({
      ...prev,
      role: 'manager',
      jobTitle: preset.jobTitle,
      primaryDept: preset.primaryDept,
      department: preset.primaryDept,
      // Build managedDepts with all fields selected by default
      managedDepts: preset.depts.map(buildDeptEntry),
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (res.ok) { showToast(`✅ ${data.msg}`); setFormData(emptyForm); setSelectedPreset(null); fetchUsers(); }
    else showToast(`❌ ${data.msg}`, 'error');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/users/${editingUser._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(editingUser),
    });
    if (res.ok) { showToast('✅ User updated successfully!'); setEditingUser(null); fetchUsers(); }
    else showToast('❌ Update failed', 'error');
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const res = await fetch(`${API_BASE}/users/${confirmDelete.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    setConfirmDelete(null);
    if (res.ok) { showToast(`✅ ${confirmDelete.name} deleted`); fetchUsers(); }
    else showToast('❌ Delete failed', 'error');
  };

  // Handlers for form managedDepts
  const formHandlers = {
    toggleDept:  (d) => setFormData(p => ({ ...p, managedDepts: toggleDeptInList(p.managedDepts, d) })),
    toggleField: (d, f) => setFormData(p => ({ ...p, managedDepts: toggleFieldInDept(p.managedDepts, d, f) })),
    selectAll:   (d, all) => setFormData(p => ({ ...p, managedDepts: setAllFields(p.managedDepts, d, all) })),
  };

  // Handlers for edit modal managedDepts
  const editHandlers = {
    toggleDept:  (d) => setEditingUser(p => ({ ...p, managedDepts: toggleDeptInList(p.managedDepts || [], d) })),
    toggleField: (d, f) => setEditingUser(p => ({ ...p, managedDepts: toggleFieldInDept(p.managedDepts || [], d, f) })),
    selectAll:   (d, all) => setEditingUser(p => ({ ...p, managedDepts: setAllFields(p.managedDepts || [], d, all) })),
  };

  const filteredUsers = users.filter(u => filterRole === 'all' || u.role === filterRole);

  const roleChip = (r) => ({
  management: 'bg-rose-100 text-rose-700',
  manager:    'bg-emerald-100 text-emerald-700',
  staff:      'bg-blue-50 text-blue-600',
}[r] || 'bg-slate-100 text-slate-600');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">

      {/* Sidebar */}
      <div className="w-full md:w-64 bg-slate-900 text-white p-6 shrink-0 flex flex-col">
        <h1 className="text-xl font-bold text-blue-400 mb-8">Admin Panel</h1>
        <nav className="space-y-3 flex-1">
          <button onClick={() => navigate('/dashboard')} className="w-full text-left p-3 rounded-xl hover:bg-slate-800 transition text-slate-300 text-sm">← Back to Dashboard</button>
          <div className="p-3 rounded-xl bg-blue-600 text-white font-semibold text-sm">User Management</div>
        </nav>
        {/* <div className="mt-8 p-4 bg-slate-800 rounded-2xl text-[10px] text-slate-400 space-y-2 leading-relaxed">
          <p className="font-bold text-slate-200 uppercase tracking-wider text-[9px] mb-3">Role Guide</p>
          <p>🔵 <strong className="text-slate-300">Staff</strong> — Submits + views own dept</p>
          <p>🟢 <strong className="text-slate-300">Manager</strong> — Views selected depts & fields</p>
          <p>🟣 <strong className="text-slate-300">Superadmin</strong> — Full access</p>
        </div> */}
      </div>

      {/* Main */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-10">

          {/* ── CREATE FORM ── */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-xl font-black text-slate-900 mb-1">Add New Account</h2>
            <p className="text-slate-400 text-sm mb-8">For managers: choose a preset, then customize which departments and specific fields they can view.</p>

            {/* Preset Browser — superadmin only */}
            {role === 'superadmin' && <div className="mb-8">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Quick Role Presets</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {PRESET_GROUPS.map(g => (
                  <button key={g} type="button" onClick={() => setActivePresetGroup(g)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border transition ${activePresetGroup === g ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                    {g}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {ROLE_PRESETS.filter(p => p.group === activePresetGroup).map(p => (
                  <button key={p.label} type="button" onClick={() => applyPreset(p)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${selectedPreset === p.label ? 'bg-emerald-600 text-white border-emerald-600' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'}`}>
                    🟢 {p.label}
                  </button>
                ))}
                <button type="button" onClick={() => { setSelectedPreset('staff'); setFormData(p => ({ ...p, role: 'staff', jobTitle: '', managedDepts: [] })); }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${selectedPreset === 'staff' ? 'bg-blue-600 text-white border-blue-600' : 'border-blue-200 text-blue-700 hover:bg-blue-50'}`}>
                  🔵 Staff / Agent
                </button>
              </div>
            </div>}

            <form onSubmit={handleCreate} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Name' },
                  { label: 'Email', key: 'email', type: 'email', placeholder: 'Email' },
                  { label: 'Password', key: 'password', type: 'password', placeholder: 'Password' },
                  { label: 'Job Title', key: 'jobTitle', type: 'text', placeholder: 'e.g. Team Lead, AGM...' },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</label>
                    <input type={type} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-medium text-sm"
                      placeholder={placeholder} value={formData[key]}
                      onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                      required={key !== 'jobTitle'} />
                  </div>
                ))}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Role</label>
                  <select className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-medium text-sm" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} disabled={role === 'manager'}>
                    <option value="staff">Staff / Agent</option>
                  {role === 'superadmin' && <option value="management">Management</option>}
{role === 'superadmin' && <option value="manager">Manager</option>}
                  </select>
                </div>
                {formData.role !== 'management' && (
  <div>
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Primary Department</label>
    <select className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-medium text-sm" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
      {availableDepts.map(d => <option key={d} value={d}>{d}</option>)}
    </select>
  </div>
)}
{formData.role === 'management' && (
  <div>
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Primary Department</label>
    <div className="w-full p-3 border border-slate-200 rounded-xl bg-slate-100 font-medium text-sm text-slate-400">
      All Departments (auto-assigned)
    </div>
  </div>
)}
              </div>

              {/* Field-level Dept Access */}
              {formData.role === 'manager' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Department & Field Access
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {formData.managedDepts.length} dept{formData.managedDepts.length !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <div className="space-y-3">
                    {DEPT_GROUPS.map(group => (
                      <div key={group.label}>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{group.label}</p>
                        <div className="space-y-2">
                          {group.depts.map(deptName => (
                            <DeptAccessCard
                              key={deptName}
                              deptName={deptName}
                              entry={getManagedDeptEntry(formData.managedDepts, deptName)}
                              onToggleDept={formHandlers.toggleDept}
                              onToggleField={formHandlers.toggleField}
                              onSelectAll={formHandlers.selectAll}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 text-sm">
                Create Account
              </button>
            </form>
          </div>

          {/* ── USER LIST ── */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
  <h2 className="text-xl font-black text-slate-900">Active Accounts</h2>
  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar w-full sm:w-auto">
  {['all', 'management', 'manager', 'staff'].map(r => (
  <button key={r} onClick={() => setFilterRole(r)}
    className={`px-3 py-2 rounded-xl text-xs font-bold border transition whitespace-nowrap ${filterRole === r ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
    {r === 'all' ? 'All' : r === 'management' ? '🔴 Management' : r === 'manager' ? '🟢 Managers' : '🔵 Staff'}
  </button>
))}
  </div>
</div>

            <div className="divide-y divide-slate-50">
              {filteredUsers.map(u => (
                <div key={u._id} className="p-4 hover:bg-slate-50 transition">
  <div className="flex items-start justify-between gap-2">
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <p className="font-bold text-slate-900">{u.name}</p>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black whitespace-nowrap ${roleChip(u.role)}`}>{u.role}</span>
        {u.jobTitle && <span className="text-slate-400 text-xs">{u.jobTitle}</span>}
      </div>
      <p className="text-slate-400 text-xs mt-0.5 break-all">{u.email}</p>
    </div>
    <div className="flex flex-col sm:flex-row gap-1.5 flex-shrink-0">
      <button onClick={() => setEditingUser({ ...u, password: '', managedDepts: u.managedDepts || [] })} className="bg-blue-50 text-blue-600 font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-blue-100 transition text-center">Edit</button>
      <button onClick={() => setConfirmDelete({ id: u._id, name: u.name })} className="bg-red-50 text-red-500 font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-red-100 transition text-center">Delete</button>
    </div>
  </div>
  {u.role === 'manager' && u.managedDepts?.length > 0 && (
    <div className="mt-2 flex flex-wrap gap-1">
      {u.managedDepts.map(d => (
        <span key={d.dept} className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold max-w-full break-words">
          {d.dept} ({d.fields.length === (DEPT_FIELDS[d.dept] || []).length ? 'all fields' : `${d.fields.length} fields`})
        </span>
      ))}
    </div>
  )}
  {u.role === 'management' && (
    <span className="inline-block mt-1 bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full text-[10px] font-bold">All Departments</span>
  )}
  {u.role === 'staff' && (
    <span className="inline-block mt-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-[10px] font-bold">{u.department}</span>
  )}
</div>
              ))}
              {filteredUsers.length === 0 && (
                <div className="p-8 text-center text-slate-400 italic">No accounts found.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── EDIT MODAL ── */}

      {/* ── TOAST ── */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm text-white ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-600'}`}>
          {toast.msg}
        </div>
      )}

      {/* ── CONFIRM DELETE ── */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
            <h2 className="text-xl font-black text-slate-900 mb-2">Delete Account?</h2>
            <p className="text-slate-500 text-sm mb-6">Are you sure you want to delete <span className="font-bold text-slate-900">{confirmDelete.name}</span>? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-3 text-slate-500 font-bold border border-slate-200 rounded-2xl hover:bg-slate-50 transition text-sm">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition text-sm">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ── */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-black text-slate-900">Edit {editingUser.name}</h2>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-700 text-xl">✕</button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                  <input className="w-full p-3 bg-slate-50 border rounded-xl mt-1 font-medium text-sm" value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Title</label>
                  <input className="w-full p-3 bg-slate-50 border rounded-xl mt-1 font-medium text-sm" value={editingUser.jobTitle || ''} onChange={e => setEditingUser({ ...editingUser, jobTitle: e.target.value })} />
                </div>
                {editingUser.role !== 'management' && (
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</label>
                    <select className="w-full p-3 bg-slate-50 border rounded-xl mt-1 font-medium text-sm" value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value })} disabled={role === 'manager'}>
                      <option value="staff">Staff / Agent</option>
                      {role === 'superadmin' && <option value="management">Management</option>}
                      {role === 'superadmin' && <option value="manager">Manager</option>}
                    </select>
                  </div>
                )}
                {editingUser.role !== 'management' ? (
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Department</label>
                    <select className="w-full p-3 bg-slate-50 border rounded-xl mt-1 font-medium text-sm" value={editingUser.department} onChange={e => setEditingUser({ ...editingUser, department: e.target.value })}>
                      {availableDepts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Department</label>
                    <div className="w-full p-3 border border-slate-200 rounded-xl bg-slate-100 font-medium text-sm text-slate-400 mt-1">All Departments (auto-assigned)</div>
                  </div>
                )}
              </div>

              {editingUser.role === 'manager' && (
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Department & Field Access</label>
                  <div className="space-y-4">
                    {DEPT_GROUPS.map(group => (
                      <div key={group.label}>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{group.label}</p>
                        <div className="space-y-2">
                          {group.depts.map(deptName => (
                            <DeptAccessCard
                              key={deptName}
                              deptName={deptName}
                              entry={getManagedDeptEntry(editingUser.managedDepts || [], deptName)}
                              onToggleDept={editHandlers.toggleDept}
                              onToggleField={editHandlers.toggleField}
                              onSelectAll={editHandlers.selectAll}
                            />
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

              <div className="flex gap-3 pt-2">
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



