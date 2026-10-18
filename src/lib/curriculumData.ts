import { ExamQuestion, CurriculumUnit, QuestionFilter, GradeLevel } from "@/types/curriculum";
import { AUTHENTIC_MATH_QUESTIONS_2016 } from "./mathQuestionsData";
import { AUTHENTIC_CHEM_BIO_QUESTIONS } from "./chemBioQuestionsData";
export { CURRICULUM_CHEAT_SHEETS } from "./cheatSheetData";
export { AUTHENTIC_MATH_QUESTIONS_2016 } from "./mathQuestionsData";
export { AUTHENTIC_CHEM_BIO_QUESTIONS } from "./chemBioQuestionsData";

export const CURRICULUM_UNITS: CurriculumUnit[] = [
  // Physics Units
  {
    id: "phy-12-u2",
    unitNumber: 2,
    unitTitle: "Electromagnetism & Induction",
    subject: "Physics",
    subjectId: "physics",
    grade: 12,
    totalQuestions: 48,
    solvedQuestions: 31,
    description: "Faraday's Law, Lenz's Law, magnetic flux, induced EMF, self and mutual inductance, and AC generator principles.",
    keyTopics: ["Magnetic Flux", "Faraday's Law", "Lenz's Law", "Inductance", "AC Generators"],
  },
  {
    id: "phy-12-u4",
    unitNumber: 4,
    unitTitle: "Wave Optics & Interference",
    subject: "Physics",
    subjectId: "physics",
    grade: 12,
    totalQuestions: 36,
    solvedQuestions: 22,
    description: "Young's double-slit experiment, diffraction gratings, thin film interference, polarization, and resolving power.",
    keyTopics: ["Double-Slit Diffraction", "Fringe Width", "Thin Films", "Polarization"],
  },
  {
    id: "phy-12-u6",
    unitNumber: 6,
    unitTitle: "Modern Physics & Quantum Phenomena",
    subject: "Physics",
    subjectId: "physics",
    grade: 12,
    totalQuestions: 40,
    solvedQuestions: 28,
    description: "Blackbody radiation, photoelectric effect, Compton scattering, Bohr atomic model, and de Broglie matter waves.",
    keyTopics: ["Photoelectric Effect", "Work Function", "de Broglie Wavelength", "Atomic Spectra"],
  },
  {
    id: "phy-11-u2",
    unitNumber: 2,
    unitTitle: "Two-Dimensional Kinematics & Vectors",
    subject: "Physics",
    subjectId: "physics",
    grade: 11,
    totalQuestions: 52,
    solvedQuestions: 39,
    description: "Vector decomposition, relative velocity in 2D, projectile motion trajectories, range, and flight duration.",
    keyTopics: ["Projectile Trajectory", "Maximum Height", "Horizontal Range", "Relative Velocity"],
  },
  {
    id: "phy-11-u3",
    unitNumber: 3,
    unitTitle: "Work, Energy & Conservation Laws",
    subject: "Physics",
    subjectId: "physics",
    grade: 11,
    totalQuestions: 44,
    solvedQuestions: 30,
    description: "Work-energy theorem, conservative vs non-conservative forces, gravitational potential energy, and elastic collisions.",
    keyTopics: ["Work-Energy Theorem", "Conservation of Energy", "Power", "Collisions"],
  },
  {
    id: "phy-10-u4",
    unitNumber: 4,
    unitTitle: "Electrostatics & Electric Fields",
    subject: "Physics",
    subjectId: "physics",
    grade: 10,
    totalQuestions: 38,
    solvedQuestions: 24,
    description: "Coulomb's law, electric field intensity, field lines, electric potential energy, and capacitance basics.",
    keyTopics: ["Coulomb's Law", "Electric Field", "Point Charges", "Electric Potential"],
  },
  {
    id: "phy-9-u3",
    unitNumber: 3,
    unitTitle: "Linear Motion & Newton's Laws",
    subject: "Physics",
    subjectId: "physics",
    grade: 9,
    totalQuestions: 42,
    solvedQuestions: 34,
    description: "Uniform acceleration, kinematic equations, Newton's three laws of motion, inertia, friction, and momentum.",
    keyTopics: ["Uniform Acceleration", "Newton's 2nd Law", "Friction", "Momentum"],
  },

  // Mathematics (Natural) Units
  {
    id: "math-12-u1",
    unitNumber: 1,
    unitTitle: "Sequences, Series & Limits",
    subject: "Mathematics (Natural)",
    subjectId: "math-nat",
    grade: 12,
    totalQuestions: 54,
    solvedQuestions: 41,
    description: "Arithmetic and geometric progressions, limits of sequences, infinite series convergence, and sigma notation.",
    keyTopics: ["Arithmetic Progressions", "Geometric Series", "Infinite Sums", "Limits at Infinity"],
  },
  {
    id: "math-12-u3",
    unitNumber: 3,
    unitTitle: "Calculus & Applications of Derivatives",
    subject: "Mathematics (Natural)",
    subjectId: "math-nat",
    grade: 12,
    totalQuestions: 60,
    solvedQuestions: 46,
    description: "Product and chain rules, implicit differentiation, extrema, curve sketching, related rates, and optimization.",
    keyTopics: ["Chain Rule", "Local Extrema", "Inflection Points", "Optimization", "Related Rates"],
  },
  {
    id: "math-12-u4",
    unitNumber: 4,
    unitTitle: "Integral Calculus & Definite Integrals",
    subject: "Mathematics (Natural)",
    subjectId: "math-nat",
    grade: 12,
    totalQuestions: 50,
    solvedQuestions: 33,
    description: "Fundamental Theorem of Calculus, integration by substitution, integration by parts, and area between curves.",
    keyTopics: ["Integration by Parts", "u-Substitution", "Area Under Curve", "Definite Integrals"],
  },
  {
    id: "math-12-u5",
    unitNumber: 5,
    unitTitle: "Vectors in Three Dimensions",
    subject: "Mathematics (Natural)",
    subjectId: "math-nat",
    grade: 12,
    totalQuestions: 38,
    solvedQuestions: 27,
    description: "Cartesian coordinates in 3D, dot product, cross product, vector projections, and equations of lines and planes.",
    keyTopics: ["Dot Product", "Cross Product", "Scalar Triple Product", "Lines & Planes in 3D"],
  },
  {
    id: "math-11-u2",
    unitNumber: 2,
    unitTitle: "Matrices and Determinants",
    subject: "Mathematics (Natural)",
    subjectId: "math-nat",
    grade: 11,
    totalQuestions: 46,
    solvedQuestions: 35,
    description: "Matrix operations, determinants of 2x2 and 3x3 matrices, matrix inversion, Cramer's rule, and Gaussian elimination.",
    keyTopics: ["Determinants", "Matrix Inversion", "Adjugate Matrix", "Cramer's Rule"],
  },
  {
    id: "math-11-u4",
    unitNumber: 4,
    unitTitle: "Coordinate Geometry & Conic Sections",
    subject: "Mathematics (Natural)",
    subjectId: "math-nat",
    grade: 11,
    totalQuestions: 48,
    solvedQuestions: 32,
    description: "Parabolas, ellipses, hyperbolas, standard and general forms, foci, directrices, and eccentricities.",
    keyTopics: ["Parabola Focus & Directrix", "Ellipse Eccentricity", "Hyperbola Asymptotes"],
  },
  {
    id: "math-10-u2",
    unitNumber: 2,
    unitTitle: "Polynomial & Rational Functions",
    subject: "Mathematics (Natural)",
    subjectId: "math-nat",
    grade: 10,
    totalQuestions: 36,
    solvedQuestions: 25,
    description: "Polynomial division, remainder theorem, factor theorem, rational functions, vertical and horizontal asymptotes.",
    keyTopics: ["Remainder Theorem", "Factor Theorem", "Rational Asymptotes", "Zeroes of Polynomials"],
  },
  {
    id: "math-9-u4",
    unitNumber: 4,
    unitTitle: "Quadratic Equations & Inequalities",
    subject: "Mathematics (Natural)",
    subjectId: "math-nat",
    grade: 9,
    totalQuestions: 40,
    solvedQuestions: 31,
    description: "Solving quadratics by factoring, completing the square, quadratic formula, discriminant analysis, and inequalities.",
    keyTopics: ["Quadratic Formula", "Discriminant", "Factoring Quadratics", "Interval Notation"],
  },

  // Chemistry Units (Grades 9 - 12)
  {
    id: "chem-12-u1",
    unitNumber: 1,
    unitTitle: "Solutions & Phase Equilibria",
    subject: "Chemistry",
    subjectId: "chemistry",
    grade: 12,
    totalQuestions: 42,
    solvedQuestions: 29,
    description: "Colligative properties, Raoult's Law, vapor pressure lowering, boiling point elevation, freezing point depression, and osmotic pressure.",
    keyTopics: ["Raoult's Law", "Colligative Properties", "Osmotic Pressure", "Solubility Rules"],
  },
  {
    id: "chem-12-u2",
    unitNumber: 2,
    unitTitle: "Chemical Kinetics & Reaction Rates",
    subject: "Chemistry",
    subjectId: "chemistry",
    grade: 12,
    totalQuestions: 48,
    solvedQuestions: 34,
    description: "Differential and integrated rate laws, reaction orders, activation energy, Arrhenius equation, and catalysis mechanisms.",
    keyTopics: ["Rate Laws", "Reaction Order", "Arrhenius Equation", "Half-Life", "Catalysts"],
  },
  {
    id: "chem-12-u3",
    unitNumber: 3,
    unitTitle: "Chemical Equilibrium & Le Chatelier",
    subject: "Chemistry",
    subjectId: "chemistry",
    grade: 12,
    totalQuestions: 50,
    solvedQuestions: 38,
    description: "Equilibrium constant Kc and Kp, reaction quotient Q, Le Chatelier's principle, and acid-base equilibria (pH, pKa, buffers).",
    keyTopics: ["Le Chatelier's Principle", "Equilibrium Constant", "Reaction Quotient", "Buffer Solutions", "pH Calculations"],
  },
  {
    id: "chem-12-u4",
    unitNumber: 4,
    unitTitle: "Electrochemistry & Galvanic Cells",
    subject: "Chemistry",
    subjectId: "chemistry",
    grade: 12,
    totalQuestions: 45,
    solvedQuestions: 30,
    description: "Standard electrode potentials, galvanic vs. electrolytic cells, Nernst equation, Faraday's laws of electrolysis, and corrosion.",
    keyTopics: ["Galvanic Cells", "Standard Potentials", "Nernst Equation", "Faraday's Laws", "Electrolysis"],
  },
  {
    id: "chem-12-u5",
    unitNumber: 5,
    unitTitle: "Carboxylic Acids, Esters & Polymers",
    subject: "Chemistry",
    subjectId: "chemistry",
    grade: 12,
    totalQuestions: 40,
    solvedQuestions: 26,
    description: "Nomenclature, preparation, esterification reactions, saponification, fats and oils, and synthetic/natural polymers.",
    keyTopics: ["Esterification", "Carboxylic Acids", "Saponification", "Condensation Polymers"],
  },
  {
    id: "chem-11-u3",
    unitNumber: 3,
    unitTitle: "States of Matter & Gas Laws",
    subject: "Chemistry",
    subjectId: "chemistry",
    grade: 11,
    totalQuestions: 38,
    solvedQuestions: 28,
    description: "Ideal gas law (PV = nRT), Dalton's law of partial pressures, Graham's law of effusion, and kinetic molecular theory.",
    keyTopics: ["Ideal Gas Equation", "Dalton's Law", "Graham's Law", "Kinetic Molecular Theory"],
  },
  {
    id: "chem-10-u1",
    unitNumber: 1,
    unitTitle: "Introduction to Organic Chemistry",
    subject: "Chemistry",
    subjectId: "chemistry",
    grade: 10,
    totalQuestions: 35,
    solvedQuestions: 24,
    description: "Alkanes, alkenes, alkynes, structural isomerism, IUPAC nomenclature, combustion, and halogenation reactions.",
    keyTopics: ["Hydrocarbons", "IUPAC Nomenclature", "Structural Isomers", "Alkanes & Alkenes"],
  },
  {
    id: "chem-9-u3",
    unitNumber: 3,
    unitTitle: "Chemical Reactions & Stoichiometry",
    subject: "Chemistry",
    subjectId: "chemistry",
    grade: 9,
    totalQuestions: 40,
    solvedQuestions: 32,
    description: "Mole concept, Avogadro's number, molar mass, balancing chemical equations, limiting reactants, and percentage yield.",
    keyTopics: ["Mole Concept", "Balancing Equations", "Limiting Reactant", "Percent Yield"],
  },

  // Biology Units (Grades 9 - 12)
  {
    id: "bio-12-u1",
    unitNumber: 1,
    unitTitle: "Molecular Genetics & DNA Replication",
    subject: "Biology",
    subjectId: "biology",
    grade: 12,
    totalQuestions: 46,
    solvedQuestions: 33,
    description: "Structure of DNA and RNA, semi-conservative replication, DNA polymerase, transcription, mRNA processing, and translation.",
    keyTopics: ["DNA Double Helix", "Semi-Conservative Replication", "Transcription", "Genetic Code", "Translation"],
  },
  {
    id: "bio-12-u2",
    unitNumber: 2,
    unitTitle: "Biotechnology & Genetic Engineering",
    subject: "Biology",
    subjectId: "biology",
    grade: 12,
    totalQuestions: 36,
    solvedQuestions: 25,
    description: "Recombinant DNA technology, restriction enzymes, plasmids, PCR amplification, gel electrophoresis, and GMO applications.",
    keyTopics: ["Recombinant DNA", "Restriction Enzymes", "Plasmids & Cloning", "PCR Technique", "Transgenic Crops"],
  },
  {
    id: "bio-12-u3",
    unitNumber: 3,
    unitTitle: "Human Biology: Endocrine & Nervous Systems",
    subject: "Biology",
    subjectId: "biology",
    grade: 12,
    totalQuestions: 44,
    solvedQuestions: 31,
    description: "Action potential propagation, synaptic transmission, reflex arcs, brain anatomy, and endocrine hormonal feedback loops.",
    keyTopics: ["Neuron Action Potential", "Synaptic Transmission", "Hormonal Regulation", "Negative Feedback"],
  },
  {
    id: "bio-11-u3",
    unitNumber: 3,
    unitTitle: "Cellular Respiration & Photosynthesis",
    subject: "Biology",
    subjectId: "biology",
    grade: 11,
    totalQuestions: 52,
    solvedQuestions: 39,
    description: "Glycolysis, Krebs cycle, electron transport chain, ATP synthase, photolysis, light reactions, and the Calvin cycle.",
    keyTopics: ["Glycolysis", "Krebs Cycle", "Oxidative Phosphorylation", "Calvin Cycle", "Chloroplast Structure"],
  },
  {
    id: "bio-11-u4",
    unitNumber: 4,
    unitTitle: "Mendelian Genetics & Inheritance Patterns",
    subject: "Biology",
    subjectId: "biology",
    grade: 11,
    totalQuestions: 48,
    solvedQuestions: 36,
    description: "Mendel's laws, monohybrid/dihybrid crosses, Punnett squares, codominance, incomplete dominance, sex-linked inheritance, and pedigrees.",
    keyTopics: ["Monohybrid Cross", "Punnett Squares", "Sex-Linked Traits", "Codominance", "Pedigree Analysis"],
  },
  {
    id: "bio-10-u4",
    unitNumber: 4,
    unitTitle: "Ecology & Ethiopian Ecosystems",
    subject: "Biology",
    subjectId: "biology",
    grade: 10,
    totalQuestions: 38,
    solvedQuestions: 27,
    description: "Trophic levels, energy flow pyramid, biogeochemical cycles, ecological succession, endemic Ethiopian wildlife, and biodiversity conservation.",
    keyTopics: ["Trophic Pyramids", "Carbon & Nitrogen Cycles", "Endemic Ethiopian Species", "Ecosystem Conservation"],
  },
  {
    id: "bio-9-u2",
    unitNumber: 2,
    unitTitle: "Cell Biology & Microscopic Organization",
    subject: "Biology",
    subjectId: "biology",
    grade: 9,
    totalQuestions: 42,
    solvedQuestions: 32,
    description: "Prokaryotic vs. eukaryotic cells, plant vs. animal organelles, cell membrane transport (diffusion, osmosis, active transport).",
    keyTopics: ["Cell Organelles", "Prokaryote vs Eukaryote", "Osmosis & Diffusion", "Light Microscopy"],
  },
];

