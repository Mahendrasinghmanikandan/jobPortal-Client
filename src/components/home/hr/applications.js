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
  Image,
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
  const onChangesStatus = (id, data) => {
    setLoading(true);
    const email = localStorage.getItem("email");
    const name = localStorage.getItem("name");
    const formData = {
      status: data,
      id: id,
      recever_email: _.get(jobs, "[0].user.email", ""),
      sender_email: email,
      job_id: _.get(jobs, "[0].Jobid", ""),
      textColor: data === "Selected" ? "green" : "red",
      heading:
        data === "Selected"
          ? `${name} Team Hr Liked Your Profile`
          : `${name} Team Hr replied to Your  Application`,
      content:
        data === "Selected"
          ? `Hi ${_.get(
              jobs,
              "[0].user.name",
              ""
            )} we ShortListed Your Profile For The Next Round our HR Will Contact you soon.. `
          : `Hi ${_.get(
              jobs,
              "[0].user.name",
              ""
            )} First Thankyou For Applying this job.. We Think For Now Your Profile is Not Matched to our Requirements, but Keep touch with us.. we will post more jobs like this soon..,`,
    };

    axios
      .put("http://localhost:8000/application/update", formData)
      .then(() => {
        notification.success({ message: "The Status Sended Successfully" });
        fetchData();
        setLoading(true);
      })
      .catch(() => {
        notification.error({ message: "something went wrong" });
        fetchData();
        setLoading(false);
      });
  };
  const handleViewResume = (data) => {
    setResmueData(data);
    setuploadVisible(true);
  };

  const jobColumns = [
    {
      title: "Candidate Id",
      dataIndex: "user",
      key: "id",
      render: (data) => {
        return <span>{_.get(data, "id", "")}</span>;
      },
    },
    {
      title: "Profile",
      dataIndex: "user",
      key: "Profile",
      render: (data) => {
        return (
          <span>
            <Image
              style={{ borderRadius: "9px" }}
              src={
                _.get(data, "profilePic", "") &&
                "uploads/" + _.get(data, "profilePic", "")
              }
              width={75}
            />
          </span>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "user",
      key: "Name",
      render: (data) => {
        return <span>{data.name}</span>;
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
      render: (data, items) => {
        return (
          <Space>
            {_.get(items, "status", "") ? (
              <Tag
                color={
                  _.get(items, "status", "") === "Selected" ? "green" : "red"
                }
              >
                {_.get(items, "status", "") === "Selected"
                  ? "Short Listed"
                  : "Rejected"}
              </Tag>
            ) : (
              <>
                <Button
                  onClick={() => {
                    onChangesStatus(_.get(items, "id", ""), "Selected");
                  }}
                  style={{ color: "green" }}
                >
                  Short List
                </Button>
                <Button
                  onClick={() => {
                    onChangesStatus(_.get(items, "id", ""), "Rejected");
                  }}
                  style={{ color: "red" }}
                >
                  Reject
                </Button>
              </>
            )}
          </Space>
        );
      },
    },
    {
      title: "About Candidate",
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

  const handleReadMore = (data) => {
    if (data) {
      setReadMore(!readMore);
      setReadMoreData(data);
    } else {
      setReadMore(!readMore);
      setReadMoreData([]);
    }
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
            bordered
            rowKey={(key) => key.user_id}
            pagination={{ position: ["topRight "] }}
            scroll={{ x: 300 }}
            columns={jobColumns}
            dataSource={jobs}
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
          <h1>Skills</h1>
          {_.get(readMoreData, "Skills", []).map((res) => (
            <Tag color="green">{res.value}&nbsp;</Tag>
          ))}
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
