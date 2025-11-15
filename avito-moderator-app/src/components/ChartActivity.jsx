import React, { useState, useEffect } from "react";
import axios from "axios";

import { Bar } from "react-chartjs-2";

const ChartActivity = () => {
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivityData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3001/api/v1/stats/chart/activity"
      );
      setActivityData(response.data);
    } catch (err) {
      setError(`Произошла ошибка при загрузке данных activity: ${err.message}`);
      console.error(`fetch error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityData();
  }, []);

  if (loading) return <div className="loading">загрузка...</div>;
  if (error) return <div className="error">{error}</div>;

  const activityChartData = {
    labels: activityData.map((item) => item.date),
    datasets: [
      {
        label: "Одобрено",
        data: activityData.map((item) => item.approved),
        backgroundColor: "rgba(0, 255, 0, 0.5)",
        borderWidth: 1,
      },
      {
        label: "Отклонено",
        data: activityData.map((item) => item.rejected),
        backgroundColor: "rgba(255, 0, 0, 0.5)",
        borderWidth: 1,
      },
      {
        label: "На доработку",
        data: activityData.map((item) => item.requestChanges),
        backgroundColor: "rgba(255, 255, 0, 0.5)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <div
        style={{
          width: "800px",
          height: "400px",
          margin: "0 auto",
          marginBottom: "50px",
        }}
      >
        <h3>График активности</h3>

        <Bar
          data={activityChartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
              },
              datalabels: {
                display: false,
              },
            },
            scales: {
              y: {
                ticks: {
                  stepSize: 1,
                  callback: (value) => (Number.isInteger(value) ? value : null),
                },
              },
              x: {
                ticks: {
                  callback: (_, index) => {
                    const raw = activityData[index]?.date;
                    if (!raw) return "";

                    const date = new Date(raw);
                    const day = date.getDate();
                    const month = date.toLocaleString("ru-RU", {
                      month: "short",
                    });

                    return `${day} ${month}`;
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default ChartActivity;
