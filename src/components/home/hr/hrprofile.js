import React, { useState, useEffect } from "react";
import { Row, Col, Card, notification, Button, Table, Skeleton } from "antd";
import "../personal.css";
import { EditOutlined } from "@ant-design/icons";
import DrawerProfile from "../drawerProfile";
import axios from "axios";
import _ from "lodash";

const HrProfile = () => {
  const [visible, setEditVisible] = useState(false);
  const [userData, setUserData] = useState([]);
  const [filterSkills, setFilterSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchData = () => {
    setLoading(true);
    const id = localStorage.getItem("id");
    axios
      .get(
        `http://localhost:8000/users/find-one/${id}/${
          localStorage.getItem("name") === "null" ? "new" : "notnew"
        }`
      )
      .then((data) => {
        setUserData(_.get(data, "data", []));
        setFilterSkills(_.get(data, "data.Skills", []));
        setLoading(false);
      })
      .catch(() => {
        notification.error({ message: "something went wrong" });
      });
  };

  useEffect(() => {
    fetchData();
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
                      : "Company Name"}
                  </span>
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

            <Row>
              <Col span={24}>
                <Card>
                  <Skeleton active loading={loading}>
                    <i className="resume-name">About my Company</i>
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
                        "Company Details"
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
                    <i className="resume-name"> Technology Used</i>
                    <br />

                    <br />
                    <br />
                    <p className="leftAligh">
                      {!_.isEmpty(_.get(userData, "Skills", [])) ? (
                        <Table
                          columns={columns}
                          showHeader={false}
                          dataSource={filterSkills}
                        ></Table>
                      ) : (
                        "Technology Details"
                      )}
                    </p>
                  </Skeleton>
                </Card>
              </Col>
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
                          : "Company Address"}
                      </p>
                      <br />
                      <br />
                      <p className="leftAligh">
                        <b>Phone</b>&nbsp;&nbsp;
                        {_.get(userData, "phone", "")
                          ? _.get(userData, "phone", "")
                          : "Company Contact Details"}
                      </p>{" "}
                      <br />
                      <br />
                      <p className="leftAligh">
                        <b>Email</b>&nbsp;&nbsp;
                        {_.get(userData, "email", "")
                          ? _.get(userData, "email", "")
                          : "COmpany Valid Email Address"}
                      </p>
                    </p>
                  </Skeleton>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </b>
    </div>
  );
};

export default HrProfile;
