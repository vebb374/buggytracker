import { useAppContext } from './useAppContext';
import type { Ticket } from '../types';
import { 
  recreateTicketDOM,
  advancedDevToolsDetection,
  enhancedDOMRecreation,
  complexTimingChallenges,
  advancedStaleElementScenarios,
  generateSampleTickets
} from '../utils';

// Custom hooks for specific functionality
export const useTickets = () => {
  const { state, dispatch } = useAppContext();
  
  const addTicket = (ticket: Ticket) => {
    dispatch({ type: 'ADD_TICKET', payload: ticket });
  };

  const updateTicket = async (id: string, updates: Partial<Ticket>) => {
    await complexTimingChallenges.progressiveDelay(500);
    dispatch({ type: 'UPDATE_TICKET', payload: { id, updates } });
    setTimeout(() => {
      advancedStaleElementScenarios.conditionalStale(id, () => {
        const detectionResults = advancedDevToolsDetection();
        return detectionResults.some(r => r.detected && r.confidence > 0.5);
      });
    }, Math.random() * 1000);
  };

  const moveTicket = (ticketId: string, newStatus: Ticket['status']) => {
    dispatch({ 
      type: 'MOVE_TICKET', 
      payload: { ticketId, newStatus } 
    });
  };

  const deleteTicket = async (ticketId: string) => {
    dispatch({ type: 'DELETE_TICKET', payload: ticketId });
  };

  const loadMoreTickets = async () => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'ticketsLoading', value: true } });
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    const moreTickets = generateSampleTickets(5);
    dispatch({ type: 'LOAD_MORE_TICKETS', payload: moreTickets });
    dispatch({ type: 'SET_LOADING', payload: { key: 'ticketsLoading', value: false } });
  };

  const recreateTicketDom = (ticketId: string) => {
    // This function is no longer needed for complex DOM manipulation,
    // but we can keep it for simple version updates if required elsewhere.
    // For now, it does nothing to prevent drag issues.
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

  const addToast = async (type: 'success' | 'warning' | 'error' | 'info', message: string, duration: number = 1000) => {
    const toast = {
      id: `toast-${Date.now()}-${Math.random()}`,
      type,
      message,
      duration,
      position: {
        x: Math.random() * 100,
        y: Math.random() * 100
      }
    };
    await complexTimingChallenges.progressiveDelay(100);
    dispatch({ type: 'ADD_TOAST', payload: toast });
    const removeToastTimeout = setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', payload: toast.id });
    }, duration);
    const applyDomChallengeTimeout = setTimeout(() => {
      const toastElement = document.querySelector(`[data-toast-id="${toast.id}"]`);
      if (toastElement && toastElement.id) {
        enhancedDOMRecreation.styleMutation(toastElement.id);
      }
    }, duration / 2);

    return () => {
      clearTimeout(removeToastTimeout);
      clearTimeout(applyDomChallengeTimeout);
    }
  };

  const removeToast = (toastId: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: toastId });
    const removeToastTimeout = setTimeout(() => {
      const toastElement = document.querySelector(`[data-toast-id="${toastId}"]`);
      if (toastElement && toastElement.id) {
        enhancedDOMRecreation.elementDisplacement(toastElement.id);
      }
    }, 100);
    return () => clearTimeout(removeToastTimeout);
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
    await complexTimingChallenges.timeBasedDelay(300);
    dispatch({ type: 'TOGGLE_SIDEBAR' });
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

  const setLoading = async (key: 'ticketsLoading' | 'dragInProgress' | 'calendarOpen' | 'devToolsDetected', value: boolean) => {
    if (value) {
      await complexTimingChallenges.networkSimulationDelay();
    }
    dispatch({ type: 'SET_LOADING', payload: { key, value } });
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