export const CURRICULUM_QUESTIONS: ExamQuestion[] = [
  ...AUTHENTIC_MATH_QUESTIONS_2016,
  ...AUTHENTIC_CHEM_BIO_QUESTIONS,
  // 1. Physics Grade 12 - Electromagnetism (Faraday)
  {
    id: "phy-12-01",
    subject: "Physics",
    subjectId: "physics",
    grade: 12,
    unitNumber: 2,
    unitTitle: "Electromagnetism & Induction",
    prompt:
      "A rectangular coil of $N = 200$ turns with cross-sectional dimensions $10\\text{ cm} \\times 5\\text{ cm}$ is placed perpendicular to a uniform magnetic field $B = 0.40\\text{ T}$. If the field collapses to zero in $\\Delta t = 0.05\\text{ s}$, what is the magnitude of the average induced electromotive force $\\mathcal{E}$ across the coil?",
    options: [
      { id: "A", text: "$4.0\\text{ V}$" },
      { id: "B", text: "$8.0\\text{ V}$" },
      { id: "C", text: "$16.0\\text{ V}$" },
      { id: "D", text: "$40.0\\text{ V}$" },
    ],
    correctOptionId: "B",
    explanation:
      "According to Faraday's Law of Electromagnetic Induction, the magnitude of the induced EMF is proportional to the number of coil turns and the time rate of change of magnetic flux through the enclosed loop.",
    derivationSteps: [
      "Calculate cross-sectional area: $A = 0.10\\text{ m} \\times 0.05\\text{ m} = 5.0 \\times 10^{-3}\\text{ m}^2$.",
      "Evaluate initial magnetic flux: $\\Phi_1 = B \\cdot A = (0.40\\text{ T})(5.0 \\times 10^{-3}\\text{ m}^2) = 2.0 \\times 10^{-3}\\text{ Wb}$.",
      "Compute change in flux: $\\Delta\\Phi = \\Phi_2 - \\Phi_1 = 0 - 2.0 \\times 10^{-3} = -2.0 \\times 10^{-3}\\text{ Wb}$.",
      "Apply Faraday's Law: $\\mathcal{E} = -N \\frac{\\Delta\\Phi}{\\Delta t} = -200 \\left( \\frac{-2.0 \\times 10^{-3}\\text{ Wb}}{0.05\\text{ s}} \\right) = 8.0\\text{ V}$.",
    ],
    keyFormula: "$$\\mathcal{E} = -N \\frac{\\Delta\\Phi}{\\Delta t}$$",
    examYear: "EUEE 2016 E.C.",
    difficulty: "moderate",
    isProSolutionAvailable: true,
    examinerInsight:
      "National university entrance examiners intentionally test whether students recall the factor of $10^{-4}$ when converting $\\text{cm}^2$ into $\\text{m}^2$, and whether they remember to multiply by the coil turn count $N = 200$.",
    distractorAnalysis: [
      {
        optionId: "A",
        trapExplanation: "Calculated with $N = 100$ turns or halved the turn multiplier, obtaining $4.0\\text{ V}$.",
        commonErrorType: "Omission / Turn Count Halving",
      },
      {
        optionId: "C",
        trapExplanation: "Doubled the rate of change or misread $\\Delta t = 0.025\\text{ s}$ instead of $0.05\\text{ s}$, yielding $16.0\\text{ V}$.",
        commonErrorType: "Time Interval Reciprocal Error",
      },
      {
        optionId: "D",
        trapExplanation: "Omitted converting $\\text{cm}^2$ to $\\text{m}^2$ ($50\\text{ cm}^2 = 50 \\times 10^{-4}\\text{ m}^2$), misplacing a power of 10 to obtain $40.0\\text{ V}$.",
        commonErrorType: "Metric Unit Area Conversion Trap",
      },
    ],
  },

  // 2. Physics Grade 12 - Wave Optics (Young's double slit)
  {
    id: "phy-12-02",
    subject: "Physics",
    subjectId: "physics",
    grade: 12,
    unitNumber: 4,
    unitTitle: "Wave Optics & Interference",
    prompt:
      "In a Young's double-slit experiment, monochromatic light of wavelength $\\lambda = 600\\text{ nm}$ illuminates two narrow slits separated by $d = 0.30\\text{ mm}$. The interference fringe pattern is cast on a screen placed at distance $D = 1.50\\text{ m}$. What is the linear fringe separation $\\Delta y$ between two adjacent bright fringes?",
    options: [
      { id: "A", text: "$1.5\\text{ mm}$" },
      { id: "B", text: "$3.0\\text{ mm}$" },
      { id: "C", text: "$4.5\\text{ mm}$" },
      { id: "D", text: "$6.0\\text{ mm}$" },
    ],
    correctOptionId: "B",
    explanation:
      "The fringe separation $\\Delta y$ between consecutive interference maxima in Young's experiment is governed by the ratio of wavelength and slit separation scaled by the screen distance.",
    derivationSteps: [
      "Convert parameters to SI base units: $\\lambda = 6.0 \\times 10^{-7}\\text{ m}$, $d = 3.0 \\times 10^{-4}\\text{ m}$, and $D = 1.50\\text{ m}$.",
      "Use the fringe width relationship: $\\Delta y = \\frac{\\lambda D}{d}$.",
      "Substitute values: $\\Delta y = \\frac{(6.0 \\times 10^{-7}\\text{ m})(1.50\\text{ m})}{3.0 \\times 10^{-4}\\text{ m}} = \\frac{9.0 \\times 10^{-7}}{3.0 \\times 10^{-4}} = 3.0 \\times 10^{-3}\\text{ m}$.",
      "Express in millimeters: $\\Delta y = 3.0\\text{ mm}$.",
    ],
    keyFormula: "$$\\Delta y = \\frac{\\lambda D}{d}$$",
    examYear: "EUEE 2015 E.C.",
    difficulty: "moderate",
    isProSolutionAvailable: true,
    examinerInsight:
      "A high-frequency EUEE question testing dual metric prefixes: nanometers ($10^{-9}\\text{ m}$) for wavelength and millimeters ($10^{-3}\\text{ m}$) for slit spacing.",
    distractorAnalysis: [
      {
        optionId: "A",
        trapExplanation: "Divided by 2 or calculated distance between adjacent bright and dark fringe (half-fringe width $\\Delta y / 2$).",
        commonErrorType: "Half-Fringe Maxima-Minima Confusion",
      },
      {
        optionId: "C",
        trapExplanation: "Miscalculated $(6.0 \\times 1.5) / 2 = 4.5\\text{ mm}$, confusing slit spacing $0.30\\text{ mm}$ with $0.20\\text{ mm}$.",
        commonErrorType: "Denominator Substitution Slip",
      },
      {
        optionId: "D",
        trapExplanation: "Doubled the separation or computed distance across two full fringe cycles ($2\\Delta y$).",
        commonErrorType: "Multi-Fringe Cycle Confusion",
      },
    ],
  },

  // 3. Physics Grade 12 - Modern Physics (Photoelectric Effect)
  {
    id: "phy-12-03",
    subject: "Physics",
    subjectId: "physics",
    grade: 12,
    unitNumber: 6,
    unitTitle: "Modern Physics & Quantum Phenomena",
    prompt:
      "A photosensitive metal target with work function $\\Phi = 2.14\\text{ eV}$ is illuminated by ultraviolet radiation of frequency $f = 1.00 \\times 10^{15}\\text{ Hz}$. Using Planck's constant $h = 4.14 \\times 10^{-15}\\text{ eV}\\cdot\\text{s}$, what is the maximum kinetic energy $K_{\\max}$ of the ejected photoelectrons?",
    options: [
      { id: "A", text: "$1.00\\text{ eV}$" },
      { id: "B", text: "$2.00\\text{ eV}$" },
      { id: "C", text: "$4.14\\text{ eV}$" },
      { id: "D", text: "$6.28\\text{ eV}$" },
    ],
    correctOptionId: "B",
    explanation:
      "According to Einstein's photoelectric equation, the maximum kinetic energy of liberated electrons equals the incident photon energy $E = hf$ minus the work function $\\Phi$ needed to overcome surface binding.",
    derivationSteps: [
      "Calculate incoming photon energy: $E_{\\text{photon}} = h f = (4.14 \\times 10^{-15}\\text{ eV}\\cdot\\text{s})(1.00 \\times 10^{15}\\text{ s}^{-1}) = 4.14\\text{ eV}$.",
      "Apply Einstein's equation: $K_{\\max} = h f - \\Phi$.",
      "Compute: $K_{\\max} = 4.14\\text{ eV} - 2.14\\text{ eV} = 2.00\\text{ eV}$.",
    ],
    keyFormula: "$$K_{\\max} = h f - \\Phi$$",
    examYear: "EUEE 2016 E.C.",
    difficulty: "moderate",
  },

  // 4. Physics Grade 11 - 2D Kinematics (Projectile Max Height)
  {
    id: "phy-11-01",
    subject: "Physics",
    subjectId: "physics",
    grade: 11,
    unitNumber: 2,
    unitTitle: "Two-Dimensional Kinematics & Vectors",
    prompt:
      "A projectile is launched from ground level with initial speed $v_0 = 50\\text{ m/s}$ at an angle $\\theta = 30^\\circ$ above the horizontal. Taking $g = 10\\text{ m/s}^2$ and neglecting air resistance, what is the maximum vertical elevation $H_{\\max}$ attained?",
    options: [
      { id: "A", text: "$25.0\\text{ m}$" },
      { id: "B", text: "$31.25\\text{ m}$" },
      { id: "C", text: "$62.50\\text{ m}$" },
      { id: "D", text: "$125.0\\text{ m}$" },
    ],
    correctOptionId: "B",
    explanation:
      "At the apex of the parabolic flight path, the vertical velocity component vanishes ($v_y = 0$). Maximum altitude depends strictly on the vertical velocity component $v_{0y}$.",
    derivationSteps: [
      "Resolve vertical velocity: $v_{0y} = v_0 \\sin 30^\\circ = 50 \\times 0.5 = 25\\text{ m/s}$.",
      "Apply kinematic relation: $v_y^2 = v_{0y}^2 - 2g H_{\\max} \\implies 0 = (25)^2 - 2(10)H_{\\max}$.",
      "Solve for height: $H_{\\max} = \\frac{(25)^2}{2(10)} = \\frac{625}{20} = 31.25\\text{ m}$.",
    ],
    keyFormula: "$$H_{\\max} = \\frac{(v_0 \\sin\\theta)^2}{2g}$$",
    examYear: "EUEE 2014 E.C.",
    difficulty: "foundation",
    isProSolutionAvailable: true,
    examinerInsight:
      "A perennial Grade 11 entrance trap: candidate failure to decompose initial velocity into its orthogonal vertical component $v_{0y} = v_0 \\sin\\theta$ or dropping the factor $2$ in the denominator $2g$.",
    distractorAnalysis: [
      {
        optionId: "A",
        trapExplanation: "Took vertical launch velocity $v_{0y} = 25\\text{ m/s}$ directly as height without squaring or dividing by $2g$.",
        commonErrorType: "Dimensional Unit / Formula Omission",
      },
      {
        optionId: "C",
        trapExplanation: "Omitted the factor of 2 in the denominator ($2g$), calculating $H = v_{0y}^2 / g = 625 / 10 = 62.5\\text{ m}$.",
        commonErrorType: "Denominator Factor 2 Omission",
      },
      {
        optionId: "D",
        trapExplanation: "Used total launch speed $v_0 = 50\\text{ m/s}$ without multiplying by $\\sin 30^\\circ = 0.5$ for the vertical component.",
        commonErrorType: "Failure to Resolve Vector Component",
      },
    ],
  },

  // 5. Physics Grade 11 - Energy Conservation
  {
    id: "phy-11-02",
    subject: "Physics",
    subjectId: "physics",
    grade: 11,
    unitNumber: 3,
    unitTitle: "Work, Energy & Conservation Laws",
    prompt:
      "A mass $m = 4.0\\text{ kg}$ is released from rest at the top of a frictionless ramp of vertical height $h = 5.0\\text{ m}$. Taking $g = 9.8\\text{ m/s}^2$, what is the speed $v$ of the mass as it reaches the bottom?",
    options: [
      { id: "A", text: "$v \\approx 9.9\\text{ m/s}$" },
      { id: "B", text: "$v \\approx 7.0\\text{ m/s}$" },
      { id: "C", text: "$v \\approx 14.0\\text{ m/s}$" },
      { id: "D", text: "$v \\approx 19.6\\text{ m/s}$" },
    ],
    correctOptionId: "A",
    explanation:
      "By conservation of mechanical energy in the absence of non-conservative dissipative forces, gravitational potential energy transforms completely into kinetic energy.",
    derivationSteps: [
      "Equate total initial and final mechanical energy: $m g h = \\frac{1}{2} m v^2$.",
      "Notice mass $m$ cancels on both sides: $g h = \\frac{1}{2} v^2 \\implies v = \\sqrt{2gh}$.",
      "Calculate: $v = \\sqrt{2 \\times 9.8 \\times 5.0} = \\sqrt{98} \\approx 9.899\\text{ m/s} \\approx 9.9\\text{ m/s}$.",
    ],
    keyFormula: "$$v = \\sqrt{2gh}$$",
    examYear: "EUEE 2014 E.C.",
    difficulty: "moderate",
  },

  // 6. Physics Grade 10 - Electrostatics (Coulomb's Law)
  {
    id: "phy-10-01",
    subject: "Physics",
    subjectId: "physics",
    grade: 10,
    unitNumber: 4,
    unitTitle: "Electrostatics & Electric Fields",
    prompt:
      "Two point charges $q_1 = +4.0\\,\\mu\\text{C}$ and $q_2 = -2.0\\,\\mu\\text{C}$ are separated in air by distance $r = 0.30\\text{ m}$. Using Coulomb's constant $k_e = 9.0 \\times 10^9\\text{ N}\\cdot\\text{m}^2/\\text{C}^2$, what is the magnitude of the electrostatic attraction force $F$?",
    options: [
      { id: "A", text: "$0.80\\text{ N}$" },
      { id: "B", text: "$1.60\\text{ N}$" },
      { id: "C", text: "$2.40\\text{ N}$" },
      { id: "D", text: "$0.40\\text{ N}$" },
    ],
    correctOptionId: "A",
    explanation:
      "Coulomb's Law dictates that the electrostatic force between two static point charges is proportional to the product of charge magnitudes and inversely proportional to the square of separation distance.",
    derivationSteps: [
      "Convert charges to Coulombs: $q_1 = 4.0 \\times 10^{-6}\\text{ C}$, $q_2 = 2.0 \\times 10^{-6}\\text{ C}$.",
      "Apply Coulomb's law: $F = k_e \\frac{|q_1 q_2|}{r^2}$.",
      "Substitute values: $F = (9.0 \\times 10^9) \\frac{(4.0 \\times 10^{-6})(2.0 \\times 10^{-6})}{(0.30)^2} = (9.0 \\times 10^9) \\frac{8.0 \\times 10^{-12}}{0.09} = 0.80\\text{ N}$.",
    ],
    keyFormula: "$$F = k_e \\frac{|q_1 q_2|}{r^2}$$",
    examYear: "EUEE 2015 E.C.",
    difficulty: "foundation",
  },

  // 7. Physics Grade 9 - Newton's Second Law
  {
    id: "phy-9-01",
    subject: "Physics",
    subjectId: "physics",
    grade: 9,
    unitNumber: 3,
    unitTitle: "Linear Motion & Newton's Laws",
    prompt:
      "A vehicle of mass $m = 1200\\text{ kg}$ accelerates uniformly from rest to a speed of $v = 24\\text{ m/s}$ along a straight horizontal track in $t = 8.0\\text{ s}$. What net accelerating force $F_{\\text{net}}$ is exerted on the vehicle?",
    options: [
      { id: "A", text: "$1800\\text{ N}$" },
      { id: "B", text: "$2400\\text{ N}$" },
      { id: "C", text: "$3600\\text{ N}$" },
      { id: "D", text: "$4800\\text{ N}$" },
    ],
    correctOptionId: "C",
    explanation:
      "From Newton's Second Law of Motion, the net force on an object equals its mass multiplied by its acceleration ($F_{\\text{net}} = ma$).",
    derivationSteps: [
      "Find acceleration: $a = \\frac{v - v_0}{t} = \\frac{24\\text{ m/s} - 0}{8.0\\text{ s}} = 3.0\\text{ m/s}^2$.",
      "Apply Newton's Second Law: $F_{\\text{net}} = m a = (1200\\text{ kg})(3.0\\text{ m/s}^2) = 3600\\text{ N}$.",
    ],
    keyFormula: "$$F_{\\text{net}} = m a = m \\left(\\frac{v - v_0}{t}\\right)$$",
    examYear: "EUEE 2014 E.C.",
    difficulty: "foundation",
  },

  // 8. Maths Grade 12 - Calculus / Derivatives
  {
    id: "math-12-01",
    subject: "Mathematics (Natural)",
    subjectId: "math-nat",
    grade: 12,
    unitNumber: 3,
    unitTitle: "Calculus & Applications of Derivatives",
    prompt:
      "Let $f(x) = (x^2 - 3)e^x$ be defined for all $x \\in \\mathbb{R}$. At what real coordinate does $f(x)$ attain its local minimum value?",
    options: [
      { id: "A", text: "$x = -3$" },
      { id: "B", text: "$x = -1$" },
      { id: "C", text: "$x = 1$" },
      { id: "D", text: "$x = 3$" },
    ],
    correctOptionId: "C",
    explanation:
      "To detect local extrema, compute the first derivative via the product rule, determine critical numbers where $f'(x) = 0$, and inspect sign transitions.",
    derivationSteps: [
      "Differentiate using product rule: $f'(x) = 2x e^x + (x^2 - 3)e^x = e^x(x^2 + 2x - 3)$.",
      "Factor the quadratic: $f'(x) = e^x(x + 3)(x - 1)$.",
      "Since $e^x > 0$ for all $x \\in \\mathbb{R}$, critical numbers are $x = -3$ and $x = 1$.",
      "For $x < 1$ near $1$, $f'(x) < 0$; for $x > 1$, $f'(x) > 0$. The derivative changes from negative to positive, establishing a local minimum at $x = 1$.",
    ],
    keyFormula: "$$\\frac{d}{dx}[u \\cdot v] = u'v + uv'$$",
    examYear: "EUEE 2015 E.C.",
    difficulty: "advanced",
    isProSolutionAvailable: true,
    examinerInsight:
      "Calculus questions on EUEE consistently feature products with $e^x$. Since $e^x \\neq 0$ everywhere, critical points depend strictly on the polynomial factor. The primary trap is confusing local minimum with local maximum.",
    distractorAnalysis: [
      {
        optionId: "A",
        trapExplanation: "Found critical value $x = -3$ where $f'(x) = 0$, but misclassified it: $f''(-3) < 0$ corresponds to a local MAXIMUM.",
        commonErrorType: "Extremum Classification Inversion",
      },
      {
        optionId: "B",
        trapExplanation: "Computed quadratic vertex axis of symmetry $x = -b/(2a) = -2/2 = -1$, confusing parabola vertex with derivative roots.",
        commonErrorType: "Parabola Vertex Confusion",
      },
      {
        optionId: "D",
        trapExplanation: "Factored $x^2 + 2x - 3$ incorrectly as $(x - 3)(x + 1)$, leading to false root $x = 3$.",
        commonErrorType: "Quadratic Factoring Sign Error",
      },
    ],
  },

  // 9. Maths Grade 12 - Integral Calculus (Integration by Parts)
  {
    id: "math-12-04",
    subject: "Mathematics (Natural)",
    subjectId: "math-nat",
    grade: 12,
    unitNumber: 4,
    unitTitle: "Integral Calculus & Definite Integrals",
    prompt:
      "Evaluate the definite integral $$\\int_0^1 x e^{2x} \\, dx$$",
    options: [
      { id: "A", text: "$\\frac{1}{4}(e^2 + 1)$" },
      { id: "B", text: "$\\frac{1}{4}(e^2 - 1)$" },
      { id: "C", text: "$\\frac{1}{2} e^2$" },
      { id: "D", text: "$\\frac{1}{4} e^2$" },
    ],
    correctOptionId: "A",
    explanation:
      "Definite integrals of polynomial-exponential products are evaluated via integration by parts: $\\int u \\, dv = uv - \\int v \\, du$.",
    derivationSteps: [
      "Assign parts: $u = x \\implies du = dx$, and $dv = e^{2x}dx \\implies v = \\frac{1}{2}e^{2x}$.",
      "Apply integration by parts formula: $\\int x e^{2x} dx = \\frac{1}{2}x e^{2x} - \\int \\frac{1}{2}e^{2x} dx = \\frac{1}{2}x e^{2x} - \\frac{1}{4}e^{2x}$.",
      "Evaluate upper limit $x = 1$: $\\frac{1}{2}(1)e^2 - \\frac{1}{4}e^2 = \\frac{1}{4}e^2$.",
      "Evaluate lower limit $x = 0$: $0 - \\frac{1}{4}(e^0) = -\\frac{1}{4}$.",
      "Compute difference: $\\frac{1}{4}e^2 - \\left(-\\frac{1}{4}\\right) = \\frac{1}{4}(e^2 + 1)$.",
    ],
    keyFormula: "$$\\int u \\, dv = uv - \\int v \\, du$$",
    examYear: "EUEE 2016 E.C.",
    difficulty: "advanced",
    isProSolutionAvailable: true,
    examinerInsight:
      "The classic definite integral trap: lower limit $x = 0$ yields $-1/4(e^0) = -1/4$, NOT zero! Subtracting $-1/4$ adds $+1/4$, creating the $+1$ term in $(e^2 + 1)/4$.",
    distractorAnalysis: [
      {
        optionId: "B",
        trapExplanation: "Subtracted the lower limit without accounting for the double negative: $1/4 e^2 - (1/4) = 1/4(e^2 - 1)$.",
        commonErrorType: "Double Negative Sign Blunder",
      },
      {
        optionId: "C",
        trapExplanation: "Evaluated only the first term $[uv]_0^1 = 1/2(1)e^2 - 0 = 1/2 e^2$, forgetting to evaluate the integral $\\int v du$.",
        commonErrorType: "Second Integral Term Omission",
      },
      {
        optionId: "D",
        trapExplanation: "Assumed evaluating at $x = 0$ vanishes to 0 because of the multiplier $x$, yielding $1/4 e^2 - 0 = 1/4 e^2$.",
        commonErrorType: "Zero Limit False Assumption",
      },
    ],
  },

  // 10. Maths Grade 12 - Geometric Series
  {
    id: "math-12-02",
    subject: "Mathematics (Natural)",
    subjectId: "math-nat",
    grade: 12,
    unitNumber: 1,
    unitTitle: "Sequences, Series & Limits",
    prompt:
      "An infinite geometric series has leading term $a_1 = 12$ and common ratio $r = -\\frac{1}{3}$. What is the exact sum $S_\\infty$ of the series?",
    options: [
      { id: "A", text: "$8$" },
      { id: "B", text: "$9$" },
      { id: "C", text: "$16$" },
      { id: "D", text: "$18$" },
    ],
    correctOptionId: "B",
    explanation:
      "An infinite geometric series converges if and only if $|r| < 1$. When convergent, its sum is given by $S_\\infty = \\frac{a_1}{1 - r}$.",
    derivationSteps: [
      "Verify convergence: $|r| = |-\\frac{1}{3}| = \\frac{1}{3} < 1$, hence the series converges.",
      "Apply the formula: $S_\\infty = \\frac{12}{1 - (-\\frac{1}{3})} = \\frac{12}{1 + \\frac{1}{3}} = \\frac{12}{\\frac{4}{3}}$.",
      "Multiply by the reciprocal: $S_\\infty = 12 \\times \\frac{3}{4} = 9$.",
    ],
    keyFormula: "$$S_\\infty = \\frac{a_1}{1 - r}, \\quad |r| < 1$$",
    examYear: "EUEE 2016 E.C.",
    difficulty: "foundation",
  },

  // 11. Maths Grade 12 - Vectors in 3D
  {
    id: "math-12-03",
    subject: "Mathematics (Natural)",
    subjectId: "math-nat",
    grade: 12,
    unitNumber: 5,
    unitTitle: "Vectors in Three Dimensions",
    prompt:
      "Given two spatial vectors $\\vec{u} = 2\\mathbf{i} + \\mathbf{j} - \\mathbf{k}$ and $\\vec{v} = \\mathbf{i} - \\mathbf{j} + 2\\mathbf{k}$, calculate the vector cross product $\\vec{u} \\times \\vec{v}$.",
    options: [
      { id: "A", text: "$\\mathbf{i} - 5\\mathbf{j} - 3\\mathbf{k}$" },
      { id: "B", text: "$-\\mathbf{i} + 5\\mathbf{j} + 3\\mathbf{k}$" },
      { id: "C", text: "$3\\mathbf{i} - 3\\mathbf{j} + \\mathbf{k}$" },
      { id: "D", text: "$2\\mathbf{i} - \\mathbf{j} - 2\\mathbf{k}$" },
    ],
    correctOptionId: "A",
    explanation:
      "The vector cross product produces an orthogonal pseudo-vector whose coordinates are given by the formal determinant of a $3 \\times 3$ matrix with basis vectors along the top row.",
    derivationSteps: [
      "Set up determinant: $\\vec{u} \\times \\vec{v} = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ 2 & 1 & -1 \\\\ 1 & -1 & 2 \\end{vmatrix}$.",
      "Evaluate $\\mathbf{i}$-term: $(1)(2) - (-1)(-1) = 2 - 1 = 1$.",
      "Evaluate $\\mathbf{j}$-term: $-\\left[(2)(2) - (-1)(1)\\right] = -(4 + 1) = -5$.",
      "Evaluate $\\mathbf{k}$-term: $(2)(-1) - (1)(1) = -2 - 1 = -3$.",
      "Synthesize vector: $\\vec{u} \\times \\vec{v} = \\mathbf{i} - 5\\mathbf{j} - 3\\mathbf{k}$.",
    ],
    keyFormula: "$$\\vec{u} \\times \\vec{v} = (u_y v_z - u_z v_y)\\mathbf{i} - (u_x v_z - u_z v_x)\\mathbf{j} + (u_x v_y - u_y v_x)\\mathbf{k}$$",
    examYear: "EUEE 2015 E.C.",
    difficulty: "advanced",
  },

  // 12. Maths Grade 11 - Coordinate Geometry (Parabola)
  {
    id: "math-11-01",
    subject: "Mathematics (Natural)",
    subjectId: "math-nat",
    grade: 11,
    unitNumber: 4,
    unitTitle: "Coordinate Geometry & Conic Sections",
    prompt:
      "What are the focus coordinates and directrix equation for the horizontal parabola defined by $y^2 = -12x$?",
    options: [
      { id: "A", text: "Focus $(-3, 0)$, Directrix $x = 3$" },
      { id: "B", text: "Focus $(3, 0)$, Directrix $x = -3$" },
      { id: "C", text: "Focus $(0, -3)$, Directrix $y = 3$" },
      { id: "D", text: "Focus $(-6, 0)$, Directrix $x = 6$" },
    ],
    correctOptionId: "A",
    explanation:
      "The canonical equation of a horizontal parabola with vertex at $(0,0)$ is $y^2 = 4px$, with focal point $(p, 0)$ and vertical directrix line $x = -p$.",
    derivationSteps: [
      "Compare $y^2 = -12x$ with canonical form $y^2 = 4px \\implies 4p = -12 \\implies p = -3$.",
      "Since $p < 0$, the parabola opens leftward along the $x$-axis.",
      "Focus coordinates: $(p, 0) = (-3, 0)$.",
      "Directrix equation: $x = -p = -(-3) = 3$.",
    ],
    keyFormula: "$$y^2 = 4px \\implies \\text{Focus} = (p, 0), \\quad \\text{Directrix}: x = -p$$",
    examYear: "EUEE 2016 E.C.",
    difficulty: "moderate",
  },

  // 13. Maths Grade 11 - Matrices & Inverse
  {
    id: "math-11-02",
    subject: "Mathematics (Natural)",
    subjectId: "math-nat",
    grade: 11,
    unitNumber: 2,
    unitTitle: "Matrices and Determinants",
    prompt:
      "Given the $2 \\times 2$ matrix $A = \\begin{pmatrix} 3 & 2 \\\\ 5 & 4 \\end{pmatrix}$, determine the exact inverse matrix $A^{-1}$.",
    options: [
      { id: "A", text: "$\\begin{pmatrix} 2 & -1 \\\\ -2.5 & 1.5 \\end{pmatrix}$" },
      { id: "B", text: "$\\begin{pmatrix} 4 & -2 \\\\ -5 & 3 \\end{pmatrix}$" },
      { id: "C", text: "$\\begin{pmatrix} 2 & 1 \\\\ 2.5 & 1.5 \\end{pmatrix}$" },
      { id: "D", text: "$\\begin{pmatrix} -2 & 1 \\\\ 2.5 & -1.5 \\end{pmatrix}$" },
    ],
    correctOptionId: "A",
    explanation:
      "The multiplicative inverse of a $2 \\times 2$ matrix $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ is $A^{-1} = \\frac{1}{ad - bc} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$, provided $\\det(A) \\neq 0$.",
    derivationSteps: [
      "Calculate determinant: $\\det(A) = (3)(4) - (2)(5) = 12 - 10 = 2$.",
      "Construct adjugate matrix: $\\text{adj}(A) = \\begin{pmatrix} 4 & -2 \\\\ -5 & 3 \\end{pmatrix}$.",
      "Multiply by scalar $\\frac{1}{2}$: $A^{-1} = \\frac{1}{2} \\begin{pmatrix} 4 & -2 \\\\ -5 & 3 \\end{pmatrix} = \\begin{pmatrix} 2 & -1 \\\\ -2.5 & 1.5 \\end{pmatrix}$.",
    ],
    keyFormula: "$$A^{-1} = \\frac{1}{ad - bc} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$$",
    examYear: "EUEE 2015 E.C.",
    difficulty: "moderate",
  },

  // 14. Maths Grade 10 - Polynomials & Factor Theorem
  {
    id: "math-10-01",
    subject: "Mathematics (Natural)",
    subjectId: "math-nat",
    grade: 10,
    unitNumber: 2,
    unitTitle: "Polynomial & Rational Functions",
    prompt:
      "If $P(x) = 2x^3 - 3x^2 + kx - 6$ is exactly divisible by $(x - 2)$, what is the numerical value of the coefficient $k$?",
    options: [
      { id: "A", text: "$k = 1$" },
      { id: "B", text: "$k = 2$" },
      { id: "C", text: "$k = -1$" },
      { id: "D", text: "$k = -2$" },
    ],
    correctOptionId: "A",
    explanation:
      "By the Factor Theorem, a polynomial $P(x)$ is divisible by a linear factor $(x - c)$ if and only if $P(c) = 0$.",
    derivationSteps: [
      "Set $x = 2$ in $P(x)$: $P(2) = 2(2)^3 - 3(2)^2 + k(2) - 6 = 0$.",
      "Simplify terms: $2(8) - 3(4) + 2k - 6 = 16 - 12 + 2k - 6 = 0$.",
      "Combine constants: $4 - 6 + 2k = 0 \\implies -2 + 2k = 0 \\implies 2k = 2 \\implies k = 1$.",
    ],
    keyFormula: "$$P(c) = 0 \\iff (x - c) \\text{ is a factor of } P(x)$$",
    examYear: "EUEE 2014 E.C.",
    difficulty: "foundation",
  },

  // 15. Maths Grade 9 - Quadratic Formula
  {
    id: "math-9-01",
    subject: "Mathematics (Natural)",
    subjectId: "math-nat",
    grade: 9,
    unitNumber: 4,
    unitTitle: "Quadratic Equations & Inequalities",
    prompt:
      "Find the complete real solution set for the quadratic equation $$2x^2 - 7x + 3 = 0$$",
    options: [
      { id: "A", text: "$x = 3 \\text{ or } x = \\frac{1}{2}$" },
      { id: "B", text: "$x = -3 \\text{ or } x = -\\frac{1}{2}$" },
      { id: "C", text: "$x = 2 \\text{ or } x = \\frac{3}{2}$" },
      { id: "D", text: "$x = 1 \\text{ or } x = \\frac{3}{2}$" },
    ],
    correctOptionId: "A",
    explanation:
      "Quadratic equations in standard form $ax^2 + bx + c = 0$ can be factored or resolved via the quadratic formula $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$.",
    derivationSteps: [
      "Identify coefficients: $a = 2$, $b = -7$, $c = 3$.",
      "Evaluate discriminant: $\\Delta = b^2 - 4ac = (-7)^2 - 4(2)(3) = 49 - 24 = 25$.",
      "Apply quadratic formula: $x = \\frac{-(-7) \\pm \\sqrt{25}}{2(2)} = \\frac{7 \\pm 5}{4}$.",
      "Root 1: $x_1 = \\frac{7 + 5}{4} = \\frac{12}{4} = 3$.",
      "Root 2: $x_2 = \\frac{7 - 5}{4} = \\frac{2}{4} = \\frac{1}{2}$.",
    ],
    keyFormula: "$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$",
    examYear: "EUEE 2014 E.C.",
    difficulty: "foundation",
  },

  // 16. Physics Grade 9 - Linear Kinematics
  {
    id: "phy-9-01",
    subject: "Physics",
    subjectId: "physics",
    grade: 9,
    unitNumber: 3,
    unitTitle: "Linear Motion & Newton's Laws",
    prompt:
      "A vehicle initially at rest accelerates uniformly in a straight line at $a = 3.0\\text{ m/s}^2$ for an interval of $t = 8.0\\text{ s}$. What is the total displacement $s$ covered by the vehicle during this period?",
    options: [
      { id: "A", text: "$96\\text{ m}$" },
      { id: "B", text: "$48\\text{ m}$" },
      { id: "C", text: "$24\\text{ m}$" },
      { id: "D", text: "$192\\text{ m}$" },
    ],
    correctOptionId: "A",
    explanation:
      "For rectilinear motion with constant acceleration starting from rest ($u = 0$), displacement is calculated from $s = ut + \\frac{1}{2}at^2 = \\frac{1}{2}at^2$.",
    derivationSteps: [
      "Identify parameters: $u = 0\\text{ m/s}$, $a = 3.0\\text{ m/s}^2$, $t = 8.0\\text{ s}$.",
      "Substitute into displacement equation: $s = (0)(8.0) + \\frac{1}{2}(3.0)(8.0)^2$.",
      "Evaluate time squared: $(8.0)^2 = 64$.",
      "Multiply terms: $s = \\frac{1}{2} \\times 3.0 \\times 64 = 1.5 \\times 64 = 96\\text{ m}$.",
    ],
    keyFormula: "$$s = ut + \\frac{1}{2}at^2$$",
    examYear: "National Bank Gr. 9",
    difficulty: "foundation",
  },

  // 17. Physics Grade 10 - Electrostatics & Coulomb's Law
  {
    id: "phy-10-01",
    subject: "Physics",
    subjectId: "physics",
    grade: 10,
    unitNumber: 4,
    unitTitle: "Electrostatics & Electric Fields",
    prompt:
      "Two point charges $q_1 = +4.0\\ \\mu\\text{C}$ and $q_2 = -2.0\\ \\mu\\text{C}$ are separated in air by distance $r = 0.30\\text{ m}$. Taking Coulomb's constant $k_e = 9.0 \\times 10^9\\text{ N}\\cdot\\text{m}^2/\\text{C}^2$, what is the magnitude and direction of the electrostatic force between them?",
    options: [
      { id: "A", text: "$0.80\\text{ N}$, Attractive" },
      { id: "B", text: "$0.80\\text{ N}$, Repulsive" },
      { id: "C", text: "$2.40\\text{ N}$, Attractive" },
      { id: "D", text: "$0.24\\text{ N}$, Repulsive" },
    ],
    correctOptionId: "A",
    explanation:
      "By Coulomb's Law, electrostatic force magnitude is $F = k_e \\frac{|q_1 q_2|}{r^2}$. Because the two charges have opposite signs ($+4\\mu\\text{C}$ and $-2\\mu\\text{C}$), the force is attractive.",
    derivationSteps: [
      "Convert charges to standard SI Coulombs: $q_1 = 4.0 \\times 10^{-6}\\text{ C}$, $q_2 = 2.0 \\times 10^{-6}\\text{ C}$.",
      "Compute separation squared: $r^2 = (0.30)^2 = 0.09\\text{ m}^2 = 9.0 \\times 10^{-2}\\text{ m}^2$.",
      "Substitute into Coulomb's formula: $F = (9.0 \\times 10^9) \\frac{(4.0 \\times 10^{-6})(2.0 \\times 10^{-6})}{0.09}$.",
      "Simplify constants: $F = \\frac{9.0 \\times 10^9 \\times 8.0 \\times 10^{-12}}{9.0 \\times 10^{-2}} = \\frac{7.2 \\times 10^{-2}}{9.0 \\times 10^{-2}} = 0.80\\text{ N}$.",
      "Opposite signs imply an attractive electrostatic force.",
    ],
    keyFormula: "$$F = k_e \\frac{|q_1 q_2|}{r^2}$$",
    examYear: "National Bank Gr. 10",
    difficulty: "moderate",
  },
];

