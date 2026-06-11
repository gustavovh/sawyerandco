import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Home, LogOut, Download, Users, TrendingUp, Activity, Filter, Search, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api, API, formatMoney } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from "recharts";
import { toast } from "sonner";

const STATUS_COLORS = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  qualified: "bg-emerald-100 text-emerald-700",
  closed: "bg-slate-200 text-slate-800",
  lost: "bg-rose-100 text-rose-700",
};
const PIE_COLORS = ["#0066FF", "#F59E0B", "#10B981", "#64748B", "#EF4444"];

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    if (!loading && !user) navigate("/admin/login", { replace: true });
  }, [user, loading, navigate]);

  const fetchAll = useCallback(async () => {
    try {
      const [l, a] = await Promise.all([api.get("/admin/leads"), api.get("/admin/analytics")]);
      setLeads(l.data);
      setAnalytics(a.data);
    } catch {
      toast.error("Failed to load dashboard");
    }
  }, []);

  useEffect(() => {
    if (user) fetchAll();
  }, [user, fetchAll]);

  const filteredLeads = leads
    .filter((l) => filter === "all" || l.status === filter)
    .filter((l) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return `${l.first_name} ${l.last_name} ${l.email} ${l.phone} ${l.zip_code}`.toLowerCase().includes(s);
    });

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/leads/${id}`, { status });
      setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
      toast.success("Status updated");
    } catch {
      toast.error("Update failed");
    }
  };

  const saveNotes = async () => {
    if (!editing) return;
    try {
      await api.patch(`/admin/leads/${editing.id}`, { notes: editing.notes });
      setLeads((ls) => ls.map((l) => (l.id === editing.id ? { ...l, notes: editing.notes } : l)));
      setEditing(null);
      toast.success("Notes saved");
    } catch {
      toast.error("Save failed");
    }
  };

  const exportCSV = () => {
    // Use direct URL with credentials to trigger download
    window.open(`${API}/admin/leads/export`, "_blank");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6]">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  const trendData = analytics?.trend || [];
  const sourceData = analytics ? Object.entries(analytics.by_source).map(([name, value]) => ({ name, value })) : [];

  return (
    <div className="min-h-screen bg-[#F3F4F6]" data-testid="admin-dashboard">
      {/* Sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 w-64 h-full bg-white border-r border-gray-200 flex-col">
        <Link to="/" className="px-6 py-5 flex items-center gap-2 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-[#0F2557] flex items-center justify-center">
            <Home className="w-4 h-4 text-white" />
          </div>
          <span className="font-heading font-bold text-[#0F2557]">Northcrest</span>
        </Link>
        <nav className="flex-1 p-3 space-y-1">
          <a href="#leads" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 text-[#0066FF] font-medium text-sm">
            <Users className="w-4 h-4" /> Leads
          </a>
        </nav>
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-3 px-2 py-2">
            {user.picture ? (
              <img src={user.picture} alt="" className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#0F2557] text-white text-xs flex items-center justify-center font-semibold">
                {(user.name || user.email).slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#0F2557] truncate">{user.name || user.email}</p>
              <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button onClick={async () => { await logout(); navigate("/admin/login"); }} data-testid="admin-logout" className="w-full mt-2 flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-gray-50 rounded-lg">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="lg:ml-64 p-6 md:p-10">
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Dashboard</p>
            <h1 className="font-heading text-3xl md:text-4xl font-semibold text-[#0F2557] mt-1">Lead Pipeline</h1>
          </div>
          <button onClick={exportCSV} data-testid="admin-export-csv" className="btn-primary">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        {/* Metrics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard label="Total Leads" value={analytics?.total_leads ?? 0} icon={Users} testid="metric-total" />
          <MetricCard label="Qualified" value={analytics?.qualified_leads ?? 0} icon={Activity} testid="metric-qualified" />
          <MetricCard label="Conversion Rate" value={`${analytics?.conversion_rate ?? 0}%`} icon={TrendingUp} testid="metric-conversion" />
          <MetricCard label="New This Week" value={trendData.reduce((a, t) => a + t.count, 0)} icon={Activity} testid="metric-week" />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
            <p className="font-heading font-semibold text-[#0F2557] mb-4">Leads — Last 7 days</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748B" }} tickFormatter={(d) => d.slice(5)} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748B" }} allowDecimals={false} />
                  <Tooltip cursor={{ fill: "#F3F4F6" }} />
                  <Bar dataKey="count" fill="#0066FF" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <p className="font-heading font-semibold text-[#0F2557] mb-4">By Source</p>
            <div className="h-64">
              {sourceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={sourceData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                      {sourceData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-slate-400">No data yet</div>
              )}
            </div>
            <div className="mt-2 space-y-1">
              {sourceData.map((s, i) => (
                <div key={s.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                    {s.name}
                  </span>
                  <span className="font-semibold tabular-nums">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div id="leads" className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, phone, ZIP…"
                className="pl-9 h-10"
                data-testid="admin-search"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40 h-10" data-testid="admin-filter-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3 font-semibold">Lead</th>
                  <th className="px-6 py-3 font-semibold">Contact</th>
                  <th className="px-6 py-3 font-semibold">Budget</th>
                  <th className="px-6 py-3 font-semibold">Source</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Created</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-slate-400" data-testid="admin-empty">
                      No leads {search || filter !== "all" ? "match your filters" : "yet — they'll appear here as visitors submit the form"}.
                    </td>
                  </tr>
                )}
                {filteredLeads.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50/60" data-testid="lead-row">
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#0F2557]">{l.first_name} {l.last_name}</p>
                      <p className="text-xs text-slate-500">ZIP {l.zip_code} · {l.state || "—"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-700">{l.email}</p>
                      <p className="text-xs text-slate-500">{l.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      {l.home_price_high ? (
                        <>
                          <p className="text-slate-700 tabular-nums">{formatMoney(l.home_price_low)} – {formatMoney(l.home_price_high)}</p>
                          <p className="text-xs text-slate-500 tabular-nums">{formatMoney(l.monthly_payment)}/mo</p>
                        </>
                      ) : <span className="text-slate-400 text-xs">—</span>}
                    </td>
                    <td className="px-6 py-4 text-slate-600 capitalize">{l.source}</td>
                    <td className="px-6 py-4">
                      <Select value={l.status} onValueChange={(v) => updateStatus(l.id, v)}>
                        <SelectTrigger className="h-8 w-32 text-xs" data-testid={`status-${l.id}`}>
                          <Badge className={`${STATUS_COLORS[l.status]} hover:${STATUS_COLORS[l.status]} font-medium border-0`}>{l.status}</Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                          <SelectItem value="lost">Lost</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(l.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setEditing({ ...l })} className="text-xs font-medium text-[#0066FF] hover:underline" data-testid="lead-notes-btn">
                        Notes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Notes Dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">Notes — {editing?.first_name} {editing?.last_name}</DialogTitle>
          </DialogHeader>
          <Textarea
            value={editing?.notes || ""}
            onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
            placeholder="Add internal notes about this lead…"
            className="min-h-[160px]"
            data-testid="lead-notes-textarea"
          />
          <div className="flex justify-end gap-2 mt-3">
            <button onClick={() => setEditing(null)} className="btn-outline">Cancel</button>
            <button onClick={saveNotes} className="btn-primary" data-testid="lead-notes-save">Save</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, testid }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100" data-testid={testid}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
          <p className="font-heading text-3xl font-semibold text-[#0F2557] mt-2 tabular-nums">{value}</p>
        </div>
        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#0066FF]" />
        </div>
      </div>
    </div>
  );
}
