import Chart from "react-apexcharts"
import { useState } from "react"

interface GradeDistribution {
  name: string;
  series: ApexAxisChartSeries;
}

const apexChartOptions = {
  plotOptions: {
    bar: {
      distributed: true
    }
  },
  dataLabels: {
    enabled: false
  },
  legend: {
    show: false
  },
  colors: [
    '#79ff57',
    '#92ff57',
    '#abff57',
    '#c4ff57',
    '#ddff57',
    '#f7ff57',
    '#ffee57',
    '#ffd557',
    '#ffbc57',
    '#ffa357',
    '#ff8957',
    '#ff7057',
    '#ff5757',
    '#b8b8b8',
  ],
  chart: {
    toolbar: {
      show: false
    },
    id: 'grade-distribution'
  },
  xaxis: {
    categories: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F', 'W']
  }
}

export const ProfileGrades = () => {
  const [page, setPage] = useState(0);

  const gradeDistributionData: GradeDistribution[] = [
    {
      name: "MATH 2418.003 (18S)",
      series: [{
        name: 'Students',
        data: [30, 40, 35, 50, 49, 60, 70, 79, 80, 10, 24, 65, 12, 50]
      }]
    },
    {
      name: "MATH 2418.003 (17S)",
      series: [{
        name: 'Students',
        data: [10, 40, 35, 50, 29, 65, 70, 79, 30, 15, 24, 35, 12, 20]
      }]
    },
  ]

  const prevPage = () => {
    if (page == 0) {
      setPage(gradeDistributionData.length - 1)
    } else {
      setPage(page - 1)
    }
  }

  const nextPage = () => {
    if (page == gradeDistributionData.length - 1) {
      setPage(0)
    } else {
      setPage(page + 1)
    }
  }

  return (
    <>
      <header className="bg-blue-dark rounded-t-2xl flex py-2">
        <button onClick={prevPage} className="flex-auto text-center">icon</button>
        <h2 className="flex-auto text-center text-white mx-auto">{gradeDistributionData[page].name}</h2>
        <button onClick={nextPage} className="flex-auto text-center">icon</button>
      </header>
      <div className="border-blue-dark border-r-2 border-l-2 border-b-2 rounded-b-2xl">
        <Chart options={apexChartOptions} series={gradeDistributionData[page].series} type="bar" width={320}></Chart>
      </div>
    </>
  )
}