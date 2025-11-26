import React from "react";
import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";

const BarChart = ({ isDashboard = false, ocrData }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Process data to count disasters by severity
  const processData = (data) => {
    const counts = {
      High: 0,
      Medium: 0,
      Low: 0,
    };

    if (!data || !Array.isArray(data)) {
        console.warn("BarChart: ocrData is missing or not an array", data);
        return [
            { severity: "High", count: 0, icon: "🔴", color: "#FF4444" },
            { severity: "Medium", count: 0, icon: "🟠", color: "#FF8800" },
            { severity: "Low", count: 0, icon: "🟢", color: "#00AA44" },
        ];
    }

    data.forEach((item) => {
      const severity = item.severity ? item.severity.toLowerCase().trim() : "";
      if (severity === "high") {
        counts.High++;
      } else if (severity === "medium") {
        counts.Medium++;
      } else if (severity === "low") {
        counts.Low++;
      }
    });

    return [
      { 
        severity: "High", 
        count: counts.High,
        icon: "🔴",
        color: "#FF4444"
      },
      { 
        severity: "Medium", 
        count: counts.Medium,
        icon: "🟠",
        color: "#FF8800"
      },
      { 
        severity: "Low", 
        count: counts.Low,
        icon: "🟢",
        color: "#00AA44"
      },
    ];
  };

  const chartData = processData(ocrData);

  return (
    <ResponsiveBar
      data={chartData}
      theme={{
        background: 'transparent',
        axis: {
          domain: {
            line: {
              stroke: '#E2E8F0',
              strokeWidth: 2,
            },
          },
          legend: {
            text: {
              fill: '#4A5568',
              fontSize: 14,
              fontWeight: 600,
            },
          },
          ticks: {
            line: {
              stroke: '#CBD5E1',
              strokeWidth: 1,
            },
            text: {
              fill: '#718096',
              fontSize: 12,
              fontWeight: 500,
            },
          },
        },
        grid: {
          line: {
            stroke: '#F7FAFC',
            strokeWidth: 1,
          },
        },
        legends: {
          text: {
            fill: '#4A5568',
            fontSize: 12,
            fontWeight: 500,
          },
        },
        tooltip: {
          container: {
            background: '#2D3748',
            color: '#fff',
            fontSize: '13px',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            border: 'none',
            padding: '12px 16px',
          },
        },
      }}
      keys={["count"]}
      indexBy="severity"
      margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
      padding={0.4}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={({ data }) => {
        if (data.severity === "High") return "url(#highGradient)";
        if (data.severity === "Medium") return "url(#mediumGradient)";
        if (data.severity === "Low") return "url(#lowGradient)";
        return "#CBD5E1";
      }}
      borderWidth={0}
      enableGridY={true}
      enableGridX={false}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 0,
        tickPadding: 8,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Severity Levels",
        legendPosition: "middle",
        legendOffset: 40,
        format: (value) => {
          const item = chartData.find(d => d.severity === value);
          return item ? `${item.icon} ${value}` : value;
        }
      }}
      axisLeft={{
        tickSize: 0,
        tickPadding: 8,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Disaster Count",
        legendPosition: "middle",
        legendOffset: -50,
      }}
      enableLabel={true}
      label={(d) => d.value > 0 ? d.value : ''}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor="#fff"
      animate={true}
      motionConfig="gentle"
      borderRadius={{
        topLeft: 8,
        topRight: 8,
        bottomLeft: 0,
        bottomRight: 0
      }}
      defs={[
        {
          id: 'highGradient',
          type: 'linearGradient',
          colors: [
            { offset: 0, color: '#FF6B6B' },
            { offset: 100, color: '#FF4444' }
          ]
        },
        {
          id: 'mediumGradient',
          type: 'linearGradient',
          colors: [
            { offset: 0, color: '#FFB347' },
            { offset: 100, color: '#FF8800' }
          ]
        },
        {
          id: 'lowGradient',
          type: 'linearGradient',
          colors: [
            { offset: 0, color: '#66BB6A' },
            { offset: 100, color: '#00AA44' }
          ]
        }
      ]}
      tooltip={({ id, value, color, data }) => (
        <div
          style={{
            padding: '12px 16px',
            background: '#2D3748',
            color: '#fff',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          <div style={{ marginBottom: '4px', fontSize: '14px', fontWeight: 600 }}>
            {data.icon} {data.severity} Severity
          </div>
          <div style={{ color: '#A0AEC0' }}>
            <strong>{value}</strong> disaster{value !== 1 ? 's' : ''} reported
          </div>
        </div>
      )}
      legends={[]}
      role="application"
      ariaLabel="Disaster severity distribution chart"
    />
  );
};

export default BarChart;
