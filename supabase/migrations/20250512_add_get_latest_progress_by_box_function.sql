
-- Create a function to get the latest progress entries for each question in a specific box
CREATE OR REPLACE FUNCTION get_latest_progress_by_box(p_user_id UUID, p_box_number INT)
RETURNS SETOF user_progress
LANGUAGE sql
AS $$
WITH latest_progress AS (
  SELECT DISTINCT ON (question_id) *
  FROM user_progress
  WHERE user_id = p_user_id AND box_number = p_box_number
  ORDER BY question_id, updated_at DESC
)
SELECT up.* 
FROM latest_progress up
JOIN questions q ON up.question_id = q.id
ORDER BY up.next_review_at ASC;
$$;
