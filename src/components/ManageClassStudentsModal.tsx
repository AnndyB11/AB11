import React, { useState } from 'react';
import { ClassGroup, Student } from '../types';
import { AddStudentModal } from './AddStudentModal';

interface ManageClassStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  classGroup: ClassGroup;
  students: Student[];
  onAddStudent: (studentData: Omit<Student, 'id'>) => void;
  onDeleteStudent: (studentId: number) => void;
}

export const ManageClassStudentsModal: React.FC<ManageClassStudentsModalProps> = ({
  isOpen,
  onClose,
  classGroup,
  students,
  onAddStudent,
  onDeleteStudent,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  // Filter students belonging to this class
  const classStudents = students.filter(
    (s) => s.classGroupId === classGroup.id || (!s.classGroupId && classGroup.id === 'ENG-3B')
  );

  const filteredStudents = classStudents.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q);
  });

  return (
    <>
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        classGroup={classGroup}
        onAddStudent={onAddStudent}
        currentStudentCount={classStudents.length}
      />

      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl p-5 max-w-md w-full space-y-3.5 shadow-2xl animate-in zoom-in-95 max-h-[90vh] flex flex-col border border-[#eaedff]">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-3 border-[#eaedff]">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#00236f] text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">groups</span>
              </div>
              <div className="flex flex-col min-w-0">
                <h3 className="font-bold text-[15px] text-[#131b2e] truncate">
                  Alumnos Inscritos ({classStudents.length})
                </h3>
                <span className="text-[11px] text-[#444651] truncate">
                  {classGroup.name} • Prof. {classGroup.teacherName}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#757682] hover:bg-[#eaedff]"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Quick Actions & Search */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-[18px] text-[#757682]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar alumno en este curso..."
                className="w-full pl-8 pr-3 py-1.5 text-[12px] bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#00236f] focus:outline-none"
              />
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-[#00236f] hover:bg-[#1e3a8a] text-white text-[12px] font-bold flex items-center gap-1 shadow-xs transition-colors shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">person_add</span>
              <span>Inscribir</span>
            </button>
          </div>

          {/* List of enrolled students */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[220px]">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8 text-[#757682] space-y-2">
                <span className="material-symbols-outlined text-[36px]">person_off</span>
                <p className="text-[13px] font-semibold text-[#131b2e]">
                  No hay alumnos encontrados en este curso
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-3 py-1 bg-[#eaedff] text-[#00236f] text-[11px] font-bold rounded-lg"
                >
                  + Agregar primer estudiante
                </button>
              </div>
            ) : (
              filteredStudents.map((st) => (
                <div
                  key={st.id}
                  className="p-2.5 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff]/60 border border-[#dae2fd] flex items-center justify-between gap-2 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={st.avatarUrl}
                      alt={st.name}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-white shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-[13px] text-[#131b2e] truncate">
                        {st.name}
                      </span>
                      <span className="text-[11px] text-[#444651]">
                        {st.rollNo} • {st.studentId}
                      </span>
                      {st.contacts?.mother && (
                        <span className="text-[10px] text-[#006c4a] truncate">
                          Tutor: {st.contacts.mother}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (
                        confirm(
                          `¿Estás seguro de eliminar a ${st.name} de la clase de ${classGroup.name}? Se borrarán sus datos de asistencia de este curso.`
                        )
                      ) {
                        onDeleteStudent(st.id);
                      }
                    }}
                    title="Eliminar estudiante de esta clase"
                    className="p-1.5 rounded-lg text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">person_remove</span>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer note */}
          <div className="pt-2 border-t border-[#eaedff] flex items-center justify-between text-[11px] text-[#444651]">
            <span>Total inscritos: {classStudents.length} alumnos</span>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-[#eaedff] hover:bg-[#dce1ff] text-[#00236f] font-bold rounded-lg"
            >
              Listo
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
