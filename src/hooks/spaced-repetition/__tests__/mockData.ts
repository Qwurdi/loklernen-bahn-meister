
import { Question } from "@/types/questions";
import { UserProgress } from "../types";

// Mock questions for testing
export const mockQuestions: Question[] = [
  {
    id: 'q1',
    category: 'Signale',
    sub_category: 'Hauptsignale',
    difficulty: 3,
    text: 'Test question 1',
    question_type: 'MC_single',
    answers: [
      { text: 'Answer 1', isCorrect: true },
      { text: 'Answer 2', isCorrect: false }
    ],
    image_url: null, // Added the required property
    created_by: 'test-user',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
    revision: 1
  },
  {
    id: 'q2',
    category: 'Signale',
    sub_category: 'Hauptsignale',
    difficulty: 2,
    text: 'Test question 2',
    question_type: 'MC_single',
    answers: [
      { text: 'Answer 1', isCorrect: false },
      { text: 'Answer 2', isCorrect: true }
    ],
    image_url: null, // Added the required property
    created_by: 'test-user',
    created_at: '2023-01-02T00:00:00Z',
    updated_at: '2023-01-02T00:00:00Z',
    revision: 1
  }
];

// Mock user progress data
export const mockUserProgress: UserProgress[] = [
  {
    id: 'up1',
    user_id: 'test-user-id',
    question_id: 'q1',
    correct_count: 3,
    incorrect_count: 1,
    last_reviewed_at: '2023-01-10T00:00:00Z',
    next_review_at: '2023-01-15T00:00:00Z',
    ease_factor: 2.5,
    interval_days: 5,
    questions: mockQuestions[0],
    box_number: 3,
    last_score: 4,
    repetition_count: 4,
    streak: 3,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-10T00:00:00Z'
  },
  {
    id: 'up2',
    user_id: 'test-user-id',
    question_id: 'q2',
    correct_count: 2,
    incorrect_count: 2,
    last_reviewed_at: '2023-01-11T00:00:00Z',
    next_review_at: '2023-01-14T00:00:00Z',
    ease_factor: 2.2,
    interval_days: 3,
    questions: mockQuestions[1],
    box_number: 2,
    last_score: 3,
    repetition_count: 4,
    streak: 0,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-11T00:00:00Z'
  }
];
