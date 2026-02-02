import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetCourseByIdQuery } from '../../services/coursesApi';
import { useGetCourseModulesQuery } from '../../services/modulesApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CoursePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  
  const { data: course, isLoading: courseLoading } = useGetCourseByIdQuery(id);
  const { data: modules, isLoading: modulesLoading } = useGetCourseModulesQuery(id);

  useEffect(() => {
    if (modules && modules.length > 0 && !selectedModule) {
      setSelectedModule(modules[0]);
      if (modules[0].lessons && modules[0].lessons.length > 0) {
        setSelectedLesson(modules[0].lessons[0]);
      }
    }
  }, [modules]);

  if (courseLoading || modulesLoading) return <LoadingSpinner />;

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="w-80 bg-gray-800 overflow-y-auto">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-white font-bold">{course?.titre}</h2>
          <p className="text-gray-400 text-sm">Progression: 25%</p>
        </div>
        
        <div className="p-4">
          {modules?.map((module) => (
            <div key={module.id} className="mb-4">
              <div 
                className="flex justify-between items-center p-3 bg-gray-700 rounded cursor-pointer"
                onClick={() => setSelectedModule(module)}
              >
                <span className="text-white font-semibold">{module.titre}</span>
                <span className="text-gray-400">{module.duree}h</span>
              </div>
              
              {selectedModule?.id === module.id && module.lessons && (
                <div className="mt-2 ml-4 space-y-1">
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`p-2 rounded cursor-pointer ${selectedLesson?.id === lesson.id ? 'bg-blue-900' : 'hover:bg-gray-700'}`}
                      onClick={() => setSelectedLesson(lesson)}
                    >
                      <span className="text-white">{lesson.titre}</span>
                      <span className="text-gray-400 text-sm block">{lesson.duree} min</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Video Player */}
        <div className="flex-1 bg-black relative">
          {selectedLesson?.video_url ? (
            <video 
              src={selectedLesson.video_url}
              controls
              className="w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-gray-400 mb-4">Aucune vidéo disponible</div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                  Marquer comme terminé
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Lesson Content */}
        <div className="h-1/3 bg-gray-800 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">{selectedLesson?.titre}</h3>
            <button 
              onClick={() => navigate(`/courses/${id}`)}
              className="text-gray-400 hover:text-white"
            >
              Retour au cours
            </button>
          </div>
          
          <div className="text-gray-300">
            {selectedLesson?.description || 'Aucune description disponible'}
          </div>
          
          <div className="mt-6 flex justify-between">
            <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600">
              Leçon précédente
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              {selectedLesson?.completed ? 'Revoir' : 'Marquer comme terminé'}
            </button>
            <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600">
              Leçon suivante
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;