import { useState } from 'react';
import { 
  GraduationCap, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  LogOut, 
  Calendar,
  AlertTriangle,
  BookOpen,
  Table
} from 'lucide-react';
import { sound } from '../utils/sound';
import type { GoipClass } from '../types';

interface HeaderProps {
  currentClass?: GoipClass | null;
  activeView: 'table' | 'guide';
  warningCount?: number;
  onSelectView: (view: 'table' | 'guide') => void;
  onOpenSchedule: () => void;
  onOpenWarnings?: () => void;
  onLeave?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentClass,
  activeView,
  warningCount = 0,
  onSelectView,
  onOpenSchedule,
  onOpenWarnings,
  onLeave,
}) => {
  const [soundOn, setSoundOn] = useState(sound.isSoundEnabled());
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleSound = () => {
    const newState = sound.toggleSound();
    setSoundOn(newState);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const todayStr = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 transition-all shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div 
            onClick={() => onSelectView('table')}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 cursor-pointer"
          >
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span 
                onClick={() => onSelectView('table')}
                className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-700 via-indigo-800 to-sky-600 bg-clip-text text-transparent cursor-pointer"
              >
                고입패스 365
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 hidden sm:inline-block">
                중3 고입·원서 포털
              </span>
            </div>
            {currentClass ? (
              <p className="text-xs text-slate-500 font-medium truncate max-w-[200px] sm:max-w-xs">
                {currentClass.school_name} {currentClass.grade}학년 {currentClass.class_num}반 (담임: {currentClass.teacher_name})
              </p>
            ) : (
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                중3 담임선생님을 위한 고입 진학 지도 & 전기·후기 원서 통합 관리
              </p>
            )}
          </div>
        </div>

        {/* Center: Main View Switcher (When logged into a class) */}
        {currentClass && (
          <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200 text-xs font-extrabold">
            <button
              onClick={() => onSelectView('table')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeView === 'table'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="w-4 h-4" />
              <span>학생 원서 관리</span>
            </button>

            <button
              onClick={() => onSelectView('guide')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeView === 'guide'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span>고입 필수 지침 백과</span>
            </button>

            <button
              onClick={onOpenSchedule}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>전형 캘린더</span>
            </button>
          </div>
        )}

        {/* Right Tools */}
        <div className="flex items-center gap-2 shrink-0">
          {warningCount > 0 && onOpenWarnings && (
            <button
              onClick={onOpenWarnings}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold transition-all animate-pulse cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">이중지원 주의</span>
              <span>{warningCount}건</span>
            </button>
          )}

          <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-500 font-medium px-3 py-1 bg-slate-100 rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{todayStr}</span>
          </div>

          <button
            onClick={toggleSound}
            title={soundOn ? '효과음 끄기' : '효과음 켜기'}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-indigo-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          <button
            onClick={toggleFullscreen}
            title="전체화면"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors hidden sm:inline-flex cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {onLeave && (
            <button
              onClick={onLeave}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">학급 나가기</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
