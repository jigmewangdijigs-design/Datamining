// Edit this object to update the static project dashboard and progress timeline.
const projectUpdate = {
    lastUpdated: "2 November 2026",
    dataset: {
        totalStudents: null,
        inputFeatures: null,
        missingValues: null,
        outcomes: {
            Graduate: { count: null, percentage: null },
            Dropout: { count: null, percentage: null },
            Enrolled: { count: null, percentage: null }
        }
    },
    // Add models with percentage values; the highest F1-score is selected as best.
    // Example shape: { name: "Model name", accuracy: 90, precision: 90, recall: 90, f1: 90 }
    models: [],
    progress: [
        {
            status: "completed",
            date: "October 2026",
            title: "Project Topic Selected",
            description: "Student Dropout Prediction selected as the semester data-mining research topic."
        },
        {
            status: "completed",
            date: "October 2026",
            title: "Research Direction Defined",
            description: "Classification selected as the main research track and CRISP-DM as the project methodology."
        },
        {
            status: "current",
            date: "November 2026",
            title: "Dataset Preparation & Website",
            description: "Preparing the project data and developing the public research webpage."
        },
        {
            status: "next",
            date: "November 2026",
            title: "Model Training & Evaluation",
            description: "Train the selected algorithms and compare their classification performance."
        },
        {
            status: "upcoming",
            date: "November 2026",
            title: "Final Paper & Presentation",
            description: "Complete the research paper, findings, presentation and supporting project files."
        }
    ]
};
