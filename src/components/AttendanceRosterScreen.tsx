import React, { useState } from 'react';
import { Student, ClassGroup, AttendanceStatus, UserRole } from '../types';
import { AddStudentModal } from './AddStudentModal';
import { ManageClassStudentsModal } from './ManageClassStudentsModal';

interface AttendanceRosterScreenProps {
  students: Student[];
  onUpdateStatus: (studentId: number, newStatus: AttendanceStatus) => void;
  onMarkAllPresent: () => void;
  onSelectStudent: (student: Student) => void;
  onSaveAndSendAlerts: () => void;
  onSaveDraft: () => void;
  currentClass: ClassGroup;
  onChangeClass: (cls: ClassGroup) => void;
  availableClasses: ClassGroup[];
  onEditCurrentClass?: () => void;
  onAddStudent: (studentData: Omit<Student, 'id'>) => void;
  onDeleteStudent: (studentId: number) => void;
  onDeleteFinishedLevel?: (classId: string) => void;
  onAddNewClass?: () => void;
  role?: UserRole;
}

export const AttendanceRosterScreen: React.FC<AttendanceRosterScreenProps> = ({
  students,
  onUpdateStatus,
  onMarkAllPresent,
  onSelectStudent,
  onSaveAndSendAlerts,
  onSaveDraft,
  currentClass,
  onChangeClass,
  availableClasses,
  onEditCurrentClass,
  onAddStudent,
  onDeleteStudent,
  onDeleteFinishedLevel,
  onAddNewClass,
  role = 'teacher',
}) => {
  const [filter, setFilter] = useState<'ALL' | AttendanceStatus>('ALL');
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Student management modals state
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isManageStudentsModalOpen, setIsManageStudentsModalOpen] = useState(false);
  const [showDeleteLevelConfirm, setShowDeleteLevelConfirm] = useState(false);

  // Filter students enrolled specifically in currentClass
  const classStudents = students.filter(
    (s) => s.classGroupId === currentClass.id || (!s.classGroupId && currentClass.id === 'ENG-3B')
  );

  // Live metrics calculation for currentClass
  const totalCount = classStudents.length;
  const presentCount = classStudents.filter((s) => s.status === 'P').length;
  const absentCount = classStudents.filter((s) => s.status === 'A').length;
  const lateCount = classStudents.filter((s) => s.status === 'T').length;
  const justifiedCount = classStudents.filter((s) => s.status === 'J').length;

  const filteredStudents = classStudents.filter((s) => {
    if (filter !== 'ALL' && s.status !== filter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSaveClick = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      onSaveAndSendAlerts();
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full px-4 pt-20 pb-44 space-y-3.5 max-w-md mx-auto">
      {/* Modal: Inscribir Alumno a esta clase */}
      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
        classGroup={currentClass}
        onAddStudent={onAddStudent}
        currentStudentCount={classStudents.length}
      />

      {/* Modal: Administrar Alumnos (Inscribir / Borrar alumnos de la clase) */}
      <ManageClassStudentsModal
        isOpen={isManageStudentsModalOpen}
        onClose={() => setIsManageStudentsModalOpen(false)}
        classGroup={currentClass}
        students={students}
        onAddStudent={onAddStudent}
        onDeleteStudent={onDeleteStudent}
      />

      {/* Modal: Confirmación Eliminar Nivel Finalizado */}
      {showDeleteLevelConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-3.5 shadow-2xl border border-[#eaedff] animate-in zoom-in-95">
            <div className="flex items-center gap-2 text-[#ba1a1a]">
              <div className="w-9 h-9 rounded-full bg-[#ffdad6] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">delete_forever</span>
              </div>
              <h3 className="font-bold text-[16px] text-[#131b2e]">
                Eliminar Nivel Finalizado
              </h3>
            </div>
            <p className="text-[13px] text-[#444651]">
              ¿Estás seguro de eliminar el nivel <strong>{currentClass.name}</strong> ({currentClass.language} • {currentClass.level})?
            </p>
            <div className="p-3 bg-[#ffdad6]/40 rounded-xl text-[12px] text-[#ba1a1a] font-medium leading-relaxed">
              ⚠️ Al eliminar este nivel finalizado se borrarán por completo los datos de esta clase, los {classStudents.length} alumnos inscritos en este nivel y su registro de asistencia.
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eaedff]">
              <button
                type="button"
                onClick={() => setShowDeleteLevelConfirm(false)}
                className="px-3.5 py-2 text-[12px] font-semibold text-[#444651] hover:bg-[#eaedff] rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteLevelConfirm(false);
                  if (onDeleteFinishedLevel) {
                    onDeleteFinishedLevel(currentClass.id);
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

      {/* Toast Notification */}
      {saveSuccess && (
        <div className="fixed top-20 left-4 right-4 z-50 max-w-md mx-auto bg-[#006c4a] text-white px-4 py-3 rounded-xl shadow-xl flex items-center justify-between animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px]">task_alt</span>
            <span className="text-[13px] font-semibold">
              ¡Asistencia guardada y {absentCount} alertas enviadas!
            </span>
          </div>
          <button
            onClick={() => setSaveSuccess(false)}
            className="text-white/80 hover:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Class Context & Date Selector Card */}
      <section className="bg-white rounded-xl p-3.5 shadow-sm space-y-2 border border-[#eaedff]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="material-symbols-outlined text-[#00236f] text-[20px]">
              school
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#444651]">
              Sesión Activa
            </span>
          </div>
          <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#eaedff] text-[#444651] text-[11px] font-semibold shadow-xs">
            <span className="material-symbols-outlined text-[14px]">event</span>
            <span>Hoy, 24 Oct 2024</span>
          </div>
        </div>

        {/* Dropdown Selector Button */}
        <div className="relative">
          <div className="flex items-center gap-1.5">
            <button
              className="flex-1 flex items-center justify-between p-2.5 bg-[#f2f3ff] rounded-lg text-left active:scale-[0.99] transition-transform border border-transparent hover:border-[#dae2fd]"
              type="button"
              onClick={() => setShowClassDropdown(!showClassDropdown)}
            >
              <div className="flex flex-col min-w-0 pr-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-[15px] text-[#131b2e] leading-tight truncate">
                    {currentClass.name}
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-[#00236f] text-white text-[9px] font-bold">
                    {currentClass.language}
                  </span>
                </div>
                <span className="text-[12px] text-[#00236f] font-semibold truncate flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">school</span>
                  <span>Prof. {currentClass.teacherName} • {currentClass.level}</span>
                </span>
                <span className="text-[11px] text-[#444651] mt-0.5 truncate flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-[#006c4a]">alarm</span>
                  <span>{currentClass.schedule} • {currentClass.room}</span>
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#eaedff] flex items-center justify-center text-[#00236f] shrink-0">
                <span
                  className={`material-symbols-outlined text-[20px] transition-transform duration-200 ${
                    showClassDropdown ? 'rotate-180' : ''
                  }`}
                >
                  expand_more
                </span>
              </div>
            </button>

            {onEditCurrentClass && (
              <button
                type="button"
                onClick={onEditCurrentClass}
                title="Editar horario y datos de este curso"
                className="w-10 h-10 rounded-lg bg-[#eaedff] hover:bg-[#dce1ff] text-[#00236f] flex items-center justify-center transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">edit_calendar</span>
              </button>
            )}
          </div>

          {/* Class selection dropdown */}
          {showClassDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-white rounded-xl shadow-xl border border-[#eaedff] py-1.5 overflow-hidden">
              <div className="px-3 py-1.5 text-[11px] font-bold text-[#757682] uppercase tracking-wider flex items-center justify-between">
                <span>Seleccionar Aula / Grupo</span>
                <span className="text-[10px] text-[#00236f]">{availableClasses.length} cursos</span>
              </div>
              {availableClasses.map((cls) => (
                <button
                  key={cls.id}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors ${
                    cls.id === currentClass.id
                      ? 'bg-[#eaedff] text-[#00236f] font-semibold'
                      : 'hover:bg-[#f2f3ff] text-[#131b2e]'
                  }`}
                  onClick={() => {
                    onChangeClass(cls);
                    setShowClassDropdown(false);
                  }}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-semibold">{cls.name}</span>
                      <span className="px-1.5 py-0.2 bg-[#00236f]/10 text-[#00236f] text-[9px] font-bold rounded">
                        {cls.language}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#444651]">
                      Prof. {cls.teacherName} • {cls.room}
                    </span>
                  </div>
                  {cls.id === currentClass.id && (
                    <span className="material-symbols-outlined text-[18px] text-[#00236f]">
                      check
                    </span>
                  )}
                </button>
              ))}

              {onAddNewClass && (
                <div className="pt-1 mt-1 border-t border-[#eaedff] px-2">
                  <button
                    onClick={() => {
                      setShowClassDropdown(false);
                      onAddNewClass();
                    }}
                    className="w-full py-1.5 px-2 bg-[#00236f] text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">add</span>
                    <span>+ Agregar Horario Nuevo</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Student Management & Level Deletion Bar */}
        <div className="flex items-center gap-1.5 pt-1 border-t border-[#f2f3ff]">
          <button
            type="button"
            onClick={() => setIsAddStudentModalOpen(true)}
            className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#00236f] hover:bg-[#1e3a8a] text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-2xs transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">person_add</span>
            <span>+ Inscribir Alumno</span>
          </button>

          <button
            type="button"
            onClick={() => setIsManageStudentsModalOpen(true)}
            className="py-1.5 px-2.5 rounded-lg bg-[#eaedff] hover:bg-[#dce1ff] text-[#00236f] text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">groups</span>
            <span>Alumnos ({classStudents.length})</span>
          </button>

          {onDeleteFinishedLevel && (
            <button
              type="button"
              onClick={() => setShowDeleteLevelConfirm(true)}
              title="Eliminar este nivel finalizado y sus datos de clase"
              className="py-1.5 px-2 rounded-lg bg-[#ffdad6]/60 hover:bg-[#ffdad6] text-[#ba1a1a] text-[11px] font-bold flex items-center justify-center gap-1 transition-colors shrink-0"
            >
              <span className="material-symbols-outlined text-[15px]">delete_sweep</span>
              <span className="hidden sm:inline">Eliminar Nivel Finalizado</span>
            </button>
          )}
        </div>
      </section>

      {/* Summary Metrics Bar (Bento-style row) */}
      <section className="grid grid-cols-4 gap-2">
        <div className="flex flex-col items-center justify-center py-2.5 px-1 bg-white rounded-xl shadow-xs border border-[#eaedff] text-center">
          <span className="text-[11px] font-semibold text-[#444651]">Total</span>
          <span className="text-[18px] text-[#131b2e] font-bold tabular-nums">
            {totalCount}
          </span>
          <span className="text-[11px] text-[#444651]">Alumnos</span>
        </div>

        <div
          onClick={() => setFilter(filter === 'P' ? 'ALL' : 'P')}
          className={`cursor-pointer flex flex-col items-center justify-center py-2.5 px-1 rounded-xl shadow-xs text-center border transition-all ${
            filter === 'P'
              ? 'ring-2 ring-[#006c4a] bg-[#85f8c4]/60 border-[#006c4a]'
              : 'bg-[#85f8c4]/30 border-transparent hover:bg-[#85f8c4]/50'
          }`}
        >
          <span className="text-[11px] font-semibold text-[#005137]">Presentes</span>
          <span className="text-[18px] text-[#006c4a] font-bold tabular-nums">
            {presentCount}
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#006c4a]"></span>
        </div>

        <div
          onClick={() => setFilter(filter === 'A' ? 'ALL' : 'A')}
          className={`cursor-pointer flex flex-col items-center justify-center py-2.5 px-1 rounded-xl shadow-xs text-center border transition-all ${
            filter === 'A'
              ? 'ring-2 ring-[#ba1a1a] bg-[#ffdad6] border-[#ba1a1a]'
              : 'bg-[#ffdad6]/80 border-transparent hover:bg-[#ffdad6]'
          }`}
        >
          <span className="text-[11px] font-semibold text-[#ba1a1a]">Ausentes</span>
          <span className="text-[18px] text-[#ba1a1a] font-bold tabular-nums">
            {absentCount}
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ba1a1a]"></span>
        </div>

        <div
          onClick={() => setFilter(filter === 'T' ? 'ALL' : 'T')}
          className={`cursor-pointer flex flex-col items-center justify-center py-2.5 px-1 rounded-xl shadow-xs text-center border transition-all ${
            filter === 'T'
              ? 'ring-2 ring-[#fc922b] bg-[#ffdcc3] border-[#fc922b]'
              : 'bg-[#ffdcc3]/70 border-transparent hover:bg-[#ffdcc3]'
          }`}
        >
          <span className="text-[11px] font-semibold text-[#6e3900]">Tardes</span>
          <span className="text-[18px] text-[#fc922b] font-bold tabular-nums">
            {lateCount}
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#fc922b]"></span>
        </div>
      </section>

      {/* Quick Bulk Action Bar & Status Filter */}
      <section className="flex items-center gap-2">
        <button
          className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-3 bg-[#dce1ff] text-[#00164e] rounded-xl font-semibold text-[13px] active:scale-[0.98] transition-all shadow-xs hover:bg-[#b6c4ff]"
          id="btn-mark-all-present"
          type="button"
          onClick={onMarkAllPresent}
        >
          <span className="material-symbols-outlined text-[18px]">done_all</span>
          <span>Marcar todos Presentes</span>
        </button>

        <button
          className={`flex items-center justify-center space-x-1 py-2.5 px-3 rounded-xl text-[12px] font-semibold transition-all shadow-xs ${
            filter !== 'ALL'
              ? 'bg-[#00236f] text-white'
              : 'bg-white text-[#444651] border border-[#eaedff] hover:bg-[#eaedff]'
          }`}
          type="button"
          onClick={() => setShowFilterModal(!showFilterModal)}
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
          <span>{filter === 'ALL' ? 'Filtro' : `Filtro: ${filter}`}</span>
        </button>
      </section>

      {/* Filter Menu Bar (when toggled or active) */}
      {showFilterModal && (
        <div className="bg-white p-3 rounded-xl border border-[#eaedff] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase text-[#757682]">
            <span>Filtrar alumnos por estado:</span>
            {filter !== 'ALL' && (
              <button
                onClick={() => setFilter('ALL')}
                className="text-[#00236f] font-semibold hover:underline"
              >
                Limpiar
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'ALL', label: `Todos (${totalCount})` },
              { id: 'P', label: `Presentes (${presentCount})` },
              { id: 'A', label: `Ausentes (${absentCount})` },
              { id: 'T', label: `Tardes (${lateCount})` },
              { id: 'J', label: `Justificados (${justifiedCount})` },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setFilter(item.id as 'ALL' | AttendanceStatus);
                  setShowFilterModal(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${
                  filter === item.id
                    ? 'bg-[#00236f] text-white shadow-xs'
                    : 'bg-[#f2f3ff] text-[#444651] hover:bg-[#eaedff]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Quick search input */}
          <div className="pt-1">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-2.5 text-[18px] text-[#757682]">
                search
              </span>
              <input
                type="text"
                placeholder="Buscar por nombre o matrícula..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-[13px] bg-[#f2f3ff] rounded-lg border border-transparent focus:border-[#00236f] focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-[#757682] hover:text-[#131b2e]"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Student Attendance Roster List */}
      <section className="space-y-2.5" id="roster-list">
        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-[#eaedff] shadow-xs">
            <span className="material-symbols-outlined text-[36px] text-[#757682] mb-2">
              group_off
            </span>
            <p className="text-[14px] font-semibold text-[#131b2e]">
              No se encontraron alumnos con este filtro
            </p>
            <button
              onClick={() => {
                setFilter('ALL');
                setSearchQuery('');
              }}
              className="mt-3 text-[12px] font-semibold text-[#00236f] underline"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          filteredStudents.map((student) => {
            const isAbsent = student.status === 'A';
            const isLate = student.status === 'T';
            const isJustified = student.status === 'J';

            return (
              <article
                key={student.id}
                className={`rounded-xl p-3 shadow-xs border transition-all flex flex-col space-y-2 ${
                  isAbsent
                    ? 'bg-[#ffdad6]/25 border-[#ffdad6]'
                    : isLate
                    ? 'bg-[#ffdcc3]/20 border-[#ffdcc3]'
                    : isJustified
                    ? 'bg-[#dce1ff]/20 border-[#dce1ff]'
                    : 'bg-white border-[#eaedff]'
                }`}
                data-student-id={student.id}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center space-x-2.5 min-w-0 cursor-pointer flex-1 group"
                    onClick={() => onSelectStudent(student)}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        className="w-10 h-10 rounded-full object-cover shadow-inner group-hover:ring-2 ring-[#00236f] transition-all"
                        alt={`Retrato de ${student.name}`}
                        src={student.avatarUrl}
                        onError={(e) => {
                          // Fallback if image fails
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white ${
                          student.status === 'P'
                            ? 'bg-[#006c4a]'
                            : student.status === 'A'
                            ? 'bg-[#ba1a1a]'
                            : student.status === 'T'
                            ? 'bg-[#fc922b]'
                            : 'bg-[#1e3a8a]'
                        }`}
                      ></span>
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-[15px] text-[#131b2e] truncate group-hover:text-[#00236f] transition-colors">
                          {student.name}
                        </span>
                        <span className="material-symbols-outlined text-[14px] text-[#757682] opacity-0 group-hover:opacity-100 transition-opacity">
                          chevron_right
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#444651]">
                        <span className="font-medium">{student.rollNo}</span>
                        <span>•</span>
                        <span className="text-[#00236f] font-semibold truncate">
                          Prof. {student.teacherName || currentClass.teacherName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Toggles: P, A, T, J */}
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    {/* P - Presente */}
                    <button
                      className={`status-btn w-8 h-8 rounded-full font-bold text-[12px] flex items-center justify-center transition-all ${
                        student.status === 'P'
                          ? 'bg-[#006c4a] text-white shadow-xs scale-105'
                          : 'bg-[#e2e7ff] text-[#444651] hover:bg-[#dae2fd]'
                      }`}
                      data-val="P"
                      type="button"
                      title="Presente"
                      onClick={() => onUpdateStatus(student.id, 'P')}
                    >
                      P
                    </button>

                    {/* A - Ausente */}
                    <button
                      className={`status-btn w-8 h-8 rounded-full font-bold text-[12px] flex items-center justify-center transition-all ${
                        student.status === 'A'
                          ? 'bg-[#ba1a1a] text-white shadow-xs scale-105'
                          : 'bg-[#e2e7ff] text-[#444651] hover:bg-[#dae2fd]'
                      }`}
                      data-val="A"
                      type="button"
                      title="Ausente"
                      onClick={() => onUpdateStatus(student.id, 'A')}
                    >
                      A
                    </button>

                    {/* T - Tarde */}
                    <button
                      className={`status-btn w-8 h-8 rounded-full font-bold text-[12px] flex items-center justify-center transition-all ${
                        student.status === 'T'
                          ? 'bg-[#442100] text-white shadow-xs scale-105'
                          : 'bg-[#e2e7ff] text-[#444651] hover:bg-[#dae2fd]'
                      }`}
                      data-val="T"
                      type="button"
                      title="Tarde"
                      onClick={() => onUpdateStatus(student.id, 'T')}
                    >
                      T
                    </button>

                    {/* J - Justificado */}
                    <button
                      className={`status-btn w-8 h-8 rounded-full font-bold text-[12px] flex items-center justify-center transition-all ${
                        student.status === 'J'
                          ? 'bg-[#1e3a8a] text-white shadow-xs scale-105'
                          : 'bg-[#e2e7ff] text-[#444651] hover:bg-[#dae2fd]'
                      }`}
                      data-val="J"
                      type="button"
                      title="Justificado"
                      onClick={() => onUpdateStatus(student.id, 'J')}
                    >
                      J
                    </button>

                    {/* Borrar alumno de la clase tomada */}
                    <button
                      className="w-8 h-8 rounded-full text-[#757682] hover:text-[#ba1a1a] hover:bg-[#ffdad6] flex items-center justify-center transition-colors ml-0.5"
                      type="button"
                      title="Eliminar alumno de esta clase"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          confirm(
                            `¿Estás seguro de eliminar al alumno ${student.name} de la clase de ${currentClass.name}? Se borrarán sus datos de asistencia de esta clase.`
                          )
                        ) {
                          onDeleteStudent(student.id);
                        }
                      }}
                    >
                      <span className="material-symbols-outlined text-[16px]">person_remove</span>
                    </button>
                  </div>
                </div>

                {/* Badges / Flag lines matching the designs */}
                {student.flagType === 'alert' && (
                  <div className="flex items-center space-x-1.5 px-2 py-1 bg-[#ffdad6] rounded-lg text-[#93000a]">
                    <span className="material-symbols-outlined text-[14px]">crisis_alert</span>
                    <span className="text-[11px] font-bold">
                      {student.flagMessage || 'Alerta programada • Notificación automática a tutor'}
                    </span>
                  </div>
                )}

                {student.flagType === 'late' && (
                  <div className="flex items-center space-x-1.5 px-2 py-1 bg-[#ffdcc3] rounded-lg text-[#6e3900]">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    <span className="text-[11px] font-semibold">
                      {student.flagMessage || '+15 min tarde • Ingreso 08:15 AM'}
                    </span>
                  </div>
                )}

                {student.flagType === 'warning' && (
                  <div className="flex items-center space-x-1.5 px-2 py-1 bg-[#ffdad6] rounded-lg text-[#93000a]">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    <span className="text-[11px] font-bold">
                      {student.flagMessage || '2da falta semanal recurrente'}
                    </span>
                  </div>
                )}

                {student.flagType === 'justified' && (
                  <div className="flex items-center space-x-1.5 px-2 py-1 bg-[#e2e7ff] rounded-lg text-[#00236f]">
                    <span className="material-symbols-outlined text-[14px]">medical_services</span>
                    <span className="text-[11px] font-semibold">
                      {student.flagMessage || 'Justificado: Certificado médico adjunto'}
                    </span>
                  </div>
                )}

                {student.flagType === 'sms' && (
                  <div className="flex items-center space-x-1.5 px-2 py-1 bg-[#e2e7ff] rounded-lg text-[#444651]">
                    <span className="material-symbols-outlined text-[14px]">send</span>
                    <span className="text-[11px] font-semibold">
                      {student.flagMessage || 'Alerta por enviar vía SMS y Push'}
                    </span>
                  </div>
                )}
              </article>
            );
          })
        )}
      </section>

      {/* Bottom Floating Execution Card & Action CTAs */}
      <aside className="fixed bottom-16 left-0 right-0 z-40 px-4 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl space-y-2 border border-[#eaedff]">
          {/* Notification Impact Info */}
          <div className="flex items-start space-x-2.5 bg-[#f2f3ff] p-2.5 rounded-xl">
            <div className="w-7 h-7 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[18px]">
                notification_important
              </span>
            </div>
            <p className="text-[12px] text-[#444651] leading-tight">
              <strong className="text-[#131b2e] font-bold">
                {absentCount} inasistencias detectadas.
              </strong>{' '}
              Se enviará notificación automática a padres y a la app del estudiante al guardar.
            </p>
          </div>

          {/* Main Action Group */}
          <div className="flex flex-col gap-1.5">
            <button
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-[#1e3a8a] hover:bg-[#00236f] text-white rounded-xl font-bold text-[14px] shadow-md active:scale-[0.98] transition-all disabled:opacity-75"
              id="btn-save-submit"
              type="button"
              disabled={isSaving}
              onClick={handleSaveClick}
            >
              {isSaving ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">
                    sync
                  </span>
                  <span>Enviando alertas...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">
                    send_and_archive
                  </span>
                  <span>Guardar y Enviar Alertas</span>
                </>
              )}
            </button>

            <button
              className="w-full py-1.5 text-center text-[#00236f] font-semibold text-[12px] hover:text-[#1e3a8a] transition-colors"
              type="button"
              onClick={onSaveDraft}
            >
              Guardar borrador
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};