/**
 * Filter questions based on subject, grade, year, and search query.
 */
export function filterCurriculumQuestions(
  questions: ExamQuestion[],
  filter: QuestionFilter
): ExamQuestion[] {
  return questions.filter((q) => {
    // Subject filter
    if (filter.subjectId !== "all" && q.subjectId !== filter.subjectId) {
      return false;
    }

    // Grade filter
    if (filter.grade !== "all" && q.grade !== filter.grade) {
      return false;
    }

    // Exam year filter
    if (filter.examYear !== "all" && q.examYear !== filter.examYear) {
      return false;
    }

    // Difficulty filter
    if (filter.difficulty !== "all" && q.difficulty !== filter.difficulty) {
      return false;
    }

    // Search query filter (checks prompt, unitTitle, explanation, keyFormula)
    if (filter.searchQuery.trim()) {
      const query = filter.searchQuery.toLowerCase();
      const matchPrompt = q.prompt.toLowerCase().includes(query);
      const matchUnit = q.unitTitle.toLowerCase().includes(query);
      const matchSubject = q.subject.toLowerCase().includes(query);
      const matchFormula = (q.keyFormula || "").toLowerCase().includes(query);

      if (!matchPrompt && !matchUnit && !matchSubject && !matchFormula) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Get distinct available exam years from question dataset.
 */
export function getAvailableExamYears(): string[] {
  const years = new Set<string>();
  CURRICULUM_QUESTIONS.forEach((q) => {
    if (q.examYear) years.add(q.examYear);
  });
  return Array.from(years).sort().reverse();
}
