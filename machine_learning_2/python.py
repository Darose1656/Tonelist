import re 
import os
import requests
import numpy as np
import matplotlib.pyplot as plt
from io import BytesIO
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.cluster import KMeans
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score, silhouette_score
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from transformers import GPT2LMHeadModel, GPT2Tokenizer, Trainer, TrainingArguments
from sentence_transformers import SentenceTransformer
import gym
from gym import spaces

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize Groq client
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# Initialize models for fine-tuning and RAG
tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
model = GPT2LMHeadModel.from_pretrained("gpt2")
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

# Load and prepare Iris dataset for traditional ML components
iris = load_iris()
X, y = iris.data, iris.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# ========================
# Machine Learning Models
# ========================

class MLModels:
    def __init__(self):
        # Decision Tree and Random Forest
        self.dt = DecisionTreeClassifier(random_state=42)
        self.rf = RandomForestClassifier(n_estimators=100, random_state=42)
        
        # Support Vector Machine
        self.svm = SVC(kernel='rbf', probability=True, random_state=42)
        
        # Clustering
        self.kmeans = KMeans(n_clusters=3, random_state=42)
        self.scaler = StandardScaler()
        
        # Train models
        self.train_models()
        
        # Reinforcement Learning Environment
        self.rl_env = MusicComposerEnv()

    def train_models(self):
        # Decision Tree and Random Forest
        self.dt.fit(X_train, y_train)
        self.rf.fit(X_train, y_train)
        
        # SVM
        self.svm.fit(X_train, y_train)
        
        # Clustering
        X_scaled = self.scaler.fit_transform(X)
        self.kmeans.fit(X_scaled)

    def evaluate_models(self):
        dt_pred = self.dt.predict(X_test)
        rf_pred = self.rf.predict(X_test)
        svm_pred = self.svm.predict(X_test)
        
        return {
            'decision_tree': {
                'accuracy': accuracy_score(y_test, dt_pred),
                'f1': f1_score(y_test, dt_pred, average='weighted')
            },
            'random_forest': {
                'accuracy': accuracy_score(y_test, rf_pred),
                'f1': f1_score(y_test, rf_pred, average='weighted')
            },
            'svm': {
                'accuracy': accuracy_score(y_test, svm_pred),
                'f1': f1_score(y_test, svm_pred, average='weighted')
            }
        }

# ===========================
# Reinforcement Learning Env
# ===========================

class MusicComposerEnv(gym.Env):
    def __init__(self):
        self.action_space = spaces.Discrete(3)  # 0: DT, 1: RF, 2: SVM
        self.observation_space = spaces.Box(low=0, high=1, shape=(4,))
        self.reward_history = []
        
    def reset(self):
        return X_test[0]  # Return first test sample
    
    def step(self, action):
        model = ml_models.dt if action == 0 else ml_models.rf if action == 1 else ml_models.svm
        pred = model.predict([self.observation])
        reward = 1 if pred[0] == y_test[0] else -1
        self.reward_history.append(reward)
        return self.observation, reward, True, {}

# Initialize ML components
ml_models = MLModels()

# ========================
# Visualization Functions
# ========================

def plot_clusters():
    plt.figure(figsize=(8, 6))
    X_scaled = ml_models.scaler.transform(X)
    pca = PCA(n_components=2)
    reduced = pca.fit_transform(X_scaled)
    plt.scatter(reduced[:, 0], reduced[:, 1], c=ml_models.kmeans.labels_)
    plt.title("K-Means Clustering Results")
    plt.xlabel("PCA Component 1")
    plt.ylabel("PCA Component 2")
    img = BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    return img

def plot_elbow():
    distortions = []
    K_range = range(1, 6)
    X_scaled = ml_models.scaler.transform(X)
    
    for k in K_range:
        kmeans = KMeans(n_clusters=k, random_state=42)
        kmeans.fit(X_scaled)
        distortions.append(kmeans.inertia_)
    
    plt.figure(figsize=(8, 6))
    plt.plot(K_range, distortions, 'bx-')
    plt.xlabel('Number of clusters')
    plt.ylabel('Distortion')
    plt.title('Elbow Method')
    img = BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    return img

# ========================
# Flask Routes
# ========================

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/ml_models")
def model_dashboard():
    # Model evaluations
    metrics = ml_models.evaluate_models()
    
    # Clustering visuals
    cluster_img = plot_clusters()
    elbow_img = plot_elbow()
    
    # RL rewards
    rewards = ml_models.rl_env.reward_history
    
    return render_template("ml_dashboard.html",
                           metrics=metrics,
                           cluster_plot=cluster_img.read().decode('latin1'),
                           elbow_plot=elbow_img.read().decode('latin1'),
                           rewards=rewards)

# Existing chat functionality remains unchanged
# ...

if __name__ == "__main__":
    app.run(debug=True)