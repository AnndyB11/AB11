import React, { useState } from 'react';
import { TeacherAcademicProfile } from '../types';

interface EditAcademicProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: TeacherAcademicProfile;
  onSave: (updatedProfile: TeacherAcademicProfile) => void;
}

const EDUCATION_TYPES = [
  'Educación Primaria / Básica',
  'Educación Secundaria / Media',
  'Bachillerato / Preparatoria',
  'Educación Técnico-Profesional',
  'Educación Inicial / Parvularia',
  'Educación Especial / Inclusiva',
  'Educación Superior / Universitaria',
];

const MODALITIES = ['Presencial', 'Híbrida', 'Virtual / A Distancia'] as const;

const SHIFTS = [
  'Jornada Matutina',
  'Jornada Vespertina',
  'Jornada Completa',
  'Nocturna',
] as const;

export const EditAcademicProfileModal: React.FC<EditAcademicProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [educationType, setEducationType] = useState(profile.educationType || EDUCATION_TYPES[1]);
  const [educationLevel, setEducationLevel] = useState(profile.educationLevel || '');
  const [subject, setSubject] = useState(profile.subject || '');
  const [modality, setModality] = useState(profile.modality || 'Presencial');
  const [teachingShift, setTeachingShift] = useState(profile.teachingShift || 'Jornada Matutina');
  const [weeklyHours, setWeeklyHours] = useState(profile.weeklyHours || 32);
  const [specialties, setSpecialties] = useState<string[]>(profile.specialties || []);
  const [newTag, setNewTag] = useState('');

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (newTag.trim() && !specialties.includes(newTag.trim())) {
      setSpecialties([...specialties, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSpecialties(specialties.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: TeacherAcademicProfile = {
      ...profile,
      educationType,
      educationLevel: educationLevel.trim() || 'Nivel General',
      subject: subject.trim() || 'Asignatura Principal',
      modality,
      teachingShift,
      weeklyHours: Number(weeklyHours) || 30,
      specialties,
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-5 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto border border-[#eaedff]">
        <div className="flex items-center justify-between border-b border-[#eaedff] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#eaedff] text-[#00236f] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">school</span>
            </div>
            <div>
              <h3 className="font-bold text-[16px] text-[#131b2e]">
                Editar Especialidad y Tipo de Educación
              </h3>
              <p className="text-[11px] text-[#444651]">
                Configura el nivel académico y las asignaturas que impartes como docente
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
          {/* Tipo de Educación */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-[#131b2e]">
              Tipo de Educación que Impartes
            </label>
            <select
              value={educationType}
              onChange={(e) => setEducationType(e.target.value)}
              className="w-full px-3 py-2 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#00236f] focus:outline-none appearance-none cursor-pointer"
            >
              {EDUCATION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Nivel / Ciclo detallado */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-[#131b2e]">
              Ciclo / Grados Específicos
            </label>
            <input
              type="text"
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              placeholder="Ej: 3° y 4° Grado de Secundaria"
              required
              className="w-full px-3 py-2 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#00236f] focus:outline-none"
            />
          </div>

          {/* Asignatura Principal */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-[#131b2e]">
              Área o Asignatura Principal
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ej: Matemáticas & Ciencias Exactas"
              required
              className="w-full px-3 py-2 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#00236f] focus:outline-none"
            />
          </div>

          {/* Modalidad y Jornada */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#131b2e]">
                Modalidad
              </label>
              <select
                value={modality}
                onChange={(e) => setModality(e.target.value as any)}
                className="w-full px-3 py-2 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#00236f] focus:outline-none"
              >
                {MODALITIES.map((mod) => (
                  <option key={mod} value={mod}>
                    {mod}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#131b2e]">
                Jornada Docente
              </label>
              <select
                value={teachingShift}
                onChange={(e) => setTeachingShift(e.target.value as any)}
                className="w-full px-3 py-2 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#00236f] focus:outline-none"
              >
                {SHIFTS.map((sh) => (
                  <option key={sh} value={sh}>
                    {sh}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Carga horaria semanal */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-[#131b2e]">
              Carga Horaria Semanal (Horas Pedagógicas)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={60}
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                required
                className="w-24 px-3 py-2 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#00236f] focus:outline-none font-bold"
              />
              <span className="text-[12px] text-[#444651]">
                horas lectivas a la semana
              </span>
            </div>
          </div>

          {/* Especialidades y Temas */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[#131b2e]">
              Especialidades / Módulos de Enseñanza
            </label>
            <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 bg-[#f2f3ff] rounded-xl border border-[#dae2fd]">
              {specialties.map((spec) => (
                <span
                  key={spec}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white text-[#00236f] text-[11px] font-semibold border border-[#eaedff] shadow-xs"
                >
                  <span>{spec}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(spec)}
                    className="text-[#757682] hover:text-[#ba1a1a]"
                  >
                    <span className="material-symbols-outlined text-[13px]">close</span>
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Añadir especialidad (ej. Cálculo, Estadística)..."
                className="flex-1 px-3 py-1.5 text-[12px] bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#00236f] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 bg-[#eaedff] hover:bg-[#dce1ff] text-[#00236f] text-[12px] font-bold rounded-lg transition-colors"
              >
                + Añadir
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#eaedff]">
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
              Guardar Perfil Académico
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
