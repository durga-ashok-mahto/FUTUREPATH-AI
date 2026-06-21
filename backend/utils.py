def validate_predict_payload(data):
    """
    Validates prediction API JSON payload formats, keys, and values.
    Returns: (is_valid: bool, error_message: str or None)
    """
    if not isinstance(data, dict):
        return False, "Request payload must be a valid JSON dictionary."
        
    required_keys = ["cgpa", "coding_skill", "communication_skill", "aptitude_level", "interest_area"]
    
    # 1. Check for missing keys
    missing_keys = [key for key in required_keys if key not in data]
    if missing_keys:
        return False, f"Missing required payload fields: {', '.join(missing_keys)}"
        
    # 2. Validate CGPA
    cgpa = data["cgpa"]
    try:
        cgpa_val = float(cgpa)
        if not (0.0 <= cgpa_val <= 10.0):
            return False, "CGPA value must be a number between 0.0 and 10.0."
    except (ValueError, TypeError):
        return False, "CGPA field must be a valid numeric value."
        
    # 3. Validate Aptitude Level
    aptitude = data["aptitude_level"]
    try:
        aptitude_val = float(aptitude)
        if not (0.0 <= aptitude_val <= 100.0):
            return False, "Aptitude level must be an integer or percentage between 0 and 100."
    except (ValueError, TypeError):
        return False, "Aptitude level field must be a valid numeric value."
        
    # 4. Validate Coding Skill category
    coding = data["coding_skill"]
    if not isinstance(coding, str):
        return False, "Coding skill field must be a string value."
    valid_coding = ["beginner", "intermediate", "advanced"]
    if coding.lower().strip() not in valid_coding:
        return False, f"Invalid coding skill: '{coding}'. Must be one of: {', '.join(valid_coding)}"
        
    # 5. Validate Communication Skill category
    comm = data["communication_skill"]
    if not isinstance(comm, str):
        return False, "Communication skill field must be a string value."
    valid_comm = ["developing", "competent", "excellent"]
    if comm.lower().strip() not in valid_comm:
        return False, f"Invalid communication skill: '{comm}'. Must be one of: {', '.join(valid_comm)}"
        
    # 6. Validate Interest Area category
    interest = data["interest_area"]
    if not isinstance(interest, str):
        return False, "Interest area field must be a string value."
    valid_interests = ["ai", "ds", "wd", "cs", "uiux", "cloud"]
    if interest.lower().strip() not in valid_interests:
        return False, f"Invalid interest area: '{interest}'. Must be one of: {', '.join(valid_interests)}"
        
    # All checks passed successfully
    return True, None
