import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import AdminUserMgmt from './pages/AdminUserMgmt'; 

function App() {
  // Function to check current auth status
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    return { isAuth: !!token, role };
  };

  const auth = checkAuth();

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard: Available to any authenticated user */}
        <Route 
          path="/dashboard" 
          element={checkAuth().isAuth ? <Dashboard /> : <Navigate to="/login" />} 
        />

        {/* Admin: Strictly for Superadmins */}
        <Route 
          path="/admin" 
          element={
            checkAuth().isAuth && checkAuth().role === 'superadmin' 
              ? <AdminUserMgmt /> 
              : <Navigate to="/dashboard" />
          } 
        />

        {/* Default Landing */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Catch-all to prevent 404s */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;