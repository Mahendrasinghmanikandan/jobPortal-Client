import React, { useState } from "react";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const [visible, setVisible] = useState(true);
  const navigation = useNavigate();
  const hideModal = () => {
    navigation("/dashboard");
    setVisible(false);
    };
    
  const onLogout = () => {
    localStorage.clear();
    navigation("/");
    setVisible(false);
    };
    
  return (
    <Modal
      visible={visible}
      onOk={onLogout}
      onCancel={hideModal}
      width={300}
      okText="Yes"
      cancelText="No"
    >
      <b>Are You Sure Want to Logout?</b>
    </Modal>
  );
};

export default Logout;
