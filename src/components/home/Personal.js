import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  notification,
  Button,
  Modal,
  Card,
  Table,
  Skeleton,
} from "antd";
import "./personal.css";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import DrawerProfile from "./drawerProfile";
import axios from "axios";
import _ from "lodash";

const Personal = () => {
  const [visible, setEditVisible] = useState(false);
  const [uploadVisible, setuploadVisible] = useState(false);
  const [userData, setUserData] = useState([]);
  const [filterSkills, setFilterSkills] = useState([]);
  const id = localStorage.getItem("id");
  const checkName = localStorage.getItem("name");
  const [loading, setLoading] = useState(false);
  const fetchData = () => {
    setLoading(true);
    axios
      .get(
        `http://localhost:8000/users/find-one/${id}/${
          localStorage.getItem("name") !== "null" ? "notnew" : "new"
        }`
      )
      .then((data) => {
        setLoading(false);
        setUserData(_.get(data, "data", []));
        setFilterSkills(_.get(data, "data.Skills", []));
      })
      .catch(() => {
        notification.error({ message: "something went wrong" });
      });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const columns = [
    {
      dataIndex: "value",
      key: "value",
      render: (data) => {
        return <span>{data}</span>;
      },
    },
  ];
  return (
    <div>
      <b>
        <Row>
          <Col span={24}>
            <Card>
              <Skeleton active loading={loading}>
                <div>
                  <br />
                  <br />
                  <span className="resume-name">
                    {_.get(userData, "name", "")
                      ? _.get(userData, "name", "")
                      : "My name"}
                  </span>
                  <p>
                    {_.get(userData, "role", "")
                      ? _.get(userData, "role", "")
                      : "My role "}
                  </p>
                </div>
                <p style={{ float: "right" }}>
                  <Button
                    type="danger"
                    onClick={() => {
                      setEditVisible(true);
                    }}
                  >
                    <EditOutlined style={{ color: "green" }} />
                    Edit Details
                  </Button>
                  &nbsp;&nbsp;
                  {checkName !== "null" && (
                    <Button
                      type="danger"
                      onClick={() => {
                        setuploadVisible(true);
                      }}
                    >
                      <EyeOutlined style={{ color: "green" }} />
                      View Resume
                    </Button>
                  )}
                  {visible && (
                    <DrawerProfile
                      visibles={true}
                      userData={userData}
                      fetchData={fetchData}
                      setEditVisible={setEditVisible}
                    />
                  )}
                </p>
              </Skeleton>
            </Card>

            <br />

            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card>
                  <Skeleton active loading={loading}>
                    <i className="resume-name"> About me</i>
                    <br />

                    <br />
                    <br />

                    <p style={{ textAlign: "justify" }}>
                      {_.get(userData, "aboutme", "") ? (
                        <p
                          dangerouslySetInnerHTML={{
                            __html: _.get(userData, "aboutme", ""),
                          }}
                        />
                      ) : (
                        "My Experiences"
                      )}
                    </p>
                  </Skeleton>
                </Card>
              </Col>
            </Row>

            <br />

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card>
                  <Skeleton active loading={loading}>
                    <i className="resume-name"> How to reach me</i>
                    <br />
                    <br />
                    <br />

                    <p>
                      <p className="leftAligh">
                        <b>Address</b>&nbsp;&nbsp;
                        {_.get(userData, "address", "")
                          ? _.get(userData, "address", "")
                          : "My Address"}
                      </p>
                      <br />
                      <br />
                      <p className="leftAligh">
                        <b>Phone</b>&nbsp;&nbsp;
                        {_.get(userData, "phone", "")
                          ? _.get(userData, "phone", "")
                          : "Contact Details"}
                      </p>{" "}
                      <br />
                      <br />
                      <p className="leftAligh">
                        <b>Email</b>&nbsp;&nbsp;
                        {_.get(userData, "email", "")
                          ? _.get(userData, "email", "")
                          : "valid email address"}
                      </p>
                    </p>
                  </Skeleton>
                </Card>
              </Col>

              <Col span={12}>
                <Card>
                  <Skeleton active loading={loading}>
                    <i className="resume-name"> Education Scores</i>
                    <br />
                    <br />
                    <br />
                    <p>
                      <p className="leftAligh">
                        <b>UG</b>&nbsp;&nbsp;
                        {_.get(userData, "ug", "")
                          ? _.get(userData, "ug", "")
                          : "UG Details"}
                        %
                      </p>
                      <br />
                      <br />
                      <p className="leftAligh">
                        <b>HSC</b>&nbsp;&nbsp;
                        {_.get(userData, "hsc", "")
                          ? _.get(userData, "hsc", "")
                          : "HSC Details "}
                        %
                      </p>
                      <br />
                      <br />
                      <p className="leftAligh">
                        <b>SSLC</b>&nbsp;&nbsp;
                        {_.get(userData, "sslc", "")
                          ? _.get(userData, "sslc", "")
                          : "SSLC Details"}
                        %
                      </p>
                    </p>
                  </Skeleton>
                </Card>
              </Col>
            </Row>
            <br />
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card>
                  <Skeleton active loading={loading}>
                    <i className="resume-name"> Skills</i>
                    <br />

                    <br />
                    <br />
                    <p>
                      {!_.isEmpty(_.get(userData, "Skills", [])) ? (
                        <Table
                          columns={columns}
                          showHeader={false}
                          dataSource={filterSkills}
                        ></Table>
                      ) : (
                        "skills Details "
                      )}
                    </p>
                  </Skeleton>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </b>
      <Modal
        className="invoice-modal"
        visible={uploadVisible}
        footer={null}
        onCancel={() => {
          setuploadVisible(false);
        }}
        width={1000}
        height={1000}
      >
        <iframe
          src={"uploads/" + _.get(userData, "resume", "")}
          height="900"
          width="900"
          title="Iframe Example"
        ></iframe>
      </Modal>
    </div>
  );
};

export default Personal;
