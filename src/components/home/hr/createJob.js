import React, { useState, useEffect } from "react";
import {
  notification,
  Layout,
  Button,
  Row,
  Col,
  Form,
  Input,
  Card,
  Table,
  Modal,
  Space,
  Skeleton,
  Tooltip,
  Tag,
  Drawer,
} from "antd";
import axios from "axios";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import _ from "lodash";
import Applications from "./applications";
const { Header, Content } = Layout;

const { TextArea } = Input;

const Createjob = () => {
  const [jobs, setJobs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentDrawer, setCurrentDrawer] = useState(false);
  const [currentJobId, setCurrentJobId] = useState();
  const [updateId, setUpdateId] = useState();
  const [form] = Form.useForm();
  const style = {
    padding: "15px",
    borderRadius: "9px",
  };
  const roleId = localStorage.getItem("id");
  const companyName = localStorage.getItem("name");
  const textAreaStyle = {
    height: "200px",
  };

  const handleCancel = () => {
    form.resetFields();
    setModalVisible(false);
  };

  const handleUpdate = (id) => {
    setUpdateId(id);
    const updateJob =
      jobs &&
      jobs.filter((res) => {
        return res.id === id;
      });
    form.setFieldsValue(_.get(updateJob, "[0]", {}));
    setModalVisible(true);
  };

  const fetchData = () => {
    setLoading(true);
    axios
      .get(`http://localhost:8000/jobs/${roleId}`)
      .then((data) => {
        setJobs(_.get(data, "data", []));
        setLoading(false);
      })
      .catch(() => {
        notification.error({ message: "something went wrong" });
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  const onFinish = (value) => {
    value.userId = roleId;
    value.company_name = companyName;
    if (updateId) {
      value.id = updateId;
      axios
        .post("http://localhost:8000/jobs/update", value)
        .then(() => {
          notification.success({ message: "Jobs Successfully Updated" });
          form.resetFields();
          handleCancel();
          fetchData();
        })
        .catch(() => {
          notification.error({ message: "Job Updation failed" });
          form.resetFields();
          handleCancel();
          fetchData();
        });
    } else {
      axios
        .post("http://localhost:8000/jobs/create", value)
        .then(() => {
          notification.success({ message: "Jobs Successfully Created" });
          form.resetFields();
          handleCancel();
          fetchData();
        })
        .catch(() => {
          notification.error({ message: "Job Creation failed" });
          form.resetFields();
          handleCancel();
          fetchData();
        });
    }
  };

  const viewJob = (value) => {
    setCurrentJobId(value);
    setCurrentDrawer(true);
  };

  const jobColumns = [
    {
      title: "Roles",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Skills Required",
      dataIndex: "skills",
      key: "skills",
    },
    {
      title: "Experience Required",
      dataIndex: "experience",
      key: "experience",
    },
    {
      title: "Salary Details",
      dataIndex: "salary",
      key: "salary",
    },
    {
      title: "Job Details",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Update",
      key: "Actions",
      render: (data) => {
        return (
          <>
            <span>
              <EditOutlined
                onClick={() => handleUpdate(data.id)}
                style={{ color: "green" }}
              />
            </span>
          </>
        );
      },
    },
    {
      title: "Applications",
      key: "Action",
      render: (data) => {
        return (
          <>
            <span>
              <Tag
                onClick={() => viewJob(data.id)}
                color="rgba(255, 8, 179, 0.52)"
                style={{ cursor: "pointer" }}
              >
                View Applications
              </Tag>
            </span>
          </>
        );
      },
    },
  ];
  return (
    <div>
      <Layout className="site-layout" style={{ marginLeft: 200 }}>
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {/* search */}
        </Header>
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, textAlign: "center" }}
          >
            <Col span={24}>
              <Tooltip
                placement="topLeft"
                visible={companyName ? false : true}
                title="please complete your profile"
              >
                <Button
                  disabled={companyName ? false : true}
                  type="primary"
                  style={{ float: "right" }}
                  onClick={() => {
                    setModalVisible(true);
                  }}
                >
                  <PlusOutlined /> Add job
                </Button>
              </Tooltip>
              <br />
              <br />
              <Card>
                <Skeleton loading={loading}>
                  <Table
                    loading={loading}
                    pagination={{ position: ["topRight "] }}
                    layout="fixed"
                    columns={jobColumns}
                    dataSource={jobs}
                  />
                </Skeleton>
              </Card>
            </Col>
          </div>
          <Modal visible={modalVisible} footer={false}>
            <Row>
              <Col span={24}>
                <Form
                  autoComplete="off"
                  form={form}
                  size="large"
                  onFinish={onFinish}
                >
                  <Form.Item
                    name="role"
                    rules={[
                      {
                        required: true,
                        message: "Please Enter Role Here",
                      },
                    ]}
                  >
                    <Input style={style} placeholder="Enter Role Here" />
                  </Form.Item>
                  <Form.Item
                    name="skills"
                    rules={[
                      {
                        required: true,
                        message: "Please Enter Required Skills",
                      },
                    ]}
                  >
                    <Input
                      style={style}
                      placeholder="Enter Enter Required Skills Here"
                    />
                  </Form.Item>

                  <Form.Item
                    name="experience"
                    rules={[
                      {
                        required: true,
                        message: "Please Enter Required Experience",
                      },
                    ]}
                  >
                    <Input
                      style={style}
                      placeholder="Enter Enter Required Experience Here"
                    />
                  </Form.Item>

                  <Form.Item
                    name="salary"
                    rules={[
                      {
                        required: true,
                        message: "Please Enter  Salary Details",
                      },
                    ]}
                  >
                    <Input
                      style={style}
                      placeholder="Enter Enter  Salary Details Here"
                    />
                  </Form.Item>

                  <Form.Item
                    name="description"
                    rules={[
                      {
                        required: true,
                        message: "Please Enter job Details",
                      },
                    ]}
                  >
                    <TextArea
                      style={textAreaStyle}
                      placeholder="Enter job Details Here"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Space>
                      <Button
                        type="primary"
                        size="medium"
                        htmlType="submit"
                        className="login-form-button"
                      >
                        Post job
                      </Button>
                      <Button
                        type="danger"
                        onClick={handleCancel}
                        size="medium"
                      >
                        cancel
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Modal>
          <Drawer      
          className="drawer-modal"  
            destroyOnClose
            footer={false}            
            height={1000}
            width={1500}
            onClose={() => {
              setCurrentDrawer(false);
            }}
            visible={currentDrawer}
          >
            <Applications
              currentDrawer={currentDrawer}
              setCurrentDrawer={setCurrentDrawer}
              currentJobId={currentJobId}
              setCurrentJobId={setCurrentJobId}
            />
          </Drawer>
        </Content>
      </Layout>
    </div>
  );
};

export default Createjob;
