// Medical knowledge base for symptom analysis
export interface Symptom {
  id: string;
  name: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'emergency';
  keywords: string[];
}

export interface Condition {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  recommendedSpecialties: string[];
  commonCauses: string[];
  whenToSeekCare: string;
}

export const symptoms: Symptom[] = [
  // Emergency symptoms
  { id: 'chest_pain', name: 'Chest Pain', category: 'cardiovascular', severity: 'emergency', keywords: ['chest pain', 'chest pressure', 'heart pain', 'cardiac pain'] },
  { id: 'difficulty_breathing', name: 'Difficulty Breathing', category: 'respiratory', severity: 'emergency', keywords: ['shortness of breath', 'breathing problems', 'can\'t breathe', 'breathless'] },
  { id: 'severe_headache', name: 'Severe Headache', category: 'neurological', severity: 'high', keywords: ['severe headache', 'worst headache', 'thunderclap headache'] },
  
  // High severity symptoms
  { id: 'high_fever', name: 'High Fever', category: 'general', severity: 'high', keywords: ['high fever', 'fever over 103', 'very hot'] },
  { id: 'severe_abdominal_pain', name: 'Severe Abdominal Pain', category: 'gastrointestinal', severity: 'high', keywords: ['severe stomach pain', 'intense abdominal pain', 'stabbing stomach pain'] },
  { id: 'vomiting_blood', name: 'Vomiting Blood', category: 'gastrointestinal', severity: 'emergency', keywords: ['vomiting blood', 'blood in vomit', 'throwing up blood'] },
  
  // Medium severity symptoms
  { id: 'persistent_cough', name: 'Persistent Cough', category: 'respiratory', severity: 'medium', keywords: ['persistent cough', 'chronic cough', 'cough for weeks'] },
  { id: 'joint_pain', name: 'Joint Pain', category: 'musculoskeletal', severity: 'medium', keywords: ['joint pain', 'arthritis pain', 'knee pain', 'shoulder pain'] },
  { id: 'fatigue', name: 'Fatigue', category: 'general', severity: 'medium', keywords: ['fatigue', 'tired', 'exhausted', 'no energy'] },
  { id: 'dizziness', name: 'Dizziness', category: 'neurological', severity: 'medium', keywords: ['dizziness', 'dizzy', 'lightheaded', 'vertigo'] },
  
  // Low severity symptoms
  { id: 'mild_headache', name: 'Mild Headache', category: 'neurological', severity: 'low', keywords: ['headache', 'head pain', 'mild headache'] },
  { id: 'runny_nose', name: 'Runny Nose', category: 'respiratory', severity: 'low', keywords: ['runny nose', 'nasal congestion', 'stuffy nose'] },
  { id: 'mild_fever', name: 'Mild Fever', category: 'general', severity: 'low', keywords: ['mild fever', 'low grade fever', 'slight fever'] },
  { id: 'sore_throat', name: 'Sore Throat', category: 'respiratory', severity: 'low', keywords: ['sore throat', 'throat pain', 'scratchy throat'] },
];

export const conditions: Condition[] = [
  {
    id: 'heart_attack',
    name: 'Heart Attack (Myocardial Infarction)',
    description: 'A serious medical emergency where the blood supply to part of the heart is blocked.',
    symptoms: ['chest_pain', 'difficulty_breathing', 'nausea', 'sweating'],
    urgencyLevel: 'emergency',
    recommendedSpecialties: ['Cardiology', 'Emergency Medicine'],
    commonCauses: ['Blocked coronary arteries', 'Blood clots', 'Atherosclerosis'],
    whenToSeekCare: 'Call 911 immediately if experiencing chest pain with shortness of breath, nausea, or sweating.'
  },
  {
    id: 'pneumonia',
    name: 'Pneumonia',
    description: 'An infection that inflames air sacs in one or both lungs.',
    symptoms: ['persistent_cough', 'high_fever', 'difficulty_breathing', 'chest_pain'],
    urgencyLevel: 'high',
    recommendedSpecialties: ['Pulmonology', 'Internal Medicine'],
    commonCauses: ['Bacterial infection', 'Viral infection', 'Fungal infection'],
    whenToSeekCare: 'Seek medical care if experiencing persistent cough with fever and breathing difficulties.'
  },
  {
    id: 'migraine',
    name: 'Migraine',
    description: 'A type of headache characterized by severe throbbing pain, usually on one side of the head.',
    symptoms: ['severe_headache', 'nausea', 'sensitivity_to_light'],
    urgencyLevel: 'medium',
    recommendedSpecialties: ['Neurology', 'Primary Care'],
    commonCauses: ['Genetic factors', 'Hormonal changes', 'Stress', 'Certain foods'],
    whenToSeekCare: 'See a doctor if headaches are severe, frequent, or interfere with daily activities.'
  },
  {
    id: 'common_cold',
    name: 'Common Cold',
    description: 'A viral infection of the upper respiratory tract.',
    symptoms: ['runny_nose', 'sore_throat', 'mild_fever', 'fatigue'],
    urgencyLevel: 'low',
    recommendedSpecialties: ['Primary Care', 'Family Medicine'],
    commonCauses: ['Viral infection', 'Rhinovirus', 'Coronavirus'],
    whenToSeekCare: 'Usually resolves on its own. See a doctor if symptoms worsen or persist beyond 10 days.'
  },
  {
    id: 'arthritis',
    name: 'Arthritis',
    description: 'Inflammation of one or more joints causing pain and stiffness.',
    symptoms: ['joint_pain', 'stiffness', 'swelling'],
    urgencyLevel: 'medium',
    recommendedSpecialties: ['Rheumatology', 'Orthopedics'],
    commonCauses: ['Age-related wear', 'Autoimmune conditions', 'Previous injuries'],
    whenToSeekCare: 'See a doctor if joint pain persists, limits movement, or affects daily activities.'
  }
];

