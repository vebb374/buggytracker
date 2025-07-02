import React, { useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { Row, Col, Spin } from 'antd';
import { ColumnContainer } from '../ColumnContainer';
import { useAppContext, useTickets, useToasts } from '../../hooks/useAppContext';
import { 
  advancedDevToolsDetection,
  enhancedDOMRecreation,
  complexTimingChallenges,
  advancedStaleElementScenarios,
  phase4AutomationChallenges
} from '../../utils';
import type { Ticket } from '../../types';

interface KanbanBoardProps {
  onEditTicket?: (ticket: Ticket) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ onEditTicket }) => {
  const { state } = useAppContext();
  const { moveTicket, recreateTicketDom } = useTickets();
  const { addToast } = useToasts();
  const { tickets, columns, loadingStates } = state;

  // Phase 4: Initialize enhanced automation challenges
  useEffect(() => {
    // Initialize Phase 4 challenges on component mount
    phase4AutomationChallenges.initialize();
    
    // Enhanced DevTools monitoring with multiple detection methods
    const enhancedDevToolsMonitoring = setInterval(() => {
      const detectionResults = advancedDevToolsDetection();
      const highConfidenceDetections = detectionResults.filter(r => r.detected && r.confidence > 0.7);
      
      if (highConfidenceDetections.length > 0) {
        // Log detection methods for automation testing
        console.log('🔍 Phase 4 DevTools Detection:', highConfidenceDetections.map(r => r.method));
        
        // Apply enhanced DOM recreation when DevTools detected
        const allTicketElements = document.querySelectorAll('[data-testid*="ticket-card"]');
        allTicketElements.forEach((element, index) => {
          if (element.id) {
            setTimeout(() => {
              // Apply different challenge patterns based on detection confidence
              const maxConfidence = Math.max(...highConfidenceDetections.map(r => r.confidence));
              
              if (maxConfidence > 0.9) {
                // High confidence: Apply cascade recreation
                enhancedDOMRecreation.cascadeRecreation(element.id);
                phase4AutomationChallenges.applyToElement(element.id, 'high');
              } else if (maxConfidence > 0.8) {
                // Medium confidence: Apply attribute scrambling
                enhancedDOMRecreation.attributeScrambling(element.id);
                phase4AutomationChallenges.applyToElement(element.id, 'medium');
              } else {
                // Lower confidence: Apply style mutation
                enhancedDOMRecreation.styleMutation(element.id);
                phase4AutomationChallenges.applyToElement(element.id, 'low');
              }
            }, index * 300); // Stagger applications
          }
        });
        
        // Add toast notification about enhanced challenges
        addToast('info', `🎯 Phase 4 Challenges Activated (${highConfidenceDetections.length} detection methods)`);
      }
    }, 2000); // Check every 2 seconds

    return () => {
      clearInterval(enhancedDevToolsMonitoring);
    };
  }, [addToast]);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Phase 4: Complex timing challenge for drag operations
    await complexTimingChallenges.timeBasedDelay(1000);

    if (!destination) {
      // Cancelled drag - apply intermittent stale challenge
      advancedStaleElementScenarios.conditionalStale(draggableId, () => Math.random() < 0.2);
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      // No movement - apply style mutation challenge
      enhancedDOMRecreation.styleMutation(draggableId);
      return;
    }

    // Phase 4: Enhanced variable delay for automation challenges
    const dragComplexity = Math.abs(destination.index - source.index);
    if (dragComplexity > 2) {
      // Complex drag movement - use burst delay
      await complexTimingChallenges.burstDelay(500, 3000);
    } else {
      // Simple drag - use progressive delay
      await complexTimingChallenges.progressiveDelay(800);
    }

    const newStatus = destination.droppableId as 'TODO' | 'WORKING' | 'DONE';
    const currentTicket = tickets.find(t => t.id === draggableId);
    
    if (!currentTicket) {
      // Ticket not found - apply multi-layer stale scenario
      advancedStaleElementScenarios.multiLayerStale(draggableId);
      addToast('error', '🎯 Phase 4: Ticket not found during drag operation');
      return;
    }

    // Check WORKING column capacity limit
    if (newStatus === 'WORKING') {
      const workingTickets = tickets.filter(t => t.status === 'WORKING');
      if (workingTickets.length >= 5) {
        addToast('warning', '⚠️ WORKING column is at capacity (5 tickets max)');
        // Apply enhanced DOM recreation on capacity limit
        enhancedDOMRecreation.cascadeRecreation(draggableId);
        return;
      }
    }

    try {
      // Phase 4: Network simulation delay
      await complexTimingChallenges.networkSimulationDelay();
      
      // Move the ticket
      moveTicket(draggableId, newStatus);
      
      // Phase 4: Enhanced DOM recreation after successful move
      setTimeout(() => {
        recreateTicketDom(draggableId);
        
        // Apply additional challenges based on move type
        if (currentTicket.status !== newStatus) {
          // Status change - apply enhanced patterns
          const patterns = [
            () => enhancedDOMRecreation.attributeScrambling(draggableId),
            () => enhancedDOMRecreation.elementDisplacement(draggableId),
            () => advancedStaleElementScenarios.intermittentStale(draggableId, 45000)
          ];
          
          // Apply random pattern
          const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
          setTimeout(randomPattern, Math.random() * 1000);
        }
      }, Math.random() * 2000 + 500);

      // Phase 4: Enhanced toast notification with detection info
      const detectionResults = advancedDevToolsDetection();
      const activeDetections = detectionResults.filter(r => r.detected).length;
      
      addToast(
        'success', 
        `✅ Moved "${currentTicket.title}" to ${newStatus}${activeDetections > 0 ? ` (${activeDetections} detection methods active)` : ''}`
      );
      
    } catch (error) {
      // Error handling with enhanced challenges
      addToast('error', '❌ Failed to move ticket - Phase 4 network simulation');
      
      // Apply error-specific challenges
      enhancedDOMRecreation.cascadeRecreation(draggableId);
      setTimeout(() => {
        advancedStaleElementScenarios.multiLayerStale(draggableId);
      }, 1000);
    }
  };

  if (loadingStates.ticketsLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px' 
      }}>
        <Spin size="large" tip="Loading tickets..." />
      </div>
    );
  }

  return (
    <div 
      style={{ 
        padding: '24px',
        minHeight: '600px',
        background: '#f5f5f5'
      }}
      data-testid="kanban-board"
    >
      <DragDropContext onDragEnd={handleDragEnd}>
        <Row 
          gutter={[16, 16]} 
          style={{ 
            minHeight: '500px',
            // Phase 5: Responsive row styling
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
          className="kanban-container"
        >
          {columns.map((column) => {
            const columnTickets = tickets.filter(ticket => ticket.status === column.status);
            
            return (
              <Col 
                key={column.id} 
                xs={24} 
                sm={24} 
                md={8} 
                lg={8}
                style={{
                  // Phase 5: Mobile responsive column sizing
                  minWidth: '280px',
                  maxWidth: '100%',
                }}
                className="kanban-column"
              >
                <ColumnContainer
                  column={column}
                  tickets={columnTickets}
                  onEditTicket={onEditTicket}
                />
              </Col>
            );
          })}
        </Row>
      </DragDropContext>
      
      {/* Phase 4: Development info panel */}
      {typeof window !== 'undefined' && import.meta.env.DEV && (
        <div style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '8px',
          borderRadius: '4px',
          fontSize: '10px',
          zIndex: 1000
        }}>
          🎯 Phase 4 Enhanced Automation Challenges Active
        </div>
      )}
    </div>
  );
}; 