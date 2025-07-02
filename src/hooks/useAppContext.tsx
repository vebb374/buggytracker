import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AppState, AppAction } from '../types';
import { 
  generateDeterministicSampleTickets,
  advancedDevToolsDetection,
  complexTimingChallenges,
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

    case 'ADD_TICKET': {
      const newTickets = [...state.tickets, action.payload];
      return {
        ...state,
        tickets: newTickets,
        columns: state.columns.map(column => ({
          ...column,
          ticketCount: newTickets.filter(ticket => ticket.status === column.status).length
        }))
      };
    }

    case 'UPDATE_TICKET': {
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
    }

    case 'MOVE_TICKET': {
      const movedTickets = state.tickets.map(ticket =>
        ticket.id === action.payload.ticketId
          ? { ...ticket, status: action.payload.newStatus }
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
    }

    case 'DELETE_TICKET': {
      const filteredTickets = state.tickets.filter(ticket => ticket.id !== action.payload);
      return {
        ...state,
        tickets: filteredTickets,
        columns: state.columns.map(column => ({
          ...column,
          ticketCount: filteredTickets.filter(ticket => ticket.status === column.status).length
        }))
      };
    }

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

    case 'LOAD_MORE_TICKETS': {
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
    }

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
      // Generate sample data on every load
      const sampleTickets = generateDeterministicSampleTickets(); // Start with 5 deterministic tickets
      dispatch({ type: 'SET_TICKETS', payload: sampleTickets });
    };

    initializeData();
  }, []);

  // DevTools detection effect with Phase 4 enhancements
  useEffect(() => {
    let detectInterval: NodeJS.Timeout;
    
    const startDetection = () => {
      detectInterval = setInterval(() => {
        const detectionResults = advancedDevToolsDetection();
        const activeDetections = detectionResults.filter(r => r.detected);
        
        if (activeDetections.length > 0) {
          console.log('🔍 Enhanced DevTools Detection Active:', activeDetections.map(r => r.method));
          
          // Apply enhanced timing challenges based on detection confidence
          const maxConfidence = Math.max(...activeDetections.map(r => r.confidence));
          if (maxConfidence > 0.8) {
            // High confidence: Apply more complex challenges
            complexTimingChallenges.progressiveDelay(200);
          }
        }
      }, 1500);
    };

    startDetection();

    return () => {
      if (detectInterval) {
        clearInterval(detectInterval);
      }
    };
  }, []);

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