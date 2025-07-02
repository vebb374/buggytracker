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