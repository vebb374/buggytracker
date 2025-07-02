import React from 'react';
import { ConfigProvider, Layout, Typography, Button, Badge, Space } from 'antd';
import { BugOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { AppProvider } from './hooks/useAppContext';
import { KanbanBoard } from './components/KanbanBoard';
import { AlertSystem } from './components/AlertSystem';
import { IFramePanel } from './components/IFramePanel';
import './App.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

// Main App Component
const AppContent: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff', // Corporate blue
          borderRadius: 8,
          colorBgContainer: '#ffffff',
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        {/* Header */}
        <Header style={{ 
          background: '#1890ff', 
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <BugOutlined style={{ fontSize: '28px', color: 'white' }} />
            <div>
              <Title level={3} style={{ margin: 0, color: 'white' }}>
                BugTracker Pro
              </Title>
              <Text style={{ color: '#e6f7ff', fontSize: '12px' }}>
                The Unreliable Edition™
              </Text>
            </div>
          </div>
          
          <Space>
            <Badge count={5} size="small">
              <Button type="text" icon={<SettingOutlined />} style={{ color: 'white' }}>
                Settings
              </Button>
            </Badge>
            <Button type="text" icon={<UserOutlined />} style={{ color: 'white' }}>
              Admin User
            </Button>
          </Space>
        </Header>

        <Layout>
          {/* Main Content Area */}
          <Content style={{ 
            padding: '24px',
            background: '#f5f5f5',
            minHeight: 'calc(100vh - 64px)'
          }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr auto',
              gap: '24px',
              height: '100%',
              minHeight: 'calc(100vh - 112px)'
            }}>
              {/* Kanban Board Area */}
              <div style={{ 
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                overflow: 'hidden'
              }}>
                <div style={{ marginBottom: '24px' }}>
                  <Title level={2} style={{ margin: 0, color: '#262626' }}>
                    Project Dashboard
                  </Title>
                  <Text type="secondary">
                    Manage and track bug reports across development stages
                  </Text>
                </div>
                
                <KanbanBoard />
              </div>

              {/* System Logs Sidebar */}
              <IFramePanel />
            </div>
          </Content>
        </Layout>

        {/* Alert System */}
        <AlertSystem />
      </Layout>
    </ConfigProvider>
  );
};

// Root App Component with Provider
const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
