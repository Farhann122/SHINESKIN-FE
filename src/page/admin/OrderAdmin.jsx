// import React, { useEffect, useState } from "react";
// import {
//   Layout,
//   Table,
//   Tag,
//   Button,
//   Modal,
//   List,
//   message,
//   Card,
//   Statistic,
//   Col,
//   Row,
// } from "antd";
// import Header from "../../component/Header";
// import Sider from "../../component/SideBar";
// import BreadcrumbComponent from "../../component/Breadcrumb";
// import axiosInstance from "../../../ax";

// const { Content } = Layout;

// const OrderAdmin = () => {
//   const [totalTransaction, setTotalTransaction] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [openModal, setOpenModal] = useState(false);
//   const [selectedTransaction, setSelectedTransaction] = useState(null);
//   const [totalAmount, setTotalAmount] = useState(0); // Total keseluruhan transaksi
//   const [totalPending, setTotalPending] = useState(0); // Total transaksi dengan status PENDING
//   const [totalSuccess, setTotalSuccess] = useState(0); // Total transaksi dengan status SUCCESS
//   const [dailySales, setDailySales] = useState([]);

//   useEffect(() => {
//     const fetchTransactions = async () => {
//       try {
//         const response = await axiosInstance.get("/api/transactions", {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         });
//         const transactions = response.data.data;

//         setTotalTransaction(transactions);
//         setLoading(false);

//         // Menghitung total seluruh transaksi
//         const totalAmount = transactions.reduce((acc, transaction) => {
//           const price = parseFloat(transaction.total_price);
//           if (!isNaN(price)) {
//             return acc + price;
//           }
//           return acc;
//         }, 0);

//         setTotalAmount(totalAmount); // Update totalAmount dengan hasil perhitungan

//         // Menghitung total transaksi dengan status PENDING
//         const totalPending = transactions
//           .filter((transaction) => transaction.status === "PENDING")
//           .reduce((acc, transaction) => {
//             const price = parseFloat(transaction.total_price);
//             if (!isNaN(price)) {
//               return acc + price;
//             }
//             return acc;
//           }, 0);

//         setTotalPending(totalPending); // Update totalPending

//         // Menghitung total transaksi dengan status SUCCESS
//         const totalSuccess = transactions
//           .filter((transaction) => transaction.status === "SUCCESS")
//           .reduce((acc, transaction) => {
//             const price = parseFloat(transaction.total_price);
//             if (!isNaN(price)) {
//               return acc + price;
//             }
//             return acc;
//           }, 0);

//         setTotalSuccess(totalSuccess); // Update totalSuccess

//         // Hitung penjualan harian
//         calculateDailySales(transactions);
//       } catch (error) {
//         console.error("Error fetching transactions:", error);
//         setLoading(false);
//       }
//     };

//     fetchTransactions();
//   }, []);

//   const calculateDailySales = (transactions) => {
//     const groupedByDate = transactions.reduce((acc, transaction) => {
//       const date = new Date(transaction.createdAt).toLocaleDateString();
//       const price = parseFloat(transaction.total_price);

//       if (!acc[date]) {
//         acc[date] = 0;
//       }
//       acc[date] += !isNaN(price) ? price : 0;

//       return acc;
//     }, {});

//     // Konversi object ke array dan urutkan berdasarkan tanggal
//     const sortedByDate = Object.entries(groupedByDate)
//       .map(([date, total]) => ({ date, total }))
//       .sort((a, b) => new Date(a.date) - new Date(b.date)); // Urutkan berdasarkan tanggal

//     setDailySales(sortedByDate);
//   };

//   const handleDetail = (transaction) => {
//     setSelectedTransaction(transaction);
//     setOpenModal(true);
//   };

//   const handleSuccess = async () => {
//     if (!selectedTransaction) return;

//     try {
//       // API call to update transaction status
//       await axiosInstance.put(
//         `/api/set-success/${selectedTransaction.id}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         }
//       );

