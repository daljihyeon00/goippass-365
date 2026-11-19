import { useState } from 'react';
import { 
  BookOpen, 
  Compass, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  School, 
  Lightbulb, 
  ShieldAlert, 
  FileText
} from 'lucide-react';

export const GuideView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'districts' | 'rules' | 'simultaneous' | 'gpa' | 'faq'>('districts');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      q: '일반계 고등학교 1지망과 2지망에는 같은 학교를 중복해서 쓸 수 있나요?',
      a: '절대 불가합니다. 1지망과 2지망에 동일한 고등학교를 중복 기재할 경우 나이스(NEIS) 고입 시스템에서 오류가 발생하거나 해당 지망이 무효 처리됩니다. 반드시 서로 다른 학교를 기재해야 합니다.',
    },
    {
      q: '전기고(특성화고나 마이스터고)에 합격했는데, 등록을 포기하고 후기고(일반고)에 원서를 넣을 수 있나요?',
      a: '불가능합니다! 초·중등교육법 시행령 제85조에 따라 전기고에 최종 합격한 학생은 "등록 여부와 무관하게" 당해 학년도 후기고(일반고, 자사고, 외고 등)에 일체 지원할 수 없습니다. 이를 어기고 후기고에 원서를 접수하면 두 학교 합격이 모두 취소됩니다.',
    },
    {
      q: '특성화고 "취업희망자 특별전형"에 불합격하면, 특성화고 "일반전형"에 다시 지원할 수 있나요?',
      a: '네, 가능합니다! 특성화고 취업희망자 특별전형(11월 중순)에 불합격한 학생은 12월 초에 실시되는 특성화고 일반전형에 재지원할 수 있습니다. (단, 특별전형에 합격한 학생은 일반전형에 재지원 불가)',
    },
    {
      q: '외고나 자사고에 1지망으로 지원했다가 떨어지면 일반고를 아예 못 가나요?',
      a: '아닙니다! "동시지원(동시선발) 제도"에 의해 외고/국제고/자사고 지원자도 후기고 일반고 배정에 함께 참여할 수 있습니다. 외고·자사고를 1지망으로 기재하고, 불합격 시 2단계(지역학군)부터 일반고 추첨 배정 대상자가 됩니다.',
    },
    {
      q: '광역학군(1단계)과 지역학군(2단계)은 어떻게 다른가요?',
      a: '광역학군은 "부산광역시/시도 전체" 평준화 일반고 중 학생이 원하는 학교를 1·2지망으로 선택하는 단계이고, 지역학군은 "학생 주민등록등본상 거주지가 속한 학교군(예: 서부학군, 남부학군 등)" 내에 있는 일반고 중 1·2지망을 선택하는 단계입니다.',
    },
    {
      q: '희망하는 인기 학교만 1, 2지망에 썼다가 모두 떨어지면 어떻게 되나요?',
      a: '1단계(광역)와 2단계(지역)에서 모두 정원 초과로 추첨 탈락할 경우, 3단계(통합/지리정보 배정)로 넘어가 거주지 기준 통학 거리와 학교별 결원을 고려하여 컴퓨터가 임의 배정합니다. 이 경우 원거리 통학 학교로 튕길 위험이 있으므로, 2지망에는 비교적 통학이 수월하고 정원 여유가 있는 학교를 안정 지원하는 전략이 권장됩니다.',
    },
    {
      q: '과학고에 지원했다가 불합격하면 영재학교나 마이스터고를 쓸 수 있나요?',
      a: '영재학교는 전기고 이전(4~7월)에 전형이 끝나므로 불가능하며, 과학고 불합격 시점(11월 말~12월 초)에는 마이스터고 원서 접수가 이미 마감되어 있습니다. 따라서 과학고 불합격자는 12월에 실시되는 "후기고(외고, 자사고, 일반고)"에 지원해야 합니다.',
    },
    {
      q: '위장전입으로 거주지 학군을 옮겨서 원서를 쓰면 어떻게 되나요?',
      a: '실제 거주하지 않으면서 친척집이나 다른 학군으로 주민등록만 이전한 "위장전입"이 적발될 경우, 고등학교 입학 허가가 즉시 취소되며 주민등록법 위반으로 형사 고발 조치될 수 있으므로 담임교사는 반드시 실거주 여부를 확인해야 합니다.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-150">
      {/* Title Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-sky-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold mb-3 text-indigo-100">
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>2026학년도 고등학교 입학전형 기본 지침 & 배정 규칙 해설서</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            중3 담임선생님 필수 고입 지침 백과
          </h2>
          <p className="text-indigo-100 text-xs sm:text-sm font-medium leading-relaxed max-w-2xl">
            광역학군 vs 지역학군 지망 요령부터 전기/후기 이중지원 금지 규칙, 외고·자사고 동시지원, 
            내신 석차백분율 산출 기준까지 진학 상담 시 반드시 알아야 할 핵심 규정을 완벽 정리했습니다.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-xs text-indigo-100 shrink-0">
          <ShieldAlert className="w-5 h-5 text-amber-300 shrink-0" />
          <span>초·중등교육법 시행령<br /><strong>제85조 등 고입 법령 완벽 반영</strong></span>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs overflow-x-auto">
        {[
          { id: 'districts', label: '1. 광역 vs 지역학군 지망 방식', icon: <Compass className="w-4 h-4" /> },
          { id: 'rules', label: '2. 전기고 vs 후기고 & 이중지원 금지', icon: <AlertTriangle className="w-4 h-4" /> },
          { id: 'simultaneous', label: '3. 외고·자사고 일반고 동시지원', icon: <School className="w-4 h-4" /> },
          { id: 'gpa', label: '4. 내신 성적 & 석차백분율(%) 산출', icon: <FileText className="w-4 h-4" /> },
          { id: 'faq', label: '5. 고입 상담 필수 FAQ Top 8', icon: <HelpCircle className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* --- SECTION 1: DISTRICTS (광역 vs 지역학군 지망 요령) --- */}
      {activeTab === 'districts' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">
                평준화 일반고 배정 단계별 구조
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                일반계 고등학교 1단계(광역학군) vs 2단계(지역학군) 배정 방식
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                부산/광역시 평준화 일반고는 <strong>선지원 후추첨</strong> 방식으로 3단계에 걸쳐 배정이 이루어집니다.
              </p>
            </div>

            {/* 3 Steps Visual Flow */}
            <div className="bg-indigo-900 text-white p-4 rounded-2xl mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-amber-400 text-slate-900 text-xs font-black rounded-lg">후기고 4개 지망</span>
                <span className="text-xs sm:text-sm font-bold">1·2지망 = 광역학군(시/도 전역) | 3·4지망 = 지역학군(거주지 관할)</span>
              </div>
              <span className="hidden sm:inline-block text-xs text-indigo-200">총 4개 학교 분산 지원 가능</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Step 1 */}
              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-3 relative overflow-hidden">
                <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-mono font-black text-xs flex items-center justify-center shadow-xs">
                  1단계
                </span>
                <h4 className="font-extrabold text-slate-900 text-base">
                  광역학군 배정 (후기고 1·2지망)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  <strong>거주지 학군에 상관없이 시/도 전체</strong> 평준화 일반고 중 
                  학생이 가장 희망하는 학교 <strong>2개교(1지망, 2지망)</strong>를 선택 지원합니다.
                </p>
                <div className="p-3 bg-white rounded-xl border border-indigo-100 text-[11px] text-indigo-900 font-semibold">
                  📌 예: 강서구 명지동 학생도 해운대구, 남구, 부산진구 등 시 전역 고교 1·2지망 가능
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200/80 space-y-3 relative overflow-hidden">
                <span className="w-7 h-7 rounded-lg bg-sky-600 text-white font-mono font-black text-xs flex items-center justify-center shadow-xs">
                  2단계
                </span>
                <h4 className="font-extrabold text-slate-900 text-base">
                  지역학군 배정 (후기고 3·4지망)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  1단계에서 배정받지 못한 학생들을 대상으로, <strong>학생 주민등록등본상 주소지가 속한 거주지 학교군</strong> 내 고교 중 <strong>2개교(3지망, 4지망)</strong>를 지원합니다.
                </p>
                <div className="p-3 bg-white rounded-xl border border-sky-100 text-[11px] text-sky-900 font-semibold">
                  📌 예: 서부학군 학생은 서부학교군(사하구·강서구·서구) 내 일반고만 3·4지망에 기재
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-3 relative overflow-hidden">
                <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-mono font-black text-xs flex items-center justify-center shadow-xs">
                  3단계
                </span>
                <h4 className="font-extrabold text-slate-900 text-base">
                  통합/지리정보 배정 (약 10~20%)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  1단계와 2단계에서 모두 정원 초과로 추첨 탈락한 학생들을 <strong>거주지 통학거리와 대중교통편, 학교별 정원</strong>을 종합 고려하여 컴퓨터 전산 무작위 배정합니다.
                </p>
                <div className="p-3 bg-white rounded-xl border border-emerald-100 text-[11px] text-emerald-900 font-semibold">
                  ⚠️ 인기 학교만 쓰다 탈락 시 통학 1시간 이상의 원거리 배정 위험 발생
                </div>
              </div>
            </div>

            {/* Strategic Advice Card */}
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200/80 space-y-3">
              <h4 className="font-black text-sm text-amber-900 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                담임선생님을 위한 일반고 지망 순위 작성 지도 꿀팁
              </h4>
              <ul className="space-y-2 text-xs text-amber-950 font-medium">
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-amber-600">1.</span>
                  <span><strong>중복 지원 절대 금지:</strong> 1지망에 쓴 학교를 2지망에 똑같이 쓰면 무효 처리됩니다. 1단계와 2단계에 기재하는 학교는 각기 다른 학교여야 합니다. (단, 1단계에 쓴 학교를 2단계 지역학군 1지망에 쓰는 것은 가능)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-amber-600">2.</span>
                  <span><strong>소신 + 안정 분산 전략:</strong> 1지망에 지원 경쟁률이 매우 높은 인기 학교를 썼다면, 2지망에는 반드시 거주지 인근에서 통학이 가능하고 정원 미달/수용 여력이 있는 학교를 써야 3단계 원거리 튕김을 방지할 수 있습니다.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-amber-600">3.</span>
                  <span><strong>남녀공학 vs 단성 고교 확인:</strong> 학생과 학부모가 내신 유불리 또는 면학 분위기를 이유로 남고/여고 또는 공학을 기피하는 경우가 많으므로 원서 작성 전 학교 성별 구분을 필히 확인해야 합니다.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* --- SECTION 2: RULES (전기 vs 후기 & 이중지원 금지) --- */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-extrabold text-rose-600 uppercase tracking-wider">
                고입 핵심 법령 (초·중등교육법 시행령 제85조)
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                전기고 vs 후기고 구분 및 이중지원 금지 원칙
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                고등학교는 전형 시기에 따라 <strong>전기고</strong>와 <strong>후기고</strong>로 엄격히 나뉘며, 위반 시 합격이 전면 취소됩니다.
              </p>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
                    <th className="py-3 px-4 w-28">구분</th>
                    <th className="py-3 px-4">해당 고등학교 유형</th>
                    <th className="py-3 px-4 w-32">전형 시기</th>
                    <th className="py-3 px-4 min-w-[200px]">지원 룰 & 핵심 주의사항</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  <tr className="bg-sky-50/30">
                    <td className="py-3.5 px-4 font-black text-sky-800">전기고</td>
                    <td className="py-3.5 px-4">
                      • 과학고등학교<br />
                      • 마이스터고(산업수요맞춤형고)<br />
                      • 특성화고 (특별전형 / 일반전형)<br />
                      • 예술고 / 체육고등학교
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">8월 ~ 12월 초</td>
                    <td className="py-3.5 px-4 text-sky-950">
                      <strong>전국에서 오직 1개 학교만 지원 가능!</strong><br />
                      <span className="text-rose-600 font-bold">⚠️ 최종 합격 시 등록을 포기하더라도 후기고 지원 절대 불가!</span>
                    </td>
                  </tr>
                  <tr className="bg-indigo-50/30">
                    <td className="py-3.5 px-4 font-black text-indigo-800">후기고</td>
                    <td className="py-3.5 px-4">
                      • 평준화 일반계 고등학교<br />
                      • 자율형사립고 (자사고: 현대청운고, 해운대고 등)<br />
                      • 외국어고 (부산외고 등) / 국제고 (부산국제고 등)<br />
                      • 자율형공립고 (자공고)
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">12월 초 ~ 1월</td>
                    <td className="py-3.5 px-4 text-indigo-950">
                      • 전기고 불합격자 및 전기고 미지원자만 지원 가능<br />
                      • 자사고/외고/국제고와 일반고는 <strong>동시지원 가능</strong>
                    </td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-600">특례 (영재교)</td>
                    <td className="py-3.5 px-4">
                      • 과학영재학교 (한국과학영재학교, 서울과고 등)
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">4월 ~ 7월</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      영재교육진흥법을 따르므로 전기고 제한을 받지 않음. (불합격 시 과고, 마이스터고, 일반고 모두 지원 가능)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Critical Rules Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                <h5 className="font-black text-xs text-rose-800 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  이중지원 절대 금지 사례 (합격 무효 처리)
                </h5>
                <ul className="text-xs text-rose-950 space-y-1 font-medium list-disc list-inside">
                  <li>전기고 2개 학교에 동시에 원서를 넣는 행위</li>
                  <li>전기고에 합격한 후 후기고(일반고/외고 등)에 원서를 넣는 행위</li>
                  <li>타 시·도 전기고와 부산 시내 전기고를 동시 지원하는 행위</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <h5 className="font-black text-xs text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  예외적으로 허용되는 재지원 사례
                </h5>
                <ul className="text-xs text-emerald-950 space-y-1 font-medium list-disc list-inside">
                  <li>특성화고 특별전형에 탈락한 후, 특성화고 일반전형에 재지원</li>
                  <li>전기고(과고/마이스터/특성화)에 불합격한 후 12월 후기고 지원</li>
                  <li>영재학교 전형 종료 후 과학고 지원</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SECTION 3: SIMULTANEOUS (외고·자사고 일반고 동시지원) --- */}
      {activeTab === 'simultaneous' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">
                후기고 동시선발 제도 안내
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                외국어고 · 국제고 · 자율형사립고(자사고)와 일반고 동시지원 제도
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                헌법재판소 결정에 따라 자사고·외고 지원자도 불합격 시 일반고 배정에 참여할 수 있습니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200/70 space-y-3">
                <h4 className="font-extrabold text-sm text-indigo-950 flex items-center gap-2">
                  <School className="w-4 h-4 text-indigo-600" />
                  자사고·외고 지원 시 일반고 원서 작성 요령
                </h4>
                <ul className="space-y-2 text-xs text-indigo-950 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-mono text-[10px] flex items-center justify-center shrink-0">1</span>
                    <span><strong>1지망(후기고 1단계):</strong> 희망하는 외고, 국제고, 또는 자사고(해운대고, 현대청운고 등) 1개교를 기재합니다.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-mono text-[10px] flex items-center justify-center shrink-0">2</span>
                    <span><strong>동시지원 동의서 서명:</strong> 원서 접수 시 "일반고 동시지원 동의서"를 반드시 함께 제출합니다.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-mono text-[10px] flex items-center justify-center shrink-0">3</span>
                    <span><strong>2단계(지역학군) 일반고 기재:</strong> 혹시 모를 탈락에 대비하여 거주지 학군 내 일반고 1지망, 2지망을 사전에 기재해 둡니다.</span>
                  </li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  동시지원 시 담임선생님이 주의해야 할 사항
                </h4>
                <ul className="space-y-2 text-xs text-slate-600 font-medium">
                  <li>
                    • 자사고/외고에 지원하면 <strong>1단계(광역학군) 일반고 지원 자격은 자동 소멸</strong>됩니다.
                  </li>
                  <li>
                    • 불합격할 경우 <strong>2단계(지역학군 3·4지망)부터 일반고 추첨에 참여</strong>하게 되므로, 지역학군 지망에 쓴 학교도 정원이 차 있으면 3단계 임의배정으로 넘어갈 수 있습니다.
                  </li>
                  <li>
                    • 따라서 자사고/외고를 지원하는 학생에게는 지역학군 일반고 3·4지망을 신중하고 안정적으로 고르도록 상담해야 합니다.
                  </li>
                </ul>
              </div>
            </div>

            {/* 특목고·외고·자사고 1·2·3차 전형 구조 안내 */}
            <div className="p-6 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-sm text-purple-950 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-purple-600 text-white text-xs flex items-center justify-center font-bold">★</span>
                  특목고(외고·국제고·과고) 및 자율형사립고(자사고) 1·2·3차 다단계 전형 절차
                </h4>
                <span className="text-[11px] font-bold text-purple-700 bg-white px-2.5 py-1 rounded-full border border-purple-200">
                  단계별 탈락/합격 관리
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-4 rounded-xl border border-purple-100 space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-black text-[11px]">1차 전형</span>
                    <strong className="text-slate-900">서류 평가 & 내신 선발</strong>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    중학교 교과 성취도(외고: 영어, 과고: 수학·과학)와 출결 감점을 합산하여 <strong>모집정원의 1.5배수 ~ 2배수</strong>를 1차 합격자로 선발합니다.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-purple-100 space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-black text-[11px]">2차 전형</span>
                    <strong className="text-slate-900">심층 면접 & 실기평가</strong>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    1차 합격자를 대상으로 자기소개서, 학교생활기록부 기반 <strong>자기주도학습영역 및 인성영역 개별 심층 면접</strong>을 실시합니다.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-purple-100 space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-black text-[11px]">3차 전형</span>
                    <strong className="text-slate-900">최종 합격자 사정/발표</strong>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    <strong>1차 성적 + 2차 면접 점수</strong>를 합산하여 최종 합격자를 결정합니다. 최종 합격 시 후기고 등록이 확정되며, 불합격자는 일반고 동시지원 추첨에 참가합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SECTION 4: GPA (내신 성적 & 석차백분율 산출) --- */}
      {activeTab === 'gpa' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">
                고입 전형 총점 산출 지침
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                중학교 내신 성적 산출 및 석차백분율(%) 해석법
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                고입 선발의 기준이 되는 300점 만점 내신 총점과 석차백분율 산출 구조입니다.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200/70 space-y-3">
                <h4 className="font-extrabold text-sm text-indigo-950">
                  교과성적 (80% / 240점 만점)
                </h4>
                <p className="text-xs text-indigo-900 leading-relaxed font-medium">
                  1학년, 2학년, 3학년 교과 성취도(A, B, C, D, E) 및 원점수, 과목별 이수 단위를 합산하여 반영합니다. (3학년 2학기 지필/수행평가 성적까지 모두 반영)
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 space-y-3">
                <h4 className="font-extrabold text-sm text-emerald-950">
                  비교과성적 (20% / 60점 만점)
                </h4>
                <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                  출결 상황 (무단/질병 결석 및 지각·조퇴 감점), 봉사활동 실적, 행동특성 및 자율/동아리/진로활동 평가 점수를 합산하여 산출합니다.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                💡 주요 고교 유형별 통상 합격선(커트라인) 가이드 (참고용)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 block">부산과학고</span>
                  <span className="text-indigo-600 font-extrabold text-sm">상위 1~3%</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">수학·과학 올A 필수</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 block">부산소마고</span>
                  <span className="text-indigo-600 font-extrabold text-sm">상위 10~25%</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">SW적성/면접 비중 큼</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 block">부산외국어고</span>
                  <span className="text-indigo-600 font-extrabold text-sm">상위 15~30%</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">영어 2·3학년 성취도</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 block">일반고 평준화</span>
                  <span className="text-indigo-600 font-extrabold text-sm">상위 95~98%</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">탈락선 관리 필수</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SECTION 5: FAQ (자주 묻는 질문 아코디언) --- */}
      {activeTab === 'faq' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">
                담임선생님 진학 상담 실전 Q&A
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                학부모 & 학생들이 가장 많이 묻는 고입 질문 Top 8
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                상담 전화가 오거나 교무실 면담 시 클릭 한 번으로 명쾌하게 안내하실 수 있습니다.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 bg-slate-50/80 hover:bg-slate-100 text-left flex items-center justify-between gap-4 cursor-pointer transition-colors"
                  >
                    <span className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                        Q
                      </span>
                      {faq.q}
                    </span>
                    {openFaqIndex === idx ? (
                      <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {openFaqIndex === idx && (
                    <div className="p-4 sm:p-5 bg-white border-t border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      <span className="font-black text-indigo-600 mr-2">A.</span>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
