import { useState } from 'react';
import { 
  X, 
  Sparkles, 
  AlertTriangle,
  School,
  FileCheck2,
  MessageSquare,
  Award,
  Layers
} from 'lucide-react';
import type { GoipStudent, EarlyStatus, LateStatus } from '../types';
import { supabase } from '../lib/supabase';
import { sound } from '../utils/sound';

interface StudentEditModalProps {
  student: GoipStudent;
  onClose: () => void;
  onRefresh: () => void;
}

export const StudentEditModal: React.FC<StudentEditModalProps> = ({
  student,
  onClose,
  onRefresh,
}) => {
  const [name, setName] = useState(student.name);
  const [studentNum, setStudentNum] = useState(student.student_num);
  const [gender, setGender] = useState(student.gender);

  // Grades
  const [gpaPercent, setGpaPercent] = useState(student.gpa_percent ?? '');
  const [gpaScore, setGpaScore] = useState(student.gpa_score ?? '');
  const [rankInSchool, setRankInSchool] = useState(student.rank_in_school ?? '');

  // Hope schools
  const [hope1, setHope1] = useState(student.hope_school_1 ?? '');
  const [hope2, setHope2] = useState(student.hope_school_2 ?? '');
  const [hope3, setHope3] = useState(student.hope_school_3 ?? '');

  // Early admissions
  const [earlySchool, setEarlySchool] = useState(student.early_school ?? '');
  const [earlyMajor, setEarlyMajor] = useState(student.early_major ?? '');
  const [earlyApplyType, setEarlyApplyType] = useState(student.early_apply_type ?? '일반전형');
  const [earlyApplyDate, setEarlyApplyDate] = useState(student.early_apply_date ?? '');
  const [earlyDeadline, setEarlyDeadline] = useState(student.early_deadline ?? '');
  const [earlyStatus, setEarlyStatus] = useState<EarlyStatus>(student.early_status);
  const [earlyDocsChecked, setEarlyDocsChecked] = useState(student.early_docs_checked);

  // Late admissions (Up to 4 choices: 광역 1·2지망 + 지역 1·2지망)
  const [lateSchool1, setLateSchool1] = useState(student.late_school_1 ?? '');
  const [lateSchool2, setLateSchool2] = useState(student.late_school_2 ?? '');
  const [lateSchool3, setLateSchool3] = useState(student.late_school_3 ?? '');
  const [lateSchool4, setLateSchool4] = useState(student.late_school_4 ?? '');
  const [lateApplyType, setLateApplyType] = useState(student.late_apply_type ?? '일반고 평준화');
  const [lateApplyDate, setLateApplyDate] = useState(student.late_apply_date ?? '');
  const [lateDeadline, setLateDeadline] = useState(student.late_deadline ?? '');
  const [lateStatus, setLateStatus] = useState<LateStatus>(student.late_status);
  const [lateAssigned, setLateAssigned] = useState(student.late_assigned_school ?? '');

  // Multi-stage selection for Special / Foreign Language / Autonomous private schools
  const [stage1Result, setStage1Result] = useState(student.stage1_result ?? '대기');
  const [stage2Result, setStage2Result] = useState(student.stage2_result ?? '대기');
  const [stage3Result, setStage3Result] = useState(student.stage3_result ?? '대기');

  // Counseling
  const [parentAgreed, setParentAgreed] = useState(student.parent_agreed);
  const [counselingNotes, setCounselingNotes] = useState(student.counseling_notes ?? '');
  const [counselingCount, setCounselingCount] = useState(student.counseling_count ?? 0);

  const [loading, setLoading] = useState(false);

  // Check double application warning
  const isDoubleApplicationViolation = 
    earlyStatus === 'accepted' && (lateStatus === 'writing' || lateStatus === 'submitted');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isDoubleApplicationViolation) {
      if (!window.confirm('경고: 전기고 최종 합격자는 후기고에 지원할 수 없습니다. 계속 저장하시겠습니까?')) {
        return;
      }
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('goip_students')
        .update({
          name: name.trim(),
          student_num: Number(studentNum),
          gender,
          gpa_percent: gpaPercent !== '' ? Number(gpaPercent) : null,
          gpa_score: gpaScore !== '' ? Number(gpaScore) : null,
          rank_in_school: rankInSchool !== '' ? Number(rankInSchool) : null,
          hope_school_1: hope1.trim() || null,
          hope_school_2: hope2.trim() || null,
          hope_school_3: hope3.trim() || null,
          early_school: earlySchool.trim() || null,
          early_major: earlyMajor.trim() || null,
          early_apply_type: earlyApplyType.trim() || null,
          early_apply_date: earlyApplyDate || null,
          early_deadline: earlyDeadline || null,
          early_status: earlyStatus,
          early_docs_checked: earlyDocsChecked,
          late_school_1: lateSchool1.trim() || null,
          late_school_2: lateSchool2.trim() || null,
          late_school_3: lateSchool3.trim() || null,
          late_school_4: lateSchool4.trim() || null,
          late_apply_type: lateApplyType.trim() || null,
          late_apply_date: lateApplyDate || null,
          late_deadline: lateDeadline || null,
          late_status: lateStatus,
          late_assigned_school: lateAssigned.trim() || null,
          stage1_result: stage1Result,
          stage2_result: stage2Result,
          stage3_result: stage3Result,
          parent_agreed: parentAgreed,
          counseling_notes: counselingNotes.trim() || null,
          counseling_count: Number(counselingCount),
          updated_at: new Date().toISOString(),
        })
        .eq('id', student.id);

      if (error) throw error;

      sound.playSuccess();
      onRefresh();
      onClose();
    } catch (err) {
      console.error(err);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const isSpecialSchool = 
    lateApplyType?.includes('외고') || 
    lateApplyType?.includes('자사') || 
    lateApplyType?.includes('특목') ||
    lateSchool1?.includes('외국어') || 
    lateSchool1?.includes('자사') || 
    lateSchool1?.includes('국제') ||
    lateSchool1?.includes('해운대고') ||
    lateSchool1?.includes('청운고');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-6 sm:p-8 relative border border-slate-100 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-indigo-700 text-sm">
              {studentNum}
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>{name} 학생 고입 진학 카드</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  {gender === 'M' ? '남학생' : '여학생'}
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                내신 성적, 전기고, 후기고 4개 지망(광역·지역) 및 1·2·3차 전형 단계별 상태 관리
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-6 pt-4 pr-1">
          {/* Double application alert */}
          {isDoubleApplicationViolation && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>
                경고: 전기고(마이스터/특성화/예술고 등) 최종 합격자는 초·중등교육법 시행령 제85조에 따라 후기고 지원이 법적으로 금지되어 있습니다.
              </span>
            </div>
          )}

          {/* Section 1: Basic Info & GPA */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <h4 className="font-extrabold text-xs text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              1. 기본 인적사항 및 내신 성적
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">학번(번호)</label>
                <input
                  type="number"
                  value={studentNum}
                  onChange={(e) => setStudentNum(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">학생 이름</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">성별</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'M' | 'F')}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-bold"
                >
                  <option value="M">남 (M)</option>
                  <option value="F">여 (F)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">전교 석차 (등수)</label>
                <input
                  type="number"
                  placeholder="예: 15 (등)"
                  value={rankInSchool}
                  onChange={(e) => setRankInSchool(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">내신 석차백분율(%)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="예: 8.45"
                    value={gpaPercent}
                    onChange={(e) => setGpaPercent(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-bold text-indigo-700 font-mono"
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-400 font-bold">%</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">내신 총점 (300점 만점)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="예: 285.50"
                  value={gpaScore}
                  onChange={(e) => setGpaScore(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-bold font-mono"
                />
              </div>
            </div>

            {/* Hope schools */}
            <div className="pt-2 border-t border-slate-200/60">
              <label className="block text-[11px] font-bold text-slate-700 mb-2">학생 진로 및 희망 고등학교 (초기 지망 현황)</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="1지망 희망학교 (예: 부산외고)"
                  value={hope1}
                  onChange={(e) => setHope1(e.target.value)}
                  className="px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-semibold"
                />
                <input
                  type="text"
                  placeholder="2지망 희망학교 (예: 명지고)"
                  value={hope2}
                  onChange={(e) => setHope2(e.target.value)}
                  className="px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs"
                />
                <input
                  type="text"
                  placeholder="3지망 희망학교"
                  value={hope3}
                  onChange={(e) => setHope3(e.target.value)}
                  className="px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Early Admissions (전기고) */}
          <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs text-sky-950 uppercase tracking-wider flex items-center gap-1.5">
                <School className="w-4 h-4 text-sky-600" />
                2. 전기고 원서 지원 관리 (과고 · 마이스터고 · 특성화고 · 예술·체육고)
              </h4>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                전국 1개교만 지원 가능
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">전기고 지원 학교명</label>
                <input
                  type="text"
                  placeholder="미지원 시 비워둠 (예: 부산소마고)"
                  value={earlySchool}
                  onChange={(e) => setEarlySchool(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-bold text-sky-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">지원 학과 / 계열</label>
                <input
                  type="text"
                  placeholder="예: SW개발과, 조리과, 음악과"
                  value={earlyMajor}
                  onChange={(e) => setEarlyMajor(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">전형 유형</label>
                <input
                  type="text"
                  placeholder="예: 취업희망자 특별전형, 일반전형"
                  value={earlyApplyType}
                  onChange={(e) => setEarlyApplyType(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">원서 작성/접수일</label>
                <input
                  type="date"
                  value={earlyApplyDate}
                  onChange={(e) => setEarlyApplyDate(e.target.value)}
                  className="w-full px-2 py-1.5 bg-white rounded-xl border border-slate-300 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">접수 마감일</label>
                <input
                  type="date"
                  value={earlyDeadline}
                  onChange={(e) => setEarlyDeadline(e.target.value)}
                  className="w-full px-2 py-1.5 bg-white rounded-xl border border-slate-300 text-xs font-mono text-rose-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">전형 진행 상태</label>
                <select
                  value={earlyStatus}
                  onChange={(e) => setEarlyStatus(e.target.value as EarlyStatus)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-bold"
                >
                  <option value="none">미지원 (후기고 바로 지원)</option>
                  <option value="writing">원서 작성 중</option>
                  <option value="submitted">원서 접수 완료</option>
                  <option value="first_passed">1차 서류/실기 합격</option>
                  <option value="accepted">최종 합격 (🎉 고입확정/후기지원금지)</option>
                  <option value="rejected">불합격 (후기고 지원 가능)</option>
                </select>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs font-bold text-sky-900 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={earlyDocsChecked}
                onChange={(e) => setEarlyDocsChecked(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600"
              />
              <FileCheck2 className="w-4 h-4 text-sky-600" />
              <span>전기고 필수 구비 서류(입학원서, 학교생활기록부II, 자기소개서, 추천서) 확인 완료</span>
            </label>
          </div>

          {/* Section 3: Late Admissions (후기고) - 4 CHOICES & 1·2·3차 STAGES */}
          <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-extrabold text-xs text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                  <School className="w-4 h-4 text-indigo-600" />
                  3. 후기고 원서 지원 관리 (총 4개 지망 & 특목/자사 1·2·3차 전형)
                </h4>
                <p className="text-[11px] text-indigo-700 mt-0.5">
                  광역학군(1·2지망) + 지역학군(3·4지망) 총 4개 지망 지원 체계
                </p>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 self-start sm:self-center">
                12월 초 나이스 원서 접수
              </span>
            </div>

            {/* 4 Choices Grid */}
            <div className="bg-white p-4 rounded-2xl border border-indigo-100 space-y-3">
              <span className="text-xs font-black text-indigo-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                후기고 1지망 ~ 4지망 학교 입력 (총 4개 학교)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1st Choice */}
                <div className="p-3 bg-indigo-50/40 rounded-xl border border-indigo-100">
                  <label className="block text-[11px] font-extrabold text-indigo-900 mb-1">
                    후기 1지망 <span className="text-[10px] font-normal text-slate-500">(광역 1지망 or 특목/외고/자사고)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="예: 부산외국어고 또는 명지고"
                    value={lateSchool1}
                    onChange={(e) => setLateSchool1(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs font-bold text-indigo-900"
                  />
                </div>

                {/* 2nd Choice */}
                <div className="p-3 bg-indigo-50/40 rounded-xl border border-indigo-100">
                  <label className="block text-[11px] font-extrabold text-indigo-900 mb-1">
                    후기 2지망 <span className="text-[10px] font-normal text-slate-500">(광역 2지망 - 1지망과 다른 학교)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="예: 신호고등학교"
                    value={lateSchool2}
                    onChange={(e) => setLateSchool2(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs font-bold text-indigo-900"
                  />
                </div>

                {/* 3rd Choice */}
                <div className="p-3 bg-sky-50/40 rounded-xl border border-sky-100">
                  <label className="block text-[11px] font-extrabold text-sky-900 mb-1">
                    후기 3지망 <span className="text-[10px] font-normal text-slate-500">(지역학군 1지망 - 거주지 관할 고교)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="예: 경일고등학교 (거주지 학교군)"
                    value={lateSchool3}
                    onChange={(e) => setLateSchool3(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs font-bold text-sky-900"
                  />
                </div>

                {/* 4th Choice */}
                <div className="p-3 bg-sky-50/40 rounded-xl border border-sky-100">
                  <label className="block text-[11px] font-extrabold text-sky-900 mb-1">
                    후기 4지망 <span className="text-[10px] font-normal text-slate-500">(지역학군 2지망 - 통학 가능 안정교)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="예: 부경고등학교 (거주지 학교군)"
                    value={lateSchool4}
                    onChange={(e) => setLateSchool4(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs font-bold text-sky-900"
                  />
                </div>
              </div>
            </div>

            {/* Special / Foreign / Autonomous 1·2·3 Stage Progress */}
            <div className="bg-white p-4 rounded-2xl border border-indigo-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  특목고 · 외고 · 자사고 단계별 전형 현황 (1차 · 2차 · 3차)
                </span>
                {isSpecialSchool && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    특목/자사고 지원 학생
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1st Stage */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">
                    1차 전형 (서류 / 내신 선발)
                  </span>
                  <select
                    value={stage1Result}
                    onChange={(e) => setStage1Result(e.target.value)}
                    className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-bold ${
                      stage1Result === '합격' 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                        : stage1Result === '불합격'
                        ? 'bg-rose-50 border-rose-300 text-rose-800'
                        : 'bg-white border-slate-300 text-slate-700'
                    }`}
                  >
                    <option value="대기">1차 결과 대기</option>
                    <option value="합격">1차 서류/내신 합격 ✅</option>
                    <option value="불합격">1차 불합격 ❌</option>
                  </select>
                </div>

                {/* 2nd Stage */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">
                    2차 전형 (심층면접 / 실기평가)
                  </span>
                  <select
                    value={stage2Result}
                    onChange={(e) => setStage2Result(e.target.value)}
                    className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-bold ${
                      stage2Result === '합격' 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                        : stage2Result === '불합격'
                        ? 'bg-rose-50 border-rose-300 text-rose-800'
                        : 'bg-white border-slate-300 text-slate-700'
                    }`}
                  >
                    <option value="대기">2차 면접 대기</option>
                    <option value="합격">2차 면접/실기 합격 ✅</option>
                    <option value="불합격">2차 불합격 ❌</option>
                  </select>
                </div>

                {/* 3rd Stage */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">
                    3차 전형 (최종 합격자 발표)
                  </span>
                  <select
                    value={stage3Result}
                    onChange={(e) => setStage3Result(e.target.value)}
                    className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-bold ${
                      stage3Result === '최종합격' 
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-extrabold' 
                        : stage3Result === '불합격'
                        ? 'bg-rose-50 border-rose-300 text-rose-800'
                        : 'bg-white border-slate-300 text-slate-700'
                    }`}
                  >
                    <option value="대기">최종 발표 대기</option>
                    <option value="최종합격">🎉 최종 합격 (고입확정)</option>
                    <option value="불합격">불합격 (일반고 2단계 배정)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Application Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">전형 구분</label>
                <input
                  type="text"
                  placeholder="예: 일반고 평준화, 자기주도학습"
                  value={lateApplyType}
                  onChange={(e) => setLateApplyType(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">원서 작성/접수일</label>
                <input
                  type="date"
                  value={lateApplyDate}
                  onChange={(e) => setLateApplyDate(e.target.value)}
                  className="w-full px-2 py-1.5 bg-white rounded-xl border border-slate-300 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">접수 마감일</label>
                <input
                  type="date"
                  value={lateDeadline}
                  onChange={(e) => setLateDeadline(e.target.value)}
                  className="w-full px-2 py-1.5 bg-white rounded-xl border border-slate-300 text-xs font-mono text-rose-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">전체 진행 상태</label>
                <select
                  value={lateStatus}
                  onChange={(e) => setLateStatus(e.target.value as LateStatus)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-bold"
                >
                  <option value="ready">작성 대기</option>
                  <option value="writing">원서 작성 중</option>
                  <option value="submitted">원서 접수 완료</option>
                  <option value="first_passed">1차 서류통과 (특목/자사)</option>
                  <option value="second_passed">2차 면접통과 (특목/자사)</option>
                  <option value="assigned">최종 배정/합격 완료</option>
                  <option value="rejected">불합격</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">최종 배정/합격 고등학교 (결과 확정 시 입력)</label>
                <input
                  type="text"
                  placeholder="예: 명지고등학교 (1지망 배정)"
                  value={lateAssigned}
                  onChange={(e) => setLateAssigned(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-bold text-emerald-700"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Counseling & Parents */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-slate-600" />
              4. 진학 상담 이력 & 학부모 동의서 관리
            </h4>

            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={parentAgreed}
                  onChange={(e) => setParentAgreed(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <span className={parentAgreed ? 'text-emerald-700 font-extrabold' : 'text-slate-600'}>
                  {parentAgreed ? '✅ 고입 원서 지원 학부모 동의서 수합 완료' : '⚠️ 학부모 동의서 미제출'}
                </span>
              </label>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span>누적 고입 상담 횟수:</span>
                <input
                  type="number"
                  min={0}
                  value={counselingCount}
                  onChange={(e) => setCounselingCount(Number(e.target.value))}
                  className="w-16 px-2 py-1 bg-white rounded-lg border border-slate-300 text-xs font-bold text-center"
                />
                <span>회</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">담임선생님 진학 상담 메모 및 특이사항</label>
              <textarea
                rows={3}
                placeholder="예: 학생의 적성과 통학 거리를 고려하여 학부모 상담 진행. 자기소개서 초안 지도 완료."
                value={counselingNotes}
                onChange={(e) => setCounselingNotes(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs outline-none focus:border-indigo-500 leading-relaxed"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-md shadow-indigo-100 cursor-pointer disabled:opacity-50"
            >
              {loading ? '저장 중...' : '저장 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
