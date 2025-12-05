"use client";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";

// Custom modern tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#2b2b2b] px-4 py-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-lg font-bold" style={{ color: entry.color }}>
            {Number(entry.value).toLocaleString()} บาท
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const LineChartComponent = ({
  data,
  selectedDate,
  estimatedSaving,
  formatDate,
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
    <div className="w-full grid md:grid-cols-2 gap-6">
      {/* Main Savings Growth Chart */}
      <div className="bg-white dark:bg-[#2b2b2b] rounded-xl p-4 shadow-sm">
        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
          การเติบโตของเงินออม
        </h4>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffcc00" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ffcc00" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#888', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#888', fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#ffcc00"
              strokeWidth={3}
              fill="url(#colorAmount)"
              dot={false}
              activeDot={{ r: 6, fill: '#ffcc00', stroke: '#fff', strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Selected Date Chart */}
      {verticalData.length > 0 && (
        <div className="bg-white dark:bg-[#2b2b2b] rounded-xl p-4 shadow-sm">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
            ออมถึงวันที่เลือก
          </h4>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={verticalData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorExtra" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#888', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#888', fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="extraAmount"
                stroke="#60a5fa"
                strokeWidth={3}
                fill="url(#colorExtra)"
                dot={false}
                activeDot={{ r: 6, fill: '#60a5fa', stroke: '#fff', strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default LineChartComponent;
