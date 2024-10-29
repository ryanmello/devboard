import React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";

interface LeetCodeActivityProps{
  submissionCalendar: Record<string, number> | undefined;
}

const LeetCodeActivity: React.FC<LeetCodeActivityProps> = ({ submissionCalendar }) => {
  const monthNames: string[] = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthsBefore: string[] = [];
  for (let i = 0; i < 12; i++) {
    const monthIndex = (currentMonth - i + 12) % 12;
    monthsBefore.unshift(monthNames[monthIndex]); 
  }

  const monthsTotal: { [month: string]: number } = {};

  for (const timestamp in submissionCalendar) {
    const date = new Date(parseInt(timestamp) * 1000);
    const submissionMonth = date.getMonth();
    const submissionYear = date.getFullYear();

    if (
      (currentYear === submissionYear && submissionMonth >= currentMonth - 11) ||
      (submissionYear === currentYear - 1 && submissionMonth >= currentMonth + 1)
    ) {
      const month = monthNames[submissionMonth];
      monthsTotal[month] = (monthsTotal[month] || 0) + submissionCalendar[timestamp];
    }
  }

  const data = monthsBefore.map((month) => ({
    name: month,
    total: monthsTotal[month] || 0, 
  }));
  
  return (
    <div className="flex flex-col bg-secondary/80 rounded-xl w-full px-4 pt-4 ml-0 md:ml-4 md:w-1/2 mt-4 md:mt-0">
      <h2 className="font-bold">LeetCode Activity</h2>
      <ResponsiveContainer width="100%" className="max-h-[220px] 2xl:max-h-[260px]">
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            stroke="#D4D4D4"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeetCodeActivity;
