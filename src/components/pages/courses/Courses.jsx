import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetCoursesQuery } from '../../services/coursesApi';

const Courses = () => {
  const { data: courses, isLoading, error } = useGetCoursesQuery();

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur lors du chargement</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Cours disponibles</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow overflow-hidden">
            <img 
              src={course.image || '/default-course.jpg'} 
              alt={course.titre}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{course.titre}</h3>
              <p className="text-gray-600 mb-3">{course.description.substring(0, 100)}...</p>
              <div className="flex justify-between items-center">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {course.niveau}
                </span>
                <span className="font-bold">{course.prix} €</span>
              </div>
              <Link 
                to={`/courses/${course.id}`}
                className="block mt-4 text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Voir le cours
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;