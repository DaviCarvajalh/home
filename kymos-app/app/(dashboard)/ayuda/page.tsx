import PageHeader from '@/components/ui/PageHeader';
import { HelpCircle, Book, MessageCircle, Phone, Mail, ExternalLink, Calendar, Lock, Unlock, AlertTriangle } from 'lucide-react';

const faqs = [
  {
    pregunta: '¿Cómo genero una liquidación de sueldo?',
    respuesta: 'Primero debe tener un período abierto. Luego ve a Liquidaciones > Nueva Liquidación, selecciona el empleado y el período, luego haz clic en Generar.',
  },
  {
    pregunta: '¿Cómo registro un nuevo empleado?',
    respuesta: 'Ve a Ficha Trabajador > Nuevo Trabajador y completa el formulario con los datos personales y laborales.',
  },
  {
    pregunta: '¿Cómo apruebo una solicitud de vacaciones?',
    respuesta: 'En el módulo de Vacaciones, busca la solicitud pendiente y haz clic en el botón de aprobar (✓).',
  },
  {
    pregunta: '¿Cómo cambio mi contraseña?',
    respuesta: 'Haz clic en tu nombre en la esquina superior derecha y selecciona "Cambiar contraseña".',
  },
];

export default function AyudaPage() {
  return (
    <>
      <PageHeader
        title="Ayuda"
        description="Centro de ayuda y documentación del sistema"
        icon={HelpCircle}
      />

      {/* Guía de Períodos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Gestión de Períodos Mensuales</h3>
              <p className="text-sm text-gray-600">Guía completa para abrir y cerrar períodos</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          {/* Requisitos */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              Requisitos y Privilegios
            </h4>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <ul className="text-sm text-yellow-800 space-y-2">
                <li><strong>Rol requerido:</strong> Administrador o RRHH</li>
                <li><strong>Acceso:</strong> Menú lateral → Períodos</li>
                <li><strong>Importante:</strong> Solo puede haber UN período abierto a la vez</li>
              </ul>
            </div>
          </div>

          {/* Pasos para abrir período */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Unlock className="w-4 h-4 text-green-600" />
              Cómo Abrir un Período
            </h4>
            <ol className="text-sm text-gray-600 space-y-3">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span>Ir al menú <strong>Períodos</strong> en el panel lateral</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span>Hacer clic en el botón <strong>Nuevo Período</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span>Seleccionar el <strong>Mes</strong> y <strong>Año</strong> correspondiente</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                <span>Confirmar haciendo clic en <strong>Abrir Período</strong></span>
              </li>
            </ol>
            <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700">
                <strong>Resultado:</strong> El período quedará abierto y podrá generar liquidaciones para ese mes.
              </p>
            </div>
          </div>

          {/* Pasos para cerrar período */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-orange-600" />
              Cómo Cerrar un Período
            </h4>
            <ol className="text-sm text-gray-600 space-y-3">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span>Verificar que todas las liquidaciones del mes estén <strong>emitidas o pagadas</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span>En la sección del período abierto (verde), hacer clic en <strong>Cerrar Período</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span>El período cambiará a estado <strong>CERRADO</strong> y no se podrán modificar liquidaciones</span>
              </li>
            </ol>
            <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-sm text-orange-700">
                <strong>Nota:</strong> Si necesita hacer correcciones, puede reabrir el período desde el historial.
              </p>
            </div>
          </div>

          {/* Flujo recomendado */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Flujo de Trabajo Recomendado</h4>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">1. Abrir Período</span>
              <span className="text-gray-400">→</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">2. Generar Liquidaciones</span>
              <span className="text-gray-400">→</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">3. Revisar y Emitir</span>
              <span className="text-gray-400">→</span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">4. Pagar</span>
              <span className="text-gray-400">→</span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full">5. Cerrar Período</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQs */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Preguntas Frecuentes</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, index) => (
              <div key={index} className="p-6">
                <h4 className="font-medium text-gray-900 mb-2">{faq.pregunta}</h4>
                <p className="text-sm text-gray-600">{faq.respuesta}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contacto */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Contacto Soporte</h3>
            <div className="space-y-3">
              <a href="mailto:soporte@etltechnology.cl" className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600">
                <Mail className="w-4 h-4" />
                soporte@etltechnology.cl
              </a>
              <a href="tel:+56912345678" className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600">
                <Phone className="w-4 h-4" />
                +56 9 1234 5678
              </a>
              <a href="#" className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600">
                <MessageCircle className="w-4 h-4" />
                Chat en vivo
              </a>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recursos</h3>
            <div className="space-y-3">
              <a href="#" className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600">
                <Book className="w-4 h-4" />
                Manual de Usuario
                <ExternalLink className="w-3 h-3 ml-auto" />
              </a>
              <a href="#" className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600">
                <Book className="w-4 h-4" />
                Guía de Inicio Rápido
                <ExternalLink className="w-3 h-3 ml-auto" />
              </a>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <h3 className="font-semibold mb-2">¿Necesitas ayuda?</h3>
            <p className="text-blue-100 text-sm mb-4">
              Nuestro equipo de soporte está disponible de lunes a viernes de 9:00 a 18:00 hrs.
            </p>
            <button className="w-full px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              Contactar Soporte
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
