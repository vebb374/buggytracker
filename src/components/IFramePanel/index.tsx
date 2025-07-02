import React, { useState, useEffect } from 'react';
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

      {/* Enhanced Nested IFrame Structure */}
      <div style={{ 
        border: '1px solid #d9d9d9',
        borderRadius: '8px',
        background: '#ffffff',
        minHeight: '300px',
        overflow: 'hidden'
      }}>
        {/* Outer Frame Header */}
        <div style={{
          background: '#f0f0f0',
          padding: '8px 12px',
          borderBottom: '1px solid #d9d9d9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Text style={{ fontSize: '11px', fontWeight: 500 }}>
            Main Frame - system-logs.html
          </Text>
          <div style={{ display: 'flex', gap: '4px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffbd2e' }} />
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#28ca42' }} />
          </div>
        </div>

        {/* Outer Frame Content */}
        <div style={{ padding: '12px' }}>
          <Text style={{ fontSize: '11px', color: '#666', display: 'block', marginBottom: '8px' }}>
            Cross-frame communication: {refreshing ? 'Synchronizing...' : 'Active'}
          </Text>
          
          {/* Nested IFrame Level 1 */}
          <div style={{
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            background: '#fafafa',
            minHeight: '200px',
            position: 'relative'
          }}>
            {/* Nested Frame Header */}
            <div style={{
              background: '#e8e8e8',
              padding: '6px 10px',
              borderBottom: '1px solid #d0d0d0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Text style={{ fontSize: '10px', fontWeight: 500 }}>
                Nested Frame L1 - analytics.html
              </Text>
              <Text style={{ fontSize: '9px', color: '#999' }}>
                Frame ID: frame_${refreshing ? 'sync' : Math.floor(Math.random() * 1000)}
              </Text>
            </div>

            <div style={{ padding: '10px' }}>
              {/* Frame Communication Status */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <Text style={{ fontSize: '9px', color: '#666' }}>
                  Parent communication: {refreshing ? 'Reconnecting...' : 'OK'}
                </Text>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: refreshing ? '#ff4d4f' : '#52c41a'
                }} />
              </div>

              {/* Nested IFrame Level 2 */}
              <div style={{
                border: '1px solid #d0d0d0',
                borderRadius: '4px',
                background: '#f5f5f5',
                minHeight: '120px',
                position: 'relative'
              }}>
                {/* Deep Nested Frame Header */}
                <div style={{
                  background: '#ddd',
                  padding: '4px 8px',
                  borderBottom: '1px solid #c0c0c0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Text style={{ fontSize: '9px', fontWeight: 500 }}>
                    Deep Frame L2 - widget.html
                  </Text>
                  <Text style={{ fontSize: '8px', color: '#999' }}>
                    Auto-refresh: {refreshing ? 'Active' : '10s'}
                  </Text>
                </div>

                <div style={{ padding: '8px' }}>
                  {/* Simulated Frame Content */}
                  <div style={{ marginBottom: '8px' }}>
                    <Text style={{ fontSize: '8px', color: '#666', display: 'block' }}>
                      Window origin: https://example.com/widget
                    </Text>
                    <Text style={{ fontSize: '8px', color: '#666', display: 'block' }}>
                      Parent frames: 2 levels detected
                    </Text>
                  </div>

                  {/* Message Queue Simulation */}
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '3px',
                    padding: '6px',
                    minHeight: '60px'
                  }}>
                    <Text style={{ fontSize: '8px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>
                      Message Queue:
                    </Text>
                    
                    {refreshing ? (
                      <div>
                        <Text style={{ fontSize: '7px', color: '#666', display: 'block' }}>
                          → postMessage: {JSON.stringify({ type: 'REFRESH_START', timestamp: Date.now() })}
                        </Text>
                        <Text style={{ fontSize: '7px', color: '#666', display: 'block' }}>
                          ← response: {JSON.stringify({ status: 'ACK', frameId: 'L2' })}
                        </Text>
                        <Text style={{ fontSize: '7px', color: '#666', display: 'block' }}>
                          → postMessage: {JSON.stringify({ type: 'DATA_SYNC', data: '...' })}
                        </Text>
                      </div>
                    ) : (
                      <div>
                        <Text style={{ fontSize: '7px', color: '#666', display: 'block' }}>
                          → postMessage: {JSON.stringify({ type: 'HEARTBEAT', timestamp: Date.now() })}
                        </Text>
                        <Text style={{ fontSize: '7px', color: '#666', display: 'block' }}>
                          ← response: {JSON.stringify({ status: 'ALIVE', frameId: 'L2' })}
                        </Text>
                        <Text style={{ fontSize: '7px', color: '#999', display: 'block' }}>
                          Queue empty - Next heartbeat in 5s
                        </Text>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cross-Frame Debug Info */}
          <div style={{ 
            marginTop: '8px',
            padding: '6px',
            background: '#f8f8f8',
            borderRadius: '4px',
            border: '1px solid #e8e8e8'
          }}>
            <Text style={{ fontSize: '9px', color: '#666', display: 'block' }}>
              Frame hierarchy: window.top → frame[0] → frame[0][0]
            </Text>
            <Text style={{ fontSize: '9px', color: '#666', display: 'block' }}>
              Cross-origin policy: {refreshing ? 'Enforcing...' : 'SameOrigin'}
            </Text>
            <Text style={{ fontSize: '9px', color: '#999', display: 'block' }}>
              DOM access: {refreshing ? 'Limited' : 'Full'} • postMessage: Available
            </Text>
          </div>
        </div>

        {/* Loading Overlay for iframe refresh */}
        {refreshing && (
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            background: 'rgba(255, 255, 255, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px'
          }}>
            <Space direction="vertical" align="center">
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid #f0f0f0',
                borderTop: '2px solid #1890ff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <Text style={{ fontSize: '10px', color: '#666' }}>
                Refreshing all frames...
              </Text>
            </Space>
          </div>
        )}
      </div>

      <Text style={{ fontSize: '10px', color: '#ccc', marginTop: '8px', textAlign: 'center' }}>
        Cross-frame communication enabled
      </Text>

      {/* CSS for animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}; 