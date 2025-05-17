import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getDailyVisitorCounts } from '~/lib/visitor.server';
import { requireAdmin } from '~/lib/auth.server';
import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import styles from '~/styles/admin-analytics.module.scss';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireAdmin(request);
  const dailyCounts = await getDailyVisitorCounts(60);
  return json({ dailyCounts });
};

export default function AdminAnalyticsPage() {
  const { dailyCounts } = useLoaderData<typeof loader>();
  const chartRef = useRef<HTMLDivElement>(null);
  const [days, setDays] = useState(14);

  const filteredCounts = dailyCounts.slice(-days);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    const option = {
      title: { text: '📊 최근 방문자 수 추이', left: 'center' },
      tooltip: { trigger: 'axis' },
      grid: { top: 50, bottom: 60, left: 50, right: 20 },
      xAxis: {
        type: 'category',
        data: filteredCounts.map((item) => item.date.slice(5)),
        axisLabel: { rotate: 45, interval: 0 },
      },
      yAxis: {
        type: 'value',
        name: '방문 수',
      },
      series: [
        {
          type: 'line',
          name: '방문자 수',
          data: filteredCounts.map((item) => item.count),
          smooth: true,
          areaStyle: { color: 'rgba(59, 130, 246, 0.2)' },
          itemStyle: { color: '#3b82f6' },
          symbol: 'circle',
        },
      ],
    };

    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
    return () => chart.dispose();
  }, [filteredCounts]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>📊 방문자 수 통계</h1>
        <label htmlFor="dayRange" className={styles.label}>
          기간:
        </label>
        <select
          id="dayRange"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className={styles.select}
        >
          <option value={7}>최근 7일</option>
          <option value={14}>최근 14일</option>
          <option value={30}>최근 30일</option>
        </select>
      </div>

      <div ref={chartRef} className={styles.chart} />

      <div className={styles.visitor_table}>
        <table>
          <thead>
            <tr>
              <th>날짜</th>
              <th>방문자 수</th>
            </tr>
          </thead>
          <tbody>
            {[...filteredCounts].reverse().map(({ date, count }) => (
              <tr key={date}>
                <td>{date}</td>
                <td>{count.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
