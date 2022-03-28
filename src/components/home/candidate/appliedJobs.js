import React, { useState, useEffect } from "react";
import {
  notification,
  Layout,
  Col,
  Table,
  Skeleton,
  Result,
  Tag,
} from "antd";
import axios from "axios";

import _ from "lodash";
const { Content } = Layout;

const Appliedjobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const roleId = localStorage.getItem("id");

  const fetchData = () => {
    setLoading(true);
    axios
      .get(`http://localhost:8000/application/candidate/${roleId}`)
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

  const jobColumns = [
    {
      title: "Job id",
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
        return <span>{data}</span>;
      },
    },
    {
      title: "Skills Required",
      key: "skills",
      render: (data) => {
        return (
          <i>
            {_.get(data, "Skills", []).map((res) => (
              <>
                <Tag color="cyan">{res.value}</Tag>
                <br />
              </>
            ))}
          </i>
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
      title: "Company Name",
      dataIndex: "users",
      key: "company_name",
      render: (data) => {
        return <pre className="table-td">{_.get(data, "[0].name", "")}</pre>;
      },
    },
    {
      title: "Status",
      dataIndex: "applications",
      key: "company_name",
      render: (data, items) => {
        return (
          <>
            {_.get(data, "[0].status", "") ? (
              <Tag
                size="small"
                color={
                  _.get(data, "[0].status", "") === "Selected" ? "green" : "red"
                }
              >
                {_.get(data, "[0].status", "") === "Selected"
                  ? "Short Listed"
                  : "Rejected"}
              </Tag>
            ) : (
              <>
                <Tag size="small" color="rgba(255, 8, 179, 0.52)">
                  in progress
                </Tag>
              </>
            )}
          </>
        );
      },
    },
  ];
  return (
    <div>
      <Layout className="site-layout" style={{ marginLeft: 200 }}>
        <Content>
          <div
            className="site-layout-background"
            style={{ padding: 24, textAlign: "center" }}
          >
            <Col span={24}>
              <Skeleton loading={loading}>
                {!_.isEmpty(jobs) ? (
                  <Table
                    loading={loading}
                    pagination={{ position: ["topRight "] }}
                    layout="fixed"
                    columns={jobColumns}
                    dataSource={jobs}
                    scroll={{ x: 300 }}
                  />
                ) : (
                  <Result
                    status="404"
                    title="No Data"
                    subTitle="Sorry, you didn't applied any jobs"
                  />
                )}
              </Skeleton>
            </Col>
          </div>
        </Content>
      </Layout>
    </div>
  );
};

export default Appliedjobs;
