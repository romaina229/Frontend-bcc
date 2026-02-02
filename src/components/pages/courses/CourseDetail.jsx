import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetCourseByIdQuery } from '../../services/coursesApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CourseDetail = () => {
  const { id } = useParams();
  const { data: course, isLoading, error } = useGetCourseByIdQuery(id);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-6 text-red-600">Erreur de chargement</div>;

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Image et titre */}
        <div className="relative mb-8">
          <img 
            src={course.image || '/default-course.jpg'} 
            alt={course.titre}
            className="w-full h-96 object-cover rounded-lg"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 rounded-b-lg">
            <h1 className="text-4xl font-bold text-white">{course.titre}</h1>
            <p className="text-gray-200 mt-2">Par {course.instructor?.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-gray-700">{course.description}</p>
              
              {course.description_longue && (
                <div className="mt-4">
                  <h3 className="text-xl font-semibold mb-2">Description détaillée</h3>
                  <div dangerouslySetInnerHTML={{ __html: course.description_longue }} />
                </div>
              )}
            </div>

            {/* Objectifs */}
            {course.objectifs && (
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h2 className="text-2xl font-bold mb-4">Objectifs du cours</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {course.objectifs.map((objectif, index) => (
                    <li key={index}>{objectif}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow sticky top-6">
              <div className="mb-6">
                <span className="text-3xl font-bold">{course.prix} €</span>
                {course.prix_promotion && (
                  <span className="ml-2 text-xl line-through text-gray-500">
                    {course.prix_promotion} €
                  </span>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <span className="font-semibold">Niveau : </span>
                  <span className="capitalize">{course.niveau}</span>
                </div>
                <div>
                  <span className="font-semibold">Durée : </span>
                  <span>{course.duree} heures</span>
                </div>
                <div>
                  <span className="font-semibold">Langue : </span>
                  <span>{course.langue === 'fr' ? 'Français' : 'Anglais'}</span>
                </div>
              </div>

              <Link
                to={`/courses/${id}/player`}
                className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 mb-3"
              >
                Commencer le cours
              </Link>
              
              <button className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50">
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;