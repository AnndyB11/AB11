import React from 'react';
import { APP_LOGO_URL, TEACHER_PROFILE } from '../data/mockData';
import { UserRole } from '../types';

interface HeaderProps {
  currentTab: string;
  activeRole: UserRole;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
  onBack?: () => void;
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  unreadAlertCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  activeRole,
  onOpenNotifications,
  onOpenProfile,
  onBack,
  title,
  subtitle = 'Pase De Lista',
  showBack = false,
  unreadAlertCount = 3,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 pt-safe bg-[#ffffff]/85 backdrop-blur-xl border-b border-[#eaedff] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="max-w-md mx-auto h-16 px-4 flex items-center justify-between">
        {showBack ? (
          <div className="flex items-center gap-2 min-w-0">
            <button
              aria-label="Volver"
              className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full text-[#444651] hover:text-[#131b2e] hover:bg-[#e2e7ff]/60 transition-colors"
              onClick={onBack}
              type="button"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <img
              alt="Seattle App Logo"
              className="h-7 w-auto object-contain flex-shrink-0"
              src={APP_LOGO_URL}
            />
            <h1 className="font-semibold text-[16px] text-[#131b2e] tracking-tight truncate max-w-[210px]">
              {title || 'Detalle De Asistencia'}
            </h1>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <img
              alt="Seattle App Logo"
              className="h-8 w-auto object-contain"
              src={APP_LOGO_URL}
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[17px] text-[#00236f] leading-tight tracking-tight">
                  Seattle App
                </span>
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                  activeRole === 'admin'
                    ? 'bg-[#00236f] text-white'
                    : activeRole === 'teacher'
                    ? 'bg-[#82f5c1] text-[#005137]'
                    : 'bg-[#eaedff] text-[#00236f]'
                }`}>
                  {activeRole === 'admin' ? 'Admin' : activeRole === 'teacher' ? 'Docente' : 'Alumno'}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-[#444651]">
                {currentTab === 'asistencia'
                  ? 'Pase De Lista'
                  : currentTab === 'logistica' || currentTab === 'grupos'
                  ? 'Logística & Clases'
                  : currentTab === 'alertas'
                  ? 'Alertas Y Avisos'
                  : 'Mi Cuenta'}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-1">
          {!showBack && (
            <button
              aria-label="Alertas y Notificaciones"
              className="relative w-11 h-11 flex items-center justify-center rounded-full text-[#444651] hover:text-[#00236f] hover:bg-[#e2e7ff]/60 transition-colors"
              type="button"
              onClick={onOpenNotifications}
            >
              <span className="material-symbols-outlined text-[24px]">notifications</span>
              {unreadAlertCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-white"></span>
              )}
            </button>
          )}

          <button
            aria-label="Perfil Docente"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#e2e7ff]/60 transition-colors p-0.5"
            type="button"
            onClick={onOpenProfile}
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#dce1ff]"
              src={
                activeRole === 'admin'
                  ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                  : activeRole === 'teacher'
                  ? TEACHER_PROFILE.avatarUrl
                  : 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgJ6tq2WJHvrSHuS2bl3mxgfHk-nijkw5ylxFqBCrpjvEyz1IaXxC5oGULBPw24MX3D1p7eB58tWm4Wh-P1lQ_JVzbh57I4ifsXbgQ4zydVCeVz43xhVDzrGB08GwCx-Ez76JuPZlEiYXH0ccb1lC8OrG-GxIyMMTWM5XZdE2-eapnHvNSdaD3N2kTZInwkiLV7BrpjyIWTNTmhf3ZngPqpvuwb-kapxlj45FwKLl719HR4NHKnKOk'
              }
            />
          </button>
        </div>
      </div>
    </header>
  );
};
