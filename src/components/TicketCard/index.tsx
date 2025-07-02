import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Card, Typography, Tag, Space, Tooltip, Button } from 'antd';
import { 
  CalendarOutlined, 
  UserOutlined, 
  EditOutlined,
  ClockCircleOutlined,
  BugOutlined 
} from '@ant-design/icons';
import type { TicketCardProps } from '../../types';
import { formatDate } from '../../utils';

const { Text, Paragraph } = Typography;

// Helper function to safely convert date string/object to Date
const ensureDate = (date: Date | string): Date => {
  if (date instanceof Date) return date;
  return new Date(date);
};

// Extended TicketCard props to include drag index
interface ExtendedTicketCardProps extends TicketCardProps {
  index: number;
}

export const TicketCard: React.FC<ExtendedTicketCardProps> = ({ 
  ticket, 
  index,
  onEdit
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Priority color mapping
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#ff4d4f';
      case 'Medium': return '#fa8c16';
      case 'Low': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  // Status color mapping for DONE tickets (grayed out)
  const getStatusOpacity = (status: string) => {
    return status === 'DONE' ? 0.6 : 1;
  };

  return (
    <Draggable draggableId={ticket.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            opacity: getStatusOpacity(ticket.status),
            transform: snapshot.isDragging 
              ? `${provided.draggableProps.style?.transform} rotate(5deg)` 
              : provided.draggableProps.style?.transform,
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Card
            size="small"
            style={{
              marginBottom: '12px',
              border: snapshot.isDragging ? '2px solid #1890ff' : '1px solid #d9d9d9',
              borderRadius: '8px',
              boxShadow: snapshot.isDragging 
                ? '0 8px 24px rgba(0,0,0,0.12)' 
                : isHovered 
                  ? '0 4px 12px rgba(0,0,0,0.08)'
                  : '0 2px 4px rgba(0,0,0,0.04)',
              transition: 'all 0.2s ease',
              cursor: 'grab',
              transform: isHovered && !snapshot.isDragging ? 'translateY(-2px)' : 'none',
              background: ticket.status === 'DONE' ? '#fafafa' : '#ffffff'
            }}
            styles={{ body: { padding: '12px' } }}
            hoverable={!snapshot.isDragging}
          >
            {/* Ticket Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: '8px'
            }}>
              <Space size="small">
                <BugOutlined style={{ color: getPriorityColor(ticket.priority) }} />
                <Text 
                  strong 
                  style={{ 
                    fontSize: '12px', 
                    color: '#666',
                    fontFamily: 'monospace'
                  }}
                >
                  {ticket.id}
                </Text>
              </Space>
              
              {isHovered && (
                <Button
                  type="text"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(ticket);
                  }}
                  style={{ 
                    opacity: 0.7,
                    padding: '2px 4px',
                    height: 'auto'
                  }}
                />
              )}
            </div>

            {/* Ticket Title */}
            <Paragraph
              style={{ 
                margin: '0 0 12px 0',
                fontSize: '14px',
                fontWeight: 500,
                color: ticket.status === 'DONE' ? '#999' : '#262626'
              }}
              ellipsis={{ rows: 2, tooltip: ticket.title }}
            >
              {ticket.title}
            </Paragraph>

            {/* Priority Badge */}
            <div style={{ marginBottom: '12px' }}>
              <Tag
                color={getPriorityColor(ticket.priority)}
                style={{
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 500,
                  border: 'none'
                }}
              >
                {ticket.priority.toUpperCase()}
              </Tag>
            </div>

            {/* Tags */}
            {ticket.tags.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <Space size={[4, 4]} wrap>
                  {ticket.tags.slice(0, 3).map((tag, tagIndex) => (
                    <Tag
                      key={tagIndex}
                      style={{
                        fontSize: '10px',
                        borderRadius: '8px',
                        margin: 0,
                        background: '#f0f0f0',
                        border: '1px solid #d9d9d9',
                        color: '#666'
                      }}
                    >
                      {tag}
                    </Tag>
                  ))}
                  {ticket.tags.length > 3 && (
                    <Tooltip title={ticket.tags.slice(3).join(', ')}>
                      <Tag
                        style={{
                          fontSize: '10px',
                          borderRadius: '8px',
                          margin: 0,
                          background: '#f0f0f0',
                          border: '1px solid #d9d9d9',
                          color: '#666'
                        }}
                      >
                        +{ticket.tags.length - 3}
                      </Tag>
                    </Tooltip>
                  )}
                </Space>
              </div>
            )}

            {/* Ticket Footer */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: '8px',
              fontSize: '11px',
              color: '#999'
            }}>
              {/* Assignee */}
              <Space size="small">
                <UserOutlined />
                <Text style={{ fontSize: '11px', color: '#666' }}>
                  {ticket.assignee.split(' ')[0]} {/* Show first name only */}
                </Text>
              </Space>

              {/* Deadline */}
              {ticket.deadline && (
                <Tooltip title={`Deadline: ${ensureDate(ticket.deadline).toLocaleDateString()}`}>
                  <Space size="small">
                    <CalendarOutlined />
                    <Text 
                      style={{ 
                        fontSize: '11px',
                        color: ensureDate(ticket.deadline) < new Date() ? '#ff4d4f' : '#666'
                      }}
                    >
                      {formatDate(ensureDate(ticket.deadline))}
                    </Text>
                  </Space>
                </Tooltip>
              )}
            </div>

            {/* Creation time (for automation testing) */}
            <div style={{ 
              marginTop: '4px',
              fontSize: '10px',
              color: '#ccc',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <ClockCircleOutlined />
              <Text style={{ fontSize: '10px', color: '#ccc' }}>
                v{ticket.domVersion} • {ensureDate(ticket.createdAt).toLocaleDateString()}
              </Text>
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  );
}; 