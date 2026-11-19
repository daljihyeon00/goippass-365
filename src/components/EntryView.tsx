import { useState } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  FileCheck, 
  AlertTriangle, 
  ArrowRight, 
  Zap, 
  Lock,
  Plus
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { sound } from '../utils/sound';

interface EntryViewProps {
  onEnterClass: (classCode: string) => void;
}

export const EntryView: React.FC<EntryViewProps> = ({ onEnterClass }) => {
  const [tab, setTab] = useState<'login' | 'create'>('login');
  const [code, setCode] = useState('');
  const [pin, setPin] = useState('');

  // Create form
  const [schoolName, setSchoolName] = useState('오션중학교');
  const [year, setYear] = useState(2026);
  const [grade, setGrade] = useState(3);
  const [classNum, setClassNum] = useState(10);
  const [teacherName, setTeacherName] = useState('');
  const [newPin, setNewPin] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let res = '';
    for (let i = 0; i < 6; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const cleanCode = code.trim().toUpperCase();

    if (!cleanCode || !pin.trim()) {
      setErrorMsg('학급 코드와 비밀번호를 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('goip_classes')
        .select('*')
        .eq('code', cleanCode)
        .single();

      if (error || !data) {
        setErrorMsg('존재하지 않는 학급 코드입니다.');
        setLoading(false);
        return;
      }

      if (data.teacher_pin !== pin.trim()) {
        setErrorMsg('비밀번호가 일치하지 않습니다.');
        setLoading(false);
        return;
      }

      sound.playSuccess();
      onEnterClass(cleanCode);
    } catch (err) {
      console.error(err);
      setErrorMsg('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!schoolName.trim() || !teacherName.trim() || !newPin.trim()) {
      setErrorMsg('학교명, 담임선생님 성함, 비밀번호를 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const generatedCode = generateCode();
      const { error } = await supabase.from('goip_classes').insert({
        code: generatedCode,
        year: Number(year),
        grade: Number(grade),
        class_num: Number(classNum),
        school_name: schoolName.trim(),
        teacher_name: teacherName.trim(),
        teacher_pin: newPin.trim(),
      });

      if (error) throw error;

      sound.playSuccess();
      onEnterClass(generatedCode);
    } catch (err) {
      console.error(err);
      setErrorMsg('학급 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setCode('OCEAN310');
    setPin('1234');
    setTab('login');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-50/40 via-white to-slate-50">
      <div className="max-w-4xl mx-auto w-full">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 text-indigo-800 text-xs font-bold shadow-xs">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>중3 담임선생님을 위한 고입 원서 & 진학 지도 포털</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            복잡한 고입 지도, 한눈에 정리하는{' '}
            <span className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-sky-600 bg-clip-text text-transparent">
              고입패스 365
            </span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            전기고(과고·마이스터·특성화)와 후기고(외고·자사고·일반고) 원서 접수 일정부터 
            학생별 내신 성적, 희망학교, 원서 진행 상태, 이중지원 방지까지 완벽하게 관리하세요.
          </p>
        </div>

        {/* Card Container */}
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl shadow-indigo-100/70 border border-slate-200/80 p-6 sm:p-8">
          {errorMsg && (
            <div className="mb-5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Tab Switch */}
          <div className="flex border-b border-slate-100 mb-6">
            <button
              onClick={() => { setTab('login'); setErrorMsg(null); }}
              className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                tab === 'login'
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              학급 열기 (로그인)
            </button>
            <button
              onClick={() => { setTab('create'); setErrorMsg(null); }}
              className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                tab === 'create'
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              새 학급 개설
            </button>
          </div>

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  학급 코드 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="예: OCEAN310"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 text-center tracking-widest uppercase font-mono text-lg font-bold rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  담임 관리 비밀번호 <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="비밀번호 입력"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 outline-none text-sm transition-all"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white font-extrabold text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? '확인 중...' : '고입 관리 화면 열기'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-3 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={handleQuickDemo}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>체험용 학급 (오션중 3학년 10반) 바로 채우기</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">학년도</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">학년</label>
                  <input
                    type="number"
                    value={grade}
                    onChange={(e) => setGrade(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">반</label>
                  <input
                    type="number"
                    value={classNum}
                    onChange={(e) => setClassNum(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  학교명 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="예: 오션중학교"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  담임교사 성함 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="예: 문지현 선생님"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  학급 관리 비밀번호 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="비밀번호 4자리 이상"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 text-sm font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>{loading ? '개설 중...' : '새 학급 고입 관리 시작하기'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
              <Calendar className="w-4 h-4" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 mb-1">전기·후기 일정 & D-Day</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              과고, 마이스터고, 특성화고, 자사고, 일반고 원서 접수 및 면접, 합격 발표 D-Day 자동 계산
            </p>
          </div>

          <div className="p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-3">
              <FileCheck className="w-4 h-4" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 mb-1">내신 성적 & 원서 현황</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              내신 석차백분율(%), 총점, 1·2·3지망 희망학교 및 실제 원서 접수처 실시간 추적
            </p>
          </div>

          <div className="p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 mb-1">이중지원 금지 방지</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              전기고 합격 시 후기고 원서 지원 불가 규정을 시스템에서 자동으로 검증 및 경고
            </p>
          </div>

          <div className="p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 mb-1">진학 상담 & 엑셀 보고서</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              학부모 동의서 제출 여부, 상담 이력 관리 및 교육청/교과협의록용 엑셀(CSV) 원클릭 출력
            </p>
          </div>
        </div>
      </div>

      <footer className="text-center mt-8 text-xs text-slate-400">
        <p>고입패스 365 • 대한민국 중학교 3학년 담임선생님을 위한 고입 진학 지도 시스템</p>
      </footer>
    </div>
  );
};
