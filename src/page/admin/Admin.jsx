import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Card, Statistic } from "antd";
import Header from "../../component/Header";
import Sider from "../../component/SideBar";
import BreadcrumbComponent from "../../component/Breadcrumb";
import { Line, Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axiosInstance from "../../../ax";

// Register chart elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const { Content } = Layout;

const Admin = () => {
  const [userData, setUserData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [dailySales, setDailySales] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        // Fetch users data
        const usersResponse = await axiosInstance.get("/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Users Response:", usersResponse); // Debugging
        setUserData(usersResponse.data.data);

        // Fetch product categories
        const productsResponse = await axiosInstance.get("/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Products Response:", productsResponse); // Debugging
        setProductData(productsResponse.data.data);

        // Fetch daily sales
        const dailySalesResponse = await axiosInstance.get("/api/omset-day", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Daily Sales Response:", dailySalesResponse); // Debugging
        setDailySales(dailySalesResponse.data.data);

        // Fetch monthly sales
        const monthlySalesResponse = await axiosInstance.get(
          "/api/omset-month",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Monthly Sales Response:", monthlySalesResponse); // Debugging
        setMonthlySales(monthlySalesResponse.data.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error); // Catch any errors
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatToRupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);

  // Daily Sales Data for Chart
  const dailySalesData = {
    labels: dailySales.map((entry) => entry.date), // Dates
    datasets: [
      {
        label: "Pendapatan Harian",
        data: dailySales.map((entry) => entry.successAmount), // Success amounts
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Monthly Sales Data for Chart
  const monthlySalesData = {
    labels: monthlySales.map((entry) => entry.yearMonth), // Months (e.g., "2025-01")
    datasets: [
      {
        label: "Pendapatan Bulanan",
        data: monthlySales.map((entry) => entry.successAmount), // Success amounts
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider />
      <Layout className="site-layout">
        <Header />
        <Content style={{ margin: "16px", padding: 24, minHeight: 280 }}>
          <BreadcrumbComponent />
          <Row gutter={16}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Jumlah Pengguna"
                  value={userData.length}
                  loading={loading}
                  valueStyle={{ fontSize: 24 }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Jumlah Kategori Produk"
                  value={productData.length}
                  loading={loading}
                  valueStyle={{ fontSize: 24 }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Pendapatan Harian (Sukses)"
                  value={formatToRupiah(
                    dailySales.reduce(
                      (acc, curr) => acc + curr.successAmount,
                      0
                    )
                  )}
                  loading={loading}
                  valueStyle={{ fontSize: 24, color: "#3f8600" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Pendapatan Bulanan (Sukses)"
                  value={formatToRupiah(
                    monthlySales.reduce(
                      (acc, curr) => acc + curr.successAmount,
                      0
                    )
                  )}
                  loading={loading}
                  valueStyle={{ fontSize: 24, color: "#3f8600" }}
                />
              </Card>
            </Col>
          </Row>
          <Row gutter={16} className="pt-4">
            <Col span={12}>
              <Card title="Grafik Penjualan Harian">
                <Bar data={dailySalesData} options={{ responsive: true }} />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Grafik Penjualan Bulanan">
                <Line data={monthlySalesData} options={{ responsive: true }} />
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Admin;
