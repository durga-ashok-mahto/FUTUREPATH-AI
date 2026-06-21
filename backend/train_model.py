import os
import csv
import pickle
import random

# ==========================================
# Pure Python Decision Tree Classifier - Imported from model_loader
# ==========================================
from model_loader import PureDecisionTreeClassifier, DecisionNode

# ==========================================
# ML Pipeline Execution Logic
# ==========================================
def run_pure_ml_pipeline():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(base_dir, "datasets", "career_dataset.csv")
    model_dir = os.path.join(base_dir, "models")
    model_path = os.path.join(model_dir, "model.pkl")
    
    # 1. Load Dataset using native CSV module
    print(f"Loading dataset from: {dataset_path}")
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"Dataset not found at {dataset_path}. Run generate_dataset.py first.")
        
    raw_data = []
    with open(dataset_path, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            raw_data.append(row)
            
    # 2. Data Cleaning & Encoding Mappings
    coding_map = {"Low": 0, "Medium": 1, "High": 2}
    comm_map = {"Low": 0, "Medium": 1, "High": 2}
    interest_map = {
        "AI": 0,
        "Data Science": 1,
        "Web Development": 2,
        "Cybersecurity": 3,
        "UI/UX Design": 4,
        "Cloud Computing": 5
    }
    
    encoded_data = []
    for row in raw_data:
        # Convert numeric and map categories
        cgpa = float(row["CGPA"])
        coding = coding_map.get(row["CodingSkill"].strip(), 1)
        comm = comm_map.get(row["CommunicationSkill"].strip(), 1)
        aptitude = int(row["AptitudeLevel"])
        interest = interest_map.get(row["InterestArea"].strip(), 2)
        career = row["CareerPath"].strip()
        
        # Build features vector + target class
        encoded_data.append([cgpa, coding, comm, aptitude, interest, career])
        
    # 3. Train-Test Split (80% Train, 20% Test)
    # Set a seed to make it reproducible
    random.seed(42)
    random.shuffle(encoded_data)
    
    split_idx = int(len(encoded_data) * 0.8)
    train_set = encoded_data[:split_idx]
    test_set = encoded_data[split_idx:]
    
    # 4. Train Model
    print("Training pure-Python Decision Tree Classifier...")
    clf = PureDecisionTreeClassifier(max_depth=5)
    clf.fit(train_set)
    
    # 5. Evaluate Accuracy
    y_test = [row[-1] for row in test_set]
    y_pred = clf.predict(test_set)
    
    correct = sum(1 for true, pred in zip(y_test, y_pred) if true == pred)
    accuracy = correct / len(test_set)
    
    # 6. Save Model using pickle serialization
    os.makedirs(model_dir, exist_ok=True)
    with open(model_path, "wb") as file:
        pickle.dump(clf, file)
    print(f"Model saved successfully to: {model_path}")

    # Save metadata JSON file containing model parameters & metrics
    import json
    metadata = {
        "dataset_size": len(encoded_data),
        "training_size": len(train_set),
        "testing_size": len(test_set),
        "accuracy": round(accuracy * 100, 2),
        "algorithm": "Decision Tree Classifier",
        "learning_type": "Supervised Learning",
        "dataset_type": "Career Prediction Dataset (CSV)",
        "evaluation_method": "Train-Test Split",
        "purpose": "Predict the most suitable career path based on student skills and interests"
    }
    metadata_path = os.path.join(model_dir, "metadata.json")
    with open(metadata_path, "w") as file:
        json.dump(metadata, file, indent=4)
    print(f"Model metadata saved successfully to: {metadata_path}")
    
    # Display Internship Evaluation Report
    print("=" * 45)
    print("      FuturePath AI Model Training Report     ")
    print("=" * 45)
    print(f"Dataset Size:      {len(encoded_data)} records")
    print(f"Training Size:     {len(train_set)} records (80%)")
    print(f"Testing Size:      {len(test_set)} records (20%)")
    print(f"Accuracy Score:    {accuracy * 100:.2f}%")
    print("=" * 45)

if __name__ == "__main__":
    run_pure_ml_pipeline()
