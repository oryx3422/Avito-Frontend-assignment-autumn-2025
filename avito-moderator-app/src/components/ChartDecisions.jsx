import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";

const ChartDecisions = () => {
  const [decisionsData, setDecisionsData] = useState({
    approved: 0,
    rejected: 0,
    requestChanges: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDecisionData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3001/api/v1/stats/chart/decisions"
      );
      setDecisionsData(response.data);
    } catch (err) {
      setError(
        `Произошла ошибка при загрузке данных decisions: ${err.message}`
      );
      console.error(`fetch error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecisionData();
  }, []);

  if (loading) return <div className="loading">загрузка...</div>;
  if (error) return <div className="error">{error}</div>;

  const values = [
    decisionsData.approved,
    decisionsData.rejected,
    decisionsData.requestChanges,
  ];

  const total = values.reduce((a, b) => a + b, 0);

  const decisionsChartData = {
    labels: ["Одобрено", "Отклонено", "На доработку"],
    datasets: [
      {
        data: values,
        backgroundColor: [
          "rgba(0, 255, 0, 0.5)",
          "rgba(255, 0, 0, 0.5)",
          "rgba(255, 255, 0, 0.5)",
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div>
      <div
        style={{
          width: "500px",
          height: "500px",
          margin: "0 auto",
          marginBottom: "50px",
        }}
      >
        <h3>Распределение решений</h3>

        <Pie
          data={decisionsChartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: "bottom",
              },

              tooltip: {
                callbacks: {
                  label: function (context) {
                    const value = context.raw;
                    const percent = ((value / total) * 100).toFixed(2);
                    return `${context.label}: ${percent}%`;
                  },
                },
              },

              datalabels: {
                color: "#000",
                font: {
                  size: 14,
                },
                formatter: (value) => {
                  if (total === 0) return "";
                  const percent = ((value / total) * 100).toFixed(2);
                  return `${percent}%`;
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default ChartDecisions;
