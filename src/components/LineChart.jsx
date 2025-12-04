"use client";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const LineChartComponent = ({
  data,
  selectedDate,
  estimatedSaving,
  formatDate,
  extraData,
}) => {
  if (!data || data.length === 0) return null;

  const verticalData =
    selectedDate && estimatedSaving
      ? [
          { name: data[0].name, extraAmount: 0 },
          {
            name: formatDate(
              new Date((data[0].date.getTime() + selectedDate.getTime()) / 2)
            ),
            extraAmount: Math.round(estimatedSaving / 2),
          },
          { name: formatDate(selectedDate), extraAmount: estimatedSaving },
        ]
      : [];
  return (
    <div className="w-full grid md:grid-cols-2">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <YAxis />
          <XAxis dataKey="name" />
          <CartesianGrid strokeDasharray="5 5" />

          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="amount"
            stroke="#cc9900"
            name="จำนวนเงินที่ออม"
          />
        </LineChart>
      </ResponsiveContainer>

      {verticalData.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            layout="vertical" // ทำให้แกน X-Y สลับ
            data={verticalData}
          >
            <XAxis type="number" /> {/* จำนวนเงิน */}
            <YAxis type="category" dataKey="name" /> {/* วัน */}
            <CartesianGrid strokeDasharray="5 5" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="extraAmount"
              stroke="#add8e6"
              name="ออมถึงวันเลือก"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default LineChartComponent;
