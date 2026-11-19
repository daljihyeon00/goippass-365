import type { GoipStudent, GoipClass } from '../types';
import { sound } from './sound';

export function exportStudentsToCSV(students: GoipStudent[], currentClass: GoipClass) {
  sound.playSuccess();

  const headers = [
    '번호',
    '이름',
    '성별',
    '내신석차백분율(%)',
    '내신총점(300점)',
    '전교석차',
    '1지망희망학교',
    '2지망희망학교',
    '3지망희망학교',
    '전기고_지원학교',
    '전기고_학과/계열',
    '전기고_전형유형',
    '전기고_원서작성접수일',
    '전기고_접수마감일',
    '전기고_진행상태',
    '전기고_서류확인',
    '후기고_1지망학교(광역1)',
    '후기고_2지망학교(광역2)',
    '후기고_3지망학교(지역1)',
    '후기고_4지망학교(지역2)',
    '특목자사_1차결과',
    '특목자사_2차결과',
    '특목자사_3차결과',
    '후기고_전형유형',
    '후기고_원서작성접수일',
    '후기고_접수마감일',
    '후기고_진행상태',
    '최종배정/합격고등학교',
    '학부모동의서수합',
    '누적상담횟수',
    '담임진학상담메모',
  ];

  const statusEarlyLabel: Record<string, string> = {
    none: '미지원',
    writing: '원서작성중',
    submitted: '접수완료',
    first_passed: '1차합격',
    accepted: '최종합격',
    rejected: '불합격',
  };

  const statusLateLabel: Record<string, string> = {
    ready: '작성대기',
    writing: '원서작성중',
    submitted: '원서접수완료',
    first_passed: '1차합격(서류)',
    second_passed: '2차합격(면접)',
    assigned: '배정/최종합격',
    rejected: '불합격',
  };

  const rows = students.map((s) => [
    s.student_num,
    `"${s.name}"`,
    s.gender === 'M' ? '남' : '여',
    s.gpa_percent != null ? `${s.gpa_percent}%` : '',
    s.gpa_score ?? '',
    s.rank_in_school ? `${s.rank_in_school}등` : '',
    `"${s.hope_school_1 || ''}"`,
    `"${s.hope_school_2 || ''}"`,
    `"${s.hope_school_3 || ''}"`,
    `"${s.early_school || ''}"`,
    `"${s.early_major || ''}"`,
    `"${s.early_apply_type || ''}"`,
    s.early_apply_date || '',
    s.early_deadline || '',
    statusEarlyLabel[s.early_status] || s.early_status,
    s.early_docs_checked ? '확인완료' : '미완',
    `"${s.late_school_1 || ''}"`,
    `"${s.late_school_2 || ''}"`,
    `"${s.late_school_3 || ''}"`,
    `"${s.late_school_4 || ''}"`,
    s.stage1_result || '',
    s.stage2_result || '',
    s.stage3_result || '',
    `"${s.late_apply_type || ''}"`,
    s.late_apply_date || '',
    s.late_deadline || '',
    statusLateLabel[s.late_status] || s.late_status,
    `"${s.late_assigned_school || ''}"`,
    s.parent_agreed ? '제출완료' : '미제출',
    s.counseling_count || 0,
    `"${(s.counseling_notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${currentClass.school_name}_${currentClass.grade}학년${currentClass.class_num}반_고입진학원서현황.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
