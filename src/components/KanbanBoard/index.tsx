import React from 'react';
import { Spin } from 'antd';
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core';
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
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

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

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;
    
    const activeTicket = tickets.find(t => t.id === activeId);
    if (!activeTicket) return;

    // Find the target column's status
    let newStatus: 'TODO' | 'WORKING' | 'DONE' | null = null;
    const overIsColumn = columns.some(c => c.status === overId);

    if (overIsColumn) {
      newStatus = overId as 'TODO' | 'WORKING' | 'DONE';
    } else {
      const overTicket = tickets.find(t => t.id === overId);
      if (overTicket) {
        newStatus = overTicket.status;
      }
    }
    
    if (!newStatus || activeTicket.status === newStatus) {
      return;
    }
    
    if (newStatus === 'WORKING') {
        const workingTickets = tickets.filter(t => t.status === 'WORKING');
        if (workingTickets.length >= 5) {
            addToast('warning', 'The WORKING column is at full capacity.');
            return;
        }
    }
    
    moveTicket(activeId, newStatus);
    addToast('success', `Moved "${activeTicket.title}" to ${newStatus}`);
  };

  if (loadingStates.ticketsLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" tip="Loading tickets..." />
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
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
    </DndContext>
  );
}; 