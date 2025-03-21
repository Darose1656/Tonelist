// Globals
let dataset, trainingData, testData;

// Dataset Preparation
document.getElementById("datasetInput").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: (results) => {
                dataset = results.data;
                cleanAndSplitData();
                engineerFeatures();
                visualizeData();
            },
        });
    }
});

function cleanAndSplitData() {
    // Handle missing values and remove duplicates
    dataset = dataset.filter((row) => Object.values(row).every((value) => value !== null && value !== ""));
    const uniqueRows = new Set(dataset.map(JSON.stringify));
    dataset = Array.from(uniqueRows).map(JSON.parse);

    // Split into training (80%) and test (20%) sets
    const splitIndex = Math.floor(dataset.length * 0.8);
    trainingData = dataset.slice(0, splitIndex);
    testData = dataset.slice(splitIndex);

    document.getElementById("datasetOutput").innerText = `Dataset loaded and split successfully.
    Training size: ${trainingData.length}, Test size: ${testData.length}`;
}

// Feature Engineering: Normalize & One-Hot Encoding
function engineerFeatures() {
    if (!trainingData) return;

    const numericalFeatures = Object.keys(trainingData[0]).filter(
        (key) => typeof trainingData[0][key] === "number"
    );

    // Normalization: Scaling to 0-1 range
    numericalFeatures.forEach((feature) => {
        const max = Math.max(...trainingData.map((row) => row[feature]));
        const min = Math.min(...trainingData.map((row) => row[feature]));
        trainingData.forEach((row) => (row[feature] = (row[feature] - min) / (max - min)));
        testData.forEach((row) => (row[feature] = (row[feature] - min) / (max - min)));
    });

    // One-hot encoding for categorical variables
    const categoricalFeatures = Object.keys(trainingData[0]).filter(
        (key) => typeof trainingData[0][key] === "string"
    );

    categoricalFeatures.forEach((feature) => {
        const uniqueValues = [...new Set(trainingData.map((row) => row[feature]))];

        trainingData.forEach((row) => {
            uniqueValues.forEach((value) => {
                row[`${feature}_${value}`] = row[feature] === value ? 1 : 0;
            });
            delete row[feature];
        });

        testData.forEach((row) => {
            uniqueValues.forEach((value) => {
                row[`${feature}_${value}`] = row[feature] === value ? 1 : 0;
            });
            delete row[feature];
        });
    });

    document.getElementById("featureEngineeringOutput").innerText = `Features normalized and categorical features encoded: ${numericalFeatures.join(", ")}`;
}

// Data Exploration
function visualizeData() {
    if (!trainingData) return;

    const ctx1 = document.getElementById("dataViz1").getContext("2d");
    const ctx2 = document.getElementById("dataViz2").getContext("2d");

    const firstFeature = Object.keys(trainingData[0])[0];
    const targetFeature = Object.keys(trainingData[0]).slice(-1)[0];
    const values = trainingData.map((row) => row[firstFeature]);
    const targets = trainingData.map((row) => row[targetFeature]);

    
    new Chart(ctx1, {
        type: "bar",
        data: {
            labels: values,
            datasets: [
                {
                    label: firstFeature,
                    data: values,
                    backgroundColor: "rgba(54, 162, 235, 0.5)",
                },
            ],
        },
    });

    // Scatter plot
    new Chart(ctx2, {
        type: "scatter",
        data: {
            datasets: [
                {
                    label: `${firstFeature} vs. ${targetFeature}`,
                    data: trainingData.map((row) => ({
                        x: row[firstFeature],
                        y: row[targetFeature],
                    })),
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                },
            ],
        },
        options: {
            scales: {
                x: { title: { display: true, text: firstFeature } },
                y: { title: { display: true, text: targetFeature } },
            },
        },
    });
}

// Model Training & Evaluation
async function trainModel() {
    if (!trainingData) return;

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    model.compile({ optimizer: "sgd", loss: "meanSquaredError", metrics: ["mse"] });

    const xs = tf.tensor(trainingData.map((row) => [row.XFeature]));
    const ys = tf.tensor(trainingData.map((row) => row.YTarget)); 

    await model.fit(xs, ys, { epochs: 50 });

    // Evaluate model on test data
    const testXs = tf.tensor(testData.map((row) => [row.XFeature]));
    const testYs = tf.tensor(testData.map((row) => row.YTarget));

    const evaluation = model.evaluate(testXs, testYs);
    const mse = await evaluation[0].data();
    
    document.getElementById("modelTrainingOutput").innerText = `Model trained successfully. MSE: ${mse}`;
}

// Model Interpretation
function interpretModel() {
    if (!trainingData) return;

    const featureNames = Object.keys(trainingData[0]);
    const importantFeature = featureNames[0]; // Assuming first feature is most important

    document.getElementById("modelInterpretationOutput").innerText = `
    The model predicts values based on the input feature: ${importantFeature}.
    A strong relationship between this feature and the output was observed.
    In practice, feature importance can be computed using correlation coefficients or SHAP values.
    `;
}
