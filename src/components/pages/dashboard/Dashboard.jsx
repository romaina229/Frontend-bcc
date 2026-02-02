import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
      <p className="text-lg mb-4">Bienvenue, {user?.name}!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3">Mes cours</h3>
          <p>Accédez à vos cours en ligne</p>
          <Link to="/courses" className="text-blue-600 mt-3 inline-block">
            Voir mes cours →
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3">Quiz</h3>
          <p>Testez vos connaissances</p>
          <Link to="/quiz" className="text-blue-600 mt-3 inline-block">
            Passer un quiz →
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3">Forum</h3>
          <p>Discutez avec la communauté</p>
          <Link to="/forum" className="text-blue-600 mt-3 inline-block">
            Accéder au forum →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;