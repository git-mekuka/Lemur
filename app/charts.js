const clickButtonsChart = document.getElementById("clickButtonsChart");
const visitChart = document.getElementById("visitChart");
const clickLinksChart = document.getElementById("clickLinksChart");

let visitChartInstance = null;
let clickButtonsChartInstance = null;
let clickLinksChartInstance = null;

function Charts(eventMetrics, action = null) {
  if (action === "update") {

    if (visitChartInstance) {
      visitChartInstance.data.labels = eventMetrics[1].day;
      visitChartInstance.data.datasets[0].data = eventMetrics[1].metrics;
      visitChartInstance.update();
    }

    if (clickButtonsChartInstance) {
      clickButtonsChartInstance.data.labels = eventMetrics[0].day;
      clickButtonsChartInstance.data.datasets[0].data = eventMetrics[0].metrics;
      clickButtonsChartInstance.update();
    }

    if (clickLinksChartInstance) {
      clickLinksChartInstance.data.labels = eventMetrics[2].day;
      clickLinksChartInstance.data.datasets[0].data = eventMetrics[2].metrics;
      clickLinksChartInstance.update();
    }
    console.log("Чарты обновленны");
  } else {

    if (visitChartInstance) visitChartInstance.destroy();
    if (clickButtonsChartInstance) clickButtonsChartInstance.destroy();
    if (clickLinksChartInstance) clickLinksChartInstance.destroy();

    visitChartInstance = new Chart(visitChart, {
      type: "line",
      data: {
        labels: eventMetrics[1].day,
        datasets: [
          {
            label: "# Посещений веб-ресурса",
            data: eventMetrics[1].metrics,
            borderWidth: 2, 
            borderColor: "rgba(255, 65, 119, 0.9)", 
            pointBackgroundColor: "rgba(255, 65, 119, 0.9)",
            pointRadius: 2,
            pointHoverRadius: 4,
            tension: 0.1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: "#252525" },
            ticks: { color: "#5e5e5e" },
          },
          x: {
            grid: { color: "#252525" },
            ticks: { color: "#5e5e5e" }, 
          },
        },
        plugins: {
          legend: {
            labels: {
              color: "#FFFFFF",
            },
          },
        },
        elements: {
          line: {
            tension: 0.1, 
          },
        },
      },
    });

    clickButtonsChartInstance = new Chart(clickButtonsChart, {
      type: "bar",
      data: {
        labels: eventMetrics[0].day,
        datasets: [
          {
            label: "Выполнилось событие",
            data: eventMetrics[0].metrics,
            borderWidth: 1,
            backgroundColor: "rgba(65, 255, 230, 0.66)",
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: "#252525" },
          },
          x: {
            grid: { color: "#252525" },
          },
        },
        color: "#FFFFFF",
      },
    });

    clickLinksChartInstance = new Chart(clickLinksChart, {
      type: "bar",
      data: {
        labels: eventMetrics[2].day,
        datasets: [
          {
            label: "Выполнилось событие",
            data: eventMetrics[2].metrics,
            borderWidth: 1,
            backgroundColor: "rgba(163, 65, 255, 0.66)",
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: "#252525" },
          },
          x: {
            grid: { color: "#252525" },
          },
        },
        color: "#FFFFFF",
      },
    });
  }
}
