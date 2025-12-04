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

const LineChartComponent = ({ data, extraData }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <YAxis />
        <XAxis dataKey='name' />
        <CartesianGrid strokeDasharray="5 5" />

        <Tooltip />
        <Legend />

        <Line type="monotone" dataKey='amount' stroke="#cc9900" />
        {extraData && <Line type="monotone" dataKey='extraAmount' stroke="#add8e6" name="ออมถึงวันเลือก" /> }
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
