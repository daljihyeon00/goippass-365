import { useState } from 'react';
import { X, UserPlus, Layers } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { sound } from '../utils/sound';

interface StudentAddModalProps {
  classCode: string;
  nextStudentNum: number;
  onClose: () => void;
  onRefresh: () => void;
}

export const StudentAddModal: React.FC<StudentAddModalProps> = ({
  classCode,
  nextStudentNum,
  onClose,
  onRefresh,
}) => {
  const [studentNum, setStudentNum] = useState(nextStudentNum);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [gpaPercent, setGpaPercent] = useState('');
  const [gpaScore, setGpaScore] = useState('');
  const [earlySchool, setEarlySchool] = useState('');
  
  // Late admissions 4 choices
  const [lateSchool1, setLateSchool1] = useState('');
  const [lateSchool2, setLateSchool2] = useState('');
  const [lateSchool3, setLateSchool3] = useState('');
  const [lateSchool4, setLateSchool4] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('goip_students').insert({
        class_code: classCode,
        student_num: Number(studentNum),
        name: name.trim(),
        gender,
        gpa_percent: gpaPercent !== '' ? Number(gpaPercent) : null,
        gpa_score: gpaScore !== '' ? Number(gpaScore) : null,
        hope_school_1: lateSchool1.trim() || earlySchool.trim() || null,
        hope_school_2: lateSchool2.trim() || null,
        early_school: earlySchool.trim() || null,
        early_status: earlySchool.trim() ? 'writing' : 'none',
        late_school_1: lateSchool1.trim() || null,
        late_school_2: lateSchool2.trim() || null,
        late_school_3: lateSchool3.trim() || null,
        late_school_4: lateSchool4.trim() || null,
        late_status: 'ready',
        stage1_result: '대기',
        stage2_result: '대기',
        stage3_result: '대기',
        parent_agreed: false,
      });

      if (error) throw error;

      sound.playSuccess();
      onRefresh();
      onClose();
    } catch (err) {
      console.error(err);
      alert('학생 추가에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative border border-slate-100 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">새 학생 등록</h3>
              <p className="text-xs text-slate-500">기본 인적사항 및 전기·후기 지망 학교(1~4지망) 입력</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">번호</label>
              <input
                type="number"
                value={studentNum}
                onChange={(e) => setStudentNum(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs font-bold"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">이름</label>
              <input
                type="text"
                placeholder="예: 홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs font-bold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">성별</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'M' | 'F')}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs font-bold"
              >
                <option value="M">남 (M)</option>
                <option value="F">여 (F)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">내신 석차백분율(%)</label>
              <input
                type="number"
                step="0.01"
                placeholder="예: 15.20"
                value={gpaPercent}
                onChange={(e) => setGpaPercent(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs font-mono font-bold text-indigo-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">내신 총점</label>
              <input
                type="number"
                step="0.01"
                placeholder="예: 275.5"
                value={gpaScore}
                onChange={(e) => setGpaScore(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs font-mono"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">전기고 지원 계획</label>
              <input
                type="text"
                placeholder="예: 부산소마고 (미지원 시 공란)"
                value={earlySchool}
                onChange={(e) => setEarlySchool(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            {/* Late 4 Choices */}
            <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-2">
              <label className="block text-xs font-black text-indigo-950 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                후기고 1지망 ~ 4지망 계획 (총 4개 학교)
              </label>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">후기 1지망 (광역 1 or 특목/자사)</label>
                  <input
                    type="text"
                    placeholder="예: 부산외고 또는 명지고"
                    value={lateSchool1}
                    onChange={(e) => setLateSchool1(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">후기 2지망 (광역 2지망)</label>
                  <input
                    type="text"
                    placeholder="예: 신호고"
                    value={lateSchool2}
                    onChange={(e) => setLateSchool2(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">후기 3지망 (지역학군 1지망)</label>
                  <input
                    type="text"
                    placeholder="예: 경일고"
                    value={lateSchool3}
                    onChange={(e) => setLateSchool3(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">후기 4지망 (지역학군 2지망)</label>
                  <input
                    type="text"
                    placeholder="예: 부경고"
                    value={lateSchool4}
                    onChange={(e) => setLateSchool4(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold cursor-pointer hover:bg-slate-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
            >
              {loading ? '추가 중...' : '학생 등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
