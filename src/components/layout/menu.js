import {
  AppstoreOutlined,
  BuildOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
  UploadOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

export const menus = [
  {
    key: "dashboard",
    name: "Dashboard",
    linkHref: "/dashboard",
    icon: <CloudOutlined />,
  },
  // {
  //   key: "candidate",
  //   name: "Candidates",
  //   linkHref: "/candidate",
  //   icon: <UserOutlined />,
  //   allow: "candidate",
  // },
  // {
  //   key: "company",
  //   name: "Companies",
  //   linkHref: "/company",
  //   icon: <BuildOutlined />,
  //   allow: "hr",
  // },
  {
    key: "createjob",
    name: "Post Jobs",
    linkHref: "/createjob",
    icon: <UploadOutlined />,
    allow: "candidate",
  },
  {
    key: "applyjob",
    name: "Apply Jobs",
    linkHref: "/applyjob",
    icon: <UploadOutlined />,
    allow: "hr",
  },

  {
    key: "appliedjob",
    name: "Applied Jobs",
    linkHref: "/appliedjob",
    icon: <BuildOutlined />,
    allow: "hr",
  },
  //    {
  //   key: "showskills",
  //   name: "Show Skills",
  //   linkHref: "/showskills",
  //   icon: <AppstoreOutlined />,
  //   allow: "hr",
  // },
  {
    key: "2",
    name: "Logout",
    linkHref: "/logout",
    icon: <LogoutOutlined />,
  },
];
