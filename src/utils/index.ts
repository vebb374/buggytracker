import type { Ticket, User, LogEntry, ToastAlert } from '../types';

// Utility functions for BugTracker Pro

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Sample data generators
export const generateSampleUsers = (): User[] => {
  return [
    {
      id: 'user-1',
      name: 'Alice Johnson',
      email: 'alice.johnson@company.com',
      avatar: '👩‍💻'
    },
    {
      id: 'user-2', 
      name: 'Bob Smith',
      email: 'bob.smith@company.com',
      avatar: '👨‍💻'
    },
    {
      id: 'user-3',
      name: 'Carol Williams',
      email: 'carol.williams@company.com', 
      avatar: '👩‍🔬'
    },
    {
      id: 'user-4',
      name: 'David Brown',
      email: 'david.brown@company.com',
      avatar: '👨‍🔧'
    },
    {
      id: 'user-5',
      name: 'Eva Martinez',
      email: 'eva.martinez@company.com',
      avatar: '👩‍🎨'
    }
  ];
};

export const generateSampleTickets = (count: number = 50): Ticket[] => {
  const users = generateSampleUsers();
  const priorities: Array<'High' | 'Medium' | 'Low'> = ['High', 'Medium', 'Low'];
  const statuses: Array<'TODO' | 'WORKING' | 'DONE'> = ['TODO', 'WORKING', 'DONE'];
  
  const bugTitles = [
    'Login page crashes on mobile Safari',
    'Dashboard loads slowly with large datasets',
    'Email notifications not being sent',
    'Search functionality returns incorrect results',
    'File upload fails for files over 10MB',
    'User permissions not updating correctly',
    'Calendar widget shows wrong timezone',
    'Export to CSV missing data columns',
    'Password reset emails going to spam',
    'Drag and drop not working in Firefox',
    'API response times exceeding 5 seconds',
    'Navigation menu overlaps content on iPad',
    'Form validation allows invalid email formats',
    'Session timeout not working properly',
    'Charts rendering incorrectly in Edge',
    'Database connection pool exhausted',
    'Memory leak in real-time updates',
    'SSL certificate validation failing',
    'Backup process consuming too much CPU',
    'Log files growing without rotation',
    'Cache invalidation not working',
    'Third-party integration timeout errors',
    'Mobile app crashes on Android 12',
    'Print functionality missing page breaks',
    'Autocomplete dropdown positioning issues',
    'Date picker shows future dates incorrectly',
    'Modal dialogs not closing properly',
    'Table sorting breaks with special characters',
    'Image thumbnails not generating',
    'Notification sounds playing repeatedly',
    'Dark mode theme inconsistencies',
    'Keyboard shortcuts not working',
    'Copy/paste functionality broken',
    'Progress bars showing incorrect percentages',
    'Tooltip text cut off on small screens',
    'Animation stuttering on low-end devices',
    'WebSocket connections dropping randomly',
    'PDF generation corrupting special characters',
    'Pagination jumping to wrong page',
    'Color picker not saving selected values',
    'Undo/redo functionality missing in editor',
    'Breadcrumb navigation showing wrong path',
    'Loading spinners not showing consistently',
    'Responsive layout breaking at 768px',
    'Accessibility issues with screen readers',
    'Video player controls not responding',
    'Geographic maps not loading tiles',
    'Language translation missing for errors',
    'Bulk operations timing out',
    'Version comparison showing false differences'
  ];

  const tagOptions = [
    'UI/UX', 'Backend', 'Frontend', 'Mobile', 'API', 'Database', 
    'Security', 'Performance', 'Accessibility', 'Integration',
    'Critical', 'Enhancement', 'Bug', 'Feature Request',
    'iOS', 'Android', 'Chrome', 'Firefox', 'Safari', 'Edge'
  ];

  const tickets: Ticket[] = [];

  for (let i = 0; i < count; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomTitle = bugTitles[Math.floor(Math.random() * bugTitles.length)];
    
    // Generate random tags (1-4 tags per ticket)
    const numTags = Math.floor(Math.random() * 4) + 1;
    const shuffledTags = [...tagOptions].sort(() => 0.5 - Math.random());
    const selectedTags = shuffledTags.slice(0, numTags);

    // Generate realistic deadline (within next 30 days for TODO/WORKING, past for some DONE)
    let deadline: Date | null = null;
    if (Math.random() > 0.3) { // 70% chance of having a deadline
      const daysOffset = randomStatus === 'DONE' && Math.random() > 0.5 
        ? -Math.floor(Math.random() * 30) // Past deadline for some DONE tickets
        : Math.floor(Math.random() * 30) + 1; // Future deadline
      deadline = new Date();
      deadline.setDate(deadline.getDate() + daysOffset);
    }

    // Generate creation date (within last 60 days)
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 60));

    tickets.push({
      id: `TICKET-${String(i + 1).padStart(4, '0')}`,
      title: randomTitle,
      description: `This is a detailed description for: ${randomTitle}. The issue needs investigation and proper resolution.`,
      priority: randomPriority,
      status: randomStatus,
      assignee: randomUser.name,
      deadline,
      tags: selectedTags,
      createdAt,
      domVersion: 1 // Start with version 1, will increment with DOM recreation
    });
  }

  return tickets;
};

