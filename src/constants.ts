export enum SkillZone {
  ARCHITECT = "The Architect",
  ORACLE = "The Oracle",
  ALCHEMIST = "The Alchemist",
  ARTIST = "The Artist",
  AMPLIFIER = "The Amplifier",
  OPERATOR = "The Operator",
}

export interface SkillStatement {
  id: string;
  zone: SkillZone;
  text: string;
}

export const SKILL_ZONES_INFO: Record<SkillZone, { description: string; traits: string[] }> = {
  [SkillZone.ARCHITECT]: {
    description: "Structure, frameworks, clarity, and decision systems.",
    traits: ["Logical", "Organized", "Strategic", "Systematic"],
  },
  [SkillZone.ORACLE]: {
    description: "Intuition, insight, pattern-reading, and energy intelligence.",
    traits: ["Intuitive", "Perceptive", "Visionary", "Deep"],
  },
  [SkillZone.ALCHEMIST]: {
    description: "Transformation work, healing, mindset shifts, and integration.",
    traits: ["Transformative", "Empathetic", "Healing", "Adaptive"],
  },
  [SkillZone.ARTIST]: {
    description: "Visual intelligence, aesthetics, storytelling, and creation.",
    traits: ["Creative", "Aesthetic", "Expressive", "Original"],
  },
  [SkillZone.AMPLIFIER]: {
    description: "Visibility, communication, teaching, and community leadership.",
    traits: ["Charismatic", "Articulate", "Influential", "Connective"],
  },
  [SkillZone.OPERATOR]: {
    description: "Execution, consistency, systems, and follow-through.",
    traits: ["Reliable", "Efficient", "Disciplined", "Practical"],
  },
};

export const STATEMENTS: SkillStatement[] = [
  // Architect
  { id: "arc1", zone: SkillZone.ARCHITECT, text: "I naturally see the underlying structure or framework in complex situations." },
  { id: "arc2", zone: SkillZone.ARCHITECT, text: "I enjoy creating step-by-step plans or decision-making systems." },
  { id: "arc3", zone: SkillZone.ARCHITECT, text: "I am often the one who brings order to chaotic information or data." },
  { id: "arc4", zone: SkillZone.ARCHITECT, text: "I prefer having a clear roadmap before starting a new project." },
  { id: "arc5", zone: SkillZone.ARCHITECT, text: "I find satisfaction in optimizing processes to make them more logical." },
  
  // Oracle
  { id: "ora1", zone: SkillZone.ORACLE, text: "I often sense the 'energy' or unspoken dynamics in a room." },
  { id: "ora2", zone: SkillZone.ORACLE, text: "I can spot patterns and trends before they become obvious to others." },
  { id: "ora3", zone: SkillZone.ORACLE, text: "My first instincts about people or situations are usually correct." },
  { id: "ora4", zone: SkillZone.ORACLE, text: "I find deep meaning in symbols, metaphors, and synchronicities." },
  { id: "ora5", zone: SkillZone.ORACLE, text: "I am comfortable navigating ambiguity and following my intuition." },

  // Alchemist
  { id: "alc1", zone: SkillZone.ALCHEMIST, text: "I am drawn to helping others navigate deep personal or mindset shifts." },
  { id: "alc2", zone: SkillZone.ALCHEMIST, text: "I believe that every challenge contains the seed of a transformation." },
  { id: "alc3", zone: SkillZone.ALCHEMIST, text: "I have a knack for reframing negative experiences into growth opportunities." },
  { id: "alc4", zone: SkillZone.ALCHEMIST, text: "I enjoy the process of 'unlearning' and integrating new ways of being." },
  { id: "alc5", zone: SkillZone.ALCHEMIST, text: "I am often sought out for advice during times of major life transition." },

  // Artist
  { id: "art1", zone: SkillZone.ARTIST, text: "I express my ideas best through visual, written, or sensory mediums." },
  { id: "art2", zone: SkillZone.ARTIST, text: "Aesthetics and beauty are essential to my well-being and work." },
  { id: "art3", zone: SkillZone.ARTIST, text: "I love the 'blank canvas' stage of a project where anything is possible." },
  { id: "art4", zone: SkillZone.ARTIST, text: "I find myself storytelling even when explaining simple concepts." },
  { id: "art5", zone: SkillZone.ARTIST, text: "I have a distinct personal style that shows up in everything I create." },

  // Amplifier
  { id: "amp1", zone: SkillZone.AMPLIFIER, text: "I feel energized when speaking to groups or sharing my message publicly." },
  { id: "amp2", zone: SkillZone.AMPLIFIER, text: "I naturally know how to make an idea 'sticky' or shareable." },
  { id: "amp3", zone: SkillZone.AMPLIFIER, text: "I enjoy building communities and connecting people to each other." },
  { id: "amp4", zone: SkillZone.AMPLIFIER, text: "I am comfortable being the 'face' or 'voice' of a movement or brand." },
  { id: "amp5", zone: SkillZone.AMPLIFIER, text: "I find it easy to articulate complex ideas in a way that inspires action." },

  // Operator
  { id: "ope1", zone: SkillZone.OPERATOR, text: "I take great pride in finishing what I start, down to the last detail." },
  { id: "ope2", zone: SkillZone.OPERATOR, text: "I thrive on routine, consistency, and reliable execution." },
  { id: "ope3", zone: SkillZone.OPERATOR, text: "I am the person people count on to 'get the job done' without fuss." },
  { id: "ope4", zone: SkillZone.OPERATOR, text: "I enjoy the 'doing' phase more than the 'dreaming' phase." },
  { id: "ope5", zone: SkillZone.OPERATOR, text: "I find peace in repetitive tasks that require focus and precision." },
];

