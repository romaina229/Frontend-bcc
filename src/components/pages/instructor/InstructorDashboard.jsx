import React from 'react';
import { Link } from 'react-router-dom';
import { useGetInstructorCoursesQuery } from '../../services/instructorApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const InstructorDashboard = () => {
  const { data: courses, isLoading } = useGetInstructorCoursesQuery();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tableau de bord Instructeur</h1>
        <Link
          to="/instructor/courses/create"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          + Créer un cours
        </Link>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Cours publiés</p>
          <p className="text-3xl font-bold">8</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Étudiants</p>
          <p className="text-3xl font-bold">245</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Revenus</p>
          <p className="text-3xl font-bold">2,450€</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Note moyenne</p>
          <p className="text-3xl font-bold">4.8/5</p>
        </div>
      </div>

      {/* Cours */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Mes cours</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Cours</th>
                <th className="p-4 text-left">Statut</th>
                <th className="p-4 text-left">Étudiants</th>
                <th className="p-4 text-left">Revenus</th>
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
                        className="w-12 h-12 rounded mr-4 object-cover"
                      />
                      <div>
                        <p className="font-semibold">{course.titre}</p>
                        <p className="text-sm text-gray-600">{course.categorie?.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      course.statut === 'actif' ? 'bg-green-100 text-green-800' :
                      course.statut === 'brouillon' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {course.statut}
                    </span>
                  </td>
                  <td className="p-4">{course.students_count || 0}</td>
                  <td className="p-4">{course.revenue || 0}F CFA</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <Link
                        to={`/instructor/courses/${course.id}/edit`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Éditer
                      </Link>
                      <Link
                        to={`/instructor/courses/${course.id}/analytics`}
                        className="text-green-600 hover:text-green-800"
                      >
                        Statistiques
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;