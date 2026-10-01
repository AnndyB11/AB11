import React, { useState } from 'react';
import { UserRole, TeacherAcademicProfile, ClassGroup, Teacher } from '../types';
import { EditAcademicProfileModal } from './EditAcademicProfileModal';
import { EditClassAdminModal } from './EditClassAdminModal';

interface ProfileScreenProps {
  role: UserRole;
  onChangeRole: (newRole: UserRole) => void;
  onLogout: () => void;
  teacherProfile: TeacherAcademicProfile;
  onUpdateTeacherProfile: (profile: TeacherAcademicProfile) => void;
  classGroups: ClassGroup[];
  teachers?: Teacher[];
  onUpdateGroup: (group: ClassGroup) => void;
  onAddGroup: (group: ClassGroup) => void;
  onDeleteGroup: (groupId: string) => void;
  onOpenAdminLogistics?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  role,
  onChangeRole,
  onLogout,
  teacherProfile,
  onUpdateTeacherProfile,
  classGroups,
  teachers,
  onUpdateGroup,
  onAddGroup,
  onDeleteGroup,
  onOpenAdminLogistics,
}) => {
  const [notificationsPush, setNotificationsPush] = useState(true);
  const [notificationsSMS, setNotificationsSMS] = useState(true);
  const [notificationsWhatsApp, setNotificationsWhatsApp] = useState(true);
  const [feedbackSaved, setFeedbackSaved] = useState(false);

  // Modals
  const [isEditingAcademic, setIsEditingAcademic] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ClassGroup | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const handleSaveSettings = () => {
    setFeedbackSaved(true);
    setTimeout(() => setFeedbackSaved(false), 2000);
  };

  const isAdmin = role === 'admin';
  const isTeacher = role === 'teacher';
  const isStudent = role === 'student';

  return (
    <div className="flex flex-col w-full px-4 pt-20 pb-36 space-y-3.5 max-w-md mx-auto">
      {/* Modal for Editing Academic Profile / Type of Education */}
      <EditAcademicProfileModal
        isOpen={isEditingAcademic}
        onClose={() => setIsEditingAcademic(false)}
        profile={teacherProfile}
        onSave={onUpdateTeacherProfile}
      />

      {/* Modal for Editing or Adding Teaching Schedules */}
      <EditClassAdminModal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setEditingGroup(null);
        }}
        classGroup={editingGroup}
        teachers={teachers || []}
        onSave={(savedGroup) => {
          if (editingGroup) {
            onUpdateGroup(savedGroup);
          } else {
            onAddGroup(savedGroup);
          }
        }}
        onDelete={onDeleteGroup}
      />

      {/* User Identity Card */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaedff] flex items-center gap-3.5">
        <div className="relative">
          <img
            alt="Profile Avatar"
            className="w-16 h-16 rounded-full object-cover ring-2 ring-[#00236f]"
            src={
              isAdmin
                ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                : isTeacher
                ? teacherProfile.avatarUrl
                : 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgJ6tq2WJHvrSHuS2bl3mxgfHk-nijkw5ylxFqBCrpjvEyz1IaXxC5oGULBPw24MX3D1p7eB58tWm4Wh-P1lQ_JVzbh57I4ifsXbgQ4zydVCeVz43xhVDzrGB08GwCx-Ez76JuPZlEiYXH0ccb1lC8OrG-GxIyMMTWM5XZdE2-eapnHvNSdaD3N2kTZInwkiLV7BrpjyIWTNTmhf3ZngPqpvuwb-kapxlj45FwKLl719HR4NHKnKOk'
            }
          />
          <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#006c4a] ring-2 ring-white flex items-center justify-center text-white text-[9px]">
            ✓
          </span>
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[17px] text-[#131b2e] truncate">
              {isAdmin
                ? 'Director Académico'
                : isTeacher
                ? teacherProfile.name
                : 'Camila Rodríguez'}
            </span>
          </div>
          <span className="text-[12px] text-[#00236f] font-bold">
            {isAdmin
              ? 'Administrador General & Logística'
              : isTeacher
              ? `${teacherProfile.role} • ${teacherProfile.subject}`
              : 'Estudiante • Inglés B2'}
          </span>
          <span className="text-[11px] text-[#444651] truncate mt-0.5">
            Seattle Languages Institute • Sede Central
          </span>
        </div>
      </div>

      {/* Switch Persona Role Banner (3 Roles Selector) */}
      <div className="bg-[#eaedff] rounded-2xl p-3.5 border border-[#dae2fd] space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00236f] text-[18px]">
              sync_alt
            </span>
            <span className="text-[12px] font-bold text-[#131b2e]">
              Cambiar Rol de Visualización
            </span>
          </div>
          <span className="text-[10px] font-semibold text-[#444651]">
            Prueba todas las vistas
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 pt-0.5">
          <button
            onClick={() => onChangeRole('admin')}
            className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all ${
              role === 'admin'
                ? 'bg-[#00236f] text-white shadow-xs'
                : 'bg-white text-[#444651] hover:bg-[#dce1ff]'
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => onChangeRole('teacher')}
            className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all ${
              role === 'teacher'
                ? 'bg-[#00236f] text-white shadow-xs'
                : 'bg-white text-[#444651] hover:bg-[#dce1ff]'
            }`}
          >
            Docente
          </button>
          <button
            onClick={() => onChangeRole('student')}
            className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all ${
              role === 'student'
                ? 'bg-[#00236f] text-white shadow-xs'
                : 'bg-white text-[#444651] hover:bg-[#dce1ff]'
            }`}
          >
            Estudiante
          </button>
        </div>
      </div>

      {/* ADMIN EXCLUSIVES PANEL */}
      {isAdmin && (
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaedff] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#00236f] text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-[14px] text-[#131b2e]">
                  Privilegios de Administrador
                </h3>
                <span className="text-[11px] text-[#444651]">
                  Gestión logística de clases y profesores
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-[#82f5c1] text-[#005137] text-[10px] font-bold rounded-full">
              Autorizado
            </span>
          </div>

          <p className="text-[12px] text-[#444651] leading-relaxed">
            Eres el único autorizado para nombrar clases, definir los idiomas impartidos (Inglés, Portugués, Francés, Ruso, Alemán, Italiano) y asignar profesores a cada grupo para garantizar la concordancia de datos.
          </p>

          <div className="pt-1 flex flex-col gap-2">
            <button
              onClick={() => {
                if (onOpenAdminLogistics) onOpenAdminLogistics();
              }}
              className="w-full py-2.5 px-3 bg-[#00236f] hover:bg-[#1e3a8a] text-white text-[12px] font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">hub</span>
              <span>Abrir Panel de Logística y Clases</span>
            </button>
          </div>
        </div>
      )}

      {/* TEACHER ONLY: Tipo de Educación & Perfil Académico */}
      {isTeacher && (
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaedff] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#eaedff] text-[#00236f] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">school</span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-[14px] text-[#131b2e]">
                  Especialidad de Idiomas
                </h3>
                <span className="text-[11px] text-[#444651]">
                  Nivel de enseñanza y materias asignadas
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsEditingAcademic(true)}
              className="px-2.5 py-1 rounded-lg bg-[#eaedff] hover:bg-[#dce1ff] text-[#00236f] text-[11px] font-bold flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">edit</span>
              <span>Editar</span>
            </button>
          </div>

          <div className="space-y-2 pt-1 text-[12px]">
            <div className="flex justify-between py-1.5 border-b border-[#f2f3ff]">
              <span className="text-[#444651]">Idiomas que Imparte</span>
              <span className="font-bold text-[#00236f]">
                {teacherProfile.languages ? teacherProfile.languages.join(', ') : 'Inglés, Francés'}
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#f2f3ff]">
              <span className="text-[#444651]">Nivel Lingüístico</span>
              <span className="font-semibold text-[#131b2e]">
                {teacherProfile.educationLevel}
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#f2f3ff]">
              <span className="text-[#444651]">Carga Horaria</span>
              <span className="font-bold text-[#006c4a] tabular-nums">
                {teacherProfile.weeklyHours} horas semanales
              </span>
            </div>
          </div>
        </div>
      )}

      {/* STUDENT ONLY: Teacher Concordance Box */}
      {isStudent && (
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaedff] space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#82f5c1]/50 text-[#005137] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
            <div>
              <h3 className="font-bold text-[14px] text-[#131b2e]">
                Concordancia con Profesor Titular
              </h3>
              <span className="text-[11px] text-[#444651]">
                Datos sincronizados con la administración
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#f2f3ff] space-y-2 text-[12px]">
            <div className="flex justify-between">
              <span className="text-[#444651]">Profesor Titular:</span>
              <span className="font-bold text-[#00236f]">Prof. Ana Martínez</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#444651]">Idioma y Nivel:</span>
              <span className="font-semibold text-[#131b2e]">Inglés B2 Intensivo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#444651]">Aula de Clases:</span>
              <span className="font-semibold text-[#131b2e]">Sala 12 • Edificio Central</span>
            </div>
          </div>
        </div>
      )}

      {/* Institutional Credentials */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-[#eaedff] space-y-3">
        <h3 className="font-bold text-[14px] text-[#131b2e] flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#00236f] text-[18px]">badge</span>
          <span>Credencial Digital Seattle App</span>
        </h3>

        <div className="space-y-2 text-[12px]">
          <div className="flex justify-between py-1 border-b border-[#f2f3ff]">
            <span className="text-[#444651]">ID Oficial</span>
            <span className="font-semibold text-[#131b2e]">
              {isAdmin ? 'ADMIN-SEATTLE-01' : isTeacher ? 'DOC-2024-884' : 'ALU-84921'}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#f2f3ff]">
            <span className="text-[#444651]">Correo Institucional</span>
            <span className="font-semibold text-[#131b2e]">
              {isAdmin ? 'admin@seattleapp.edu' : isTeacher ? teacherProfile.email : 'c.rodriguez@seattleapp.edu'}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-[#444651]">Estado</span>
            <span className="font-bold text-[#006c4a] bg-[#85f8c4]/40 px-2 py-0.5 rounded-full text-[11px]">
              Activo / Certificado
            </span>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-[#eaedff] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[14px] text-[#131b2e] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#00236f] text-[18px]">
              notifications_active
            </span>
            <span>Canales de Despacho Inmediato</span>
          </h3>
          {feedbackSaved && (
            <span className="text-[11px] font-bold text-[#006c4a] animate-in fade-in">
              ¡Guardado!
            </span>
          )}
        </div>

        <div className="space-y-2.5">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#00236f]">
                smartphone
              </span>
              <span className="text-[13px] text-[#131b2e]">Notificaciones Push en App</span>
            </div>
            <input
              type="checkbox"
              checked={notificationsPush}
              onChange={(e) => {
                setNotificationsPush(e.target.checked);
                handleSaveSettings();
              }}
              className="w-4 h-4 rounded text-[#00236f] accent-[#00236f] cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#006c4a]">
                chat
              </span>
              <span className="text-[13px] text-[#131b2e]">Avisos a WhatsApp Familiar</span>
            </div>
            <input
              type="checkbox"
              checked={notificationsWhatsApp}
              onChange={(e) => {
                setNotificationsWhatsApp(e.target.checked);
                handleSaveSettings();
              }}
              className="w-4 h-4 rounded text-[#00236f] accent-[#00236f] cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#006c4a]">
                sms
              </span>
              <span className="text-[13px] text-[#131b2e]">SMS de Urgencia para Faltas</span>
            </div>
            <input
              type="checkbox"
              checked={notificationsSMS}
              onChange={(e) => {
                setNotificationsSMS(e.target.checked);
                handleSaveSettings();
              }}
              className="w-4 h-4 rounded text-[#00236f] accent-[#00236f] cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Logout button */}
      <div className="pt-2">
        <button
          onClick={onLogout}
          className="w-full py-3 px-4 rounded-xl bg-white hover:bg-[#ffdad6]/40 text-[#ba1a1a] font-bold text-[13px] border border-[#ffdad6] flex items-center justify-center gap-2 shadow-xs transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};
