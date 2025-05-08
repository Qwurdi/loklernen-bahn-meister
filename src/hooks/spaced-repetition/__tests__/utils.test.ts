
import { transformQuestionToFlashcard, transformQuestion } from '../utils';
import { describe, it, expect } from 'vitest';
import { Question } from '@/types/questions';

describe('Spaced Repetition Utils', () => {
  it('transforms a question to a flashcard', () => {
    // Sample question
    const question: Question = {
      id: '1',
      text: 'Sample question',
      answers: [
        { text: 'Answer 1', isCorrect: true },
        { text: 'Answer 2', isCorrect: false }
      ],
      category: 'Test',
      sub_category: 'Subcategory',
      question_type: 'mc_single',
      difficulty: 2,
      image_url: null, // Add this property
      created_by: 'user-1',
      revision: 1,
      created_at: '2023-01-01',
      updated_at: '2023-01-01'
    };

    const flashcard = transformQuestionToFlashcard(question);
    expect(flashcard).toEqual(question); // Basic transformation just passes through
  });

  it('transforms question with string answers to proper format', () => {
    // Sample raw data from database
    const rawQuestion = {
      id: '1',
      text: 'Sample question',
      answers: JSON.stringify([
        { text: 'Answer 1', isCorrect: true },
        { text: 'Answer 2', isCorrect: false }
      ]),
      category: 'Test',
      sub_category: 'Subcategory',
      question_type: 'mc_single',
      difficulty: 2,
      image_url: null,
      created_by: 'user-1',
      revision: 1,
      created_at: '2023-01-01',
      updated_at: '2023-01-01'
    };

    const transformed = transformQuestion(rawQuestion);
    expect(transformed.answers).toEqual([
      { text: 'Answer 1', isCorrect: true },
      { text: 'Answer 2', isCorrect: false }
    ]);
  });

  it('does not parse answers if they are already an object', () => {
    // Sample raw data with answers as object
    const rawQuestion = {
      id: '1',
      text: 'Sample question',
      answers: [
        { text: 'Answer 1', isCorrect: true },
        { text: 'Answer 2', isCorrect: false }
      ],
      category: 'Test',
      sub_category: 'Subcategory',
      question_type: 'mc_single',
      difficulty: 2,
      image_url: null,
      created_by: 'user-1',
      revision: 1,
      created_at: '2023-01-01',
      updated_at: '2023-01-01'
    };

    const transformed = transformQuestion(rawQuestion);
    expect(transformed.answers).toEqual([
      { text: 'Answer 1', isCorrect: true },
      { text: 'Answer 2', isCorrect: false }
    ]);
  });
});
