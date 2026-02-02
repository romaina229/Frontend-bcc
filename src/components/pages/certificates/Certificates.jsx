import React from 'react';
import { useGetCertificatesQuery } from '../../services/certificatesApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Certificates = () => {
  const { data: certificates, isLoading } = useGetCertificatesQuery();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Mes certificats</h1>
      
      {certificates?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="text-gray-400 text-5xl mb-4">📜</div>
          <h3 className="text-xl font-semibold mb-2">Aucun certificat</h3>
          <p className="text-gray-600 mb-4">
            Vous n'avez pas encore obtenu de certificats
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Parcourir les cours
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates?.map((cert) => (
            <div key={cert.id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
              <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <h3 className="text-xl font-bold">{cert.course?.titre}</h3>
                <p className="opacity-90">Certificat de réussite</p>
              </div>
              
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div>
                    <p className="font-semibold">Délivré à</p>
                    <p>{cert.user?.name}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date d'obtention:</span>
                    <span className="font-semibold">{new Date(cert.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Score:</span>
                    <span className="font-semibold">{cert.score}%</span>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    Télécharger
                  </button>
                  <button className="flex-1 border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50">
                    Partager
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certificates;