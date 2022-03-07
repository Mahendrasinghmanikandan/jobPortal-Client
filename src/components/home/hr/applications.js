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
  Select,
  Dropdown,
} from "antd";
import axios from "axios";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import _ from "lodash";

const { Option } = Select;

const Applications = (properties) => {
  const { currentDrawer, setCurrentDrawer, currentJobId, setCurrentJobId } =
    properties;
  const [uploadVisible, setuploadVisible] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const [readMoreData, setReadMoreData] = useState();
  const [resmueData, setResmueData] = useState();
  const [hsc, setHsc] = useState(0);
  const [resumeMark, setResumeMark] = useState(0);
  const [sslc, setSslc] = useState(0);
  const [ug, setUg] = useState(0);
  const [form] = Form.useForm();

  const fetchData = () => {
    setLoading(true);
    axios
      .get(
        `http://localhost:8000/application/getall/${currentJobId}/${hsc}/${sslc}/${ug}/${resumeMark}`
      )
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hsc, sslc, ug, resumeMark]);
  const onChangesStatus = (id,data)=>{
  const formData = {
      status: data,
      id: id,
    };    
    axios
      .put("http://localhost:8000/application/update", formData)
      .then(() => {
        notification.success({ message: "The Status Sended Successfully" });        
        fetchData();
      })
      .catch(() => {
        notification.error({ message: "something went wrong" });
        fetchData();
      });
}
  const handleViewResume = (data) => {
    setResmueData(data);
    setuploadVisible(true);
  };

  const jobColumns = [
    {
      title: "Name",
      dataIndex: "user",
      key: "Name",
      render: (data) => {
        return <span>{data.name}</span>;
      },
    },
    {
      title: "skills",
      dataIndex: "user",
      key: "skills",
      render: (data) => {
        return <span>{data.skills}</span>;
      },
    },
    {
      title: "Email",
      dataIndex: "user",
      key: "email",
      render: (data) => {
        return <span>{data.email}</span>;
      },
    },
    {
      title: "Phone",
      dataIndex: "user",
      key: "phone",
      render: (data) => {
        return <span>{data.phone}</span>;
      },
    },
    {
      title: "Address",
      dataIndex: "user",
      key: "address",
      render: (data) => {
        return <span>{data.address}</span>;
      },
    },
    {
      title: "Role",
      dataIndex: "user",
      key: "role",
      render: (data) => {
        return <span>{data.role}</span>;
      },
    },
    {
      title: "Resume Score",
      dataIndex: "resume_mark",
      key: "mark_r",
      render: (data) => {
        return <span>{data}%</span>;
      },
    },
    // {
    //   title: "UG %",
    //   dataIndex: "user",
    //   key: "ug",
    //   render: (data) => {
    //     return <span>{data.ug}%</span>;
    //   },
    // },

    // {
    //   title: "HSC %",
    //   dataIndex: "user",
    //   key: "hsc",
    //   render: (data) => {
    //     return <span>{data.hsc}%</span>;
    //   },
    // },

    // {
    //   title: "SSLC %",
    //   dataIndex: "user",
    //   key: "sslc",
    //   render: (data) => {
    //     return <span>{data.sslc}%</span>;
    //   },
    // },
    {
      title: "Resume",
      dataIndex: "user",
      key: "resume",
      render: (data) => {
        return (
          <span>
            <EyeOutlined
              style={{ cursor: "pointer", color: "rgba(255, 8, 179, 0.52)" }}
              onClick={() => handleViewResume(data)}
            />
          </span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (data,items) => {
        return (
          <Space>
            {_.get(items, "status", "") ? (
              <Tag color={_.get(items, "status", "") === "Selected" ? "green" : "red" }>
{_.get(items, "status", "")}
              </Tag>
              
            ) : (
              <>
                <Button onClick={()=>{onChangesStatus(_.get(items, "id", ""),"Selected")}} style={{ color: "green" }}>Select</Button>
                <Button onClick={()=>{onChangesStatus(_.get(items, "id", ""),"Rejected")}} style={{ color: "red" }}>Reject</Button>
              </>
            )}
          </Space>
        );
      },
    },
    {
      title: "About Me",
      dataIndex: "user",
      key: "about_me",

      render: (data) => {
        return (
          <span>
            <p
              className="about-me"
              dangerouslySetInnerHTML={{
                __html:
                  _.get(data, "aboutme", "") &&
                  _.get(data, "aboutme", "").slice(0, 20),
              }}
            />
            <i
              style={{ cursor: "pointer" }}
              onClick={() => {
                handleReadMore(data);
              }}
            >
              Read More...
            </i>
          </span>
        );
      },
    },
  ];
  console.log(readMoreData, "readMoreData");
  const handleReadMore = (data) => {
    if (data) {
      setReadMore(!readMore);
      setReadMoreData(data);
    } else {
      setReadMore(!readMore);
      setReadMoreData([]);
    }
  };
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
  };
  return (
    <div>
      <div>
        <Space>
          <b className="filters">Resume Mark</b>
          <Select
            size="large"
            defaultValue={resumeMark || "No Filter"}
            style={{ width: 120 }}
            onChange={(value) => {
              setResumeMark(value);
            }}
          >
            <Option value="30">&gt;30</Option>
            <Option value="50">&gt;50</Option>
            <Option value="80">&gt;80</Option>
            <Option value="0" className="red-color">
              clear filter
            </Option>
          </Select>
          </Space>
        {/* <Space>
          <b className="filters">HSC</b>
          <Select
            size="large"
            defaultValue={hsc || "HSC %"}
            style={{ width: 120 }}
            onChange={(value) => {
              setHsc(value);
            }}
          >
            <Option value="30">&gt;30</Option>
            <Option value="50">&gt;50</Option>
            <Option value="80">&gt;80</Option>
            <Option value="0" className="red-color">
              clear filter
            </Option>
          </Select>
          <b className="filters">SSLC</b>
          <Select
            size="large"
            defaultValue={sslc || "SSLC %"}
            style={{ width: 120 }}
            onChange={(value) => {
              setSslc(value);
            }}
          >
            <Option value="30">&gt;30</Option>
            <Option value="50">&gt;50</Option>
            <Option value="80">&gt;80</Option>
            <Option value="0" className="red-color">
              clear filter
            </Option>
          </Select>
          <b className="filters">UG</b>
          <Select
            size="large"
            defaultValue={ug || "UG %"}
            style={{ width: 120 }}
            onChange={(value) => {
              setUg(value);
            }}
          >
            <Option value="30">&gt;30</Option>
            <Option value="50">&gt;50</Option>
            <Option value="80">&gt;80</Option>
            <Option value="0" className="red-color">
              clear filter
            </Option>
          </Select>
          <b className="filters">Role</b>
          <Select size="large" defaultValue="Role" style={{ width: 120 }}>
            <Option value="JavaScript Developer">JavaScript Developer</Option>
            <Option value="50">&gt;50</Option>
            <Option value="80">&gt;80</Option>
          </Select>
        </Space> */}
      </div>
      <br />
      <br />
      <br />
      <br />
      <Card>
        <Skeleton loading={loading}>
          <Table
            rowKey={(key) => key.user_id}
            pagination={{ position: ["topRight "] }}
            scroll={{ x: 300 }}
            columns={jobColumns}
            dataSource={jobs}
            rowSelection={rowSelection}
          />
        </Skeleton>
      </Card>
      <Modal visible={readMore} footer={false}>
        <span>
          <i
            style={{ cursor: "pointer", float: "right" }}
            onClick={() => {
              handleReadMore();
            }}
          >
            Close
          </i>
          <br />
          <br />
          <span
            dangerouslySetInnerHTML={{
              __html:
                _.get(readMoreData, "aboutme", "") &&
                _.get(readMoreData, "aboutme", "").slice(
                  0,
                  readMore
                    ? _.get(readMoreData, "aboutme", "") &&
                        _.get(readMoreData, "aboutme", "").length
                    : 20
                ),
            }}
          />
        </span>
      </Modal>
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
          src={"uploads/" + _.get(resmueData, "resume", "")}
          height="900"
          width="900"
          title="Iframe Example"
        ></iframe>
      </Modal>
    </div>
  );
};

export default Applications;
