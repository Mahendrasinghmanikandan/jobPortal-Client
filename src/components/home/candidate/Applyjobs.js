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
} from "antd";
import axios from "axios";
import { PlusOutlined } from "@ant-design/icons";
import _ from "lodash";
const { Header, Content } = Layout;

const { Meta } = Card;

const Applyjobs = () => {
  const roleId = localStorage.getItem("id");
  const [jobs, setJobs] = useState([]);
  const [modalDatas, setModalDatas] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [applyId, setApplyId] = useState(false);
  const [viewMore, setViewMore] = useState(false);

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



  const onFinish = () => {   
    const hsc = localStorage.getItem("hsc");
    const sslc = localStorage.getItem("sslc");
    const ug = localStorage.getItem("ug");
    
    const formData = {
      Jobid: _.get(modalDatas, "[0].id", ""),
      user_id: roleId,
      resume_mark: (parseInt(hsc)+parseInt(sslc)+parseInt(ug))/3,
    };    

    axios
      .post("http://localhost:8000/application/create", formData)
      .then(() => {
        notification.success({ message: "Job Applied Successfully" });
        handleClose();
        fetchData();
      })
      .catch(() => {
        notification.error({ message: "something went wrong" });
        handleClose();
        fetchData();
      });
  };

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
              {!_.isEmpty(jobs) && 
              <Button type="primary" style={{ float: "right" }}>
                <PlusOutlined /> Filter
              </Button>
                }
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
                              cover={
                                <div className="logo">
                                <Avatar
                                    size={64}
                                    src={_.get(res, "users[0].profilePic", "") && 'uploads/'+_.get(res, "users[0].profilePic", "")}
                                >
                                  {!_.get(res, "users[0].profilePic", "")? _.get(res, "users[0].email", "") ? _.get(res, "users[0].email", "").charAt(0) : '':null}
                                  </Avatar>  
                                </div>  
                              }
                            >
                              <Meta
                                title={_.get(res, "users[0].name", "")}
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
                            </Card>
                          </Col>
                        );
                      })
                    ) : (
                      <Result
                        style={{ marginLeft: "40%" }}
                        status="404"
                        title="No Data"
                        subTitle="Sorry, No jobs found."
                      />
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
              <Button
                size="large"
                type="danger"
                block
                onClick={handleClose}
              >
                Apply Later
              </Button>
            </Col>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Col span={6}>
              <Button
                type="primary"
                size="large"
                block
                onClick={onFinish}
              >
                Apply Now
              </Button>
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
                }}
              />
            </Col>
          </Row>
          <br />
          <br />
        </Drawer>
      </Layout>
    </div>
  );
};

export default Applyjobs;
