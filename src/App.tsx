import React, { useState, useMemo, useEffect } from 'react';
import { ConfigProvider, Layout, Typography, Button, Badge, Space, Drawer, App as AntApp } from 'antd';
import { BugOutlined, SettingOutlined, UserOutlined, MenuOutlined } from '@ant-design/icons';
import { AppProvider } from './hooks/useAppContext';
import { useTickets } from './hooks/customHooks';
import { KanbanBoard } from './components/KanbanBoard';
import { AlertSystem } from './components/AlertSystem';
import { IFramePanel } from './components/IFramePanel';
import { TicketEditor } from './components/TicketEditor';
import { CalendarPicker } from './components/CalendarPicker';
import AnnoyingModal from './components/AnnoyingModal';
import type { Ticket } from './types';
import './App.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

// Phase 5: Enhanced responsive theme configuration
const responsiveTheme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 8,
    colorBgContainer: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
    // Performance: Reduce animation duration for better performance
    motionDurationSlow: '0.2s',
    motionDurationMid: '0.15s',
    motionDurationFast: '0.1s',
  },
  components: {
    Layout: {
      headerHeight: 64,
      headerPadding: '0 24px',
    },
    Card: {
      boxShadowTertiary: '0 2px 8px rgba(0,0,0,0.06)',
    },
    Button: {
      borderRadius: 8,
    },
  },
};

// Phase 5: Mobile responsive theme
const mobileTheme = {
  ...responsiveTheme,
  components: {
    ...responsiveTheme.components,
    Layout: {
      headerHeight: 56,
      headerPadding: '0 16px',
    },
    Button: {
      borderRadius: 6,
      controlHeight: 44, // Touch-friendly height
    },
  },
};

// Phase 5: Hook for responsive behavior
const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });
  
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    // Debounced resize handler for performance
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };
    
    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);
  
  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
  const isDesktop = windowSize.width >= 1024;
  
  return { windowSize, isMobile, isTablet, isDesktop };
};

