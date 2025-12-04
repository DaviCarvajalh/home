'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User,
  Building2,
  Calendar,
  Users,
  Key,
  Shield,
  HelpCircle,
  Moon,
  Sun,
  X,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
} from 'lucide-react';

interface UserData {
  nombre: string;
  email: string;
  rol: string;
  empresa: string;
}

interface HeaderProps {
  className?: string;
}

export default function Header({ className = '' }: HeaderProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [empresa, setEmpresa] = useState('Ignisterra S.A.');
  const [periodo, setPeriodo] = useState('Diciembre-2025');
  const [soloActivos, setSoloActivos] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          setEmpresa(data.user.empresa);
        }
      })
      .catch(console.error);
    
    // Cargar preferencia de modo oscuro desde localStorage
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Efecto para aplicar/quitar modo oscuro
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const handlePasswordChange = async () => {
    setPasswordError('');
    
    // Validaciones
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Todos los campos son obligatorios');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setPasswordError(data.error || 'Error al cambiar la contraseña');
        return;
      }
      
      setPasswordSuccess(true);
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }, 2000);
    } catch {
      setPasswordError('Error de conexión');
    }
  };

  const openPasswordModal = () => {
    setShowUserMenu(false);
    setShowPasswordModal(true);
    setPasswordError('');
    setPasswordSuccess(false);
  };

  const confirmLogout = () => {
    setShowUserMenu(false);
    setShowLogoutConfirm(true);
  };

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Solo cerrar si el clic NO fue dentro de un dropdown
      if (!target.closest('[data-dropdown]')) {
        setShowUserMenu(false);
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const empresas = [
    'Ignisterra S.A.',
    'Ignisterra Temuco',
    'Ignisterra Santiago',
  ];

  const periodos = [
    'Diciembre-2025',
    'Noviembre-2025',
    'Octubre-2025',
    'Septiembre-2025',
    'Agosto-2025',
  ];

  const notifications = [
    { id: 1, title: 'Liquidaciones pendientes', desc: '3 liquidaciones por aprobar', time: 'Hace 5 min', unread: true },
    { id: 2, title: 'Contrato por vencer', desc: 'Juan Pérez - 15 días', time: 'Hace 1 hora', unread: true },
    { id: 3, title: 'Vacaciones aprobadas', desc: 'María González', time: 'Hace 2 horas', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className={`bg-white border-b border-gray-200 px-6 py-3 ${className}`}>
      <div className="flex items-center justify-between">
        {/* Left Section - Filters */}
        <div className="flex items-center gap-6">
          {/* Empresa Select */}
          <div className="flex items-center gap-2">
            <Building2 size={18} className="text-gray-400" />
            <div>
              <label className="text-xs text-gray-500 block font-medium">Empresa</label>
              <select
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                className="bg-transparent border-none text-sm font-semibold text-gray-800 focus:outline-none focus:ring-0 cursor-pointer pr-6 -ml-1"
              >
                {empresas.map((emp) => (
                  <option key={emp} value={emp}>{emp}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Divider */}
          <div className="h-10 w-px bg-gray-200" />

          {/* Periodo Select */}
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-gray-400" />
            <div>
              <label className="text-xs text-gray-500 block font-medium">Periodo</label>
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className="bg-transparent border-none text-sm font-semibold text-gray-800 focus:outline-none focus:ring-0 cursor-pointer pr-6 -ml-1"
              >
                {periodos.map((per) => (
                  <option key={per} value={per}>{per}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Divider */}
          <div className="h-10 w-px bg-gray-200" />

          {/* Empleados Activos Toggle */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <Users size={18} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
            <div className="flex items-center gap-2">
              <div
                onClick={() => setSoloActivos(!soloActivos)}
                className={`
                  relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer
                  ${soloActivos ? 'bg-emerald-500' : 'bg-gray-300'}
                `}
              >
                <div
                  className={`
                    absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200
                    ${soloActivos ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </div>
              <span className="text-sm text-gray-600 font-medium">Solo activos</span>
            </div>
          </label>
        </div>

        {/* Right Section - User & Notifications */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative" data-dropdown>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bell size={20} className="text-gray-500" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div
                className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Notificaciones</h3>
                  <button className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
                    Marcar todas como leídas
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 ${
                        notif.unread ? 'bg-emerald-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {notif.unread && (
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                        )}
                        <div className={notif.unread ? '' : 'ml-5'}>
                          <p className="text-sm font-medium text-gray-800">{notif.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{notif.desc}</p>
                          <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                  <button className="w-full text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                    Ver todas las notificaciones
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-10 w-px bg-gray-200" />

          {/* User Menu */}
          <div className="relative" data-dropdown>
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">
                  {user?.nombre?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'US'}
                </span>
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-semibold text-gray-800">{user?.nombre || 'Usuario'}</p>
                <p className="text-xs text-gray-500">{user?.rol || 'Rol'}</p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div
                className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
              >
                {/* User Info Header */}
                <div className="px-4 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white font-bold">
                        {user?.nombre?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'US'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{user?.nombre}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                        <Shield size={10} />
                        {user?.rol}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu Options */}
                <div className="py-2">
                  <p className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Cuenta</p>
                  
                  <button 
                    onClick={() => {
                      setShowUserMenu(false);
                      setShowProfileModal(true);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <User size={18} className="text-gray-400" />
                    <div>
                      <p className="font-medium">Mi perfil</p>
                      <p className="text-xs text-gray-400">Ver y editar información</p>
                    </div>
                  </button>
                  
                  <button 
                    onClick={openPasswordModal}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <Key size={18} className="text-gray-400" />
                    <div>
                      <p className="font-medium">Cambiar contraseña</p>
                      <p className="text-xs text-gray-400">Actualizar credenciales</p>
                    </div>
                  </button>
                </div>

                <div className="py-2 border-t border-gray-100">
                  <p className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Preferencias</p>
                  
                  <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                    <Settings size={18} className="text-gray-400" />
                    <div>
                      <p className="font-medium">Configuración</p>
                      <p className="text-xs text-gray-400">Ajustes del sistema</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setDarkMode(!darkMode)}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {darkMode ? <Moon size={18} className="text-gray-400" /> : <Sun size={18} className="text-gray-400" />}
                      <div>
                        <p className="font-medium">Modo oscuro</p>
                        <p className="text-xs text-gray-400">{darkMode ? 'Activado' : 'Desactivado'}</p>
                      </div>
                    </div>
                    <div className={`w-10 h-5 rounded-full transition-colors ${darkMode ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                      <div className={`w-4 h-4 mt-0.5 bg-white rounded-full shadow transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </div>
                  </button>

                  <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                    <HelpCircle size={18} className="text-gray-400" />
                    <div>
                      <p className="font-medium">Ayuda y soporte</p>
                      <p className="text-xs text-gray-400">Centro de ayuda</p>
                    </div>
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-100 p-2">
                  <button
                    onClick={confirmLogout}
                    className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 rounded-lg transition-colors"
                  >
                    <LogOut size={18} />
                    <div>
                      <p className="font-medium">Cerrar sesión</p>
                      <p className="text-xs text-red-400">Salir de KyMOS</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Cambiar Contraseña */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Key size={20} className="text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Cambiar contraseña</h3>
                  <p className="text-xs text-gray-500">Actualiza tus credenciales de acceso</p>
                </div>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {passwordSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="text-emerald-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800">¡Contraseña actualizada!</h4>
                  <p className="text-sm text-gray-500 mt-1">Tu contraseña ha sido cambiada exitosamente</p>
                </div>
              ) : (
                <>
                  {passwordError && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      <AlertCircle size={18} />
                      {passwordError}
                    </div>
                  )}

                  {/* Contraseña actual */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña actual
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-10"
                        placeholder="Ingresa tu contraseña actual"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Nueva contraseña */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nueva contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-10"
                        placeholder="Mínimo 6 caracteres"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirmar contraseña */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmar nueva contraseña
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Repite la nueva contraseña"
                    />
                  </div>

                  {/* Password strength indicator */}
                  {newPassword && (
                    <div className="space-y-1">
                      <div className="flex gap-1">
                        <div className={`h-1 flex-1 rounded ${newPassword.length >= 2 ? 'bg-red-400' : 'bg-gray-200'}`} />
                        <div className={`h-1 flex-1 rounded ${newPassword.length >= 4 ? 'bg-yellow-400' : 'bg-gray-200'}`} />
                        <div className={`h-1 flex-1 rounded ${newPassword.length >= 6 ? 'bg-emerald-400' : 'bg-gray-200'}`} />
                        <div className={`h-1 flex-1 rounded ${newPassword.length >= 8 ? 'bg-emerald-600' : 'bg-gray-200'}`} />
                      </div>
                      <p className="text-xs text-gray-500">
                        {newPassword.length < 4 ? 'Débil' : newPassword.length < 6 ? 'Regular' : newPassword.length < 8 ? 'Buena' : 'Fuerte'}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            {!passwordSuccess && (
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex gap-3 justify-end">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handlePasswordChange}
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Key size={16} />
                  Cambiar contraseña
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Confirmar Logout */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut size={28} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">¿Cerrar sesión?</h3>
              <p className="text-sm text-gray-500 mt-2">
                Estás a punto de salir de KyMOS. Tendrás que volver a iniciar sesión para acceder.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <LogOut size={16} />
                Sí, cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Mi Perfil */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <User size={20} className="text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Mi perfil</h3>
                  <p className="text-xs text-gray-500">Información de tu cuenta</p>
                </div>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Avatar y nombre */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">
                    {user?.nombre?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'US'}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">{user?.nombre || 'Usuario'}</h4>
                  <span className="inline-flex items-center gap-1 mt-1 px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                    <Shield size={14} />
                    {user?.rol || 'Rol'}
                  </span>
                </div>
              </div>

              {/* Información */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <User size={18} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Nombre completo</p>
                    <p className="text-sm font-semibold text-gray-800">{user?.nombre || 'No disponible'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                      <rect width="20" height="16" x="2" y="4" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Correo electrónico</p>
                    <p className="text-sm font-semibold text-gray-800">{user?.email || 'No disponible'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Building2 size={18} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Empresa</p>
                    <p className="text-sm font-semibold text-gray-800">{user?.empresa || 'No disponible'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Shield size={18} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Rol en el sistema</p>
                    <p className="text-sm font-semibold text-gray-800">{user?.rol || 'No disponible'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex gap-3 justify-end">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  setShowPasswordModal(true);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Key size={16} />
                Cambiar contraseña
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
