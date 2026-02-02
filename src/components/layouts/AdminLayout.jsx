import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminLayout = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    { path: '/admin/dashboard', label: 'Tableau de bord', icon: '📊' },
    { path: '/admin/users', label: 'Utilisateurs', icon: '👥' },
    { path: '/admin/courses', label: 'Cours', icon: '📚' },
    { path: '/admin/orders', label: 'Commandes', icon: '💰' },
    { path: '/admin/certificates', label: 'Certificats', icon: '🏆' },
    { path: '/admin/settings', label: 'Paramètres', icon: '⚙️' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-gray-400 text-sm">BCC Center</p>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 ${
                location.pathname === item.path 
                  ? 'bg-blue-600' 
                  : 'hover:bg-gray-700'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="absolute bottom-0 w-64 p-6 border-t border-gray-700">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm text-gray-400">Administrateur</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;