// Main App Component
const AppContent: React.FC = () => {
  const { updateTicket, addTicket } = useTickets();
  const { isMobile, isDesktop } = useResponsive();
  
  // Phase 5: Enhanced state management for responsive UI
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [calendarTicketId, setCalendarTicketId] = useState<string | null>(null);
  const [calendarSelectedDate, setCalendarSelectedDate] = useState<Date | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAnnoyingModalVisible, setAnnoyingModalVisible] = useState(false);

  useEffect(() => {
    const showModalInterval = setInterval(() => {
      setAnnoyingModalVisible(true);
    }, 10000 + Math.random() * 5000); // Between 10 and 15 seconds

    return () => clearInterval(showModalInterval);
  }, []);

  // Phase 5: Memoized theme based on screen size
  const currentTheme = useMemo(() => {
    return isMobile ? mobileTheme : responsiveTheme;
  }, [isMobile]);

  const handleEditTicket = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setIsEditorOpen(true);
  };

  const handleEditorSave = (ticket: Ticket) => {
    if (editingTicket) {
      updateTicket(ticket.id, ticket);
    } else {
      // Creating new ticket - add to tickets array
      addTicket({ ...ticket, status: 'TODO' });
    }
    setIsEditorOpen(false);
    setEditingTicket(null);
  };

  const handleEditorCancel = () => {
    setIsEditorOpen(false);
    setEditingTicket(null);
  };

  const handleCalendarChange = (date: Date | null) => {
    if (calendarTicketId) {
      updateTicket(calendarTicketId, { deadline: date });
    }
    setCalendarTicketId(null);
    setCalendarSelectedDate(null);
  };

  // Phase 5: Mobile sidebar toggle
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ConfigProvider theme={currentTheme}>
      <AnnoyingModal open={isAnnoyingModalVisible} onClose={() => setAnnoyingModalVisible(false)} />
      <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        {/* Skip link for accessibility */}
        <a 
          href="#main-content" 
          className="skip-link"
          style={{
            position: 'absolute',
            top: '-40px',
            left: '6px',
            background: '#000',
            color: 'white',
            padding: '8px',
            borderRadius: '4px',
            textDecoration: 'none',
            zIndex: 10000,
            transition: 'top 0.2s ease',
          }}
          onFocus={(e) => {
            e.currentTarget.style.top = '6px';
          }}
          onBlur={(e) => {
            e.currentTarget.style.top = '-40px';
          }}
        >
          Skip to main content
        </a>

        {/* Phase 5: Enhanced responsive header */}
        <Header 
          className="app-header"
          style={{ 
            background: '#1890ff', 
            padding: isMobile ? '0 16px' : '0 24px',
            height: isMobile ? '56px' : '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
          }}
        >
          {/* Left section (for spacing) */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
            <BugOutlined style={{ fontSize: isMobile ? '28px' : '32px', color: 'white' }} />
          </div>

          {/* Center section (Title) */}
          <div style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
            {/* Floating bugs around title */}
            <div className="bug-animation left-bugs">
              <span className="floating-bug bug-1" style={{ top: '-15px', left: '0px' }}>🐛</span>
              <span className="floating-bug bug-2" style={{ top: '10px', left: '-20px' }}>🐞</span>
              <span className="floating-bug bug-3" style={{ top: '-5px', left: '-35px' }}>🦗</span>
              <span className="floating-bug bug-4" style={{ top: '25px', left: '-10px' }}>🕷️</span>
            </div>
            
            <Title 
              level={1} 
              style={{ 
                margin: 0, 
                color: 'white',
                fontSize: isMobile ? '28px' : '42px',
                fontWeight: 700,
                position: 'relative',
                zIndex: 10,
              }}
              className="header-title quirky-title"
            >
              🐛 BuggyTracker 🚀
            </Title>
            
            <div className="bug-animation right-bugs">
              <span className="floating-bug bug-5" style={{ top: '-20px', right: '0px' }}>🦋</span>
              <span className="floating-bug bug-6" style={{ top: '5px', right: '-25px' }}>🐜</span>
              <span className="floating-bug bug-1" style={{ top: '-10px', right: '-40px' }}>🐝</span>
              <span className="floating-bug bug-2" style={{ top: '20px', right: '-15px' }}>🦟</span>
            </div>
          </div>
          
          {/* Right section (Buttons) */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <Space className="header-actions" size={isMobile ? 'small' : 'middle'}>
                <Button 
                  type="primary"
                  icon={<BugOutlined />}
                  onClick={() => {
                    setEditingTicket(null);
                    setIsEditorOpen(true);
                  }}
                  style={{ 
                    background: '#ff4d4f',
                    borderColor: '#ff4d4f',
                    fontWeight: 'bold'
                  }}
                  size={isMobile ? 'small' : 'middle'}
                >
                  {!isMobile && 'Create Bug'}
                </Button>
                {isMobile && (
                  <Button 
                    type="text" 
                    icon={<MenuOutlined />} 
                    onClick={toggleSidebar}
                    style={{ color: 'white' }}
                    aria-label="Toggle sidebar"
                  />
                )}
                <Badge count={5} size="small">
                  <Button 
                    type="text" 
                    icon={<SettingOutlined />} 
                    style={{ color: 'white' }}
                    size={isMobile ? 'small' : 'middle'}
                  >
                    {!isMobile && 'Settings'}
                  </Button>
                </Badge>
                <Button 
                  type="text" 
                  icon={<UserOutlined />} 
                  style={{ color: 'white' }}
                  size={isMobile ? 'small' : 'middle'}
                >
                  {!isMobile && 'Admin User'}
                </Button>
              </Space>
          </div>
        </Header>

        <Layout>
          {/* Phase 5: Enhanced responsive content area */}
          <Content 
            id="main-content"
            style={{ 
              padding: isMobile ? '16px' : '24px',
              background: '#f5f5f5',
              minHeight: `calc(100vh - ${isMobile ? '56px' : '64px'})`,
            }}
          >
            <div 
              className={`responsive-grid ${isDesktop ? 'desktop-two-col' : ''}`}
              style={{ 
                display: 'grid',
                gap: isMobile ? '16px' : '24px',
                height: '100%',
                minHeight: `calc(100vh - ${isMobile ? '88px' : '112px'})`,
                gridTemplateColumns: isDesktop ? '1fr auto' : '1fr',
              }}
            >
              {/* Phase 5: Enhanced Kanban Board Area */}
              <div style={{ 
                background: 'white',
                borderRadius: isMobile ? '8px' : '12px',
                padding: isMobile ? '16px' : '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                overflow: 'hidden',
                // Performance optimization
                contain: 'layout style',
              }}>
                <div style={{ marginBottom: isMobile ? '16px' : '24px' }}>
                  <Title 
                    level={2} 
                    style={{ 
                      margin: 0, 
                      color: '#262626',
                      fontSize: isMobile ? '20px' : '24px'
                    }}
                  >
                    Project Dashboard
                  </Title>
                  <Text type="secondary" style={{ fontSize: isMobile ? '13px' : '14px' }}>
                    Manage and track bug reports across development stages
                  </Text>
                </div>
                
                <KanbanBoard onEditTicket={handleEditTicket} />
              </div>

              {/* Phase 5: Responsive System Logs Sidebar */}
              {isDesktop ? (
                <IFramePanel />
              ) : (
                <Drawer
                  title="System Logs"
                  placement="right"
                  onClose={toggleSidebar}
                  open={sidebarOpen}
                  width={isMobile ? '90%' : '400px'}
                  className="sidebar-panel"
                  destroyOnClose={false}
                  maskClosable={true}
                >
                  <IFramePanel />
                </Drawer>
              )}
            </div>
          </Content>
        </Layout>

        {/* Phase 5: Enhanced Alert System */}
        <AlertSystem />

        {/* Phase 5: Enhanced Ticket Editor Modal */}
        <TicketEditor
          ticket={editingTicket || undefined}
          isOpen={isEditorOpen}
          onSave={handleEditorSave}
          onCancel={handleEditorCancel}
          mode={editingTicket ? 'edit' : 'create'}
        />

        {/* Calendar Picker */}
        {calendarTicketId && (
          <CalendarPicker
            selectedDate={calendarSelectedDate}
            onDateChange={handleCalendarChange}
            ticketId={calendarTicketId}
          />
        )}

      </Layout>
    </ConfigProvider>
  );
};

// Root App Component with Provider
const App: React.FC = () => {
  return (
    <AppProvider>
      <AntApp>
        <AppContent />
      </AntApp>
    </AppProvider>
  );
};

export default App;
