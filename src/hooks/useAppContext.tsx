import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AppState, AppAction, Ticket } from '../types';
import { 
  generateSampleTickets, 
  generateSampleUsers, 
  generateSampleLogs, 
  recreateTicketDOM,
  saveToLocalStorage,
  loadFromLocalStorage,
  // Phase 4: Enhanced automation challenge utilities
  advancedDevToolsDetection,
  enhancedDOMRecreation,
  complexTimingChallenges,
  advancedStaleElementScenarios
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

  // DevTools detection effect with Phase 4 enhancements
  useEffect(() => {
    let detectInterval: number;
    
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
      }, 1500) as any; // Type assertion for Node.js timer
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

  const updateTicket = async (id: string, updates: Partial<Ticket>) => {
    // Phase 4: Apply complex timing challenges to update operations
    await complexTimingChallenges.progressiveDelay(500);
    
    dispatch({ type: 'UPDATE_TICKET', payload: { id, updates } });
    
    // Phase 4: Apply stale element scenarios after update
    setTimeout(() => {
      advancedStaleElementScenarios.conditionalStale(id, () => {
        const detectionResults = advancedDevToolsDetection();
        return detectionResults.some(r => r.detected && r.confidence > 0.5);
      });
    }, Math.random() * 1000);
  };

  const moveTicket = async (ticketId: string, newStatus: Ticket['status']) => {
    // Phase 4: Enhanced timing challenges for move operations
    await complexTimingChallenges.timeBasedDelay(800);
    
    const newDomVersion = recreateTicketDOM(ticketId);
    dispatch({ 
      type: 'MOVE_TICKET', 
      payload: { ticketId, newStatus, newDomVersion } 
    });
    
    // Phase 4: Apply enhanced DOM recreation patterns
    setTimeout(() => {
      const challengeTypes = [
        () => enhancedDOMRecreation.cascadeRecreation(ticketId),
        () => enhancedDOMRecreation.elementDisplacement(ticketId),
        () => advancedStaleElementScenarios.multiLayerStale(ticketId)
      ];
      
      const randomChallenge = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
      randomChallenge();
    }, Math.random() * 2000 + 500);
  };

  const deleteTicket = async (ticketId: string) => {
    // Phase 4: Network simulation delay for delete operations
    await complexTimingChallenges.networkSimulationDelay();
    
    dispatch({ type: 'DELETE_TICKET', payload: ticketId });
    
    // Phase 4: Apply multi-layer stale elements after deletion
    setTimeout(() => {
      advancedStaleElementScenarios.multiLayerStale(ticketId);
    }, 500);
  };

  const loadMoreTickets = async () => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'ticketsLoading', value: true } });
    
    // Phase 4: Enhanced network delay simulation with connection quality
    await complexTimingChallenges.networkSimulationDelay();
    
    // Additional delay based on DevTools detection
    const detectionResults = advancedDevToolsDetection();
    const devToolsDetected = detectionResults.some(r => r.detected);
    
    if (devToolsDetected) {
      // Slower loading when DevTools detected
      await complexTimingChallenges.burstDelay(1000, 4000);
    }
    
    // Generate 5 more tickets
    const moreTickets = generateSampleTickets(5);
    dispatch({ type: 'LOAD_MORE_TICKETS', payload: moreTickets });
    dispatch({ type: 'SET_LOADING', payload: { key: 'ticketsLoading', value: false } });
    
    // Phase 4: Apply intermittent stale scenarios to new tickets
    setTimeout(() => {
      moreTickets.forEach(ticket => {
        if (Math.random() < 0.4) { // 40% chance
          advancedStaleElementScenarios.intermittentStale(ticket.id, 30000);
        }
      });
    }, 2000);
  };

  const recreateTicketDom = (ticketId: string) => {
    dispatch({ type: 'RECREATE_DOM', payload: { ticketId } });
    
    // Phase 4: Enhanced DOM recreation with pattern application
    setTimeout(() => {
      const patterns = [
        () => enhancedDOMRecreation.attributeScrambling(ticketId),
        () => enhancedDOMRecreation.styleMutation(ticketId),
        () => enhancedDOMRecreation.elementDisplacement(ticketId)
      ];
      
      // Apply 1-2 random patterns
      const numPatterns = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < numPatterns; i++) {
        const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
        setTimeout(randomPattern, i * 500);
      }
    }, Math.random() * 1000);
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

  const addToast = async (type: 'success' | 'warning' | 'error' | 'info', message: string) => {
    // Phase 4: Enhanced timing for toast notifications
    const detectionResults = advancedDevToolsDetection();
    const devToolsDetected = detectionResults.some(r => r.detected);
    
    // Variable toast timing based on DevTools detection
    let duration = 1500; // Default 1.5 seconds
    if (devToolsDetected) {
      duration = 2000 + Math.random() * 1000; // 2-3 seconds when DevTools open
    }
    
    const toast = {
      id: `toast-${Date.now()}-${Math.random()}`,
      type,
      message,
      duration,
      position: {
        x: Math.random() * 100, // Random positioning
        y: Math.random() * 100
      }
    };
    
    // Phase 4: Progressive delay for toast display
    await complexTimingChallenges.progressiveDelay(100);
    
    dispatch({ type: 'ADD_TOAST', payload: toast });
    
    // Auto remove after duration with enhanced timing
    setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', payload: toast.id });
    }, duration);
    
    // Phase 4: Apply DOM challenges to toast elements
    setTimeout(() => {
      const toastElement = document.querySelector(`[data-toast-id="${toast.id}"]`);
      if (toastElement && toastElement.id) {
        enhancedDOMRecreation.styleMutation(toastElement.id);
      }
    }, duration / 2);
  };

  const removeToast = (toastId: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: toastId });
    
    // Phase 4: Apply element displacement challenge on toast removal
    setTimeout(() => {
      const toastElement = document.querySelector(`[data-toast-id="${toastId}"]`);
      if (toastElement && toastElement.id) {
        enhancedDOMRecreation.elementDisplacement(toastElement.id);
      }
    }, 100);
  };

  return {
    toasts: state.uiState.alertsQueue,
    addToast,
    removeToast
  };
};

