import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Upload,
  Button,
  message as antMessage,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axiosInstance from "../../../ax";

const ProfileAdminModal = () => {
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/api/user");
        setUser(response.data.data);
        form.setFieldsValue({
          username: response.data.data.username || "",
          email: response.data.data.email || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [form]);

  // Handle form submission
  const handleSubmit = async (values) => {
    setIsLoading(true);
    const { username, email, password, confirmPassword, imageProfile } = values;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", username);
      formDataToSend.append("email", email);
      if (password) formDataToSend.append("password", password);
      if (confirmPassword)
        formDataToSend.append("confirmPassword", confirmPassword);

      if (imageProfile?.file) {
        formDataToSend.append("imageProfile", imageProfile.file);
      }

      const response = await axiosInstance.put(
        "/api/update/user",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      antMessage.success(response.data.message);
      setVisible(false);
    } catch (error) {
      console.error("Error updating user:", error);
      antMessage.error(
        error.response?.data?.message || "Error updating profile"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={() => setVisible(true)}>
        Edit Profile
      </Button>

      <Modal
        title="Edit Profile"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            username: user?.username || "",
            email: user?.email || "",
          }}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "The input is not a valid email!" },
            ]}
          >
            <Input />
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
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              {
                validator(_, value) {
                  if (!value || form.getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Profile Image"
            name="imageProfile"
            valuePropName="file"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList[0])}
          >
            <Upload
              listType="picture"
              beforeUpload={() => false} // Prevent automatic upload
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading} block>
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfileAdminModal;
