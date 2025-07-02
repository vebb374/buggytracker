import React, { useState, useEffect } from 'react';
import { Spin, Button, Alert } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { TicketCard } from '../TicketCard';
import { useTickets } from '../../hooks/useAppContext';
import type { Ticket } from '../../types';
import { shouldSimulateNetworkFailure, getRandomLoadingMessage } from '../../utils';

interface InfiniteScrollProps {
  hasMore: boolean;
  items: Ticket[];
  onEditTicket?: (ticket: Ticket) => void;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  hasMore,
  items,
  onEditTicket
}) => {
  const { loadMoreTickets, isLoading } = useTickets();
  const [localError, setLocalError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Loading more tickets...');

  // Update loading message randomly for automation challenges
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingMessage(getRandomLoadingMessage());
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleLoadMore = async () => {
    setLocalError(null);
    
    // Simulate random network failures (5% chance)
    if (shouldSimulateNetworkFailure()) {
      setLocalError('Network error, try again');
      return;
    }

    try {
      await loadMoreTickets();
    } catch (error) {
      setLocalError('Failed to load more tickets');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '12px',
      height: '100%'
    }}>
      {/* Render tickets */}
      {items.map((ticket, index) => (
        <TicketCard
          key={`${ticket.id}-v${ticket.domVersion}`}
          ticket={ticket}
          index={index}
          isDragging={false}
          onEdit={onEditTicket}
        />
      ))}

      {/* Loading state */}
      {isLoading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '24px',
          border: '2px dashed #d9d9d9',
          borderRadius: '8px',
          background: '#fafafa'
        }}>
          <Spin tip={loadingMessage} />
        </div>
      )}

      {/* Error state */}
      {localError && (
        <Alert
          message="Loading Error"
          description={localError}
          type="error"
          showIcon
          action={
            <Button 
              size="small" 
              type="primary" 
              icon={<ReloadOutlined />}
              onClick={handleLoadMore}
            >
              Retry
            </Button>
          }
          style={{ marginTop: '12px' }}
        />
      )}

      {/* Load more button */}
      {!isLoading && !localError && hasMore && (
        <Button
          type="dashed"
          style={{ 
            marginTop: '12px',
            height: '48px',
            border: '2px dashed #d9d9d9',
            borderRadius: '8px',
            color: '#666'
          }}
          onClick={handleLoadMore}
          loading={isLoading}
        >
          Load More Tickets (+5)
        </Button>
      )}

      {/* No more items state */}
      {!hasMore && !isLoading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '24px',
          color: '#999',
          fontSize: '12px'
        }}>
          All tickets loaded
        </div>
      )}
    </div>
  );
}; 