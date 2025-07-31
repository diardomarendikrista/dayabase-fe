import { API } from "axios/axios";
import { useState, useEffect } from "react";
import GridLayout from "react-grid-layout";
import ChartWidget from "./ChartWidget";

export default function DashboardPage() {
  const [questions, setQuestions] = useState([]);
  const [layout, setLayout] = useState([]);

  useEffect(() => {
    const fetchQuestionsForDashboard = async () => {
      try {
        const response = await API.get("/api/questions");
        // Untuk Test, kita ambil 3 pertanyaan pertama untuk ditampilkan
        const dashboardQuestions = response.data.slice(0, 3);
        setQuestions(dashboardQuestions);

        // Buat layout awal secara dinamis
        const initialLayout = dashboardQuestions.map((q, index) => ({
          i: q.id.toString(), // 'i' harus string
          x: (index % 2) * 6, // 2 kolom, lebar 6
          y: Math.floor(index / 2) * 4, // y bertambah setiap 2 item
          w: 6,
          h: 4,
        }));
        setLayout(initialLayout);
      } catch (error) {
        console.error("Gagal mengambil pertanyaan untuk dashboard", error);
      }
    };

    fetchQuestionsForDashboard();
  }, []);

  const onLayoutChange = (newLayout) => {
    // Nanti, fungsi ini akan menyimpan posisi baru ke database
    console.log("Layout berubah:", newLayout);
    setLayout(newLayout);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <GridLayout
        className="layout border"
        layout={layout}
        cols={12}
        rowHeight={30}
        width={1200}
        onLayoutChange={onLayoutChange}
      >
        {questions.map((q) => (
          <div
            key={q.id.toString()}
          >
            <ChartWidget questionId={q.id} />
          </div>
        ))}
      </GridLayout>
    </div>
  );
}
