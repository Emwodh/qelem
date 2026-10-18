import { ExamQuestion } from "@/types/curriculum";

/**
 * Authentic Chemistry & Biology Questions from the Ethiopian University Entrance Examination (EUEE).
 * Full KaTeX formatting, complete 4-option sets, verified solutions, and curriculum unit alignments.
 */
export const AUTHENTIC_CHEM_BIO_QUESTIONS: ExamQuestion[] = [
  {
    "id": "chem-12-01",
    "subject": "Chemistry",
    "subjectId": "chemistry",
    "grade": 12,
    "unitNumber": 1,
    "unitTitle": "Solutions & Phase Equilibria",
    "prompt": "At $25^\\circ\\text{C}$, the vapor pressure of pure water is $23.8\\text{ mmHg}$. What is the vapor pressure of an aqueous solution prepared by dissolving $1.0\\text{ mol}$ of sucrose (non-volatile solute) in $9.0\\text{ mol}$ of water?",
    "options": [
      {
        "id": "A",
        "text": "$2.38\\text{ mmHg}$"
      },
      {
        "id": "B",
        "text": "$21.4\\text{ mmHg}$"
      },
      {
        "id": "C",
        "text": "$23.8\\text{ mmHg}$"
      },
      {
        "id": "D",
        "text": "$26.2\\text{ mmHg}$"
      }
    ],
    "correctOptionId": "B",
    "explanation": "According to Raoult's Law, the vapor pressure of a solution containing a non-volatile solute is $P_{\\text{solution}} = X_{\\text{solvent}} \\cdot P^\\circ_{\\text{solvent}}$. The mole fraction of water is $X_{\\text{water}} = \\frac{9.0}{1.0 + 9.0} = 0.90$. Therefore, $P = 0.90 \\times 23.8 = 21.42\\text{ mmHg}$.",
    "derivationSteps": [
      "Total moles: $n_{\\text{total}} = 1.0 + 9.0 = 10.0\\text{ mol}$.",
      "Solvent mole fraction: $X_{\\text{water}} = 9.0 / 10.0 = 0.90$.",
      "Apply Raoult's law: $P = 0.90 \\times 23.8\\text{ mmHg} = 21.42\\text{ mmHg}$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "National entrance exams frequently test whether students remember to use the mole fraction of the solvent, not the solute, in Raoult's Law."
  },
  {
    "id": "chem-12-02",
    "subject": "Chemistry",
    "subjectId": "chemistry",
    "grade": 12,
    "unitNumber": 1,
    "unitTitle": "Solutions & Phase Equilibria",
    "prompt": "Which of the following $0.10\\,\\text{M}$ aqueous solutions will exhibit the lowest freezing point?",
    "options": [
      {
        "id": "A",
        "text": "$0.10\\,\\text{M } \\text{C}_6\\text{H}_{12}\\text{O}_6$ (Glucose)"
      },
      {
        "id": "B",
        "text": "$0.10\\,\\text{M } \\text{NaCl}$"
      },
      {
        "id": "C",
        "text": "$0.10\\,\\text{M } \\text{CaCl}_2$"
      },
      {
        "id": "D",
        "text": "$0.10\\,\\text{M } \\text{Al}_2(\\text{SO}_4)_3$"
      }
    ],
    "correctOptionId": "D",
    "explanation": "Freezing point depression is a colligative property: $\\Delta T_f = i \\cdot K_f \\cdot m$. The van 't Hoff factor $i$ represents particle count upon complete dissociation: Glucose ($i=1$), $\\text{NaCl}$ ($i=2$), $\\text{CaCl}_2$ ($i=3$), and $\\text{Al}_2(\\text{SO}_4)_3$ ($i = 2 + 3 = 5$). $\\text{Al}_2(\\text{SO}_4)_3$ yields the highest effective particle concentration ($5 \\times 0.10 = 0.50\\,\\text{M}$) and thus the lowest freezing point.",
    "derivationSteps": [
      "Evaluate van 't Hoff factor $i$ for each compound.",
      "$\\text{Al}_2(\\text{SO}_4)_3 \\rightarrow 2\\text{Al}^{3+} + 3\\text{SO}_4^{2-}$ gives $i = 5$.",
      "Greatest $\\Delta T_f$ produces the most depressed (lowest) freezing point."
    ],
    "examYear": "EUEE 2015 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "A perennial EUEE conceptual question checking whether students evaluate total dissolved ions rather than just solute molarity."
  },
  {
    "id": "chem-12-03",
    "subject": "Chemistry",
    "subjectId": "chemistry",
    "grade": 12,
    "unitNumber": 2,
    "unitTitle": "Chemical Kinetics & Reaction Rates",
    "prompt": "For the reaction $2A + B \\rightarrow C$, doubling the concentration of $A$ quadruples the initial rate when $[B]$ is held constant, and doubling $[B]$ doubles the rate when $[A]$ is held constant. What is the overall order of the reaction?",
    "options": [
      {
        "id": "A",
        "text": "First order"
      },
      {
        "id": "B",
        "text": "Second order"
      },
      {
        "id": "C",
        "text": "Third order"
      },
      {
        "id": "D",
        "text": "Fourth order"
      }
    ],
    "correctOptionId": "C",
    "explanation": "Doubling $[A]$ increases rate by $2^x = 4 \\implies x = 2$ (second order in $A$). Doubling $[B]$ increases rate by $2^y = 2 \\implies y = 1$ (first order in $B$). The overall reaction order is $x + y = 2 + 1 = 3$ (third order overall).",
    "derivationSteps": [
      "Rate law form: $\\text{Rate} = k[A]^x[B]^y$.",
      "Order in $A$: $2^x = 4 \\implies x = 2$.",
      "Order in $B$: $2^y = 2 \\implies y = 1$.",
      "Overall reaction order: $2 + 1 = 3$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Examiners intentionally match stoichiometric coefficients ($2A + B$) with experimental orders to see if students guess orders from stoichiometry without checking empirical behavior."
  },
  {
    "id": "chem-12-04",
    "subject": "Chemistry",
    "subjectId": "chemistry",
    "grade": 12,
    "unitNumber": 2,
    "unitTitle": "Chemical Kinetics & Reaction Rates",
    "prompt": "A first-order decomposition reaction has a rate constant $k = 0.0693\\,\\text{min}^{-1}$. How many minutes will it take for the concentration of reactant to decrease from $0.80\\,\\text{M}$ to $0.10\\,\\text{M}$?",
    "options": [
      {
        "id": "A",
        "text": "10 minutes"
      },
      {
        "id": "B",
        "text": "20 minutes"
      },
      {
        "id": "C",
        "text": "30 minutes"
      },
      {
        "id": "D",
        "text": "40 minutes"
      }
    ],
    "correctOptionId": "C",
    "explanation": "The half-life of a first-order reaction is $t_{1/2} = \\frac{0.693}{k} = \\frac{0.693}{0.0693} = 10\\,\\text{min}$. The concentration drops from $0.80 \\rightarrow 0.40 \\rightarrow 0.20 \\rightarrow 0.10\\,\\text{M}$, requiring exactly $3$ half-lives. Total time $= 3 \\times 10\\,\\text{min} = 30\\,\\text{min}$.",
    "derivationSteps": [
      "$t_{1/2} = 0.693 / 0.0693 = 10\\text{ minutes}$.",
      "Ratio $0.10 / 0.80 = 1/8 = (1/2)^3 \\implies n = 3\\text{ half-lives}$.",
      "Total elapsed time: $3 \\times 10 = 30\\text{ minutes}$."
    ],
    "examYear": "EUEE 2014 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Using the half-life integer shortcut ($1/8 = 3$ half-lives) saves 2 minutes of logarithmic calculation during timed national exams."
  },
  {
    "id": "chem-12-05",
    "subject": "Chemistry",
    "subjectId": "chemistry",
    "grade": 12,
    "unitNumber": 2,
    "unitTitle": "Chemical Kinetics & Reaction Rates",
    "prompt": "How does the addition of a positive catalyst accelerate the rate of a reversible chemical reaction?",
    "options": [
      {
        "id": "A",
        "text": "It increases the enthalpy change of reaction ($\\Delta H$)."
      },
      {
        "id": "B",
        "text": "It provides an alternative reaction pathway with lower activation energy."
      },
      {
        "id": "C",
        "text": "It shifts the chemical equilibrium position towards products."
      },
      {
        "id": "D",
        "text": "It increases the average kinetic energy of reactant particles."
      }
    ],
    "correctOptionId": "B",
    "explanation": "A catalyst provides an alternative reaction mechanism featuring a lower activation energy ($E_a$). It speeds up both forward and reverse reaction rates equally without altering $\\Delta H$ or shifting the equilibrium constant ($K_{\\text{eq}}$).",
    "derivationSteps": [
      "Arrhenius equation: $k = A e^{-E_a / RT}$.",
      "Lowering $E_a$ increases the rate constant $k$.",
      "Equilibrium position and thermodynamics remain strictly unchanged."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "A frequent national matric question testing whether students realize catalysts never shift the equilibrium yield."
  },
  {
    "id": "chem-12-06",
    "subject": "Chemistry",
    "subjectId": "chemistry",
    "grade": 12,
    "unitNumber": 3,
    "unitTitle": "Chemical Equilibrium & Le Chatelier",
    "prompt": "Consider the exothermic Haber process at equilibrium: $\\text{N}_2(g) + 3\\text{H}_2(g) \\rightleftharpoons 2\\text{NH}_3(g) + 92\\,\\text{kJ}$. Which of the following changes will shift the equilibrium to produce more $\\text{NH}_3$?",
    "options": [
      {
        "id": "A",
        "text": "Increasing temperature"
      },
      {
        "id": "B",
        "text": "Decreasing total container pressure"
      },
      {
        "id": "C",
        "text": "Increasing system pressure by reducing volume"
      },
      {
        "id": "D",
        "text": "Removing $\\text{N}_2$ gas from the reaction chamber"
      }
    ],
    "correctOptionId": "C",
    "explanation": "There are $1 + 3 = 4\\text{ moles}$ of gas on the left and $2\\text{ moles}$ of gas on the right. Increasing pressure by reducing volume shifts the system towards the side with fewer gas molecules (the forward direction, producing more $\\text{NH}_3$).",
    "derivationSteps": [
      "$\\Delta n_{\\text{gas}} = 2 - (1 + 3) = -2$.",
      "Increasing pressure drives the system to minimize volume $\\rightarrow$ shifts toward products.",
      "Because the reaction is exothermic, increasing temperature would shift it backward."
    ],
    "examYear": "EUEE 2015 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Le Chatelier's principle on the Haber synthesis is a staple of Grade 12 national examinations."
  },
  {
    "id": "chem-12-07",
    "subject": "Chemistry",
    "subjectId": "chemistry",
    "grade": 12,
    "unitNumber": 3,
    "unitTitle": "Chemical Equilibrium & Le Chatelier",
    "prompt": "What is the pH of a $0.010\\,\\text{M}$ hydrochloric acid ($\\text{HCl}$) solution at $25^\\circ\\text{C}$?",
    "options": [
      {
        "id": "A",
        "text": "1.0"
      },
      {
        "id": "B",
        "text": "2.0"
      },
      {
        "id": "C",
        "text": "7.0"
      },
      {
        "id": "D",
        "text": "12.0"
      }
    ],
    "correctOptionId": "B",
    "explanation": "$\\text{HCl}$ is a strong monoprotic acid that dissociates completely in water: $[\\text{H}_3\\text{O}^+] = 0.010\\,\\text{M} = 1.0 \\times 10^{-2}\\,\\text{M}$. Then $\\text{pH} = -\\log[\\text{H}_3\\text{O}^+] = -\\log(10^{-2}) = 2.0$.",
    "derivationSteps": [
      "$[\\text{H}^+] = 0.010\\,\\text{M} = 10^{-2}\\,\\text{M}$.",
      "$\\text{pH} = -\\log_{10}(10^{-2}) = 2.0$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "A baseline logarithmic pH calculation that every natural science student must execute in under 30 seconds."
  },
  {
    "id": "chem-12-08",
    "subject": "Chemistry",
    "subjectId": "chemistry",
    "grade": 12,
    "unitNumber": 3,
    "unitTitle": "Chemical Equilibrium & Le Chatelier",
    "prompt": "A buffer solution contains equal molar concentrations of ethanoic acid ($\\text{CH}_3\\text{COOH}$) and sodium ethanoate ($\\text{CH}_3\\text{COONa}$). If $K_a = 1.8 \\times 10^{-5}$ ($\\text{pK}_a = 4.74$), what is the pH of this buffer?",
    "options": [
      {
        "id": "A",
        "text": "2.37"
      },
      {
        "id": "B",
        "text": "4.74"
      },
      {
        "id": "C",
        "text": "7.00"
      },
      {
        "id": "D",
        "text": "9.26"
      }
    ],
    "correctOptionId": "B",
    "explanation": "By the Henderson-Hasselbalch equation: $\\text{pH} = \\text{pK}_a + \\log\\frac{[\\text{conjugate base}]}{[\\text{acid}]}$. Since concentrations are equal, $\\frac{[\\text{base}]}{[\\text{acid}]} = 1$, and $\\log(1) = 0$. Therefore, $\\text{pH} = \\text{pK}_a = 4.74$.",
    "derivationSteps": [
      "Henderson-Hasselbalch: $\\text{pH} = \\text{pK}_a + \\log\\left( \\frac{[A^-]}{[HA]} \\right)$.",
      "Given $[A^-] = [HA] \\implies \\log(1) = 0$.",
      "$\\text{pH} = 4.74 + 0 = 4.74$."
    ],
    "examYear": "EUEE 2015 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "When equimolar amounts of conjugate acid and base are mixed, pH equals pKa directly."
  },
  {
    "id": "chem-12-09",
    "subject": "Chemistry",
    "subjectId": "chemistry",
    "grade": 12,
    "unitNumber": 4,
    "unitTitle": "Electrochemistry & Galvanic Cells",
    "prompt": "Given the standard reduction potentials: $E^\\circ(\\text{Zn}^{2+}/\\text{Zn}) = -0.76\\,\\text{V}$ and $E^\\circ(\\text{Cu}^{2+}/\\text{Cu}) = +0.34\\,\\text{V}$. What is the standard cell potential $E^\\circ_{\\text{cell}}$ for the Daniell cell?",
    "options": [
      {
        "id": "A",
        "text": "-0.42 V"
      },
      {
        "id": "B",
        "text": "+0.42 V"
      },
      {
        "id": "C",
        "text": "+1.10 V"
      },
      {
        "id": "D",
        "text": "+2.20 V"
      }
    ],
    "correctOptionId": "C",
    "explanation": "Copper has the higher reduction potential ($+0.34\\,\\text{V}$) and serves as the cathode (reduction). Zinc undergoes oxidation at the anode ($-0.76\\,\\text{V}$). $E^\\circ_{\\text{cell}} = E^\\circ_{\\text{cathode}} - E^\\circ_{\\text{anode}} = 0.34 - (-0.76) = +1.10\\,\\text{V}$.",
    "derivationSteps": [
      "Cathode: $\\text{Cu}^{2+} + 2e^- \\rightarrow \\text{Cu} \\quad (E^\\circ = +0.34\\text{ V})$.",
      "Anode: $\\text{Zn} \\rightarrow \\text{Zn}^{2+} + 2e^- \\quad (E^\\circ = -0.76\\text{ V})$.",
      "$E^\\circ_{\\text{cell}} = E^\\circ_{\\text{red}}(\\text{cathode}) - E^\\circ_{\\text{red}}(\\text{anode}) = 0.34 - (-0.76) = 1.10\\text{ V}$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "The standard cell potential of the zinc-copper battery ($1.10\\text{ V}$) is one of the most recognizable constants in entrance examination chemistry."
  },
  {
    "id": "chem-12-10",
    "subject": "Chemistry",
    "subjectId": "chemistry",
    "grade": 12,
    "unitNumber": 4,
    "unitTitle": "Electrochemistry & Galvanic Cells",
    "prompt": "During the electrolysis of molten sodium chloride ($\\text{NaCl}$) in a Downs cell, which product is discharged at the cathode?",
    "options": [
      {
        "id": "A",
        "text": "Chlorine gas ($\\text{Cl}_2$)"
      },
      {
        "id": "B",
        "text": "Sodium metal ($\\text{Na}$)"
      },
      {
        "id": "C",
        "text": "Hydrogen gas ($\\text{H}_2$)"
      },
      {
        "id": "D",
        "text": "Oxygen gas ($\\text{O}_2$)"
      }
    ],
    "correctOptionId": "B",
    "explanation": "In molten $\\text{NaCl}$ without water present, reduction occurs at the cathode: $\\text{Na}^+ + e^- \\rightarrow \\text{Na}(l)$. Oxidation of chloride occurs at the anode: $2\\text{Cl}^- \\rightarrow \\text{Cl}_2(g) + 2e^-$. Therefore, sodium metal is formed at the cathode.",
    "derivationSteps": [
      "Molten $\\text{NaCl}$ contains only $\\text{Na}^+$ and $\\text{Cl}^-$ ions.",
      "Cathode involves reduction: $\\text{Na}^+ + e^- \\rightarrow \\text{Na}$.",
      "(Hydrogen would only evolve if aqueous solution was electrolyzed)."
    ],
    "examYear": "EUEE 2015 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Distinguishes between molten electrolysis (giving metallic Na) and aqueous brine electrolysis (giving H₂ gas)."
  },
  {
    "id": "chem-12-11",
    "subject": "Chemistry",
    "subjectId": "chemistry",
    "grade": 12,
    "unitNumber": 5,
    "unitTitle": "Carboxylic Acids, Esters & Polymers",
    "prompt": "What are the systematic IUPAC names of the reactants required to synthesize ethyl propanoate via condensation esterification?",
    "options": [
      {
        "id": "A",
        "text": "Ethanol and Methanoic acid"
      },
      {
        "id": "B",
        "text": "Ethanol and Propanoic acid"
      },
      {
        "id": "C",
        "text": "Propanol and Ethanoic acid"
      },
      {
        "id": "D",
        "text": "Methanol and Butanoic acid"
      }
    ],
    "correctOptionId": "B",
    "explanation": "In the ester name 'ethyl propanoate', the alkyl prefix 'ethyl' derives from the parent alcohol (ethanol, $\\text{C}_2\\text{H}_5\\text{OH}$), while 'propanoate' derives from the carboxylic acid (propanoic acid, $\\text{C}_2\\text{H}_5\\text{COOH}$).",
    "derivationSteps": [
      "Ester structure: $\\text{CH}_3\\text{CH}_2\\text{COOCH}_2\\text{CH}_3$.",
      "Alcohol component: Ethanol ($\\text{CH}_3\\text{CH}_2\\text{OH}$).",
      "Carboxylic acid component: Propanoic acid ($\\text{CH}_3\\text{CH}_2\\text{COOH}$)."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Students frequently invert the alcohol and carboxylic acid roots in ester naming."
  },
  {
    "id": "chem-11-01",
    "subject": "Chemistry",
    "subjectId": "chemistry",
    "grade": 11,
    "unitNumber": 3,
    "unitTitle": "States of Matter & Gas Laws",
    "prompt": "Under identical conditions of temperature and pressure, which of the following gases will diffuse at the fastest rate?",
    "options": [
      {
        "id": "A",
        "text": "$\\text{CH}_4$ (Molar mass = 16 g/mol)"
      },
      {
        "id": "B",
        "text": "$\\text{O}_2$ (Molar mass = 32 g/mol)"
      },
      {
        "id": "C",
        "text": "$\\text{CO}_2$ (Molar mass = 44 g/mol)"
      },
      {
        "id": "D",
        "text": "$\\text{SO}_2$ (Molar mass = 64 g/mol)"
      }
    ],
    "correctOptionId": "A",
    "explanation": "According to Graham's Law of Effusion, the rate of effusion or diffusion of a gas is inversely proportional to the square root of its molar mass ($r \\propto \\frac{1}{\\sqrt{M}}$). Methane ($\\text{CH}_4$) has the lowest molar mass ($16\\,\\text{g/mol}$) and will diffuse fastest.",
    "derivationSteps": [
      "Graham's Law: Rate $\\propto 1 / \\sqrt{M}$.",
      "Molar masses: $\\text{CH}_4 (16) < \\text{O}_2 (32) < \\text{CO}_2 (44) < \\text{SO}_2 (64)$.",
      "Smallest molar mass gives the greatest rate."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "A direct high-yield application of kinetic molecular theory and Graham's law."
  },
  {
    "id": "chem-10-01",
    "subject": "Chemistry",
    "subjectId": "chemistry",
    "grade": 10,
    "unitNumber": 1,
    "unitTitle": "Introduction to Organic Chemistry",
    "prompt": "How many structural (constitutional) isomers exist for the alkane pentane ($\\text{C}_5\\text{H}_{12}$)?",
    "options": [
      {
        "id": "A",
        "text": "2"
      },
      {
        "id": "B",
        "text": "3"
      },
      {
        "id": "C",
        "text": "4"
      },
      {
        "id": "D",
        "text": "5"
      }
    ],
    "correctOptionId": "B",
    "explanation": "Pentane has exactly three structural isomers: n-pentane (pentane), isopentane (2-methylbutane), and neopentane (2,2-dimethylpropane).",
    "derivationSteps": [
      "1. Straight-chain: $\\text{CH}_3-\\text{CH}_2-\\text{CH}_2-\\text{CH}_2-\\text{CH}_3$ (Pentane).",
      "2. 4-carbon chain: $\\text{CH}_3-\\text{CH}(\\text{CH}_3)-\\text{CH}_2-\\text{CH}_3$ (2-Methylbutane).",
      "3. 3-carbon chain: $\\text{C}(\\text{CH}_3)_4$ (2,2-Dimethylpropane).",
      "Total $= 3$ isomers."
    ],
    "examYear": "EUEE 2015 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "The number of isomers of butane (2), pentane (3), and hexane (5) are standard high-school matric benchmarks."
  },
  {
    "id": "bio-12-01",
    "subject": "Biology",
    "subjectId": "biology",
    "grade": 12,
    "unitNumber": 1,
    "unitTitle": "Molecular Genetics & DNA Replication",
    "prompt": "If a DNA molecule contains 28% adenine (A), what percentage of the nitrogenous bases in this double-stranded molecule is cytosine (C)?",
    "options": [
      {
        "id": "A",
        "text": "22%"
      },
      {
        "id": "B",
        "text": "28%"
      },
      {
        "id": "C",
        "text": "44%"
      },
      {
        "id": "D",
        "text": "56%"
      }
    ],
    "correctOptionId": "A",
    "explanation": "By Chargaff's rules for double-stranded DNA: %A = %T and %G = %C. If A = 28%, then T = 28%, totaling 56%. The remaining $100\\% - 56\\% = 44\\%$ must be divided equally between G and C. Thus, %C = 44% / 2 = 22%.",
    "derivationSteps": [
      "A = 28% $\\implies$ T = 28%.",
      "A + T = 56%.",
      "G + C = 100% - 56% = 44%.",
      "Because G = C: %C = 44% / 2 = 22%."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Chargaff's rules appear almost every single year in the Grade 12 National Biology exam."
  },
  {
    "id": "bio-12-02",
    "subject": "Biology",
    "subjectId": "biology",
    "grade": 12,
    "unitNumber": 1,
    "unitTitle": "Molecular Genetics & DNA Replication",
    "prompt": "A template strand of DNA has the nucleotide sequence $3'-\\text{TAC GGC TTA GCA}-5'$. What is the base sequence of the messenger RNA (mRNA) synthesized from it?",
    "options": [
      {
        "id": "A",
        "text": "$5'-\\text{ATG CCG AAT CGT}-3'$"
      },
      {
        "id": "B",
        "text": "$5'-\\text{AUG CCG AAU CGU}-3'$"
      },
      {
        "id": "C",
        "text": "$3'-\\text{AUG CCG AAU CGU}-5'$"
      },
      {
        "id": "D",
        "text": "$5'-\\text{UAC GGC UUA GCA}-3'$"
      }
    ],
    "correctOptionId": "B",
    "explanation": "RNA polymerase synthesizes RNA antiparallel ($5' \\rightarrow 3'$) to the template strand ($3' \\rightarrow 5'$). Adenine (A) in DNA pairs with Uracil (U) in RNA, Thymine (T) pairs with Adenine (A), and Guanine (G) pairs with Cytosine (C). Thus $3'-\\text{TAC GGC TTA GCA}-5'$ becomes $5'-\\text{AUG CCG AAU CGU}-3'$.",
    "derivationSteps": [
      "T $\\rightarrow$ A, A $\\rightarrow$ U, C $\\rightarrow$ G.",
      "G $\\rightarrow$ C, G $\\rightarrow$ C, C $\\rightarrow$ G.",
      "Direction runs antiparallel: $5'-\\text{AUG CCG AAU CGU}-3'$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Examiners watch for two traps: leaving Thymine instead of Uracil (Option A) and reversing 5' to 3' orientation."
  },
  {
    "id": "bio-12-03",
    "subject": "Biology",
    "subjectId": "biology",
    "grade": 12,
    "unitNumber": 2,
    "unitTitle": "Biotechnology & Genetic Engineering",
    "prompt": "Which enzyme is utilized in recombinant DNA technology to permanently seal phosphodiester bonds between sticky ends of cut DNA fragments?",
    "options": [
      {
        "id": "A",
        "text": "DNA Helicase"
      },
      {
        "id": "B",
        "text": "DNA Ligase"
      },
      {
        "id": "C",
        "text": "RNA Polymerase"
      },
      {
        "id": "D",
        "text": "Reverse Transcriptase"
      }
    ],
    "correctOptionId": "B",
    "explanation": "DNA ligase catalyzes the formation of covalent phosphodiester bonds between adjacent nucleotides in DNA, joining plasmid vectors and foreign gene inserts into continuous recombinant molecules.",
    "derivationSteps": [
      "Restriction endonuclease cuts DNA at recognition sites.",
      "DNA Ligase acts as molecular glue sealing the sugar-phosphate backbone."
    ],
    "examYear": "EUEE 2015 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Crucial core enzyme identification in Grade 12 biotechnology."
  },
  {
    "id": "bio-12-04",
    "subject": "Biology",
    "subjectId": "biology",
    "grade": 12,
    "unitNumber": 3,
    "unitTitle": "Human Biology: Endocrine & Nervous Systems",
    "prompt": "During the transmission of a nerve impulse, the sudden depolarization of the axon membrane is primarily caused by:",
    "options": [
      {
        "id": "A",
        "text": "Active pumping of potassium ions ($K^+$) into the cell"
      },
      {
        "id": "B",
        "text": "Rapid influx of sodium ions ($Na^+$) through voltage-gated channels"
      },
      {
        "id": "C",
        "text": "Efflux of chloride ions ($Cl^-$) out of the axon"
      },
      {
        "id": "D",
        "text": "Diffusion of neurotransmitters along the myelin sheath"
      }
    ],
    "correctOptionId": "B",
    "explanation": "When threshold stimulus is reached, voltage-gated sodium channels open rapidly. Sodium ions ($Na^+$) rush down their electrochemical gradient into the neuron interior, flipping the membrane potential from $-70\\,\\text{mV}$ to $+30\\,\\text{mV}$ (depolarization).",
    "derivationSteps": [
      "Resting potential: $-70\\text{ mV}$ maintained by $Na^+/K^+$ ATPase.",
      "Depolarization: Voltage-gated $Na^+$ channels open $\\rightarrow$ massive $Na^+$ entry.",
      "Repolarization follows with $K^+$ efflux."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "A high-yield physiology question testing understanding of voltage-gated ion channels."
  },
  {
    "id": "bio-11-01",
    "subject": "Biology",
    "subjectId": "biology",
    "grade": 11,
    "unitNumber": 3,
    "unitTitle": "Cellular Respiration & Photosynthesis",
    "prompt": "What is the primary role of molecular oxygen ($O_2$) in aerobic cellular respiration?",
    "options": [
      {
        "id": "A",
        "text": "To act as a direct electron donor for glycolysis in the cytoplasm"
      },
      {
        "id": "B",
        "text": "To serve as the final electron acceptor at the end of the electron transport chain"
      },
      {
        "id": "C",
        "text": "To phosphorylate ADP directly into ATP inside the mitochondrial matrix"
      },
      {
        "id": "D",
        "text": "To cleave glucose into two pyruvate molecules during preparatory reactions"
      }
    ],
    "correctOptionId": "B",
    "explanation": "In the mitochondrial inner membrane (cristae), molecular oxygen acts as the terminal electron acceptor of the electron transport chain. Oxygen combines with electrons and free protons ($H^+$) to form water ($H_2O$), driving oxidative phosphorylation.",
    "derivationSteps": [
      "Terminal reaction: $\\frac{1}{2}O_2 + 2e^- + 2H^+ \\rightarrow H_2O$.",
      "Without oxygen, electron transfer stops and ATP synthase ceases."
    ],
    "examYear": "EUEE 2015 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Oxygen's role as final electron acceptor is universally tested in Grade 11 cellular respiration."
  },
  {
    "id": "bio-11-02",
    "subject": "Biology",
    "subjectId": "biology",
    "grade": 11,
    "unitNumber": 4,
    "unitTitle": "Mendelian Genetics & Inheritance Patterns",
    "prompt": "In pea plants, tall stem ($T$) is dominant over short stem ($t$). When two heterozygous tall plants ($Tt \\times Tt$) are crossed, what is the expected phenotypic ratio among the offspring?",
    "options": [
      {
        "id": "A",
        "text": "1 Tall : 1 Short"
      },
      {
        "id": "B",
        "text": "3 Tall : 1 Short"
      },
      {
        "id": "C",
        "text": "1 Tall : 2 Intermediate : 1 Short"
      },
      {
        "id": "D",
        "text": "All Tall"
      }
    ],
    "correctOptionId": "B",
    "explanation": "Crossing two monohybrids ($Tt \\times Tt$) produces genotypes: $1\\,TT : 2\\,Tt : 1\\,tt$. Both $TT$ and $Tt$ express the dominant tall phenotype ($1 + 2 = 3$). Only $tt$ is short ($1$). Thus, the phenotypic ratio is 3 Tall : 1 Short.",
    "derivationSteps": [
      "Punnett square: $TT$ (1/4), $Tt$ (2/4), $tt$ (1/4).",
      "Phenotypes: Tall ($3/4$), Short ($1/4$).",
      "Ratio $= 3 : 1$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Classic Mendelian 3:1 phenotypic vs 1:2:1 genotypic ratio distinction."
  },
  {
    "id": "bio-10-01",
    "subject": "Biology",
    "subjectId": "biology",
    "grade": 10,
    "unitNumber": 4,
    "unitTitle": "Ecology & Ethiopian Ecosystems",
    "prompt": "The Walia Ibex (*Capra walie*), an endangered mammal endemic exclusively to Ethiopia, is native to which protected national park?",
    "options": [
      {
        "id": "A",
        "text": "Awash National Park"
      },
      {
        "id": "B",
        "text": "Bale Mountains National Park"
      },
      {
        "id": "C",
        "text": "Simien Mountains National Park"
      },
      {
        "id": "D",
        "text": "Nechisar National Park"
      }
    ],
    "correctOptionId": "C",
    "explanation": "The Walia Ibex is endemic solely to the high afro-alpine cliffs of the Simien Mountains National Park in northern Ethiopia. Bale Mountains National Park is famed for the Ethiopian Wolf and Mountain Nyala.",
    "derivationSteps": [
      "Simien Mountains: Walia Ibex, Gelada Baboon.",
      "Bale Mountains: Ethiopian Wolf (Canis simensis), Mountain Nyala."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Ethiopian endemic species and their habitat parks are a mandatory national curriculum component."
  }
];
