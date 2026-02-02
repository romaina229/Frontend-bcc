import React, { useState } from 'react';
import { useGetAdminStatsQuery } from '../../services/adminApi';
import { useGetUsersQuery } from '../../services/usersApi';
import { useGetCoursesQuery } from '../../services/coursesApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: stats, isLoading: statsLoading } = useGetAdminStatsQuery();
  const { data: users, isLoading: usersLoading } = useGetUsersQuery({ limit: 10 });
  const { data: courses, isLoading: coursesLoading } = useGetCoursesQuery({ limit: 10 });

  if (statsLoading) return <LoadingSpinner fullScreen />;

  // Données pour les graphiques
  const revenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Fév', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Avr', revenue: 4500 },
    { name: 'Mai', revenue: 6000 },
    { name: 'Juin', revenue: 5500 },
  ];

  const categoryData = [
    { name: 'Développement', value: 35 },
    { name: 'Design', value: 20 },
    { name: 'Marketing', value: 15 },
    { name: 'Business', value: 30 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Administration</h1>
        <p className="text-gray-600">Tableau de bord administrateur</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        {['overview', 'users', 'courses', 'analytics'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-medium capitalize ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'overview' ? 'Vue d\'ensemble' : 
             tab === 'users' ? 'Utilisateurs' : 
             tab === 'courses' ? 'Cours' : 
             'Analyses'}
          </button>
        ))}
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Utilisateurs total</p>
          <p className="text-3xl font-bold">{stats?.total_users || 0}</p>
          <p className="text-green-600 text-sm">+12% ce mois</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Cours total</p>
          <p className="text-3xl font-bold">{stats?.total_courses || 0}</p>
          <p className="text-green-600 text-sm">+3 ce mois</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Revenus totaux</p>
          <p className="text-3xl font-bold">{stats?.total_revenue || 0}F CFA</p>
          <p className="text-green-600 text-sm">+18% ce mois</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Certificats délivrés</p>
          <p className="text-3xl font-bold">{stats?.total_certificates || 0}</p>
          <p className="text-green-600 text-sm">+24 ce mois</p>
        </div>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Graphique des revenus */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Revenus mensuels</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" name="Revenus (€)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Répartition par catégorie */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Cours par catégorie</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Utilisateurs récents</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                + Ajouter un utilisateur
              </button>
            </div>
          </div>
          
          {usersLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left">Utilisateur</th>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">Rôle</th>
                    <th className="p-4 text-left">Date d'inscription</th>
                    <th className="p-4 text-left">Statut</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user) => (
                    <tr key={user.id} className="border-t hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            {user.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-gray-600">ID: {user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">{new Date(user.created_at).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status === 'active' ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            Éditer
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold">Cours à modérer</h3>
          </div>
          
          {coursesLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left">Cours</th>
                    <th className="p-4 text-left">Instructeur</th>
                    <th className="p-4 text-left">Catégorie</th>
                    <th className="p-4 text-left">Prix</th>
                    <th className="p-4 text-left">Statut</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses?.map((course) => (
                    <tr key={course.id} className="border-t hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center">
                          <img 
                            src={course.image} 
                            alt={course.titre}
                            className="w-12 h-12 rounded mr-3 object-cover"
                          />
                          <div>
                            <p className="font-semibold">{course.titre}</p>
                            <p className="text-sm text-gray-600">{course.students_count || 0} étudiants</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{course.instructor?.name}</td>
                      <td className="p-4">{course.categorie?.name}</td>
                      <td className="p-4">{course.prix}€</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          course.statut === 'actif' ? 'bg-green-100 text-green-800' :
                          course.statut === 'brouillon' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {course.statut}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            Voir
                          </button>
                          <button className="text-green-600 hover:text-green-800">
                            Approuver
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            Rejeter
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Analyses détaillées</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-4 border rounded">
              <p className="font-semibold mb-2">Taux de conversion</p>
              <p className="text-2xl font-bold">4.2%</p>
            </div>
            <div className="p-4 border rounded">
              <p className="font-semibold mb-2">Taux d'achèvement</p>
              <p className="text-2xl font-bold">68%</p>
            </div>
            <div className="p-4 border rounded">
              <p className="font-semibold mb-2">Satisfaction</p>
              <p className="text-2xl font-bold">4.8/5</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-semibold mb-4">Export des données</h4>
            <div className="flex space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Exporter les utilisateurs
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Exporter les cours
              </button>
              <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                Exporter les transactions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;