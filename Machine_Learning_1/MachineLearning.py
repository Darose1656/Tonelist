from flask import Flask, jsonify
import pandas as pd
from sklearn.linear_model import LinearRegression

app = Flask(__name__)

@app.route('/run-ml')
def run_ml():
    # Example dataset
    data = {'Feature': [1, 2, 3, 4], 'Target': [2, 4, 6, 8]}
    df = pd.DataFrame(data)

    X = df[['Feature']]
    y = df['Target']

    model = LinearRegression()
    model.fit(X, y)

    prediction = model.predict([[5]])  # Example prediction for input 5
    return jsonify({'result': prediction[0]})

if __name__ == '__main__':
    app.run(debug=True)