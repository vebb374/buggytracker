import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import './styles.css';

interface AnnoyingModalProps {
  open: boolean;
  onClose: () => void;
}

const messages = [
  "🎉 Congratulations! You've unlocked the 'Broke Developer' achievement! Please insert more coins to continue.",
  "ERROR 404: Your wallet not found. Have you tried turning your bank account off and on again?",
  "BREAKING: Local developer discovers they can't afford coffee AND software subscriptions. More at 11.",
  "⚠️ WARNING: Your code quality drops by 50% on the free plan. Upgrade to write bugs with style!",
  "🚨 URGENT: Your mom called. She's disappointed you're still using the free tier.",
  "Fun fact: Every time you use the free plan, a JavaScript developer somewhere cries a single tear.",
  "Plot twist: The real bug was the friends we made along the way... Just kidding, it's your free plan.",
  "Roses are red, violets are blue, your free trial expired, and so did you.",
  "404 Error: Motivation not found. Try upgrading your subscription and your life choices.",
  "Breaking news: Scientists discover correlation between free plans and unfinished side projects."
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