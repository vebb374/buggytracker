import React from 'react';
import { Typography, Badge } from 'antd';
import { Droppable } from '@hello-pangea/dnd';
import { TicketCard } from '../TicketCard';
import type {  ColumnContainerProps } from '../../types';

const { Title } = Typography;

export const ColumnContainer: React.FC<ColumnContainerProps> = ({
  column,
  tickets,
  onEditTicket,
  onNextColumn,
}) => {
  // Phase 5: Responsive design calculations
  const isMobileView = typeof window !== 'undefined' && window.innerWidth < 768;

  // Phase 5: Get column color based on status
  const getColumnColor = (status: string) => {
    switch (status) {
      case 'TODO': return '#52c41a';
      case 'WORKING': return '#faad14';
      case 'DONE': return '#8c8c8c';
      default: return '#d9d9d9';
    }
  };

  const columnColor = getColumnColor(column.status);

  return (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '300px',
        flexShrink: 0,
        backgroundColor: '#f4f5f7',
        borderRadius: '8px',
        padding: '8px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '0 8px' }}>
          <Title level={4} style={{ margin: 0, color: columnColor, fontSize: '16px' }}>
            {column.name}
          </Title>
          <Badge count={tickets.length} style={{ backgroundColor: columnColor }} />
      </div>
      <Droppable droppableId={column.status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              flexGrow: 1,
              minHeight: '100px',
              backgroundColor: snapshot.isDraggingOver ? '#e6f7ff' : '#f4f5f7',
              borderRadius: '6px',
              padding: '8px',
              transition: 'background-color 0.2s ease',
            }}
          >
            {/* Phase 5: Enhanced empty state for responsive design */}
            {tickets.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: isMobileView ? '24px 12px' : '40px 20px',
                color: '#8c8c8c',
                fontSize: isMobileView ? '13px' : '14px',
                fontStyle: 'italic',
              }}>
                {column.status === 'TODO' && 'Drop new tickets here'}
                {column.status === 'WORKING' && 'Drag active tasks here'}
                {column.status === 'DONE' && 'Completed tickets go here'}
              </div>
            )}
            
            {/* Phase 5: Enhanced ticket rendering with responsive spacing */}
            {tickets.map((ticket, index) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                index={index}
                onEdit={onEditTicket}
                onNextColumn={onNextColumn}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}; 