export interface Card {
  id: number;
  leetcode_id: number;
  title: string;
  difficulty: string;
  next_review: string;
  review_count: number;
  created_at: string;
}

export interface AddCardFormData {
  leetcode_id: number;
  title: string;
  difficulty: string;
}

export interface Problem {
  id: number;
  leetcodeId: number;
  title: string;
  difficulty: number;
  category: string;
  lastReviewed: string | null;
  nextReview: string | null;
}

export type ProblemInput = Omit<Problem, 'id' | 'lastReviewed' | 'nextReview'>; 