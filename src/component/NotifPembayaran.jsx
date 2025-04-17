import React from "react";
import { notification } from "antd";
import "antd/dist/reset.css";

const Notification = () => {
 
  const showSuccessNotification = () => {
    notification.success({
      message: "Success",
      description: "Pembayaran Succes!",
      className: "bg-green-500 text-white shadow-lg rounded-lg",
      placement: "topRight",
    });
  };

 
  const showFailedNotification = () => {
    notification.error({
      message: "Failed",
      description: "Pembayaran Failed Bro.",
      className: "bg-red-500 text-white shadow-lg rounded-lg",
      placement: "topRight",
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={showSuccessNotification}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Show Success Notification
      </button>
      <button
        onClick={showFailedNotification}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Show Failed Notification
      </button>
    </div>
  );
};

export default Notification;
