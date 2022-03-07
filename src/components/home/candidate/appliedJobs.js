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
  Result,
  Tag,
} from "antd";
import axios from "axios";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import _ from "lodash";
const { Header, Content } = Layout;

const { TextArea } = Input;

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
      title: "Company Name",
      dataIndex: "users",
      key: "company_name",
      render: (data) => {
        return <span>{_.get(data, "[0].name", "")}</span>;
      },
    },
    {
      title: "Status",
      dataIndex: "applications",
      key: "company_name",
      render: (data, items) => {
        return (
          <Space>
            {_.get(data, "[0].status", "") ? (
              <Tag color={_.get(data, "[0].status", "") === "Selected" ? "green" : "red" }>
                {_.get(data, "[0].status", "")}
              </Tag>              
            ) : (
              <>
               <Tag color="rgba(255, 8, 179, 0.52)">in progress</Tag>
              </>
            )}
          </Space>
        );
      },
    },
  ];
  return (
    <div>
      <Layout className="site-layout" style={{ marginLeft: 200 }}>
        
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, textAlign: "center" }}
          >
            <Col span={24}>
<Card>
                <Skeleton loading={loading}>
                  {!_.isEmpty(jobs) ? (
                    <Table
                      loading={loading}
                      pagination={{ position: ["topRight "] }}
                      layout="fixed"
                      columns={jobColumns}
                      dataSource={jobs}
                    />
                  ) : (
                    <Result                    
                      status="404"
                      title="No Data"
                      subTitle="Sorry, you didn't applied any jobs"
                    />
                  )}
                </Skeleton>
</Card>
            </Col>
          </div>
        </Content>
      </Layout>
    </div>
  );
};

export default Appliedjobs;
