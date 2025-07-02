import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Card, Typography, Badge, Space, Alert } from 'antd';
import { PlusOutlined, WarningOutlined } from '@ant-design/icons';
import type { ColumnContainerProps } from '../../types';
import { TicketCard } from '../TicketCard';
import { InfiniteScroll } from '../InfiniteScroll';

const { Title, Text } = Typography;

export const ColumnContainer: React.FC<ColumnContainerProps> = ({
  column,
  tickets,
  maxTickets
}) => {
  // Color coding for columns
  const getColumnColor = (status: string) => {
    switch (status) {
      case 'TODO':
        return { 
          headerBg: '#f6ffed', 
          headerBorder: '#b7eb8f',
          badgeColor: 'processing' as const
        };
      case 'WORKING':
        return { 
          headerBg: '#fff7e6', 
          headerBorder: '#ffd591',
          badgeColor: 'warning' as const
        };
      case 'DONE':
        return { 
          headerBg: '#f6f6f6', 
          headerBorder: '#d9d9d9',
          badgeColor: 'success' as const
        };
      default:
        return { 
          headerBg: '#fafafa', 
          headerBorder: '#d9d9d9',
          badgeColor: 'default' as const
        };
    }
  };

  const colors = getColumnColor(column.status);
  const isNearLimit = maxTickets && tickets.length >= maxTickets - 1;
  const isAtLimit = maxTickets && tickets.length >= maxTickets;

  return (
    <Card
      style={{ 
        height: '100%',
        border: `2px solid ${colors.headerBorder}`,
        borderRadius: '12px'
      }}
      bodyStyle={{ 
        padding: '16px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Column Header */}
      <div 
        style={{ 
          background: colors.headerBg,
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '16px',
          border: `1px solid ${colors.headerBorder}`
        }}
      >
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <div>
            <Title level={4} style={{ margin: 0, color: '#262626' }}>
              {column.name}
            </Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {maxTickets ? `${tickets.length}/${maxTickets} tickets` : `${tickets.length} tickets`}
            </Text>
          </div>
          <Badge 
            count={tickets.length} 
            status={colors.badgeColor}
            style={{ backgroundColor: colors.headerBorder }}
          />
        </Space>

        {/* Working column capacity warning */}
        {column.status === 'WORKING' && isNearLimit && (
                      <Alert
              message={isAtLimit ? "Column at capacity!" : "Near capacity limit"}
              type={isAtLimit ? "error" : "warning"}
              icon={<WarningOutlined />}
              style={{ marginTop: '8px' }}
            />
        )}
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={column.status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              flex: 1,
              minHeight: '400px',
              backgroundColor: snapshot.isDraggingOver ? '#f0f8ff' : 'transparent',
              borderRadius: '8px',
              border: snapshot.isDraggingOver ? '2px dashed #1890ff' : '2px dashed transparent',
              transition: 'all 0.2s ease',
              padding: '8px',
              overflow: 'hidden'
            }}
          >
            {/* Tickets List */}
            {column.status === 'TODO' ? (
              // TODO column uses infinite scroll
              <InfiniteScroll
                hasMore={true}
                items={tickets}
              />
            ) : (
              // WORKING and DONE columns use regular list
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px',
                height: '100%'
              }}>
                {tickets.map((ticket, index) => (
                  <TicketCard
                    key={`${ticket.id}-v${ticket.domVersion}`} // Include domVersion for DOM recreation
                    ticket={ticket}
                    index={index}
                    isDragging={snapshot.isDraggingOver}
                  />
                ))}
                
                {/* DONE column tickets are grayed out */}
                {column.status === 'DONE' && tickets.length === 0 && (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '48px 16px',
                    color: '#999'
                  }}>
                    <Text type="secondary">
                      No completed tickets yet
                    </Text>
                  </div>
                )}
              </div>
            )}
            
            {provided.placeholder}
            
            {/* Add ticket button for TODO column */}
            {column.status === 'TODO' && (
              <Card
                style={{ 
                  marginTop: '12px',
                  border: '2px dashed #d9d9d9',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                bodyStyle={{ 
                  padding: '16px',
                  textAlign: 'center'
                }}
                hoverable
              >
                <Space>
                  <PlusOutlined style={{ color: '#1890ff' }} />
                  <Text style={{ color: '#1890ff' }}>
                    Add New Ticket
                  </Text>
                </Space>
              </Card>
            )}
          </div>
        )}
      </Droppable>
    </Card>
  );
}; 