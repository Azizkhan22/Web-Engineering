async function fetchAndVisualizeData() {
    const loadingEl = document.getElementById("loading");
    const errorEl = document.getElementById("error");

    loadingEl.classList.remove("hidden");
    errorEl.classList.add("hidden");

    try {
const response = await fetch("https://raw.githubusercontent.com/Azizkhan22/Web-Engineering/refs/heads/main/revenue.json");

        const jsonData = await response.json();

        const rawData = jsonData.record.monthly_revenue;
        console.log("Raw Data:", rawData);

        const processed = processData(rawData);
        renderChart(processed);

    } catch (err) {
        console.error(err);
        errorEl.classList.remove("hidden");
    } finally {
        loadingEl.classList.add("hidden");
    }
}

function processData(rawData) {
    const labels = rawData.map(item => item.month);
    const dataPoints = rawData.map(item => item.amount);

    return { labels, dataPoints };
}

let chartInstance = null;

function renderChart(processedData) {
    const ctx = document.getElementById("revenueChart");

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: processedData.labels,
            datasets: [
                {
                    label: "Monthly Revenue",
                    data: processedData.dataPoints,
                    borderWidth: 3,
                    borderColor: "rgba(99, 102, 241, 1)",
                    backgroundColor: "rgba(99, 102, 241, 0.4)",
                    fill: true,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: "white" } }
            },
            scales: {
                x: { ticks: { color: "white" } },
                y: { ticks: { color: "white" } }
            }
        }
    });
}
