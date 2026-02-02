"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, PieChart, Pie, Cell
} from "recharts";
import KpiCard from "@/components/KpiCard";

export default function Dashboard() {
  const [rows, setRows] = useState<any[]>([]);
  const [typeData, setTypeData] = useState<any[]>([]);
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [topMakesData, setTopMakesData] = useState<any[]>([]);
  const [utilityData, setUtilityData] = useState<any[]>([]);
  const [cityData, setCityData] = useState<any[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/data/ev_population.csv")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load CSV");
      return res.text();
      })
      .then((csv) => {
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const data = result.data as any[];
            setRows(data);
            processData(data);
          },
        });
      })
      .catch(()=> setError(true));
  }, []);

  const processData = (data: any[]) => {
    // 1. Type Distribution
    const typeCounts: any = {};
    const growthCounts: any = {};
    const makeCounts: any = {};
    const utilityCounts: any = {}; // Initialize here
    const cityCounts: any = {};

    data.forEach((row) => {
      // EV Type
      const type = row["Electric Vehicle Type"];
      if (type) typeCounts[type] = (typeCounts[type] || 0) + 1;

      // Growth by Year
      const year = row["Model Year"];
      if (year) growthCounts[year] = (growthCounts[year] || 0) + 1;

      // Manufacturers
      const make = row["Make"];
      if (make) makeCounts[make] = (makeCounts[make] || 0) + 1;

     // 4. Electric Utility
      const utility = row["Electric Utility"];
      if (utility) utilityCounts[utility] = (utilityCounts[utility] || 0) + 1;

      //5. Cities
      const city = row["City"];
      if (city) cityCounts[city] = (cityCounts[city] || 0) + 1;
    });

    setTypeData(Object.entries(typeCounts).map(([name, count]) => ({ name, count })));
    
    setGrowthData(Object.entries(growthCounts)
      .map(([year, count]) => ({ year, count }))
      .sort((a:any, b:any) => a.year - b.year));

    setTopMakesData(Object.entries(makeCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a:any, b:any) => b.count - a.count)
      .slice(0, 10));

    setUtilityData(Object.entries(utilityCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 12)); // Just top 5 for cleaner UI

    setCityData(Object.entries(cityCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 10)); // Top 10 cities for clarity
  };

  const totalEVs = rows.length;
  const bevPercent = totalEVs > 0 ? ((rows.filter(r => r["Electric Vehicle Type"]?.includes("BEV")).length / totalEVs) * 100).toFixed(1) : "0";
  const topMake = topMakesData[0]?.name || "-";
  const topUtility = utilityData[0]?.name || "Unknown";

  
if (!rows.length) {
  return <p className="text-center mt-20">Loading dashboard...</p>;
}


  return (
    <>
    {`
    .recharts-tooltip-label{
    color: #434242;}
    `}
   

    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col p-6">
        <div className="text-[#1E293B] font-bold text-2xl mb-10 flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0F172A] rounded-lg"></div> Dashboard
        </div>
        <nav className="space-y-4">
          <div className="bg-[#F1F5F9] p-3 rounded-lg text-[#0F172A] font-medium cursor-pointer">Overview</div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">EV Population Overview</h1>
          
        </header>

          {error && (
            <p className="text-red-500 text-center">
              Failed to load EV data
            </p>
          )}

        {/* KPI ROW */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <KpiCard title="Total Registered EVs" value={totalEVs.toLocaleString()} trend="+12.5%" />
          <KpiCard title="Market Share (BEV)" value={`${bevPercent}%`} trend="+2.4%" />
          <KpiCard title="Dominant Brand" value={topMake} subtext="Leading Manufacturer" />
          <KpiCard title="Primary Electric Utility" value={topUtility} subtext="Provider with highest EV density"/>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* LEFT SIDE: ADOPTION OVER TIME (Line Chart) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-[#1E293B] mb-6">Adoption Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                <Tooltip cursor={{ stroke: '#94A3B8', strokeWidth: 2 }}   contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    backgroundColor: '#FFFFFF',
                    color: '#1E293B' 
                  }}/>
                <Line type="monotone" dataKey="count" stroke="#0F172A" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* RIGHT SIDE: TOP CITIES (Vertical Bar Chart) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-[#1E293B] mb-6">Top 10 Cities</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cityData} margin={{ bottom: 40 }}>
                <CartesianGrid vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#0F172A', fontSize: 13, fontWeight: 500 }} 
                  // ROTATE labels so long city names don't overlap
                  angle={-30} 
                  textAnchor="end"
                  interval={0}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                <Tooltip cursor={{ fill: '#F8FAFC' }}  contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    backgroundColor: '#FFFFFF',
                    color: '#1E293B' 
                  }}/>
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BOTTOM GRIDS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6">Top 10 Manufacturers</h3>
            <ResponsiveContainer width="100%" height={350} >
              <BarChart 
                layout="vertical" 
                data={topMakesData} 
                // INCREASE LEFT MARGIN TO PREVENT CLIPPING
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }} 
              >
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  // SET A WIDTH FOR THE LABELS
                  width={85} 
                  // DARKEN THE TEXT COLOR
                  tick={{ fill: '#1E293B', fontSize: 13, fontWeight: 500 }} 
                />
                <Tooltip 
                  // FIX HOVER BACKGROUND (CURSOR)
                  cursor={{ fill: '#F1F5F9' }} 
                  // FIX TOOLTIP BOX STYLING
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    backgroundColor: '#FFFFFF',
                    color: '#1E293B' 
                  }}
                  itemStyle={{ color: '#0F172A', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" fill="#334155" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6">Vehicle Type Split</h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie data={typeData} innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="count">
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#0F172A' : '#94A3B8'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}