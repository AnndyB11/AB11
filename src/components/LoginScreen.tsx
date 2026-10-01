import React, { useState } from 'react';
import { APP_LOGO_URL } from '../data/mockData';
import { UserRole, LanguageName } from '../types';

interface LoginScreenProps {
  onLogin: (role: UserRole, customUserName?: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [identifier, setIdentifier] = useState('admin@seattleapp.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);

  // User creation modal
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('admin');
  const [regLanguage, setRegLanguage] = useState<LanguageName>('Inglés');

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'admin') {
      setIdentifier('admin@seattleapp.edu');
    } else if (role === 'teacher') {
      setIdentifier('ana.martinez@seattleapp.edu');
    } else {
      setIdentifier('2024-ENG-84921');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowRegisterModal(false);
    onLogin(regRole, regName);
  };

  return (
    <div className="flex flex-col relative w-full bg-[#faf8ff] min-h-screen pt-safe pb-safe">
      <div className="flex flex-col w-full px-4 pb-10 max-w-md mx-auto">
        {/* User Creation Modal */}
        {showRegisterModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto border border-[#eaedff]">
              <div className="flex items-center justify-between border-b pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#00236f] text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">person_add</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-[15px] text-[#131b2e]">
                      Crear Usuario en Seattle App
                    </h3>
                    <p className="text-[11px] text-[#444651]">
                      Regístrate como Administrador, Docente o Alumno
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRegisterModal(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[#757682] hover:bg-[#eaedff]"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-[#131b2e]">
                    Nombre y Apellido
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Ej: Lic. Roberto Gómez"
                    className="w-full px-3 py-2 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#00236f] focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-[#131b2e]">
                    Correo Institucional
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="usuario@seattleapp.edu"
                    className="w-full px-3 py-2 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#00236f] focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-[#131b2e]">
                    Rol en el Instituto
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#00236f] focus:outline-none font-semibold text-[#00236f]"
                  >
                    <option value="admin">
                      Administrador (Control total: editar clases, horarios y logística)
                    </option>
                    <option value="teacher">Profesor / Docente de Idiomas</option>
                    <option value="student">Estudiante / Tutor</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-[#131b2e]">
                    Idioma Principal de Interés
                  </label>
                  <select
                    value={regLanguage}
                    onChange={(e) => setRegLanguage(e.target.value as LanguageName)}
                    className="w-full px-3 py-2 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#00236f] focus:outline-none"
                  >
                    <option value="Inglés">Inglés</option>
                    <option value="Portugués">Portugués</option>
                    <option value="Francés">Francés</option>
                    <option value="Ruso">Ruso</option>
                    <option value="Alemán">Alemán</option>
                    <option value="Italiano">Italiano</option>
                  </select>
                </div>

                <div className="p-2.5 rounded-lg bg-[#eaedff] text-[11px] text-[#00236f]">
                  <strong>Privilegios de Administrador:</strong> Al registrarte como Administrador tendrás acceso exclusivo para editar nombres de cursos, programar horarios, vincular profesores y verificar que no existan problemas de logística.
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#00236f] hover:bg-[#1e3a8a] text-white rounded-xl font-bold text-[13px] shadow-sm transition-all"
                >
                  Crear Usuario y Entrar a Seattle App
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mt-3 mb-4">
          <div className="relative mb-2.5 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-[#eaedff] flex items-center justify-center shadow-xs overflow-hidden p-2 ring-1 ring-[#dae2fd]">
              <img
                alt="Seattle App Logo"
                className="w-full h-full object-contain"
                src={APP_LOGO_URL}
              />
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#006c4a] text-white flex items-center justify-center text-[10px] shadow-xs">
              <span className="material-symbols-outlined text-[14px]">verified</span>
            </span>
          </div>

          <h1 className="text-[26px] font-bold text-[#00236f] tracking-tight">
            Seattle App
          </h1>
          <p className="text-[13px] font-semibold text-[#006c4a]">
            Instituto de Idiomas • Control Logístico y Asistencia
          </p>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#444651]">
            <span>Inglés</span> • <span>Portugués</span> • <span>Francés</span> • <span>Ruso</span> • <span>Alemán</span> • <span>Italiano</span>
          </div>
        </div>

        {/* Role Selection Container (Admin / Teacher / Student) */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold text-[#444651] uppercase tracking-wider">
              Selecciona tu perfil de acceso
            </span>
            <span className="text-[11px] font-bold text-[#00236f] flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">verified_user</span> Seguro
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2" id="role-selector-container">
            {/* 1. Admin Role */}
            <div
              className={`cursor-pointer transition-all duration-200 rounded-xl p-3 flex items-start gap-3 relative overflow-hidden border ${
                selectedRole === 'admin'
                  ? 'bg-[#e2e7ff] border-[#00236f] shadow-md'
                  : 'bg-white border-[#eaedff] hover:bg-[#f2f3ff]'
              }`}
              onClick={() => handleRoleChange('admin')}
            >
              {selectedRole === 'admin' && (
                <div className="absolute top-0 right-0 w-7 h-7 bg-[#00236f] rounded-bl-xl flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[15px]">check</span>
                </div>
              )}
              <div className="w-11 h-11 rounded-lg bg-[#00236f] text-white flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
              </div>
              <div className="flex flex-col flex-1 pr-5">
                <div className="flex items-center gap-1.5">
                  <h2 className="font-bold text-[14px] text-[#131b2e]">
                    Soy Administrador / Director
                  </h2>
                  <span className="px-1.5 py-0.2 bg-[#00236f] text-white text-[9px] font-extrabold rounded">
                    CONTROL TOTAL
                  </span>
                </div>
                <p className="text-[11px] text-[#444651] mt-0.5 leading-snug">
                  Editar nombres de clases, asignar profesores a idiomas y auditar logística escolar.
                </p>
              </div>
            </div>

            {/* 2. Teacher Role */}
            <div
              className={`cursor-pointer transition-all duration-200 rounded-xl p-3 flex items-start gap-3 relative overflow-hidden border ${
                selectedRole === 'teacher'
                  ? 'bg-[#e2e7ff] border-[#00236f] shadow-md'
                  : 'bg-white border-[#eaedff] hover:bg-[#f2f3ff]'
              }`}
              onClick={() => handleRoleChange('teacher')}
            >
              {selectedRole === 'teacher' && (
                <div className="absolute top-0 right-0 w-7 h-7 bg-[#00236f] rounded-bl-xl flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[15px]">check</span>
                </div>
              )}
              <div className="w-11 h-11 rounded-lg bg-[#1e3a8a] text-white flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[22px]">co_present</span>
              </div>
              <div className="flex flex-col flex-1 pr-5">
                <div className="flex items-center gap-1.5">
                  <h2 className="font-bold text-[14px] text-[#131b2e]">
                    Soy Profesor / Docente de Idiomas
                  </h2>
                </div>
                <p className="text-[11px] text-[#444651] mt-0.5 leading-snug">
                  Pase de lista y avisos inmediatos a los tutores de mis alumnos asignados.
                </p>
              </div>
            </div>

            {/* 3. Student Role */}
            <div
              className={`cursor-pointer transition-all duration-200 rounded-xl p-3 flex items-start gap-3 relative overflow-hidden border ${
                selectedRole === 'student'
                  ? 'bg-[#e2e7ff] border-[#00236f] shadow-md'
                  : 'bg-white border-[#eaedff] hover:bg-[#f2f3ff]'
              }`}
              onClick={() => handleRoleChange('student')}
            >
              {selectedRole === 'student' && (
                <div className="absolute top-0 right-0 w-7 h-7 bg-[#00236f] rounded-bl-xl flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[15px]">check</span>
                </div>
              )}
              <div className="w-11 h-11 rounded-lg bg-[#dae2fd] text-[#00236f] flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[22px]">backpack</span>
              </div>
              <div className="flex flex-col flex-1 pr-5">
                <div className="flex items-center gap-1.5">
                  <h2 className="font-bold text-[14px] text-[#131b2e]">
                    Soy Estudiante / Tutor
                  </h2>
                </div>
                <p className="text-[11px] text-[#444651] mt-0.5 leading-snug">
                  Seguimiento con mi profesor asignado, justificantes médicos y alertas.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Login Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-3 border border-[#eaedff]"
        >
          {/* Institution Selector */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-[#131b2e] flex items-center justify-between">
              <span>Sede de Idiomas</span>
              <span className="text-[11px] font-semibold text-[#006c4a] flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[13px]">domain_verification</span> Conectado
              </span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-[#444651] flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-[18px]">translate</span>
              </div>
              <select
                aria-label="Sede de Idiomas"
                className="w-full pl-9 pr-9 py-2 rounded-lg bg-[#f2f3ff] text-[#131b2e] text-[13px] font-medium appearance-none focus:outline-none focus:bg-[#eaedff] border border-transparent focus:border-[#00236f]"
              >
                <option value="seattle_central">Seattle Languages - Sede Central</option>
                <option value="seattle_north">Seattle Campus Norte - Laboratorios</option>
                <option value="seattle_virtual">Seattle Virtual / A Distancia</option>
              </select>
              <div className="absolute right-3 text-[#444651] flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-[18px]">unfold_more</span>
              </div>
            </div>
          </div>

          {/* Identifier Input */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-[#131b2e]" id="identifier-label">
              {selectedRole === 'admin'
                ? 'Correo o ID de Administrador'
                : selectedRole === 'teacher'
                ? 'Correo Institucional del Docente'
                : 'Código de Alumno o Teléfono Tutor'}
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-[#444651] flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-[18px]">
                  {selectedRole === 'admin'
                    ? 'shield'
                    : selectedRole === 'teacher'
                    ? 'badge'
                    : 'family_restroom'}
                </span>
              </div>
              <input
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#f2f3ff] text-[#131b2e] placeholder:text-[#444651]/60 text-[13px] focus:outline-none focus:bg-[#eaedff] border border-transparent focus:border-[#00236f] transition-colors"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                type="text"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-[#131b2e]">
              Contraseña de Acceso
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-[#444651] flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-[18px]">lock</span>
              </div>
              <input
                className="w-full pl-9 pr-9 py-2 rounded-lg bg-[#f2f3ff] text-[#131b2e] placeholder:text-[#444651]/60 text-[13px] focus:outline-none focus:bg-[#eaedff] border border-transparent focus:border-[#00236f] transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                required
              />
              <button
                className="absolute right-2 p-1 text-[#444651] hover:text-[#131b2e] focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
                aria-label="Ver u ocultar contraseña"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Remember session & Forgot password */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                checked={rememberSession}
                onChange={(e) => setRememberSession(e.target.checked)}
                className="w-4 h-4 rounded text-[#00236f] accent-[#00236f] cursor-pointer"
                type="checkbox"
              />
              <span className="text-[12px] text-[#131b2e]">Recordar sesión</span>
            </label>
            <button
              type="button"
              onClick={() => alert('Se envió un enlace de recuperación de contraseña')}
              className="text-[12px] text-[#00236f] font-bold hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Primary Action CTAs */}
          <div className="pt-1.5 flex flex-col gap-2">
            <button
              className="w-full py-2.5 px-4 rounded-xl bg-[#00236f] hover:bg-[#1e3a8a] text-white font-bold text-[14px] shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 min-h-[44px]"
              type="submit"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              <span>
                {selectedRole === 'admin'
                  ? 'Entrar como Administrador de Logística'
                  : selectedRole === 'teacher'
                  ? 'Entrar como Profesor de Idiomas'
                  : 'Entrar como Estudiante / Tutor'}
              </span>
            </button>

            <button
              className="w-full py-2 px-4 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] font-semibold text-[12px] border border-[#dae2fd] transition-colors flex items-center justify-center gap-1.5"
              type="button"
              onClick={() => setShowRegisterModal(true)}
            >
              <span className="material-symbols-outlined text-[17px] text-[#00236f]">
                person_add
              </span>
              <span>Crear Mi Usuario en Seattle App</span>
            </button>
          </div>
        </form>

        {/* SSL & Audit Footer */}
        <div className="mt-4 flex flex-col items-center text-center gap-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaedff] text-[#131b2e] text-[11px] font-semibold shadow-xs">
            <span className="material-symbols-outlined text-[14px] text-[#006c4a]">
              verified_user
            </span>
            <span>Seattle App • Cifrado y Auditoría en Tiempo Real</span>
          </div>
          <p className="text-[11px] text-[#444651] max-w-xs">
            Gestión logística integral para Inglés, Francés, Portugués, Ruso, Alemán e Italiano.
          </p>
        </div>
      </div>
    </div>
  );
};
