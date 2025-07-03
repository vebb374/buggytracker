import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import './styles.css';

interface AnnoyingModalProps {
  open: boolean;
  onClose: () => void;
}

const messages = [
  "🐌 Still using Selenium in 2024? That's cute. Your tests are slower than Internet Explorer loading Gmail! 💀",
  "🤡 BREAKING: Local QA discovers their 'comprehensive' E2E suite breaks every time someone sneezes on the DOM! 🤧",
  "⏰ Your Selenium test has been waiting for that element longer than you've been waiting for a promotion. Maybe try Playwright? 🎭",
  "🚨 URGENT: Your flaky tests are giving the entire team trust issues. Even your therapist uses Playwright now! 💊",
  "😂 Plot twist: Your E2E tests found more bugs in your test code than in the actual application! 🪲",
  "🔥 HOT TAKE: Writing E2E tests with no page objects is like writing spaghetti code but somehow even more embarrassing! 🍝",
  "💸 Fun fact: The time you spend debugging flaky Selenium tests could've funded a small country's internet infrastructure! 🌍",
  "🎪 Your test environment is down again! In other news, water is wet and QA engineers are dead inside! ⚰️",
  "🤖 ERROR 500: Your CI pipeline failed because your E2E test couldn't handle a loading spinner. Very professional! 🌀",
  "🎯 Roses are red, violets are blue, your XPath broke again, and your CSS selectors did too! 💔",
  "🦄 MYTH BUSTED: E2E tests that run reliably on the first try. Scientists are still searching for evidence! 🔬",
  "☕ Your test suite takes longer to run than it takes to manually test the entire app. Big brain energy! 🧠",
  "🚀 INNOVATION: Local dev discovers they can write tests that actually test something useful instead of clicking random buttons! 🎊",
  "💀 Your test failed because the button moved 2 pixels to the left. Time to update 47 locators! Welcome to E2E hell! 🔥",
  "🎭 Playwright users explaining why they're superior to Selenium users (nobody asked, but here we are again!) 🙄"
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
      title="An annnoying Modal to hinder you"
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