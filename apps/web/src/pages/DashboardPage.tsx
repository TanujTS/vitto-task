import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useApplications, useApplicationSummary, useUpdateApplicationStatus } from "../hooks/useApplications";
import { type Application, type ApplicationStatus } from "@vitto/types";
import { IconArrowLeft, IconSearch, IconChevronDown, IconChevronUp, IconCheck, IconX, IconClock } from "@tabler/icons-react";

export default function DashboardPage() {
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: applications, isLoading: isAppsLoading } = useApplications();
  const { data: summary, isLoading: isSummaryLoading } = useApplicationSummary();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateApplicationStatus();

  const filteredApplications = useMemo(() => {
    if (!applications) return [];
    
    let result = applications;
    if (statusFilter !== "all") {
      result = result.filter(app => app.status === statusFilter);
    }
    
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(app => 
        app.name.toLowerCase().includes(lowerQuery) || 
        app.id.toLowerCase().includes(lowerQuery)
      );
    }
    
    return result;
  }, [applications, statusFilter, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const handleUpdateStatus = (id: string, newStatus: ApplicationStatus) => {
    updateStatus({ id, status: newStatus });
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case "approved":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-green-500/20 bg-green-500/10 text-xs font-medium text-green-400"><IconCheck size={12}/> Approved</span>;
      case "rejected":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-red-500/20 bg-red-500/10 text-xs font-medium text-red-400"><IconX size={12}/> Rejected</span>;
      case "pending":
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-yellow-500/20 bg-yellow-500/10 text-xs font-medium text-yellow-400"><IconClock size={12}/> Pending</span>;
    }
  };

  return (
    <div className="min-h-screen w-full bg-black relative flex flex-col">
      <div className="absolute inset-0 z-0 bg-noise" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6 border-b border-white/5 bg-black/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="p-2 rounded-lg border border-white/10 hover:border-white/30 text-white/50 hover:text-white hover:bg-white/5 transition-all duration-300"
          >
            <IconArrowLeft size={18} />
          </Link>
          <span className="font-heading font-semibold text-lg text-white">
            Vitto Agent Portal
          </span>
        </div>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col p-6 md:p-12 max-w-6xl mx-auto w-full">
        {/* Header & Stats */}
        <div className="mb-10">
          <h1 className="text-3xl font-heading font-bold text-white mb-6">Dashboard</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-5 rounded-2xl border border-white/5">
              <p className="text-sm text-white/40 mb-1">Total Applications</p>
              <p className="text-2xl font-semibold text-white">
                {isSummaryLoading ? "..." : summary?.totalApplications || 0}
              </p>
            </div>
            <div className="glass-card p-5 rounded-2xl border border-white/5">
              <p className="text-sm text-white/40 mb-1">Pending</p>
              <p className="text-2xl font-semibold text-white">
                {isSummaryLoading ? "..." : summary?.statusCounts.pending || 0}
              </p>
            </div>
            <div className="glass-card p-5 rounded-2xl border border-white/5">
              <p className="text-sm text-white/40 mb-1">Approved</p>
              <p className="text-2xl font-semibold text-white">
                {isSummaryLoading ? "..." : summary?.statusCounts.approved || 0}
              </p>
            </div>
            <div className="glass-card p-5 rounded-2xl border border-white/5">
              <p className="text-sm text-white/40 mb-1">Total Loan Amount</p>
              <p className="text-2xl font-semibold text-white">
                ₹ {isSummaryLoading ? "..." : (summary?.totalLoanAmountRequested || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <div className="relative w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IconSearch size={16} className="text-white/30" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-all text-sm"
              placeholder="Search by name or ID..."
            />
          </div>

          <div className="w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | "all")}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-white/30 transition-all appearance-none text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* List */}
        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden flex-1">
          {isAppsLoading ? (
            <div className="p-8 text-center text-white/40">Loading applications...</div>
          ) : filteredApplications.length === 0 ? (
            <div className="p-8 text-center text-white/40">No applications found.</div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredApplications.map((app) => (
                <div key={app.id} className="group">
                  {/* Row Header */}
                  <div 
                    onClick={() => toggleExpand(app.id)}
                    className="p-4 md:px-6 md:py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-4 md:w-1/3">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white/60 font-medium">
                        {app.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{app.name}</p>
                        <p className="text-xs text-white/40">ID: {app.id.substring(0,8)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full md:w-2/3">
                      <div className="text-left md:text-right flex-1 md:pr-8">
                        <p className="text-white font-medium">₹ {app.amount.toLocaleString()}</p>
                        <p className="text-xs text-white/40">{new Date(app.createdAt).toLocaleDateString()}</p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {getStatusBadge(app.status)}
                        <div className="text-white/30 group-hover:text-white/60 transition-colors">
                          {expandedId === app.id ? <IconChevronUp size={20} /> : <IconChevronDown size={20} />}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedId === app.id && (
                    <div className="p-4 md:px-6 pb-6 bg-black/20 border-t border-white/5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs text-white/40 mb-1">Contact Details</p>
                            <p className="text-sm text-white">{app.mobile}</p>
                            <p className="text-sm text-white/70">Prefers {app.language}</p>
                          </div>
                          <div>
                            <p className="text-xs text-white/40 mb-1">Loan Purpose</p>
                            <p className="text-sm text-white">{app.purpose}</p>
                          </div>
                        </div>

                        <div className="flex flex-col justify-end md:items-end gap-3">
                          <p className="text-xs text-white/40 w-full text-left md:text-right">Update Status</p>
                          <div className="flex gap-3 w-full md:w-auto">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleUpdateStatus(app.id, "approved"); }}
                              disabled={isUpdating || app.status === "approved"}
                              className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 disabled:opacity-50 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleUpdateStatus(app.id, "rejected"); }}
                              disabled={isUpdating || app.status === "rejected"}
                              className="flex-1 md:flex-none px-4 py-2 rounded-lg border border-white/10 text-white text-sm font-medium hover:bg-white/5 disabled:opacity-50 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
