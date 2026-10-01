import React, { useState } from 'react';
import { AlertNotification, Student } from '../types';

interface AlertsCenterScreenProps {
  alerts: AlertNotification[];
  onSendSingleAlert: (alertId: string) => void;
  onSendAllAlerts: () => void;
  onSelectStudentDetail: (studentId: number) => void;
}

export const AlertsCenterScreen: React.FC<AlertsCenterScreenProps> = ({
  alerts,
  onSendSingleAlert,
  onSendAllAlerts,
  onSelectStudentDetail,
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'sent' | 'justified'>('pending');
  const [isSendingAll, setIsSendingAll] = useState(false);
  const [allSentSuccess, setAllSentSuccess] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateText, setTemplateText] = useState(
    'Estimado tutor de Seattle App, le informamos que el estudiante [Nombre] no se presentó hoy a su clase de [Idioma] con el docente [Profesor]. Por favor confirme o justifique su inasistencia.'
  );

  const pendingAlerts = alerts.filter((a) => a.status === 'pending');
  const sentAlerts = alerts.filter((a) => a.status === 'sent' || a.status === 'read');
  const justifiedAlerts = alerts.filter((a) => a.status === 'justified');

  const handleSendAll = () => {
    setIsSendingAll(true);
    setTimeout(() => {
      setIsSendingAll(false);
      setAllSentSuccess(true);
      onSendAllAlerts();
      setTimeout(() => setAllSentSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full px-4 pt-20 pb-36 space-y-3.5 max-w-md mx-auto">
      {/* Toast Notification */}
      {allSentSuccess && (
        <div className="fixed top-20 left-4 right-4 z-50 max-w-md mx-auto bg-[#006c4a] text-white px-4 py-3 rounded-xl shadow-xl flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px]">cell_tower</span>
            <span className="text-[13px] font-semibold">
              ¡Todas las alertas de hoy han sido despachadas exitosamente!
            </span>
          </div>
          <button
            onClick={() => setAllSentSuccess(false)}
            className="text-white/80 hover:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Edit Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[16px] text-[#131b2e]">
                Personalizar Mensaje de Alerta
              </h3>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#757682] hover:bg-[#eaedff]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-[12px] text-[#444651]">
              Puedes incluir las variables dinámicas <code className="bg-[#eaedff] px-1 rounded">[Nombre]</code> y <code className="bg-[#eaedff] px-1 rounded">[Fecha]</code>.
            </p>

            <textarea
              rows={4}
              value={templateText}
              onChange={(e) => setTemplateText(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#f2f3ff] text-[#131b2e] text-[13px] border border-[#dae2fd] focus:border-[#00236f] focus:outline-none"
            />

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2 rounded-xl text-[12px] font-semibold text-[#444651] hover:bg-[#eaedff]"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2 rounded-xl text-[12px] font-bold bg-[#00236f] text-white shadow-xs"
              >
                Guardar Plantilla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Title & Network Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-bold text-[18px] text-[#00236f]">
            Centro de Control de Alertas
          </span>
          <span className="text-[12px] text-[#444651]">
            Gestión y despacho escolar en tiempo real
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#eaedff] px-2.5 py-1 rounded-full shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#006c4a] animate-pulse"></span>
          <span className="text-[11px] font-bold text-[#444651] uppercase tracking-wider">
            Red Activa
          </span>
        </div>
      </div>

      {/* Segmented Navigation Pills */}
      <div className="flex items-center gap-1 p-1 bg-[#e2e7ff] rounded-xl overflow-x-auto no-scrollbar">
        <button
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold transition-all ${
            activeTab === 'pending'
              ? 'bg-white text-[#00236f] shadow-xs'
              : 'text-[#444651] hover:text-[#00236f]'
          }`}
          onClick={() => setActiveTab('pending')}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">emergency_home</span>
          <span>Inasistencias Hoy</span>
          <span className="px-1.5 py-0.2 bg-[#00236f]/10 text-[#00236f] rounded-full text-[11px] font-bold">
            {pendingAlerts.length}
          </span>
        </button>

        <button
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold transition-all ${
            activeTab === 'sent'
              ? 'bg-white text-[#00236f] shadow-xs'
              : 'text-[#444651] hover:text-[#00236f]'
          }`}
          onClick={() => setActiveTab('sent')}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">send</span>
          <span>Enviadas</span>
          <span className="px-1.5 py-0.2 bg-[#eaedff] text-[#444651] rounded-full text-[11px]">
            {sentAlerts.length + 15}
          </span>
        </button>

        <button
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold transition-all ${
            activeTab === 'justified'
              ? 'bg-white text-[#00236f] shadow-xs'
              : 'text-[#444651] hover:text-[#00236f]'
          }`}
          onClick={() => setActiveTab('justified')}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
          <span>Justificaciones</span>
          <span className="px-1.5 py-0.2 bg-[#ffdad6] text-[#ba1a1a] rounded-full text-[11px] font-bold">
            {justifiedAlerts.length + 2}
          </span>
        </button>
      </div>

      {/* Urgent Broadcast Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1e3a8a] to-[#00236f] text-white p-3.5 rounded-xl shadow-md flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-[24px] text-[#ffdcc3] animate-bounce">
            bolt
          </span>
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="font-bold text-[14px] leading-snug">
            {pendingAlerts.length > 0
              ? `${pendingAlerts.length} Notificaciones inmediatas listas`
              : 'Todas las notificaciones al día'}
          </span>
          <span className="text-[12px] text-white/85">
            Listas para despacho prioritario a tutores y portal estudiantil.
          </span>
        </div>
      </div>

      {/* Automatic Message Preview Card */}
      <div className="bg-white rounded-xl p-3.5 shadow-xs flex flex-col gap-2 border border-[#eaedff]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#00236f] text-[12px] font-bold">
            <span className="material-symbols-outlined text-[18px]">chat_bubble_outline</span>
            <span>Plantilla de Despacho Automático</span>
          </div>
          <button
            className="flex items-center gap-1 text-[#1e3a8a] hover:text-[#00236f] text-[11px] font-bold transition-colors"
            type="button"
            onClick={() => setShowTemplateModal(true)}
          >
            <span className="material-symbols-outlined text-[16px]">edit_note</span>
            <span>Editar plantilla</span>
          </button>
        </div>

        <div className="bg-[#f2f3ff] rounded-lg p-2.5 text-[12px] text-[#444651] italic leading-relaxed">
          “{templateText}”
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] text-[#006c4a] font-semibold">
              <span className="material-symbols-outlined text-[14px]">smartphone</span> App Push
            </span>
            <span className="w-1 h-1 rounded-full bg-[#c5c5d3]"></span>
            <span className="flex items-center gap-1 text-[11px] text-[#006c4a] font-semibold">
              <span className="material-symbols-outlined text-[14px]">sms</span> SMS
            </span>
            <span className="w-1 h-1 rounded-full bg-[#c5c5d3]"></span>
            <span className="flex items-center gap-1 text-[11px] text-[#006c4a] font-semibold">
              <span className="material-symbols-outlined text-[14px]">chat</span> WhatsApp
            </span>
          </div>
          <span className="text-[11px] text-[#444651] font-semibold">Canales Activos</span>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'pending' && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[15px] text-[#131b2e]">
                Estudiantes a Notificar
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[11px] font-bold">
                {pendingAlerts.length} pendientes
              </span>
            </div>
            <span className="text-[12px] text-[#444651]">3° Básico • Sala 12</span>
          </div>

          {/* Student Cards Roster */}
          <div className="flex flex-col gap-2.5">
            {pendingAlerts.length === 0 ? (
              <div className="bg-white rounded-xl p-6 text-center border border-[#eaedff]">
                <span className="material-symbols-outlined text-[36px] text-[#006c4a] mb-1.5 filled">
                  check_circle
                </span>
                <p className="text-[14px] font-semibold text-[#131b2e]">
                  No hay alertas pendientes por despachar hoy
                </p>
                <p className="text-[12px] text-[#444651] mt-0.5">
                  Todas las inasistencias han sido notificadas a los tutores legales.
                </p>
              </div>
            ) : (
              pendingAlerts.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-3.5 shadow-xs flex flex-col gap-2.5 relative overflow-hidden transition-all hover:shadow-md border border-[#eaedff]"
                >
                  {/* Left accent bar */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                      item.type === 'Ausente'
                        ? 'bg-[#ba1a1a]'
                        : item.type === 'Riesgo Medio'
                        ? 'bg-[#fc922b]'
                        : 'bg-[#757682]'
                    }`}
                  ></div>

                  <div className="flex items-start justify-between gap-2 pl-1">
                    <div
                      className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
                      onClick={() => onSelectStudentDetail(item.studentId)}
                    >
                      <div className="relative flex-shrink-0">
                        {item.studentAvatar ? (
                          <img
                            className="w-12 h-12 rounded-full object-cover ring-1 ring-[#eaedff]"
                            alt={`Retrato de ${item.studentName}`}
                            src={item.studentAvatar}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-[#dae2fd] text-[#00236f] text-[15px] flex items-center justify-center font-bold">
                            NH
                          </div>
                        )}
                        <span
                          className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-white ${
                            item.type === 'Ausente'
                              ? 'bg-[#ba1a1a]'
                              : item.type === 'Riesgo Medio'
                              ? 'bg-[#fc922b]'
                              : 'bg-[#757682]'
                          }`}
                        ></span>
                      </div>

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[15px] text-[#131b2e] truncate">
                            {item.studentName}
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-[#00236f] text-white text-[9px] font-bold">
                            {item.language}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-[#eaedff] text-[10px] font-semibold text-[#444651]">
                            {item.level || item.grade}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[#444651] text-[11px]">
                          <span className="material-symbols-outlined text-[14px] text-[#ba1a1a]">
                            schedule
                          </span>
                          <span>{item.time} • Prof. {item.teacherName}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-1 rounded-full text-[11px] font-bold flex-shrink-0 ${
                        item.type === 'Ausente'
                          ? 'bg-[#ffdad6] text-[#ba1a1a]'
                          : item.type === 'Riesgo Medio'
                          ? 'bg-[#ffdcc3] text-[#6e3900]'
                          : 'bg-[#eaedff] text-[#444651]'
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>

                  {/* Connected Contacts */}
                  {item.contactsText && item.contactsText.length > 0 && (
                    <div className="pl-1 bg-[#f2f3ff] rounded-lg p-2.5 flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-[#444651] uppercase tracking-wider">
                        Contactos Vinculados ({item.contactsText.length})
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {item.contactsText.map((contact, cIdx) => (
                          <span
                            key={cIdx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white shadow-xs text-[11px] text-[#131b2e] border border-[#eaedff]"
                          >
                            <span className="material-symbols-outlined text-[14px] text-[#006c4a]">
                              {contact.includes('Mamá')
                                ? 'family_restroom'
                                : contact.includes('Papá')
                                ? 'call'
                                : 'person'}
                            </span>
                            <span>{contact}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Risk Note Callout */}
                  {item.riskNote && (
                    <div
                      className={`pl-1 flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12px] font-medium ${
                        item.type === 'Riesgo Medio'
                          ? 'bg-[#ffdcc3]/40 text-[#6e3900]'
                          : 'bg-[#f2f3ff] text-[#444651]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px] flex-shrink-0">
                        {item.type === 'Riesgo Medio' ? 'warning' : 'pending'}
                      </span>
                      <span>{item.riskNote}</span>
                    </div>
                  )}

                  {/* Card Bottom CTA */}
                  <div className="flex items-center justify-between pl-1 pt-0.5">
                    <button
                      onClick={() => onSelectStudentDetail(item.studentId)}
                      className="text-[#00236f] text-[11px] font-bold flex items-center gap-1 hover:underline"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>Ver ficha del alumno</span>
                    </button>

                    <button
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00236f] hover:bg-[#1e3a8a] text-white text-[12px] font-bold shadow-xs transition-all active:scale-95"
                      type="button"
                      onClick={() => onSendSingleAlert(item.id)}
                    >
                      <span className="material-symbols-outlined text-[16px]">send</span>
                      <span>Notificar ahora</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* History Tab */}
      {(activeTab === 'sent' || activeTab === 'pending') && (
        <div className="flex flex-col gap-2 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00236f] text-[20px]">
                history
              </span>
              <span className="font-bold text-[15px] text-[#131b2e]">
                Historial de Alertas Recientes
              </span>
            </div>
            <button className="text-[12px] text-[#00236f] font-semibold hover:underline">
              Ver todo (15)
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {/* History item 1: Sofía Morales */}
            <div className="bg-white rounded-xl p-3 shadow-xs flex items-center justify-between gap-3 border border-[#eaedff]">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  alt="Sofía Morales"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVJZfTpRi_lKIILtpDtkphF8YYAx71Th4wKWlbJiI7-dZ0UojGsSNySsEJh5oPH3gOzLlVvJ_cdmhYmxgWmurg9KZXQiGuSMPNEcU9oI4YUlSnb7J-RZzSxmC2Pu4EzdVMpcoaDsI-Fr6flqQRLnJtbx34-Y3UNajQARIBZk59hW09BENijQtcsOR32HfYkGRCRSR6XvwzGo7xgxJsL1DYC3pukoM1mrpu7JcUogLHBF-k6LMOC3WM"
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-[14px] text-[#131b2e] truncate">
                    Sofía Morales
                  </span>
                  <span className="text-[11px] text-[#444651]">
                    Ayer • Despachada 08:12 AM
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-[#eaedff] px-2.5 py-1.5 rounded-lg flex-shrink-0 text-[#00236f]">
                <span className="material-symbols-outlined text-[16px] filled">
                  done_all
                </span>
                <span className="text-[11px] font-bold">Leído 09:15 AM</span>
              </div>
            </div>

            {/* History item 2: Daniel Torres */}
            <div className="bg-white rounded-xl p-3 shadow-xs flex items-center justify-between gap-3 border border-[#eaedff]">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#82f5c1] text-[#005137] text-[13px] flex items-center justify-center font-bold flex-shrink-0">
                  DT
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-[14px] text-[#131b2e] truncate">
                    Daniel Torres
                  </span>
                  <span className="text-[11px] text-[#444651]">
                    Martes • Despachada 08:05 AM
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-[#85f8c4]/40 px-2.5 py-1.5 rounded-lg flex-shrink-0 text-[#006c4a]">
                <span className="material-symbols-outlined text-[16px] filled">
                  attach_file
                </span>
                <span className="text-[11px] font-bold">Justificación Médica</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visual Analytics Sparkline Card */}
      <div className="bg-[#eaedff] rounded-xl p-3.5 shadow-xs flex items-center justify-between gap-3 border border-[#dae2fd]">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-[#444651] uppercase tracking-wider">
            Tasa de Confirmación Semanal
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-[22px] text-[#00236f] font-bold tabular-nums">
              96.4%
            </span>
            <span className="text-[12px] text-[#006c4a] font-bold flex items-center">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +3.2%
            </span>
          </div>
          <span className="text-[11px] text-[#444651] mt-0.5">
            Tiempo promedio de lectura: 14 mins
          </span>
        </div>

        <div className="w-24 h-12 flex-shrink-0">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 45">
            <defs>
              <linearGradient id="sparklineGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#00236f" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#00236f" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M 0 35 Q 20 28, 35 30 T 65 15 T 85 18 T 100 5 L 100 45 L 0 45 Z"
              fill="url(#sparklineGrad)"
            />
            <path
              d="M 0 35 Q 20 28, 35 30 T 65 15 T 85 18 T 100 5"
              fill="none"
              stroke="#00236f"
              strokeLinecap="round"
              strokeWidth="2.5"
            />
            <circle cx="100" cy="5" fill="#00236f" r="3.5" />
          </svg>
        </div>
      </div>

      {/* Primary Action Button: Enviar Todas las Alertas de Hoy */}
      {pendingAlerts.length > 0 && (
        <div className="pt-2">
          <button
            className="w-full h-14 rounded-xl bg-[#00236f] hover:bg-[#1e3a8a] text-white font-bold text-[15px] shadow-lg shadow-[#00236f]/20 flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] disabled:opacity-75"
            type="button"
            disabled={isSendingAll}
            onClick={handleSendAll}
          >
            {isSendingAll ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[22px]">
                  sync
                </span>
                <span>Despachando notificaciones a tutores...</span>
              </>
            ) : (
              <>
                <div className="relative flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">cell_tower</span>
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#82f5c1] animate-ping"></span>
                </div>
                <span>Enviar Todas las Alertas de Hoy ({pendingAlerts.length})</span>
              </>
            )}
          </button>
          <div className="flex items-center justify-center gap-1.5 mt-2 text-[#444651] text-[11px]">
            <span className="material-symbols-outlined text-[14px]">lock</span>
            <span>Registro de auditoría escolar y confirmaciones encriptadas</span>
          </div>
        </div>
      )}
    </div>
  );
};
