export interface GoipClass {
  id: string;
  code: string;
  year: number;
  grade: number;
  class_num: number;
  school_name: string;
  teacher_name: string;
  teacher_pin: string;
  created_at: string;
  updated_at: string;
}

export type ScheduleCategory = 'early' | 'late';

export interface GoipSchedule {
  id: string;
  class_code: string;
  category: ScheduleCategory;
  school_type: string;
  school_name: string;
  apply_start_date: string;
  apply_end_date: string;
  interview_date?: string | null;
  result_date?: string | null;
  
  // 1·2·3차 단계별 전형 일정 (특목고, 외고, 자사고 등)
  stage1_name?: string | null; // 예: 1차 서류/내신 선발
  stage1_date?: string | null; // 1차 발표일
  stage2_name?: string | null; // 예: 2차 심층 면접평가
  stage2_date?: string | null; // 2차 면접/발표일
  stage3_name?: string | null; // 예: 3차 최종 합격자 발표
  stage3_date?: string | null; // 최종 발표일
  
  notes?: string | null;
  created_at: string;
}

export type EarlyStatus = 
  | 'none'          // 미지원
  | 'writing'       // 원서작성중
  | 'submitted'     // 접수완료
  | 'first_passed'  // 1차합격/서류통과
  | 'accepted'      // 최종합격 (후기고 지원금지)
  | 'rejected';     // 불합격 (후기고 지원가능)

export type LateStatus = 
  | 'ready'         // 작성대기
  | 'writing'       // 원서작성중
  | 'submitted'     // 접수완료
  | 'first_passed'  // 1차 서류통과 (특목/자사)
  | 'second_passed' // 2차 면접통과 (특목/자사)
  | 'assigned'      // 배정완료 / 최종합격
  | 'rejected';     // 불합격

export interface GoipStudent {
  id: string;
  class_code: string;
  student_num: number;
  name: string;
  gender: 'M' | 'F';
  
  // 내신 성적
  gpa_percent?: number | null; // 내신 석차백분율 (%)
  gpa_score?: number | null;   // 내신 총점
  rank_in_school?: number | null; // 전교 석차
  total_students?: number;        // 전체 학생수
  
  // 희망 학교
  hope_school_1?: string | null;
  hope_school_2?: string | null;
  hope_school_3?: string | null;
  
  // 전기고 지원 현황
  early_school?: string | null;
  early_major?: string | null;
  early_apply_type?: string | null;
  early_apply_date?: string | null;
  early_deadline?: string | null;
  early_status: EarlyStatus;
  early_docs_checked: boolean;
  
  // 후기고 지원 현황 (1지망 ~ 4지망)
  late_school_1?: string | null; // 후기고 1지망 (광역 1지망 또는 특목/자사)
  late_school_2?: string | null; // 후기고 2지망 (광역 2지망)
  late_school_3?: string | null; // 후기고 3지망 (지역 1지망)
  late_school_4?: string | null; // 후기고 4지망 (지역 2지망)
  late_apply_type?: string | null;
  late_apply_date?: string | null;
  late_deadline?: string | null;
  late_status: LateStatus;
  late_assigned_school?: string | null;
  
  // 특목고/외고/자사고 단계별 전형 결과
  stage1_result?: '대기' | '합격' | '불합격' | string;
  stage2_result?: '대기' | '합격' | '불합격' | string;
  stage3_result?: '대기' | '최종합격' | '불합격' | string;
  
  // 상담 및 부모 동의
  parent_agreed: boolean;
  counseling_notes?: string | null;
  counseling_count: number;
  updated_at: string;
}
