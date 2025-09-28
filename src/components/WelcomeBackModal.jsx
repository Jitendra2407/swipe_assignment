"use client";
import { Modal, Button } from "antd";

const WelcomeBackModal = ({ isOpen, onResume, onStartOver }) => {
  return (
    <Modal
      title="Welcome Back!"
      open={isOpen}
      closable={false}
      footer={[
        <Button key="start_over" onClick={onStartOver}>
          Start Over
        </Button>,
        <Button key="resume" type="primary" onClick={onResume}>
          Resume Interview
        </Button>,
      ]}
    >
      <p>It looks like you were in the middle of an interview.</p>
      <p>
        Would you like to resume where you left off, or start over with a new
        session?
      </p>
    </Modal>
  );
};

export default WelcomeBackModal;
