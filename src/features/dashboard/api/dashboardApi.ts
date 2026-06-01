import {useQuery} from '@tanstack/react-query';
import {apiFetch} from '../../../lib/api/client';

export type DashboardHeaders = {
  streak: number;
  finished: {done: number; total: number; percentage: number};
  accuracy: {
    percentage: number;
    correct_answers: number;
    total_attempted_question: number;
  };
};

export type DashboardTopic = {
  topic_id: string;
  topic: string;
  correct: number;
  total_question: number;
};

export type DashboardSubject = {
  subject_id: string;
  subject: string;
  /** Full icon URL from the S3 bucket (e.g. .../static/brain.png). */
  icon: string;
  topics: DashboardTopic[];
};

export type MobileRank = {
  major: string;
  university: string;
  rank: number;
  total_rank: number;
};

/** GET /dashboard/headers — streak + finished + accuracy stats. */
export function useDashboardHeaders() {
  return useQuery({
    queryKey: ['dashboard', 'headers'],
    queryFn: () => apiFetch<DashboardHeaders>('/dashboard/headers'),
  });
}

/** GET /dashboard — per-subject performance with topic breakdown. */
export function useDashboardSubjects() {
  return useQuery({
    queryKey: ['dashboard', 'subjects'],
    queryFn: () => apiFetch<DashboardSubject[]>('/dashboard'),
  });
}

/** GET /dashboard/mobile/rank — leaderboard rank for each chosen PTN. */
export function useMobileRank() {
  return useQuery({
    queryKey: ['dashboard', 'mobile-rank'],
    queryFn: () => apiFetch<MobileRank[]>('/dashboard/mobile/rank'),
  });
}
