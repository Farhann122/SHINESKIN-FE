import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../component/Header";
import Sider from "../../component/SideBar";
import BreadcrumbComponent from "../../component/Breadcrumb";
import { Button, Image, Layout, notification, Modal, Table, Form, Input, Upload } from "antd";
import { Content } from "antd/es/layout/layout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../ax";

const CategoryAdmin = () => {
  const [category, setCategory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      try {
        const response = await axiosInstance.get("/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.data) {
          setCategory(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        notification.error({
          message: "Failed to Fetch Categories",
          description: error.response?.data?.message || "Something went wrong",
        });
      }
    };

    fetchInitialData();
  }, [navigate]);

  const handleAddCategory = async (values) => {
    const token = localStorage.getItem("token");

    if (!token) {
      notification.error({
        message: "Session Expired",
        description: "Please log in again",
      });
      return;
    }

    try {
      const formData = createFormData(values);

      const response = await axiosInstance.post("/api/category", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201 && response.data?.category) {
        notification.success({ message: "Category Added Successfully" });
        setCategory((prevCategory) => [...prevCategory, response.data.category]);
        setModalVisible(false);
        form.resetFields();
      } else {
        notification.error({
          message: "Failed to Add Category",
          description: "Please try again",
        });
      }
    } catch (error) {
      console.error("Error adding category:", error);
      notification.error({
        message: "Failed to Add Category",
        description: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  const createFormData = (values) => {
    const formData = new FormData();
    formData.append("name", values.name.trim());
    formData.append("description", values.description.trim());

    if (values.imageCategory && values.imageCategory.fileList?.[0]) {
      formData.append("imageCategory", values.imageCategory.fileList[0].originFileObj);
    }

    return formData;
  };

  const handleDeleteCategory = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      notification.error({
        message: "Session Expired",
        description: "Please log in again",
      });
      return;
    }

    try {
      const response = await axiosInstance.delete(`/api/delete/category/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        notification.success({ message: "Category Deleted Successfully" });
        setCategory((prevCategory) => prevCategory.filter((category) => category.id !== id));
      } else {
        notification.error({
          message: "Failed to Delete Category",
          description: "Please try again",
        });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      notification.error({
        message: "Failed to Delete Category",
        description: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Category Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Image Category",
      dataIndex: "imageCategory",
      key: "imageCategory",
      render: (imageCategory) => (
        <Image
          width={100}
          src={`http://localhost:3888/public/${imageCategory}`}
          alt="image"
          style={{ objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <Button type="primary" danger onClick={() => handleDeleteCategory(record.id)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider />
        <Layout>
          <Header />
          <Content style={{ margin: "16px", padding: 24, background: "#fff" }}>
            <BreadcrumbComponent />
            <div className="gap-4 flex">
              <Button type="primary" onClick={() => setModalVisible(true)}>
                Add Category
              </Button>
            </div>
            <Table dataSource={category} columns={columns} rowKey="_id" />
          </Content>
        </Layout>
      </Layout>

      <Modal
        title="Add Category"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          onFinish={handleAddCategory}
          initialValues={{ name: "", description: "" }}
        >
          <Form.Item
            label="Category Name"
            name="name"
            rules={[{ required: true, message: "Please enter category name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter category description!" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Category Image" name="imageCategory">
            <Upload beforeUpload={() => false} listType="picture">
              <Button>Upload Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Category
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CategoryAdmin;
