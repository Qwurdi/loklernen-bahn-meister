
-- Update function to join and return question data directly
CREATE OR REPLACE FUNCTION get_latest_progress_by_box(p_user_id UUID, p_box_number INT)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  question_id UUID,
  last_score INT,
  box_number INT,
  last_reviewed_at TIMESTAMPTZ,
  next_review_at TIMESTAMPTZ,
  ease_factor NUMERIC,
  interval_days INT,
  repetition_count INT,
  correct_count INT,
  incorrect_count INT,
  streak INT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  questions JSON
)
LANGUAGE sql
AS $$
WITH latest_progress AS (
  SELECT DISTINCT ON (question_id) *
  FROM user_progress
  WHERE user_id = p_user_id AND box_number = p_box_number
  ORDER BY question_id, updated_at DESC
)
SELECT 
  lp.id,
  lp.user_id,
  lp.question_id,
  lp.last_score,
  lp.box_number,
  lp.last_reviewed_at,
  lp.next_review_at,
  lp.ease_factor,
  lp.interval_days,
  lp.repetition_count,
  lp.correct_count,
  lp.incorrect_count,
  lp.streak,
  lp.created_at,
  lp.updated_at,
  row_to_json(q) AS questions
FROM latest_progress lp
JOIN questions q ON lp.question_id = q.id
ORDER BY lp.next_review_at ASC;
$$;
