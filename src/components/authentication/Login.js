import React, { useState } from "react";
import { Form, Input, Button, Modal, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import _ from "lodash";
import "./login.css";

const Login = () => {
  const navigation = useNavigate();
  const [loginModalVisible, setLoginModalVisible] = useState(true);

  const style = {
    padding: "15px",
    borderRadius: "9px",
  };

  const handleOk = () => {
    setLoginModalVisible(false);
  };

  const onFinish = (value) => {
    axios
      .post(`http://localhost:8000/users/login`, value)
      .then((data) => {
        if (_.get(data, "data", [])) {
          localStorage.setItem("id", _.get(data, "data.id", ""));
          localStorage.setItem("name", _.get(data, "data.name", ""));
          localStorage.setItem("status", _.get(data, "data.status", ""));
          localStorage.setItem("profile", _.get(data, "data.profilePic", ""));
          localStorage.setItem("email", _.get(data, "data.email", ""));
          localStorage.setItem("ug", _.get(data, "data.ug", ""));
          localStorage.setItem("sslc", _.get(data, "data.sslc", ""));
          localStorage.setItem("hsc", _.get(data, "data.hsc", ""));
          localStorage.setItem(
            "resume_marks",
            _.get(data, "data.resume_marks", "")
          );

          if (_.get(data, "data.status", "") === "candidate") {
            notification.success({ message: "successfully Logined" });
            navigation("/dashboard");
          } else {
            notification.success({ message: "successfully Logined" });
            navigation("/dashboard");
          }
        } else {
          notification.error({ message: "Invalid Login details" });
        }
      })
      .catch(() => {
        notification.error({ message: "Login failed try again" });
      });
  };
  return (
    <div className="login-modal">
      <Modal
        centered
        visible={loginModalVisible}
        onOk={handleOk}
        footer={false}
        width={400}
      >
        <Form
          autoComplete="off"
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="E-mail"
              style={style}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
              autoComplete="new Password"
              style={style}
            />
          </Form.Item>
          <Link to="/signup">
            <b style={{ float: "right", color: "#1890ff" }}>Register Now</b>
            <br />
            <br />
          </Link>
          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              className="login-form-button"
              size="large"
            >
              Log in
            </Button>
          </Form.Item>
          {/* <Form.Item>
            <b className="login-form-forgot" href="">
              Forgot password
            </b>
          </Form.Item> */}
        </Form>
      </Modal>
    </div>
  );
};

export default Login;