export interface MCQOption {
  id: string;
  text: string;
}

export const AGE_BANDS: MCQOption[] = [
  { id: "20-29", text: "20-29" },
  { id: "30-39", text: "30-39" },
  { id: "40-49", text: "40-49" },
  { id: "50+", text: "50+" },
];

export const ROLE_CATEGORIES: MCQOption[] = [
  { id: "creative", text: "Creative / Artist" },
  { id: "corporate", text: "Corporate / Professional" },
  { id: "entrepreneur", text: "Entrepreneur / Founder" },
  { id: "educator", text: "Educator / Coach" },
  { id: "student", text: "Student / Transitioning" },
  { id: "other", text: "Other" },
];

export const PRIMARY_GOALS: MCQOption[] = [
  { id: "clarity", text: "Finding clarity in my career path" },
  { id: "monetize", text: "Monetizing my unique skills" },
  { id: "impact", text: "Increasing my social or community impact" },
  { id: "balance", text: "Finding better work-life alignment" },
  { id: "growth", text: "Scaling my existing business/role" },
];

export const EVIDENCE_MCQS = [
  {
    id: "flow_type",
    question: "When you are in 'flow', what are you usually doing?",
    options: [
      { id: "creating", text: "Creating something from scratch" },
      { id: "solving", text: "Solving a complex problem" },
      { id: "connecting", text: "Connecting people or ideas" },
      { id: "organizing", text: "Organizing chaos into systems" },
      { id: "guiding", text: "Guiding or teaching others" },
    ]
  },
  {
    id: "flow_feeling",
    question: "How does this state feel to you?",
    options: [
      { id: "electric", text: "Electric and high-energy" },
      { id: "calm", text: "Calm and meditative" },
      { id: "focused", text: "Deeply focused and 'locked in'" },
      { id: "joyful", text: "Joyful and expressive" },
    ]
  }
];

export const CONSTRAINT_MCQS = [
  {
    id: "main_blocker",
    question: "What is your primary blocker right now?",
    options: [
      { id: "fear", text: "Fear of judgment or failure" },
      { id: "time", text: "Lack of time or overwhelming schedule" },
      { id: "clarity", text: "Lack of clarity on what to do next" },
      { id: "confidence", text: "Imposter syndrome / Lack of confidence" },
      { id: "resources", text: "Lack of financial or technical resources" },
    ]
  }
];

export interface AssessmentResult {
  id: string;
  name: string;
  ageBand: string;
  roleCategory: string;
  primaryGoal: string;
  personalityType?: string;
  evidenceMCQs: Record<string, string>;
  evidenceReflective: string;
  constraintMCQs: Record<string, string>;
  constraintReflective: string;
  scores: Record<SkillZone, number>;
  report?: string;
  createdAt: string;
}
