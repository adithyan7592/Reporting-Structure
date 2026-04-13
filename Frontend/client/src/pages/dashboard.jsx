import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportTitle, setReportTitle] = useState('');
  const [dynamicData, setDynamicData] = useState({});
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // NEW: State for Date Filtering
  const [selectedDate, setSelectedDate] = useState('');
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
      { label: 'No of New Complaints', type: 'number' },
      { label: 'Total No. of Pending Complaints', type: 'number' },
      { label: 'Total No. of Complaints > 6 days', type: 'number' },
      { label: 'No. of complaints solved', type: 'number' },
      { label: 'No of New Positive Reviews', type: 'number' },
      { label: 'No of New Negative Reviews', type: 'number' },
      { label: 'Complaint Resolution Cost', type: 'number' },
      { label: 'Remarks', type: 'textarea' }
    ],
    'KP': [
      { label: 'Total No. of Calls', type: 'number' },
      { label: 'Quality Leads', type: 'number' },
      { label: 'No. of Converted Calls', type: 'text' },
      { label: 'No. of Quotations', type: 'text' },
      { label: 'No. of Followups', type: 'number' },
      { label: 'Factory Outlet Leads', type: 'number' },
      { label: 'Exclusive Outlet Leads', type: 'number' },
      { label: 'Total Sales Value', type: 'number' },
      { label: 'Remarks if Any', type: 'textarea' }
    ],
    'Media': [
      { label: 'Campaign Name', type: 'text' },
      { label: 'Platform', type: 'text' },
      { label: 'Leads Generated', type: 'number' },
      { label: 'Ad Spend', type: 'number' },
      { label: 'Notes', type: 'textarea' }
    ],
    'Purchase': [
      { label: 'No. of PO Placed For F. Outlets', type: 'number' },
      { label: 'Amount of PO F. Outlets', type: 'number' },
      { label: 'No. of PO Placed For E. Outlets', type: 'number' },
      { label: 'Amount of PO E. Outlets', type: 'number' },
      { label: 'No of Total Deliveries', type: 'number' },
      { label: 'No of Total GRN Received', type: 'number' }
    ]
  };

  const fields = departmentConfig[dept] || [];

 // Logic: Combined Filters (Tab + Search Query + Date)
  const filteredReports = reports.filter((r) => {
    const matchesTab = activeTab === 'All' || r.department === activeTab;
    
    const matchesSearch = 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (r.staffName && r.staffName.toLowerCase().includes(searchQuery.toLowerCase()));

   // Date Logic: Compare YYYY-MM-DD strings
    const reportDate = new Date(r.createdAt).toISOString().split('T')[0];
    const matchesDate = !selectedDate || reportDate === selectedDate;
    
    return matchesTab && matchesSearch && matchesDate;
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('https://reporting-structure.onrender.com/api/reports', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) setReports(data);
  };

  const handleCreateReport = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch('https://reporting-structure.onrender.com/api/reports', {
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
        {/* Header Section with Search & Date */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Report Log</h2>
            {/* <p className="text-slate-500 text-sm italic">Filtering: {activeTab} | {selectedDate || 'All Dates'}</p> */}
          </div>
          
          <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
            {role === 'superadmin' && (
              <>
                {/* Search Input */}
                <input 
                  type="text" 
                  placeholder="Search staff..." 
                  className="px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-medium text-sm transition-all sm:w-60"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                /> 
                {/* Date Picker */}
                <input 
                  type="date" 
                  className="px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-medium text-sm transition-all cursor-pointer"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
                {/* Clear Filters Button */}
                { (searchQuery || selectedDate) && (
                   <button 
                    onClick={() => {setSearchQuery(''); setSelectedDate('');}}
                    className="text-xs text-red-500 font-bold hover:underline"
                   >
                    Clear Filters
                   </button>
                )}
              </>
            )}
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-8 py-3 rounded-2xl shadow-xl hover:bg-blue-700 transition font-bold active:scale-95 whitespace-nowrap">+ New Entry</button>
          </div>
        </div>

        {/* --- DEPARTMENT TABS --- */}
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
                {filteredReports.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-slate-400 italic">No reports found for this selection.</td>
                  </tr>
                )}
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
  <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 z-50">
    <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-white/10 max-h-[90vh] flex flex-col transition-all animate-in fade-in zoom-in duration-200">
      
      {/* FIXED HEADER: Stays at the top while you scroll the data */}
      <div className="bg-slate-900 p-8 sm:p-10 text-white relative flex-shrink-0">
        <div className="flex justify-between items-start mb-2">
          <span className="bg-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
            {selectedReport.department}
          </span>
          {/* Top Close Icon for quick exit */}
          <button 
            onClick={() => setSelectedReport(null)}
            className="text-slate-500 hover:text-white transition"
          >
            ✕
          </button>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black leading-tight mb-1">
          {selectedReport.title}
        </h3>
        <p className="text-slate-400 text-xs sm:text-sm font-medium">
          Submitted by <span className="text-blue-400">{selectedReport.staffName}</span>
        </p>
      </div>
      
      {/* SCROLLABLE BODY: Handles departments*/}
      <div className="p-8 sm:p-10 overflow-y-auto flex-1 custom-scrollbar">
        <div className="space-y-5">
          {/* <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4 border-b border-slate-50 pb-2">
            Detailed Metrics
          </h4>
           */}
          {Object.entries(selectedReport.data || {}).map(([key, value]) => (
            <div key={key} className="group flex flex-col gap-1 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 px-2 -mx-2 rounded-xl transition">
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                {key}
              </span>
              <span className="text-slate-900 font-black text-sm sm:text-base break-words">
                {value || '0'}
              </span>
            </div>
          ))}
          
          {/* Metadata section */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>Entry Date</span>
            <span>{new Date(selectedReport.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* FIXED FOOTER: The Close button is always visible */}
      <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-100 flex-shrink-0">
        <button 
          onClick={() => setSelectedReport(null)} 
          className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition shadow-xl shadow-blue-600/20 active:scale-95 text-sm uppercase tracking-widest"
        >
          Close Summary
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}