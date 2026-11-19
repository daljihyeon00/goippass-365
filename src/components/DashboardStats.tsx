import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  Sparkles
} from 'lucide-react';
import type { GoipStudent, GoipSchedule } from '../types';

interface DashboardStatsProps {
  students: GoipStudent[];
  schedules: GoipSchedule[];
  onOpenSchedule: () => void;
  onFilterStatus: (filterType: string) => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  students,
  schedules,
  onOpenSchedule,
  onFilterStatus,
}) => {
  // Statistics calculations
  const total = students.length;
  const boys = students.filter((s) => s.gender === 'M').length;
  const girls = students.filter((s) => s.gender === 'F').length;

  // GPA stats
  const studentsWithGpa = students.filter((s) => s.gpa_percent != null);
  const avgGpa = studentsWithGpa.length > 0
    ? (studentsWithGpa.reduce((acc, s) => acc + Number(s.gpa_percent), 0) / studentsWithGpa.length).toFixed(1)
    : '0.0';

  // Early admissions stats
  const earlyApplicants = students.filter((s) => s.early_status !== 'none');
  const earlyAccepted = students.filter((s) => s.early_status === 'accepted');

  // Late admissions stats
  const lateApplicants = students.filter((s) => s.late_status === 'submitted' || s.late_status === 'assigned');
  
  // Pending students (no early application and late status is still 'ready')
  const pendingCount = students.filter((s) => s.early_status === 'none' && s.late_status === 'ready').length;

  // Double application check: Early accepted students CANNOT apply to late schools!
  const doubleApplicationViolations = students.filter(
    (s) => s.early_status === 'accepted' && (s.late_status === 'writing' || s.late_status === 'submitted')
  );

  // Calculate upcoming deadlines from schedules
  const now = new Date();
  const sortedSchedules = [...schedules]
    .map((sch) => {
      const end = new Date(sch.apply_end_date);
      const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return { ...sch, diffDays };
    })
    .sort((a, b) => a.diffDays - b.diffDays);

  const urgentSchedule = sortedSchedules.find((s) => s.diffDays >= 0);

  return (
    <div className="space-y-4">
      {/* Critical Violation Alert */}
      {doubleApplicationViolations.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 shadow-md animate-bounce">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-black text-sm text-rose-800">
                🚨 [고입 중대 경고] 이중지원 금지 규정 위반 주의 ({doubleApplicationViolations.length}명)
              </h4>
              <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                전기고(마이스터고/특성화고/예술고 등)에 <strong>최종 합격한 학생</strong>은 초·중등교육법 시행령 제85조에 따라 
                후기고(일반고/외고/자사고 등)에 <strong>원서를 접수할 수 없습니다</strong>. 위반 시 합격이 모두 취소됩니다!
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {doubleApplicationViolations.map((s) => (
                  <span key={s.id} className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-rose-200 text-rose-900">
                    {s.student_num}번 {s.name} (전기고: {s.early_school} 합격)
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Students */}
        <div 
          onClick={() => onFilterStatus('all')}
          className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 shadow-2xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">학급 재적</span>
            <Users className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-slate-900">{total}<span className="text-xs font-medium text-slate-400 ml-1">명</span></p>
          <p className="text-[11px] text-slate-500 mt-0.5">남 {boys}명 · 여 {girls}명</p>
        </div>

        {/* GPA Average */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">내신 평균(%)</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{avgGpa}<span className="text-xs font-medium text-slate-400 ml-1">%</span></p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">석차백분율 기준</p>
        </div>

        {/* Early Applicants */}
        <div 
          onClick={() => onFilterStatus('early')}
          className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-sky-400 shadow-2xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">전기고 지원</span>
            <Sparkles className="w-4 h-4 text-sky-500 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-sky-950">{earlyApplicants.length}<span className="text-xs font-medium text-slate-400 ml-1">명</span></p>
          <p className="text-[11px] text-sky-600 font-semibold mt-0.5">과고/마이스터/특성화</p>
        </div>

        {/* Early Accepted */}
        <div 
          onClick={() => onFilterStatus('accepted')}
          className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 shadow-2xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">전기고 최종합격</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-emerald-600">{earlyAccepted.length}<span className="text-xs font-medium text-slate-400 ml-1">명</span></p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">고입 확정 완료 🎉</p>
        </div>

        {/* Late Applicants */}
        <div 
          onClick={() => onFilterStatus('late')}
          className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 shadow-2xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">후기고 접수</span>
            <Clock className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-indigo-950">{lateApplicants.length}<span className="text-xs font-medium text-slate-400 ml-1">명</span></p>
          <p className="text-[11px] text-indigo-600 font-semibold mt-0.5">일반고/외고/자사고</p>
        </div>

        {/* Pending / Attention needed */}
        <div 
          onClick={() => onFilterStatus('pending')}
          className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-400 shadow-2xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">상담 요망/미정</span>
            <AlertTriangle className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-amber-700">{pendingCount}<span className="text-xs font-medium text-slate-400 ml-1">명</span></p>
          <p className="text-[11px] text-amber-600 font-semibold mt-0.5">원서 대기 중</p>
        </div>
      </div>

      {/* Quick Schedule D-Day Bar */}
      {urgentSchedule && (
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-xl bg-amber-400 text-slate-950 font-black text-xs">
              {urgentSchedule.diffDays === 0 ? 'D-DAY' : `D-${urgentSchedule.diffDays}`}
            </span>
            <div>
              <p className="text-xs text-indigo-200 font-medium">
                가장 가까운 원서 마감 일정:
              </p>
              <h5 className="font-extrabold text-sm text-white">
                [{urgentSchedule.category === 'early' ? '전기고' : '후기고'}] {urgentSchedule.school_name} 원서 마감일 ({urgentSchedule.apply_end_date})
              </h5>
            </div>
          </div>

          <button
            onClick={onOpenSchedule}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>전체 전형 캘린더 보기 ({schedules.length}건)</span>
          </button>
        </div>
      )}
    </div>
  );
};
