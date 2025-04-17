import React, { useState, useEffect } from "react";
import {
  Layout,
  Table,
  Spin,
  notification,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  Select,
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Header from "../../component/Header";
import BreadcrumbComponent from "../../component/Breadcrumb";
import axiosInstance from "../../../ax";
import Sider from "../../component/SideBar";

const { Content } = Layout;

const ProductAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(""); // Track modal type (add product or edit product)
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null); // Track product to edit
  const navigate = useNavigate();

  // Fetch products and categories on load
  useEffect(() => {
    const fetchInitialData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/"); // Redirect to login if no token is present
        return;
      }

      try {
        // Fetch Products
        const productResponse = await axiosInstance.get("/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (productResponse.data && productResponse.data.products) {
          setProducts(productResponse.data.products);
        } else {
          notification.error({
            message: "Error",
            description: "No products data found.",
          });
        }

        // Fetch Categories
        const categoryResponse = await axiosInstance.get("/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (categoryResponse.data && categoryResponse.data.data) {
          const categoryList = categoryResponse.data.data.map((category) => ({
            id: category.id,
            name: category.name,
          }));
          setCategories(categoryList); // Update state with filtered data
        } else {
          notification.error({
            message: "Error",
            description: "No categories data found.",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        notification.error({
          message: "Error",
          description: "Failed to fetch data.",
        });
      } finally {
        setLoadingProducts(false); // Stop loading spinner for products
        setLoadingCategories(false); // Stop loading spinner for categories
      }
    };

    fetchInitialData();
  }, [navigate]);

  // Add new product
  const handleAddProduct = async (values) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("price", values.price);
    formData.append("description", values.description);
    formData.append("stock", values.stock);
    formData.append("imageProduct", values.imageProduct[0].originFileObj);

    try {
      const response = await axiosInstance.post(
        `/api/create/product/${values.categoryId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        notification.success({
          message: "Success",
          description: response.data.message,
        });
        setProducts([...products, response.data.product]); // Add new product to state
        setModalVisible(false);
        form.resetFields();
      }
    } catch (error) {
      console.error("Error adding product:", error);
      notification.error({
        message: "Error",
        description: "Failed to add product.",
      });
    }
  };

  const formatToRupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "decimal",
      currency: "IDR",
    }).format(value);
  // Edit product
  const handleEditProduct = async (values) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("price", values.price);
    formData.append("description", values.description);
    formData.append("stock", values.stock);
    if (values.imageProduct?.[0]?.originFileObj) {
      formData.append("imageProduct", values.imageProduct[0].originFileObj);
    }

    try {
      const response = await axiosInstance.put(
        `/api/update/product/${productToEdit.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        notification.success({
          message: "Success",
          description: response.data.message,
        });

        // Update product list without page reload
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === productToEdit.id ? response.data.product : product
          )
        );

        // Close modal and reset the form
        setModalVisible(false);
        form.resetFields();
        setProductToEdit(null); // Reset the productToEdit state
      }
    } catch (error) {
      console.error("Error editing product:", error);
      notification.error({
        message: "Error",
        description: "Failed to edit product.",
      });
    }
  };

  // Delete a product
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axiosInstance.delete(`/api/delete/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      notification.success({
        message: "Product deleted successfully",
      });
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to delete product.",
      });
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `Rp. ${formatToRupiah(price)}`,
    },
    { title: "Stock", dataIndex: "stock", key: "stock" },
    {
      title: "Category",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (id) => categories.find((c) => c.id === id)?.name || "Unknown",
    },
    { title: "User", dataIndex: "userId", key: "userId" },
    {
      title: "Image",
      dataIndex: "imageProduct",
      key: "imageProduct",
      render: (imageProduct) => (
        <img
          src={`https://shineskin.hotelmarisrangkas.com/public/${imageProduct}`}
          alt="Product"
          width={100}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setModalType("editProduct");
              setProductToEdit(record); // Set the product to be edited
              form.setFieldsValue({
                name: record.name,
                description: record.description,
                price: record.price,
                stock: record.stock,
                categoryId: record.categoryId,
              });
              setModalVisible(true);
            }}
            type="primary"
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDelete(record.id)}
            type="primary"
            danger
            style={{ marginLeft: 8 }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsed={false} />
      <Layout>
        <Header />
        <Content style={{ margin: "16px", padding: 24, background: "#fff" }}>
          <BreadcrumbComponent />
          <div className="gap-4 flex">
            <Button
              type="primary"
              onClick={() => {
                setModalType("product");
                setModalVisible(true);
              }}
            >
              Add Product
            </Button>
          </div>
          {loadingProducts || loadingCategories ? (
            <Spin size="large" />
          ) : (
            <Table
              dataSource={products}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          )}
        </Content>
      </Layout>
      <Modal
        title={
          modalType === "product"
            ? "Add Product"
            : modalType === "editProduct"
            ? "Edit Product"
            : ""
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
      >
        {modalType === "product" || modalType === "editProduct" ? (
          <Form
            form={form}
            onFinish={
              modalType === "editProduct" ? handleEditProduct : handleAddProduct
            }
            layout="vertical"
          >
            <Form.Item
              name="name"
              label="Product Name"
              rules={[
                { required: true, message: "Please input product name!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: "Please input description!" }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              name="price"
              label="Price"
              rules={[
                { required: true, message: "Please input product price!" },
              ]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name="stock"
              label="Stock"
              rules={[{ required: true, message: "Please input stock!" }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name="categoryId"
              label="Category"
              rules={[{ required: true, message: "Please select a category!" }]}
            >
              <Select placeholder="Select a category">
                {categories.map((category) => (
                  <Select.Option key={category.id} value={category.id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="imageProduct"
              label="Product Image"
              valuePropName="fileList"
              getValueFromEvent={(e) => e && e.fileList}
              rules={[
                { required: true, message: "Please upload product image!" },
              ]}
            >
              <Upload
                name="imageProduct"
                listType="picture"
                beforeUpload={() => false}
                maxCount={1}
              >
                <Button>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </Form>
        ) : null}
      </Modal>
    </Layout>
  );
};

export default ProductAdmin;
