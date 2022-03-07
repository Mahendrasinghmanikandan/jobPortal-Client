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
const {  Content } = Layout;



const ShowSkills = () => {
  
  return (
    <div>
      <Layout className="site-layout" style={{ marginLeft: 200 }}>        
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, textAlign: "center" }}
          >
            
          </div>
        </Content>
      </Layout>
    </div>
  );
};

export default ShowSkills;
