
# LokLernen 2.0 - Vollständige Dokumentation

## 📋 Inhaltsverzeichnis

1. [Executive Summary](#executive-summary)
2. [Technische Analyse der aktuellen Version](#technische-analyse-der-aktuellen-version)
3. [Vision und Ziele für LokLernen 2.0](#vision-und-ziele-für-loklernen-20)
4. [Technische Architektur 2.0](#technische-architektur-20)
5. [Design System - Material Design Expressive](#design-system---material-design-expressive)
6. [Implementierungsstrategie](#implementierungsstrategie)
7. [Stripe Integration Vorbereitung](#stripe-integration-vorbereitung)
8. [Performance & Skalierung](#performance--skalierung)
9. [Qualitätssicherung](#qualitätssicherung)
10. [Rollout-Plan](#rollout-plan)

---

## 1. Executive Summary

LokLernen 2.0 ist eine vollständige Neuentwicklung der bestehenden Lernplattform für angehende Triebfahrzeugführer*innen. Die neue Version fokussiert sich auf moderne Design-Prinzipien, verbesserte User Experience und eine skalierbare technische Architektur.

### Kernziele:
- **Material Design Expressive** für eine moderne, ansprechende Benutzeroberfläche
- **Vereinheitlichte Component-Architektur** für bessere Wartbarkeit
- **Optimierte Mobile Experience** mit nativen Touch-Interaktionen
- **Skalierbare Backend-Integration** für zukünftiges Wachstum
- **Stripe-Integration** für Premium-Features

---

## 2. Technische Analyse der aktuellen Version

### 2.1 Aktuelle Architektur

#### Frontend-Stack:
- **React 18.3.1** mit TypeScript
- **Tailwind CSS** für Styling
- **Framer Motion 12.9.4** für Animationen
- **React Router 6.30.0** für Navigation
- **Supabase 2.49.4** für Backend-Services

#### Komponentenstruktur:
```
src/
├── components/
│   ├── flashcard/
│   │   ├── unified/          # Neue einheitliche Komponenten
│   │   └── stack/           # Bestehende Stack-Komponenten
│   ├── flashcards/          # Legacy Multiple Choice
│   ├── learning/            # Session-Management
│   └── ui/                  # Basis UI-Komponenten
├── hooks/
│   ├── flashcard/           # Neue unified hooks
│   ├── learning-session/    # Session-spezifische hooks
│   └── spaced-repetition/   # SR-Algorithmus
├── styles/
│   ├── base.css            # Globale Styles
│   ├── flashcards.css      # Karteikarten-spezifisch
│   └── material-design.css # MD-Komponenten
└── types/
    ├── flashcard.ts        # Neue einheitliche Typen
    ├── questions.ts        # Fragen-Definitionen
    └── rich-text.ts        # Content-Management
```

### 2.2 Identifizierte Herausforderungen

#### Architektur-Probleme:
1. **Fragmentierte Komponenten**: Mehrere Implementations für ähnliche Funktionen
2. **Inkonsistente State-Management**: Verschiedene Ansätze für Card-State
3. **Komplexe CSS-Struktur**: Überlappende Style-Definitionen
4. **Fehlende Einheitlichkeit**: Unterschiedliche Interaktions-Pattern

#### Performance-Bottlenecks:
1. **Bundle-Größe**: Unnötige Code-Duplikation
2. **Re-Rendering**: Ineffiziente State-Updates
3. **Memory Leaks**: Unaufgeräumte Event-Listener
4. **Animationen**: Nicht optimierte Framer Motion Usage

#### UX-Probleme:
1. **Inkonsistente Navigation**: Verschiedene Card-Interaktionen
2. **Fehlende Accessibility**: Unvollständige ARIA-Labels
3. **Mobile Optimierung**: Suboptimale Touch-Erfahrung

---

## 3. Vision und Ziele für LokLernen 2.0

### 3.1 Design-Vision

**"Eine durchgängig moderne, intuitive und barrierefreie Lernplattform, die das Eisenbahnwissen spielerisch und wissenschaftlich fundiert vermittelt."**

#### Material Design Expressive Prinzipien:
- **Lebendige Farben**: Ultramarine (#3F00FF) als Primärfarbe
- **Ausdrucksstarke Animationen**: Micro-Interactions für besseres Feedback
- **Adaptive Layouts**: Responsive Design für alle Geräte
- **Konsistente Typografie**: Inter-Schriftart mit definierten Hierarchien

### 3.2 Funktionale Ziele

#### Lernerfahrung:
1. **Nahtlose Card-Interaktionen**: Einheitliche Swipe/Tap/Keyboard-Navigation
2. **Intelligentes Spaced Repetition**: Optimierter SM-2 Algorithmus
3. **Adaptive Schwierigkeit**: Dynamische Anpassung basierend auf Performance
4. **Multimodale Inhalte**: Rich-Text, Bilder, zukünftig Audio/Video

#### Gamification:
1. **XP-System**: Punkte für korrekte Antworten und Streaks
2. **Achievement-System**: Badges für Meilensteine
3. **Leaderboards**: Klassen- und globale Ranglisten
4. **Progress-Tracking**: Visuelle Fortschrittsanzeigen

#### Accessibility:
1. **WCAG 2.1 AA Compliance**: Vollständige Barrierefreiheit
2. **Keyboard Navigation**: Komplette Steuerung ohne Maus
3. **Screen Reader Support**: Optimierte ARIA-Labels
4. **High Contrast Mode**: Unterstützung für Sehbeeinträchtigungen

---

## 4. Technische Architektur 2.0

### 4.1 Neue Component-Hierarchie

```typescript
// Unified Card System
interface CardConfig {
  question: Question;
  regulationPreference: RegulationFilterType;
  displayMode: 'single' | 'stack' | 'grid';
  interactionMode: 'swipe' | 'keyboard' | 'hybrid';
  enableSwipe: boolean;
  enableKeyboard: boolean;
  showHints: boolean;
  autoFlip: boolean;
}

interface CardEventHandlers {
  onFlip: () => void;
  onAnswer: (score: number) => void;
  onNext: () => void;
}
```

#### UnifiedCard-Komponente:
```
UnifiedCard/
├── UnifiedCard.tsx          # Haupt-Container
├── UnifiedCardFront.tsx     # Fragen-Seite
├── UnifiedCardBack.tsx      # Antwort-Seite
└── hooks/
    ├── useUnifiedCardState.ts   # State-Management
    └── useUnifiedInteractions.ts # Interaktions-Logic
```

### 4.2 State-Management-Architektur

#### Unified Card State:
```typescript
interface CardState {
  isFlipped: boolean;
  isAnswered: boolean;
  isAnimating: boolean;
  swipeDirection: 'left' | 'right' | null;
  lastScore: number | null;
}

interface CardActions {
  flip: () => void;
  answer: (score: number) => void;
  reset: () => void;
  setAnimating: (animating: boolean) => void;
}
```

#### Learning Session State:
```typescript
interface SessionState {
  currentIndex: number;
  questions: Question[];
  scores: Record<string, number>;
  sessionStats: SessionStats;
  isComplete: boolean;
}
```

### 4.3 Interaction-System

#### Multi-Modal Interactions:
1. **Touch/Swipe** (Mobile): Swipe left/right für Bewertung
2. **Keyboard** (Desktop): Pfeiltasten und Leertaste
3. **Click/Tap** (Universal): Button-basierte Interaktion

#### Event-Handler-Unified:
```typescript
interface UnifiedInteractions {
  tapEnabled: boolean;
  swipeEnabled: boolean;
  keyboardEnabled: boolean;
  onTap?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onKeyPress?: (key: string) => void;
}
```

---

## 5. Design System - Material Design Expressive

### 5.1 Farbpalette

#### Hauptfarben:
```css
:root {
  /* Primärfarben */
  --ultramarine: #3F00FF;      /* Hauptmarkenfarbe */
  --sapphire: #0F52BA;         /* Sekundärfarbe */
  --betriebsdienst: #00B8A9;   /* Betriebsdienst-Kategorie */
  
  /* Ergänzende Farben */
  --digital-lavender: #9683EC;  /* Sanfte Akzente */
  --neo-mint: #C7F0BD;         /* Erfolg/Positiv */
  --tranquil-blue: #5080FF;    /* Information */
  --digital-coral: #FF6D70;    /* Warnung/Fehler */
  
  /* Graustufen */
  --text-dark: #222222;
  --text-medium: #555555;
  --text-light: #888888;
  --bg-primary: #FFFFFF;
  --bg-secondary: #F6F6F7;
  --bg-tertiary: #F1F1F1;
}
```

#### Farbverläufe:
```css
.bg-gradient-ultramarine {
  background: linear-gradient(135deg, #3F00FF 0%, #5080FF 100%);
}

.bg-gradient-sapphire {
  background: linear-gradient(135deg, #0F52BA 0%, #3F00FF 100%);
}

.bg-gradient-expressive {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### 5.2 Typografie

#### Schrift-Hierarchie:
```css
/* Hauptschrift: Inter */
.text-display-large {
  font-size: 3.5rem;     /* 56px */
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.text-display-medium {
  font-size: 2.75rem;    /* 44px */
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.text-headline-large {
  font-size: 2rem;       /* 32px */
  font-weight: 600;
  line-height: 1.25;
}

.text-headline-medium {
  font-size: 1.75rem;    /* 28px */
  font-weight: 500;
  line-height: 1.3;
}

.text-title-large {
  font-size: 1.375rem;   /* 22px */
  font-weight: 500;
  line-height: 1.4;
}

.text-body-large {
  font-size: 1rem;       /* 16px */
  font-weight: 400;
  line-height: 1.5;
}

.text-body-medium {
  font-size: 0.875rem;   /* 14px */
  font-weight: 400;
  line-height: 1.43;
}

.text-label-large {
  font-size: 0.875rem;   /* 14px */
  font-weight: 500;
  line-height: 1.43;
}
```

### 5.3 Component-Designs

#### Cards:
```css
.material-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.material-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 10px 20px rgba(0, 0, 0, 0.19),
    0 6px 6px rgba(0, 0, 0, 0.23);
}
```

#### Buttons:
```css
.material-button-primary {
  background: linear-gradient(135deg, #3F00FF 0%, #5080FF 100%);
  color: white;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 500;
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.material-button-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(63, 0, 255, 0.3);
}

.material-button-primary:active {
  transform: scale(0.98);
}
```

### 5.4 Animations & Micro-Interactions

#### Spring-basierte Animationen:
```css
.spring-entrance {
  animation: spring-entrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes spring-entrance {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  50% {
    opacity: 0.8;
    transform: translateY(-5px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

#### Card-Flip-Animation:
```css
.card-flip {
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.card-flip.flipped {
  transform: rotateY(180deg);
}
```

---

## 6. Implementierungsstrategie

### 6.1 Phase 1: Foundation (Wochen 1-2)

#### Ziele:
- Neue Unified-Card-Architektur implementieren
- Material Design System aufbauen
- Core-Hooks entwickeln

#### Deliverables:
1. **UnifiedCard-Komponente**:
   ```typescript
   // UnifiedCard mit vollständiger Config-Unterstützung
   <UnifiedCard 
     config={cardConfig} 
     handlers={cardHandlers}
     className="custom-styles"
   />
   ```

2. **Material Design CSS**:
   - Farbvariablen und Utility-Classes
   - Component-spezifische Styles
   - Animation-Utilities

3. **Core-Hooks**:
   - `useUnifiedCardState`: Zentrales State-Management
   - `useUnifiedInteractions`: Multi-Modal Interactions
   - `useMemoryOptimization`: Performance-Optimierungen

#### Akzeptanzkriterien:
- [ ] UnifiedCard rendert korrekt mit allen Question-Types
- [ ] Material Design Farben sind konsistent implementiert
- [ ] Touch/Keyboard/Click Interaktionen funktionieren
- [ ] Performance-Baseline ist etabliert

### 6.2 Phase 2: Learning Sessions (Wochen 3-4)

#### Ziele:
- Einheitliche Learning-Session-Architektur
- Optimiertes Spaced-Repetition-System
- Mobile-First Design Implementation

#### Deliverables:
1. **UnifiedLearningSession**:
   ```typescript
   interface SessionConfig {
     questions: Question[];
     sessionType: 'practice' | 'review' | 'exam';
     regulationPreference: RegulationFilterType;
     adaptiveDifficulty: boolean;
   }
   ```

2. **Optimiertes SR-System**:
   - Verbesserte SM-2 Implementation
   - Intelligente Box-Verwaltung
   - Performance-basierte Anpassungen

3. **Mobile Experience**:
   - Native Touch-Gesten
   - Optimierte Layouts
   - Haptic Feedback Integration

#### Akzeptanzkriterien:
- [ ] Learning Sessions laufen flüssig auf Mobile/Desktop
- [ ] SR-Algorithmus zeigt nachweisbare Verbesserungen
- [ ] Session-Statistiken sind korrekt
- [ ] Mobile Touch-Interaktionen sind intuitiv

### 6.3 Phase 3: Advanced Features (Wochen 5-6)

#### Ziele:
- Rich-Content-Integration
- Erweiterte Gamification
- Performance-Optimierungen

#### Deliverables:
1. **Rich-Text-System**:
   ```typescript
   interface StructuredContent {
     type: 'paragraph' | 'heading' | 'list' | 'image';
     content?: string;
     children?: StructuredContent[];
     attributes?: Record<string, any>;
   }
   ```

2. **Gamification-Features**:
   - XP-System mit Multipliers
   - Achievement-Unlock-Animationen
   - Progress-Visualisierungen

3. **Performance-Layer**:
   - Image-Lazy-Loading
   - Virtual Scrolling für große Listen
   - Memory-Management für Sessions

#### Akzeptanzkriterien:
- [ ] Rich-Text wird korrekt gerendert
- [ ] Gamification-Features sind motivierend
- [ ] Performance-Metriken zeigen Verbesserungen
- [ ] Memory-Usage ist optimiert

### 6.4 Phase 4: Integration & Polish (Wochen 7-8)

#### Ziele:
- Stripe-Integration vorbereiten
- Accessibility-Compliance sicherstellen
- Testing & Bug-Fixes

#### Deliverables:
1. **Stripe-Vorbereitung**:
   - Subscription-Management UI
   - Payment-Flow-Integration
   - Premium-Feature-Gates

2. **Accessibility-Layer**:
   - Vollständige ARIA-Labels
   - Keyboard-Navigation-Optimierung
   - Screen-Reader-Tests

3. **Quality Assurance**:
   - Comprehensive Testing-Suite
   - Performance-Audits
   - Cross-Browser-Compatibility

#### Akzeptanzkriterien:
- [ ] Stripe-Integration ist vorbereitet
- [ ] WCAG 2.1 AA Compliance erreicht
- [ ] Alle Tests bestehen
- [ ] Performance-Ziele erreicht

---

## 7. Stripe Integration Vorbereitung

### 7.1 Subscription-Model

#### Tier-Struktur:
```typescript
interface SubscriptionTier {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  stripePriceId: string;
}

const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'basic',
    name: 'Basic',
    priceMonthly: 9.99,
    priceYearly: 99.99,
    features: [
      'Signale-Kurs (vollständig)',
      'Grundlagen Bahnbetrieb',
      'UVV & Arbeitsschutz',
      'Basis-Statistiken'
    ],
    stripePriceId: 'price_basic_monthly'
  },
  {
    id: 'premium',
    name: 'Premium',
    priceMonthly: 19.99,
    priceYearly: 199.99,
    features: [
      'Alle Basic-Features',
      'Betriebsdienst-Kurse',
      'Erweiterte Statistiken',
      'Leaderboards',
      'Prioritäts-Support'
    ],
    stripePriceId: 'price_premium_monthly'
  }
];
```

### 7.2 Edge Functions Architektur

#### Geplante Functions:
1. **create-checkout**: Stripe Checkout Session erstellen
2. **check-subscription**: Subscription-Status prüfen
3. **customer-portal**: Billing Portal öffnen
4. **webhook-handler**: Stripe Webhooks verarbeiten

#### Supabase Subscribers Table:
```sql
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT,
  subscription_end TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 7.3 Feature-Gating

#### Premium Feature Detection:
```typescript
interface FeatureGate {
  feature: string;
  requiredTier: 'basic' | 'premium';
  fallbackComponent?: React.ComponentType;
}

const useFeatureAccess = (feature: string) => {
  const { subscription } = useSubscription();
  
  return {
    hasAccess: checkFeatureAccess(feature, subscription.tier),
    showUpgrade: !subscription.subscribed || !hasRequiredTier(feature, subscription.tier)
  };
};
```

#### UI-Integration:
```tsx
const PremiumFeature = ({ feature, children, fallback }) => {
  const { hasAccess, showUpgrade } = useFeatureAccess(feature);
  
  if (hasAccess) {
    return children;
  }
  
  return showUpgrade ? <UpgradePrompt feature={feature} /> : fallback;
};
```

---

## 8. Performance & Skalierung

### 8.1 Performance-Ziele

#### Metriken:
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

#### Bundle-Optimierung:
- **Code Splitting**: Route-basierte Aufteilung
- **Tree Shaking**: Ungenutzten Code eliminieren
- **Lazy Loading**: Components on-demand laden
- **Image Optimization**: WebP/AVIF mit Fallbacks

### 8.2 Memory Management

#### Card-Stack-Optimierung:
```typescript
const useMemoryOptimization = () => {
  const preloadImages = useCallback((questions: Question[], currentIndex: number) => {
    // Nur die nächsten 3 Bilder vorladen
    const preloadRange = questions.slice(currentIndex + 1, currentIndex + 4);
    
    preloadRange.forEach(question => {
      if (question.image_url) {
        const img = new Image();
        img.src = question.image_url;
      }
    });
  }, []);
  
  const cleanupPreviousImages = useCallback((index: number) => {
    // Bilder außerhalb des aktuellen Bereichs freigeben
    // Implementation für memory cleanup
  }, []);
  
  return { preloadImages, cleanupPreviousImages };
};
```

#### Virtual Scrolling:
```typescript
const VirtualizedQuestionList = ({ questions, itemHeight = 100 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });
  
  // Nur sichtbare Items rendern
  const visibleItems = questions.slice(visibleRange.start, visibleRange.end);
  
  return (
    <div ref={containerRef} className="virtual-container">
      {visibleItems.map((question, index) => (
        <QuestionItem key={question.id} question={question} />
      ))}
    </div>
  );
};
```

### 8.3 Caching-Strategien

#### Service Worker Integration:
```typescript
// sw.js - Service Worker für Offline-Funktionalität
const CACHE_NAME = 'loklernen-v2.0.0';
const STATIC_ASSETS = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/manifest.json'
];

// Cache-First für statische Assets
self.addEventListener('fetch', event => {
  if (STATIC_ASSETS.includes(event.request.url)) {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});
```

#### React Query Optimierung:
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 Minuten
      cacheTime: 10 * 60 * 1000, // 10 Minuten
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
    }
  }
});
```

---

## 9. Qualitätssicherung

### 9.1 Testing-Strategie

#### Unit Tests:
```typescript
// hooks/__tests__/useUnifiedCardState.test.tsx
describe('useUnifiedCardState', () => {
  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useUnifiedCardState({
      question: mockQuestion,
      autoReset: false
    }));
    
    expect(result.current.state.isFlipped).toBe(false);
    expect(result.current.state.isAnswered).toBe(false);
  });
  
  it('should flip card when flip action is called', () => {
    const { result } = renderHook(() => useUnifiedCardState({
      question: mockQuestion,
      autoReset: false
    }));
    
    act(() => {
      result.current.actions.flip();
    });
    
    expect(result.current.state.isFlipped).toBe(true);
  });
});
```

#### Integration Tests:
```typescript
// components/__tests__/UnifiedCard.integration.test.tsx
describe('UnifiedCard Integration', () => {
  it('should complete full interaction flow', async () => {
    const onAnswer = jest.fn();
    const config: CardConfig = {
      question: mockQuestion,
      regulationPreference: 'DS 301',
      displayMode: 'single',
      interactionMode: 'keyboard',
      enableKeyboard: true,
      showHints: true
    };
    
    render(<UnifiedCard config={config} handlers={{ onAnswer }} />);
    
    // Simulate keyboard interaction
    fireEvent.keyDown(document, { key: ' ' }); // Flip card
    
    await waitFor(() => {
      expect(screen.getByText(/antwort/i)).toBeInTheDocument();
    });
    
    fireEvent.keyDown(document, { key: 'ArrowRight' }); // Answer correct
    
    expect(onAnswer).toHaveBeenCalledWith(5);
  });
});
```

#### E2E Tests:
```typescript
// e2e/learning-session.spec.ts
test('complete learning session flow', async ({ page }) => {
  await page.goto('/karteikarten/lernen?category=Signale');
  
  // Wait for first card to load
  await page.waitForSelector('[data-testid="unified-card"]');
  
  // Flip card
  await page.click('[data-testid="show-answer-button"]');
  
  // Answer correctly
  await page.click('[data-testid="correct-button"]');
  
  // Verify next card appears
  await page.waitForSelector('[data-testid="unified-card"]');
  
  // Verify progress update
  const progressText = await page.textContent('[data-testid="session-progress"]');
  expect(progressText).toContain('2 von');
});
```

### 9.2 Performance Testing

#### Lighthouse CI Integration:
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push, pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

#### Performance Budget:
```json
{
  "budget": [
    {
      "path": "/*",
      "timings": [
        { "metric": "first-contentful-paint", "budget": 1500 },
        { "metric": "largest-contentful-paint", "budget": 2500 },
        { "metric": "time-to-interactive", "budget": 3500 }
      ],
      "resourceSizes": [
        { "resourceType": "script", "budget": 400 },
        { "resourceType": "total", "budget": 1000 }
      ]
    }
  ]
}
```

### 9.3 Accessibility Testing

#### Automated Testing:
```typescript
// __tests__/accessibility.test.tsx
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('UnifiedCard should be accessible', async () => {
  const { container } = render(
    <UnifiedCard config={mockConfig} handlers={mockHandlers} />
  );
  
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

#### Manual Testing Checklist:
- [ ] Keyboard-Navigation funktioniert vollständig
- [ ] Screen Reader kann alle Inhalte vorlesen
- [ ] Focus-Indikatoren sind sichtbar
- [ ] Farbkontraste erfüllen WCAG-Standards
- [ ] Alternative Texte für Bilder vorhanden

---

## 10. Rollout-Plan

### 10.1 Deployment-Strategie

#### Staging-Umgebung:
- **URL**: `staging.loklernen.app`
- **Datenbank**: Separate Supabase-Instanz
- **Features**: Vollständige Funktionalität für Testing

#### Production-Rollout:
1. **Soft Launch** (Woche 9):
   - 10% der Nutzer erhalten LokLernen 2.0
   - A/B-Testing für kritische Metriken
   - Monitoring und Feedback-Sammlung

2. **Gradual Rollout** (Wochen 10-11):
   - Stufenweise Erhöhung auf 50%, dann 100%
   - Feature-Flags für schnelle Rollbacks
   - Kontinuierliches Monitoring

3. **Full Production** (Woche 12):
   - 100% der Nutzer auf LokLernen 2.0
   - Legacy-Code-Cleanup
   - Performance-Optimierungen

### 10.2 Monitoring & Analytics

#### Performance-Metriken:
```typescript
// Analytics Integration
const trackingEvents = {
  CARD_FLIP: 'card_flip',
  ANSWER_SUBMITTED: 'answer_submitted',
  SESSION_COMPLETED: 'session_completed',
  STREAK_ACHIEVED: 'streak_achieved'
};

const useAnalytics = () => {
  const trackEvent = (event: string, properties?: Record<string, any>) => {
    // Implementation für Analytics-Service
    analytics.track(event, {
      version: '2.0',
      timestamp: Date.now(),
      ...properties
    });
  };
  
  return { trackEvent };
};
```

#### Error Tracking:
```typescript
// Error Boundary mit Sentry Integration
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Sentry.captureException(error, {
      contexts: {
        react: errorInfo
      },
      tags: {
        version: '2.0',
        component: 'UnifiedCard'
      }
    });
  }
}
```

### 10.3 Success Metrics

#### Quantitative KPIs:
- **Performance**: 95% der Seitenaufrufe unter 3s Ladezeit
- **Engagement**: 25% Steigerung der durchschnittlichen Session-Dauer
- **Learning Effectiveness**: 15% Verbesserung der Retention-Rate
- **Mobile Usage**: 60% der Sessions auf Mobile-Geräten

#### Qualitative Metriken:
- **User Satisfaction**: Net Promoter Score > 8
- **Accessibility Compliance**: 100% WCAG 2.1 AA
- **Bug Reports**: < 5 kritische Bugs pro Woche
- **Feature Adoption**: 80% der Nutzer verwenden neue Features

---

## Fazit

LokLernen 2.0 repräsentiert eine fundamentale Weiterentwicklung der Plattform mit Fokus auf moderne Design-Prinzipien, verbesserte User Experience und skalierbare Architektur. Die systematische Umsetzung in 4 Phasen über 8 Wochen stellt sicher, dass alle Aspekte - von der technischen Implementierung bis zur Benutzerfreundlichkeit - optimal aufeinander abgestimmt sind.

Die Investition in Material Design Expressive, einheitliche Component-Architektur und moderne Development-Practices positioniert LokLernen als führende digitale Lernplattform im Eisenbahnbereich und schafft die Grundlage für zukünftiges Wachstum und Erweiterungen.

**Nächste Schritte:**
1. Stakeholder-Review dieser Dokumentation
2. Finalisierung der technischen Spezifikationen
3. Beginn der Implementierung in Phase 1
4. Setup der Entwicklungs- und Testing-Umgebungen

---

*Letzte Aktualisierung: 01.06.2025*
*Version: 1.0*
*Erstellt von: LokLernen Development Team*
