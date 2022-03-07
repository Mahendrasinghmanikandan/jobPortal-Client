import React, { useState, useEffect } from "react";
import { notification, Layout, Card, Row, Col } from "antd";

import axios from "axios";
import _ from "lodash";

const { Header, Content } = Layout;
const { Meta } = Card;
const Company = () => {
  const [candidate, setCandidate] = useState([]);
  const status = "hr";
  useEffect(() => {
    axios
      .get(`http://localhost:8000/users/get-candidate/${status}`)
      .then((data) => {
        console.log(_.get(data, "data", []));
        setCandidate(_.get(data, "data", []));
      })
      .catch(() => {
        notification.error({ message: "something went wrong" });
      });
  }, []);

  return (
    <div>
      <Layout className="site-layout" style={{ marginLeft: 200 }}>
        <Header className="site-layout-background" style={{ padding: 0 }}>
          search
        </Header>
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, textAlign: "center" }}
          >
            <Row gutter={16}>
              {candidate &&
                candidate.map((res) => {
                  return (
                    <Col span={5}>
                      <Card
                        hoverable
                        style={{ width: 240, marginBottom: "20px" }}
                        cover={
                          <img
                            alt={_.get(res, "name", "")}
                            height={200}
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSQ2Af_rrXmQCjMtH8v_EMB6MyZdpx4IZZ-w&usqp=CAU"
                          />
                        }
                      >
                        <Meta
                          title={_.get(res, "name", "")}
                          description={_.get(res, "role", "")}
                        />
                      </Card>
                    </Col>
                  );
                })}
            </Row>
          </div>
        </Content>
      </Layout>
    </div>
  );
};

export default Company;
