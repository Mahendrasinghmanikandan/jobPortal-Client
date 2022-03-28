import React, { useState, useEffect } from "react";
import { Layout, Menu, Avatar, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import _ from "lodash";

import {
  //   AppstoreOutlined,

} from "@ant-design/icons";
import { menus } from "../layout/menu";
const { Sider } = Layout;

const Home = () => {
  const [menuData, setMenuData] = useState(menus);
  const status = localStorage.getItem("status");
  const email = localStorage.getItem("email");
  const profile = localStorage.getItem("profile");
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const menu = menuData.filter(
      (res) => res.allow !== (status === "candidate" ? "candidate" : "hr")
    );    
    setMenuData(menu);
    const id = localStorage.getItem("id");

    axios
      .get(`http://localhost:8000/users/find-one/${id}/new`)
      .then((data) => {
        setUserData(_.get(data, "data", []));
      })
      .catch(() => {
        notification.error({ message: "something went wrong" });
      });
  }, []);

  return (
    <div>
      <Layout hasSider>
        <Sider
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <div className="logo">
            <Avatar
              size={64}
              src={_.get(userData, "profilePic", "") && 'uploads/'+_.get(userData, "profilePic", "")}
            >
              {!_.get(userData, "profilePic", "")? email?email.charAt(0).toLocaleUpperCase():'' : null}
            </Avatar>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={window.location.pathname.split("/")[1]}
          >
            {menuData &&
              menuData.map((menu) => (
                <Menu.Item key={menu.key} icon={menu.icon}>
                  <Link to={menu.linkHref}>{menu.name}</Link>
                </Menu.Item>
              ))}
          </Menu>
        </Sider>
      </Layout>
    </div>
  );
};

export default Home;
