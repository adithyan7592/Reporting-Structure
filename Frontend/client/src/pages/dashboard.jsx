import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For mobile toggle
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

      {/* Sidebar (Responsive) */}
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
            <p className="text-slate-500 text-sm">Here are the latest reports for {dept}</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition w-full sm:w-auto">
            + New Report
          </button>
        </div>

        {/* Responsive Table / Card View */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-semibold text-slate-700">Report Title</th>
                  <th className="p-4 font-semibold text-slate-700">Date</th>
                  <th className="p-4 font-semibold text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r._id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="p-4 text-slate-800 font-medium">{r.title}</td>
                    <td className="p-4 text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <button className="text-blue-600 hover:underline font-semibold">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}