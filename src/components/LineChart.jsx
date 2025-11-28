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

const data = [
  { name: "today", old: 0, new: 0 },
  { name: "md days", old: 1270, new: 1000 },
  { name: "last days", old: 1270, new: 2700 },
];
const LineChartComponent = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart width={500} height={300} data={data}>
        <YAxis />
        <XAxis dataKey='name' />
        <CartesianGrid strokeDasharray="5 5" />

        <Tooltip />
        <Legend />

        <Line type="monotone" dataKey='old' stroke="#cc9900" />
        <Line type="monotone" dataKey='new' stroke="#add8e6" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
