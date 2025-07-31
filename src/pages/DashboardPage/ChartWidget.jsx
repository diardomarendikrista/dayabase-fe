import { useState, useEffect, useMemo } from "react";
import { API } from "axios/axios";
import useMeasure from "react-use-measure";

import BarChart from "components/organisms/charts/BarChart";
import LineChart from "components/organisms/charts/LineChart";
import DonutChart from "components/organisms/charts/DonutChart";
import ResultsTable from "components/organisms/charts/ResultsTable";

export default function ChartWidget({ questionId }) {
  const [question, setQuestion] = useState(null);
  const [results, setResults] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [ref, { width, height }] = useMeasure();

  useEffect(() => {
    const loadAndRunQuestion = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const qResponse = await API.get(`/api/questions/${questionId}`);
        const qDetails = qResponse.data;
        setQuestion(qDetails);

        const queryResponse = await API.post("/api/query/run", {
          sql: qDetails.sql_query,
          connectionId: qDetails.connection_id,
        });

        if (queryResponse.data && queryResponse.data.length > 0) {
          setResults(queryResponse.data);
          setColumns(Object.keys(queryResponse.data[0]));
        } else {
          setResults([]);
        }
      } catch (err) {
        setError("Gagal memuat data widget.");
      } finally {
        setIsLoading(false);
      }
    };

    loadAndRunQuestion();
  }, [questionId]);

  const transformedData = useMemo(() => {
    if (!question || !question.chart_config || results.length === 0)
      return null;
    const { category, value } = question.chart_config;
    if (!category || !value) return null;

    if (question.chart_type === "pie") {
      return {
        seriesData: results.map((row) => ({
          name: row[category],
          value: row[value],
        })),
      };
    }
    return {
      xAxisData: results.map((row) => row[category]),
      seriesData: results.map((row) => row[value]),
    };
  }, [results, question]);

  const renderContent = () => {
    if (isLoading)
      return <p className="text-center text-gray-500">Memuat...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!question)
      return (
        <p className="text-center text-gray-500">Tidak ada data pertanyaan.</p>
      );

    if (width < 50 || height < 50) {
      return (
        <p className="text-center text-gray-400 text-sm">
          Menyesuaikan ukuran...
        </p>
      );
    }
    const chartProps = {
      ...transformedData,
      width: width,
      height: height,
    };

    switch (question.chart_type) {
      case "bar":
        return (
          transformedData && (
            <BarChart
              {...chartProps}
              xAxisRotate="auto"
            />
          )
        );
      case "line":
        return transformedData && <LineChart {...chartProps} />;
      case "pie":
        return transformedData && <DonutChart {...chartProps} />;
      case "table":
      default:
        return (
          <ResultsTable
            columns={columns}
            data={results}
          />
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 h-full w-full p-4 flex flex-col">
      <h3 className="font-bold text-md mb-2 truncate flex-shrink-0">
        {question?.name || "Memuat..."}
      </h3>
      <div
        ref={ref}
        className="flex-1 min-h-0 w-full"
      >
        {renderContent()}
      </div>
    </div>
  );
}
