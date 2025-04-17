import React, { useEffect, useState } from "react";
import {
  Layout,
  Table,
  Spin,
  Image,
  notification,
} from "antd";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../ax";
import Sider from "../../component/SideBar";
import Header from "../../component/Header";
import BreadcrumbComponent from "../../component/Breadcrumb";
const { Content } = Layout;

const UserTable = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }

    axiosInstance
      .get("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUserData(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
      });
  }, [navigate]);

  // Handle Delete User
  const handleDelete = (userId) => {
    const token = localStorage.getItem("token");
    axiosInstance
      .delete(`/api/delete/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Remove the deleted user from the state
        setUserData(userData.filter((user) => user.id !== userId));

        // Show success notification
        notification.success({
          message: "User Deleted",
          description: "The user has been successfully deleted.",
          placement: "topRight",
        });
      })
      .catch((error) => {
        console.error("Error deleting user:", error);

        // Show error notification
        notification.error({
          message: "Error",
          description: "There was an error deleting the user.",
          placement: "topRight",
        });
      });
  };

  // Kolom untuk Tabel
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Profile Image",
      dataIndex: "imageProfile",
      key: "imageProfile",
      render: (e) => (
        <Image
          src={`https://shineskin.hotelmarisrangkas.com/profile/${e}`}
          width={80}
          height={80}
          alt=""
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div className="flex gap-1">
          <button
            style={{
              backgroundColor: "red",
              color: "white",
              border: "none",
              padding: "5px 10px",
              marginRight: "5px",
              cursor: "pointer",
              borderRadius: "5px",
            }}
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider />
      <Layout className="site-layout">
        <Header />
        <Content
          style={{
            margin: "16px",
            padding: 24,
            minHeight: 280,
          }}
        >
          <BreadcrumbComponent />
          <div>
            {loading ? (
              <Spin size="large" />
            ) : (
              <Table
                dataSource={userData}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 5 }}
              />
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserTable;
