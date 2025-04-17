import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axiosInstance from "../../ax";

const ProfileUserModal = ({ isOpen, onClose, imageProfile, userId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    imageProfile: null,
  });

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`/api/user/${userId}`);
        const data = response.data.data;
        setUserData({
          username: data.username || "",
          email: data.email || "",
          password: "",
          imageProfile: null,
        });
        form.setFieldsValue({
          name: data.username,
          email: data.email,
          password: "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        message.error("Failed to fetch user data.");
      }
    };

    if (isOpen) fetchUserData();
  }, [isOpen, userId, form]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle file change for profile picture
  const handleFileChange = (info) => {
    if (info.file && info.file.originFileObj) {
      setUserData((prevState) => ({
        ...prevState,
        imageProfile: info.file.originFileObj,
      }));
    }
  };

  // Handle form submit
  const handleSave = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("username", values.name);
    formData.append("email", values.email);
    if (values.password) formData.append("password", values.password);
    if (userData.imageProfile)
      formData.append("imageProfile", userData.imageProfile);

    try {
      await axiosInstance.put(`/api/user/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Profile updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Profile"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={500}
    >
      <Form
        form={form}
        onFinish={handleSave}
        layout="vertical"
        initialValues={userData}
      >
        <div className="flex justify-center mb-4">
          <img
            src={
              imageProfile
                ? `https://shineskin.hotelmarisrangkas.com/public/${imageProduct}`
                : "https://via.placeholder.com/96"
            }
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>

        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email address" },
          ]}
        >
          <Input type="email" placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              min: 6,
              message: "Password must be at least 6 characters long",
            },
          ]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item label="Profile Picture">
          <Upload
            name="file"
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleFileChange}
          >
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>

        <div className="flex justify-end gap-4">
          <Button onClick={onClose} className="bg-gray-300 text-black">
            Close
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save Changes
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ProfileUserModal;
