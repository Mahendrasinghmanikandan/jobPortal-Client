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
import Roles from "../../helper/roles";
import { UploadOutlined, EyeOutlined } from "@ant-design/icons";
import _ from "lodash";

const DrawerProfile = (properties) => {
  const status = localStorage.getItem("status");
  const { visibles, setEditVisible, userData, fetchData } = properties;
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(visibles);
  const editor = useRef(null);
  const [form] = Form.useForm();
  const [content, setContent] = useState("");
  const [Entered, setEntered] = useState(false);

  const [profilePath, setProfilePath] = useState("");
  const [resumePath, setResumePath] = useState("");
  const [resumeMark, setResumeMark] = useState("");
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
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
    setContent();
    setProfilePath();
    setResumePath();
    setResumeMark();
    setFilteredSkills();
    setEntered(false);
  };

  useEffect(() => {
    form.setFieldsValue(userData);
    status === "candidate"
      ? form.setFieldsValue({ role: _.get(userData, "role", []) })
      : form.setFieldsValue({ role: "" });
    form.setFieldsValue({
      skill: _.get(userData, "Skills", []).map((result) => {
        return result.value;
      }),
    });
    setFilteredRoles(
      Roles.filter((res) =>
        status === "candidate"
          ? res.role_name !== "for hr"
          : res.role_name === "for hr"
      )
    );

    setProfilePath(_.get(userData, "profilePic", []));
    setFilteredSkills(
      Roles.filter((res) =>
        status === "candidate"
          ? res.role_name !== "for hr"
          : res.role_name === "for hr"
      )
    );

    setResumeMark(_.get(userData, "resume_marks", ""));
    setResumePath(_.get(userData, "resume", ""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const analyseResume = (value) => {
    if (value > 2000) {
      return 100;
    } else if (value > 1500) {
      return 75;
    } else if (value > 1000) {
      return 50;
    } else if (value > 500) {
      return 25;
    }
  };
  const onFinish = (value) => {
    setLoading(true);
    localStorage.setItem("name", value.name);
    localStorage.setItem("ug", value.ug);
    localStorage.setItem("sslc", value.sslc);
    localStorage.setItem("hsc", value.hsc);

    value.id = localStorage.getItem("id");
    if (Entered) {
      value.resume = resumePath;
      value.resume_marks = analyseResume(resumeMark);
      localStorage.setItem("resume_marks", analyseResume(resumeMark));
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
        setLoading();
        if (profilePath) {
          window.location.reload();
        }
      })
      .catch(() => {
        setLoading();
        fetchData();
        onClose();
        notification.error({ message: "registration failed" });
      });
  };

  const uploadResume = async (e) => {
    const formData = new FormData();

    if (e.target.files[0].type === "application/pdf") {
      formData.append("file", e.target.files[0]);
      try {
        const res = await axios.post(
          "http://localhost:8000/users/upload/resume",
          formData
        );

        setResumeMark(
          _.get(res, "data.data.content_length", "") +
            _.get(res, "data.data.page_count", "")
        );
        setResumePath(_.get(res, "data.data.file_name", ""));
        setEntered(true);
        notification.success({ message: "Process Done" });
      } catch (ex) {
        notification.error({ message: "Please Change the file name" });
      }
    } else {
      notification.error({ message: "Your File type must be .pdf" });
    }
  };

  const uploadProfile = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

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
  const handleRoleChange = (value) => {
    setFilteredSkills(
      filteredRoles && filteredRoles.filter((res) => res.role_name === value)
    );
    form.setFieldsValue({ skill: [] });
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
          <Collapse defaultActiveKey={["1", "2", "3", "4", "5"]}>
            <Panel header="General Details" key="1">
              <p>
                <Form.Item
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: `Please Enter ${
                        status === "candidate" ? "name" : "Company Name"
                      } Here`,
                    },
                  ]}
                >
                  <Input
                    placeholder={
                      status === "candidate" ? "name" : "Company Name"
                    }
                  />
                </Form.Item>

                {status === "candidate" ? (
                  <>
                    <Form.Item
                      name="role"
                      rules={[
                        {
                          required: true,
                          message: "Please Select Role Here",
                        },
                      ]}
                    >
                      <Select
                        size="large"
                        placeholder="Role"
                        onChange={(e) => handleRoleChange(e)}
                      >
                        {filteredRoles &&
                          filteredRoles.map((res) => {
                            return (
                              <Option value={res.role_name}>
                                {res.role_name}
                              </Option>
                            );
                          })}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="gender"
                      rules={[
                        {
                          required: true,
                          message: "Please Select gender Here",
                        },
                      ]}
                    >
                      <Select placeholder="gender" size="large">
                        <Option value="Male">Male</Option>
                        <Option value="Female">Female</Option>
                        <Option value="Others">Others</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="experience"
                      rules={[
                        {
                          required: true,
                          message: "Please Select Experience Here",
                        },
                      ]}
                    >
                      <Select placeholder="Experience" size="large">
                        <Option value="Fresher">Fresher</Option>
                        <Option value="Experienced">Experienced</Option>
                      </Select>
                    </Form.Item>
                  </>
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

                {status === "candidate" && (
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
                      <i>{resumePath}</i>
                    </div>
                  </Form.Item>
                )}
                <Form.Item
                  name="profilePic"
                  rules={[
                    status === "candidate"
                      ? ""
                      : {
                          required: true,
                          message: "Please upload profile picture",
                        },
                  ]}
                >
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
                </Form.Item>
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
                  name="skill"
                >
                  <Select size="large" mode="multiple">
                    {_.get(filteredSkills, "[0].skills", []).map((res) => {
                      return <Option value={res.name}>{res.name}</Option>;
                    })}
                  </Select>
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
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            !value ||
                            getFieldValue("ug").match(/^[0-9.]+$/)
                          ) {
                            return Promise.resolve();
                          }

                          return Promise.reject(
                            new Error("Please Enter Numbers only!")
                          );
                        },
                      }),
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
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            !value ||
                            getFieldValue("hsc").match(/^[0-9.]+$/)
                          ) {
                            return Promise.resolve();
                          }

                          return Promise.reject(
                            new Error("Please Enter Numbers only!")
                          );
                        },
                      }),
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
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            !value ||
                            getFieldValue("sslc").match(/^[0-9.]+$/)
                          ) {
                            return Promise.resolve();
                          }

                          return Promise.reject(
                            new Error("Please Enter Numbers only!")
                          );
                        },
                      }),
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
                    {
                      required: true,
                      message: "Please Enter your Contact!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (
                          !value ||
                          getFieldValue("phone").match(/^[0-9]+$/)
                        ) {
                          return Promise.resolve();
                        }

                        return Promise.reject(
                          new Error("Please Enter Valid Contact Number!")
                        );
                      },
                    }),
                  ]}
                  name="phone"
                >
                  <Input
                    style={{ padding: "7px", borderRadius: "7px" }}
                    placeholder="contact"
                    showCount
                    maxLength={10}
                    minLength={10}
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
              loading={loading}
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
