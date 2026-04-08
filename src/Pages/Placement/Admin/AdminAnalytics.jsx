import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from "recharts";
import AdminPageHeader from "../../../components/Placement/AdminPageHeader";

const data = [
  { name: "CSE", placed: 400, total: 450 },
  { name: "IT", placed: 300, total: 320 },
  { name: "ECE", placed: 200, total: 250 },
  { name: "MECH", placed: 150, total: 300 },
];

const trendData = [
  { month: "Jan", companies: 5, offers: 40 },
  { month: "Feb", companies: 8, offers: 120 },
  { month: "Mar", companies: 12, offers: 350 },
  { month: "Apr", companies: 15, offers: 240 },
];

const COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#a855f7"];

const AdminAnalytics = () => {
  return (
    <Box sx={{ p: 4 }}>
      <AdminPageHeader 
        title="Institutional Analytics 📈" 
        description="Deep dive into placement performance, department-wise recruitment trends, and institutional growth metrics."
      />

      <Grid container spacing={4}>
        {/* Department Placement Bar Chart */}
        <Grid item xs={12} lg={8}>
          <Paper className="grid-common" sx={{ p: 4, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 4, fontWeight: 700 }}>Department Placement Success</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#121212", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                  itemStyle={{ color: "#10b981" }}
                />
                <Bar dataKey="placed" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Global Distribution Pie Chart */}
        <Grid item xs={12} lg={4}>
          <Paper className="grid-common" sx={{ p: 4, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 4, fontWeight: 700 }}>Sector Distribution</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={[
                    { name: "IT Services", value: 400 },
                    { name: "Core", value: 300 },
                    { name: "FinTech", value: 300 },
                    { name: "Consulting", value: 200 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {trendData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recruitment Trends Line Chart */}
        <Grid item xs={12}>
          <Paper className="grid-common" sx={{ p: 4, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 4, fontWeight: 700 }}>Monthly Recruitment Trends</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#121212", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                />
                <Legend />
                <Line type="monotone" dataKey="offers" stroke="#10b981" strokeWidth={3} dot={{ fill: "#10b981", r: 6 }} />
                <Line type="monotone" dataKey="companies" stroke="#f59e0b" strokeWidth={3} dot={{ fill: "#f59e0b", r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminAnalytics;
