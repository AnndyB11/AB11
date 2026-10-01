import React from 'react';
import { UserRole } from '../types';

interface BottomNavProps {
  activeTab: 'asistencia' | 'alertas' | 'grupos' | 'micuenta';
  onChangeTab: (tab: 'asistencia' | 'alertas' | 'grupos' | 'micuenta') => void;
  pendingAlertsCount?: number;
  role?: UserRole;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  pendingAlertsCount = 3,
  role = 'teacher',
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-50 pb-safe bg-[#ffffff]/90 backdrop-blur-xl border-t border-[#eaedff] shadow-[0_-2px_12px_rgba(0,0,0,0.05)]">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-1">
        {/* Asistencia */}
        <button
          aria-current={activeTab === 'asistencia' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[64px] h-12 gap-0.5 transition-colors ${
            activeTab === 'asistencia'
              ? 'text-[#00236f] font-bold'
              : 'text-[#444651] hover:text-[#00236f]'
          }`}
          onClick={() => onChangeTab('asistencia')}
          type="button"
        >
          <span
            className={`material-symbols-outlined text-[24px] ${
              activeTab === 'asistencia' ? 'filled' : ''
            }`}
          >
            check_circle
          </span>
          <span className="text-[11px] font-semibold tracking-tight">
            {role === 'student' ? 'Mi Asistencia' : 'Pase de Lista'}
          </span>
        </button>

        {/* Logística (Admin) / Grupos (Teacher/Student) */}
        <button
          aria-current={activeTab === 'grupos' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[64px] h-12 gap-0.5 transition-colors ${
            activeTab === 'grupos'
              ? 'text-[#00236f] font-bold'
              : 'text-[#444651] hover:text-[#00236f]'
          }`}
          onClick={() => onChangeTab('grupos')}
          type="button"
        >
          <span
            className={`material-symbols-outlined text-[24px] ${
              activeTab === 'grupos' ? 'filled' : ''
            }`}
          >
            {role === 'admin' ? 'hub' : 'school'}
          </span>
          <span className="text-[11px] font-semibold tracking-tight">
            {role === 'admin' ? 'Logística' : 'Cursos'}
          </span>
        </button>

        {/* Alertas */}
        <button
          aria-current={activeTab === 'alertas' ? 'page' : undefined}
          className={`relative flex flex-col items-center justify-center min-w-[64px] h-12 gap-0.5 transition-colors ${
            activeTab === 'alertas'
              ? 'text-[#00236f] font-bold'
              : 'text-[#444651] hover:text-[#00236f]'
          }`}
          onClick={() => onChangeTab('alertas')}
          type="button"
        >
          <div className="relative">
            <span
              className={`material-symbols-outlined text-[24px] ${
                activeTab === 'alertas' ? 'filled' : ''
              }`}
            >
              notification_important
            </span>
            {pendingAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-[16px] text-center rounded-full bg-[#ba1a1a] text-white text-[10px] font-bold">
                {pendingAlertsCount}
              </span>
            )}
          </div>
          <span className="text-[11px] font-semibold tracking-tight">Alertas</span>
        </button>

        {/* Mi Cuenta */}
        <button
          aria-current={activeTab === 'micuenta' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[64px] h-12 gap-0.5 transition-colors ${
            activeTab === 'micuenta'
              ? 'text-[#00236f] font-bold'
              : 'text-[#444651] hover:text-[#00236f]'
          }`}
          onClick={() => onChangeTab('micuenta')}
          type="button"
        >
          <span
            className={`material-symbols-outlined text-[24px] ${
              activeTab === 'micuenta' ? 'filled' : ''
            }`}
          >
            account_circle
          </span>
          <span className="text-[11px] font-semibold tracking-tight">Mi Cuenta</span>
        </button>
      </div>
    </nav>
  );
};
