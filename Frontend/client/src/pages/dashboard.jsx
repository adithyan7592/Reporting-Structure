import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportTitle, setReportTitle] = useState('');
  const [dynamicData, setDynamicData] = useState({});

  // NEW: State for Filtering Departments (Superadmin only)
  const [activeTab, setActiveTab] = useState('All');

  const dept = localStorage.getItem('dept');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  const allDepts = ['All', 'KP', 'AYUSH', 'Theertha', 'Bioclean', 'Happiness', 'Purchase', 'Media'];

  const departmentConfig = {
    'AYUSH': [
      { label: 'Total No. of Calls', type: 'number' },
      { label: 'No. of Quality Leads', type: 'number' },
      { label: 'No. of Converted Leads', type: 'number' },
      { label: 'No. of Follow-ups', type: 'number' },
      { label: 'Total Sales Value', type: 'number' },
      { label: 'Remarks if Any', type: 'textarea' }
    ],
    'Theertha': [
      { label: 'Total No. of Calls', type: 'number' },
      { label: 'No. of Quality Leads', type: 'number' },
      { label: 'No. of Converted Leads', type: 'number' },
      { label: 'No. of Follow-ups', type: 'number' },
      { label: 'Total Sales Value', type: 'number' },
      { label: 'Remarks if Any', type: 'textarea' }
    ],
    'Bioclean': [
      { label: 'Total No. of Calls', type: 'number' },
      { label: 'No. of Quality Leads', type: 'number' },
      { label: 'No. of Converted Leads', type: 'number' },
      { label: 'No. of Follow-ups', type: 'number' },
      { label: 'Total Sales Value', type: 'number' },
      { label: 'Remarks if Any', type: 'textarea' }
    ],
    'Happiness': [
      { label: 'Customer Name', type: 'text' },
      { label: 'Happiness Rating (1-5)', type: 'number' },
      { label: 'Customer Feedback', type: 'textarea' }
    ],
    'KP': [
      { label: 'Lead Name', type: 'text' },
      { label: 'Contact', type: 'text' },
      { label: 'Location', type: 'text' },
      { label: 'Status', type: 'text' }
    ],
    'Media': [
      { label: 'Campaign Name', type: 'text' },
      { label: 'Leads Generated', type: 'number' },
      { label: 'Ad Spend', type: 'number' },
      { label: 'Notes', type: 'textarea' }
    ],
    'Purchase': [
      { label: 'Vendor Name', type: 'text' },
      { label: 'Item Description', type: 'text' },
      { label: 'Total Amount', type: 'number' },
      { label: 'Payment Status', type: 'text' }
    ]
  };

  const fields = departmentConfig[dept] || [];

  // Logic to filter reports based on the selected Tab
  const filteredReports = activeTab === 'All'
    ? reports
    : reports.filter(r => r.department === activeTab);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/reports', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) setReports(data);
  };

  const handleCreateReport = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ title: reportTitle, data: dynamicData })
    });
    if (res.ok) {
      setIsModalOpen(false);
      setReportTitle('');
      setDynamicData({});
      fetchReports();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">

      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-40">
        <h1 className="font-bold text-blue-400">{dept} Portal</h1>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-2xl">
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-30 w-64 bg-slate-900 text-white min-h-screen p-6 transition-transform duration-300 ease-in-out`}>
        <div className="hidden md:block mb-8 text-center">
          <h1 className="text-2xl font-bold text-blue-400">{dept}</h1>
          <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-1">CRM v2.0</p>
        </div>
        <nav className="space-y-2">
          <button className="w-full text-left p-3 rounded-xl bg-blue-600 font-semibold shadow-lg">Dashboard</button>
          {role === 'superadmin' && (
            <button onClick={() => navigate('/admin')} className="w-full text-left p-3 rounded-xl border border-blue-400/30 text-blue-400 hover:bg-blue-400 hover:text-white transition">Admin Settings</button>
          )}
          <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="w-full text-left p-3 rounded-xl text-red-400 mt-10 font-bold">Logout</button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Report Log</h2>
            <p className="text-slate-500 text-sm">Reviewing {activeTab} submissions</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-8 py-3 rounded-2xl shadow-xl hover:bg-blue-700 transition font-bold">+ New Entry</button>
        </div>

        {/* --- NEW: DEPARTMENT TABS (SUPERADMIN ONLY) --- */}
        {role === 'superadmin' && (
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
            {allDepts.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeTab === tab
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-blue-400'
                  }`}
              >
                {tab}
                <span className="ml-2 opacity-40 text-[10px]">
                  ({tab === 'All' ? reports.length : reports.filter(r => r.department === tab).length})
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Table View */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                <tr>
                  <th className="p-5">Subject</th>
                  {role === 'superadmin' && <th className="p-5">Staff Name</th>}
                  <th className="p-5">Date</th>
                  <th className="p-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((r) => (
                  <tr key={r._id} className="hover:bg-blue-50/30 transition">
                    <td className="p-5 font-bold text-slate-900">{r.title}</td>
                    {role === 'superadmin' && (
                      <td className="p-5 font-semibold text-slate-600">{r.staffName}</td>
                    )}
                    <td className="p-5 text-slate-500">{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="p-5 text-center">
                      <button onClick={() => setSelectedReport(r)} className="bg-slate-100 text-slate-700 px-5 py-2 rounded-xl text-xs font-bold hover:bg-slate-900 hover:text-white transition">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CREATE REPORT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-3xl font-black text-slate-900 mb-8">{dept} Report</h2>
            <form onSubmit={handleCreateReport} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Subject</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold" placeholder="Title" value={reportTitle} onChange={(e) => setReportTitle(e.target.value)} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields.map((field) => (
                  <div key={field.label} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 h-28 font-semibold" placeholder="..." onChange={(e) => setDynamicData({ ...dynamicData, [field.label]: e.target.value })} />
                    ) : (
                      <input type={field.type} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold" placeholder="Enter Value" onChange={(e) => setDynamicData({ ...dynamicData, [field.label]: e.target.value })} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-4 pt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-slate-400 font-bold">Cancel</button>
                <button type="submit" className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition">Save Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="bg-slate-900 p-10 text-white relative">
              <span className="absolute top-10 right-10 bg-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">{selectedReport.department}</span>
              <h3 className="text-3xl font-black mb-1">{selectedReport.title}</h3>
              <p className="text-slate-400 text-sm">Submitted by {selectedReport.staffName}</p>
            </div>
            <div className="p-10">
              <div className="space-y-4">
                {Object.entries(selectedReport.data || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-4 border-b border-slate-50 last:border-0">
                    <span className="text-slate-400 font-bold text-xs uppercase">{key}</span>
                    <span className="text-slate-900 font-black text-sm">{value || '0'}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setSelectedReport(null)} className="w-full mt-10 py-5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition shadow-xl">Close Summary</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}