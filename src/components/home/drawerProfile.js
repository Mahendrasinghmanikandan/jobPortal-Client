import React, { useState, useEffect, useRef } from "react";
import {
  Drawer,
  Form,
  Input,
  Button,
  Collapse,
  notification,
  Radio,
  Select,
  Space,
  Row,
  Col,
} from "antd";
import JoditEditor from "jodit-react";
import axios from "axios";
import Skills from "./skills";
import { UploadOutlined, EyeOutlined } from "@ant-design/icons";
import _ from "lodash";

const DrawerProfile = (properties) => {
  const status = localStorage.getItem("status");
  const { visibles, setEditVisible, userData, fetchData } = properties;
  const [visible, setVisible] = useState(visibles);
  const editor = useRef(null);
  const [form] = Form.useForm();
  const [content, setContent] = useState("");
  const [profilePath, setProfilePath] = useState("");
  const [filePath, setPath] = useState("");
  const [size, setSize] = useState(400);
  const { Panel } = Collapse;
  const { TextArea } = Input;
  const { Option } = Select;
  const config = {
    readonly: false,
  };
  const onClose = () => {
    setVisible(false);
    setEditVisible(false);
  };

  useEffect(() => {
    form.setFieldsValue(userData);
    setProfilePath(_.get(userData, "profilePic", ""));
    setPath(_.get(userData, "resume", ""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = (value) => {
console.log(value,'hsc')
    localStorage.setItem("name", value.name);
    localStorage.setItem("ug", value.ug);
    localStorage.setItem("sslc", value.sslc);
    localStorage.setItem("hsc", value.hsc);
    value.id = localStorage.getItem("id");
    if (filePath) {
      value.resume = filePath;
    }
    if (profilePath) {
      value.profilePic = profilePath;
    }
    axios
      .put("http://localhost:8000/users/update", value)
      .then(() => {
        notification.success({ message: "profile Updated successfully" });
        fetchData();
        onClose();
        if (profilePath) {
          window.location.reload();
        }
      })
      .catch(() => {
        notification.error({ message: "registration failed" });
      });
  };

  const uploadResume = async (e) => {
    console.log("enter");
    const formData = new FormData();

    if (e.target.files[0].type === "application/pdf") {
      formData.append("file", e.target.files[0]);
      try {
        const res = await axios.post(
          "http://localhost:8000/users/upload/resume",
          formData
        );
        console.log(res.data.data.file_name);
        setPath(_.get(res, "data.data.file_name", ""));
        notification.success({ message: "Process Done" });
      } catch (ex) {
        notification.error({ message: "Please Change the file name" });
      }
    } else {
      notification.error({ message: "Your File type must be .pdf" });
    }
  };

  const uploadProfile = async (e) => {
    console.log("ente hr");
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    console.log(e.target.files[0].name);
    if (
      e.target.files[0].type === "image/jpg" ||
      e.target.files[0].type === "image/jpeg" ||
      e.target.files[0].type === "image/png"
    ) {
      try {
        const res = await axios.post(
          "http://localhost:8000/users/upload/resume",
          formData
        );
        setProfilePath(_.get(res, "data.data.file_name", ""));
        notification.success({ message: "Process Done" });
      } catch (ex) {
        notification.error({ message: "Please Change the file name" });
      }
    } else {
      notification.error({
        message: "Your File type must be .png | .jpg | .jpeg",
      });
    }
  };
  return (
    <div>
      <Drawer
        title="Profile"
        placement="right"
        visible={visible}
        width={size || 400}
        header={false}
        destroyOnClose
      >
        <Form
          autoComplete="off"
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
          form={form}
        >
          <span>
            <Space></Space>
          </span>
          <span style={{ float: "right", color: "green" }}>
            <Radio.Group value={size}>
              <Radio.Button onClick={() => setSize(1000)} value="large">
                Large
              </Radio.Button>
              <Radio.Button onClick={() => setSize(600)} value="default">
                Default
              </Radio.Button>
              <Radio.Button onClick={() => setSize(400)} value="small">
                Small
              </Radio.Button>
            </Radio.Group>
          </span>
          <br></br>
          <br></br>
          <br></br>
          <Collapse defaultActiveKey={["1","2","3","4","5"]}>
            <Panel header="General Details" key="1">
              <p>
                <Form.Item
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter name Here",
                    },
                  ]}
                >
                  <Input placeholder="name" />
                </Form.Item>

                {status === "candidate" ? (
                  <Form.Item
                    name="role"
                    rules={[
                      {
                        required: true,
                        message: "Please Enter Role Here",
                      },
                    ]}
                  >
                    <Input placeholder="role" />
                  </Form.Item>
                ) : null}
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
                  <Input placeholder="E-mail" />
                </Form.Item>

                {status === "candidate" &&
                  <Form.Item
                    name="resume"
                    rules={[
                      {
                        required: true,
                        message: "Please upload resume",
                      },
                    ]}
                  >
                    <div class="upload-btn-wrapper">
                      <Button type="danger">
                        <UploadOutlined style={{ cursor: "pointer" }} />
                        Upload a Resume
                      </Button>

                      <Input
                        type="file"
                        class="upload-btn-wrapper"
                        onChange={uploadResume}
                      />
                      <br />
                      <i>{filePath}</i>
                    </div>
                  </Form.Item>
                }
                <div class="upload-btn-wrapper">
                  <Button type="danger">
                    <UploadOutlined style={{ cursor: "pointer" }} />
                    profile picture
                  </Button>
                  <input type="file" name="myfile" onChange={uploadProfile} />
                  <br />
                  <br />
                  <i>{profilePath}</i>
                  <br />
                </div>
              </p>
            </Panel>
            <Panel
              header={status === "candidate" ? "About me" : "About My Company"}
              key="2"
            >
              <Form.Item
                name="aboutme"
                rules={[
                  {
                    required: true,
                    message:
                      status === "candidate"
                        ? "Please Enter  About Your Experiences"
                        : " Please Enter your  Company Details",
                  },
                ]}
              >
                <JoditEditor
                  ref={editor}
                  value={_.get(userData, "aboutme", "") || content}
                  config={config}
                  tabIndex={1}
                  onBlur={(newContent) =>
                    setContent(newContent || _.get(userData, "aboutme", ""))
                  }
                  onChange={(newContent) => {}}
                />
              </Form.Item>
            </Panel>
            <Panel
              header={status === "candidate" ? "Skills" : "Technology Used"}
              key="3"
            >
              <>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message:
                        status === "candidate"
                          ? "Please Enter Your Skills"
                          : " Please Enter Technology Used",
                    },
                  ]}
                  name="skills"
                >
                  <TextArea
                    placeholder={
                     status === "candidate"
                        ? "Please Enter  Skills"
                        : "Please Enter  Technology Used"
                    }
                  />
                </Form.Item>
              </>
            </Panel>
            {status === "candidate" ? (
              <Panel header="Education" key="4">
                <>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "Please Enter Your UG%",
                      },
                    ]}
                    name="ug"
                  >
                    <Input placeholder="UG %" />
                  </Form.Item>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "Please Enter Your HSC%",
                      },
                    ]}
                    name="hsc"
                  >
                    <Input placeholder="HSC %" />
                  </Form.Item>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "Please Enter Your SSLC%",
                      },
                      // {
                      //   type: "number",
                      //   message: "The Enter Numbers only!",
                      // },
                    ]}
                    name="sslc"
                  >
                    <Input placeholder="SSLC %" />
                  </Form.Item>
                </>
              </Panel>
            ) : null}
            <Panel header="How to reach me" key="5">
              <>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Your Address%",
                    },
                  ]}
                  name="address"
                >
                  <TextArea placeholder="address" />
                </Form.Item>
                <Form.Item
                  rules={[
                    // {
                    //   type: "number",
                    //   message: "The Enter  valid Contact!",
                    // },
                    {
                      required: true,
                      message: "Please Enter your Contact!",
                    },
                  ]}
                  name="phone"
                >
                  <Input
                    style={{ padding: "10px", borderRadius: "19px" }}
                    placeholder="contact"
                    showCount
                    maxLength={10}
                  />
                </Form.Item>
              </>
            </Panel>
          </Collapse>
          <br />
          <br />
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Save
            </Button>{" "}
            &nbsp;
            <Button
              type="danger"
              className="login-form-button"
              onClick={onClose}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default DrawerProfile;
