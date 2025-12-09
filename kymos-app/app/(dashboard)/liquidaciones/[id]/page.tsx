'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import { Receipt, ArrowLeft, Printer, Check, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Liquidacion {
  id: number;
  nombre: string;
  apellido: string;
  rut: string;
  cargo: string;
  departamento: string;
  fecha_ingreso: string;
  afp: string;
  salud: string;
  periodo_mes: number;
  periodo_anio: number;
  sueldo_base: number;
  gratificacion: number;
  horas_extras: number;
  bonos: number;
  asignacion_colacion: number;
  asignacion_movilizacion: number;
  total_haberes: number;
  afp_monto: number;
  afp_porcentaje: number;
  salud_monto: number;
  salud_porcentaje: number;
  seguro_cesantia: number;
  impuesto_unico: number;
  anticipos: number;
  prestamos: number;
  total_descuentos: number;
  sueldo_liquido: number;
  estado: string;
}

const APP_DEVELOPER = 'ETL Technology';

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const formatMoney = (value: number) => {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value || 0);
};

const formatDate = (date: string) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('es-CL');
};

// Componente de una copia de liquidación
const LiquidacionCopia = ({ liquidacion, tipo }: { liquidacion: Liquidacion; tipo: 'empleador' | 'trabajador' }) => (
  <div className="border border-gray-300 rounded-lg p-4 bg-white">
    {/* Header con gradiente */}
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-t-lg -mx-4 -mt-4 mb-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold">LIQUIDACIÓN DE SUELDO</h2>
          <p className="text-blue-100 text-sm">{meses[liquidacion.periodo_mes - 1]} {liquidacion.periodo_anio}</p>
        </div>
        <div className="text-right">
          <span className="bg-white/20 px-2 py-1 rounded text-xs font-medium uppercase">
            Copia {tipo}
          </span>
        </div>
      </div>
    </div>

    {/* Datos del trabajador */}
    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
      <div>
        <p className="text-gray-500 text-xs">Trabajador</p>
        <p className="font-semibold">{liquidacion.nombre} {liquidacion.apellido}</p>
        <p className="text-gray-600">{liquidacion.rut}</p>
      </div>
      <div className="text-right">
        <p className="text-gray-500 text-xs">Cargo</p>
        <p className="font-medium">{liquidacion.cargo || '-'}</p>
        <p className="text-gray-600 text-xs">{liquidacion.departamento || '-'}</p>
      </div>
    </div>

    {/* Haberes y Descuentos en columnas */}
    <div className="grid grid-cols-2 gap-4 text-xs">
      {/* Haberes */}
      <div className="bg-green-50 p-2 rounded">
        <h4 className="font-semibold text-green-800 mb-2 border-b border-green-200 pb-1">HABERES</h4>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Sueldo Base</span>
            <span>{formatMoney(liquidacion.sueldo_base)}</span>
          </div>
          <div className="flex justify-between">
            <span>Gratificación</span>
            <span>{formatMoney(liquidacion.gratificacion)}</span>
          </div>
          {liquidacion.horas_extras > 0 && (
            <div className="flex justify-between">
              <span>Horas Extras</span>
              <span>{formatMoney(liquidacion.horas_extras)}</span>
            </div>
          )}
          {liquidacion.bonos > 0 && (
            <div className="flex justify-between">
              <span>Bonos</span>
              <span>{formatMoney(liquidacion.bonos)}</span>
            </div>
          )}
          {liquidacion.asignacion_colacion > 0 && (
            <div className="flex justify-between">
              <span>Colación</span>
              <span>{formatMoney(liquidacion.asignacion_colacion)}</span>
            </div>
          )}
          {liquidacion.asignacion_movilizacion > 0 && (
            <div className="flex justify-between">
              <span>Movilización</span>
              <span>{formatMoney(liquidacion.asignacion_movilizacion)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold border-t border-green-300 pt-1 mt-1">
            <span>TOTAL</span>
            <span className="text-green-700">{formatMoney(liquidacion.total_haberes)}</span>
          </div>
        </div>
      </div>

      {/* Descuentos */}
      <div className="bg-red-50 p-2 rounded">
        <h4 className="font-semibold text-red-800 mb-2 border-b border-red-200 pb-1">DESCUENTOS</h4>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>AFP ({liquidacion.afp_porcentaje}%)</span>
            <span>{formatMoney(liquidacion.afp_monto)}</span>
          </div>
          <div className="flex justify-between">
            <span>Salud ({liquidacion.salud_porcentaje}%)</span>
            <span>{formatMoney(liquidacion.salud_monto)}</span>
          </div>
          <div className="flex justify-between">
            <span>Seg. Cesantía</span>
            <span>{formatMoney(liquidacion.seguro_cesantia)}</span>
          </div>
          {liquidacion.impuesto_unico > 0 && (
            <div className="flex justify-between">
              <span>Impuesto</span>
              <span>{formatMoney(liquidacion.impuesto_unico)}</span>
            </div>
          )}
          {liquidacion.anticipos > 0 && (
            <div className="flex justify-between">
              <span>Anticipos</span>
              <span>{formatMoney(liquidacion.anticipos)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold border-t border-red-300 pt-1 mt-1">
            <span>TOTAL</span>
            <span className="text-red-700">{formatMoney(liquidacion.total_descuentos)}</span>
          </div>
        </div>
      </div>
    </div>

    {/* Total Líquido */}
    <div className="bg-blue-600 text-white p-3 rounded mt-4 flex justify-between items-center">
      <span className="font-semibold">LÍQUIDO A PAGAR</span>
      <span className="text-xl font-bold">{formatMoney(liquidacion.sueldo_liquido)}</span>
    </div>

    {/* Firmas */}
    <div className="grid grid-cols-2 gap-4 mt-4 pt-2">
      <div className="text-center">
        <div className="border-t border-gray-400 pt-1 mt-8">
          <p className="text-xs text-gray-600">Firma Empleador</p>
        </div>
      </div>
      <div className="text-center">
        <div className="border-t border-gray-400 pt-1 mt-8">
          <p className="text-xs text-gray-600">Firma Trabajador</p>
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className="text-center mt-2 pt-2 border-t border-dashed border-gray-300">
      <p className="text-[8px] text-gray-400">Desarrollado por {APP_DEVELOPER}</p>
    </div>
  </div>
);

export default function LiquidacionDetallePage() {
  const params = useParams();
  const [liquidacion, setLiquidacion] = useState<Liquidacion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiquidacion = async () => {
      try {
        const res = await fetch(`/api/liquidaciones/${params.id}`);
        const data = await res.json();
        if (data.liquidacion) {
          setLiquidacion(data.liquidacion);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchLiquidacion();
    }
  }, [params.id]);

  const cambiarEstado = async (nuevoEstado: string) => {
    try {
      const res = await fetch(`/api/liquidaciones/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      
      if (res.ok) {
        setLiquidacion(prev => prev ? { ...prev, estado: nuevoEstado } : null);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const imprimir = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!liquidacion) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Liquidación no encontrada</p>
        <Link href="/liquidaciones" className="text-blue-600 hover:underline mt-4 inline-block">
          Volver al listado
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Header y acciones - solo en pantalla */}
      <div className="print:hidden">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/liquidaciones" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <PageHeader
            title={`Liquidación ${meses[liquidacion.periodo_mes - 1]} ${liquidacion.periodo_anio}`}
            description={`${liquidacion.nombre} ${liquidacion.apellido}`}
            icon={Receipt}
          />
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={imprimir}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
          {liquidacion.estado === 'borrador' && (
            <button
              onClick={() => cambiarEstado('emitida')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Check className="w-4 h-4" />
              Emitir
            </button>
          )}
          {liquidacion.estado === 'emitida' && (
            <button
              onClick={() => cambiarEstado('pagada')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Check className="w-4 h-4" />
              Marcar como Pagada
            </button>
          )}
          <span className={`ml-auto inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
            liquidacion.estado === 'borrador' ? 'bg-gray-100 text-gray-700' :
            liquidacion.estado === 'emitida' ? 'bg-blue-100 text-blue-700' :
            liquidacion.estado === 'pagada' ? 'bg-green-100 text-green-700' :
            'bg-red-100 text-red-700'
          }`}>
            {liquidacion.estado.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Documento con doble copia */}
      <div id="liquidacion-print" className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-2">
        <LiquidacionCopia liquidacion={liquidacion} tipo="empleador" />
        <LiquidacionCopia liquidacion={liquidacion} tipo="trabajador" />
      </div>

      {/* Estilos de impresión */}
      <style jsx global>{`
        @media print {
          @page {
            size: letter landscape;
            margin: 10mm;
          }
          body * {
            visibility: hidden;
          }
          #liquidacion-print, #liquidacion-print * {
            visibility: visible;
          }
          #liquidacion-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
