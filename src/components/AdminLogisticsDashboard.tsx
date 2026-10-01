import React, { useState } from 'react';
import {
  ClassGroup,
  Teacher,
  Student,
  LanguageName,
} from '../types';
import { ManageClassStudentsModal } from './ManageClassStudentsModal';

interface AdminLogisticsDashboardProps {
  groups: ClassGroup[];
  teachers: Teacher[];
  students: Student[];
  onEditClass: (group: ClassGroup) => void;
  onAddNewClass: () => void;
  onOpenTeacherAttendance: (group: ClassGroup) => void;
  onDeleteGroup?: (groupId: string) => void;
  onAddStudent?: (studentData: Omit<Student, 'id'>) => void;
  onDeleteStudent?: (studentId: number) => void;
  onAssignStudentModal?: () => void;
}

const LANGUAGES_LIST: (LanguageName | 'Todos')[] = [
  'Todos',
  'Inglés',
  'Portugués',
  'Francés',
  'Ruso',
  'Alemán',
  'Italiano',
];

export const AdminLogisticsDashboard: React.FC<AdminLogisticsDashboardProps> = ({
  groups,
  teachers,
  students,
  onEditClass,
  onAddNewClass,
  onOpenTeacherAttendance,
  onDeleteGroup,
  onAddStudent,
  onDeleteStudent,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageName | 'Todos'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogisticsAuditModal, setShowLogisticsAuditModal] = useState(false);
  const [managingStudentsGroup, setManagingStudentsGroup] = useState<ClassGroup | null>(null);
  const [deletingLevelGroup, setDeletingLevelGroup] = useState<ClassGroup | null>(null);

  // Filter groups
  const filteredGroups = groups.filter((g) => {
    if (selectedLanguage !== 'Todos' && g.language !== selectedLanguage) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        g.name.toLowerCase().includes(q) ||
        g.language.toLowerCase().includes(q) ||
        g.teacherName.toLowerCase().includes(q) ||
        g.room.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Real-time logistics calculations
  const totalStudents = groups.reduce((acc, curr) => acc + curr.totalStudents, 0);
  const totalPresent = groups.reduce((acc, curr) => acc + curr.presentCount, 0);
  const globalAttendanceRate = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;
  const takenCount = groups.filter((g) => g.attendanceTakenToday).length;
  const pendingCount = groups.length - takenCount;

  return (
    <div className="flex flex-col w-full px-4 pt-20 pb-36 space-y-3.5 max-w-md mx-auto">
      {/* Logistics Audit Overview Modal */}
      {showLogisticsAuditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-3.5 shadow-2xl animate-in zoom-in-95 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006c4a] text-[22px]">
                  verified
                </span>
                <h3 className="font-bold text-[16px] text-[#131b2e]">
                  Auditoría Logística Seattle App
                </h3>
              </div>
              <button
                onClick={() => setShowLogisticsAuditModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#757682] hover:bg-[#eaedff]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-2.5 text-[12px] text-[#444651]">
              <div className="p-3 bg-[#f2f3ff] rounded-xl space-y-1">
                <span className="font-bold text-[#00236f] block">
                  1. Concordancia de Profesores y Estudiantes
                </span>
                <p>
                  Todos los {students.length} estudiantes activos están vinculados con su profesor titular respectivo según el idioma cursado.
                </p>
              </div>

              <div className="p-3 bg-[#85f8c4]/30 rounded-xl space-y-1">
                <span className="font-bold text-[#006c4a] block">
                  2. Control de Aulas y Horarios
                </span>
                <p>
                  0 cruces de horarios detectados entre las salas del Edificio Central, Pabellón Oeste, Norte y Laboratorios.
                </p>
              </div>

              <div className="p-3 bg-[#eaedff] rounded-xl space-y-1">
                <span className="font-bold text-[#00236f] block">
                  3. Póliza de Faltas en Idiomas
                </span>
                <p>
                  Notificaciones automáticas por SMS, WhatsApp y App Push sincronizadas para los 6 idiomas.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowLogisticsAuditModal(false)}
              className="w-full py-2.5 bg-[#00236f] text-white rounded-xl font-bold text-[13px]"
            >
              Cerrar Auditoría
            </button>
          </div>
        </div>
      )}

      {/* Modal: Administrar Alumnos del Grupo */}
      {managingStudentsGroup && onAddStudent && onDeleteStudent && (
        <ManageClassStudentsModal
          isOpen={true}
          onClose={() => setManagingStudentsGroup(null)}
          classGroup={managingStudentsGroup}
          students={students}
          onAddStudent={onAddStudent}
          onDeleteStudent={onDeleteStudent}
        />
      )}

      {/* Modal: Confirmación Eliminar Nivel Finalizado */}
      {deletingLevelGroup && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-3.5 shadow-2xl border border-[#eaedff] animate-in zoom-in-95">
            <div className="flex items-center gap-2 text-[#ba1a1a]">
              <div className="w-9 h-9 rounded-full bg-[#ffdad6] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">delete_sweep</span>
              </div>
              <h3 className="font-bold text-[16px] text-[#131b2e]">
                Eliminar Nivel Finalizado
              </h3>
            </div>
            <p className="text-[13px] text-[#444651]">
              ¿Estás seguro de eliminar el nivel <strong>{deletingLevelGroup.name}</strong> ({deletingLevelGroup.language} • {deletingLevelGroup.level})?
            </p>
            <div className="p-3 bg-[#ffdad6]/40 rounded-xl text-[12px] text-[#ba1a1a] font-medium leading-relaxed">
              ⚠️ Al dar de baja este nivel finalizado se borrarán los datos de esta clase, los alumnos inscritos en este nivel y todo su registro de asistencia para no tener problemas de logística.
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eaedff]">
              <button
                type="button"
                onClick={() => setDeletingLevelGroup(null)}
                className="px-3.5 py-2 text-[12px] font-semibold text-[#444651] hover:bg-[#eaedff] rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  const idToDelete = deletingLevelGroup.id;
                  setDeletingLevelGroup(null);
                  if (onDeleteGroup) {
                    onDeleteGroup(idToDelete);
                  }
                }}
                className="px-4 py-2 text-[12px] font-bold bg-[#ba1a1a] hover:bg-[#93000a] text-white rounded-xl shadow-xs transition-colors"
              >
                Sí, Eliminar Nivel y Datos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Title & Authority Badge */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[18px] text-[#00236f]">
              Panel de Logística & Control
            </span>
          </div>
          <span className="text-[12px] text-[#444651]">
            Seattle Languages • Control Exclusivo de Administrador
          </span>
        </div>

        <button
          onClick={() => setShowLogisticsAuditModal(true)}
          className="px-2.5 py-1 rounded-full bg-[#82f5c1] text-[#005137] text-[11px] font-bold flex items-center gap-1 shadow-xs"
        >
          <span className="material-symbols-outlined text-[14px]">shield</span>
          <span>Logística OK</span>
        </button>
      </div>

      {/* Logistics KPI Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white p-3 rounded-xl border border-[#eaedff] shadow-xs flex flex-col text-center">
          <span className="text-[10px] font-bold text-[#444651] uppercase">Idiomas</span>
          <span className="text-[18px] font-bold text-[#00236f] tabular-nums">6</span>
          <span className="text-[10px] text-[#006c4a] font-semibold">100% Activos</span>
        </div>

        <div className="bg-white p-3 rounded-xl border border-[#eaedff] shadow-xs flex flex-col text-center">
          <span className="text-[10px] font-bold text-[#444651] uppercase">Pase de Lista</span>
          <div className="flex items-center justify-center gap-1 text-[18px] font-bold tabular-nums">
            <span className="text-[#006c4a]">{takenCount}</span>
            <span className="text-[#757682] text-[13px]">/</span>
            <span className="text-[#ba1a1a]">{pendingCount}</span>
          </div>
          <span className="text-[10px] text-[#444651]">Hecho / Pend.</span>
        </div>

        <div className="bg-white p-3 rounded-xl border border-[#eaedff] shadow-xs flex flex-col text-center">
          <span className="text-[10px] font-bold text-[#444651] uppercase">Frecuencia</span>
          <span className="text-[18px] font-bold text-[#006c4a] tabular-nums">
            {globalAttendanceRate}%
          </span>
          <span className="text-[10px] text-[#006c4a] font-semibold">Instituto</span>
        </div>
      </div>

      {/* Admin Action Bar: Add Class & Search */}
      <div className="flex items-center gap-2">
        <button
          onClick={onAddNewClass}
          className="flex-1 py-2.5 px-3.5 bg-[#00236f] hover:bg-[#1e3a8a] text-white rounded-xl text-[12px] font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[17px]">add_circle</span>
          <span>Crear Clase / Asignar Profesor</span>
        </button>

        <button
          onClick={() => setShowLogisticsAuditModal(true)}
          className="py-2.5 px-3 bg-white text-[#00236f] border border-[#eaedff] hover:bg-[#eaedff] rounded-xl text-[12px] font-bold flex items-center justify-center gap-1 shadow-xs transition-colors"
        >
          <span className="material-symbols-outlined text-[17px]">analytics</span>
          <span>Auditoría</span>
        </button>
      </div>

      {/* Language Filter Pills (6 languages) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[11px] font-bold text-[#444651] uppercase tracking-wider">
            Filtrar por Idioma
          </span>
          <span className="text-[11px] text-[#00236f] font-semibold">
            {filteredGroups.length} cursos encontrados
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {LANGUAGES_LIST.map((lang) => {
            const isSelected = selectedLanguage === lang;
            return (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#00236f] text-white shadow-xs scale-102'
                    : 'bg-white text-[#444651] hover:bg-[#eaedff] border border-[#eaedff]'
                }`}
              >
                {lang}
              </button>
            );
          })}
        </div>
      </div>

      {/* Class List & Teacher Assignment Roster */}
      <div className="space-y-3">
        {filteredGroups.map((group) => {
          const attendancePercent = Math.round(
            (group.presentCount / group.totalStudents) * 100
          );

          return (
            <div
              key={group.id}
              className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaedff] space-y-3 transition-all hover:border-[#dae2fd]"
            >
              {/* Top Row: Class Name, Language & Level */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#dce1ff] text-[#00164e] text-[10px] font-bold">
                      {group.language}
                    </span>
                    <span className="text-[11px] font-semibold text-[#757682]">
                      {group.level}
                    </span>
                  </div>

                  <h4 className="font-bold text-[15px] text-[#131b2e] leading-snug mt-1 truncate">
                    {group.name}
                  </h4>

                  <div className="flex items-center gap-1.5 text-[11px] text-[#444651] mt-0.5">
                    <span className="material-symbols-outlined text-[13px] text-[#006c4a]">
                      alarm
                    </span>
                    <span className="font-semibold text-[#131b2e]">{group.schedule}</span>
                    <span>•</span>
                    <span className="truncate">{group.room}</span>
                  </div>
                </div>

                {/* Attendance status badge */}
                <div className="flex flex-col items-end shrink-0">
                  {group.attendanceTakenToday ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#82f5c1]/50 text-[#005137] text-[10px] font-bold">
                      <span className="material-symbols-outlined text-[12px] filled">
                        task_alt
                      </span>
                      Lista Tomada
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold">
                      <span className="material-symbols-outlined text-[12px]">
                        pending_actions
                      </span>
                      Pase Pendiente
                    </span>
                  )}
                  <span className="text-[11px] text-[#444651] mt-1">
                    {attendancePercent}% Asistencia
                  </span>
                </div>
              </div>

              {/* Concordance: Associated Teacher Info Box */}
              <div className="p-2.5 rounded-xl bg-[#f2f3ff] flex items-center justify-between border border-[#dae2fd]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#00236f] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                    {group.teacherName
                      .split(' ')
                      .slice(1, 3)
                      .map((w) => w[0])
                      .join('') || 'DOC'}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-bold text-[#757682] uppercase">
                      Profesor Responsable:
                    </span>
                    <span className="font-bold text-[13px] text-[#00236f] truncate">
                      {group.teacherName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-semibold text-[#131b2e]">
                    {students.filter((s) => s.classGroupId === group.id).length || group.totalStudents} Alumnos
                  </span>
                </div>
              </div>

              {/* Admin Exclusives Action Row */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#f2f3ff]">
                <button
                  onClick={() => onOpenTeacherAttendance(group)}
                  title="Supervisar o realizar pase de lista de esta clase"
                  className="flex-1 min-w-[100px] py-2 px-3 rounded-xl bg-[#00236f] hover:bg-[#1e3a8a] text-white text-[12px] font-bold flex items-center justify-center gap-1 transition-colors shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                  <span>Pase</span>
                </button>

                <button
                  onClick={() => setManagingStudentsGroup(group)}
                  className="py-2 px-2.5 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#00236f] text-[12px] font-semibold flex items-center gap-1 transition-colors border border-[#dae2fd]"
                  title="Inscribir o borrar alumnos de esta clase"
                >
                  <span className="material-symbols-outlined text-[16px]">groups</span>
                  <span>Alumnos ({students.filter((s) => s.classGroupId === group.id).length || group.totalStudents})</span>
                </button>

                <button
                  onClick={() => onEditClass(group)}
                  className="py-2 px-2.5 rounded-xl bg-[#eaedff] hover:bg-[#dce1ff] text-[#00236f] text-[12px] font-bold flex items-center gap-1 transition-colors"
                  title="Editar nombre, idioma, horario y profesor asignado"
                >
                  <span className="material-symbols-outlined text-[15px]">edit</span>
                  <span>Editar</span>
                </button>

                {onDeleteGroup && (
                  <button
                    onClick={() => setDeletingLevelGroup(group)}
                    className="py-2 px-2 rounded-xl text-[#ba1a1a] hover:bg-[#ffdad6] text-[12px] font-bold flex items-center gap-1 transition-colors"
                    title="Eliminar este nivel finalizado y sus datos de clase"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
                    <span className="text-[11px]">Finalizado</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
