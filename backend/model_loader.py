import os
import pickle

# ==========================================
# Pure Python Decision Tree Class Definitions
# Contains full fit() and predict() algorithms
# ==========================================
class DecisionNode:
    def __init__(self, feature_idx=None, threshold=None, left=None, right=None, value=None):
        self.feature_idx = feature_idx  # index of feature to split on
        self.threshold = threshold      # threshold value to split on
        self.left = left                # left child Node
        self.right = right              # right child Node
        self.value = value              # class label (if leaf node)

    def is_leaf(self):
        return self.value is not None

class PureDecisionTreeClassifier:
    def __init__(self, max_depth=5):
        self.max_depth = max_depth
        self.root = None

    def _gini_impurity(self, groups):
        """Calculates Gini Impurity for a split."""
        total_samples = sum(len(group) for group in groups)
        if total_samples == 0:
            return 0
            
        gini = 0.0
        for group in groups:
            size = len(group)
            if size == 0:
                continue
            score = 0.0
            classes = [row[-1] for row in group]
            class_counts = {}
            for c in classes:
                class_counts[c] = class_counts.get(c, 0) + 1
                
            for count in class_counts.values():
                p = count / size
                score += p ** 2
            gini += (1.0 - score) * (size / total_samples)
        return gini

    def _test_split(self, index, value, dataset):
        """Splits a dataset based on a feature and threshold value."""
        left, right = [], []
        for row in dataset:
            if row[index] < value:
                left.append(row)
            else:
                right.append(row)
        return left, right

    def _get_best_split(self, dataset):
        """Finds the optimal feature index and threshold to split the dataset."""
        best_index, best_value, best_score, best_groups = 999, 999, 999, None
        n_features = len(dataset[0]) - 1
        for index in range(n_features):
            for row in dataset:
                groups = self._test_split(index, row[index], dataset)
                gini = self._gini_impurity(groups)
                if gini < best_score:
                    best_index, best_value, best_score, best_groups = index, row[index], gini, groups
        return {'index': best_index, 'value': best_value, 'groups': best_groups}

    def _to_terminal(self, group):
        """Creates a leaf node value (majority class selection)."""
        outcomes = [row[-1] for row in group]
        if not outcomes:
            return "Web Developer"
        return max(set(outcomes), key=outcomes.count)

    def _build_tree(self, node_data, depth):
        """Recursively builds the tree structure."""
        left, right = node_data['groups']
        del(node_data['groups'])
        
        if not left or not right:
            val = self._to_terminal(left + right)
            return DecisionNode(value=val)
            
        if depth >= self.max_depth:
            return DecisionNode(
                feature_idx=node_data['index'],
                threshold=node_data['value'],
                left=DecisionNode(value=self._to_terminal(left)),
                right=DecisionNode(value=self._to_terminal(right))
            )
            
        if len(left) <= 1:
            left_node = DecisionNode(value=self._to_terminal(left))
        else:
            left_split = self._get_best_split(left)
            left_node = self._build_tree(left_split, depth + 1)
            
        if len(right) <= 1:
            right_node = DecisionNode(value=self._to_terminal(right))
        else:
            right_split = self._get_best_split(right)
            right_node = self._build_tree(right_split, depth + 1)
            
        return DecisionNode(
            feature_idx=node_data['index'],
            threshold=node_data['value'],
            left=left_node,
            right=right_node
        )

    def fit(self, dataset):
        """Fits the Decision Tree to the dataset."""
        root_split = self._get_best_split(dataset)
        self.root = self._build_tree(root_split, 1)

    def _predict_row(self, node, row):
        if node.is_leaf():
            return node.value
        if row[node.feature_idx] < node.threshold:
            return self._predict_row(node.left, row)
        else:
            return self._predict_row(node.right, row)

    def predict(self, dataset):
        predictions = []
        for row in dataset:
            predictions.append(self._predict_row(self.root, row))
        return predictions


# ==========================================
# Flask Backend Model Loader Wrapper
# ==========================================
class ModelLoader:
    def __init__(self, model_path="models/model.pkl"):
        self.model_path = model_path
        self.model = None
        self.load_model()

    def load_model(self):
        """Safely loads the trained machine learning model from pickle binary."""
        base_dir = os.path.dirname(os.path.abspath(__file__))
        target_path = os.path.join(base_dir, self.model_path)
        
        print(f"Model Loader targeting: {target_path}")
        if os.path.exists(target_path):
            try:
                with open(target_path, "rb") as file:
                    self.model = pickle.load(file)
                print("Successfully loaded career prediction Decision Tree model (Pure Python classifier).")
            except Exception as e:
                print(f"Error loading model pickle file: {e}")
        else:
            print(f"Warning: Model file not found at {target_path}. Running with deterministic mock router fallback.")

    def predict(self, cgpa, coding_skill, comm_skill, aptitude_level, interest_area):
        """
        Accepts raw input features from request payload, encodes them,
        runs classifier prediction, and returns the result.
        """
        if self.model is not None:
            try:
                # Encode raw string features into numeric indexes matching training data
                coding_mapping = {"beginner": 0, "intermediate": 1, "advanced": 2}
                comm_mapping = {"developing": 0, "competent": 1, "excellent": 2}
                interest_mapping = {
                    "ai": 0,
                    "ds": 1,
                    "wd": 2,
                    "cs": 3,
                    "uiux": 4,
                    "cloud": 5
                }
                
                coding_encoded = coding_mapping.get(coding_skill.lower().strip(), 1)
                comm_encoded = comm_mapping.get(comm_skill.lower().strip(), 1)
                interest_encoded = interest_mapping.get(interest_area.lower().strip(), 2)
                
                # Shape features as a list of lists: [[CGPA, Coding, Comm, Aptitude, Interest]]
                features = [[
                    float(cgpa),
                    int(coding_encoded),
                    int(comm_encoded),
                    int(aptitude_level),
                    int(interest_encoded)
                ]]
                
                # Run prediction
                prediction = self.model.predict(features)
                predicted_path = str(prediction[0])
                print(f"Model prediction successfully computed path: {predicted_path}")
                return predicted_path
                
            except Exception as e:
                print(f"Error running model prediction pipeline: {e}. Falling back to rule mapping.")
        
        # Fallback Mock Rule Routing (If model is not loaded or raises errors)
        print("Executing fallback deterministic mapping rules...")
        interest_lower = interest_area.lower().strip()
        if interest_lower == "ai":
            return "AI Engineer"
        elif interest_lower == "ds":
            return "Data Scientist"
        elif interest_lower == "wd":
            return "Web Developer"
        elif interest_lower == "cs":
            return "Cyber Security Analyst"
        elif interest_lower == "uiux":
            return "UI/UX Designer"
        elif interest_lower == "cloud":
            return "Cloud Engineer"
        else:
            return "Web Developer"
