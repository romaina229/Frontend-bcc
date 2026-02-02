import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '.././store/slices/authSlice';
import LoadingSpinner from '.././common/LoadingSpinner';

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              BCC Center
            </Link>
            
            <div className="flex items-center space-x-6">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="hover:text-blue-600">
                    Tableau de bord
                  </Link>
                  <Link to="/courses" className="hover:text-blue-600">
                    Cours
                  </Link>
                  <Link to="/quiz" className="hover:text-blue-600">
                    Quiz
                  </Link>
                  <Link to="/forum" className="hover:text-blue-600">
                    Forum
                  </Link>
                  
                  <div className="relative group">
                    <button className="flex items-center space-x-2 hover:text-blue-600">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                      <span>{user?.name || 'Utilisateur'}</span>
                    </button>
                    
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg hidden group-hover:block z-50">
                      <div className="py-2">
                        <Link 
                          to="/profile" 
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          Mon profil
                        </Link>
                        {user?.role === 'admin' && (
                          <Link 
                            to="/admin/dashboard" 
                            className="block px-4 py-2 hover:bg-gray-100"
                          >
                            Administration
                          </Link>
                        )}
                        <hr className="my-2" />
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                        >
                          Déconnexion
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-blue-600">
                    Connexion
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">BCC Center</h3>
              <p className="text-gray-400">
                Plateforme d'apprentissage en ligne pour le développement professionnel.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2">
                <li><Link to="/courses" className="text-gray-400 hover:text-white">Cours</Link></li>
                <li><Link to="/quiz" className="text-gray-400 hover:text-white">Quiz</Link></li>
                <li><Link to="/forum" className="text-gray-400 hover:text-white">Forum</Link></li>
                <li><Link to="/certificates" className="text-gray-400 hover:text-white">Certificats</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-400 hover:text-white">Confidentialité</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-white">Conditions</Link></li>
                <li><Link to="/cookies" className="text-gray-400 hover:text-white">Cookies</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">boostagecenter@gmail.com</p>
              <p className="text-gray-400">+229 01 44 47 43 44</p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} BCC Center. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;