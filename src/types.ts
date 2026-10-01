export type AttendanceStatus = 'P' | 'A' | 'T' | 'J'; // Presente, Ausente, Tarde, Justificado

export type UserRole = 'admin' | 'teacher' | 'student';

export type LanguageName =
  | 'Inglés'
  | 'Portugués'
  | 'Francés'
  | 'Ruso'
  | 'Alemán'
  | 'Italiano';

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  languages: LanguageName[];
  avatarUrl: string;
  roleTitle: string;
  specialty: string;
}

export interface Student {
  id: number;
  name: string;
  rollNo: string;
  studentId: string;
  avatarUrl: string;
  status: AttendanceStatus;
  language: LanguageName;
  level: string; // e.g., 'A1 Inicial', 'B1 Intermedio', 'B2 Avanzado'
  teacherId: string;
  teacherName: string; // Concordancia directa con el profesor
  classGroupId: string;
  flagType?: 'alert' | 'warning' | 'justified' | 'sms' | 'late' | null;
  flagMessage?: string;
  generalRate: number; // e.g. 91.5
  totalClasses: number;
  presents: number;
  absents: number;
  lates: number;
  justified: number;
  contacts: {
    studentApp?: boolean;
    mother?: string;
    father?: string;
    legalGuardian?: string;
    phone?: string;
  };
  competencies: {
    name: string;
    rate: number;
    statusText: string;
    icon: string;
    colorType: 'error' | 'secondary' | 'primary' | 'tertiary';
  }[];
  weeklyAttendance: {
    day: string;
    date: number;
    isToday?: boolean;
    status: 'present' | 'absent' | 'late' | 'future' | 'justified';
  }[];
}

export interface AlertNotification {
  id: string;
  studentId: number;
  studentName: string;
  studentAvatar: string;
  language: LanguageName;
  level: string;
  teacherName: string; // Profesor asociado
  grade: string;
  subject: string;
  time: string;
  type: 'Ausente' | 'Riesgo Medio' | 'En Revisión';
  riskNote?: string;
  contactsText?: string[];
  status: 'pending' | 'sent' | 'read' | 'justified';
  readTime?: string;
  justificationAttachment?: string;
  fileDoc?: string;
}

export interface ClassGroup {
  id: string;
  name: string; // Editable por el Administrador
  language: LanguageName; // Inglés, Portugués, Francés, Ruso, Alemán, Italiano
  level: string; // A1, A2, B1, B2, C1, Conversacional, Intensivo
  teacherId: string; // Profesor asignado
  teacherName: string; // Nombre del profesor asociado
  teacherAvatar?: string;
  subject?: string;
  educationLevel?: string;
  period: string;
  room: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  schedule: string;
  days?: string[];
  startTime?: string;
  endTime?: string;
  shift?: string;
  attendanceTakenToday: boolean; // Control logístico: si el profesor ya tomó lista hoy
  attendanceTakenAt?: string;
}

export interface TeacherAcademicProfile {
  name: string;
  role: string;
  subject: string;
  languages: LanguageName[];
  educationType: string;
  educationLevel: string;
  modality: 'Presencial' | 'Híbrida' | 'Virtual / A Distancia';
  institution: string;
  email: string;
  avatarUrl: string;
  period: string;
  weeklyHours: number;
  teachingShift: 'Jornada Matutina' | 'Jornada Vespertina' | 'Jornada Completa' | 'Nocturna';
  specialties: string[];
}
