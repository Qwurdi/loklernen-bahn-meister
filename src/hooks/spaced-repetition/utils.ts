
import { Question } from "@/types/questions";
import { transformQuestion } from "@/api/questions";

// Calculate the next review date based on the current date and interval
export function calculateNextReviewDate(date: Date, intervalDays: number): Date {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + intervalDays);
  return nextDate;
}

// Apply spacing factor to interval
export function applySpacingFactor(interval: number, factor: number = 2.5): number {
  return Math.round(interval * factor);
}

// Export the transformQuestion function to maintain backwards compatibility
export { transformQuestion };
