import React, { useState, useEffect } from "react";
import { Modal, Form, Input, InputNumber, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useForm } from "react-hook-form";
import axiosInstance from "../../ax";

const UpdateProductModal = ({ visible, onCancel, product, onUpdate }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (product) {
      setValue("name", product.name);
      setValue("description", product.description);
      setValue("price", product.price);
      setValue("stock", product.stock);
    }
  }, [product, setValue]);

  const handleFileChange = (info) => {
    if (info.file.status === "done") {
      setFile(info.file.response.filename);
    } else if (info.file.status === "error") {
      message.error("Image upload failed");
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    if (file) formData.append("image", file);

    try {
      const response = await axiosInstance.put(
        `/api/update/product/${product.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.status === "success") {
        onUpdate();
        onCancel();
        message.success("Product updated successfully");
      }
    } catch (error) {
      message.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      title="Update Product"
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form onFinish={handleSubmit(onSubmit)}>
        <Form.Item label="Name">
          <Input {...register("name")} />
        </Form.Item>

        <Form.Item label="Description">
          <Input.TextArea {...register("description")} />
        </Form.Item>

        <Form.Item label="Price">
          <InputNumber {...register("price")} min={0} />
        </Form.Item>

        <Form.Item label="Stock">
          <InputNumber {...register("stock")} min={0} />
        </Form.Item>

        <Form.Item label="Image">
          <Upload
            customRequest={handleFileChange}
            showUploadList={false}
            beforeUpload={() => false} // Disable auto upload
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Product
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateProductModal;
