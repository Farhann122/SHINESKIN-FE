import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Input, Button, message, Spin, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axiosInstance from "../../../ax";

const EditUser = () => {
  const { userId } = useParams(); // Getting userId from URL params
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    // Fetch user data based on userId
    const token = localStorage.getItem("token");
    axiosInstance
      .get(`/api/user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser(response.data.data);
        form.setFieldsValue({
          username: response.data.data.username,
          email: response.data.data.email,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
      });
  }, [userId, form]);

  // Handle file change in the Upload component
  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // Handle form submission
  const handleSubmit = (values) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    // If there's an image file in the form, add it to formData
    if (fileList.length > 0) {
      formData.append("imageProfile", fileList[0].originFileObj);
    }
    
    formData.append("username", values.username);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("confirmPassword", values.confirmPassword);

    axiosInstance
      .put(`/api/update/user/${userId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        message.success("User updated successfully!");
        navigate("/admin/user");
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        message.error("Failed to update user.");
      });
  };

  if (loading) return <Spin size="large" />;

  return (
    <div>
      <h2>Edit User</h2>
      <Form
        form={form}
        onFinish={handleSubmit}
        initialValues={user}
        layout="vertical"
      >
        <Form.Item label="Username" name="username" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Email" name="email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Password" name="password">
          <Input.Password />
        </Form.Item>

        <Form.Item label="Confirm Password" name="confirmPassword">
          <Input.Password />
        </Form.Item>

        <Form.Item label="Profile Image" name="imageProfile">
          <Upload
            beforeUpload={() => false} // Prevent auto upload
            listType="picture"
            maxCount={1}
            fileList={fileList}
            onChange={handleFileChange}
          >
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update User
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditUser;
