import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Card, Col, Row, Statistic } from 'antd';
import axiosInstance from '../../../ax';

const BulananTransaction = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fungsi untuk mendapatkan data transaksi bulanan
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/api/omset-month'); // Ganti URL sesuai dengan API Anda
        setData(response.data.data);  // Mengambil data dari response API
      } catch (err) {
        setError(err.message);  // Menangani error jika ada
      } finally {
        setLoading(false);  // Menghentikan loading
      }
    };

    fetchData();  // Memanggil fungsi fetchData saat komponen pertama kali di-render
  }, []);

  // Definisi kolom untuk tabel
  const columns = [
    {
      title: 'Bulan/Tahun',
      dataIndex: 'yearMonth',
      key: 'yearMonth',
    },
    {
      title: 'Total Transaksi',
      dataIndex: 'totalTransactions',
      key: 'totalTransactions',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (text) => `Rp ${text.toLocaleString()}`,
    },
    {
      title: 'Transaksi Sukses',
      dataIndex: 'successTransactions',
      key: 'successTransactions',
    },
    {
      title: 'Jumlah Sukses',
      dataIndex: 'successAmount',
      key: 'successAmount',
      render: (text) => `Rp ${text.toLocaleString()}`,
    },
    {
      title: 'Success Rate',
      dataIndex: 'successRate',
      key: 'successRate',
    },
    {
      title: 'Rata-Rata Transaksi Sukses',
      dataIndex: 'averageTransactionSuccess',
      key: 'averageTransactionSuccess',
      render: (text) => `Rp ${text.toLocaleString()}`,
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={16}>
        <Col span={24}>
          <Card>
            <h1>Omset Transaksi Bulanan</h1>
            {error && <div style={{ color: 'red' }}>Terjadi kesalahan: {error}</div>}
            <Table
              loading={loading}
              columns={columns}
              dataSource={data}
              rowKey="yearMonth"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BulananTransaction;