export const generateSampleLogs = (count: number = 100): LogEntry[] => {
  const levels: Array<'info' | 'warning' | 'error'> = ['info', 'warning', 'error'];
  const sources = ['frontend', 'backend', 'database', 'auth-service', 'email-service'];
  const categories: Array<'system' | 'user' | 'automation'> = ['system', 'user', 'automation'];
  
  const logMessages = [
    'User login successful',
    'Database connection established',
    'Email notification sent',
    'File upload completed',
    'Cache cleared successfully',
    'API rate limit exceeded',
    'Database query timeout',
    'Authentication failed',
    'Memory usage high',
    'Disk space low',
    'Backup completed',
    'Session expired',
    'Configuration updated',
    'Service restarted',
    'Connection pool exhausted'
  ];

  const logs: LogEntry[] = [];

  for (let i = 0; i < count; i++) {
    const timestamp = new Date();
    timestamp.setMinutes(timestamp.getMinutes() - Math.floor(Math.random() * 1440)); // Last 24 hours

    logs.push({
      id: generateId(),
      timestamp,
      level: levels[Math.floor(Math.random() * levels.length)],
      message: logMessages[Math.floor(Math.random() * logMessages.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      category: categories[Math.floor(Math.random() * categories.length)]
    });
  }

  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// DOM manipulation utilities for automation challenges
export const recreateTicketDOM = (ticketId: string): number => {
  // Increment DOM version to create stale element references
  const currentVersion = parseInt(ticketId.split('-')[1]) || 1;
  return currentVersion + 1;
};

export const addVariableDelay = (baseDelay: number = 1000): Promise<void> => {
  // Variable delay between 1-4 seconds for automation challenges
  const randomDelay = baseDelay + Math.random() * 3000;
  return new Promise(resolve => setTimeout(resolve, randomDelay));
};

// DevTools detection utilities
export const detectDevTools = (): boolean => {
  // Multiple methods to detect DevTools for automation challenges
  let devtools = false;
  
  // Method 1: Console detection
  const threshold = 160;
  setInterval(() => {
    if (window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold) {
      devtools = true;
    }
  }, 100);
  
  // Method 2: Debugger detection
  const start = Date.now();
  debugger;
  const end = Date.now();
  if (end - start > 100) {
    devtools = true;
  }
  
  return devtools;
};

// Toast notification utilities
export const createToast = (
  type: ToastAlert['type'],
  message: string,
  duration: number = 1500
): ToastAlert => {
  return {
    id: generateId(),
    type,
    message,
    duration,
    position: {
      x: Math.random() * 100, // Random positioning for automation challenges
      y: Math.random() * 100
    }
  };
};

// Date formatting utilities
export const formatDate = (date: Date | string | null): string => {
  if (!date) return 'No deadline';
  
  // Ensure we have a proper Date object
  const dateObj = date instanceof Date ? date : new Date(date);
  
  const now = new Date();
  const diffTime = dateObj.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return `Overdue by ${Math.abs(diffDays)} days`;
  } else if (diffDays === 0) {
    return 'Due today';
  } else if (diffDays === 1) {
    return 'Due tomorrow';
  } else {
    return `Due in ${diffDays} days`;
  }
};

export const formatDateTime = (date: Date): string => {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Local storage utilities
export const saveToLocalStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateTicketTitle = (title: string): string | null => {
  if (!title.trim()) return 'Title is required';
  if (title.length < 5) return 'Title must be at least 5 characters';
  if (title.length > 100) return 'Title must be less than 100 characters';
  return null;
};

// Random utility for automation challenges
export const shouldSimulateNetworkFailure = (): boolean => {
  // 5% chance of simulating network failure
  return Math.random() < 0.05;
};

export const getRandomLoadingMessage = (): string => {
  const messages = [
    'Loading tickets...',
    'Fetching latest data...',
    'Updating dashboard...',
    'Synchronizing...',
    'Please wait...'
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};

// Phase 4: Enhanced DevTools Detection Methods
export interface DevToolsDetectionResult {
  detected: boolean;
  method: string;
  confidence: number;
  timestamp: number;
}

// Multiple DevTools detection methods for enhanced automation challenges
export const advancedDevToolsDetection = (): DevToolsDetectionResult[] => {
  const results: DevToolsDetectionResult[] = [];
  const timestamp = Date.now();

  // Method 1: Window size difference (original)
  const sizeDiffMethod = (): DevToolsDetectionResult => {
    const threshold = 160;
    const heightDiff = window.outerHeight - window.innerHeight > threshold;
    const widthDiff = window.outerWidth - window.innerWidth > threshold;
    const detected = heightDiff || widthDiff;
    
    return {
      detected,
      method: 'size_difference',
      confidence: detected ? 0.7 : 0.1,
      timestamp
    };
  };

  // Method 2: Console detection via toString override
  const consoleDetectionMethod = (): DevToolsDetectionResult => {
    let consoleOpened = false;
    const element = document.createElement('div');

    // Use proper type assertion for __defineGetter__
    (element as any).__defineGetter__('id', function() {
      consoleOpened = true;
    });

    try {
      console.log(element);
      console.clear();
    } catch (e) {
      // Console access failed
    }

    return {
      detected: consoleOpened,
      method: 'console_override',
      confidence: consoleOpened ? 0.9 : 0.1,
      timestamp
    };
  };

  // Method 3: Performance timing detection
  const performanceTimingMethod = (): DevToolsDetectionResult => {
    const start = performance.now();
    debugger; // This will pause if DevTools are open
    const end = performance.now();
    const detected = (end - start) > 100; // Significant delay indicates debugger pause
    
    return {
      detected,
      method: 'performance_timing',
      confidence: detected ? 0.8 : 0.2,
      timestamp
    };
  };

  // Method 4: Mouse event deviation detection
  const mouseEventMethod = (): DevToolsDetectionResult => {
    // Check if mouse events have been overridden (common in automation tools)
    const originalEvent = MouseEvent.prototype.constructor;
    const detected = MouseEvent.prototype.constructor !== originalEvent ||
                   (window as any).webdriver !== undefined ||
                   (window.navigator as any).webdriver !== undefined;
    
    return {
      detected,
      method: 'mouse_event_override',
      confidence: detected ? 0.95 : 0.1,
      timestamp
    };
  };

  // Method 5: DevTools object detection
  const devToolsObjectMethod = (): DevToolsDetectionResult => {
    const detected = (window as any).devtools?.open === true ||
                   (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ !== undefined ||
                   (window as any).chrome?.runtime?.onConnect !== undefined;
    
    return {
      detected,
      method: 'devtools_object',
      confidence: detected ? 0.85 : 0.1,
      timestamp
    };
  };

  // Execute all detection methods
  results.push(sizeDiffMethod());
  results.push(consoleDetectionMethod());
  results.push(performanceTimingMethod());
  results.push(mouseEventMethod());
  results.push(devToolsObjectMethod());

  return results;
};

// Enhanced DOM recreation patterns for Phase 4
export const enhancedDOMRecreation = {
  // Pattern 1: Cascade recreation (recreate parent and all children)
  cascadeRecreation: (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const parent = element.parentElement;
      if (parent) {
        // Store original content
        const originalHTML = parent.innerHTML;
        // Recreate with delay
        setTimeout(() => {
          parent.innerHTML = '';
          setTimeout(() => {
            parent.innerHTML = originalHTML;
            // Add version tracking
            const newVersion = Date.now().toString();
            element.setAttribute('data-dom-version', newVersion);
          }, Math.random() * 1000 + 500);
        }, Math.random() * 500);
      }
    }
  },

  // Pattern 2: Attribute scrambling (change attributes randomly)
  attributeScrambling: (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const attributes = ['data-testid', 'class', 'id'];
      attributes.forEach(attr => {
        if (element.hasAttribute(attr)) {
          const originalValue = element.getAttribute(attr);
          const scrambledValue = `${originalValue}-${Math.random().toString(36).substr(2, 9)}`;
          element.setAttribute(attr, scrambledValue);
          
          // Restore after random delay
          setTimeout(() => {
            element.setAttribute(attr, originalValue || '');
          }, Math.random() * 2000 + 1000);
        }
      });
    }
  },

  // Pattern 3: Element displacement (move element temporarily)
  elementDisplacement: (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const originalParent = element.parentElement;
      const placeholder = document.createElement('div');
      placeholder.style.display = 'none';
      
      // Replace with placeholder
      originalParent?.insertBefore(placeholder, element);
      element.remove();
      
      // Restore after delay
      setTimeout(() => {
        if (originalParent && placeholder.parentElement) {
          originalParent.insertBefore(element, placeholder);
          placeholder.remove();
        }
      }, Math.random() * 3000 + 1000);
    }
  },

  // Pattern 4: Style mutation (change styles temporarily)
  styleMutation: (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const originalStyles = element.style.cssText;
      const mutations = [
        'transform: scale(0.99)',
        'opacity: 0.99',
        'filter: brightness(0.99)',
        'margin: 0.1px'
      ];
      
      const randomMutation = mutations[Math.floor(Math.random() * mutations.length)];
      element.style.cssText += `;${randomMutation}`;
      
      // Restore after delay
      setTimeout(() => {
        element.style.cssText = originalStyles;
      }, Math.random() * 1500 + 500);
    }
  }
};

// Complex timing-based interactions for Phase 4
export const complexTimingChallenges = {
  // Progressive delays that increase over time
  progressiveDelay: (() => {
    let callCount = 0;
    return (baseDelay: number = 1000): Promise<void> => {
      callCount++;
      const progressiveMultiplier = 1 + (callCount * 0.1); // Increases by 10% each call
      const delay = baseDelay * progressiveMultiplier;
      return new Promise(resolve => setTimeout(resolve, delay));
    };
  })(),

  // Random burst delays (sometimes fast, sometimes very slow)
  burstDelay: (fastDelay: number = 100, slowDelay: number = 5000): Promise<void> => {
    const useFastDelay = Math.random() < 0.7; // 70% chance of fast, 30% slow
    const delay = useFastDelay ? fastDelay + Math.random() * 200 : slowDelay + Math.random() * 3000;
    return new Promise(resolve => setTimeout(resolve, delay));
  },

  // Time-of-day based delays (slower during certain hours)
  timeBasedDelay: (baseDelay: number = 1000): Promise<void> => {
    const hour = new Date().getHours();
    let multiplier = 1;
    
    // Slower during typical testing hours (9-17)
    if (hour >= 9 && hour <= 17) {
      multiplier = 1.5 + Math.random() * 0.5; // 1.5x to 2x slower
    }
    
    const delay = baseDelay * multiplier;
    return new Promise(resolve => setTimeout(resolve, delay));
  },

  // Network-simulation delays with connection quality simulation
  networkSimulationDelay: (): Promise<void> => {
    const connectionTypes = [
      { name: 'fast', baseDelay: 50, variation: 50 },
      { name: 'normal', baseDelay: 200, variation: 100 },
      { name: 'slow', baseDelay: 1000, variation: 500 },
      { name: 'unstable', baseDelay: 2000, variation: 3000 }
    ];
    
    const connection = connectionTypes[Math.floor(Math.random() * connectionTypes.length)];
    const delay = connection.baseDelay + Math.random() * connection.variation;
    
    return new Promise(resolve => setTimeout(resolve, delay));
  }
};

// Advanced stale element scenarios for Phase 4
export const advancedStaleElementScenarios = {
  // Multi-layer stale elements (parent becomes stale, then children)
  multiLayerStale: (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      // First, make parent stale
      const parent = element.parentElement;
      if (parent) {
        recreateTicketDOM(parent.id || elementId);
        
        // Then after delay, make children stale
        setTimeout(() => {
          const children = element.querySelectorAll('*');
          children.forEach((child, index) => {
            setTimeout(() => {
              if (child.id) {
                recreateTicketDOM(child.id);
              }
            }, index * 200); // Stagger child recreation
          });
        }, 1000);
      }
    }
  },

  // Conditional stale elements (only become stale under certain conditions)
  conditionalStale: (elementId: string, condition: () => boolean) => {
    if (condition()) {
      setTimeout(() => {
        recreateTicketDOM(elementId);
        
        // Chain additional stale scenarios
        setTimeout(() => {
          if (Math.random() < 0.3) { // 30% chance of secondary stale
            recreateTicketDOM(elementId);
          }
        }, Math.random() * 2000 + 1000);
      }, Math.random() * 1000);
    }
  },

  // Intermittent stale elements (randomly become stale over time)
  intermittentStale: (elementId: string, duration: number = 30000) => {
    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (Date.now() - startTime > duration) {
        clearInterval(checkInterval);
        return;
      }
      
      // Random chance of becoming stale (increases over time)
      const elapsedTime = Date.now() - startTime;
      const staleChance = (elapsedTime / duration) * 0.1; // Up to 10% chance
      
      if (Math.random() < staleChance) {
        recreateTicketDOM(elementId);
        
        // Apply enhanced DOM recreation patterns
        if (Math.random() < 0.5) {
          enhancedDOMRecreation.attributeScrambling(elementId);
        }
        if (Math.random() < 0.3) {
          enhancedDOMRecreation.elementDisplacement(elementId);
        }
      }
    }, 2000 + Math.random() * 3000); // Check every 2-5 seconds
  }
};

