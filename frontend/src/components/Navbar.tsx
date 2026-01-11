import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Link2, LogOut, User, Shield, Menu } from 'lucide-react';

export function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <Menu className="w-5 h-5" />
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/categories">Categories</Link>
            </li>
            {isAdmin && (
              <li>
                <Link to="/admin">Admin</Link>
              </li>
            )}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl gap-2">
          <Link2 className="w-6 h-6" />
          Links Dashboard
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/">Dashboard</Link>
          </li>
          <li>
            <Link to="/categories">Categories</Link>
          </li>
          {isAdmin && (
            <li>
              <Link to="/admin" className="text-warning">
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            </li>
          )}
        </ul>
      </div>
      <div className="navbar-end gap-2">
        <ThemeSwitcher />
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-10">
              <span>{user?.name?.charAt(0).toUpperCase()}</span>
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li className="menu-title">
              <span>{user?.name}</span>
              <span className="text-xs opacity-60">{user?.email}</span>
            </li>
            <li>
              <Link to="/profile">
                <User className="w-4 h-4" />
                Profile
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="text-error">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
