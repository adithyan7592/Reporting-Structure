import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal State
  const [reportTitle, setReportTitle] = useState(''); // New Report Title
  
  const dept = localStorage.getItem('dept');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

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
      body: JSON.stringify({ title: reportTitle })
    });

    if (res.ok) {
      setIsModalOpen(false);
      setReportTitle('');
      fetchReports(); // Refresh the table
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="font-bold">{dept} Portal</h1>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-slate-900 text-white min-h-screen p-6`}>
        <div className="hidden md:block mb-8">
          <h1 className="text-2xl font-bold text-blue-400">{dept} Dept</h1>
          <p className="text-slate-400 text-xs mt-1">Reporting System v2.0</p>
        </div>

        <nav className="space-y-4">
          <button className="w-full text-left p-3 rounded bg-blue-600 hover:bg-blue-500 transition">Dashboard</button>
          <button className="w-full text-left p-3 rounded hover:bg-slate-800 transition">My Reports</button>
          {role === 'superadmin' && (
            <button 
              onClick={() => navigate('/admin')}
              className="w-full text-left p-3 rounded border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition"
            >
              Admin Settings
            </button>
          )}
          <button onClick={handleLogout} className="w-full text-left p-3 rounded text-red-400 hover:bg-red-900/20 mt-10">Logout</button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-slate-500 text-sm">Viewing reports for {dept}</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition w-full sm:w-auto"
          >
            + New Report
          </button>
        </div>

        {/* Responsive Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-semibold text-slate-700">Report Title</th>
                  {/* ADMIN ONLY COLUMNS */}
                  {role === 'superadmin' && (
                    <>
                      <th className="p-4 font-semibold text-slate-700">Department</th>
                      <th className="p-4 font-semibold text-slate-700">Staff Name</th>
                    </>
                  )}
                  <th className="p-4 font-semibold text-slate-700">Date</th>
                  <th className="p-4 font-semibold text-slate-700 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r._id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="p-4 text-slate-800 font-medium">{r.title}</td>
                    {/* ADMIN ONLY DATA */}
                    {role === 'superadmin' && (
                      <>
                        <td className="p-4">
                          <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded uppercase">
                            {r.department}
                          </span>
                        </td>
                        <td className="p-4 text-slate-600 text-sm">{r.staffName || '---'}</td>
                      </>
                    )}
                    <td className="p-4 text-slate-500 text-sm">
                      {new Date(r.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="p-4 text-center">
                      <button className="text-blue-600 hover:underline font-semibold text-sm">
                        View Details
                      </button>
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Submit New Report</h2>
            <form onSubmit={handleCreateReport}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Report Subject / Title</label>
                <input 
                  type="text" 
                  className="w-full border border-slate-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="e.g., Weekly Social Media Analysis"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md transition"
                >
                  Save Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}