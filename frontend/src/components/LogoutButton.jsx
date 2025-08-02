import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const LogoutButton = ({ className = "", children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className={`text-white hover:text-red-300 transition-colors duration-200 ${className}`}
    >
      {children || 'Logout'}
    </button>
  );
};

export default LogoutButton; 