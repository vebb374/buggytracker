// Core ticket and domain types for BugTracker Pro

export interface Ticket {
  id: string;
  title: string;
  description?: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'TODO' | 'WORKING' | 'DONE';
  assignee: string;
  deadline: Date | null;
  tags: string[];
  createdAt: Date;
}

export interface Column {
  id: string;
  name: string;
  status: 'TODO' | 'WORKING' | 'DONE';
  ticketCount: number;
  maxTickets?: number; // WORKING column has max 5
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error';
  message: string;
  source: string;
  category: 'system' | 'user' | 'automation';
}

// Application state types
export interface AppState {
  tickets: Ticket[];
  columns: Column[];
  users: User[];
  logs: LogEntry[];
  loadingStates: {
    ticketsLoading: boolean;
    dragInProgress: boolean;
    calendarOpen: boolean;
    devToolsDetected: boolean;
  };
  uiState: {
    sidebarCollapsed: boolean;
    alertsQueue: ToastAlert[];
    infiniteScrollPage: number;
    totalTicketsLoaded: number;
  };
}

export interface ToastAlert {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  duration: number;
  position?: { x: number; y: number };
}

// Action types for state management
export type AppAction =
  | { type: 'SET_TICKETS'; payload: Ticket[] }
  | { type: 'ADD_TICKET'; payload: Ticket }
  | { type: 'UPDATE_TICKET'; payload: { id: string; updates: Partial<Ticket> } }
  | { type: 'MOVE_TICKET'; payload: { ticketId: string; newStatus: Ticket['status'] } }
  | { type: 'DELETE_TICKET'; payload: string }
  | { type: 'SET_LOADING'; payload: { key: keyof AppState['loadingStates']; value: boolean } }
  | { type: 'ADD_TOAST'; payload: ToastAlert }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'LOAD_MORE_TICKETS'; payload: Ticket[] }
  | { type: 'DETECT_DEVTOOLS'; payload: boolean };

// Drag and drop types
export interface DragResult {
  draggableId: string;
  type: string;
  source: {
    droppableId: string;
    index: number;
  };
  destination?: {
    droppableId: string;
    index: number;
  } | null;
  reason: 'DROP' | 'CANCEL';
}

// Calendar picker types
export interface CalendarProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  ticketId: string;
  autoCloseTimer?: number;
}

// Infinite scroll types
export interface InfiniteScrollProps {
  loadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  items: Ticket[];
}

// Component props interfaces
export interface TicketCardProps {
  ticket: Ticket;
  onEdit?: (ticket: Ticket) => void;
  onDelete?: (ticketId: string) => void;
  onNextColumn?: (ticket: Ticket) => void;
  isDragging?: boolean;
}

export interface ColumnContainerProps {
  column: Column;
  tickets: Ticket[];
  onTicketMove?: (ticketId: string, newStatus: Ticket['status']) => void;
  onEditTicket?: (ticket: Ticket) => void;
  onNextColumn?: (ticket: Ticket) => void;
}

export interface TicketEditorProps {
  ticket?: Ticket;
  isOpen: boolean;
  onSave: (ticket: Ticket) => void;
  onCancel: () => void;
  mode: 'create' | 'edit';
} 