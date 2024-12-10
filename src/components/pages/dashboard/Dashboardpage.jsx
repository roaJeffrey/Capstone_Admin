import React, { useState, useEffect } from "react";
import { account, databases } from "../../../appwrite/AppwriteConfig";
import { usePagecontext } from "../../layout/Pagecontext";
import Countbox from "../../common/Countbox";
import Section from "../../common/Section";
import Main from "../../common/Main";
import Page from "../../common/Page";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart elements
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboardpage = () => {
  const { setPageTitle, setPageDescription } = usePagecontext();
  const [loading, setLoading] = useState(true);
  const [diseaseCounts, setDiseaseCounts] = useState({
    "coffee rust": 0,
    cercospora: 0,
    phoma: 0,
  });
  const [monthlyTotals, setMonthlyTotals] = useState(Array(12).fill(0));
  const [monthlyDiseaseMap, setMonthlyDiseaseMap] = useState([]);
  const [availableYears, setAvailableYears] = useState([]); // List of years based on dataset
  const [year, setYear] = useState(new Date().getFullYear()); // Default to current year

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const user = await account.get();
        const fullName = user.name || "Admin";
        setPageTitle(fullName || "Admin");
      } catch (error) {
        setPageTitle("Admin");
      }
    };

    fetchAdminDetails();
    setPageDescription("Management Dashboard");
  }, [setPageTitle, setPageDescription]);

  useEffect(() => {
    const fetchDiseaseCounts = async () => {
      try {
        const diseaseResponse = await databases.listDocuments(
          "673b418100295c788a93",
          "673b41e20028c51fd641"
        );

        const yearsSet = new Set(); // Keep track of years in the dataset
        const newMonthlyTotals = Array(12).fill(0); // Reset monthly totals
        const newMonthlyDiseaseMap = Array(12).fill(null).map(() => ({
          "coffee rust": 0,
          cercospora: 0,
          phoma: 0,
        }));

        diseaseResponse.documents.forEach((doc) => {
          const creationDate = new Date(doc.$createdAt);
          const diseaseYear = creationDate.getFullYear();
          const diseaseMonth = creationDate.getMonth(); // 0 = January, 11 = December
          const diseaseName = doc.diseasename.toLowerCase();

          yearsSet.add(diseaseYear);

          if (diseaseYear === year) {
            newMonthlyTotals[diseaseMonth] += 1;

            if (newMonthlyDiseaseMap[diseaseMonth][diseaseName] !== undefined) {
              newMonthlyDiseaseMap[diseaseMonth][diseaseName] += 1;
            }
          }
        });

        setAvailableYears([...yearsSet].sort()); // Update available years dynamically
        setMonthlyTotals(newMonthlyTotals);
        setMonthlyDiseaseMap(newMonthlyDiseaseMap);

        const totalCounts = newMonthlyDiseaseMap.reduce(
          (totals, month) => {
            Object.keys(month).forEach((disease) => {
              totals[disease] += month[disease];
            });
            return totals;
          },
          { "coffee rust": 0, cercospora: 0, phoma: 0 }
        );

        setDiseaseCounts(totalCounts);
      } catch (error) {
        console.error("Error fetching disease data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiseaseCounts();
  }, [year]);

  const chartData = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        data: monthlyTotals,
        borderColor: "#3e735b",
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const monthIndex = context.dataIndex;
            const diseasesInMonth = monthlyDiseaseMap[monthIndex];
            const maxDisease = Object.keys(diseasesInMonth).reduce((max, disease) =>
              diseasesInMonth[disease] > diseasesInMonth[max] ? disease : max
            );
            const maxCount = diseasesInMonth[maxDisease];
            return `${maxDisease.charAt(0).toUpperCase() + maxDisease.slice(1)}: ${maxCount} cases`;
          },
        },
        displayColors: false,
      },
      legend: {
        display: false, // Hide the legend
      },
    },
  };

  return (
    <Page>
      {/* Main Content */}
      <Main>
        {/* Leaf Count Section */}
        <section className="grid grid-cols-3 sm:grid-cols-3 gap-3 my-21 mb-5 ">
          {Object.entries(diseaseCounts).map(([disease, count]) => {
            const bgColors = {
              "coffee rust": "bg-custom-yellow shadow-md",
              cercospora: "bg-custom-teal shadow-md",
              phoma: "bg-custom-red shadow-md",
            };

            const bgColor = bgColors[disease] || "bg-gray-200";

            return <Countbox disease={disease} bgColor={bgColor} count={count} />;
          })}
        </section>

        {/* Disease Counts Graph Card */}
        <Section title={`Detected Diseases Overview`}>
          {/* Year Selector */}
          <div className="mb-5">
            <label htmlFor="year" className="mr-3">Select Year:</label>
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="px-4 py-2 border rounded-md"
            >
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
          <div className="h-[18rem]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </Section>
      </Main>
    </Page>
  );
};

export default Dashboardpage;
