import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  AppstoreAddOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  PercentageOutlined,
  LogoutOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { WiDayHail } from "react-icons/wi";

const Sider = () => {
  const navigate = useNavigate();

  const items = [
    {
      key: "/admin",
      label: "Dashboard",
      icon: <DashboardOutlined />,
    },
    {
      key: "/admin/user",
      label: "User",
      icon: <UserOutlined />,
    },
    {
      key: "/admin/category",
      label: "Category",
      icon: <AppstoreAddOutlined />,
    },
    {
      key: "/admin/products",
      label: "Products",
      icon: <ShoppingOutlined />,
    },
    {
      key: "/admin/order",
      label: "Order",
      icon: <ShoppingCartOutlined />,
    },
    {
      key: "/admin/promo",
      label: "Promo",
      icon: <PercentageOutlined />,
    },
    {
      key: "/harian/transaction",
      label: "Harian Transaction",
      icon: <TransactionOutlined />,
    },
    {
      key: "/bulanan/transaction",
      label: "Bulanan Transaction",
      icon: <TransactionOutlined />,
    },
    // Add the logout item
    {
      key: "/logout",
      label: "Logout",
      icon: <LogoutOutlined />,
    },
  ];

  const handleMenuClick = (e) => {
    if (e.key === "/logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      localStorage.removeItem("user");

      console.log("Logging out...");

      navigate("/");
    } else {
      navigate(e.key);
    }
  };

  return (
    <Layout.Sider className="sidebar">
      <div className="flex items-center p-5 gap-5">
        <h1 className="text-white font-poppins">Femina Glow</h1>
        <img
          src="https://img.freepik.com/premium-vector/abstract-letter-s-gradient-colorful-logo-vector-icon-illustration_269830-1987.jpg?w=826"
          alt=""
          className="rounded-full w-20 h-20"
        />
      </div>
      <Menu
        theme="dark"
        onClick={handleMenuClick}
        defaultSelectedKeys={[location.pathname]}
        mode="inline"
        items={items}
      />
    </Layout.Sider>
  );
};

export default Sider;
