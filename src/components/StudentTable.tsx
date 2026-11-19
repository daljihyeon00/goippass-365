import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Download, 
  ArrowUpDown, 
  AlertTriangle,
  School,
  FileCheck2,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import type { GoipStudent, EarlyStatus, LateStatus } from '../types';
import { supabase } from '../lib/supabase';
import { sound } from '../utils/sound';

interface StudentTableProps {
  students: GoipStudent[];
  classCode: string;
  onEditStudent: (student: GoipStudent) => void;
  onAddStudent: () => void;
  onExportCSV: () => void;
  onRefresh: () => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  classCode: _classCode,
  onEditStudent,
  onAddStudent,
  onExportCSV,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'num' | 'gpa' | 'name'>('num');

  const handleDelete = async (student: GoipStudent) => {
    if (window.confirm(`${student.student_num}번 ${student.name} 학생의 고입 정보를 삭제하시겠습니까?`)) {
      await supabase.from('goip_students').delete().eq('id', student.id);
      sound.playPop();
      onRefresh();
    }
  };

  const handleToggleParentAgreed = async (student: GoipStudent) => {
    sound.playPop();
    await supabase
      .from('goip_students')
      .update({ parent_agreed: !student.parent_agreed })
      .eq('id', student.id);
    onRefresh();
  };

