import os
from flask import Flask
from flask_cors import CORS
from routes import main_bp

def create_app():
    # Initialize the Flask application
    app = Flask(__name__)
    
    # Configure Cross-Origin Resource Sharing (CORS)
    # Allows our static frontend port (typically 8080) to interact with Flask API endpoints
    CORS(app, resources={r"/*": {"origins": "*"}})
    
    # Register blueprints defining API routes
    app.register_blueprint(main_bp)
    
    return app

if __name__ == "__main__":
    app = create_app()
    # Run the server on port 5000 in debug mode for development ease
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting FuturePath AI Backend on http://127.0.0.1:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
