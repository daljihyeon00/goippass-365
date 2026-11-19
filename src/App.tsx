import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { EntryView } from './components/EntryView';
import { DashboardStats } from './components/DashboardStats';
import { StudentTable } from './components/StudentTable';
import { ScheduleModal } from './components/ScheduleModal';
import { StudentEditModal } from './components/StudentEditModal';
import { StudentAddModal } from './components/StudentAddModal';
import { GuideView } from './components/GuideView';
import { supabase } from './lib/supabase';
import { exportStudentsToCSV } from './utils/exportCsv';
import type { GoipClass, GoipStudent, GoipSchedule } from './types';

export function App() {
  const [classCode, setClassCode] = useState<string>('');
  const [currentClass, setCurrentClass] = useState<GoipClass | null>(null);
  const [students, setStudents] = useState<GoipStudent[]>([]);
  const [schedules, setSchedules] = useState<GoipSchedule[]>([]);

  // Active view: 'table' (Master table) or 'guide' (Admission handbook & rules)
  const [activeView, setActiveView] = useState<'table' | 'guide'>('table');

  // Modals
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<GoipStudent | null>(null);

  const [loading, setLoading] = useState(false);

  // URL query param check
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get('code');
    if (codeParam) {
      setClassCode(codeParam.toUpperCase());
    }
  }, []);

  // Fetch Class Data & Students & Schedules
  const fetchClassData = async (code: string) => {
    setLoading(true);
    try {
      // 1. Class info
      const { data: classData } = await supabase
        .from('goip_classes')
        .select('*')
        .eq('code', code)
        .single();

      if (classData) setCurrentClass(classData);

      // 2. Students
      const { data: studentsData } = await supabase
        .from('goip_students')
        .select('*')
        .eq('class_code', code)
        .order('student_num', { ascending: true });

      if (studentsData) setStudents(studentsData);

      // 3. Schedules
      const { data: schedulesData } = await supabase
        .from('goip_schedules')
        .select('*')
        .eq('class_code', code)
        .order('apply_end_date', { ascending: true });

      if (schedulesData) setSchedules(schedulesData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classCode) {
      fetchClassData(classCode);

      // Setup Supabase Realtime Subscription
      const channel = supabase
        .channel(`goip:${classCode}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'goip_students', filter: `class_code=eq.${classCode}` },
          () => {
            fetchClassData(classCode);
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'goip_schedules', filter: `class_code=eq.${classCode}` },
          () => {
            fetchClassData(classCode);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [classCode]);

  const handleEnterClass = (code: string) => {
    setClassCode(code);
    window.history.pushState({}, '', `?code=${code}`);
  };

  const handleLeave = () => {
    if (window.confirm('현재 학급 고입 관리 화면에서 나가시겠습니까?')) {
      setClassCode('');
      setCurrentClass(null);
      setStudents([]);
      setSchedules([]);
      setActiveView('table');
      window.history.pushState({}, '', window.location.pathname);
    }
  };

  const handleExport = () => {
    if (currentClass) {
      exportStudentsToCSV(students, currentClass);
    }
  };

  // Double application warning count
  const doubleViolationCount = students.filter(
    (s) => s.early_status === 'accepted' && (s.late_status === 'writing' || s.late_status === 'submitted')
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Header
        currentClass={currentClass}
        activeView={activeView}
        warningCount={doubleViolationCount}
        onSelectView={(v) => setActiveView(v)}
        onOpenSchedule={() => setIsScheduleOpen(true)}
        onOpenWarnings={() => {
          setActiveView('table');
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
        onLeave={classCode ? handleLeave : undefined}
      />

      <main className="flex-1">
        {!classCode ? (
          <EntryView onEnterClass={handleEnterClass} />
        ) : loading && !currentClass ? (
          <div className="min-h-[80vh] flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-600">학급 고입 데이터를 불러오는 중...</p>
            </div>
          </div>
        ) : (
          <div>
            {activeView === 'table' ? (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                {/* Dashboard Stats */}
                <DashboardStats
                  students={students}
                  schedules={schedules}
                  onOpenSchedule={() => setIsScheduleOpen(true)}
                  onFilterStatus={() => {}}
                />

                {/* Students Master Table */}
                <StudentTable
                  students={students}
                  classCode={classCode}
                  onEditStudent={(s) => setEditingStudent(s)}
                  onAddStudent={() => setIsAddStudentOpen(true)}
                  onExportCSV={handleExport}
                  onRefresh={() => fetchClassData(classCode)}
                />
              </div>
            ) : (
              <GuideView />
            )}
          </div>
        )}
      </main>

      {/* Schedule Modal */}
      {isScheduleOpen && (
        <ScheduleModal
          classCode={classCode}
          schedules={schedules}
          onClose={() => setIsScheduleOpen(false)}
          onRefresh={() => fetchClassData(classCode)}
        />
      )}

      {/* Student Edit Modal */}
      {editingStudent && (
        <StudentEditModal
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onRefresh={() => fetchClassData(classCode)}
        />
      )}

      {/* Student Add Modal */}
      {isAddStudentOpen && (
        <StudentAddModal
          classCode={classCode}
          nextStudentNum={students.length > 0 ? Math.max(...students.map(s => s.student_num)) + 1 : 1}
          onClose={() => setIsAddStudentOpen(false)}
          onRefresh={() => fetchClassData(classCode)}
        />
      )}
    </div>
  );
}

export default App;
