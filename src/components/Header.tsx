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
  School
} from 'lucide-react';
import { sound } from '../utils/sound';
import type { GoipClass } from '../types';

interface HeaderProps {
  currentClass?: GoipClass | null;
  warningCount?: number;
  onOpenWarnings?: () => void;
  onLeave?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentClass,
  warningCount = 0,
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-700 via-indigo-800 to-sky-600 bg-clip-text text-transparent">
                고입패스 365
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                중3 고입·원서 포털
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              중3 담임선생님을 위한 고입 진학 지도 & 전기·후기 원서 통합 관리
            </p>
          </div>
        </div>

        {/* Center: Class badge */}
        {currentClass && (
          <div className="hidden md:flex items-center gap-2.5 px-4 py-1.5 rounded-2xl bg-indigo-50/80 border border-indigo-200/70">
            <School className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-950">
              {currentClass.school_name} {currentClass.grade}학년 {currentClass.class_num}반
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-semibold text-indigo-700">
              담임: {currentClass.teacher_name}
            </span>
          </div>
        )}

        {/* Right Tools */}
        <div className="flex items-center gap-2">
          {warningCount > 0 && onOpenWarnings && (
            <button
              onClick={onOpenWarnings}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold transition-all animate-pulse cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>이중지원 주의 {warningCount}건</span>
            </button>
          )}

          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 font-medium px-3 py-1 bg-slate-100 rounded-xl">
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
              <span>학급 나가기</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