//       // Fetch updated transactions from the server
//       const response = await axiosInstance.get("/api/transactions", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       setTotalTransaction(response.data.data);

//       // Menghitung kembali total seluruh transaksi setelah update status
//       const totalAmount = response.data.data.reduce((acc, transaction) => {
//         const price = parseFloat(transaction.total_price);
//         if (!isNaN(price)) {
//           return acc + price;
//         }
//         return acc;
//       }, 0);
//       setTotalAmount(totalAmount); // Update totalAmount setelah transaksi diubah

//       // Menghitung total transaksi dengan status PENDING
//       const totalPending = response.data.data
//         .filter((transaction) => transaction.status === "PENDING")
//         .reduce((acc, transaction) => {
//           const price = parseFloat(transaction.total_price);
//           if (!isNaN(price)) {
//             return acc + price;
//           }
//           return acc;
//         }, 0);
//       setTotalPending(totalPending); // Update totalPending

//       // Menghitung total transaksi dengan status SUCCESS
//       const totalSuccess = response.data.data
//         .filter((transaction) => transaction.status === "SUCCESS")
//         .reduce((acc, transaction) => {
//           const price = parseFloat(transaction.total_price);
//           if (!isNaN(price)) {
//             return acc + price;
//           }
//           return acc;
//         }, 0);
//       setTotalSuccess(totalSuccess); // Update totalSuccess

//       // Close modal and display success message
//       setOpenModal(false);
//       message.success("Status berhasil diubah menjadi sukses.");
//     } catch (error) {
//       console.error("Error updating status:", error);

//       if (error.response && error.response.status === 404) {
//         message.error("Transaksi tidak ditemukan atau sudah berhasil.");
//       } else {
//         message.error("Gagal mengubah status transaksi.");
//       }
//     }
//   };

//   const formatToRupiah = (value) => {
//     const numericValue = parseFloat(value);
//     if (isNaN(numericValue)) {
//       return "Rp 0";
//     }
//     return new Intl.NumberFormat("id-ID", {
//       style: "currency",
//       currency: "IDR",
//     }).format(numericValue);
//   };

