import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { Row, Col, Spin } from 'antd';
import { ColumnContainer } from '../ColumnContainer';
import { useTickets, useToasts } from '../../hooks/useAppContext';
import { addVariableDelay } from '../../utils';

export const KanbanBoard: React.FC = () => {
  const { tickets, columns, isLoading, moveTicket, recreateTicketDom } = useTickets();
  const { addToast } = useToasts();

  const handleDragStart = () => {
    // Add toast notification on drag start
    addToast('info', 'Moving ticket...');
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a valid droppable area
    if (!destination) {
      addToast('warning', 'Invalid drop location');
      return;
    }

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Get the target status from droppable ID
    const newStatus = destination.droppableId as 'TODO' | 'WORKING' | 'DONE';
    
    // Check WORKING column limit (max 5 tickets)
    if (newStatus === 'WORKING') {
      const workingTickets = tickets.filter(ticket => ticket.status === 'WORKING');
      if (workingTickets.length >= 5) {
        addToast('error', 'WORKING column is at maximum capacity (5 tickets)');
        return;
      }
    }

    try {
      // Add variable delay for automation challenges (1-4 seconds)
      await addVariableDelay(1000);
      
      // Move the ticket
      moveTicket(draggableId, newStatus);
      
      // Add success notification
      addToast('success', `Ticket moved to ${newStatus}`);
      
      // Recreate DOM elements after a delay (automation challenge)
      setTimeout(() => {
        recreateTicketDom(draggableId);
      }, 2000);
      
    } catch (error) {
      addToast('error', 'Failed to move ticket');
      console.error('Error moving ticket:', error);
    }
  };

  if (isLoading) {
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
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Row gutter={[24, 24]} style={{ height: '100%' }}>
        {columns.map((column) => {
          const columnTickets = tickets.filter(ticket => ticket.status === column.status);
          
          return (
            <Col 
              key={column.id} 
              xs={24} 
              md={8} 
              style={{ 
                height: '100%',
                minHeight: '600px'
              }}
            >
              <ColumnContainer
                column={column}
                tickets={columnTickets}
                onTicketMove={moveTicket}
                maxTickets={column.maxTickets}
              />
            </Col>
          );
        })}
      </Row>
    </DragDropContext>
  );
}; 