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
  Input,
  Radio,
  Space,
} from "antd";
import axios from "axios";
import { PlusOutlined } from "@ant-design/icons";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

const { Header, Content } = Layout;

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
  const checkName = localStorage.getItem("name");

  const fetchData = () => {
    setLoading(true);
    axios
      .get(`http://localhost:8000/jobs/candidate/jobs/${roleId}`)
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
  };

  const onFinish = async () => {
    setLoading(true);
    setViewMore(false);
    await axios
      .get(
        `http://localhost:8000/jobs/resume-test/${_.get(
          modalDatas,
          "[0].role",
          ""
        )}`
      )
      .then((data) => {
        setLoading(false);
        if (!_.isEmpty(_.get(data, "data.data", []))) {
          console.log(_.get(data, "data.data", []));
          setTestQuestions(_.get(data, "data.data", []));
          setTestLength(_.get(data, "data.data", []).length - 1);
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

    // const hsc = localStorage.getItem("hsc");
    // const sslc = localStorage.getItem("sslc");
    // const ug = localStorage.getItem("ug");

    // const formData = {
    //   Jobid: _.get(modalDatas, "[0].id", ""),
    //   user_id: roleId,
    //   resume_mark: (parseInt(hsc) + parseInt(sslc) + parseInt(ug)) / 3,
    // };

    // axios
    //   .post("http://localhost:8000/application/create", formData)
    //   .then(() => {
    //     notification.success({ message: "Job Applied Successfully" });
    //     handleClose();
    //     fetchData();
    //   })
    //   .catch(() => {
    //     notification.error({ message: "something went wrong" });
    //     handleClose();
    //     fetchData();
    //   });
  };
  const onConfirm = () => {
    navigation("/dashboard");
  };
  const validateScore = () => {
    setOpenTest(false);
    const finalScores = testScore.reduce((a, b) => a + b, 0);
    console.log(finalScores);
    if (finalScores > 0) {
      setGoodLuck(true);
    } else {
      setBadLuck(true);
    }
    
  }
  return (
    <><div>
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
              {!_.isEmpty(jobs) && (
                <Button type="primary" style={{ float: "right" }}>
                  <PlusOutlined /> Filter
                </Button>
              )}
              <br />
              <br />
              <Skeleton loading={loading}>
                <Row gutter={16}>
                  {!_.isEmpty(jobs) ? (
                    jobs.map((res) => {
                      return (
                        <Col span={5}>
                          <Card
                            hoverable
                            style={{ width: 240, marginBottom: "20px" }}
                            cover={<div className="logo">
                              <Avatar
                                size={64}
                                src={_.get(res, "users[0].profilePic", "") &&
                                  "uploads/" +
                                  _.get(res, "users[0].profilePic", "")}
                              >
                                {!_.get(res, "users[0].profilePic", "")
                                  ? _.get(res, "users[0].email", "")
                                    ? _.get(res, "users[0].email", "").charAt(
                                      0
                                    )
                                    : ""
                                  : null}
                              </Avatar>
                            </div>}
                          >
                            <Meta
                              title={_.get(res, "users[0].name", "")}
                              description={_.get(res, "role", "")} />
                            <br />
                            <Button
                              type="primary"
                              style={{ borderRadius: "9px" }}
                              onClick={() => handleViewMore(_.get(res, "id", ""))}
                            >
                              View More
                            </Button>
                          </Card>
                        </Col>
                      );
                    })
                  ) : (
                    <Result
                      style={{ marginLeft: "40%" }}
                      status="404"
                      title="No Data"
                      subTitle="Sorry, No jobs found." />
                  )}
                </Row>
              </Skeleton>
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
              <p>{_.get(modalDatas, "[0].experience", "")}</p>
            </Col>
          </Row>
          <br />
          <br />
          <Row>
            <Col span={7}>
              <p className="resume">Salary</p>
            </Col>
            <Col span={7}>
              <p>{_.get(modalDatas, "[0].salary", "")}</p>
            </Col>
          </Row>
          <br />
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
              <p>{_.get(modalDatas, "[0].skills", "")}</p>
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
                }} />
            </Col>
          </Row>
          <br />
          <br />
        </Drawer>

      </Layout>

      <Modal
        visible={openTest}
        footer={false}
        onCancel={() => {
          setOpenTest(false);
        } }
        width={700}
      >
        <div style={{ float: "right" }}>
          {testLength === 0 ? (
            <Button onClick={() => validateScore()}>Finish</Button>
          ) : (
            <Button onClick={() => setTestLength(testLength - 1)}>Next</Button>
          )}
        </div>

        {<>
          <h1>
            {_.get(testQuestions, `[${testLength}][1]`, "")}
          </h1>
          <Radio.Group
            key={_.get(testQuestions, `[${testLength}][1]`, "")}
            onChange={(e) => {
              testScore[testLength] = e.target.value === _.get(testQuestions, `[${testLength}][6]`, "") ? 1 : 0;

            } }
          >
            <Space direction="vertical">
              <Radio value={_.get(testQuestions, `[${testLength}][2]`, "")}>
                {_.get(testQuestions, `[${testLength}][2]`, "")}
              </Radio>
              <Radio value={_.get(testQuestions, `[${testLength}][3]`, "")}>
                {_.get(testQuestions, `[${testLength}][3]`, "")}
              </Radio>
              <Radio value={_.get(testQuestions, `[${testLength}][4]`, "")}>
                {_.get(testQuestions, `[${testLength}][4]`, "")}
              </Radio>
              <Radio value={_.get(testQuestions, `[${testLength}][5]`, "")}>
                {_.get(testQuestions, `[${testLength}][5]`, "")}
              </Radio>
            </Space>
          </Radio.Group>
        </>}
      </Modal>
    </div>
      {/* //    const [badLuck, setBadLuck] = useState(false);
      // const [goodLuck, setGoodLuck] = useState(false); */}
      <Modal visible={badLuck} footer={false}>
  <Result
    status="error"
    title="You haven't passed the test."
    subTitle="“Do not be embarrassed by your failures, learn from them and start again. ”"
    extra={[
      <Button type="primary" onClick={()=>setBadLuck(false)}>
        go back
      </Button>
    ]}
  ></Result>
      </Modal>
      <Modal visible={goodLuck} footer={false}>
  <Result
    status="success"
    title="You have passed the test."    
    extra={[
      <Button onClick={()=>setGoodLuck(false)} type="primary">
        go back
      </Button>
    ]}
  ></Result>
      </Modal>
    </>
  );
  
};

export default Applyjobs;
