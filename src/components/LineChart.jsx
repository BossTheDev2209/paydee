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
  Legend,
} from "recharts";


// Custom modern tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // Label comes as timestamp number now, convert back to date string
    const dateLabel = new Date(label).toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit"
    });

    return (
      <div className="bg-white dark:bg-[#2b2b2b] px-4 py-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{dateLabel}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm md:text-base font-bold flex items-center gap-2" style={{ color: entry.color }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
            {entry.name}: {Number(entry.value).toLocaleString()} บาท
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
  totalTarget,
}) => {
  if (!data || data.length === 0) return null;

  const startDateVal = data[0].date.getTime();
  const selectedDateVal = selectedDate ? selectedDate.getTime() : null;

  // Calculate rate for adjusted plan (Linear progression from Start to Target at SelectedDate)
  let adjustedRate = 0;
  if (selectedDateVal && selectedDateVal > startDateVal && totalTarget) {
    adjustedRate = totalTarget / (selectedDateVal - startDateVal);
  }

  // Transform data to include both series
  const chartData = data.map(item => {
    const time = item.date.getTime();
    let adjustedAmount = 0;

    if (selectedDateVal && time >= startDateVal) {
      if (time <= selectedDateVal) {
        adjustedAmount = adjustedRate * (time - startDateVal);
      } else {
        adjustedAmount = totalTarget;
      }
    }

    return {
      ...item,
      dateVal: time,
      adjustedAmount: selectedDateVal ? Math.round(adjustedAmount) : null,
    };
  });

  return (
    <div className="w-full bg-white dark:bg-[#2b2b2b] rounded-xl p-4 shadow-sm">
      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4 text-center">
        เปรียบเทียบแผนการออม
      </h4>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffcc00" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ffcc00" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorAdjusted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
          <XAxis
            dataKey="dateVal"
            type="number"
            domain={['dataMin', 'dataMax']}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#888', fontSize: 12 }}
            tickFormatter={(val) => formatDate(new Date(val))}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#888', fontSize: 12 }}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <Legend verticalAlign="top" height={36} />
          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="amount"
            name="แผนเดิม"
            stroke="#ffcc00"
            strokeWidth={3}
            fill="url(#colorAmount)"
            dot={false}
            activeDot={{ r: 6, fill: '#ffcc00', stroke: '#fff', strokeWidth: 2 }}
            fillOpacity={1}
            isAnimationActive={false}
          />

          {selectedDateVal && (
            <Area
              type="monotone"
              dataKey="adjustedAmount"
              name="แผนใหม่ (ตามวันที่เลือก)"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#colorAdjusted)"
              dot={false}
              activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
              fillOpacity={0.6}
              isAnimationActive={false}
            />
          )}

        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
