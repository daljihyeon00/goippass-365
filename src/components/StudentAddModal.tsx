import { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
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
  const [hope1, setHope1] = useState('');
  const [hope2, setHope2] = useState('');
  const [earlySchool, setEarlySchool] = useState('');
  const [lateSchool, setLateSchool] = useState('');
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
        hope_school_1: hope1.trim() || null,
        hope_school_2: hope2.trim() || null,
        early_school: earlySchool.trim() || null,
        early_status: earlySchool.trim() ? 'writing' : 'none',
        late_school_1: lateSchool.trim() || null,
        late_status: 'ready',
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
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative border border-slate-100 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">새 학생 등록</h3>
              <p className="text-xs text-slate-500">기본 인적사항 및 초기 희망 학교 입력</p>
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
              <label className="block text-xs font-bold text-slate-700 mb-1">내신 총점 (선택)</label>
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

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">1지망 희망학교</label>
                <input
                  type="text"
                  placeholder="예: 부산소마고 또는 명지고"
                  value={hope1}
                  onChange={(e) => setHope1(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">2지망 희망학교</label>
                <input
                  type="text"
                  placeholder="예: 신호고"
                  value={hope2}
                  onChange={(e) => setHope2(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
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

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">후기고 1지망 계획</label>
                <input
                  type="text"
                  placeholder="예: 명지고 (일반고)"
                  value={lateSchool}
                  onChange={(e) => setLateSchool(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs"
                />
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
