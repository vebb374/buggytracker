import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import './styles.css';

interface AnnoyingModalProps {
  open: boolean;
  onClose: () => void;
}

const messages = [
  "Your 'Free Trial' plan has expired. Please upgrade to 'Pro' to continue managing your projects.",
  "You've reached the end of your trial. To keep your data and continue working, upgrade now.",
  "Access to this feature is restricted on the free plan. Upgrade to unlock full functionality.",
  "Your trial period is over. Upgrade to a paid plan to avoid service interruption."
];

const AnnoyingModal: React.FC<AnnoyingModalProps> = ({ open, onClose }) => {
  const [modalClass, setModalClass] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Randomize class names to make automation harder
    setModalClass(`annoying-modal-${Math.random().toString(36).substring(7)}`);
    setMessage(messages[Math.floor(Math.random() * messages.length)]);
  }, [open]);

  return (
    <Modal
      title="Subscription Expired"
      open={open}
      onCancel={onClose}
      footer={null}
      wrapClassName={modalClass}
      centered
    >
      <p>{message}</p>
    </Modal>
  );
};

export default AnnoyingModal; 