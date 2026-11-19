import { useState } from 'react';
import { 
  X, 
  Calendar, 
  Plus, 
  Trash2, 
  Sparkles,
  School
} from 'lucide-react';
import type { GoipSchedule } from '../types';
import { supabase } from '../lib/supabase';
import { sound } from '../utils/sound';

interface ScheduleModalProps {
  classCode: string;
  schedules: GoipSchedule[];
  onClose: () => void;
  onRefresh: () => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  classCode,
  schedules,
  onClose,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'early' | 'late'>('all');
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [category, setCategory] = useState<'early' | 'late'>('early');
  const [schoolType, setSchoolType] = useState('특성화고(특별)');
  const [schoolName, setSchoolName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [resultDate, setResultDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const now = new Date();

  const getDDay = (targetDateStr: string) => {
    const target = new Date(targetDateStr);
    const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { text: '마감됨', color: 'bg-slate-200 text-slate-600' };
    if (diff === 0) return { text: 'D-DAY', color: 'bg-rose-500 text-white animate-pulse' };
    if (diff <= 3) return { text: `D-${diff}`, color: 'bg-rose-100 text-rose-700 font-bold border border-rose-300' };
    if (diff <= 7) return { text: `D-${diff}`, color: 'bg-amber-100 text-amber-800 font-bold' };
    return { text: `D-${diff}`, color: 'bg-indigo-50 text-indigo-700 font-semibold' };
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim() || !startDate || !endDate) {
      alert('학교명, 원서접수 시작일과 마감일을 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('goip_schedules').insert({
        class_code: classCode,
        category,
        school_type: schoolType,
        school_name: schoolName.trim(),
        apply_start_date: startDate,
        apply_end_date: endDate,
        interview_date: interviewDate || null,
        result_date: resultDate || null,
        notes: notes.trim() || null,
      });

      if (error) throw error;

      sound.playSuccess();
      setIsAdding(false);
      setSchoolName('');
      setStartDate('');
      setEndDate('');
      setInterviewDate('');
      setResultDate('');
      setNotes('');
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('일정 추가에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('이 전형 일정을 삭제하시겠습니까?')) {
      await supabase.from('goip_schedules').delete().eq('id', id);
      sound.playPop();
      onRefresh();
    }
  };

  const filtered = schedules.filter((s) => {
    if (activeTab === 'early') return s.category === 'early';
    if (activeTab === 'late') return s.category === 'late';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 relative border border-slate-100 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                전기고 & 후기고 전형 일정 캘린더
              </h3>
              <p className="text-xs text-slate-500">
                학교별 원서 접수, 면접 및 합격자 발표 D-Day 타임라인
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

        <div className="flex items-center justify-between gap-3 pt-4 pb-3">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'all' ? 'bg-white text-indigo-700 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              전체 ({schedules.length})
            </button>
            <button
              onClick={() => setActiveTab('early')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'early' ? 'bg-white text-indigo-700 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              전기고 ({schedules.filter((s) => s.category === 'early').length})
            </button>
            <button
              onClick={() => setActiveTab('late')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'late' ? 'bg-white text-indigo-700 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              후기고 ({schedules.filter((s) => s.category === 'late').length})
            </button>
          </div>

          <button
            onClick={() => setIsAdding(true)}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>새 전형 일정 추가</span>
          </button>
        </div>

        {isAdding && (
          <form onSubmit={handleCreate} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-4 space-y-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-black text-indigo-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                새로운 고등학교 전형 일정 등록
              </span>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                닫기 ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">전형 구분</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as 'early' | 'late')}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-bold"
                >
                  <option value="early">전기고 (과고/마이스터/특성화/예체능)</option>
                  <option value="late">후기고 (외고/자사고/일반고)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">학교 유형</label>
                <input
                  type="text"
                  placeholder="예: 마이스터고, 특성화고(특별), 일반고"
                  value={schoolType}
                  onChange={(e) => setSchoolType(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">학교명</label>
                <input
                  type="text"
                  placeholder="예: 부산소프트웨어마이스터고"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-bold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">원서 접수 시작일</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-2 py-1.5 bg-white rounded-xl border border-slate-300 text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">원서 접수 마감일</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-2 py-1.5 bg-white rounded-xl border border-slate-300 text-xs font-mono font-bold text-rose-600"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">면접/실기일 (선택)</label>
                <input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full px-2 py-1.5 bg-white rounded-xl border border-slate-300 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">합격자 발표일</label>
                <input
                  type="date"
                  value={resultDate}
                  onChange={(e) => setResultDate(e.target.value)}
                  className="w-full px-2 py-1.5 bg-white rounded-xl border border-slate-300 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">제출 서류 & 준비 메모</label>
              <input
                type="text"
                placeholder="예: 입학원서, 자소서, 추천서 2부 지참"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-1.5 bg-white rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 text-xs text-slate-500 font-bold cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                {loading ? '저장 중...' : '등록하기'}
              </button>
            </div>
          </form>
        )}

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-200" />
              <p className="text-sm font-medium">등록된 전형 일정이 없습니다.</p>
            </div>
          ) : (
            filtered.map((item) => {
              const dDay = getDDay(item.apply_end_date);

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50/80 hover:bg-white border border-slate-200 hover:border-indigo-300 transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        item.category === 'early' ? 'bg-sky-100 text-sky-800' : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {item.category === 'early' ? '전기고' : '후기고'}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                        {item.school_type}
                      </span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-black ${dDay.color}`}>
                        원서마감 {dDay.text}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-1.5">
                      <School className="w-4 h-4 text-indigo-600" />
                      {item.school_name}
                    </h4>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-medium">
                      <span>
                        <strong className="text-slate-800">원서 접수: </strong>
                        <span className="font-mono">{item.apply_start_date} ~ {item.apply_end_date}</span>
                      </span>
                      {item.interview_date && (
                        <span>
                          <strong className="text-slate-800">면접/실기: </strong>
                          <span className="font-mono">{item.interview_date}</span>
                        </span>
                      )}
                      {item.result_date && (
                        <span>
                          <strong className="text-slate-800">합격자 발표: </strong>
                          <span className="font-mono">{item.result_date}</span>
                        </span>
                      )}
                    </div>

                    {item.notes && (
                      <p className="text-[11px] text-slate-500 bg-white p-2 rounded-xl border border-slate-200/60 mt-1">
                        💡 {item.notes}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all self-end sm:self-center cursor-pointer"
                    title="일정 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
