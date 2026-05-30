import { Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import LandingPage from "@/pages/LandingPage"
import ApplyPage from "@/pages/ApplyPage"
import DashboardPage from "@/pages/DashboardPage"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/apply" element={<ApplyPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </QueryClientProvider>
  )
}

export default App
