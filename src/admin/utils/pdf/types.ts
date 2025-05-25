
import { QuestionCategory, RegulationCategory } from '@/types/questions';

export interface ExportOptions {
  category: QuestionCategory;
  regulation: RegulationCategory;
  filename: string;
}

export interface CardDimensions {
  width: number;
  height: number;
  docWidth: number;
  docHeight: number;
  contentWidth: number;
  contentHeight: number;
  cornerRadius: number;
}

export interface Margins {
  x: number;
  y: number;
}

export interface ContentMargins extends Margins {
  width: number;
  height: number;
}
