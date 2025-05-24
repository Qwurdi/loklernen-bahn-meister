
import React from 'react';
import { Route } from 'react-router-dom';
import LearningPage from '@/pages/LearningPage';

export const learningRoutes = (
  <>
    {/* Main learning route */}
    <Route path="/lernen" element={<LearningPage />} />
    <Route path="/karteikarten/lernen" element={<LearningPage />} />
    
    {/* Legacy redirect routes - all point to the unified learning page */}
    <Route path="/karteikarten/session" element={<LearningPage />} />
    <Route path="/fullscreen-learning" element={<LearningPage />} />
    <Route path="/new-learning" element={<LearningPage />} />
    
    {/* Category-specific routes */}
    <Route path="/karteikarten/signale/:subcategory?" element={<LearningPage />} />
    <Route path="/karteikarten/betriebsdienst/:subcategory?" element={<LearningPage />} />
  </>
);
