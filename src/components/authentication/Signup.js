import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Modal,
  notification,
  Switch,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import _ from "lodash";
import './login.css';

const Signup = (properties) => {
  const [loginModalVisible, setLoginModalVisible] = useState(true);
  const [userData, setUserData] = useState([]);
  const [emailData, setEmailData] = useState(false);
  const [who, setWho] = useState("candidate");
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const handleOk = () => {
    setLoginModalVisible(false);
  };
  const style = {
    padding: "15px",
    borderRadius: "9px",
  };
  useEffect(() => {
    axios
      .get("http://localhost:8000/users")
      .then((data) => {
        setUserData(_.get(data, "data", []));
      })
      .catch(() => {
        notification.error({ message: "something went wrong" });
      });
  }, []);

  const onFinish = (value) => {
    
    if (emailData) {
      notification.error({ message: "Email already used" });
    } else {
      value.status = who;
      axios
        .post("http://localhost:8000/users/create", value)
        .then(() => {
          notification.success({ message: "successfully registered" });
          navigate("/");
        })
        .catch(() => {
          notification.error({ message: "registration failed" });
        });
    }
  };

  const handleEmailChange = () => {
    const validateEmail =
      userData &&
      userData.some((user) => user.email === form.getFieldValue("email"));
    setEmailData(validateEmail);
    validateEmail && message.error("Email already used");
  };
  return (
    <div className="Signup-modal">
      <Modal           
        centered
        visible={loginModalVisible}
        onOk={handleOk}
        footer={false}
        width={500}
        // onCancel={handleCancel}
      >
        <Form
          autoComplete="off"
          name="normal_login"
          className="signup-form"
          onFinish={onFinish}
          form={form}
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
              style={style}
              prefix={<UserOutlined className="site-form-item-icon" />}
              onChange={handleEmailChange}
              placeholder="E-mail"
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
              style={style}
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
              autoComplete="new Password"
            />
          </Form.Item>
          <Form.Item
            name="confirm"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password
              style={style}
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="Confirm Password"
              placeholder="Password"
            />
          </Form.Item>
          <Switch
            defaultChecked
            size="small"
            onChange={() => {
              setWho(who === "candidate" ? "hr" : "candidate");
            }}
          />{" "}
          &nbsp; {who}
          <Link to="/">
            <b style={{ float: "right" ,color:"#1890ff" }}>Login Now</b>
            <br />
            <br />
          </Link>
          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              className="login-form-button"
              size='large'
            >
              Signup
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Signup;
