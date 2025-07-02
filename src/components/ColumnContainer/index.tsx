import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Card, Typography, Badge } from 'antd';
import { TicketCard } from '../TicketCard';
import type { Ticket, ColumnContainerProps } from '../../types';

const { Title } = Typography;

export const ColumnContainer: React.FC<ColumnContainerProps> = ({
  column,
  tickets,
  onEditTicket,
}) => {
  // Phase 5: Responsive design calculations
  const isMobileView = typeof window !== 'undefined' && window.innerWidth < 768;
  const ticketCount = tickets.length;

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
    <Card
      title={
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          // Phase 5: Responsive title container
          flexWrap: 'wrap',
          gap: '8px',
        }}>
          <Title 
            level={4} 
            style={{ 
              margin: 0, 
              color: columnColor,
              // Phase 5: Responsive font sizing
              fontSize: isMobileView ? '16px' : '18px',
            }}
          >
            {column.name}
          </Title>
          <Badge 
            count={ticketCount} 
            style={{ 
              backgroundColor: columnColor,
              // Phase 5: Responsive badge sizing
              fontSize: isMobileView ? '10px' : '12px',
            }} 
          />
        </div>
      }
      // Phase 5: Enhanced responsive card styling
      styles={{
        body: { 
          padding: isMobileView ? '12px' : '16px',
          minHeight: '400px',
          // Performance optimization
          contain: 'layout style',
        }
      }}
      style={{
        height: '100%',
        // Phase 5: Responsive styling
        minHeight: isMobileView ? '350px' : '500px',
        backgroundColor: '#fafafa',
        border: `2px solid ${columnColor}20`,
        borderRadius: isMobileView ? '6px' : '8px',
        // Performance optimizations
        willChange: 'transform',
        transform: 'translateZ(0)',
      }}
      className="kanban-column-card"
    >
      <Droppable droppableId={column.status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              minHeight: isMobileView ? '300px' : '400px',
              // Phase 5: Enhanced drop zone styling with responsive design
              backgroundColor: snapshot.isDraggingOver 
                ? `${columnColor}10` 
                : 'transparent',
              borderRadius: isMobileView ? '4px' : '6px',
              padding: isMobileView ? '4px' : '8px',
              transition: 'all 0.2s ease',
              // Performance optimization
              contain: 'layout style',
            }}
            className={`droppable-area ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
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
            {tickets.map((ticket: Ticket, index: number) => (
              <div 
                key={ticket.id}
                style={{
                  marginBottom: isMobileView ? '8px' : '12px',
                  // Performance optimization
                  contain: 'layout',
                }}
              >
                <TicketCard
                  ticket={ticket}
                  index={index}
                  onEdit={onEditTicket}
                />
              </div>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Card>
  );
}; 