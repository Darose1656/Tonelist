import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs'; // Import TensorFlow.js

function MainPage() {
  const [feature, setFeature] = useState('');
  const [result, setResult] = useState(null);

  const runMLModel = async () => {
    // Create a simple linear regression model
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

    // Example dataset: [Features] and [Labels]
    const xs = tf.tensor([1, 2, 3, 4]);
    const ys = tf.tensor([2, 4, 6, 8]);

    // Train the model
    await model.fit(xs, ys, { epochs: 200 });

    // Make a prediction for the input provided by the user
    const input = parseFloat(feature);
    const prediction = model.predict(tf.tensor([input]));
    prediction.print(); // Logs the result in the console

    const predictedValue = (await prediction.data())[0]; // Get the predicted value
    setResult(predictedValue); // Set the result to display on the UI
  };

  return (
    <div>
      <h1>Machine Learning with React & TensorFlow.js</h1>
      <input
        type="number"
        value={feature}
        onChange={(e) => setFeature(e.target.value)}
        placeholder="Enter a number"
      />
      <button onClick={runMLModel}>Predict</button>
      {result !== null && <h2>Prediction: {result}</h2>}
    </div>
  );
}

export default MainPage;