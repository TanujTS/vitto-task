import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAddApplication } from "../hooks/useApplications";
import { type PreferredLanguage } from "@vitto/types";
import { IconArrowLeft } from "@tabler/icons-react";

export default function ApplyPage() {
  const navigate = useNavigate();
  const { mutateAsync: addApplication, isPending } = useAddApplication();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    amount: "",
    purpose: "",
    language: "English" as PreferredLanguage,
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!formData.name || !formData.mobile || !formData.amount || !formData.purpose) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      await addApplication({
        name: formData.name,
        mobile: formData.mobile,
        amount: Number(formData.amount),
        purpose: formData.purpose,
        language: formData.language,
      });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to submit application");
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
            Vitto
          </span>
        </div>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md p-8 rounded-2xl glass-card">
          <div className="mb-8">
            <h1 className="text-2xl font-heading font-bold text-white mb-2">
              Apply for a Loan
            </h1>
            <p className="text-sm text-white/40">
              Enter your details below to submit a new loan application.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/70">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                placeholder="Ramesh Kumar"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/70">Mobile Number</label>
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/70">Loan Amount (₹)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                placeholder="50000"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/70">Purpose</label>
              <input
                type="text"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                placeholder="Farming equipment"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/70">Preferred Language</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value as PreferredLanguage })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all appearance-none"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
                <option value="Marathi">Marathi</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-6 py-3.5 rounded-xl font-medium text-sm text-black bg-white hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-white/10 hover:shadow-white/20"
            >
              {isPending ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
