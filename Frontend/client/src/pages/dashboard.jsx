import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Date helpers ──────────────────────────────────────────────────────────────
function toYMD(d) { return d.toISOString().split('T')[0]; }
function todayYMD() { return toYMD(new Date()); }
function shiftDate(ymd, days) { const d = new Date(ymd + 'T00:00:00'); d.setDate(d.getDate() + days); return toYMD(d); }
function formatDateLabel(ymd) {
  const d = new Date(ymd + 'T00:00:00');
  const today = todayYMD(), yesterday = shiftDate(today, -1);
  if (ymd === today)     return `Today — ${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  if (ymd === yesterday) return `Yesterday — ${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

// ── Dept field config ─────────────────────────────────────────────────────────
const departmentConfig = {
  'AYUSH': [
    { label: 'Total No. of Calls',       type: 'number' },
    { label: 'No. of Quality Leads',     type: 'number' },
    { label: 'No. of Converted Leads',   type: 'number' },
    { label: 'No. of Follow-ups',        type: 'number' },
    { label: 'Total Sales Value',        type: 'number' },
    { label: 'Remarks if Any',           type: 'textarea' },
  ],
  'Bioclean': [
    { label: 'Total No. of Calls',       type: 'number' },
    { label: 'No. of Quality Leads',     type: 'number' },
    { label: 'No. of Converted Leads',   type: 'number' },
    { label: 'No. of Follow-ups',        type: 'number' },
    { label: 'Total Sales Value',        type: 'number' },
    { label: 'Remarks if Any',           type: 'textarea' },
  ],
  'Theertha': [
    { label: 'Total No. of Calls',       type: 'number' },
    { label: 'No. of Quality Leads',     type: 'number' },
    { label: 'No. of Converted Leads',   type: 'number' },
    { label: 'No. of Follow-ups',        type: 'number' },
    { label: 'Total Sales Value',        type: 'number' },
    { label: 'Remarks if Any',           type: 'textarea' },
  ],
'KP – (CRM)': [
  { label: 'Total No. of Calls',       type: 'number' },
  { label: 'Quality Leads',            type: 'number' },
  { label: 'No. of Converted Calls',   type: 'number' },
  { label: 'No. of Quotations',        type: 'number' },
  { label: 'No. of Followups',         type: 'number' },
  { label: 'Factory Outlet Leads',     type: 'number' },
  { label: 'Exclusive Outlet Leads',   type: 'number' },
  { label: 'Total Sales Value',        type: 'number' },
  { label: 'Remarks if Any',           type: 'textarea' },
],
'KP – (CRM) Accounts Assistant': [
  { label: 'No. of Quotations',        type: 'number' },
  { label: 'Follow Up Calls',          type: 'number' },
  { label: 'No. of Total Conversions', type: 'number' },
  { label: 'Total Sales Value',        type: 'number' },
],
  'KP – Factory Outlet': [
    { label: 'Total No. of Walkins',          type: 'number' },
    { label: 'Total No. of Bills',            type: 'number' },
    { label: 'Total No. of Quotations',       type: 'number' },
    { label: 'Total Sales Value',             type: 'number' },
    { label: 'PO Status',                     type: 'text' },
    { label: 'GRN Status',                    type: 'text' },
    { label: 'No. of Home Deliveries',        type: 'number' },
    { label: 'Painters Commission in Amt',    type: 'number' },
    { label: 'Vehicle Running KM',            type: 'number' },
    { label: 'Stock Alert',                   type: 'number' },
    { label: 'Outlet Remarks',                type: 'textarea' },
    { label: 'Factory Outlet', type: 'text' },
  ],
  'KP – Exclusive Outlet': [
    { label: 'Total No. of Walkins',    type: 'number' },
    { label: 'Total No. of Bills',      type: 'number' },
    { label: 'Total No. of Quotations', type: 'number' },
    { label: 'Total Sales Value',       type: 'number' },
    { label: 'PO Status',               type: 'text' },
    { label: 'GRN Status',              type: 'text' },
    { label: 'Stock Alert',             type: 'number' },
    { label: 'Outlet Remarks',          type: 'textarea' },
    { label: 'Exclusive Outlet', type: 'text' },
  ],
'Happiness – Technical Co-ordinator': [
  { label: 'No. of New Complaints',             type: 'number' },
  { label: 'Total No. of Pending Complaints',   type: 'number' },
  { label: 'Total No. of Complaints > 6 days',  type: 'number' },
  { label: 'No. of complaints solved',           type: 'number' },
  { label: 'No of New Positive Reviews',         type: 'number' },
  { label: 'No of New Negative Reviews',         type: 'number' },
  { label: 'Complaint Resolution Cost',          type: 'number' },
  { label: 'Remarks',                            type: 'textarea' },
],
'Happiness – Technical Head': [
  { label: 'Complaint Details',                  type: 'textarea' },
  { label: 'Solution Stage',                     type: 'text' },
  { label: 'Vehicle',                            type: 'text' },
  { label: 'Status (Service / Insurance / Tax)', type: 'text' },
],
'Happiness – Insurance Co-ordinator': [
  { label: 'No. of New Insurance Issued by F Outlets', type: 'number' },
  { label: 'No. of New Insurance Issued by E Outlets', type: 'number' },
  { label: 'No. of Claims Pending',                    type: 'number' },
  { label: 'No. of Claims Provided',                   type: 'number' },
  { label: 'Total Claim Amount',                       type: 'number' },
  { label: 'Remarks',                                  type: 'textarea' },
],
'Happiness – Outlet Support Co-ordinator': [
  { label: 'New MOU',                          type: 'number' },
  { label: 'New Openings with Date',           type: 'text' },
  { label: 'Board Design Provided & Details',  type: 'textarea' },
  { label: 'Outlet Training & Details',        type: 'textarea' },
  { label: 'Outlets Interior Completed',       type: 'number' },
  { label: 'Outlets Cancelled if Any',         type: 'number' },
],
 'Purchase': [
  // Report Type selector — controls which fields appear
  { label: 'Report Type', type: 'report_selector', options: ['PO Report', 'Brand Purchase Order'] },

  // PO Report fields (shown when Report Type = 'PO Report')
  { label: 'No. of PO Placed For F. Outlets', type: 'number',   reportType: 'PO Report' },
  { label: 'Amount of PO F. Outlets',         type: 'number',   reportType: 'PO Report' },
  { label: 'No. of PO Placed For E. Outlets', type: 'number',   reportType: 'PO Report' },
  { label: 'Amount of PO E. Outlets',         type: 'number',   reportType: 'PO Report' },
  { label: 'No of Total Deliveries',          type: 'number',   reportType: 'PO Report' },
  { label: 'No of Total GRN Received',        type: 'number',   reportType: 'PO Report' },

  // Brand Purchase Order fields (shown when Report Type = 'Brand Purchase Order')
  { label: 'Brand / Division', type: 'select',  reportType: 'Brand Purchase Order', options: ['AYUSH', 'Theertha', 'Bioclean', 'KP', 'HO'] },
  { label: 'Item',             type: 'text',    reportType: 'Brand Purchase Order' },
  { label: 'Vendor',           type: 'text',    reportType: 'Brand Purchase Order' },
  { label: 'Amount',           type: 'number',  reportType: 'Brand Purchase Order' },
  { label: 'Exp. Delivery Date', type: 'date',  reportType: 'Brand Purchase Order' },
  { label: 'Remarks',          type: 'textarea', reportType: 'Brand Purchase Order' },
],
'Warehouse – KP': [
  { label: 'No. of Dispatch to F Outlets', type: 'number' },
  { label: 'No. of Dispatch to E Outlets', type: 'number' },
  { label: 'No. of Stock Received',        type: 'number' },
  { label: 'Vendors Name',                 type: 'text' },
  { label: 'No. of Pending Dispatches',    type: 'number' },
  { label: 'Reason for Pending',           type: 'textarea' },
  { label: 'Stock Alert',                  type: 'number' },
  { label: 'Remarks',                      type: 'textarea' },
],
'Warehouse – Ayush': [
  { label: 'No. of List Received',     type: 'number' },
  { label: 'No. of List Dispatched',   type: 'number' },
  { label: 'Dispatched List Numbers',  type: 'text' },
  { label: 'No. of List Pending',      type: 'number' },
  { label: 'Pending List Numbers',     type: 'text' },
  { label: 'Reason for Pending',       type: 'textarea' },
  { label: 'Stock Received if Any',    type: 'number' },
  { label: 'Stock Alert',              type: 'number' },
  { label: 'Remarks',                  type: 'textarea' },
],
'Media – Camera Man': [
  { label: 'No. of Work Out',    type: 'number' },
  { label: 'Work Explanation',   type: 'textarea' },
  { label: 'Next Day Work',      type: 'textarea' },
],
'Media – Video Editor': [
  { label: 'No. of Videos Out',  type: 'number' },
  { label: 'Out Explanation',    type: 'textarea' },
  { label: 'Next Day Work',      type: 'textarea' },
],
'Media – Designer': [
  { label: 'No. of Designs Completed', type: 'number' },
  { label: 'Design Explanation',       type: 'textarea' },
  { label: 'Next Day Work',            type: 'textarea' },
],
  'Marketing': [
    { label: 'Campaign Name',   type: 'text' },
    { label: 'Platform',        type: 'text' },
    { label: 'Leads Generated', type: 'number' },
    { label: 'Budget Spent',    type: 'number' },
    { label: 'Notes',           type: 'textarea' },
  ],
  'Accounts': [
    { label: 'Total List Prepared', type: 'textarea' },
    { label: 'Total List Dispatched',       type: 'textarea' },
    { label: 'List Sent to Post Office',   type: 'textarea' },
    { label: 'List Pending',       type: 'textarea' },
    { label: 'List Pending More than 3 Days',    type: 'textarea' },
    { label: 'Accounts Remarks',          type: 'textarea' },
  ],
};

const ALL_DEPTS = Object.keys(departmentConfig);

// ── Daily Report Table ────────────────────────────────────────────────────────

function DailyTable({ reports, dept, selectedDay, allowedFields, onRowClick }) {
  const allFields = departmentConfig[dept] || [];
  const visibleFields = allFields.filter(f => !allowedFields || allowedFields.includes(f.label));
  const numericFields = visibleFields.filter(f => f.type === 'number');

  const dayReports = reports.filter(r =>
    r.department === dept &&
    new Date(r.createdAt).toISOString().split('T')[0] === selectedDay
  );

  const agentMap = {};
  dayReports.forEach(r => {
    const name = r.staffName || 'Unknown';
    if (!agentMap[name]) agentMap[name] = { staffName: name, entries: [], latest: null };
    agentMap[name].entries.push(r);
    if (!agentMap[name].latest || new Date(r.createdAt) > new Date(agentMap[name].latest.createdAt))
      agentMap[name].latest = r;
  });

  const rows = Object.values(agentMap);

  const totals = {};
  numericFields.forEach(f => {
    totals[f.label] = rows.reduce((sum, a) => sum + (parseFloat(a.latest?.data?.[f.label]) || 0), 0);
  });

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <div className="text-5xl mb-4">📋</div>
        <p className="font-semibold text-lg">No reports submitted on this day</p>
        <p className="text-sm mt-1">for <span className="font-bold text-slate-500">{dept}</span></p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-sm min-w-max">
        <thead>
          <tr className="bg-slate-900 text-white">
            <th className="px-5 py-4 text-[10px] uppercase tracking-widest font-black sticky left-0 bg-slate-900 z-10 min-w-[40px]">Sl.</th>
            <th className="px-5 py-4 text-[10px] uppercase tracking-widest font-black sticky left-[56px] bg-slate-900 z-10 min-w-[160px]">Agent Name</th>
            {numericFields.map(f => (
              <th key={f.label} className="px-5 py-4 text-[10px] uppercase tracking-widest font-black whitespace-nowrap">{f.label}</th>
            ))}
            {dept === 'KP – (CRM)' && (
              <th className="px-5 py-4 text-[10px] uppercase tracking-widest font-black whitespace-nowrap bg-slate-800 sticky right-16 z-10">
                Conversion Rate %
              </th>
            )}
            <th className="px-5 py-4 text-[10px] uppercase tracking-widest font-black sticky right-0 bg-slate-900 z-10">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((agent, idx) => {
            const data = agent.latest?.data || {};
            return (
              <tr key={agent.staffName} onClick={() => onRowClick?.(agent)}
                className="border-b border-slate-100 hover:bg-blue-50/60 cursor-pointer transition group">
                <td className="px-5 py-4 text-slate-400 font-bold text-xs sticky left-0 bg-white group-hover:bg-blue-50/60 z-10">{idx + 1}</td>
                <td className="px-5 py-4 sticky left-[56px] bg-white group-hover:bg-blue-50/60 z-10">
                  <p className="font-bold text-slate-900">{agent.staffName}</p>
                  {agent.entries.length > 1 && (
                    <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{agent.entries.length} entries</span>
                  )}
                  {agent.latest?.isEdited && (
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full ml-1">✏️ Edited</span>
                  )}
                </td>
                {numericFields.map(f => (
                  <td key={f.label} className="px-5 py-4 text-slate-700 font-semibold tabular-nums">
                    {parseFloat(data[f.label]) > 0
                      ? parseFloat(data[f.label]).toLocaleString('en-IN')
                      : <span className="text-slate-300">—</span>}
                  </td>
                ))}
                {dept === 'KP – (CRM)' && (() => {
                  const calls = parseFloat(data['Total No. of Calls']) || 0;
                  const converted = parseFloat(data['No. of Converted Calls']) || 0;
                  const rate = calls > 0 ? ((converted / calls) * 100).toFixed(1) : null;
                  return (
                    <td className="px-5 py-4 font-bold tabular-nums sticky right-16 bg-white group-hover:bg-blue-50/60 z-10">
                      {rate !== null
                        ? <span className={`px-2 py-1 rounded-lg text-xs font-black ${parseFloat(rate) >= 50 ? 'bg-emerald-100 text-emerald-700' : parseFloat(rate) >= 25 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'}`}>
                            {rate}%
                          </span>
                        : <span className="text-slate-300">—</span>}
                    </td>
                  );
                })()}
                <td className="px-5 py-4 sticky right-0 bg-white group-hover:bg-blue-50/60 z-10">
                  <span className="text-blue-600 text-xs font-black group-hover:underline">View →</span>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="bg-slate-50 border-t-2 border-slate-300">
            <td className="px-5 py-4 sticky left-0 bg-slate-50 z-10"></td>
            <td className="px-5 py-4 font-black text-slate-900 uppercase text-xs tracking-wider sticky left-[56px] bg-slate-50 z-10">Total</td>
            {numericFields.map(f => (
              <td key={f.label} className="px-5 py-4 font-black text-slate-900 tabular-nums">
                {totals[f.label] > 0 ? totals[f.label].toLocaleString('en-IN') : <span className="text-slate-300">—</span>}
              </td>
            ))}
            {dept === 'KP – (CRM)' && (() => {
              const totalCalls = totals['Total No. of Calls'] || 0;
              const totalConverted = totals['No. of Converted Calls'] || 0;
              const rate = totalCalls > 0 ? ((totalConverted / totalCalls) * 100).toFixed(1) : null;
              return (
                <td className="px-5 py-4 font-black tabular-nums sticky right-16 bg-slate-50 z-10">
                  {rate !== null
                    ? <span className={`px-2 py-1 rounded-lg text-xs font-black ${parseFloat(rate) >= 50 ? 'bg-emerald-100 text-emerald-700' : parseFloat(rate) >= 25 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'}`}>
                        {rate}%
                      </span>
                    : <span className="text-slate-300">—</span>}
                </td>
              );
            })()}
            <td className="px-5 py-4 text-slate-400 text-xs font-bold sticky right-0 bg-slate-50 z-10">{rows.length} agents</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

// ── Agent Drill-down Modal ────────────────────────────────────────────────────

function AgentDrillModal({ agent, dept, allowedFields, onClose, onEditReport }) {
  const [selectedEntry, setSelectedEntry] = useState(null);
  const role = localStorage.getItem('role');

  const filterData = (data) => {
    if (!allowedFields) return data;
    return Object.fromEntries(Object.entries(data || {}).filter(([k]) => allowedFields.includes(k)));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-slate-900 p-8 text-white flex-shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <span className="bg-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">{dept}</span>
              <h3 className="text-2xl font-black mt-3">{agent.staffName}</h3>
              <p className="text-slate-400 text-sm">{agent.entries.length} {agent.entries.length === 1 ? 'entry' : 'entries'} today</p>
              {allowedFields && (
                <p className="text-slate-500 text-[10px] mt-1">Showing {allowedFields.length} of {(departmentConfig[dept] || []).length} fields</p>
              )}
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white text-xl transition mt-1">✕</button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedEntry ? (
            <div>
              <button onClick={() => setSelectedEntry(null)} className="text-blue-600 font-bold text-sm mb-6 hover:underline">← Back to all entries</button>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                {new Date(selectedEntry.createdAt).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
              <p className="font-black text-slate-900 text-xl mb-2">{selectedEntry.title}</p>
              {selectedEntry.isEdited && (
                <p className="text-[10px] font-bold text-blue-500 mb-6">
                  ✏️ Edited by {selectedEntry.editedBy} · {new Date(selectedEntry.editedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} {new Date(selectedEntry.editedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            <div className="divide-y divide-slate-50">
  {Object.entries(filterData(selectedEntry.data)).map(([key, val]) => (
    <div key={key} className="py-4">
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{key}</p>
      <p className="text-slate-900 font-semibold text-sm leading-relaxed whitespace-pre-wrap break-words">{val || '—'}</p>
    </div>
  ))}
</div>
            </div>
          ) : (
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">All Entries Today</p>
              <div className="space-y-3">
                {agent.entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(entry => (
                  <button key={entry._id} onClick={() => setSelectedEntry(entry)}
                    className="w-full text-left p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 border border-slate-100 hover:border-blue-200 transition group">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-slate-900 group-hover:text-blue-700">{entry.title}</p>
                          {entry.isEdited && (
                            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">✏️ Edited</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(entry.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          {entry.isEdited && ` · Edited by ${entry.editedBy}`}
                        </p>
                      </div>
                      <span className="text-slate-300 group-hover:text-blue-500 font-bold text-lg">→</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex-shrink-0 flex gap-3">
          {selectedEntry && (role === 'manager' || role === 'superadmin') && (
            <button
              onClick={() => { onClose(); onEditReport(selectedEntry); }}
              className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition"
            >
              ✏️ Edit Report
            </button>
          )}
          <button
            onClick={onClose}
            className={`py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition ${selectedEntry && (role === 'manager' || role === 'superadmin') ? 'flex-1' : 'w-full'}`}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [reportTitle, setReportTitle] = useState('');
  const [dynamicData, setDynamicData] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [activeDept, setActiveDept] = useState('');
  const [selectedDay, setSelectedDay] = useState(todayYMD());
  const [editingReport, setEditingReport] = useState(null);
  const [editData, setEditData] = useState({});

  const dept     = localStorage.getItem('dept');
  const role     = localStorage.getItem('role');
  const jobTitle = localStorage.getItem('jobTitle') || '';
  const userName = localStorage.getItem('name') || '';

  let managedDepts = [];
  try { managedDepts = JSON.parse(localStorage.getItem('managedDepts') || '[]'); } catch { managedDepts = []; }

  const navigate = useNavigate();
const isViewer = role === 'superadmin' || role === 'management' || role === 'manager';
const canSeeAdminPanel = role === 'superadmin' || role === 'management';

const viewableDepts = (role === 'superadmin' || role === 'management') ? ALL_DEPTS : managedDepts.map(d => d.dept);

  const getAllowedFields = (deptName) => {
  if (role === 'superadmin' || role === 'management') return null;
    const entry = managedDepts.find(d => d.dept === deptName);
    if (!entry) return [];
    const allForDept = (departmentConfig[deptName] || []).map(f => f.label);
    if (entry.fields.length === allForDept.length) return null;
    return entry.fields;
  };

  useEffect(() => {
    if (isViewer && !activeDept) setActiveDept(viewableDepts[0] || dept || ALL_DEPTS[0]);
    fetchReports();
  }, []);

  const fields = departmentConfig[dept] || [];

  const fetchReports = async () => {
    const res = await fetch('https://reporting-structure.onrender.com/api/reports', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (res.ok) setReports(await res.json());
  };

  const handleCreateReport = async (e) => {
    e.preventDefault();
    const res = await fetch('https://reporting-structure.onrender.com/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ title: reportTitle, data: dynamicData }),
    });
    if (res.ok) { setIsModalOpen(false); setReportTitle(''); setDynamicData({}); fetchReports(); }
  };

  const handleEditReport = async (e) => {
    e.preventDefault();
    const res = await fetch(`https://reporting-structure.onrender.com/api/reports/${editingReport._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ data: editData }),
    });
    if (res.ok) { setEditingReport(null); setEditData({}); fetchReports(); }
  };

const filteredReports = useMemo(() => reports.filter(r => {
  // Staff only see their own reports
  if (role === 'staff' && r.staffName !== userName) return false;
  const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.staffName && r.staffName.toLowerCase().includes(searchQuery.toLowerCase()));
  const matchesDate = !selectedDate || new Date(r.createdAt).toISOString().split('T')[0] === selectedDate;
  return matchesSearch && matchesDate;
}), [reports, searchQuery, selectedDate, role, userName]);  

const roleBadge = {
  superadmin:  { label: 'Super Admin',        bg: 'bg-purple-600' },
  management:  { label: 'Management',         bg: 'bg-rose-600' },
  manager:     { label: jobTitle || 'Manager', bg: 'bg-emerald-600' },
  staff:       { label: dept,                  bg: 'bg-blue-600' },
}[role] || { label: dept, bg: 'bg-blue-600' };

  const currentAllowedFields = getAllowedFields(activeDept);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">

      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-40">
        <h1 className="font-bold text-blue-400">{isViewer ? (jobTitle || 'Reports') : dept} Portal</h1>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-2xl">{isMenuOpen ? '✕' : '☰'}</button>
      </div>

      {/* Sidebar */}
      <div className={`${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-30 w-64 bg-slate-900 text-white min-h-screen p-6 transition-transform duration-300 flex flex-col`}>
        <div className="hidden md:block mb-8 text-center">
          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 ${roleBadge.bg}`}>{roleBadge.label}</span>
          <h1 className="text-lg font-bold text-white">{userName}</h1>
          {role === 'manager' && managedDepts.length > 0 && (
            <p className="text-slate-400 text-[10px] mt-1 leading-relaxed">{managedDepts.map(d => d.dept).join(' · ')}</p>
          )}
        </div>
        <nav className="space-y-2 flex-1">
          <div className="p-3 rounded-xl bg-blue-600 font-semibold shadow-lg text-sm">Dashboard</div>
         {(canSeeAdminPanel || role === 'manager') && (
  <button onClick={() => navigate('/admin')} className="w-full text-left p-3 rounded-xl border border-blue-400/30 text-blue-400 hover:bg-blue-400 hover:text-white transition text-sm">
    {role === 'manager' ? '👥 Manage Agents' : 'Admin Settings'}
  </button>
)}
          {role === 'staff' && (
            <button onClick={() => setIsModalOpen(true)} className="w-full text-left p-3 rounded-xl bg-emerald-600 text-white font-semibold mt-4 hover:bg-emerald-700 transition text-sm">+ New Entry</button>
          )}
        </nav>
        <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="w-full text-left p-3 rounded-xl text-red-400 font-bold hover:text-red-300 transition text-sm">Logout</button>
      </div>

      {/* Main */}
      <div className="flex-1 p-4 md:p-8 overflow-auto">

        {/* ══ MANAGER / SUPERADMIN: Daily View ══ */}
        {isViewer && (
          <>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Daily Report Summary</h2>
                <p className="text-slate-400 text-sm mt-0.5">{formatDateLabel(selectedDay)} · {activeDept}
                  {currentAllowedFields && (
                    <span className="ml-2 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      {currentAllowedFields.length} fields visible
                    </span>
                  )}
                </p>
              </div>

              {/* Day navigator */}
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl shadow-sm px-4 py-2.5">
                <button onClick={() => setSelectedDay(shiftDate(selectedDay, -1))} className="text-slate-400 hover:text-slate-900 font-black px-2 py-1 rounded-lg hover:bg-slate-100 transition text-lg leading-none">‹</button>
                <input type="date" value={selectedDay} max={todayYMD()} onChange={e => setSelectedDay(e.target.value)}
                  className="text-sm font-bold text-slate-700 bg-transparent outline-none cursor-pointer text-center" />
                <button onClick={() => { if (selectedDay < todayYMD()) setSelectedDay(shiftDate(selectedDay, 1)); }}
                  className={`font-black px-2 py-1 rounded-lg transition text-lg leading-none ${selectedDay >= todayYMD() ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'}`}>›</button>
                {selectedDay !== todayYMD() && (
                  <button onClick={() => setSelectedDay(todayYMD())} className="ml-2 text-[10px] font-black uppercase tracking-wider text-blue-600 hover:underline whitespace-nowrap">Today</button>
                )}
              </div>
            </div>

            {/* Dept Tabs */}
            {viewableDepts.length > 1 && (
              <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
                {viewableDepts.map(d => (
                  <button key={d} onClick={() => setActiveDept(d)}
                    className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${activeDept === d ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:border-blue-400'}`}>
                    {d}
                  </button>
                ))}
              </div>
            )}

            {/* Table card */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <span className="text-sm font-black text-slate-900">{activeDept}</span>
                  <span className="text-slate-400 text-xs ml-2">
                    · {new Date(selectedDay + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:block">Click a row to view details →</span>
              </div>
              <DailyTable
                reports={reports}
                dept={activeDept}
                selectedDay={selectedDay}
                allowedFields={currentAllowedFields}
                onRowClick={setSelectedAgent}
              />
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-8 py-3 rounded-2xl shadow-xl hover:bg-blue-700 transition font-bold active:scale-95">+ New Entry</button>
            </div>
          </>
        )}

        {/* ══ STAFF: My Reports ══ */}
        {role === 'staff' && (
          <>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Reports</h2>
                <p className="text-slate-400 text-sm mt-0.5">{dept}</p>
              </div>
              <div className="flex gap-3 items-center w-full lg:w-auto">
                <input type="text" placeholder="Search..." className="px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-medium text-sm flex-1 lg:w-48"
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                <input type="date" className="px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-medium text-sm cursor-pointer"
                  value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                {(searchQuery || selectedDate) && (
                  <button onClick={() => { setSearchQuery(''); setSelectedDate(''); }} className="text-xs text-red-500 font-bold hover:underline whitespace-nowrap">Clear</button>
                )}
                <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-xl hover:bg-blue-700 transition font-bold active:scale-95 whitespace-nowrap">+ New Entry</button>
              </div>
            </div>
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                    <tr><th className="p-5">Subject</th><th className="p-5">Date</th><th className="p-5 text-center">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredReports.map(r => (
                      <tr key={r._id} className="hover:bg-blue-50/30 transition">
                        <td className="p-5 font-bold text-slate-900">{r.title}</td>
                        <td className="p-5 text-slate-500">{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                        <td className="p-5 text-center">
                          <button onClick={() => setSelectedReport(r)} className="bg-slate-100 text-slate-700 px-5 py-2 rounded-xl text-xs font-bold hover:bg-slate-900 hover:text-white transition">View</button>
                        </td>
                      </tr>
                    ))}
                    {filteredReports.length === 0 && <tr><td colSpan="3" className="p-10 text-center text-slate-400 italic">No reports found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

     {/* ── CREATE REPORT MODAL ── */}
{isModalOpen && (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
      <h2 className="text-3xl font-black text-slate-900 mb-8">{dept} Report</h2>
      <form onSubmit={handleCreateReport} className="space-y-6">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Subject / Title</label>
          <input type="text" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
            placeholder="e.g. Daily Report – 20 Apr" value={reportTitle} onChange={e => setReportTitle(e.target.value)} required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map(field => {
            // Report type selector — full width, updates dynamicData
            if (field.type === 'report_selector') {
              return (
                <div key={field.label} className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{field.label}</label>
                  <div className="flex gap-3">
                    {field.options.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setDynamicData({ [field.label]: opt })}
                        className={`flex-1 py-3 rounded-2xl font-bold text-sm border-2 transition ${
                          dynamicData[field.label] === opt
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-blue-400'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              );
            }

            // Skip fields that belong to a different report type
            if (field.reportType && dynamicData['Report Type'] !== field.reportType) return null;

            return (
              <div key={field.label} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 h-28 font-semibold"
                    placeholder="..."
                    onChange={e => setDynamicData({ ...dynamicData, [field.label]: e.target.value })}
                  />
                ) : field.type === 'select' ? (
                  <select
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                    defaultValue=""
                    onChange={e => setDynamicData({ ...dynamicData, [field.label]: e.target.value })}
                  >
                    <option value="" disabled>Select...</option>
                    {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                    placeholder={field.type === 'number' ? '0' : ''}
                    onChange={e => setDynamicData({ ...dynamicData, [field.label]: e.target.value })}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={() => { setIsModalOpen(false); setDynamicData({}); }} className="px-6 py-3 text-slate-400 font-bold">Cancel</button>
          <button type="submit" className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg">Save Entry</button>
        </div>
      </form>
    </div>
  </div>
)}
      {/* ── STAFF VIEW DETAILS MODAL ── */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 p-8 text-white flex-shrink-0">
              <div className="flex justify-between items-start mb-2">
                <span className="bg-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">{selectedReport.department}</span>
                <button onClick={() => setSelectedReport(null)} className="text-slate-500 hover:text-white transition">✕</button>
              </div>
              <h3 className="text-2xl font-black mt-3">{selectedReport.title}</h3>
              <p className="text-slate-400 text-sm mt-1">by <span className="text-blue-400">{selectedReport.staffName}</span></p>
            </div>
          <div className="p-8 overflow-y-auto flex-1 divide-y divide-slate-50">
              {Object.entries(selectedReport.data || {}).map(([key, value]) => (
                <div key={key} className="py-3">
                  <p className="text-slate-400 font-black text-[10px] uppercase tracking-wider mb-1">{key}</p>
                  <p className="text-slate-900 font-semibold text-sm leading-relaxed whitespace-pre-wrap break-words">{value || '—'}</p>
                </div>
              ))}
              <div className="pt-4 flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                <span>Entry Date</span>
                <span>{new Date(selectedReport.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex-shrink-0">
              <button onClick={() => setSelectedReport(null)} className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── AGENT DRILL-DOWN ── */}
      {selectedAgent && (
        <AgentDrillModal
          agent={selectedAgent}
          dept={activeDept}
          allowedFields={currentAllowedFields}
          onClose={() => setSelectedAgent(null)}
          onEditReport={(report) => {
            setEditingReport(report);
            setEditData({ ...report.data });
          }}
        />
      )}

      {/* ── EDIT REPORT MODAL ── */}
      {editingReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-2xl font-black text-slate-900">Edit Report</h2>
              <button onClick={() => setEditingReport(null)} className="text-slate-400 hover:text-slate-700 text-xl">✕</button>
            </div>
            <p className="text-slate-400 text-sm mb-8">
              {editingReport.staffName} · {new Date(editingReport.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <form onSubmit={handleEditReport} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(departmentConfig[editingReport.department] || []).map(field => (
                  <div key={field.label} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea
                        className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 h-28 font-semibold"
                        value={editData[field.label] || ''}
                        onChange={e => setEditData({ ...editData, [field.label]: e.target.value })}
                      />
                    ) : (
                      <input
                        type={field.type}
                        className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                        value={editData[field.label] || ''}
                        onChange={e => setEditData({ ...editData, [field.label]: e.target.value })}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setEditingReport(null)} className="px-6 py-3 text-slate-400 font-bold">Cancel</button>
                <button type="submit" className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition shadow-lg">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}


