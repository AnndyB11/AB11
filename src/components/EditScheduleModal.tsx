import React, { useState, useEffect } from 'react';
import { ClassGroup } from '../types';

interface EditScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  classGroup?: ClassGroup | null;
  onSave: (group: ClassGroup) => void;
  onDelete?: (groupId: string) => void;
}

const EDUCATION_LEVELS = [
  'Educación Primaria / Básica',
  'Educación Secundaria / Media',
  'Bachillerato / Preparatoria',
  'Educación Técnico-Profesional',
  'Educación Inicial / Preescolar',
  'Educación Especial / Inclusiva',
  'Educación Superior / Terciaria',
];

const WEEK_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export const EditScheduleModal: React.FC<EditScheduleModalProps> = ({
  isOpen,
  onClose,
  classGroup,
  onSave,
  onDelete,
}) => {
  const isEditing = Boolean(classGroup && classGroup.id);

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [educationLevel, setEducationLevel] = useState(EDUCATION_LEVELS[1]);
  const [period, setPeriod] = useState('Periodo 2');
  const [room, setRoom] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Lunes', 'Miércoles', 'Viernes']);
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('09:30');
  const [shift, setShift] = useState('Matutina');

  useEffect(() => {
    if (classGroup) {
      setName(classGroup.name || '');
      setSubject(classGroup.subject || '');
      setEducationLevel(classGroup.educationLevel || EDUCATION_LEVELS[1]);
      setPeriod(classGroup.period || 'Periodo 2');
      setRoom(classGroup.room || '');
      setSelectedDays(classGroup.days && classGroup.days.length > 0 ? classGroup.days : ['Lunes', 'Miércoles', 'Viernes']);
      setStartTime(classGroup.startTime || '08:00');
      setEndTime(classGroup.endTime || '09:30');
      setShift(classGroup.shift || 'Matutina');
    } else {
      setName('3° Grado - Sección C');
      setSubject('Matemáticas Aplicadas');
      setEducationLevel(EDUCATION_LEVELS[1]);
      setPeriod('Periodo 2');
      setRoom('Sala 14 • Edificio Central');
      setSelectedDays(['Lunes', 'Miércoles']);
      setStartTime('10:00');
      setEndTime('11:30');
      setShift('Matutina');
    }
  }, [classGroup, isOpen]);

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
      id: classGroup ? classGroup.id : `GRP-${Date.now()}`,
      name: name.trim() || 'Curso sin nombre',
      language: classGroup?.language || 'Inglés',
      level: classGroup?.level || 'B2 Intermedio',
      teacherId: classGroup?.teacherId || 'T-101',
      teacherName: classGroup?.teacherName || 'Prof. Ana Martínez',
      teacherAvatar: classGroup?.teacherAvatar,
      subject: subject.trim() || 'Materia General',
      educationLevel,
      period,
      room: room.trim() || 'Aula asignada',
      totalStudents: classGroup ? classGroup.totalStudents : 25,
      presentCount: classGroup ? classGroup.presentCount : 25,
      absentCount: classGroup ? classGroup.absentCount : 0,
      lateCount: classGroup ? classGroup.lateCount : 0,
      schedule: computedSchedule,
      days: selectedDays,
      startTime,
      endTime,
      shift,
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
            <div className="w-9 h-9 rounded-full bg-[#eaedff] text-[#00236f] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">edit_calendar</span>
            </div>
            <div>
              <h3 className="font-bold text-[16px] text-[#131b2e]">
                {isEditing ? 'Editar Horario y Asignatura' : 'Nuevo Horario de Docencia'}
              </h3>
              <p className="text-[11px] text-[#444651]">
                Define qué horarios impartes y el nivel educativo de tu curso
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
          {/* Nombre del Grupo / Curso */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-[#131b2e]">
              Nombre de la Sección o Grado
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: 3° Grado - Sección B"
              required
              className="w-full px-3 py-2 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#00236f] focus:outline-none"
            />
          </div>

          {/* Asignatura que imparte */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-[#131b2e]">
              Asignatura que impartes
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ej: Matemáticas, Álgebra, Geometría"
              required
              className="w-full px-3 py-2 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#00236f] focus:outline-none"
            />
          </div>

          {/* Tipo de Educación */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-[#131b2e]">
              Tipo / Nivel de Educación
            </label>
            <select
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              className="w-full px-3 py-2 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#00236f] focus:outline-none appearance-none cursor-pointer"
            >
              {EDUCATION_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* Días de la Semana */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[#131b2e] flex items-center justify-between">
              <span>Días que impartes clases</span>
              <span className="text-[11px] font-normal text-[#444651]">
                {selectedDays.length} días seleccionados
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
                Hora de Inicio
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
                Hora de Término
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

          {/* Turno y Aula */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#131b2e]">
                Turno / Jornada
              </label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                className="w-full px-3 py-2 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#00236f] focus:outline-none"
              >
                <option value="Matutina">Matutina (Mañana)</option>
                <option value="Vespertina">Vespertina (Tarde)</option>
                <option value="Jornada Completa">Jornada Completa</option>
                <option value="Nocturna">Nocturna</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#131b2e]">
                Aula / Ubicación
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
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#eaedff]">
            {isEditing && onDelete && classGroup && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`¿Eliminar el horario de ${classGroup.name}?`)) {
                    onDelete(classGroup.id);
                    onClose();
                  }
                }}
                className="text-[12px] font-bold text-[#ba1a1a] hover:underline px-2 py-1"
              >
                Eliminar
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
                {isEditing ? 'Guardar Cambios' : 'Crear Horario'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
