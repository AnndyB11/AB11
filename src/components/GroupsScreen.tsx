import React, { useState } from 'react';
import { ClassGroup, Teacher, UserRole, Student } from '../types';
import { EditClassAdminModal } from './EditClassAdminModal';
import { ManageClassStudentsModal } from './ManageClassStudentsModal';

interface GroupsScreenProps {
  groups: ClassGroup[];
  activeClass: ClassGroup;
  teachers: Teacher[];
  students: Student[];
  role: UserRole;
  onSelectGroup: (group: ClassGroup) => void;
  onStartAttendance: (group: ClassGroup) => void;
  onUpdateGroup: (group: ClassGroup) => void;
  onAddGroup: (group: ClassGroup) => void;
  onDeleteGroup: (groupId: string) => void;
  onAddStudent: (studentData: Omit<Student, 'id'>) => void;
  onDeleteStudent: (studentId: number) => void;
}

export const GroupsScreen: React.FC<GroupsScreenProps> = ({
  groups,
  activeClass,
  teachers,
  students,
  role,
  onSelectGroup,
  onStartAttendance,
  onUpdateGroup,
  onAddGroup,
  onDeleteGroup,
  onAddStudent,
  onDeleteStudent,
}) => {
  const [editingGroup, setEditingGroup] = useState<ClassGroup | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [managingStudentsGroup, setManagingStudentsGroup] = useState<ClassGroup | null>(null);
  const [deletingLevelGroup, setDeletingLevelGroup] = useState<ClassGroup | null>(null);

  const canEdit = role === 'admin' || role === 'teacher';

  return (
    <div className="flex flex-col w-full px-4 pt-20 pb-36 space-y-3.5 max-w-md mx-auto">
      {/* Modal: Administrar Alumnos del Grupo */}
      {managingStudentsGroup && (
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
              ⚠️ Al dar de baja este nivel finalizado se borrarán los datos de esta clase, los alumnos inscritos en este nivel y todo su registro de asistencia.
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
                  onDeleteGroup(idToDelete);
                }}
                className="px-4 py-2 text-[12px] font-bold bg-[#ba1a1a] hover:bg-[#93000a] text-white rounded-xl shadow-xs transition-colors"
              >
                Sí, Eliminar Nivel y Datos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Class / Schedule Modal */}
      <EditClassAdminModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingGroup(null);
        }}
        classGroup={editingGroup}
        teachers={teachers}
        onSave={(savedGroup) => {
          if (editingGroup) {
            onUpdateGroup(savedGroup);
          } else {
            onAddGroup(savedGroup);
          }
        }}
        onDelete={onDeleteGroup}
      />

      {/* Title & Quick Add CTA */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-bold text-[18px] text-[#00236f]">
            Cursos de Idiomas Asignados
          </span>
          <span className="text-[12px] text-[#444651]">
            Seattle Languages • {groups.length} Secciones Activas
          </span>
        </div>

        {canEdit && (
          <button
            onClick={() => {
              setEditingGroup(null);
              setIsModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-[#00236f] hover:bg-[#1e3a8a] text-white text-[12px] font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>+ Agregar Horario</span>
          </button>
        )}
      </div>

      {/* Class Group Cards */}
      <div className="space-y-3">
        {groups.map((group) => {
          const isActive = group.id === activeClass.id;
          const groupStudents = students.filter((s) => s.classGroupId === group.id);
          const studentCount = groupStudents.length > 0 ? groupStudents.length : group.totalStudents;
          const attendancePercent = studentCount > 0 ? Math.round((group.presentCount / studentCount) * 100) : 100;

          return (
            <div
              key={group.id}
              className={`rounded-2xl p-4 shadow-xs border transition-all ${
                isActive
                  ? 'bg-white border-[#00236f] ring-2 ring-[#00236f]/10 shadow-md'
                  : 'bg-white border-[#eaedff] hover:border-[#dae2fd]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-[#00236f] text-white text-[10px] font-bold">
                      {group.language}
                    </span>
                    <span className="text-[11px] font-semibold text-[#757682]">
                      {group.level}
                    </span>
                    {isActive && (
                      <span className="px-2 py-0.5 rounded-full bg-[#82f5c1] text-[#005137] text-[10px] font-bold">
                        En curso
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-[16px] text-[#131b2e] leading-snug mt-1 truncate">
                    {group.name}
                  </h4>

                  {/* Teacher Concordance Info */}
                  <div className="flex items-center gap-1 text-[12px] font-bold text-[#00236f] mt-1">
                    <span className="material-symbols-outlined text-[15px]">school</span>
                    <span className="truncate">Profesor: {group.teacherName}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-[#131b2e] mt-1 font-semibold">
                    <span className="material-symbols-outlined text-[14px] text-[#006c4a]">
                      alarm
                    </span>
                    <span>{group.schedule}</span>
                  </div>

                  <span className="text-[11px] text-[#444651] mt-0.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">location_on</span>
                    {group.room}
                  </span>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span className="text-[18px] font-bold text-[#006c4a] tabular-nums">
                    {attendancePercent}%
                  </span>
                  <span className="text-[10px] text-[#444651] font-semibold">
                    Asistencia
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#e2e7ff] h-2 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-[#006c4a] h-full rounded-full transition-all duration-500"
                  style={{ width: `${attendancePercent}%` }}
                ></div>
              </div>

              {/* Stats badges */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-[#eaedff] text-center">
                <div className="p-1.5 rounded-lg bg-[#f2f3ff]">
                  <span className="text-[10px] text-[#444651] block">Total Alumnos</span>
                  <span className="text-[14px] font-bold text-[#131b2e] tabular-nums">
                    {studentCount}
                  </span>
                </div>
                <div className="p-1.5 rounded-lg bg-[#85f8c4]/30">
                  <span className="text-[10px] text-[#005137] block">Presentes</span>
                  <span className="text-[14px] font-bold text-[#006c4a] tabular-nums">
                    {group.presentCount}
                  </span>
                </div>
                <div className="p-1.5 rounded-lg bg-[#ffdad6]/60">
                  <span className="text-[10px] text-[#ba1a1a] block">Ausentes</span>
                  <span className="text-[14px] font-bold text-[#ba1a1a] tabular-nums">
                    {group.absentCount}
                  </span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => onStartAttendance(group)}
                  className="flex-1 min-w-[120px] py-2 px-3 rounded-xl bg-[#00236f] hover:bg-[#1e3a8a] text-white text-[12px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                  <span>{isActive ? 'Continuar Pase' : 'Tomar Asistencia'}</span>
                </button>

                {/* Manage students button */}
                <button
                  onClick={() => setManagingStudentsGroup(group)}
                  className="py-2 px-2.5 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#00236f] text-[12px] font-semibold flex items-center gap-1 transition-colors border border-[#dae2fd]"
                  title="Inscribir o borrar alumnos de esta clase"
                >
                  <span className="material-symbols-outlined text-[16px]">groups</span>
                  <span>Alumnos ({studentCount})</span>
                </button>

                {canEdit && (
                  <button
                    onClick={() => {
                      setEditingGroup(group);
                      setIsModalOpen(true);
                    }}
                    className="py-2 px-2.5 rounded-xl bg-[#eaedff] hover:bg-[#dce1ff] text-[#00236f] text-[12px] font-bold flex items-center gap-1 transition-colors"
                    title="Editar nombre, horario y profesor asignado"
                  >
                    <span className="material-symbols-outlined text-[15px]">edit</span>
                    <span>Editar</span>
                  </button>
                )}

                {canEdit && (
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
