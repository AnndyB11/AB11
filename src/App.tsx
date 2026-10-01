/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  AttendanceStatus,
  Student,
  AlertNotification,
  ClassGroup,
  UserRole,
  TeacherAcademicProfile,
  Teacher,
} from './types';
import {
  INITIAL_STUDENTS,
  INITIAL_ALERTS,
  CLASS_GROUPS,
  TEACHER_PROFILE,
  FACULTY_TEACHERS,
} from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { AttendanceRosterScreen } from './components/AttendanceRosterScreen';
import { StudentDetailScreen } from './components/StudentDetailScreen';
import { AlertsCenterScreen } from './components/AlertsCenterScreen';
import { GroupsScreen } from './components/GroupsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { LoginScreen } from './components/LoginScreen';
import { EditClassAdminModal } from './components/EditClassAdminModal';
import { AdminLogisticsDashboard } from './components/AdminLogisticsDashboard';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [role, setRole] = useState<UserRole>('admin');
  const [activeTab, setActiveTab] = useState<'asistencia' | 'alertas' | 'grupos' | 'micuenta'>('grupos');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [alerts, setAlerts] = useState<AlertNotification[]>(INITIAL_ALERTS);
  const [teachers, setTeachers] = useState<Teacher[]>(FACULTY_TEACHERS);

  // Teacher Academic Profile and Schedule state
  const [teacherProfile, setTeacherProfile] = useState<TeacherAcademicProfile>(TEACHER_PROFILE);
  const [groups, setGroups] = useState<ClassGroup[]>(CLASS_GROUPS);
  const [currentClass, setCurrentClass] = useState<ClassGroup>(CLASS_GROUPS[0]);

  // Admin exclusive class editor state
  const [adminEditingClass, setAdminEditingClass] = useState<ClassGroup | null>(null);
  const [isAdminEditModalOpen, setIsAdminEditModalOpen] = useState(false);

  // Status toggle handler
  const handleUpdateStatus = (studentId: number, newStatus: AttendanceStatus) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== studentId) return student;

        let flagType = student.flagType;
        let flagMessage = student.flagMessage;

        if (newStatus === 'P') {
          flagType = null;
          flagMessage = undefined;
        } else if (newStatus === 'A') {
          flagType = 'alert';
          flagMessage = `Inasistencia en ${student.language} • Alerta programada a tutor`;
        } else if (newStatus === 'T') {
          flagType = 'late';
          flagMessage = '+15 min tarde • Ingreso 08:15 AM';
        } else if (newStatus === 'J') {
          flagType = 'justified';
          flagMessage = 'Justificado: Certificado médico adjunto';
        }

        const newPresents = newStatus === 'P' ? student.presents + 1 : student.presents;
        const newAbsents = newStatus === 'A' ? student.absents + 1 : student.absents;
        const newLates = newStatus === 'T' ? student.lates + 1 : student.lates;
        const newJustified = newStatus === 'J' ? student.justified + 1 : student.justified;

        return {
          ...student,
          status: newStatus,
          flagType,
          flagMessage,
          presents: newPresents,
          absents: newAbsents,
          lates: newLates,
          justified: newJustified,
        };
      })
    );

    // If marked absent, ensure an alert is added to alerts list with teacher concordance
    if (newStatus === 'A') {
      const studentObj = students.find((s) => s.id === studentId);
      if (studentObj && !alerts.some((a) => a.studentId === studentId && a.status === 'pending')) {
        const newAlert: AlertNotification = {
          id: `ALT-${Date.now()}`,
          studentId: studentObj.id,
          studentName: studentObj.name,
          studentAvatar: studentObj.avatarUrl,
          language: studentObj.language,
          level: studentObj.level,
          teacherName: studentObj.teacherName || currentClass.teacherName,
          grade: currentClass.name,
          subject: studentObj.language,
          time: 'Hoy, 08:15 AM',
          type: 'Ausente',
          contactsText: ['Estudiante (App Activa)', 'Tutor Legal Vinculado'],
          status: 'pending',
        };
        setAlerts((prev) => [newAlert, ...prev]);
      }
    }
  };

  // Bulk mark all present
  const handleMarkAllPresent = () => {
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        status: 'P',
        flagType: null,
        flagMessage: undefined,
      }))
    );
  };

  // Dispatch all pending alerts
  const handleSaveAndSendAlerts = () => {
    setAlerts((prev) =>
      prev.map((a) => (a.status === 'pending' ? { ...a, status: 'sent' } : a))
    );

    // Mark current class as attendance taken today for logistics tracking
    const updated = {
      ...currentClass,
      attendanceTakenToday: true,
      attendanceTakenAt: '08:30 AM',
    };
    setCurrentClass(updated);
    setGroups((prev) =>
      prev.map((g) => (g.id === updated.id ? updated : g))
    );
  };

  // Dispatch single alert
  const handleSendSingleAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'sent' } : a))
    );
  };

  // Handle uploaded justification document from student detail
  const handleJustifyAbsence = (studentId: number, docName: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              status: 'J',
              flagType: 'justified',
              flagMessage: `Justificado: ${docName}`,
              justified: s.justified + 1,
            }
          : s
      )
    );

    setAlerts((prev) =>
      prev.map((a) =>
        a.studentId === studentId
          ? {
              ...a,
              status: 'justified',
              justificationAttachment: docName,
            }
          : a
      )
    );
  };

  // Admin exclusive: Save class & propagate teacher concordance to students
  const handleAdminSaveClass = (updatedGroup: ClassGroup) => {
    setGroups((prev) => {
      const exists = prev.some((g) => g.id === updatedGroup.id);
      if (exists) {
        return prev.map((g) => (g.id === updatedGroup.id ? updatedGroup : g));
      }
      return [updatedGroup, ...prev];
    });

    if (currentClass.id === updatedGroup.id) {
      setCurrentClass(updatedGroup);
    }

    // Concordance: Automatically sync students enrolled in this group to have the new teacher name and language
    setStudents((prev) =>
      prev.map((s) => {
        if (s.classGroupId === updatedGroup.id) {
          return {
            ...s,
            teacherId: updatedGroup.teacherId,
            teacherName: updatedGroup.teacherName,
            language: updatedGroup.language,
            level: updatedGroup.level,
          };
        }
        return s;
      })
    );
  };

  const handleAdminDeleteClass = (groupId: string) => {
    // Cascade delete: remove students and alerts for this class
    setStudents((prev) => prev.filter((s) => s.classGroupId !== groupId));
    const studentIdsInGroup = new Set(
      students.filter((s) => s.classGroupId === groupId).map((s) => s.id)
    );
    setAlerts((prev) => prev.filter((a) => !studentIdsInGroup.has(a.studentId)));

    setGroups((prev) => prev.filter((g) => g.id !== groupId));
    if (currentClass.id === groupId) {
      const remaining = groups.filter((g) => g.id !== groupId);
      if (remaining.length > 0) {
        setCurrentClass(remaining[0]);
      }
    }
  };

  // Add a student to a class with teacher and language concordance
  const handleAddStudent = (studentData: Omit<Student, 'id'>) => {
    const newId = Date.now();
    const newStudent: Student = {
      ...studentData,
      id: newId,
    };
    setStudents((prev) => [...prev, newStudent]);

    // Update group counts
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === studentData.classGroupId) {
          return {
            ...g,
            totalStudents: g.totalStudents + 1,
            presentCount: studentData.status === 'P' ? g.presentCount + 1 : g.presentCount,
          };
        }
        return g;
      })
    );

    if (currentClass.id === studentData.classGroupId) {
      setCurrentClass((prev) => ({
        ...prev,
        totalStudents: prev.totalStudents + 1,
        presentCount: studentData.status === 'P' ? prev.presentCount + 1 : prev.presentCount,
      }));
    }
  };

  // Delete a student from a class
  const handleDeleteStudent = (studentId: number) => {
    const targetStudent = students.find((s) => s.id === studentId);
    if (!targetStudent) return;

    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    setAlerts((prev) => prev.filter((a) => a.studentId !== studentId));

    // Update group student count
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === targetStudent.classGroupId) {
          return {
            ...g,
            totalStudents: Math.max(0, g.totalStudents - 1),
            presentCount: targetStudent.status === 'P' ? Math.max(0, g.presentCount - 1) : g.presentCount,
            absentCount: targetStudent.status === 'A' ? Math.max(0, g.absentCount - 1) : g.absentCount,
          };
        }
        return g;
      })
    );

    if (currentClass.id === targetStudent.classGroupId) {
      setCurrentClass((prev) => ({
        ...prev,
        totalStudents: Math.max(0, prev.totalStudents - 1),
        presentCount: targetStudent.status === 'P' ? Math.max(0, prev.presentCount - 1) : prev.presentCount,
        absentCount: targetStudent.status === 'A' ? Math.max(0, prev.absentCount - 1) : prev.absentCount,
      }));
    }
  };

  const handleLogin = (selectedRole: UserRole, customUserName?: string) => {
    setRole(selectedRole);
    setIsAuthenticated(true);
    if (customUserName) {
      if (selectedRole === 'teacher') {
        setTeacherProfile((prev) => ({ ...prev, name: customUserName }));
      }
    }

    if (selectedRole === 'student') {
      const camila = students.find((s) => s.id === 2) || students[0];
      setSelectedStudent(camila);
    } else if (selectedRole === 'admin') {
      setSelectedStudent(null);
      setActiveTab('grupos'); // Open Logistics Control Dashboard
    } else {
      setSelectedStudent(null);
      setActiveTab('asistencia');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedStudent(null);
  };

  // If not logged in, show Seattle App Login Screen
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const pendingAlertCount = alerts.filter((a) => a.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col font-sans select-none antialiased">
      {/* Admin Exclusive: Edit Class / Assign Professor Modal */}
      <EditClassAdminModal
        isOpen={isAdminEditModalOpen}
        onClose={() => {
          setIsAdminEditModalOpen(false);
          setAdminEditingClass(null);
        }}
        classGroup={adminEditingClass}
        teachers={teachers}
        onSave={handleAdminSaveClass}
        onDelete={handleAdminDeleteClass}
      />

      {/* Top App Header */}
      <Header
        activeRole={role}
        currentTab={activeTab}
        showBack={selectedStudent !== null}
        title={
          selectedStudent
            ? `Alumno: ${selectedStudent.name}`
            : activeTab === 'asistencia'
            ? 'Pase De Lista'
            : activeTab === 'alertas'
            ? 'Alertas Y Avisos'
            : activeTab === 'grupos'
            ? role === 'admin'
              ? 'Logística & Control'
              : 'Cursos de Idiomas'
            : 'Mi Cuenta'
        }
        unreadAlertCount={pendingAlertCount}
        onBack={() => setSelectedStudent(null)}
        onOpenNotifications={() => {
          setSelectedStudent(null);
          setActiveTab('alertas');
        }}
        onOpenProfile={() => {
          setSelectedStudent(null);
          setActiveTab('micuenta');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-y-auto">
        {selectedStudent ? (
          <StudentDetailScreen
            student={selectedStudent}
            onBack={() => setSelectedStudent(null)}
            onJustifyAbsence={handleJustifyAbsence}
          />
        ) : (
          <>
            {activeTab === 'asistencia' && (
              <AttendanceRosterScreen
                students={students}
                currentClass={currentClass}
                availableClasses={groups}
                onChangeClass={setCurrentClass}
                onUpdateStatus={handleUpdateStatus}
                onMarkAllPresent={handleMarkAllPresent}
                onSelectStudent={(student) => setSelectedStudent(student)}
                onSaveAndSendAlerts={handleSaveAndSendAlerts}
                onSaveDraft={() => alert('Borrador de asistencia guardado')}
                onEditCurrentClass={() => {
                  setAdminEditingClass(currentClass);
                  setIsAdminEditModalOpen(true);
                }}
                onAddStudent={handleAddStudent}
                onDeleteStudent={handleDeleteStudent}
                onDeleteFinishedLevel={handleAdminDeleteClass}
                onAddNewClass={() => {
                  setAdminEditingClass(null);
                  setIsAdminEditModalOpen(true);
                }}
                role={role}
              />
            )}

            {activeTab === 'alertas' && (
              <AlertsCenterScreen
                alerts={alerts}
                onSendSingleAlert={handleSendSingleAlert}
                onSendAllAlerts={handleSaveAndSendAlerts}
                onSelectStudentDetail={(studentId) => {
                  const student = students.find((s) => s.id === studentId);
                  if (student) setSelectedStudent(student);
                }}
              />
            )}

            {activeTab === 'grupos' && (
              <>
                {role === 'admin' ? (
                  <AdminLogisticsDashboard
                    groups={groups}
                    teachers={teachers}
                    students={students}
                    onAddNewClass={() => {
                      setAdminEditingClass(null);
                      setIsAdminEditModalOpen(true);
                    }}
                    onEditClass={(group) => {
                      setAdminEditingClass(group);
                      setIsAdminEditModalOpen(true);
                    }}
                    onOpenTeacherAttendance={(group) => {
                      setCurrentClass(group);
                      setActiveTab('asistencia');
                    }}
                    onDeleteGroup={handleAdminDeleteClass}
                    onAddStudent={handleAddStudent}
                    onDeleteStudent={handleDeleteStudent}
                  />
                ) : (
                  <GroupsScreen
                    groups={groups}
                    activeClass={currentClass}
                    teachers={teachers}
                    students={students}
                    role={role}
                    onSelectGroup={(grp) => {
                      setCurrentClass(grp);
                    }}
                    onStartAttendance={(grp) => {
                      setCurrentClass(grp);
                      setActiveTab('asistencia');
                    }}
                    onUpdateGroup={handleAdminSaveClass}
                    onAddGroup={handleAdminSaveClass}
                    onDeleteGroup={handleAdminDeleteClass}
                    onAddStudent={handleAddStudent}
                    onDeleteStudent={handleDeleteStudent}
                  />
                )}
              </>
            )}

            {activeTab === 'micuenta' && (
              <ProfileScreen
                role={role}
                onChangeRole={(newRole) => {
                  setRole(newRole);
                  if (newRole === 'student') {
                    const camila = students.find((s) => s.id === 2) || students[0];
                    setSelectedStudent(camila);
                  } else if (newRole === 'admin') {
                    setSelectedStudent(null);
                    setActiveTab('grupos');
                  } else {
                    setSelectedStudent(null);
                    setActiveTab('asistencia');
                  }
                }}
                onLogout={handleLogout}
                teacherProfile={teacherProfile}
                onUpdateTeacherProfile={setTeacherProfile}
                classGroups={groups}
                teachers={teachers}
                onUpdateGroup={handleAdminSaveClass}
                onAddGroup={handleAdminSaveClass}
                onDeleteGroup={handleAdminDeleteClass}
                onOpenAdminLogistics={() => setActiveTab('grupos')}
              />
            )}
          </>
        )}
      </main>

      {/* Persistent Bottom Navigation with Role Awareness */}
      <BottomNav
        activeTab={activeTab}
        pendingAlertsCount={pendingAlertCount}
        role={role}
        onChangeTab={(tab) => {
          setSelectedStudent(null);
          setActiveTab(tab);
        }}
      />
    </div>
  );
}