//   const columns = [
//     {
//       title: "ID",
//       dataIndex: "id",
//       key: "id",
//     },
//     {
//       title: "Username",
//       dataIndex: ["user", "username"],
//       key: "username",
//     },
//     {
//       title: "Email",
//       dataIndex: ["user", "email"],
//       key: "email",
//     },
//     {
//       title: "Total Price",
//       dataIndex: "total_price",
//       key: "total_price",
//       render: (price) => formatToRupiah(price),
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       render: (status) => {
//         const color = status === "SUCCESS" ? "green" : "volcano";
//         return <Tag color={color}>{status.toUpperCase()}</Tag>;
//       },
//     },
//     {
//       title: "Created At",
//       dataIndex: "createdAt",
//       key: "createdAt",
//       render: (date) => new Date(date).toLocaleDateString(),
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (record) => (
//         <Button onClick={() => handleDetail(record)} type="primary">
//           Detail
//         </Button>
//       ),
//     },
//   ];

//   const dailySalesColumns = [
//     {
//       title: "Date",
//       dataIndex: "date",
//       key: "date",
//     },
//     {
//       title: "Total Sales",
//       dataIndex: "total",
//       key: "total",
//       render: (total) => formatToRupiah(total),
//     },
//   ];

//   return (
//     <Layout style={{ minHeight: "100vh" }}>
//       <Sider />
//       <Layout className="site-layout">
//         <Header />
//         <Content style={{ margin: "16px", padding: 24, minHeight: 280 }}>
//           <BreadcrumbComponent />
//           <div className="mt-5">
//             <h1 className="text-2xl font-bold mb-4">Transactions</h1>

//             {/* Menampilkan Total Semua Transaksi */}
//             <div className="w-full h-full flex mb-5">
//               <Row gutter={16} justify="center" align="middle">
//                 {/* Total All Transactions */}
//                 <Col>
//                   <Card>
//                     <Statistic
//                       title="Total All Transactions"
//                       value={formatToRupiah(totalAmount)}
//                       loading={loading}
//                       valueStyle={{ fontSize: 24, color: "#3f8600" }}
//                     />
//                   </Card>
//                 </Col>

//                 {/* Total Success Transactions */}
//                 <Col>
//                   <Card>
//                     <Statistic
//                       title="Total Success Transactions"
//                       value={formatToRupiah(totalSuccess)}
//                       loading={loading}
//                       valueStyle={{ fontSize: 24, color: "#3f8600" }}
//                     />
//                   </Card>
//                 </Col>

//                 {/* Total Pending Transactions */}
//                 <Col>
//                   <Card>
//                     <Statistic
//                       title="Total Pending Transactions"
//                       value={formatToRupiah(totalPending)}
//                       loading={loading}
//                       valueStyle={{ fontSize: 24, color: "#3f8600" }}
//                     />
//                   </Card>
//                 </Col>
//               </Row>
//             </div>

//             <Table
//               columns={columns}
//               dataSource={totalTransaction}
//               rowKey="id"
//               loading={loading}
//               pagination={{ pageSize: 10 }}
//               bordered
//             />

//             {/* Tabel untuk Total Penjualan Harian */}
//             <h2 className="text-xl font-bold mt-8 mb-4">Daily Sales</h2>
//             <Table
//               columns={dailySalesColumns}
//               dataSource={dailySales}
//               rowKey="date"
//               pagination={false}
//               bordered
//             />
//           </div>

//           <Modal
//             title="Transaction Details"
//             open={openModal}
//             onCancel={() => setOpenModal(false)}
//             footer={null}
//           >
//             {selectedTransaction ? (
//               <div>
//                 <p>
//                   <strong>Transaction ID:</strong> {selectedTransaction.id}
//                 </p>
//                 <p>
//                   <strong>Username:</strong> {selectedTransaction.user.username}
//                 </p>
//                 <p>
//                   <strong>Email:</strong> {selectedTransaction.user.email}
//                 </p>
//                 <p>
//                   <strong>Total Price:</strong>{" "}
//                   {formatToRupiah(selectedTransaction.total_price)}
//                 </p>
//                 <p>
//                   <strong>Status:</strong> {selectedTransaction.status}
//                 </p>
//                 <p>
//                   <strong>Products List:</strong>
//                 </p>
//                 {Array.isArray(selectedTransaction?.products) &&
//                 selectedTransaction.products.length > 0 ? (
//                   <List
//                     dataSource={selectedTransaction.products}
//                     renderItem={(item) => (
//                       <List.Item key={item.id}>
//                         <div>
//                           <p>
//                             <strong>Product Name:</strong> {item.name}
//                           </p>
//                           <p>
//                             <strong>Quantity:</strong> {item.quantity}
//                           </p>
//                           <p>
//                             <strong>Subtotal Price:</strong>{" "}
//                             {formatToRupiah(item.subtotal_price)}
//                           </p>
//                         </div>
//                       </List.Item>
//                     )}
//                   />
//                 ) : (
//                   <p>No products in this transaction.</p>
//                 )}
//               </div>
//             ) : (
//               <p>No transaction selected</p>
//             )}
//             <div className="flex justify-end">
//               <Button type="primary" onClick={handleSuccess}>
//                 Success
//               </Button>
//             </div>
//           </Modal>
//         </Content>
//       </Layout>
//     </Layout>
//   );
// };

// export default OrderAdmin;

import React, { useEffect, useState } from "react";
import {
  Layout,
  Table,
  Tag,
  Button,
  Modal,
  List,
  message,
  Card,
  Statistic,
  Col,
  Row,
} from "antd";
import Header from "../../component/Header";
import Sider from "../../component/SideBar";
import BreadcrumbComponent from "../../component/Breadcrumb";
import axiosInstance from "../../../ax";

const { Content } = Layout;

const OrderAdmin = () => {
  const [totalTransaction, setTotalTransaction] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [totalSuccess, setTotalSuccess] = useState(0);
  const [dailySales, setDailySales] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axiosInstance.get("/api/transactions", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const transactions = response.data.data;

        setTotalTransaction(transactions);
        setLoading(false);

        // Menghitung total seluruh transaksi
        const totalAmount = transactions.reduce((acc, transaction) => {
          const price = parseFloat(transaction.total_price);
          if (!isNaN(price)) {
            return acc + price;
          }
          return acc;
        }, 0);

        setTotalAmount(totalAmount);

        // Menghitung total transaksi dengan status PENDING
        const totalPending = transactions
          .filter((transaction) => transaction.status === "PENDING")
          .reduce((acc, transaction) => {
            const price = parseFloat(transaction.total_price);
            if (!isNaN(price)) {
              return acc + price;
            }
            return acc;
          }, 0);

        setTotalPending(totalPending);

        // Menghitung total transaksi dengan status SUCCESS
        const totalSuccess = transactions
          .filter((transaction) => transaction.status === "SUCCESS")
          .reduce((acc, transaction) => {
            const price = parseFloat(transaction.total_price);
            if (!isNaN(price)) {
              return acc + price;
            }
            return acc;
          }, 0);

        setTotalSuccess(totalSuccess);

        // Hitung penjualan harian
        calculateDailySales(transactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const calculateDailySales = (transactions) => {
    const groupedByDate = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.createdAt).toLocaleDateString();
      const price = parseFloat(transaction.total_price);

      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += !isNaN(price) ? price : 0;

      return acc;
    }, {});

    // Konversi object ke array dan urutkan berdasarkan tanggal
    const sortedByDate = Object.entries(groupedByDate)
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    setDailySales(sortedByDate);
  };

  const handleDetail = (transaction) => {
    setSelectedTransaction(transaction);
    setOpenModal(true);
  };

  const handleSuccess = async () => {
    if (!selectedTransaction) return;

    // Prevent clicking "Success" if the transaction is already successful
    if (selectedTransaction.status === "SUCCESS") {
      message.warning("This transaction has already been marked as SUCCESS.");
      return;
    }

    try {
      await axiosInstance.put(
        `/api/set-success/${selectedTransaction.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const response = await axiosInstance.get("/api/transactions", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setTotalTransaction(response.data.data);

      // Recalculate totals after status change
      const totalAmount = response.data.data.reduce((acc, transaction) => {
        const price = parseFloat(transaction.total_price);
        if (!isNaN(price)) {
          return acc + price;
        }
        return acc;
      }, 0);
      setTotalAmount(totalAmount);

      const totalPending = response.data.data
        .filter((transaction) => transaction.status === "PENDING")
        .reduce((acc, transaction) => {
          const price = parseFloat(transaction.total_price);
          if (!isNaN(price)) {
            return acc + price;
          }
          return acc;
        }, 0);
      setTotalPending(totalPending);

      const totalSuccess = response.data.data
        .filter((transaction) => transaction.status === "SUCCESS")
        .reduce((acc, transaction) => {
          const price = parseFloat(transaction.total_price);
          if (!isNaN(price)) {
            return acc + price;
          }
          return acc;
        }, 0);
      setTotalSuccess(totalSuccess);

      setOpenModal(false);
      message.success("Transaction status successfully updated to SUCCESS.");
    } catch (error) {
      console.error("Error updating status:", error);
      message.error("Failed to update transaction status.");
    }
  };

  const formatToRupiah = (value) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) {
      return "Rp 0";
    }
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(numericValue);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Username",
      dataIndex: ["user", "username"],
      key: "username",
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
    },
    {
      title: "Total Price",
      dataIndex: "total_price",
      key: "total_price",
      render: (price) => formatToRupiah(price),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color = status === "SUCCESS" ? "green" : "volcano";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <Button onClick={() => handleDetail(record)} type="primary">
          Detail
        </Button>
      ),
    },
    {
      title: "Image",
      dataIndex: "imageTransaction",
      key: "imageTransaction",
      render: (imageTransaction) => (
        <img
          src={`https://shineskin.hotelmarisrangkas.com/public/${imageTransaction}`}
          alt="Product"
          width={100}
        />
      ),
    },
  ];

  const dailySalesColumns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Total Sales",
      dataIndex: "total",
      key: "total",
      render: (total) => formatToRupiah(total),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider />
      <Layout className="site-layout">
        <Header />
        <Content style={{ margin: "16px", padding: 24, minHeight: 280 }}>
          <BreadcrumbComponent />
          <div className="mt-5">
            <h1 className="text-2xl font-bold mb-4">Transactions</h1>
            <div className="w-full h-full flex mb-5">
              <Row gutter={16} justify="center" align="middle">
                <Col>
                  <Card>
                    <Statistic
                      title="Total All Transactions"
                      value={formatToRupiah(totalAmount)}
                      loading={loading}
                      valueStyle={{ fontSize: 24, color: "#3f8600" }}
                    />
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Statistic
                      title="Total Success Transactions"
                      value={formatToRupiah(totalSuccess)}
                      loading={loading}
                      valueStyle={{ fontSize: 24, color: "#3f8600" }}
                    />
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Statistic
                      title="Total Pending Transactions"
                      value={formatToRupiah(totalPending)}
                      loading={loading}
                      valueStyle={{ fontSize: 24, color: "#3f8600" }}
                    />
                  </Card>
                </Col>
              </Row>
            </div>

            <Table
              columns={columns}
              dataSource={totalTransaction}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
              bordered
            />

            <h2 className="text-xl font-bold mt-8 mb-4">Daily Sales</h2>
            <Table
              columns={dailySalesColumns}
              dataSource={dailySales}
              rowKey="date"
              pagination={false}
              bordered
            />
          </div>

          <Modal
            title="Transaction Details"
            open={openModal}
            onCancel={() => setOpenModal(false)}
            footer={null}
          >
            {selectedTransaction ? (
              <div>
      
                

                <p>
                  <strong>Transaction ID:</strong> {selectedTransaction.id}
                </p>
                <p>
                  <strong>Username:</strong> {selectedTransaction.user.username}
                </p>
                <p>
                  <strong>Email:</strong> {selectedTransaction.user.email}
                </p>
                <p>
                  <strong>Total Price:</strong>{" "}
                  {formatToRupiah(selectedTransaction.total_price)}
                </p>
                <p>
                  <strong>Status:</strong> {selectedTransaction.status}
                </p>
                <p>
                  <strong>Products List:</strong>
                </p>
                {Array.isArray(selectedTransaction?.products) &&
                selectedTransaction.products.length > 0 ? (
                  <List
                    dataSource={selectedTransaction.products}
                    renderItem={(item) => (
                      <List.Item key={item.id}>
                        <div>
                          <p>
                            <strong>Product Name:</strong> {item.name}
                          </p>
                          <p>
                            <strong>Quantity:</strong> {item.quantity}
                          </p>
                          <p>
                            <strong>Subtotal Price:</strong>{" "}
                            {formatToRupiah(item.subtotal_price)}
                          </p>
                        </div>
                      </List.Item>
                    )}
                  />
                ) : (
                  <p>No products in this transaction.</p>
                )}
              </div>
            ) : (
              <p>No transaction selected</p>
            )}
            <div className="flex justify-end">
              <Button
                type="primary"
                onClick={handleSuccess}
                disabled={selectedTransaction?.status === "SUCCESS"}
                style={{
                  backgroundColor: selectedTransaction?.status === "SUCCESS" ? "gray" : "#1890ff",
                }}
              >
                Success
              </Button>
            </div>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};




export default OrderAdmin;
