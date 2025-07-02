import React, { useState, useEffect, useRef } from 'react';
import { DatePicker, Card, Typography, Button, Space, Alert, Tooltip } from 'antd';
import { 
  CalendarOutlined, 
  CloseOutlined, 
  ExclamationCircleOutlined,
  EyeOutlined 
} from '@ant-design/icons';
import type { CalendarProps } from '../../types';
import dayjs, { Dayjs } from 'dayjs';

const { Text } = Typography;

// DevTools detection utility
const detectDevTools = (): boolean => {
  const threshold = 160;
  return (
    window.outerHeight - window.innerHeight > threshold ||
    window.outerWidth - window.innerWidth > threshold ||
    (window as any).devtools?.open === true
  );
};

// Variable delay for automation challenges
const getRandomDelay = (): number => {
  return Math.floor(Math.random() * 3000) + 1000; // 1-4 seconds
};

export const CalendarPicker: React.FC<CalendarProps> = ({
  selectedDate,
  onDateChange,
  ticketId,
  autoCloseTimer = 8000
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [devToolsDetected, setDevToolsDetected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [calendarVersion, setCalendarVersion] = useState(1);
  const [remainingTime, setRemainingTime] = useState(autoCloseTimer / 1000);
  const [userInteracted, setUserInteracted] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  // DevTools detection with DOM manipulation challenges
  useEffect(() => {
    const checkDevTools = () => {
      const detected = detectDevTools();
      if (detected !== devToolsDetected) {
        setDevToolsDetected(detected);
        if (detected) {
          // Create DOM recreation when DevTools detected
          setCalendarVersion(prev => prev + 1);
          // Variable delay for automation challenges
          setTimeout(() => {
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), getRandomDelay());
          }, 500);
        }
      }
    };

    // Check immediately and then every 500ms
    checkDevTools();
    intervalRef.current = setInterval(checkDevTools, 500) as any;

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [devToolsDetected]);

  // Auto-close timer
  useEffect(() => {
    if (!userInteracted) {
      const timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            setIsVisible(false);
            onDateChange(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      closeTimeoutRef.current = timer as any;
      return () => clearInterval(timer);
    }
  }, [userInteracted, onDateChange]);

  // Stop auto-close when user interacts
  const handleUserInteraction = () => {
    setUserInteracted(true);
    if (closeTimeoutRef.current) {
      clearInterval(closeTimeoutRef.current);
    }
  };

  const handleDateChange = (date: Dayjs | null) => {
    handleUserInteraction();
    setIsLoading(true);
    
    // Variable delay for automation challenges
    const delay = getRandomDelay();
    setTimeout(() => {
      setIsLoading(false);
      onDateChange(date ? date.toDate() : null);
      
      // DOM recreation after date selection
      setCalendarVersion(prev => prev + 1);
      
      // Auto-close after selection with delay
      setTimeout(() => {
        setIsVisible(false);
      }, 1500);
    }, delay);
  };

  const handleClose = () => {
    handleUserInteraction();
    setIsVisible(false);
    onDateChange(null);
  };

  const disabledDate = (current: Dayjs) => {
    // Disable past dates and dates more than 1 year in future
    return current && (current < dayjs().startOf('day') || current > dayjs().add(1, 'year'));
  };

  if (!isVisible) return null;

  return (
    <div
      key={`calendar-${calendarVersion}`}
      id={`calendar-picker-${ticketId}-v${calendarVersion}`}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        minWidth: '320px'
      }}
      onClick={handleUserInteraction}
    >
      <Card
        size="small"
        style={{
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          border: devToolsDetected ? '2px solid #ff4d4f' : '1px solid #d9d9d9',
          borderRadius: '12px',
          background: devToolsDetected ? '#fff2f0' : '#ffffff',
          transition: 'all 0.3s ease'
        }}
        styles={{ body: { padding: '16px' } }}
      >
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <Space>
            <CalendarOutlined style={{ color: '#1890ff' }} />
            <Text strong>Set Deadline</Text>
            {devToolsDetected && (
              <Tooltip title="DevTools detected - Calendar behavior modified">
                <EyeOutlined style={{ color: '#ff4d4f' }} />
              </Tooltip>
            )}
          </Space>
          
          <Space>
            {!userInteracted && (
              <Text type="secondary" style={{ fontSize: '11px' }}>
                Auto-close: {remainingTime}s
              </Text>
            )}
            <Button
              type="text"
              size="small"
              icon={<CloseOutlined />}
              onClick={handleClose}
              style={{ padding: '2px 4px' }}
            />
          </Space>
        </div>

        {/* DevTools Warning */}
        {devToolsDetected && (
          <Alert
            message="Development tools detected"
            description="Calendar behavior may be modified for automation testing"
            type="warning"
            showIcon
            style={{ marginBottom: '12px' }}
            icon={<ExclamationCircleOutlined />}
          />
        )}

        {/* Ticket Info */}
        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
          Ticket: {ticketId}
        </Text>

        {/* Loading State */}
        {isLoading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            color: '#666'
          }}>
            <Text>Processing date selection...</Text>
            <div style={{ 
              width: '100%', 
              height: '2px', 
              background: '#f0f0f0', 
              marginTop: '8px',
              borderRadius: '1px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '30%',
                height: '100%',
                background: '#1890ff',
                animation: 'loading-pulse 1.5s infinite ease-in-out'
              }} />
            </div>
          </div>
        )}

        {/* Date Picker */}
        {!isLoading && (
          <DatePicker
            value={selectedDate ? dayjs(selectedDate) : null}
            onChange={handleDateChange}
            style={{ width: '100%' }}
            placeholder="Select deadline date"
            format="YYYY-MM-DD"
            disabledDate={disabledDate}
            showToday={!devToolsDetected} // Hide "Today" button when DevTools detected
            allowClear={true}
            open={true} // Always show calendar dropdown
            getPopupContainer={(triggerNode) => triggerNode.parentElement || document.body}
            size="large"
            autoFocus={!devToolsDetected}
          />
        )}

        {/* Automation Challenge Info */}
        <Text 
          type="secondary" 
          style={{ 
            fontSize: '10px', 
            display: 'block', 
            marginTop: '8px',
            textAlign: 'center',
            opacity: 0.6
          }}
        >
          DOM version: v{calendarVersion} • Auto-timing enabled
        </Text>
      </Card>

      {/* CSS for loading animation */}
      <style>{`
        @keyframes loading-pulse {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}; 