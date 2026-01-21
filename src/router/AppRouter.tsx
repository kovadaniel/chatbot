import { Routes, Route, Navigate, HashRouter } from "react-router-dom"
import SingleChatPage from "../pages/SingleChatPage"

export default function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<SingleChatPage />} />
        <Route path="/chat" element={<SingleChatPage />} />
        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Routes>
    </HashRouter>
  )
}
