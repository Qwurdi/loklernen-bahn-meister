
import React from 'react';
import { Route } from 'react-router-dom';
import LearningSessionPage from '@/pages/LearningSessionPage';
import UnifiedLearningPage from '@/pages/UnifiedLearningPage';
import FullScreenLearningPage from '@/pages/FullScreenLearningPage';
import NewLearningPage from '@/pages/NewLearningPage';

export const learningRoutes = (
  <>
    {/* Unified learning route - new primary route */}
    <Route path="/karteikarten/lernen" element={<UnifiedLearningPage />} />
    
    {/* Legacy routes for backward compatibility */}
    <Route path="/karteikarten/session" element={<LearningSessionPage />} />
    <Route path="/fullscreen-learning" element={<FullScreenLearningPage />} />
    <Route path="/new-learning" element={<NewLearningPage />} />
    
    {/* Category-specific routes */}
    <Route path="/karteikarten/signale/:subcategory?" element={<UnifiedLearningPage />} />
    <Route path="/karteikarten/betriebsdienst/:subcategory?" element={<UnifiedLearningPage />} />
  </>
);
