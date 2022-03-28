/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  notification,
  Layout,
  Button,
  Row,
  Col,
  Card,
  Drawer,
  Skeleton,
  Result,
  Avatar,
  Popconfirm,
  Modal,
  Radio,
  Space,
  Tag,
  Select,
  Tooltip,
} from "antd";
import axios from "axios";

import experienceFilter from "../../../helper/experienceFilter";
import salaryFilter from "../../../helper/salaryFilter";
import _ from "lodash";
import jobLocation from "../../../helper/jobLocation";
import { useNavigate } from "react-router-dom";
import Roles from "../../../helper/roles";

const {  Content } = Layout;
const { Option } = Select;
const { Meta } = Card;

const Applyjobs = () => {
  const roleId = localStorage.getItem("id");
  const navigation = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [modalDatas, setModalDatas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [testQuestions, setTestQuestions] = useState([]);
  const [viewMore, setViewMore] = useState(false);
  const [testLength, setTestLength] = useState();
  const [testScore, setTestScore] = useState([]);
  const [openTest, setOpenTest] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [badLuck, setBadLuck] = useState(false);
  const [goodLuck, setGoodLuck] = useState(false);
  const [filterStatus, setFilterStatus] = useState(false);
  const [filterWithLocation, setFilterWithLocation] = useState(true);
  const [filterWithRole, setFilterWithRole] = useState(true);
  const [filterWithExperience, setFilterWithExperience] = useState(true);
  const [salaryType, setSalaryType] = useState(true);
  const [salaryAmount, setSalaryAmount] = useState(true);
  const [analyseResult, setAnalyseResult] = useState();
  const [rolesFilteredDatas, setRolesFilteredDatas] = useState();
  const checkName = localStorage.getItem("name");

  const fetchData = () => {
    setLoading(true);
    axios
      .get(
        `http://localhost:8000/jobs/candidate/jobs/${roleId}/${filterWithLocation}/${filterWithRole}/${filterWithExperience}/${salaryType}/${salaryAmount}`
      )
      .then((data) => {
        setJobs(_.get(data, "data", []));
        setLoading(false);
      })
      .catch(() => {
        notification.error({ message: "something went wrong" });
      });
  };
  useEffect(() => {
    setRolesFilteredDatas(
      Roles && Roles.filter((res) => res.role_name !== "for hr")
    );
    fetchData();
  }, [
    filterWithLocation,
    filterWithRole,
    filterWithExperience,
    salaryType,
    salaryAmount,
  ]);

  const handleViewMore = (id) => {
    const newData =
      jobs &&
      jobs.filter((res) => {
        return res.id === id;
      });
    setModalDatas(newData);
    setViewMore(true);
  };

  const handleClose = () => {
    setViewMore(false);
    setModalDatas([]);
    setTestQuestions();
    setTestLength();
    setAnalyseResult();
    setFinalScore();
    setTestScore([]);
  };

  const onFinish = async () => {
    setLoading(true);
    setViewMore(false);
    await axios
      .get(`http://localhost:8000/jobs/resume-test/getquestions`)
      .then((data) => {
        let Questions = [];
        _.get(data, "data.data", []).filter((data) =>
          _.get(modalDatas, "[0].Skills", []).map((res) => {
            if (
              res.value === data[7] &&
              data[8] === _.get(modalDatas, "[0].testType", "")
            ) {
              Questions.push(data);
            }
          })
        );

        setLoading(false);
        if (!_.isEmpty(Questions)) {
          setTestQuestions(Questions);
          setTestLength(Questions.length - 1);
          setAnalyseResult(Questions.length);
          setOpenTest(true);
        } else {
          notification.error({
            message: "something went wrong please try again!",
          });
          handleClose();
          fetchData();
        }
      })
      .catch(() => {
        notification.error({ message: "something went wrong" });
        setLoading(false);
      });
  };
  const finishQuiz = async (testResult) => {
    setLoading(true);
    const hsc = localStorage.getItem("hsc");
    const sslc = localStorage.getItem("sslc");
    const ug = localStorage.getItem("ug");
    const name = localStorage.getItem("name");
    const resume_marks = localStorage.getItem("resume_marks");
    const id = localStorage.getItem("id");
    const formData = {
      Jobid: _.get(modalDatas, "[0].id", ""),
      user_id: roleId,
      resume_mark:
        (parseInt(hsc) +
          parseInt(sslc) +
          parseInt(ug) +
          parseInt(resume_marks)) /
        4,
      testResults: testResult,
      recever_email: _.get(modalDatas, "[0].users[0].email", ""),
      sender_email: "takeit-jobportal@quickmail.com",
      heading: `${name} Clear Your First Round`,
      candidate_id: id,
      regards: `Thankyou takeit-jobportal Teams`,
      textColor: "green",
      content: "Please Respone to this application",
    };
    axios
      .post("http://localhost:8000/application/create", formData)
      .then(() => {
        if (testResult) {
          notification.success({ message: "Job Applied Successfully" });
        }

        setLoading(false);
        handleClose();
        fetchData();
      })
      .catch(() => {
        notification.error({ message: "something went wrong" });
        handleClose();
        setLoading(false);
        fetchData();
      });
  };
  const onConfirm = () => {
    navigation("/dashboard");
  };

  const validateScore = () => {
    setOpenTest(false);
    const finalScores = testScore.reduce((a, b) => a + b, 0);

    setFinalScore(finalScores);
    if (finalScores >= analyseResult / 2) {
      setGoodLuck(true);
      finishQuiz(true);
    } else {
      setBadLuck(true);
      finishQuiz(false);
    }
  };
  const filterCancel = () => {
    setFilterStatus(false);
    setFilterWithLocation("true");
    setFilterWithRole("true");
    setFilterWithRole("true");
    setFilterWithExperience("true");
    setSalaryType("true");
    setSalaryAmount("true");
    setAnalyseResult("true");
  };
  return (
    <>
      <div>
        <Layout className="site-layout" style={{ marginLeft: 200 }}>
          <Content>
            <div
              className="site-layout-background"
              style={{ padding: 24, textAlign: "center" }}
            >
              <Col span={24}>
                <>
                  {filterStatus ? (
                    <Button
                      type="danger"
                      style={{ float: "right" }}
                      onClick={filterCancel}
                    >
                      Clear Filter
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      style={{ float: "right" }}
                      onClick={() => {
                        setFilterStatus(true);
                      }}
                    >
                      Filter
                    </Button>
                  )}
                  {filterStatus && (
                    <Space>
                      <Select
                        onChange={(e) => {
                          setFilterWithLocation(e);
                        }}
                        size="large"
                        placeholder="Job Location"
                      >
                        {jobLocation.map((res) => {
                          return (
                            <Option key={res.id} value={res.value}>
                              {res.value}
                            </Option>
                          );
                        })}
                      </Select>
                      <Select
                        onChange={(e) => {
                          setFilterWithRole(e);
                        }}
                        size="large"
                        placeholder="Job Role Filter"
                      >
                        {rolesFilteredDatas.map((res) => {
                          return (
                            <Option key={res.id} value={res.role_name}>
                              {res.role_name}
                            </Option>
                          );
                        })}
                      </Select>
                      <Select
                        onChange={(e) => {
                          setFilterWithExperience(e);
                        }}
                        size="large"
                        placeholder="Experience Filter"
                      >
                        {experienceFilter.map((res) => {
                          return (
                            <Option key={res.id} value={res.value}>
                              {res.value}
                            </Option>
                          );
                        })}
                      </Select>
                      <br />
                      <Select
                        onChange={(e) => {
                          setSalaryAmount(e);
                        }}
                        size="large"
                        placeholder="Salary Filter"
                      >
                        {salaryFilter.map((res) => {
                          return (
                            <Option key={res.id} value={res.value}>
                              {res.value}
                            </Option>
                          );
                        })}
                      </Select>
                      <Select
                        onChange={(e) => {
                          setSalaryType(e);
                        }}
                        size="large"
                        placeholder="Salary Type"
                      >
                        <Option value="Per Year">Per Year</Option>
                        <Option value="Per Month">Per Month</Option>
                      </Select>
                    </Space>
                  )}
                </>

                <br />
                <br />

                <Row gutter={16}>
                  {!_.isEmpty(jobs) ? (
                    jobs.map((res) => {
                      return (
                        <Col span={5}>
                          <Card
                            hoverable
                            style={{ width: 240, marginBottom: "20px" }}
                            cover={
                              <div className="logo">
                                <Avatar
                                  size={64}
                                  src={
                                    _.get(res, "users[0].profilePic", "") &&
                                    "uploads/" +
                                      _.get(res, "users[0].profilePic", "")
                                  }
                                >
                                  {!_.get(res, "users[0].profilePic", "")
                                    ? _.get(res, "users[0].email", "")
                                      ? _.get(res, "users[0].email", "").charAt(
                                          0
                                        )
                                      : ""
                                    : null}
                                </Avatar>
                              </div>
                            }
                          >
                            <Skeleton active loading={loading}>
                              <Meta
                                title={
                                  <Tooltip
                                    placement="topLeft"
                                    title={_.get(res, "users[0].name", "")}
                                  >
                                    {_.get(res, "users[0].name", "")}
                                  </Tooltip>
                                }
                                description={_.get(res, "role", "")}
                              />
                              <br />
                              <Button
                                type="primary"
                                style={{ borderRadius: "9px" }}
                                onClick={() =>
                                  handleViewMore(_.get(res, "id", ""))
                                }
                              >
                                View More
                              </Button>
                            </Skeleton>
                          </Card>
                        </Col>
                      );
                    })
                  ) : (
                    <Skeleton active loading={loading}>
                      <Result
                        style={{ marginLeft: "40%" }}
                        status="404"
                        title="No Data"
                        subTitle="Sorry, No jobs found."
                      />
                    </Skeleton>
                  )}
                </Row>
              </Col>
            </div>
          </Content>
          <Drawer
            footer={false}
            width={700}
            title="Job Details"
            visible={viewMore}
          >
            <Row>
              <Col span={9}>&nbsp;</Col>
              <Col span={6}>
                <Button size="large" type="danger" block onClick={handleClose}>
                  Apply Later
                </Button>
              </Col>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Col span={6}>
                <Popconfirm
                  placement="topRight"
                  title="Please Complete your profile"
                  onConfirm={onConfirm}
                  disabled={checkName !== "null" ? true : false}
                  okText="Complete now"
                  cancelText={false}
                >
                  <Button
                    type="primary"
                    size="large"
                    block
                    onClick={checkName === "null" ? "" : onFinish}
                  >
                    Apply Now
                  </Button>
                </Popconfirm>
              </Col>
            </Row>
            <br />
            <br />
            <Row>
              <Col span={7}>
                <p className="resume">Role</p>
              </Col>
              <Col span={7}>
                <p>{_.get(modalDatas, "[0].role", "")}</p>
              </Col>
            </Row>
            <br />
            <br />
            <Row>
              <Col span={7}>
                <p className="resume">Experience</p>
              </Col>
              <Col span={7}>
                <p>
                  {_.get(modalDatas, "[0].expFrom", "")} to{" "}
                  {_.get(modalDatas, "[0].expTo", "")}
                </p>
              </Col>
            </Row>

            <br />

            <Row>
              <Col span={7}>
                <p className="resume">Salary</p>
              </Col>
              <Col span={7}>
                <p>
                  ₹{_.get(modalDatas, "[0].salaryFrom", "")} to ₹
                  {_.get(modalDatas, "[0].salaryTo", "")}
                </p>
              </Col>
            </Row>

            <br />

            <Row>
              <Col span={7}>
                <p className="resume">Job Description</p>
              </Col>
              <Col span={7}>
                <p>{_.get(modalDatas, "[0].description", "")}</p>
              </Col>
            </Row>
            <br />
            <br />
            <Row>
              <Col span={7}>
                <p className="resume">Skills Required</p>
              </Col>
              <Col span={7}>
                <p>
                  {_.get(modalDatas, "[0].Skills", []).map((res) => (
                    <>
                      <Tag color="green">{res.value}</Tag>
                      <br />
                    </>
                  ))}
                </p>
              </Col>
            </Row>
            <br />
            <br />
            <Row>
              <Col span={7}>
                <p className="resume">Company Name</p>
              </Col>
              <Col span={7}>{_.get(modalDatas, "[0].users[0].name", "")}</Col>
            </Row>
            <br />
            <br />
            <Row>
              <Col span={7}>
                <p className="resume">Company Details</p>
              </Col>
              <Col span={7}>
                <p
                  dangerouslySetInnerHTML={{
                    __html: _.get(modalDatas, "[0].users[0].aboutme", ""),
                  }}
                />
              </Col>
            </Row>
            <br />
            <br />
            <Row>
              <Col span={7}>
                <p className="resume">Company Address</p>
              </Col>
              <Col span={7}>
                {_.get(modalDatas, "[0].users[0].address", "")}
              </Col>
            </Row>
          </Drawer>
        </Layout>

        <Modal visible={openTest} footer={false} width={700}>
          <div style={{ float: "right" }}>
            {testLength === 0 ? (
              <Button onClick={() => validateScore()}>Finish</Button>
            ) : (
              <Button onClick={() => setTestLength(testLength - 1)}>
                Next
              </Button>
            )}
          </div>

          {
            <>
              <h1>{_.get(testQuestions, `[${testLength}][1]`, "")}</h1>
              <Radio.Group
                key={_.get(testQuestions, `[${testLength}][1]`, "")}
                onChange={(e) => {
                  testScore[testLength] =
                    e.target.value ===
                    _.get(testQuestions, `[${testLength}][6]`, "")
                      ? 1
                      : 0;
                }}
              >
                <Space direction="vertical">
                  <Radio value={_.get(testQuestions, `[${testLength}][2]`, "")}>
                    <h3> {_.get(testQuestions, `[${testLength}][2]`, "")}</h3>
                  </Radio>

                  <Radio value={_.get(testQuestions, `[${testLength}][3]`, "")}>
                    <h3> {_.get(testQuestions, `[${testLength}][3]`, "")}</h3>
                  </Radio>
                  <Radio value={_.get(testQuestions, `[${testLength}][4]`, "")}>
                    <h3> {_.get(testQuestions, `[${testLength}][4]`, "")}</h3>
                  </Radio>
                  <Radio value={_.get(testQuestions, `[${testLength}][5]`, "")}>
                    <h3> {_.get(testQuestions, `[${testLength}][5]`, "")}</h3>
                  </Radio>
                </Space>
              </Radio.Group>
            </>
          }
        </Modal>
      </div>
     
      <Modal visible={badLuck} footer={false}>
        <Result
          status="error"
          title="You haven't passed the test."
          subTitle="“Do not be embarrassed by your failures, learn from them and start again. ”"
          extra={[
            <Button type="primary" onClick={() => setBadLuck(false)}>
              go back
            </Button>,
          ]}
        ></Result>
      </Modal>
      <Modal visible={goodLuck} footer={false}>
        <Result
          status="success"
          title="You have passed the test."
          extra={[
            <Button onClick={() => setGoodLuck(false)} type="primary">
              go back
            </Button>,
          ]}
        ></Result>
      </Modal>
    </>
  );
};

export default Applyjobs;