export const useUI = () => {
  const { state, dispatch } = useAppContext();

  const toggleSidebar = async () => {
    // Phase 4: Complex timing for UI interactions
    await complexTimingChallenges.timeBasedDelay(300);
    
    dispatch({ type: 'TOGGLE_SIDEBAR' });
    
    // Phase 4: Apply DOM challenges to sidebar elements
    setTimeout(() => {
      const sidebarElements = document.querySelectorAll('[data-testid*="sidebar"]');
      sidebarElements.forEach((element, index) => {
        if (element.id) {
          setTimeout(() => {
            enhancedDOMRecreation.attributeScrambling(element.id);
          }, index * 200);
        }
      });
    }, 500);
  };

  const setLoading = async (key: keyof AppState['loadingStates'], value: boolean) => {
    // Phase 4: Network simulation delay for loading state changes
    if (value) {
      await complexTimingChallenges.networkSimulationDelay();
    }
    
    dispatch({ type: 'SET_LOADING', payload: { key, value } });
    
    // Phase 4: Apply challenges when loading states change
    if (value) {
      setTimeout(() => {
        const loadingElements = document.querySelectorAll('[data-testid*="loading"]');
        loadingElements.forEach(element => {
          if (element.id) {
            enhancedDOMRecreation.styleMutation(element.id);
          }
        });
      }, 300);
    }
  };

  return {
    sidebarCollapsed: state.uiState.sidebarCollapsed,
    loadingStates: state.loadingStates,
    devToolsDetected: state.loadingStates.devToolsDetected,
    toggleSidebar,
    setLoading
  };
}; 