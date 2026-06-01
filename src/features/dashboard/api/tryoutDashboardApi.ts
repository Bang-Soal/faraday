import {useQuery} from '@tanstack/react-query';
import {apiFetch} from '../../../lib/api/client';

export type TryoutAttempt = {
  tryout_id: string;
  name: string;
  score: number;
};

/** GET /tryout-history/score-analytics — avg/max/min + per-attempt scores. */
export type TryoutScoreAnalytics = {
  tryouts: {tryout_id: string; name: string; score: number}[];
  attempts: TryoutAttempt[];
  average_score: number;
  max_score: number;
  min_score: number;
  finished_tryouts: number;
  total_tryouts: number;
};

export type TryoutSubjectAnalytic = {
  id: string;
  name: string;
  set_count: number;
  avg_score: number;
  max_score: number;
  min_score: number;
  topics: {
    id: string;
    name: string;
    correct_answers_count: number;
    questions_count: number;
  }[];
};

/** GET /tryout-history/subject-analytics — per-subject scores (null if no attempts). */
export type TryoutSubjectAnalytics = {
  subject_analytics: Record<string, TryoutSubjectAnalytic>;
} | null;

export function useTryoutScoreAnalytics() {
  return useQuery({
    queryKey: ['tryout', 'score-analytics'],
    queryFn: () =>
      apiFetch<TryoutScoreAnalytics>('/tryout-history/score-analytics'),
  });
}

export function useTryoutSubjectAnalytics() {
  return useQuery({
    queryKey: ['tryout', 'subject-analytics'],
    queryFn: () =>
      apiFetch<TryoutSubjectAnalytics>('/tryout-history/subject-analytics'),
  });
}
