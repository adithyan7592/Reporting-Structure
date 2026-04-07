import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null); // For View Details
  const [reportTitle, setReportTitle] = useState('');
  const [dynamicData, setDynamicData] = useState({}); // Stores CRM fields

  const dept = localStorage.getItem('dept');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  // Define fields based on your uploaded CSV structures
  const departmentConfig = {
    'AYUSH': ['Patient Name', 'Phone Number', 'Status', 'Consultation Date', 'Remarks'],
    'KP': ['Lead Name', 'Contact', 'Location', 'Service Type', 'Status'],
    'Media': ['Campaign Name', 'Platform', 'Leads Generated', 'Ad Spend'],
    'Purchase': ['Vendor Name', 'Item Description', 'Quantity', 'Amount', 'Status']
  };

  const fields = departmentConfig[dept] || [];

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
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ 
        title: reportTitle,
        data: dynamicData // Sending the CRM specific fields
      })
    });

    if (res.ok) {
      setIsModalOpen(false);
      setReportTitle('');
      setDynamicData({});
      fetchReports();
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-slate-900 text-white min-h-screen p-6`}>
        <div className="hidden md:block mb-8">
          <h1 className="text-2xl font-bold text-blue-400">{dept} Dept</h1>
          <p className="text-slate-400 text-xs mt-1 text-center">Internal CRM v2.0</p>
        </div>
        <nav className="space-y-4">
          <button className="w-full text-left p-3 rounded bg-blue-600 hover:bg-blue-500 transition shadow-lg">Dashboard</button>
          {role === 'superadmin' && (
            <button onClick={() => navigate('/admin')} className="w-full text-left p-3 rounded border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition">Admin Settings</button>
          )}
          <button onClick={handleLogout} className="w-full text-left p-3 rounded text-red-400 hover:bg-red-900/20 mt-10">Logout</button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Report Log</h2>
            <p className="text-slate-500 text-sm italic">Showing data for {dept} department</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-8 py-3 rounded-xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition w-full sm:w-auto font-bold">+ New Entry</button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-bold text-slate-600 text-xs uppercase tracking-wider">Subject</th>
                  {role === 'superadmin' && <th className="p-4 font-bold text-slate-600 text-xs uppercase tracking-wider">Dept/Staff</th>}
                  <th className="p-4 font-bold text-slate-600 text-xs uppercase tracking-wider">Date</th>
                  <th className="p-4 font-bold text-slate-600 text-xs uppercase tracking-wider text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4"><p className="text-slate-900 font-semibold">{r.title}</p></td>
                    {role === 'superadmin' && (
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-blue-600 uppercase">{r.department}</span>
                          <span className="text-sm text-slate-500">{r.staffName}</span>
                        </div>
                      </td>
                    )}
                    <td className="p-4 text-slate-500 text-sm">{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="p-4 text-center">
                      <button onClick={() => setSelectedReport(r)} className="bg-slate-100 text-slate-700 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition">View Details</button>
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl transition-all border border-white/20">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{dept} Report Entry</h2>
            <p className="text-slate-400 text-sm mb-6 border-b pb-4">Fill in the tracking details from your CRM sheet.</p>
            
            <form onSubmit={handleCreateReport} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">General Title</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="e.g., Weekly Follow-up Summary" value={reportTitle} onChange={(e) => setReportTitle(e.target.value)} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields.map((field) => (
                  <div key={field}>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{field}</label>
                    <input type="text" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder={`Enter ${field}`} onChange={(e) => setDynamicData({...dynamicData, [field]: e.target.value})} />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-slate-400 font-bold hover:text-slate-600">Discard</button>
                <button type="submit" className="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition active:scale-95">Save Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden border border-white/10">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white relative">
              <span className="absolute top-8 right-8 bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase">{selectedReport.department}</span>
              <h3 className="text-2xl font-bold mb-1">{selectedReport.title}</h3>
              <p className="text-blue-100 text-sm opacity-80">Submitted by {selectedReport.staffName}</p>
            </div>
            
            <div className="p-8">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Detailed Information</h4>
                {Object.entries(selectedReport.data || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                    <span className="text-slate-500 font-medium text-sm">{key}</span>
                    <span className="text-slate-900 font-bold text-sm bg-slate-50 px-3 py-1 rounded-lg">{value || 'N/A'}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setSelectedReport(null)} className="w-full mt-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition shadow-lg shadow-slate-200">Close View</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}