  // Status Badge Renderers
  const renderEarlyBadge = (status: EarlyStatus, schoolName?: string | null) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-extrabold border border-emerald-300 shadow-2xs">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            최종합격 ({schoolName})
          </span>
        );
      case 'first_passed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 text-[11px] font-bold border border-purple-200">
            <Sparkles className="w-3 h-3 text-purple-600" />
            1차합격 ({schoolName})
          </span>
        );
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-sky-100 text-sky-800 text-[11px] font-bold">
            <FileCheck2 className="w-3 h-3 text-sky-600" />
            접수완료
          </span>
        );
      case 'writing':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800 text-[11px] font-bold">
            <Clock className="w-3 h-3 text-amber-600" />
            작성중
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 text-[11px] font-medium border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-500" />
            불합격
          </span>
        );
      default:
        return <span className="text-[11px] text-slate-400 font-medium">미지원</span>;
    }
  };

  const renderLateBadge = (status: LateStatus, schoolName?: string | null) => {
    switch (status) {
      case 'assigned':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-extrabold border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            배정완료 {schoolName ? `(${schoolName})` : ''}
          </span>
        );
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-100 text-indigo-800 text-[11px] font-bold">
            <FileCheck2 className="w-3 h-3 text-indigo-600" />
            원서접수완료
          </span>
        );
      case 'writing':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800 text-[11px] font-bold">
            <Clock className="w-3 h-3 text-amber-600" />
            원서작성중
          </span>
        );
      default:
        return <span className="text-[11px] text-slate-400 font-medium">대기</span>;
    }
  };

  // Filter & Search
  const filteredStudents = students
    .filter((s) => {
      // Search
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(s.student_num).includes(searchTerm) ||
        (s.hope_school_1 && s.hope_school_1.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.early_school && s.early_school.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.late_school_1 && s.late_school_1.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchSearch) return false;

      // Filter
      if (filterType === 'early') return s.early_status !== 'none';
      if (filterType === 'accepted') return s.early_status === 'accepted';
      if (filterType === 'late') return s.late_status === 'submitted' || s.late_status === 'assigned';
      if (filterType === 'pending') return s.early_status === 'none' && s.late_status === 'ready';

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'gpa') {
        const gpaA = a.gpa_percent ?? 999;
        const gpaB = b.gpa_percent ?? 999;
        return gpaA - gpaB;
      }
      if (sortBy === 'name') return a.name.localeCompare(b.name, 'ko');
      return a.student_num - b.student_num;
    });

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4 p-5 sm:p-6">
      {/* Control Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search & Filter pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative min-w-[200px]">
            <input
              type="text"
              placeholder="학생 이름, 번호, 고교명 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3.5 py-2 pl-9 rounded-xl border border-slate-300 text-xs outline-none focus:border-indigo-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Filter Pills */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600 overflow-x-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                filterType === 'all' ? 'bg-white text-indigo-700 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              전체 ({students.length})
            </button>
            <button
              onClick={() => setFilterType('early')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                filterType === 'early' ? 'bg-white text-indigo-700 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              전기고 ({students.filter((s) => s.early_status !== 'none').length})
            </button>
            <button
              onClick={() => setFilterType('accepted')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                filterType === 'accepted' ? 'bg-white text-emerald-700 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              최종합격 ({students.filter((s) => s.early_status === 'accepted').length})
            </button>
            <button
              onClick={() => setFilterType('late')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                filterType === 'late' ? 'bg-white text-indigo-700 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              후기고접수 ({students.filter((s) => s.late_status === 'submitted' || s.late_status === 'assigned').length})
            </button>
            <button
              onClick={() => setFilterType('pending')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                filterType === 'pending' ? 'bg-white text-amber-700 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              상담요망 ({students.filter((s) => s.early_status === 'none' && s.late_status === 'ready').length})
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Sort selector */}
          <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'num' | 'gpa' | 'name')}
              className="bg-transparent outline-none cursor-pointer"
            >
              <option value="num">번호순</option>
              <option value="gpa">내신 성적순 (백분율↑)</option>
              <option value="name">이름순</option>
            </select>
          </div>

          <button
            onClick={onExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>엑셀(CSV) 저장</span>
          </button>

          <button
            onClick={onAddStudent}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>학생 추가</span>
          </button>
        </div>
      </div>

      {/* High School Admission Master Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/90 text-slate-700 font-extrabold border-b border-slate-200">
              <th className="py-3 px-3 w-14 text-center">번호</th>
              <th className="py-3 px-3 min-w-[90px]">이름</th>
              <th className="py-3 px-3 min-w-[110px]">내신 성적</th>
              <th className="py-3 px-3 min-w-[150px]">희망 학교 (1·2·3지망)</th>
              <th className="py-3 px-3 min-w-[180px]">전기고 원서 지원 (특성화/과고/마이스터)</th>
              <th className="py-3 px-3 min-w-[180px]">후기고 원서 지원 (일반고/외고/자사고)</th>
              <th className="py-3 px-3 min-w-[90px] text-center">학부모동의</th>
              <th className="py-3 px-3 min-w-[150px]">상담 및 비고</th>
              <th className="py-3 px-3 w-20 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  <School className="w-10 h-10 mx-auto mb-2 text-slate-200" />
                  <p className="text-sm font-semibold">조건에 맞는 학생 정보가 없습니다.</p>
                </td>
              </tr>
            ) : (
              filteredStudents.map((s) => {
                const isDoubleViolation =
                  s.early_status === 'accepted' && (s.late_status === 'writing' || s.late_status === 'submitted');

                return (
                  <tr
                    key={s.id}
                    className={`hover:bg-indigo-50/40 transition-colors ${
                      isDoubleViolation ? 'bg-rose-50/70 font-semibold' : ''
                    }`}
                  >
                    {/* Number */}
                    <td className="py-3 px-3 text-center font-bold text-slate-700">
                      {s.student_num}
                    </td>

                    {/* Name */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-900 text-sm">{s.name}</span>
                        <span className="text-[10px] px-1 py-0.2 rounded bg-slate-100 text-slate-500 font-semibold">
                          {s.gender === 'M' ? '남' : '여'}
                        </span>
                      </div>
                      {isDoubleViolation && (
                        <span className="text-[10px] text-rose-600 font-bold flex items-center gap-0.5 mt-0.5">
                          <AlertTriangle className="w-3 h-3" /> 이중지원주의
                        </span>
                      )}
                    </td>

                    {/* Grades / GPA */}
                    <td className="py-3 px-3">
                      {s.gpa_percent != null ? (
                        <div>
                          <span className="font-mono font-black text-indigo-700 text-sm">
                            {s.gpa_percent}%
                          </span>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1">
                            {s.rank_in_school && <span>{s.rank_in_school}등</span>}
                            {s.gpa_score != null && <span>({s.gpa_score}점)</span>}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-medium">산출전</span>
                      )}
                    </td>

                    {/* Hope schools */}
                    <td className="py-3 px-3">
                      {s.hope_school_1 ? (
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-800 truncate max-w-[140px]">
                            1지망: {s.hope_school_1}
                          </p>
                          {s.hope_school_2 && (
                            <p className="text-[11px] text-slate-400 truncate max-w-[140px]">
                              2지망: {s.hope_school_2}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">희망 미기재</span>
                      )}
                    </td>

                    {/* Early Admission Status & Dates */}
                    <td className="py-3 px-3">
                      {s.early_school ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 truncate max-w-[130px]">
                              {s.early_school}
                            </span>
                            {renderEarlyBadge(s.early_status)}
                          </div>
                          {s.early_major && (
                            <p className="text-[11px] text-slate-500 truncate">
                              학과: {s.early_major} ({s.early_apply_type || '일반전형'})
                            </p>
                          )}
                          {s.early_apply_date && (
                            <p className="text-[10px] text-sky-700 font-mono">
                              원서접수: {s.early_apply_date} (마감 {s.early_deadline || '-'})
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">미지원</span>
                      )}
                    </td>

                    {/* Late Admission Status & Dates */}
                    <td className="py-3 px-3">
                      {s.late_school_1 ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 truncate max-w-[130px]">
                              {s.late_school_1}
                            </span>
                            {renderLateBadge(s.late_status, s.late_assigned_school)}
                          </div>
                          {s.late_school_2 && (
                            <p className="text-[11px] text-slate-500 truncate">
                              2지망: {s.late_school_2} ({s.late_apply_type || '일반고 평준화'})
                            </p>
                          )}
                          {s.late_apply_date && (
                            <p className="text-[10px] text-indigo-700 font-mono">
                              원서접수: {s.late_apply_date} (마감 {s.late_deadline || '-'})
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">대기중</span>
                      )}
                    </td>

                    {/* Parent Agreed */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleToggleParentAgreed(s)}
                        className={`text-xs px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          s.parent_agreed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-400 hover:text-slate-600'
                        }`}
                        title="클릭하여 동의서 수합 여부 변경"
                      >
                        {s.parent_agreed ? '제출완료' : '미제출'}
                      </button>
                    </td>

                    {/* Notes / Counseling */}
                    <td className="py-3 px-3">
                      {s.counseling_notes ? (
                        <p className="text-slate-600 truncate max-w-[140px]" title={s.counseling_notes}>
                          {s.counseling_notes}
                        </p>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                      {s.counseling_count > 0 && (
                        <span className="text-[10px] font-bold text-indigo-600">
                          상담 {s.counseling_count}회
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onEditStudent(s)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          title="고입 정보 수정"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(s)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
