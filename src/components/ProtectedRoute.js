import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ adminOnly = false }) => {
  const location = useLocation();
  const { user, role, initialized } = useSelector((state) => state.auth);

  if (!initialized) {
    return null; // Hoặc loading spinner
  }

  if (!user) {
    return <Navigate to="/dang-nhap" state={{ from: location }} replace />;
  }

  if (adminOnly && role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;