const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("open");
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
        });
    });
}

let experimentResults = projectUpdate.models;
let selectedMetric = "accuracy";

function formatNumber(value) {
    return typeof value === "number" && Number.isFinite(value)
        ? value.toLocaleString()
        : "—";
}

function formatPercentage(value) {
    return typeof value === "number" && Number.isFinite(value)
        ? `${value}%`
        : "—";
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function updateDatasetDashboard() {
    const dataset = projectUpdate.dataset;
    const totalStudents = formatNumber(dataset.totalStudents);

    setText("dataStudents", totalStudents);
    setText("dataFeatures", formatNumber(dataset.inputFeatures));
    setText("dataMissing", formatNumber(dataset.missingValues));
    setText("dataTotalLabel", `${totalStudents} students`);

    ["Graduate", "Dropout", "Enrolled"].forEach(outcomeName => {
        const outcome = dataset.outcomes[outcomeName];
        const type = outcomeName.toLowerCase();
        const percentage = typeof outcome.percentage === "number"
            ? outcome.percentage
            : typeof outcome.count === "number" && dataset.totalStudents
                ? (outcome.count / dataset.totalStudents) * 100
                : null;

        setText(`${type}Value`, formatNumber(outcome.count));
        setText(
            `${type}Percent`,
            percentage === null
                ? "—"
                : `${Number(percentage.toFixed(2))}% of students`
        );

        const bar = document.getElementById(`${type}Bar`);
        if (bar) {
            const width = typeof percentage === "number"
                ? Math.min(100, Math.max(0, percentage))
                : 0;
            bar.style.width = `${width}%`;
        }
    });
}

function formatMetricName(metric) {
    const names = {
        accuracy: "Accuracy",
        precision: "Precision",
        recall: "Recall",
        f1: "F1-Score"
    };

    return names[metric] || metric;
}

function metricValue(model, metric) {
    const value = model[metric];
    return typeof value === "number" && Number.isFinite(value)
        ? value
        : null;
}

function getBestModel() {
    return experimentResults.reduce((best, model) => {
        const score = metricValue(model, "f1");
        const bestScore = best ? metricValue(best, "f1") : null;
        return score !== null && (bestScore === null || score > bestScore)
            ? model
            : best;
    }, null);
}

function updateModelSummary() {
    const bestModel = getBestModel();

    setText("modelsTested", String(experimentResults.length));
    setText("bestModelName", bestModel ? bestModel.name : "—");
    setText(
        "bestModelAccuracy",
        bestModel ? formatPercentage(bestModel.accuracy) : "—"
    );
    setText(
        "bestModelF1",
        bestModel ? formatPercentage(bestModel.f1) : "—"
    );
    setText("resultBestModel", bestModel ? bestModel.name : "—");
    setText(
        "resultAccuracy",
        bestModel ? formatPercentage(bestModel.accuracy) : "—"
    );
    setText("resultF1", bestModel ? formatPercentage(bestModel.f1) : "—");
    setText("findingBestModel", bestModel ? bestModel.name : "—");
    setText("findingModelCount", String(experimentResults.length));

    const baseline = experimentResults.find(
        model => model.name.toLowerCase() === "baseline"
    );
    const improvement = bestModel && baseline &&
        typeof bestModel.accuracy === "number" &&
        typeof baseline.accuracy === "number"
        ? bestModel.accuracy - baseline.accuracy
        : null;

    setText(
        "baselineImprovement",
        improvement === null ? "—" : `${improvement >= 0 ? "+" : ""}${improvement.toFixed(2)} pp`
    );

    const findingHeadline = document.getElementById("findingHeadline");
    if (findingHeadline) {
        findingHeadline.textContent = bestModel
            ? `${bestModel.name} produced the strongest overall result.`
            : "Add model results in update.js to show the strongest result.";
    }
}

function renderModelCards() {
    const grid = document.getElementById("modelResultsGrid");
    if (!grid) {
        return;
    }

    grid.replaceChildren();
    const bestModel = getBestModel();

    experimentResults.forEach((model, index) => {
        const card = document.createElement("article");
        const isBest = model === bestModel;
        card.className = `live-model-card${isBest ? " best-live-model" : ""}`;

        const top = document.createElement("div");
        top.className = "live-model-top";

        const number = document.createElement("span");
        number.textContent = String(index + 1).padStart(2, "0");

        const badge = document.createElement("strong");
        badge.textContent = isBest ? "BEST MODEL" : "TRAINED";
        top.append(number, badge);

        const heading = document.createElement("h3");
        heading.textContent = model.name;

        const score = document.createElement("div");
        score.className = "live-model-score";

        const metric = document.createElement("span");
        metric.textContent = formatMetricName(selectedMetric);

        const value = metricValue(model, selectedMetric);
        const scoreText = document.createElement("strong");
        scoreText.textContent = value === null ? "—" : `${value.toFixed(2)}%`;
        score.append(metric, scoreText);

        const track = document.createElement("div");
        track.className = "score-track";
        const fill = document.createElement("div");
        fill.className = "score-fill";
        fill.style.width = `${value === null ? 0 : Math.min(100, Math.max(0, value))}%`;
        track.append(fill);

        card.append(top, heading, score, track);
        grid.append(card);
    });
}

function renderModelChart() {
    const chart = document.getElementById("modelChart");
    if (!chart) {
        return;
    }

    chart.replaceChildren();
    setText("chartMetricTitle", formatMetricName(selectedMetric));

    experimentResults.forEach(model => {
        const value = metricValue(model, selectedMetric);
        const row = document.createElement("div");
        row.className = "chart-model-row";

        const name = document.createElement("div");
        name.className = "chart-model-name";
        name.textContent = model.name;

        const barArea = document.createElement("div");
        barArea.className = "chart-bar-area";
        const track = document.createElement("div");
        track.className = "chart-track";
        const fill = document.createElement("div");
        fill.className = "chart-fill";
        fill.style.width = `${value === null ? 0 : Math.min(100, Math.max(0, value))}%`;
        track.append(fill);
        barArea.append(track);

        const score = document.createElement("strong");
        score.textContent = value === null ? "—" : `${value.toFixed(2)}%`;

        row.append(name, barArea, score);
        chart.append(row);
    });
}

function renderProgress() {
    const timeline = document.getElementById("projectTimeline");
    if (!timeline) {
        return;
    }

    timeline.replaceChildren();
    const completed = projectUpdate.progress.filter(
        item => item.status === "completed"
    ).length;
    const active = projectUpdate.progress.filter(
        item => item.status === "current"
    ).length;
    const upcoming = projectUpdate.progress.length - completed - active;

    setText("completedMilestones", String(completed));
    setText("activeMilestones", String(active));
    setText("upcomingMilestones", String(upcoming));
    setText("progressLastUpdated", projectUpdate.lastUpdated);
    setText("footerLastUpdated", projectUpdate.lastUpdated);

    const progressFill = document.querySelector(".large-progress-fill");
    if (progressFill) {
        const percent = projectUpdate.progress.length
            ? ((completed + active) / projectUpdate.progress.length) * 100
            : 0;
        progressFill.style.width = `${percent}%`;
    }

    const statusLabels = {
        completed: "COMPLETED",
        current: "IN PROGRESS",
        next: "NEXT",
        upcoming: "UPCOMING"
    };

    projectUpdate.progress.forEach(item => {
        const article = document.createElement("article");
        article.className = `timeline-item${item.status === "completed" || item.status === "current" ? ` ${item.status}` : ""}`;

        const marker = document.createElement("div");
        marker.className = "timeline-marker";
        marker.textContent = item.status === "completed"
            ? "✓"
            : item.status === "current"
                ? "●"
                : "";

        const content = document.createElement("div");
        content.className = "timeline-content";

        const meta = document.createElement("div");
        meta.className = "timeline-meta";
        const status = document.createElement("span");
        status.textContent = statusLabels[item.status] || item.status.toUpperCase();
        const date = document.createElement("time");
        date.textContent = item.date;
        meta.append(status, date);

        const title = document.createElement("h3");
        title.textContent = item.title;
        const description = document.createElement("p");
        description.textContent = item.description;

        content.append(meta, title, description);
        article.append(marker, content);
        timeline.append(article);
    });
}

document.querySelectorAll(".metric-selector").forEach(button => {
    button.addEventListener("click", () => {
        selectedMetric = button.dataset.metric;

        document.querySelectorAll(".metric-selector").forEach(metricButton => {
            metricButton.classList.remove("active");
        });
        button.classList.add("active");

        renderModelCards();
        renderModelChart();
    });
});

const predictionForm = document.getElementById("predictionForm");
const clearPrediction = document.getElementById("clearPrediction");

if (predictionForm) {
    predictionForm.addEventListener("submit", event => {
        event.preventDefault();
        const message = document.querySelector("#resultEmpty p");
        if (message) {
            message.textContent =
                "Predictions are unavailable because this static website has no connected model backend.";
        }
    });
}

if (clearPrediction && predictionForm) {
    clearPrediction.addEventListener("click", () => {
        predictionForm.reset();
        const message = document.querySelector("#resultEmpty p");
        if (message) {
            message.textContent =
                "Connect a trained model backend to enable student outcome predictions.";
        }
    });
}

updateDatasetDashboard();
updateModelSummary();
renderModelCards();
renderModelChart();
renderProgress();
