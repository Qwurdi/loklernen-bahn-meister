
import { transformQuestionToFlashcard, transformQuestion } from '../utils';
import { vi } from 'vitest';

describe('Spaced Repetition Utils', () => {
  it('should transform a question to a flashcard', () => {
    const question = {
      id: '1',
      text: 'Test question',
      answers: [{text: 'Answer', isCorrect: true}],
      category: 'Signale',
      sub_category: 'Test',
      question_type: 'MC_single',
      difficulty: 1,
      created_by: 'user-1',
      revision: 1,
      created_at: '2023-01-01',
      updated_at: '2023-01-01'
    };
    
    const result = transformQuestionToFlashcard(question);
    
    expect(result).toEqual({
      ...question
    });
  });
  
  it('should handle JSON string answers when transforming questions', () => {
    const questionWithStringAnswers = {
      id: '1',
      text: 'Test question',
      answers: JSON.stringify([{text: 'Answer', isCorrect: true}]),
      category: 'Signale',
      sub_category: 'Test',
      question_type: 'MC_single',
      difficulty: 1,
      created_by: 'user-1',
      revision: 1,
      created_at: '2023-01-01',
      updated_at: '2023-01-01'
    };
    
    const result = transformQuestion(questionWithStringAnswers);
    
    expect(result.answers).toEqual([{text: 'Answer', isCorrect: true}]);
  });
  
  it('should not modify answers that are already objects', () => {
    const questionWithObjectAnswers = {
      id: '1',
      text: 'Test question',
      answers: [{text: 'Answer', isCorrect: true}],
      category: 'Signale',
      sub_category: 'Test',
      question_type: 'MC_single',
      difficulty: 1,
      created_by: 'user-1',
      revision: 1,
      created_at: '2023-01-01',
      updated_at: '2023-01-01'
    };
    
    const result = transformQuestion(questionWithObjectAnswers);
    
    expect(result.answers).toEqual([{text: 'Answer', isCorrect: true}]);
  });
});
