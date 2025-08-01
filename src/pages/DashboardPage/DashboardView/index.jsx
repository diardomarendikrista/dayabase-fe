import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API } from "axios/axios";
import { Responsive, WidthProvider } from "react-grid-layout";
import ChartWidget from "./ChartWidget";

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function DashboardViewPage() {
  const { id } = useParams();
  const [dashboard, setDashboard] = useState(null);
  const [layout, setLayout] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await API.get(`/api/dashboards/${id}`);
        const data = response.data;
        setDashboard(data);

        // Ubah format layout dari backend agar sesuai dengan react-grid-layout
        const initialLayout = data.questions.map((q) => ({
          ...q.layout,
          i: q.id.toString(), // Pastikan 'i' adalah string
        }));
        setLayout(initialLayout);
      } catch (error) {
        console.error("Gagal mengambil data dashboard", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [id]);

  const handleLayoutChange = async (newLayout) => {
    setLayout(newLayout);
    try {
      await API.put(`/api/dashboards/${id}/layout`, newLayout);
    } catch (error) {
      console.error("Gagal menyimpan layout", error);
    }
  };

  const handleRemoveWidget = async (questionIdToRemove) => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin menghapus chart ini dari dashboard?"
      )
    ) {
      try {
        await API.delete(
          `/api/dashboards/${id}/questions/${questionIdToRemove}`
        );

        // Update state di frontend untuk UI yang instan
        setDashboard((prev) => ({
          ...prev,
          questions: prev.questions.filter((q) => q.id !== questionIdToRemove),
        }));
        setLayout((prev) =>
          prev.filter((l) => l.i !== questionIdToRemove.toString())
        );
      } catch (error) {
        console.error("Gagal menghapus widget dari dashboard", error);
        alert("Gagal menghapus widget.");
      }
    }
  };

  if (isLoading) return <p>Memuat dashboard...</p>;
  if (!dashboard) return <p>Dashboard tidak ditemukan.</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{dashboard.name}</h1>
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={30}
        onLayoutChange={(layout) => handleLayoutChange(layout)}
      >
        {dashboard.questions.map((q) => (
          <div key={q.id.toString()}>
            <ChartWidget
              questionId={q.id}
              onRemove={() => handleRemoveWidget(q.id)}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}