// Phase 4: Comprehensive automation challenge coordinator
export const phase4AutomationChallenges = {
  // Initialize all Phase 4 challenges
  initialize: () => {
    console.log('🎯 Phase 4 Enhanced Automation Challenges Initialized');
    
    // Start comprehensive DevTools monitoring
    setInterval(() => {
      const results = advancedDevToolsDetection();
      const detected = results.some(r => r.detected && r.confidence > 0.5);
      
      if (detected) {
        // Trigger enhanced challenges when DevTools detected
        const ticketElements = document.querySelectorAll('[data-testid*="ticket-card"]');
        ticketElements.forEach((element, index) => {
          if (element.id) {
            setTimeout(() => {
              const challengeType = Math.floor(Math.random() * 4);
              switch (challengeType) {
                case 0:
                  enhancedDOMRecreation.cascadeRecreation(element.id);
                  break;
                case 1:
                  enhancedDOMRecreation.attributeScrambling(element.id);
                  break;
                case 2:
                  enhancedDOMRecreation.elementDisplacement(element.id);
                  break;
                case 3:
                  enhancedDOMRecreation.styleMutation(element.id);
                  break;
              }
            }, index * 500); // Stagger challenges
          }
        });
      }
    }, 3000); // Check every 3 seconds
    
    // Start intermittent stale element scenarios
    setTimeout(() => {
      const ticketElements = document.querySelectorAll('[data-testid*="ticket-card"]');
      ticketElements.forEach(element => {
        if (element.id) {
          advancedStaleElementScenarios.intermittentStale(element.id, 60000); // 1 minute duration
        }
      });
    }, 5000);
  },

  // Apply challenges to specific element
  applyToElement: (elementId: string, intensity: 'low' | 'medium' | 'high' = 'medium') => {
    const intensityConfig = {
      low: { patterns: 1, timing: 'normal', stale: false },
      medium: { patterns: 2, timing: 'complex', stale: true },
      high: { patterns: 3, timing: 'burst', stale: true }
    };
    
    const config = intensityConfig[intensity];
    
    // Apply DOM recreation patterns
    for (let i = 0; i < config.patterns; i++) {
      setTimeout(() => {
        const pattern = Math.floor(Math.random() * 4);
        switch (pattern) {
          case 0:
            enhancedDOMRecreation.cascadeRecreation(elementId);
            break;
          case 1:
            enhancedDOMRecreation.attributeScrambling(elementId);
            break;
          case 2:
            enhancedDOMRecreation.elementDisplacement(elementId);
            break;
          case 3:
            enhancedDOMRecreation.styleMutation(elementId);
            break;
        }
      }, i * 1000);
    }
    
    // Apply complex timing
    if (config.timing === 'complex') {
      complexTimingChallenges.progressiveDelay(500);
    } else if (config.timing === 'burst') {
      complexTimingChallenges.burstDelay();
    }
    
    // Apply stale element scenarios
    if (config.stale) {
      advancedStaleElementScenarios.conditionalStale(elementId, () => Math.random() < 0.4);
    }
  }
}; 