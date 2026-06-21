/* ==========================================
   FuturePath AI - Prediction Form Logic & API Connector
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const logoutBtn = document.getElementById('logoutBtn');
  
  const predictionForm = document.getElementById('predictionForm');
  const cgpaInput = document.getElementById('cgpa');
  const cgpaVal = document.getElementById('cgpaVal');
  const aptitudeInput = document.getElementById('aptitude');
  const aptitudeVal = document.getElementById('aptitudeVal');
  
  const codingSkillInput = document.getElementById('codingSkill');
  const codingChoiceCards = document.querySelectorAll('#codingChoiceGrid .choice-card');
  const codingError = document.getElementById('coding-error');
  
  const commSkillInput = document.getElementById('commSkill');
  const commChoiceCards = document.querySelectorAll('#commChoiceGrid .choice-card');
  const commError = document.getElementById('comm-error');
  
  const interestInput = document.getElementById('interestArea');
  const interestError = document.getElementById('interest-error');
  
  const submitPredictBtn = document.getElementById('submitPredictBtn');
  const btnSpinner = document.getElementById('btnSpinner');
  const toastContainer = document.getElementById('toastContainer');

  // Backend API configuration
  const API_PREDICT_URL = "http://127.0.0.1:5000/predict";



  /* ==========================================
     Real-time Slider Value Displays
     ========================================== */
  cgpaInput.addEventListener('input', (e) => {
    cgpaVal.textContent = parseFloat(e.target.value).toFixed(1);
  });

  aptitudeInput.addEventListener('input', (e) => {
    aptitudeVal.textContent = `${e.target.value}%`;
  });

  /* ==========================================
     Choice Cards Selector Interactions
     ========================================== */
  // Coding skill choice
  codingChoiceCards.forEach(card => {
    card.addEventListener('click', () => {
      codingChoiceCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      codingSkillInput.value = card.getAttribute('data-value');
      codingError.style.display = 'none';
    });
  });

  // Communication skill choice
  commChoiceCards.forEach(card => {
    card.addEventListener('click', () => {
      commChoiceCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      commSkillInput.value = card.getAttribute('data-value');
      commError.style.display = 'none';
    });
  });

  // Interest area dropdown change
  interestInput.addEventListener('change', () => {
    if (interestInput.value !== '') {
      interestError.style.display = 'none';
      interestInput.classList.remove('is-invalid');
      interestInput.classList.add('is-valid');
    }
  });



  /* ==========================================
     Fallback deterministic mapping calculator
     ========================================== */
  function calculateLocalFallback(cgpaValNum, codingVal, commVal, aptitudeValNum, interestVal) {
    let predictedCareer = '';
    switch (interestVal) {
      case 'ai':
        predictedCareer = 'ai_engineer';
        break;
      case 'ds':
        predictedCareer = 'data_scientist';
        break;
      case 'wd':
        predictedCareer = 'web_developer';
        break;
      case 'cs':
        predictedCareer = 'cyber_security';
        break;
      case 'uiux':
        predictedCareer = 'uiux_designer';
        break;
      case 'cloud':
        predictedCareer = 'cloud_engineer';
        break;
      default:
        predictedCareer = 'web_developer';
    }

    let baseConfidence = 80;
    if (cgpaValNum >= 9.0) baseConfidence += 6;
    else if (cgpaValNum >= 8.0) baseConfidence += 4;
    else if (cgpaValNum < 6.5) baseConfidence -= 8;
    
    if (codingVal === 'advanced' && (interestVal === 'ai' || interestVal === 'cloud' || interestVal === 'wd')) {
      baseConfidence += 7;
    } else if (codingVal === 'beginner' && interestVal === 'ai') {
      baseConfidence -= 12;
    }
    
    if (aptitudeValNum >= 85) baseConfidence += 5;
    else if (aptitudeValNum <= 45) baseConfidence -= 10;
    
    if (commVal === 'excellent' && interestVal === 'uiux') {
      baseConfidence += 5;
    }
    
    const finalScore = Math.min(Math.max(baseConfidence, 45), 98);
    return { career: predictedCareer, score: finalScore };
  }

  /* ==========================================
     Form Submit Validation & REST API Calling
     ========================================== */
  predictionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isFormValid = true;

    // Validate coding choice
    if (codingSkillInput.value === '') {
      codingError.style.display = 'block';
      isFormValid = false;
    } else {
      codingError.style.display = 'none';
    }

    // Validate communication choice
    if (commSkillInput.value === '') {
      commError.style.display = 'block';
      isFormValid = false;
    } else {
      commError.style.display = 'none';
    }

    // Validate interest dropdown
    if (interestInput.value === '') {
      interestError.style.display = 'block';
      interestInput.classList.add('is-invalid');
      isFormValid = false;
    } else {
      interestError.style.display = 'none';
      interestInput.classList.remove('is-invalid');
    }

    // If validation fails, halt execution
    if (!isFormValid) {
      showToast('Please fill out all required profile attributes.', 'error');
      const firstInvalid = document.querySelector('.error-msg[style*="display: block"]');
      if (firstInvalid) {
        firstInvalid.closest('.form-row').scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Gather inputs
    const cgpaValNum = parseFloat(cgpaInput.value);
    const codingVal = codingSkillInput.value;
    const commVal = commSkillInput.value;
    const aptitudeValNum = parseInt(aptitudeInput.value);
    const interestVal = interestInput.value;

    // Trigger button loading simulation
    submitPredictBtn.disabled = true;
    btnSpinner.style.display = 'block';
    submitPredictBtn.querySelector('.btn-text').textContent = 'Consulting AI Models...';

    // Disable inputs during network call
    cgpaInput.disabled = true;
    aptitudeInput.disabled = true;
    interestInput.disabled = true;
    codingChoiceCards.forEach(c => c.style.pointerEvents = 'none');
    commChoiceCards.forEach(c => c.style.pointerEvents = 'none');

    createRipple(e, submitPredictBtn);
    showToast('Sending parameters to Flask server...', 'success');

    // Make network request to the Flask server
    fetch(API_PREDICT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        cgpa: cgpaValNum,
        coding_skill: codingVal,
        communication_skill: commVal,
        aptitude_level: aptitudeValNum,
        interest_area: interestVal
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Server responded with status code: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.status === "success") {
        showToast('Model predictions processed successfully!', 'success');
        
        const predictedCareerKey = data.prediction.career_key;
        const confidenceScore = data.prediction.confidence_score;
        
        // Reset states and redirect
        setTimeout(() => {
          resetFormInputStates();
          window.location.href = `result.html?career=${predictedCareerKey}&score=${confidenceScore}`;
        }, 1200);
      } else {
        throw new Error(data.message || "An unknown prediction failure occurred.");
      }
    })
    .catch(error => {
      console.warn("Backend API Connection Error:", error);
      showToast('Flask server offline. Running local client prediction fallback.', 'error');
      
      // Compute deterministic fallback calculations
      const fallbackResult = calculateLocalFallback(cgpaValNum, codingVal, commVal, aptitudeValNum, interestVal);
      
      setTimeout(() => {
        resetFormInputStates();
        window.location.href = `result.html?career=${fallbackResult.career}&score=${fallbackResult.score}`;
      }, 1500);
    });

    function resetFormInputStates() {
      cgpaInput.disabled = false;
      aptitudeInput.disabled = false;
      interestInput.disabled = false;
      codingChoiceCards.forEach(c => c.style.pointerEvents = 'auto');
      commChoiceCards.forEach(c => c.style.pointerEvents = 'auto');
      submitPredictBtn.disabled = false;
      btnSpinner.style.display = 'none';
      submitPredictBtn.querySelector('.btn-text').textContent = 'Predict Career Trajectory';
    }

  });



});
