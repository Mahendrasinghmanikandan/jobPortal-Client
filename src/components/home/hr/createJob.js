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
  Empty,
  Popconfirm,
  Select,
  InputNumber,
} from "antd";
import axios from "axios";
import {
  PlusOutlined,
  EditOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import _ from "lodash";
import Applications from "./applications";
import Roles from "../../../helper/roles";
import experienceFrom from "../../../helper/experienceFrom";
import jobLocation from "../../../helper/jobLocation";
import { useNavigate } from "react-router-dom";
const commaNumber = require("comma-number");
const { Header, Content } = Layout;

const { TextArea } = Input;
const { Option } = Select;

const Createjob = () => {
  const [jobs, setJobs] = useState([]);
  const [rolesFilteredData, setRolesFilteredData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentDrawer, setCurrentDrawer] = useState(false);
  const [currentJobId, setCurrentJobId] = useState();
  const [updateId, setUpdateId] = useState();
  const [experience, setExperience] = useState([]);
  const [filterRoless, setFilterRoless] = useState([]);
  const [updateActivity, setUpdateActivity] = useState(false);

  const [form] = Form.useForm();
  const navigation = useNavigate();

  const roleId = localStorage.getItem("id");
  const companyName = localStorage.getItem("name");

  const textAreaStyle = {
    height: "200px",
  };

  const handleCancel = () => {
    form.resetFields();
    setUpdateId();
    form.resetFields();
    setFilterRoless();
    setModalVisible(false);
    setUpdateActivity(false);
  };

  const handleUpdate = (id) => {
    setUpdateId(id);
    setUpdateActivity(true);
    const updateJob =
      jobs &&
      jobs.filter((res) => {
        return res.id === id;
      });

    form.setFieldsValue(_.get(updateJob, "[0]", {}));

    form.setFieldsValue({
      skill: _.get(updateJob, "[0].Skills", []).map((result) => {
        return result.value;
      }),
    });
    const filterRoles = Roles.filter((result) => {
      return result.role_name === _.get(updateJob, "[0].role", "");
    });

    setFilterRoless(filterRoles);

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
    setRolesFilteredData(
      Roles && Roles.filter((res) => res.role_name !== "for hr")
    );

    fetchData();
  }, []);

  const onFinish = (value) => {
    setLoading(true);
    value.userId = roleId;
    value.company_name = companyName;
    if (updateId) {
      value.id = updateId;
      axios
        .post("http://localhost:8000/jobs/update", value)
        .then(() => {
          notification.success({ message: "Jobs Successfully Updated" });
          setLoading(false);
          form.resetFields();
          handleCancel();
          fetchData();
        })
        .catch(() => {
          notification.error({ message: "Job Updation failed" });
          setLoading(false);
          form.resetFields();
          handleCancel();
          fetchData();
        });
    } else {
      axios
        .post("http://localhost:8000/jobs/create", value)
        .then(() => {
          notification.success({ message: "Jobs Successfully Created" });
          setLoading(false);
          form.resetFields();
          handleCancel();
          fetchData();
        })
        .catch(() => {
          notification.error({ message: "Job Creation failed" });
          setLoading(false);
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
      title: "Job Id",
      dataIndex: "id",
      key: "id",
      render: (data) => {
        return <span>{data}</span>;
      },
    },
    {
      title: "Job Details",
      dataIndex: "description",
      key: "description",
      render: (data) => {
        return (
          <span>
            <Tooltip placement="topLeft" title={data}>
              {data.slice(0, 20)}...
            </Tooltip>
          </span>
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
    {
      title: "Roles",
      dataIndex: "role",
      key: "role",
      render: (data) => {
        return <pre className="table-td">{data}</pre>;
      },
    },

    {
      title: "Experience Required",
      key: "experience",
      render: (data) => {
        return (
          <pre className="table-td">
            ₹{_.get(data, "salaryFrom", "")} to ₹{_.get(data, "salaryTo", "")}
          </pre>
        );
      },
    },
    {
      title: "Salary Details",
      key: "salary",
      render: (data) => {
        return (
          <pre className="table-td">
            {_.get(data, "expFrom", "")} to {_.get(data, "expTo", "")}
          </pre>
        );
      },
    },
    {
      title: "Salary Type",
      dataIndex: "salaryType",
      key: "salaryType",
      render: (data) => {
        return <pre className="table-td">{data}</pre>;
      },
    },
    {
      title: "Location",
      dataIndex: "jobLocation",
      key: "id",
      render: (data) => {
        return <pre className="table-td">{data}</pre>;
      },
    },
    {
      title: "Skills Required",
      dataIndex: "Skills",
      key: "id",
      render: (data) => {
        return data.map((res) => (
          <>
            <Tag color="green">{res.value}&nbsp;</Tag>
          </>
        ));
      },
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
  ];
  const onConfirm = () => {
    navigation("/dashboard");
  };
  const roleChange = (role_name) => {
    const filterRoles = Roles.filter((result) => {
      return result.role_name === role_name;
    });
    form.setFieldsValue({ skill: [] });
    form.setFieldsValue({ description: _.get(filterRoles, "[0].details", "") });
    setFilterRoless(filterRoles);
  };
  const experienceChange = (experience) => {
    const filterExperienceTo = experienceFrom.filter((result) => {
      return result.value === experience;
    });

    form.setFieldsValue({
      expTo: _.get(filterExperienceTo, "[0].experienceto[0].value", ""),
    });
    setExperience(filterExperienceTo);
  };

  const handleCurrencyChange = (e) => {
    form.setFieldsValue({ salaryTo: parseFloat(e) + 5000 });
    form.setFieldsValue({ salaryFrom: parseFloat(e) });
  };
  return (
    <div>
      <Layout className="site-layout" style={{ marginLeft: 200 }}>
        <Content>
          <div
            className="site-layout-background"
            style={{ padding: 24, textAlign: "center" }}
          >
            {_.isEmpty(jobs) ? (
              <div style={{ marginTop: "20%" }}>
                <Popconfirm
                  placement="topRight"
                  title="Please Complete your profile"
                  onConfirm={onConfirm}
                  disabled={companyName !== "null" ? true : false}
                  okText="Complete now"
                  cancelText={false}
                >
                  <Skeleton active loading={loading}>
                    <Button
                      onClick={() => {
                        setModalVisible(companyName !== "null" ? true : false);
                      }}
                      type="primary"
                    >
                      <CloudUploadOutlined />
                      Upload Jobs
                    </Button>
                  </Skeleton>
                </Popconfirm>
              </div>
            ) : (
              <Col span={24}>
                <Button
                  type="primary"
                  style={{ float: "right" }}
                  onClick={() => {
                    setModalVisible(true);
                  }}
                >
                  <PlusOutlined /> Upload job
                </Button>
                <br />
                <br />
                <Card>
                  <Skeleton loading={loading}>
                    <Table
                      bordered
                      scroll={{ x: 500 }}
                      loading={loading}
                      pagination={{ position: ["topRight "] }}
                      layout="fixed"
                      columns={jobColumns}
                      dataSource={jobs}
                    />
                  </Skeleton>
                </Card>
              </Col>
            )}
          </div>
          <Modal visible={modalVisible} width="1000px" footer={false}>
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
                    <Select
                      size="large"
                      placeholder="Select Role Here"
                      onChange={(e) => roleChange(e)}
                    >
                      {rolesFilteredData &&
                        rolesFilteredData.map((res) => {
                          return (
                            <Option key={res.id} value={res.role_name}>
                              {res.role_name}
                            </Option>
                          );
                        })}
                    </Select>
                  </Form.Item>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Form.Item
                        name="expFrom"
                        rules={[
                          {
                            required: true,
                            message: "Please Select Required Experience From",
                          },
                        ]}
                      >
                        <Select
                          // defaultValue={"0 years"}
                          size="large"
                          placeholder="Experience From"
                          onChange={(e) => experienceChange(e)}
                        >
                          {experienceFrom.map((res) => {
                            return (
                              <Option key={res.id} value={res.value}>
                                {res.value}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        name="expTo"
                        rules={[
                          {
                            required: true,
                            message: "Please Select Required Experience To",
                          },
                        ]}
                      >
                        <Select
                          // defaultValue={"1 years"}
                          size="large"
                          placeholder="Experience To"
                        >
                          {_.get(experience, "[0].experienceto", []).map(
                            (res) => {
                              return (
                                <Option key={res.id} value={res.value}>
                                  {res.value}
                                </Option>
                              );
                            }
                          )}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[16, 16]}>
                    <Col span={10}>
                      <Form.Item
                        name="salaryFrom"
                        rules={[
                          {
                            required: true,
                            message: "Please Enter Salary From",
                          },
                        ]}
                      >
                        <InputNumber
                          // defaultValue={10000}
                          onChange={(e) => {
                            handleCurrencyChange(e);
                          }}
                          style={{ width: "100%" }}
                          size="large"
                          placeholder="Salary From"
                        />
                      </Form.Item>
                    </Col>

                    <Col span={10}>
                      <Form.Item
                        name="salaryTo"
                        rules={[
                          {
                            required: true,
                            message: "Please Enter Salary To",
                          },
                        ]}
                      >
                        <InputNumber
                          // defaultValue={10000 + 5000}
                          style={{ width: "100%" }}
                          size="large"
                          placeholder="Salary To"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        name="salaryType"
                        rules={[
                          {
                            required: true,
                            message: "Please Select Salary Type",
                          },
                        ]}
                      >
                        <Select
                          // defaultValue={"Per Year"}
                          size="large"
                          placeholder="Salary Type"
                        >
                          <Option value="Per Year">Per Year</Option>
                          <Option value="Per Month">Per Month</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

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
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "Please Select Required Skills",
                      },
                    ]}
                    name="skill"
                  >
                    <Select size="large" placeholder="Skills" mode="multiple">
                      {_.get(filterRoless, "[0].skills", []).map((res) => {
                        return <Option value={res.name}>{res.name}</Option>;
                      })}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="testType"
                    rules={[
                      {
                        required: true,
                        message: "Please Select Test Type",
                      },
                    ]}
                  >
                    <Select size="large" placeholder="Test Type">
                      <Option value="Easy">Easy</Option>
                      <Option value="Medium">Medium</Option>
                      <Option value="Hard">Hard</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="jobLocation"
                    rules={[
                      {
                        required: true,
                        message: "Please Select Required Experience From",
                      },
                    ]}
                  >
                    <Select
                      // defaultValue={"0 years"}
                      size="large"
                      placeholder="Please Select Job Location From"
                    >
                      {jobLocation.map((res) => {
                        return (
                          <Option key={res.id} value={res.value}>
                            {res.value}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                  <Form.Item>
                    <Space>
                      <Button
                        type="primary"
                        size="medium"
                        htmlType="submit"
                        className="login-form-button"
                        loading={loading}
                      >
                        {updateActivity ? "Update Job" : " Upload job"}
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
