// src/App.jsx
import { Routes, Route, BrowserRouter } from "react-router-dom";
import MainLayout from "layouts/MainLayout";

// Impor halaman-halaman baru Anda
import QuestionEditorPage from "pages/QuestionEditorPage";
import QuestionsListPage from "pages/QuestionsListPage";
import ConnectionsPage from "pages/ConnectionsPage";
import MVP from "pages/MVP";
import ConnectionFormPage from "pages/ConnectionsPage/ConnectionFormPage";
import DashboardPage from "pages/DashboardPage";
// import DashboardPage from './pages/DashboardPage'; // Untuk nanti

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={<MVP />}
          />
        </Route>

        <Route element={<MainLayout />}>
          {/* <Route path="/" element={<DashboardPage />} /> */}

          {/* Rute untuk Questions */}
          <Route
            path="/questions"
            element={<QuestionsListPage />}
          />
          <Route
            path="/questions/new"
            element={<QuestionEditorPage />}
          />
          <Route
            path="/questions/:id"
            element={<QuestionEditorPage />}
          />

          {/* Rute untuk Connections */}
          <Route
            path="/settings/connections"
            element={<ConnectionsPage />}
          />
          <Route
            path="/settings/connections/new"
            element={<ConnectionFormPage />}
          />
          <Route
            path="/settings/connections/:id/edit"
            element={<ConnectionFormPage />}
          />
          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
