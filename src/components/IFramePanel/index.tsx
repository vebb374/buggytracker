import React, { useState, useRef } from 'react';
import { Typography, Button, Divider, Badge, Space } from 'antd';
import { 
  UnorderedListOutlined, 
  ReloadOutlined, 
  ExpandOutlined,
  MinusOutlined 
} from '@ant-design/icons';
import { useUI } from '../../hooks/customHooks';

const { Title, Text } = Typography;

export const IFramePanel: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar } = useUI();
  const [refreshing, setRefreshing] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    iframeRef.current?.contentWindow?.location.reload();
    // Simulate refresh duration for spinner
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  if (sidebarCollapsed) {
    return (
      <div style={{ 
        width: '48px',
        background: 'white',
        borderRadius: '12px',
        padding: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Button
          type="text"
          icon={<ExpandOutlined />}
          onClick={toggleSidebar}
          style={{ 
            padding: '4px',
            height: 'auto',
            border: 'none'
          }}
        />
        <Divider style={{ margin: '8px 0' }} />
        <Badge dot>
          <UnorderedListOutlined style={{ fontSize: '16px', color: '#666' }} />
        </Badge>
      </div>
    );
  }

  return (
    <div style={{ 
      width: '300px',
      background: 'white',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      display: 'flex',
      flexDirection: 'column',
      height: 'fit-content'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <Space>
          <UnorderedListOutlined />
          <Title level={4} style={{ margin: 0 }}>
            System Logs
          </Title>
          <Badge count={12} size="small" />
        </Space>
        
        <Space>
          <Button
            type="text"
            size="small"
            icon={<ReloadOutlined spin={refreshing} />}
            onClick={handleRefresh}
            disabled={refreshing}
          />
          <Button
            type="text"
            size="small"
            icon={<MinusOutlined />}
            onClick={toggleSidebar}
          />
        </Space>
      </div>

      <Divider style={{ margin: '0 0 16px 0' }} />

      {/* Log Categories */}
      <div style={{ marginBottom: '16px' }}>
        <Text strong style={{ fontSize: '12px', color: '#666' }}>
          CATEGORIES
        </Text>
        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ 
            padding: '8px 12px',
            background: '#f0f8ff',
            borderRadius: '6px',
            border: '1px solid #91d5ff',
            cursor: 'pointer'
          }}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: '12px' }}>System Events</Text>
              <Badge count={5} size="small" />
            </Space>
          </div>
          
          <div style={{ 
            padding: '8px 12px',
            background: '#fff7e6',
            borderRadius: '6px',
            border: '1px solid #ffd591',
            cursor: 'pointer'
          }}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: '12px' }}>User Actions</Text>
              <Badge count={4} size="small" />
            </Space>
          </div>
          
          <div style={{ 
            padding: '8px 12px',
            background: '#fff1f0',
            borderRadius: '6px',
            border: '1px solid #ffccc7',
            cursor: 'pointer'
          }}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: '12px' }}>Error Logs</Text>
              <Badge count={3} size="small" />
            </Space>
          </div>
        </div>
      </div>

      {/* Real Nested IFrame */}
      <iframe
        ref={iframeRef}
        src="/system-logs.html"
        style={{
          border: '1px solid #d9d9d9',
          borderRadius: '8px',
          width: '100%',
          minHeight: '500px'
        }}
        title="System Logs"
        onLoad={() => setRefreshing(false)}
      />
    </div>
  );
}; 