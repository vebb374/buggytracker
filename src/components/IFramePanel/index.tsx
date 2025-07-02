import React, { useState } from 'react';
import { Typography, Button, Divider, Badge, Space } from 'antd';
import { 
  UnorderedListOutlined, 
  ReloadOutlined, 
  ExpandOutlined,
  MinusOutlined 
} from '@ant-design/icons';
import { useUI } from '../../hooks/useAppContext';

const { Title, Text } = Typography;

export const IFramePanel: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar } = useUI();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate 10-second refresh for automation challenges
    setTimeout(() => {
      setRefreshing(false);
    }, 10000);
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

      {/* Nested IFrame Placeholder */}
      <div style={{ 
        border: '2px dashed #d9d9d9',
        borderRadius: '8px',
        padding: '24px',
        textAlign: 'center',
        background: '#fafafa',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          Nested IFrame Content
        </Text>
        <Text type="secondary" style={{ fontSize: '10px', marginTop: '8px' }}>
          Auto-refresh: {refreshing ? 'Refreshing...' : '10s'}
        </Text>
        
        {refreshing && (
          <div style={{ 
            marginTop: '16px',
            width: '100%',
            height: '4px',
            background: '#f0f0f0',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '30%',
              height: '100%',
              background: '#1890ff',
              borderRadius: '2px',
              animation: 'loading 2s infinite linear',
            }} />
          </div>
        )}
      </div>

      <Text style={{ fontSize: '10px', color: '#ccc', marginTop: '8px', textAlign: 'center' }}>
        Cross-frame communication enabled
      </Text>
    </div>
  );
}; 