import React from "react";
import { Layout } from "antd";
import Personal from "./Personal";
import HrProfile from "./hr/hrprofile";

const { Header, Content } = Layout;

const Home = () => {
  const status = localStorage.getItem("status");
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
            {status==="candidate"? <Personal/> : <HrProfile/>}            
          </div>
        </Content>
      </Layout>
    </div>
  );
};

export default Home;
