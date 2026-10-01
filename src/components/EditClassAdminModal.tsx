import React, { useState, useEffect } from 'react';
import { ClassGroup, LanguageName, Teacher } from '../types';

interface EditClassAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  classGroup?: ClassGroup | null;
  teachers: Teacher[];
  onSave: (updatedClass: ClassGroup) => void;
  onDelete?: (classId: string) => void;
}

const LANGUAGES: LanguageName[] = [
  'Inglés',
  'Portugués',
  'Francés',
  'Ruso',
  'Alemán',
  'Italiano',
];

const LEVELS = [
  'A1 Inicial',
  'A2 Básico',
  'B1 Intermedio',
  'B2 Intermedio Alto',
  'C1 Avanzado',
  'Conversacional Fluidez',
  'Preparación de Exámenes Internacionales',
];

const WEEK_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export const EditClassAdminModal: React.FC<EditClassAdminModalProps> = ({
  isOpen,
  onClose,
  classGroup,
  teachers,
  onSave,
  onDelete,
}) => {
  const isEditing = Boolean(classGroup && classGroup.id);

  const [name, setName] = useState('');
  const [language, setLanguage] = useState<LanguageName>('Inglés');
  const [level, setLevel] = useState(LEVELS[0]);
  const [selectedTeacherId, setSelectedTeacherId] = useState(teachers[0]?.id || 'T-101');
  const [room, setRoom] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Lunes', 'Miércoles', 'Viernes']);
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('09:30');
  const [period, setPeriod] = useState('Ciclo 2024-II');

  useEffect(() => {
    if (classGroup) {
      setName(classGroup.name || '');
      setLanguage(classGroup.language || 'Inglés');
      setLevel(classGroup.level || LEVELS[0]);
      setSelectedTeacherId(classGroup.teacherId || teachers[0]?.id || 'T-101');
      setRoom(classGroup.room || '');
      setSelectedDays(classGroup.days && classGroup.days.length > 0 ? classGroup.days : ['Lunes', 'Miércoles', 'Viernes']);
      setStartTime(classGroup.startTime || '08:00');
      setEndTime(classGroup.endTime || '09:30');
      setPeriod(classGroup.period || 'Ciclo 2024-II');
    } else {
      setName('Nuevo Grupo de Idioma');
      setLanguage('Inglés');
      setLevel(LEVELS[0]);
      setSelectedTeacherId(teachers[0]?.id || 'T-101');
      setRoom('Sala 10 • Edificio Central');
      setSelectedDays(['Lunes', 'Miércoles', 'Viernes']);
      setStartTime('10:00');
      setEndTime('11:30');
      setPeriod('Ciclo 2024-II');
    }
  }, [classGroup, isOpen, teachers]);

  if (!isOpen) return null;

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const assignedTeacher = teachers.find((t) => t.id === selectedTeacherId) || teachers[0];

    // Compute human readable schedule string
    const daysShort = selectedDays
      .map((d) => {
        if (d === 'Lunes') return 'Lun';
        if (d === 'Martes') return 'Mar';
        if (d === 'Miércoles') return 'Mié';
        if (d === 'Jueves') return 'Jue';
        if (d === 'Viernes') return 'Vie';
        return 'Sáb';
      })
      .join(', ');

    const computedSchedule = `${daysShort} • ${startTime} - ${endTime}`;

    const updatedGroup: ClassGroup = {
      id: classGroup ? classGroup.id : `LANG-${Date.now()}`,
      name: name.trim() || `${language} ${level}`,
      language,
      level,
      teacherId: assignedTeacher.id,
      teacherName: assignedTeacher.name,
      teacherAvatar: assignedTeacher.avatarUrl,
      period,
      room: room.trim() || 'Aula por asignar',
      totalStudents: classGroup ? classGroup.totalStudents : 20,
      presentCount: classGroup ? classGroup.presentCount : 20,
      absentCount: classGroup ? classGroup.absentCount : 0,
      lateCount: classGroup ? classGroup.lateCount : 0,
      schedule: computedSchedule,
      days: selectedDays,
      startTime,
      endTime,
      shift: startTime < '12:00' ? 'Matutina' : 'Vespertina',
      attendanceTakenToday: classGroup ? classGroup.attendanceTakenToday : false,
      attendanceTakenAt: classGroup ? classGroup.attendanceTakenAt : undefined,
    };

    onSave(updatedGroup);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-5 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto border border-[#eaedff]">
        <div className="flex items-center justify-between border-b border-[#eaedff] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#00236f] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
            </div>
            <div>
              <h3 className="font-bold text-[16px] text-[#131b2e]">
                {isEditing ? 'Configurar Clase e Idioma' : 'Crear Nueva Clase de Idioma'}
              </h3>
              <p className="text-[11px] text-[#444651]">
                Exclusivo Administrador: Nombre, idioma, profesor y logística
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#757682] hover:bg-[#eaedff] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Nombre Oficial de la Clase */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-[#131b2e]">
              Nombre de la Clase / Grupo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Inglés B2 - Grupo Intensivo A"
              required
              className="w-full px-3 py-2 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#00236f] focus:outline-none"
            />
          </div>

          {/* Idioma & Nivel */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#131b2e]">
                Idioma
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageName)}
                className="w-full px-3 py-2 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#00236f] focus:outline-none"
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#131b2e]">
                Nivel Lingüístico
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#00236f] focus:outline-none"
              >
                {LEVELS.map((lev) => (
                  <option key={lev} value={lev}>
                    {lev}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Asignación de Profesor Titular */}
          <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-[#eaedff]/60 border border-[#dae2fd]">
            <label className="text-[12px] font-bold text-[#00236f] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">person_pin</span>
              <span>Asignar Profesor Responsable (Concordancia)</span>
            </label>
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="w-full px-3 py-2 text-[13px] bg-white rounded-lg border border-[#dae2fd] focus:border-[#00236f] focus:outline-none font-semibold text-[#131b2e]"
            >
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} — ({teacher.languages.join(', ')})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-[#444651]">
              Los alumnos matriculados en esta clase tendrán concordancia directa con este docente.
            </p>
          </div>

          {/* Días de la Semana */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[#131b2e] flex items-center justify-between">
              <span>Días de impartición</span>
              <span className="text-[11px] font-normal text-[#444651]">
                {selectedDays.length} días
              </span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {WEEK_DAYS.map((day) => {
                const isSelected = selectedDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#00236f] text-white shadow-xs'
                        : 'bg-[#f2f3ff] text-[#444651] hover:bg-[#eaedff]'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Horas de inicio y fin */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#131b2e]">
                Hora Inicio
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full px-3 py-2 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#00236f] focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#131b2e]">
                Hora Fin
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full px-3 py-2 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#00236f] focus:outline-none"
              />
            </div>
          </div>

          {/* Aula / Espacio y Periodo */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#131b2e]">
                Aula / Laboratorio
              </label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Ej: Sala 12 • Edificio Central"
                required
                className="w-full px-3 py-2 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#00236f] focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#131b2e]">
                Ciclo / Periodo
              </label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="Ej: Ciclo 2024-II"
                required
                className="w-full px-3 py-2 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#00236f] focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#eaedff]">
            {isEditing && onDelete && classGroup && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`¿Eliminar la clase de ${classGroup.name}?`)) {
                    onDelete(classGroup.id);
                    onClose();
                  }
                }}
                className="text-[12px] font-bold text-[#ba1a1a] hover:underline px-2 py-1"
              >
                Eliminar Clase
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-[13px] font-semibold text-[#444651] hover:bg-[#eaedff] rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-[13px] font-bold bg-[#00236f] hover:bg-[#1e3a8a] text-white rounded-xl shadow-xs transition-colors"
              >
                {isEditing ? 'Guardar Cambios de Clase' : 'Crear Clase'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
