import React, { useEffect, useState } from "react";
import { Table, Spin, Alert } from "antd";
import axiosInstance from "../../../ax";

const HarianTransaction = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/omset-day");
        if (response.data && response.data.data) {
          setData(response.data.data);
        } else {
          setError("No data found");
        }
        setLoading(false);
        console.log(response);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Define columns for Ant Design Table
  const columns = [
    {
      title: "Tanggal Transaksi",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Total Transaksi",
      dataIndex: "totalTransactions",
      key: "totalTransactions",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => `Rp ${amount.toLocaleString()}`,
    },
    {
      title: "Pending Amount",
      dataIndex: "pandingAmount",
      key: "pandingAmount",
      render: (amount) => `Rp ${amount.toLocaleString()}`,
    },
    {
      title: "Success Transactions",
      dataIndex: "successTransactions",
      key: "successTransactions",
    },
    {
      title: "Success Amount",
      dataIndex: "successAmount",
      key: "successAmount",
      render: (amount) => `Rp ${amount.toLocaleString()}`,
    },
    {
      title: "Success Rate",
      dataIndex: "successRate",
      key: "successRate",
    },
  ];

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" />;
  }

  return (
    <div>
      <h2>Transaksi Harian</h2>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="date"
        pagination={false}
      />
    </div>
  );
};

export default HarianTransaction;
