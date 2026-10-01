import React, { useState } from 'react';
import { ClassGroup, Student } from '../types';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  classGroup: ClassGroup;
  onAddStudent: (studentData: Omit<Student, 'id'>) => void;
  currentStudentCount: number;
}

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
];

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  classGroup,
  onAddStudent,
  currentStudentCount,
}) => {
  const nextRoll = `Roll #${String(currentStudentCount + 1).padStart(2, '0')}`;
  const randomIdNum = Math.floor(84900 + Math.random() * 99);

  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState(nextRoll);
  const [studentId, setStudentId] = useState(`ID ${randomIdNum}`);
  const [tutorName, setTutorName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATARS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newStudent: Omit<Student, 'id'> = {
      name: name.trim(),
      rollNo: rollNo.trim() || nextRoll,
      studentId: studentId.trim() || `ID ${randomIdNum}`,
      avatarUrl: selectedAvatar,
      status: 'P',
      language: classGroup.language,
      level: classGroup.level,
      teacherId: classGroup.teacherId,
      teacherName: classGroup.teacherName,
      classGroupId: classGroup.id,
      generalRate: 100,
      totalClasses: 48,
      presents: 48,
      absents: 0,
      lates: 0,
      justified: 0,
      contacts: {
        studentApp: true,
        mother: tutorName ? `${tutorName} (SMS/App)` : undefined,
        phone: phone || undefined,
      },
      competencies: [
        { name: 'Expresión Oral (Speaking)', rate: 100, statusText: 'Registrado', icon: 'record_voice_over', colorType: 'secondary' },
        { name: 'Comprensión Auditiva (Listening)', rate: 100, statusText: 'Registrado', icon: 'headphones', colorType: 'secondary' },
        { name: 'Gramática & Uso (Grammar)', rate: 100, statusText: 'Registrado', icon: 'menu_book', colorType: 'primary' },
        { name: 'Lectura y Redacción (Writing)', rate: 100, statusText: 'Registrado', icon: 'edit_note', colorType: 'tertiary' },
      ],
      weeklyAttendance: [
        { day: 'LUN', date: 21, status: 'present' },
        { day: 'MAR', date: 22, status: 'present' },
        { day: 'MIÉ', date: 23, status: 'present' },
        { day: 'HOY', date: 24, isToday: true, status: 'present' },
        { day: 'VIE', date: 25, status: 'future' },
      ],
    };

    onAddStudent(newStudent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto border border-[#eaedff]">
        <div className="flex items-center justify-between border-b pb-3 border-[#eaedff]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#00236f] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">person_add</span>
            </div>
            <div>
              <h3 className="font-bold text-[15px] text-[#131b2e]">
                Inscribir Alumno a la Clase
              </h3>
              <p className="text-[11px] text-[#444651]">
                {classGroup.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#757682] hover:bg-[#eaedff] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Concordance Header info */}
        <div className="p-2.5 rounded-xl bg-[#eaedff] text-[11px] space-y-1 text-[#00236f] border border-[#dae2fd]">
          <div className="flex items-center justify-between font-bold">
            <span>Idioma: {classGroup.language}</span>
            <span className="bg-[#00236f] text-white px-2 py-0.5 rounded text-[9px]">
              {classGroup.level}
            </span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-[#131b2e]">
            <span className="material-symbols-outlined text-[14px] text-[#006c4a]">
              verified
            </span>
            <span>Profesor Asignado: {classGroup.teacherName}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Avatar selector */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[#444651] uppercase">
              Foto de Perfil del Alumno
            </label>
            <div className="flex items-center gap-2 justify-center py-1">
              {DEFAULT_AVATARS.map((av, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAvatar(av)}
                  className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-transform ${
                    selectedAvatar === av
                      ? 'border-[#00236f] scale-110 shadow-xs'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={av} alt="avatar" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-[#131b2e]">
              Nombre Completo del Estudiante
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Sebastián Paredes"
              className="w-full px-3 py-2 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#00236f] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#131b2e]">
                N° de Lista
              </label>
              <input
                type="text"
                required
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="w-full px-3 py-2 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#00236f] focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#131b2e]">
                Código ID
              </label>
              <input
                type="text"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-3 py-2 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#00236f] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-[#131b2e]">
              Nombre del Tutor / Familiar (Opcional)
            </label>
            <input
              type="text"
              value={tutorName}
              onChange={(e) => setTutorName(e.target.value)}
              placeholder="Ej: Marcela Paredes"
              className="w-full px-3 py-2 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#00236f] focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-[#131b2e]">
              Teléfono / WhatsApp para Alertas
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (206) 555-0192"
              className="w-full px-3 py-2 text-[13px] bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#00236f] focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#eaedff]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-[12px] font-semibold text-[#444651] hover:bg-[#eaedff] rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-[12px] font-bold bg-[#00236f] hover:bg-[#1e3a8a] text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
              <span>Guardar Alumno</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
