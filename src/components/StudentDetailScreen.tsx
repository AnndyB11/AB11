import React, { useState, useRef } from 'react';
import { Student } from '../types';

interface StudentDetailScreenProps {
  student: Student;
  onBack: () => void;
  onJustifyAbsence?: (studentId: number, docName: string) => void;
}

export const StudentDetailScreen: React.FC<StudentDetailScreenProps> = ({
  student,
  onBack,
  onJustifyAbsence,
}) => {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [contactSuccessMsg, setContactSuccessMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // SVG Gauge calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius; // ~314.16
  const strokeOffset = circumference - (circumference * student.generalRate) / 100;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      setUploadedFile(fileName);
      if (onJustifyAbsence) {
        onJustifyAbsence(student.id, fileName);
      }
    }
  };

  const triggerSampleJustification = () => {
    const sampleName = 'Certificado_Medico_Oct24.pdf';
    setUploadedFile(sampleName);
    if (onJustifyAbsence) {
      onJustifyAbsence(student.id, sampleName);
    }
  };

  return (
    <div className="flex flex-col w-full px-4 pt-20 pb-28 space-y-3.5 max-w-md mx-auto">
      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-[#eaedff] text-[#00236f] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">call</span>
                </div>
                <h3 className="font-bold text-[16px] text-[#131b2e]">
                  Contactar Institución
                </h3>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#757682] hover:bg-[#eaedff]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-[13px] text-[#444651]">
              Comunícate directamente con la secretaría o el docente encargado:
            </p>

            <div className="space-y-2">
              <a
                href="tel:+56912345678"
                onClick={() => {
                  setContactSuccessMsg('Llamando a Secretaría Docente...');
                  setTimeout(() => setContactSuccessMsg(''), 3000);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#00236f] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">phone</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[13px] font-semibold">Secretaría Docente</span>
                  <span className="text-[11px] text-[#444651]">+56 9 1234 5678 • Anexo 204</span>
                </div>
              </a>

              <a
                href="https://wa.me/?text=Hola%2C%20quisiera%20consultar%20sobre%20la%20asistencia%20de%20Camila%20Rodriguez"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#006c4a] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[13px] font-semibold">WhatsApp Inspectoría</span>
                  <span className="text-[11px] text-[#444651]">Atención inmediata 08:00 - 17:00</span>
                </div>
              </a>

              <button
                onClick={() => {
                  setContactSuccessMsg(`Mensaje enviado a ${student.teacherName}`);
                  setTimeout(() => setShowContactModal(false), 1500);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#1e3a8a] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[13px] font-semibold">Mensaje a {student.teacherName}</span>
                  <span className="text-[11px] text-[#444651]">docente@seattleapp.edu</span>
                </div>
              </button>
            </div>

            {contactSuccessMsg && (
              <div className="p-2.5 rounded-lg bg-[#82f5c1]/30 text-[#006c4a] text-[12px] font-semibold text-center">
                {contactSuccessMsg}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Regulations FAQ Modal */}
      {showFaqModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-[16px] text-[#131b2e]">
                Reglamento de Asistencia
              </h3>
              <button
                onClick={() => setShowFaqModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#757682] hover:bg-[#eaedff]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-3 text-[13px] text-[#444651]">
              <div className="p-3 rounded-xl bg-[#f2f3ff] space-y-1">
                <span className="font-bold text-[#00236f] block">
                  1. Mínimo Institucional (85%)
                </span>
                <p>
                  Para aprobar el curso lectivo se exige un mínimo de 85% de asistencia total a las asignaturas oficiales.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#f2f3ff] space-y-1">
                <span className="font-bold text-[#00236f] block">
                  2. Plazo de Justificación Médica
                </span>
                <p>
                  Los certificados médicos deben presentarse digitalmente a través de esta plataforma dentro de las 24 horas siguientes a la inasistencia.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#f2f3ff] space-y-1">
                <span className="font-bold text-[#00236f] block">
                  3. Tardanzas Acumuladas
                </span>
                <p>
                  Tres retrasos superiores a 10 minutos se computarán reglamentariamente como una inasistencia a efectos de evaluación.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowFaqModal(false)}
              className="w-full py-2.5 bg-[#00236f] text-white rounded-xl font-bold text-[13px]"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Student Identity Card */}
      <section className="p-3.5 rounded-xl bg-[#eaedff] shadow-xs flex items-center justify-between border border-[#dae2fd]">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#dce1ff] flex-shrink-0 ring-2 ring-white">
            <img
              className="w-full h-full object-cover"
              alt={`Foto de ${student.name}`}
              src={student.avatarUrl}
            />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#82f5c1] rounded-full flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-[#006c4a]"></span>
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[16px] text-[#131b2e] truncate">
                {student.name}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-[#00236f] text-white text-[10px] font-bold">
                {student.language}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#00236f] text-[12px] font-semibold">
              <span className="material-symbols-outlined text-[14px]">school</span>
              <span>Profesor: {student.teacherName}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#444651] text-[11px]">
              <span>{student.level}</span>
              <span>•</span>
              <span className="truncate">Seattle App</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="bg-[#00236f]/10 text-[#00236f] text-[11px] font-bold px-2.5 py-1 rounded-full">
            Ciclo 2024-II
          </span>
        </div>
      </section>

      {/* Urgent Inattendance Notice Card */}
      <section className="rounded-xl bg-[#ffdad6] text-[#93000a] p-3.5 shadow-sm space-y-2.5 relative overflow-hidden border border-[#ffdad6]">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center flex-shrink-0 shadow-xs animate-pulse">
            <span className="material-symbols-outlined text-[22px] filled">
              notifications_active
            </span>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <h2 className="font-bold text-[16px] text-[#93000a] tracking-tight leading-tight">
                Alerta de Inasistencia
              </h2>
              <span className="bg-[#ba1a1a]/20 text-[#93000a] text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                Hoy
              </span>
            </div>
            <p className="text-[13px] text-[#93000a]/90 mt-1 leading-snug">
              <strong className="font-semibold text-[#131b2e]">{student.teacherName}</strong> ha registrado una inasistencia en{' '}
              <strong className="font-semibold text-[#131b2e]">{student.language} ({student.level})</strong> hoy, 24 de Octubre a las 08:15 AM.
            </p>
          </div>
        </div>

        {/* Deadline callout container */}
        <div className="bg-white/85 rounded-lg p-2.5 flex items-center gap-2.5 shadow-xs">
          <span className="material-symbols-outlined text-[#ba1a1a] text-[20px] flex-shrink-0 filled">
            hourglass_top
          </span>
          <p className="text-[12px] text-[#131b2e] leading-snug">
            Si fue un error o tienes motivo justificado, envía tu justificante antes de las{' '}
            <strong className="text-[#ba1a1a] font-bold">18:00 hrs</strong>.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="pt-1 flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
            className="hidden"
            onChange={handleFileUpload}
          />

          <button
            className={`w-full min-h-[44px] rounded-lg text-[13px] font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-xs ${
              uploadedFile
                ? 'bg-[#006c4a] text-white'
                : 'bg-[#00236f] hover:bg-[#1e3a8a] text-white'
            }`}
            id="btn-upload"
            type="button"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="material-symbols-outlined text-[20px]">
              {uploadedFile ? 'task_alt' : 'attach_file'}
            </span>
            <span>
              {uploadedFile
                ? 'Justificante Cargado (Modificar)'
                : 'Subir Justificante Médico / Carta'}
            </span>
          </button>

          {!uploadedFile && (
            <button
              onClick={triggerSampleJustification}
              className="text-[11px] text-[#00236f] font-semibold text-center hover:underline"
            >
              + Usar comprobante de prueba rápido (Demo)
            </button>
          )}

          <button
            className="w-full min-h-[44px] bg-white text-[#131b2e] hover:bg-[#f2f3ff] rounded-lg text-[13px] font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
            type="button"
            onClick={() => setShowContactModal(true)}
          >
            <span className="material-symbols-outlined text-[#00236f] text-[20px]">
              contact_support
            </span>
            <span>Contactar a Dirección / Docente</span>
          </button>
        </div>

        {/* Upload Success Micro-interaction Banner */}
        {uploadedFile && (
          <div
            className="rounded-lg bg-[#82f5c1] text-[#002114] p-2.5 flex items-center gap-2 animate-in fade-in"
            id="upload-feedback"
          >
            <span className="material-symbols-outlined text-[20px] filled">
              check_circle
            </span>
            <span className="text-[11px] font-bold flex-1 truncate" id="upload-filename">
              Enviado: {uploadedFile} (En revisión por secretaría)
            </span>
          </div>
        )}
      </section>

      {/* Global Attendance Metric Gauge Card */}
      <section className="p-3.5 rounded-xl bg-white shadow-xs space-y-3.5 border border-[#eaedff]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[16px] text-[#131b2e]">
              Asistencia General
            </h3>
            <p className="text-[12px] text-[#444651]">Ciclo escolar en curso</p>
          </div>
          <span className="bg-[#85f8c4] text-[#002114] text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
            <span className="material-symbols-outlined text-[14px] filled">
              verified
            </span>
            Cumple regla (≥85%)
          </span>
        </div>

        {/* Gauge Ring & Data Visual */}
        <div className="flex items-center justify-center gap-5 py-1">
          <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                className="text-[#e2e7ff]"
                cx="60"
                cy="60"
                fill="transparent"
                r={radius}
                stroke="currentColor"
                strokeWidth="10"
              />
              <circle
                className="text-[#006c4a] transition-all duration-1000 ease-out"
                cx="60"
                cy="60"
                fill="transparent"
                r={radius}
                stroke="currentColor"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                strokeWidth="10"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[24px] font-bold text-[#131b2e] tracking-tight tabular-nums">
                {student.generalRate}%
              </span>
              <span className="text-[11px] text-[#006c4a] font-bold uppercase tracking-wider">
                Normal
              </span>
            </div>
          </div>

          {/* Quick summary stats */}
          <div className="flex flex-col gap-2 text-[#131b2e] min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#006c4a]"></div>
              <span className="text-[12px] text-[#444651]">Mínimo institucional:</span>
              <span className="text-[13px] font-bold tabular-nums">85%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#00236f]"></div>
              <span className="text-[12px] text-[#444651]">Total clases lectivas:</span>
              <span className="text-[13px] font-bold tabular-nums">
                {student.totalClasses}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffb77d]"></div>
              <span className="text-[12px] text-[#444651]">Límite faltas:</span>
              <span className="text-[13px] font-bold tabular-nums">7 días</span>
            </div>
          </div>
        </div>

        {/* Attendance Breakdown Pills */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="bg-[#f2f3ff] p-2.5 rounded-lg flex items-center justify-between border border-[#eaedff]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006c4a] text-[18px] filled">
                check_circle
              </span>
              <span className="text-[12px] text-[#444651]">Asistencias</span>
            </div>
            <span className="text-[15px] text-[#131b2e] font-bold tabular-nums">
              {student.presents}
            </span>
          </div>

          <div className="bg-[#ffdad6]/40 p-2.5 rounded-lg flex items-center justify-between border border-[#ffdad6]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ba1a1a] text-[18px] filled">
                cancel
              </span>
              <span className="text-[12px] text-[#444651]">Inasistencias</span>
            </div>
            <span className="text-[15px] text-[#ba1a1a] font-bold tabular-nums">
              {student.absents}
            </span>
          </div>

          <div className="bg-[#ffdcc3]/40 p-2.5 rounded-lg flex items-center justify-between border border-[#ffdcc3]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#6e3900] text-[18px]">
                schedule
              </span>
              <span className="text-[12px] text-[#444651]">Tardanzas</span>
            </div>
            <span className="text-[15px] text-[#6e3900] font-bold tabular-nums">
              {student.lates}
            </span>
          </div>

          <div className="bg-[#dce1ff]/50 p-2.5 rounded-lg flex items-center justify-between border border-[#dce1ff]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00236f] text-[18px]">
                verified_user
              </span>
              <span className="text-[12px] text-[#444651]">Justificadas</span>
            </div>
            <span className="text-[15px] text-[#00236f] font-bold tabular-nums">
              {student.justified}
            </span>
          </div>
        </div>
      </section>

      {/* Weekly Timeline Calendar */}
      <section className="p-3.5 rounded-xl bg-white shadow-xs space-y-2 border border-[#eaedff]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[16px] text-[#131b2e]">
              Semana Actual
            </h3>
            <p className="text-[12px] text-[#444651]">21 al 25 de Octubre</p>
          </div>
          <button
            onClick={() => setShowFaqModal(true)}
            className="text-[#00236f] text-[12px] font-semibold flex items-center gap-0.5 hover:underline"
            type="button"
          >
            <span>Historial</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        {/* 5-Day Strip */}
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {student.weeklyAttendance && student.weeklyAttendance.length > 0 ? (
            student.weeklyAttendance.map((dayItem, idx) => {
              if (dayItem.isToday) {
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center bg-[#ffdad6] p-2 rounded-lg text-center space-y-1 shadow-xs border border-[#ba1a1a]/30"
                  >
                    <span className="text-[10px] font-bold text-[#ba1a1a]">HOY</span>
                    <span className="text-[15px] text-[#93000a] font-bold tabular-nums">
                      {dayItem.date}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center animate-bounce">
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </div>
                  </div>
                );
              }

              if (dayItem.status === 'future') {
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center bg-[#f2f3ff]/60 p-2 rounded-lg text-center space-y-1 opacity-70"
                  >
                    <span className="text-[10px] text-[#444651] font-semibold">{dayItem.day}</span>
                    <span className="text-[15px] text-[#131b2e] font-medium tabular-nums">
                      {dayItem.date}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-[#e2e7ff] flex items-center justify-center text-[#757682]">
                      <span className="material-symbols-outlined text-[14px]">event</span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={idx}
                  className="flex flex-col items-center bg-[#f2f3ff] p-2 rounded-lg text-center space-y-1"
                >
                  <span className="text-[10px] text-[#444651] font-semibold">{dayItem.day}</span>
                  <span className="text-[15px] text-[#131b2e] font-semibold tabular-nums">
                    {dayItem.date}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-[#85f8c4]/50 flex items-center justify-center text-[#006c4a]">
                    <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                  </div>
                </div>
              );
            })
          ) : (
            // Default 5 days fallback
            <>
              <div className="flex flex-col items-center bg-[#f2f3ff] p-2 rounded-lg text-center space-y-1">
                <span className="text-[10px] text-[#444651]">LUN</span>
                <span className="text-[14px] text-[#131b2e] font-semibold">21</span>
                <div className="w-6 h-6 rounded-full bg-[#85f8c4]/50 flex items-center justify-center text-[#006c4a]">
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </div>
              </div>
              <div className="flex flex-col items-center bg-[#f2f3ff] p-2 rounded-lg text-center space-y-1">
                <span className="text-[10px] text-[#444651]">MAR</span>
                <span className="text-[14px] text-[#131b2e] font-semibold">22</span>
                <div className="w-6 h-6 rounded-full bg-[#85f8c4]/50 flex items-center justify-center text-[#006c4a]">
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </div>
              </div>
              <div className="flex flex-col items-center bg-[#f2f3ff] p-2 rounded-lg text-center space-y-1">
                <span className="text-[10px] text-[#444651]">MIÉ</span>
                <span className="text-[14px] text-[#131b2e] font-semibold">23</span>
                <div className="w-6 h-6 rounded-full bg-[#85f8c4]/50 flex items-center justify-center text-[#006c4a]">
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </div>
              </div>
              <div className="flex flex-col items-center bg-[#ffdad6] p-2 rounded-lg text-center space-y-1 shadow-xs">
                <span className="text-[10px] text-[#ba1a1a] font-bold">HOY</span>
                <span className="text-[14px] text-[#93000a] font-bold">24</span>
                <div className="w-6 h-6 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center animate-bounce">
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </div>
              </div>
              <div className="flex flex-col items-center bg-[#f2f3ff]/60 p-2 rounded-lg text-center space-y-1 opacity-70">
                <span className="text-[10px] text-[#444651]">VIE</span>
                <span className="text-[14px] text-[#131b2e]">25</span>
                <div className="w-6 h-6 rounded-full bg-[#e2e7ff] flex items-center justify-center text-[#757682]">
                  <span className="material-symbols-outlined text-[14px]">event</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Active day detailed status line */}
        <div className="mt-2 p-2.5 rounded-lg bg-[#eaedff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">
              error
            </span>
            <span className="text-[12px] text-[#131b2e] font-semibold">
              Jueves 24: Inasistencia no justificada
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded-full">
            Pendiente
          </span>
        </div>
      </section>

      {/* Attendance by Language Competency */}
      <section className="p-3.5 rounded-xl bg-white shadow-xs space-y-3.5 border border-[#eaedff]">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[16px] text-[#131b2e]">
            Competencias Lingüísticas ({student.language})
          </h3>
          <span className="text-[12px] text-[#444651]">{student.level}</span>
        </div>

        <div className="space-y-3">
          {student.competencies && student.competencies.length > 0 ? (
            student.competencies.map((sub, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        sub.colorType === 'error'
                          ? 'bg-[#ffdad6] text-[#93000a]'
                          : sub.colorType === 'secondary'
                          ? 'bg-[#85f8c4]/50 text-[#006c4a]'
                          : sub.colorType === 'primary'
                          ? 'bg-[#dce1ff] text-[#00236f]'
                          : 'bg-[#ffdcc3] text-[#6e3900]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {sub.icon}
                      </span>
                    </div>
                    <div>
                      <span className="text-[14px] font-semibold text-[#131b2e] block">
                        {sub.name}
                      </span>
                      <span
                        className={`text-[12px] flex items-center gap-1 font-medium ${
                          sub.colorType === 'error'
                            ? 'text-[#ba1a1a] font-semibold'
                            : sub.colorType === 'secondary'
                            ? 'text-[#006c4a]'
                            : sub.colorType === 'primary'
                            ? 'text-[#00236f]'
                            : 'text-[#444651]'
                        }`}
                      >
                        {sub.colorType === 'error' && (
                          <span className="material-symbols-outlined text-[14px]">
                            warning
                          </span>
                        )}
                        {sub.statusText}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[16px] font-bold tabular-nums ${
                      sub.colorType === 'error'
                        ? 'text-[#ba1a1a]'
                        : sub.colorType === 'secondary'
                        ? 'text-[#006c4a]'
                        : 'text-[#00236f]'
                    }`}
                  >
                    {sub.rate}%
                  </span>
                </div>

                <div className="w-full bg-[#e2e7ff] h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      sub.colorType === 'error'
                        ? 'bg-[#ba1a1a]'
                        : sub.colorType === 'secondary'
                        ? 'bg-[#006c4a]'
                        : sub.colorType === 'primary'
                        ? 'bg-[#00236f]'
                        : 'bg-[#4059aa]'
                    }`}
                    style={{ width: `${sub.rate}%` }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            // Default subjects
            <>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#ffdad6] text-[#93000a] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">calculate</span>
                    </div>
                    <div>
                      <span className="text-[14px] font-semibold text-[#131b2e] block">
                        Matemáticas
                      </span>
                      <span className="text-[12px] text-[#ba1a1a] flex items-center gap-1 font-semibold">
                        <span className="material-symbols-outlined text-[14px]">warning</span>
                        En advertencia (mínimo alcanzado)
                      </span>
                    </div>
                  </div>
                  <span className="text-[16px] text-[#ba1a1a] font-bold">85%</span>
                </div>
                <div className="w-full bg-[#e2e7ff] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#ba1a1a] h-full rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#85f8c4]/50 text-[#006c4a] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">biotech</span>
                    </div>
                    <div>
                      <span className="text-[14px] font-semibold text-[#131b2e] block">
                        Ciencias Naturales
                      </span>
                      <span className="text-[12px] text-[#006c4a] font-medium">
                        Excelente desempeño
                      </span>
                    </div>
                  </div>
                  <span className="text-[16px] text-[#006c4a] font-bold">96%</span>
                </div>
                <div className="w-full bg-[#e2e7ff] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#006c4a] h-full rounded-full" style={{ width: '96%' }}></div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Helpful FAQ / Contact Card */}
      <section
        onClick={() => setShowFaqModal(true)}
        className="p-3.5 rounded-xl bg-[#dae2fd]/40 hover:bg-[#dae2fd]/70 cursor-pointer flex items-center gap-3 text-[#131b2e] transition-colors border border-[#dae2fd]"
      >
        <div className="w-10 h-10 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-[20px]">info</span>
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="font-semibold text-[14px]">
            ¿Preguntas sobre el reglamento?
          </span>
          <span className="text-[12px] text-[#444651]">
            Conoce el protocolo oficial de justificaciones médicas y permisos escolares.
          </span>
        </div>
        <span className="material-symbols-outlined text-[#757682] text-[20px]">
          chevron_right
        </span>
      </section>
    </div>
  );
};
