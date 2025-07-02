import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AppState, AppAction, Ticket } from '../types';
import { 
  generateSampleTickets, 
  generateSampleUsers, 
  generateSampleLogs, 
  recreateTicketDOM,
  saveToLocalStorage,
  loadFromLocalStorage 
} from '../utils';

// Initial state
const initialState: AppState = {
  tickets: [],
  columns: [
    {
      id: 'todo',
      name: 'TODO',
      status: 'TODO',
      ticketCount: 0
    },
    {
      id: 'working',
      name: 'WORKING',
      status: 'WORKING',
      ticketCount: 0,
      maxTickets: 5 // WORKING column has a maximum of 5 tickets
    },
    {
      id: 'done',
      name: 'DONE', 
      status: 'DONE',
      ticketCount: 0
    }
  ],
  users: [],
  logs: [],
  loadingStates: {
    ticketsLoading: false,
    dragInProgress: false,
    calendarOpen: false,
    devToolsDetected: false
  },
  uiState: {
    sidebarCollapsed: false,
    alertsQueue: [],
    infiniteScrollPage: 1,
    totalTicketsLoaded: 10 // Start with 10 tickets, load +5 per scroll
  }
};

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_TICKETS':
      return {
        ...state,
        tickets: action.payload,
        columns: state.columns.map(column => ({
          ...column,
          ticketCount: action.payload.filter(ticket => ticket.status === column.status).length
        }))
      };

    case 'ADD_TICKET':
      const newTickets = [...state.tickets, action.payload];
      return {
        ...state,
        tickets: newTickets,
        columns: state.columns.map(column => ({
          ...column,
          ticketCount: newTickets.filter(ticket => ticket.status === column.status).length
        }))
      };

    case 'UPDATE_TICKET':
      const updatedTickets = state.tickets.map(ticket =>
        ticket.id === action.payload.id
          ? { ...ticket, ...action.payload.updates }
          : ticket
      );
      return {
        ...state,
        tickets: updatedTickets,
        columns: state.columns.map(column => ({
          ...column,
          ticketCount: updatedTickets.filter(ticket => ticket.status === column.status).length
        }))
      };

    case 'MOVE_TICKET':
      const movedTickets = state.tickets.map(ticket =>
        ticket.id === action.payload.ticketId
          ? { 
              ...ticket, 
              status: action.payload.newStatus,
              domVersion: action.payload.newDomVersion // Increment for DOM recreation
            }
          : ticket
      );
      return {
        ...state,
        tickets: movedTickets,
        columns: state.columns.map(column => ({
          ...column,
          ticketCount: movedTickets.filter(ticket => ticket.status === column.status).length
        }))
      };

    case 'DELETE_TICKET':
      const filteredTickets = state.tickets.filter(ticket => ticket.id !== action.payload);
      return {
        ...state,
        tickets: filteredTickets,
        columns: state.columns.map(column => ({
          ...column,
          ticketCount: filteredTickets.filter(ticket => ticket.status === column.status).length
        }))
      };

    case 'SET_LOADING':
      return {
        ...state,
        loadingStates: {
          ...state.loadingStates,
          [action.payload.key]: action.payload.value
        }
      };

    case 'ADD_TOAST':
      return {
        ...state,
        uiState: {
          ...state.uiState,
          alertsQueue: [...state.uiState.alertsQueue, action.payload]
        }
      };

    case 'REMOVE_TOAST':
      return {
        ...state,
        uiState: {
          ...state.uiState,
          alertsQueue: state.uiState.alertsQueue.filter(toast => toast.id !== action.payload)
        }
      };

    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        uiState: {
          ...state.uiState,
          sidebarCollapsed: !state.uiState.sidebarCollapsed
        }
      };

    case 'LOAD_MORE_TICKETS':
      const allTickets = [...state.tickets, ...action.payload];
      return {
        ...state,
        tickets: allTickets,
        uiState: {
          ...state.uiState,
          infiniteScrollPage: state.uiState.infiniteScrollPage + 1,
          totalTicketsLoaded: allTickets.length
        },
        columns: state.columns.map(column => ({
          ...column,
          ticketCount: allTickets.filter(ticket => ticket.status === column.status).length
        }))
      };

    case 'RECREATE_DOM':
      return {
        ...state,
        tickets: state.tickets.map(ticket =>
          ticket.id === action.payload.ticketId
            ? { ...ticket, domVersion: recreateTicketDOM(ticket.id) }
            : ticket
        )
      };

    case 'DETECT_DEVTOOLS':
      return {
        ...state,
        loadingStates: {
          ...state.loadingStates,
          devToolsDetected: action.payload
        }
      };

    default:
      return state;
  }
};

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = () => {
      // Load data from localStorage or generate sample data
      const savedTickets = loadFromLocalStorage<Ticket[]>('bugtracker-tickets', []);

      // If no saved data, generate sample data
      if (savedTickets.length === 0) {
        const sampleTickets = generateSampleTickets(10); // Start with 10 tickets
        const sampleUsers = generateSampleUsers();
        const sampleLogs = generateSampleLogs(50);

        dispatch({ type: 'SET_TICKETS', payload: sampleTickets });
        
        // Save to localStorage
        saveToLocalStorage('bugtracker-tickets', sampleTickets);
        saveToLocalStorage('bugtracker-users', sampleUsers);
        saveToLocalStorage('bugtracker-logs', sampleLogs);
      } else {
        // Load saved data and convert date strings back to Date objects
        const convertedTickets = savedTickets.map(ticket => ({
          ...ticket,
          createdAt: new Date(ticket.createdAt),
          deadline: ticket.deadline ? new Date(ticket.deadline) : null
        }));
        dispatch({ type: 'SET_TICKETS', payload: convertedTickets });
      }
    };

    initializeData();
  }, []);

  // Save tickets to localStorage whenever they change
  useEffect(() => {
    if (state.tickets.length > 0) {
      saveToLocalStorage('bugtracker-tickets', state.tickets);
    }
  }, [state.tickets]);

  // DevTools detection effect
  useEffect(() => {
    let detectInterval: number;
    
    const startDetection = () => {
      detectInterval = setInterval(() => {
        // Simple DevTools detection method
        const threshold = 160;
        const isDevToolsOpen = window.outerHeight - window.innerHeight > threshold ||
                              window.outerWidth - window.innerWidth > threshold;
        
        if (isDevToolsOpen !== state.loadingStates.devToolsDetected) {
          dispatch({ type: 'DETECT_DEVTOOLS', payload: isDevToolsOpen });
        }
      }, 1000);
    };

    startDetection();

    return () => {
      if (detectInterval) {
        clearInterval(detectInterval);
      }
    };
  }, [state.loadingStates.devToolsDetected]);

  const value = React.useMemo(() => ({
    state,
    dispatch
  }), [state]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Custom hooks for specific functionality
export const useTickets = () => {
  const { state, dispatch } = useAppContext();
  
  const addTicket = (ticket: Ticket) => {
    dispatch({ type: 'ADD_TICKET', payload: ticket });
  };

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    dispatch({ type: 'UPDATE_TICKET', payload: { id, updates } });
  };

  const moveTicket = (ticketId: string, newStatus: Ticket['status']) => {
    const newDomVersion = recreateTicketDOM(ticketId);
    dispatch({ 
      type: 'MOVE_TICKET', 
      payload: { ticketId, newStatus, newDomVersion } 
    });
  };

  const deleteTicket = (ticketId: string) => {
    dispatch({ type: 'DELETE_TICKET', payload: ticketId });
  };

  const loadMoreTickets = async () => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'ticketsLoading', value: true } });
    
    // Simulate network delay with variable timing (automation challenge)
    const delay = 1000 + Math.random() * 3000; // 1-4 seconds
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Generate 5 more tickets
    const moreTickets = generateSampleTickets(5);
    dispatch({ type: 'LOAD_MORE_TICKETS', payload: moreTickets });
    dispatch({ type: 'SET_LOADING', payload: { key: 'ticketsLoading', value: false } });
  };

  const recreateTicketDom = (ticketId: string) => {
    dispatch({ type: 'RECREATE_DOM', payload: { ticketId } });
  };

  return {
    tickets: state.tickets,
    columns: state.columns,
    isLoading: state.loadingStates.ticketsLoading,
    totalLoaded: state.uiState.totalTicketsLoaded,
    addTicket,
    updateTicket,
    moveTicket,
    deleteTicket,
    loadMoreTickets,
    recreateTicketDom
  };
};

export const useToasts = () => {
  const { state, dispatch } = useAppContext();

  const addToast = (type: 'success' | 'warning' | 'error' | 'info', message: string) => {
    const toast = {
      id: `toast-${Date.now()}-${Math.random()}`,
      type,
      message,
      duration: 1500, // 1.5 seconds for automation challenges
      position: {
        x: Math.random() * 100, // Random positioning
        y: Math.random() * 100
      }
    };
    
    dispatch({ type: 'ADD_TOAST', payload: toast });
    
    // Auto remove after duration
    setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', payload: toast.id });
    }, toast.duration);
  };

  const removeToast = (toastId: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: toastId });
  };

  return {
    toasts: state.uiState.alertsQueue,
    addToast,
    removeToast
  };
};

export const useUI = () => {
  const { state, dispatch } = useAppContext();

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const setLoading = (key: keyof AppState['loadingStates'], value: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: { key, value } });
  };

  return {
    sidebarCollapsed: state.uiState.sidebarCollapsed,
    loadingStates: state.loadingStates,
    devToolsDetected: state.loadingStates.devToolsDetected,
    toggleSidebar,
    setLoading
  };
}; 