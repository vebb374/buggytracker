import React, { useEffect } from 'react';
import { notification } from 'antd';
import { 
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined 
} from '@ant-design/icons';
import { useToasts } from '../../hooks/customHooks';

export const AlertSystem: React.FC = () => {
  const { toasts, removeToast } = useToasts();
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    // Configure notification global settings
    notification.config({
      duration: 1.5, // 1.5 seconds for automation challenges
      maxCount: 3, // Maximum 3 notifications at once
      rtl: false,
    });
  }, []);

  useEffect(() => {
    toasts.forEach((toast) => {
      const getIcon = () => {
        switch (toast.type) {
          case 'success': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
          case 'warning': return <WarningOutlined style={{ color: '#fa8c16' }} />;
          case 'error': return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
          case 'info': return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
          default: return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
        }
      };

      // Random positioning for automation challenges
      const randomPosition = Math.random() > 0.5 ? 'topRight' : 'topLeft';
      
      api.open({
        key: toast.id,
        message: toast.message,
        icon: getIcon(),
        duration: toast.duration / 1000, // Convert to seconds
        placement: randomPosition as any, // Random positioning
        style: {
          // Slight random positioning variations
          marginTop: Math.random() * 20,
          marginRight: Math.random() * 20,
        },
        onClose: () => {
          removeToast(toast.id);
        }
      });
    });
  }, [toasts, removeToast, api]);

  return <>{contextHolder}</>;
}; 