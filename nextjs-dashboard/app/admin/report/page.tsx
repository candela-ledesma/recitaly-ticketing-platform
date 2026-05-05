"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/app/ui/admin/Card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
type Summary = {
  totalSales: number;
  topRecital: { name: string; amount: number } | null;
  bottomRecital: { name: string; amount: string } | null;
};
export default function AdminReportsPage() {
  const [summary, setSummary] = useState<Summary>({
    totalSales: 0,
    topRecital: null,
    bottomRecital: null,
  });
  const [artistData, setArtistData] = useState([]);

  useEffect(() => {
    fetch("/api/admin/summary")
      .then(res => res.json())
      .then(data => setSummary(data));

    fetch("/api/admin/artist-sales")
      .then(res => res.json())
      .then(data => setArtistData(data));
  }, []);

  return (
    <div className="p-6 text-white max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Reports</h1>

      <div className=" grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 ">
        <Card className="bg-pink-600 text-white">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold">Total Sales This Month</h2>
            <p className="text-2xl">${summary.totalSales.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 text-white">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold">Top Selling Recital</h2>
            <p>{summary.topRecital?.name || "Loading..."}</p>
            <p className="text-sm text-zinc-400">{summary.topRecital?.amount} tickets</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 text-white">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold">Next Recital with Least Sales</h2>
            <p>{summary.bottomRecital?.name || "Loading..."}</p>
            <p className="text-sm text-zinc-400">{summary.bottomRecital?.amount} tickets</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-4">Sales by Artist</h2>
      <div className="h-[400px] bg-zinc-900 rounded-xl p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={artistData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="artist" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total" fill="#ec4899" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length > 0) {
    const { artist, total } = payload[0].payload;
    return (
      <div className="bg-zinc-800 text-white p-2 rounded shadow-md">
        <p className="font-semibold">{artist}</p>
        <p>{total} tickets sold</p>
      </div>
    );
  }

  return null;
}
