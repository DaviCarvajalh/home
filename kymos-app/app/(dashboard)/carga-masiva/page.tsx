'use client';

import { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { Upload, FileSpreadsheet, Users, Clock, Download, AlertCircle, CheckCircle } from 'lucide-react';

const plantillas = [
  { id: 'empleados', nombre: 'Empleados', descripcion: 'Datos personales y laborales', icon: Users },
  { id: 'asistencia', nombre: 'Asistencia', descripcion: 'Registros de entrada y salida', icon: Clock },
  { id: 'liquidaciones', nombre: 'Liquidaciones', descripcion: 'Datos para generar liquidaciones', icon: FileSpreadsheet },
];

export default function CargaMasivaPage() {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [tipoPlantilla, setTipoPlantilla] = useState('empleados');
  const [estado, setEstado] = useState<'idle' | 'procesando' | 'exito' | 'error'>('idle');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArchivo(e.target.files[0]);
      setEstado('idle');
    }
  };

  const handleUpload = async () => {
    if (!archivo) return;
    setEstado('procesando');
    
    // Simular procesamiento
    setTimeout(() => {
      setEstado('exito');
    }, 2000);
  };

  return (
    <>
      <PageHeader
        title="Carga Masiva"
        description="Importación masiva de datos"
        icon={Upload}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Área de carga */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Subir Archivo</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Datos</label>
              <select
                value={tipoPlantilla}
                onChange={(e) => setTipoPlantilla(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {plantillas.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  {archivo ? archivo.name : 'Arrastra un archivo o haz clic para seleccionar'}
                </p>
                <p className="text-sm text-gray-400">Formatos: Excel (.xlsx, .xls) o CSV</p>
              </label>
            </div>

            {archivo && (
              <div className="mt-4 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">{archivo.name}</p>
                    <p className="text-sm text-gray-500">{(archivo.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  onClick={handleUpload}
                  disabled={estado === 'procesando'}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {estado === 'procesando' ? 'Procesando...' : 'Procesar'}
                </button>
              </div>
            )}

            {estado === 'exito' && (
              <div className="mt-4 flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                <CheckCircle className="w-5 h-5" />
                <span>Archivo procesado correctamente</span>
              </div>
            )}

            {estado === 'error' && (
              <div className="mt-4 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="w-5 h-5" />
                <span>Error al procesar el archivo</span>
              </div>
            )}
          </div>
        </div>

        {/* Plantillas */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Descargar Plantillas</h3>
            <div className="space-y-3">
              {plantillas.map((p) => (
                <button
                  key={p.id}
                  className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                >
                  <p.icon className="w-5 h-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{p.nombre}</p>
                    <p className="text-xs text-gray-500">{p.descripcion}</p>
                  </div>
                  <Download className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">Importante</p>
                <p className="text-sm text-yellow-700 mt-1">
                  Asegúrate de usar las plantillas proporcionadas para evitar errores en la importación.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
