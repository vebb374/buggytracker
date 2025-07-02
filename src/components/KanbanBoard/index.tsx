import React from 'react';
import { Spin } from 'antd';
import { DragDropContext } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { ColumnContainer } from '../ColumnContainer';
import { useAppContext } from '../../hooks/useAppContext';
import { useTickets, useToasts } from '../../hooks/customHooks';
import type { Ticket } from '../../types';

interface KanbanBoardProps {
  onEditTicket?: (ticket: Ticket) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ onEditTicket }) => {
  const { state } = useAppContext();
  const { moveTicket } = useTickets();
  const { addToast } = useToasts();
  const { tickets, columns, loadingStates } = state;

  const handleNextColumn = (ticket: Ticket) => {
    const currentStatus = ticket.status;
    let nextStatus: 'TODO' | 'WORKING' | 'DONE' | null = null;
    
    if(currentStatus === 'TODO') nextStatus = 'WORKING';
    if(currentStatus === 'WORKING') nextStatus = 'DONE';

    if(nextStatus) {
        if (nextStatus === 'WORKING') {
            const workingTickets = tickets.filter(t => t.status === 'WORKING');
            if (workingTickets.length >= 5) {
                addToast('warning', 'The WORKING column is at full capacity.');
                return;
            }
        }
        moveTicket(ticket.id, nextStatus);
        addToast('success', `Moved "${ticket.title}" to ${nextStatus}`);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    
    const newStatus = destination.droppableId as 'TODO' | 'WORKING' | 'DONE';
    
    if (newStatus === 'WORKING') {
        const workingTickets = tickets.filter(t => t.status === 'WORKING');
        if (workingTickets.length >= 5) {
            addToast('warning', 'The WORKING column is at full capacity.');
            return;
        }
    }
    
    moveTicket(draggableId, newStatus);
    
    const ticket = tickets.find(t => t.id === draggableId);
    if(ticket) {
      addToast('success', `Moved "${ticket.title}" to ${newStatus}`);
    }
  };

  if (loadingStates.ticketsLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" tip="Loading tickets..." />
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', padding: '16px' }}>
        {columns.map((column) => {
          const columnTickets = tickets.filter(ticket => ticket.status === column.status);
          return (
            <ColumnContainer
              key={column.id}
              column={column}
              tickets={columnTickets}
              onEditTicket={onEditTicket}
              onNextColumn={handleNextColumn}
            />
          );
        })}
      </div>
    </DragDropContext>
  );
}; 