export function analyzeSymptoms(userInput: string): {
  identifiedSymptoms: Symptom[];
  possibleConditions: Condition[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  recommendedSpecialties: string[];
  advice: string;
} {
  const input = userInput.toLowerCase();
  
  // Identify symptoms from user input
  const identifiedSymptoms = symptoms.filter(symptom =>
    symptom.keywords.some(keyword => input.includes(keyword.toLowerCase()))
  );
  
  if (identifiedSymptoms.length === 0) {
    return {
      identifiedSymptoms: [],
      possibleConditions: [],
      urgencyLevel: 'low',
      recommendedSpecialties: ['Primary Care'],
      advice: "I couldn't identify specific symptoms from your description. Please describe your symptoms more specifically, such as 'chest pain', 'headache', or 'fever'."
    };
  }
  
  // Determine overall urgency level
  const maxSeverity = Math.max(...identifiedSymptoms.map(s => {
    switch(s.severity) {
      case 'emergency': return 4;
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 1;
    }
  }));
  
  const urgencyLevel = maxSeverity === 4 ? 'emergency' : 
                      maxSeverity === 3 ? 'high' : 
                      maxSeverity === 2 ? 'medium' : 'low';
  
  // Find possible conditions
  const possibleConditions = conditions.filter(condition =>
    condition.symptoms.some(symptomId =>
      identifiedSymptoms.some(identified => identified.id === symptomId)
    )
  ).sort((a, b) => {
    const aMatches = a.symptoms.filter(symptomId =>
      identifiedSymptoms.some(identified => identified.id === symptomId)
    ).length;
    const bMatches = b.symptoms.filter(symptomId =>
      identifiedSymptoms.some(identified => identified.id === symptomId)
    ).length;
    return bMatches - aMatches;
  });
  
  // Get recommended specialties
  const specialtySet = new Set(
    possibleConditions.flatMap(condition => condition.recommendedSpecialties)
  );
  const recommendedSpecialties = Array.from(specialtySet);
  
  // Generate advice
  let advice = '';
  if (urgencyLevel === 'emergency') {
    advice = '🚨 This could be a medical emergency. Call 911 or go to the nearest emergency room immediately.';
  } else if (urgencyLevel === 'high') {
    advice = '⚠️ These symptoms require prompt medical attention. Contact your doctor or visit urgent care today.';
  } else if (urgencyLevel === 'medium') {
    advice = '📋 These symptoms should be evaluated by a healthcare provider. Schedule an appointment with your doctor.';
  } else {
    advice = '💡 These symptoms are typically mild but monitor them. Consider seeing a doctor if they persist or worsen.';
  }
  
  return {
    identifiedSymptoms,
    possibleConditions,
    urgencyLevel,
    recommendedSpecialties,
    advice
  };
}

export function generateFollowUpQuestions(identifiedSymptoms: Symptom[]): string[] {
  const questions = [];
  
  if (identifiedSymptoms.some(s => s.category === 'cardiovascular')) {
    questions.push('How long have you been experiencing these symptoms?');
    questions.push('Does the pain radiate to your arm, jaw, or back?');
    questions.push('Do you have any history of heart problems?');
  }
  
  if (identifiedSymptoms.some(s => s.category === 'respiratory')) {
    questions.push('Are you experiencing any shortness of breath?');
    questions.push('Do you have a fever along with these symptoms?');
    questions.push('Are you coughing up any blood or unusual sputum?');
  }
  
  if (identifiedSymptoms.some(s => s.category === 'neurological')) {
    questions.push('On a scale of 1-10, how severe is the pain?');
    questions.push('Is this the worst headache you\'ve ever had?');
    questions.push('Are you experiencing any vision changes or nausea?');
  }
  
  if (identifiedSymptoms.some(s => s.category === 'gastrointestinal')) {
    questions.push('When did the pain start and where exactly is it located?');
    questions.push('Have you had any nausea or vomiting?');
    questions.push('Have you noticed any changes in your bowel movements?');
  }
  
  // Default questions if no specific category matches
  if (questions.length === 0) {
    questions.push('How long have you been experiencing these symptoms?');
    questions.push('Have the symptoms gotten better or worse over time?');
    questions.push('Are you taking any medications currently?');
  }
  
  return questions.slice(0, 3); // Return up to 3 questions
}