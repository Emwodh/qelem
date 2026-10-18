import { UnitCheatSheet } from "@/types/curriculum";

export const CURRICULUM_CHEAT_SHEETS: UnitCheatSheet[] = [
  // 1. Physics Grade 12 - Unit 2: Electromagnetism & Induction
  {
    id: "cs-phy-12-u2",
    unitId: "phy-12-u2",
    unitNumber: 2,
    unitTitle: "Electromagnetism & Induction",
    subject: "Physics",
    subjectId: "physics",
    grade: 12,
    estimatedReadTime: "6 min read",
    summary:
      "Comprehensive synthesis of magnetic flux, Faraday's induction law, Lenz's energy conservation rule, self/mutual inductance, and AC generator mechanics.",
    essentialFormulas: [
      {
        id: "f-flux",
        name: "Magnetic Flux through Plane Surface",
        latex: "$$\\Phi_B = \\vec{B} \\cdot \\vec{A} = B A \\cos\\theta$$",
        description: "Measures the net number of magnetic field lines piercing a planar surface of area $A$.",
        variables: [
          { symbol: "\\Phi_B", meaning: "Magnetic Flux", unit: "Weber (Wb) = T·m²" },
          { symbol: "B", meaning: "Magnetic Field Strength", unit: "Tesla (T)" },
          { symbol: "A", meaning: "Surface Area of Loop", unit: "m²" },
          { symbol: "\\theta", meaning: "Angle between B and Normal vector to the surface", unit: "degrees or radians" },
        ],
        highYieldTip: "The angle θ is relative to the normal vector, NOT the coil plane! If field is parallel to plane, θ = 90° and flux is zero.",
      },
      {
        id: "f-faraday",
        name: "Faraday-Lenz Law of Induction",
        latex: "$$\\mathcal{E} = -N \\frac{\\Delta \\Phi_B}{\\Delta t} = -N \\frac{d\\Phi_B}{dt}$$",
        description: "The magnitude of induced EMF across a multi-turn coil is directly proportional to the time rate of change of magnetic flux.",
        variables: [
          { symbol: "\\mathcal{E}", meaning: "Induced Electromotive Force (EMF)", unit: "Volts (V)" },
          { symbol: "N", meaning: "Number of tightly packed turns in coil", unit: "dimensionless" },
          { symbol: "\\Delta\\Phi_B / \\Delta t", meaning: "Time rate of flux variation", unit: "Wb/s" },
        ],
        highYieldTip: "The minus sign represents Lenz's Law: induced current produces a magnetic field opposing the change that caused it.",
      },
      {
        id: "f-motional-emf",
        name: "Motional EMF in Straight Conductor",
        latex: "$$\\mathcal{E} = B v L \\sin\\theta$$",
        description: "EMF generated when a rod of length $L$ moves at velocity $v$ perpendicular to a uniform field $B$.",
        variables: [
          { symbol: "v", meaning: "Linear velocity of conductor", unit: "m/s" },
          { symbol: "L", meaning: "Active conductor length inside field", unit: "m" },
        ],
      },
      {
        id: "f-inductance-energy",
        name: "Self-Induced Back EMF & Magnetic Energy",
        latex: "$$\\mathcal{E}_L = -L \\frac{\\Delta I}{\\Delta t}, \\quad U_B = \\frac{1}{2} L I^2$$",
        description: "Back EMF opposing current transients and total magnetic energy stored in an inductor's field.",
        variables: [
          { symbol: "L", meaning: "Self-inductance of coil", unit: "Henry (H) = V·s/A" },
          { symbol: "I", meaning: "Electric current through inductor", unit: "Amperes (A)" },
          { symbol: "U_B", meaning: "Stored magnetic energy", unit: "Joules (J)" },
        ],
      },
      {
        id: "f-transformer",
        name: "Ideal Transformer Voltage & Current Ratios",
        latex: "$$\\frac{V_s}{V_p} = \\frac{N_s}{N_p} = \\frac{I_p}{I_s}$$",
        description: "Primary-to-secondary transformations for an ideal 100% efficient alternating current transformer.",
        variables: [
          { symbol: "V_p, V_s", meaning: "Primary & Secondary voltages", unit: "Volts (V)" },
          { symbol: "N_p, N_s", meaning: "Primary & Secondary turn counts", unit: "dimensionless" },
          { symbol: "I_p, I_s", meaning: "Primary & Secondary currents", unit: "Amperes (A)" },
        ],
      },
    ],
    coreLaws: [
      {
        id: "law-faraday",
        title: "Faraday's Induction Law",
        statement:
          "Whenever there is relative motion between a conductor and a magnetic field, or whenever the magnetic flux threading an electric circuit varies with time, an electromotive force is induced whose magnitude is proportional to the time rate of change of flux.",
        latexFormula: "$$\\mathcal{E} = -N \\frac{d\\Phi_B}{dt}$$",
        keyApplication: "Electric power generation, dynamic microphones, magnetic braking, and induction hobs.",
      },
      {
        id: "law-lenz",
        title: "Lenz's Law (Conservation of Energy)",
        statement:
          "The polarity of an induced electromotive force is always such that any current it produces establishes a magnetic field that opposes the original change in magnetic flux that induced it.",
        keyApplication: "Ensures perpetual motion is impossible; mechanical energy must be supplied to generate electricity.",
      },
    ],
    commonTraps: [
      {
        id: "trap-angle",
        trap: "Using the angle between the coil's plane and B directly into Φ = BA cosθ.",
        correction: "Always calculate θ = 90° - α if the question gives the angle relative to the surface plane.",
        exampleFormula: "$$\\theta_{\\text{formula}} = 90^\\circ - \\theta_{\\text{surface}}$$",
      },
      {
        id: "trap-cm2",
        trap: "Converting cm² to m² by multiplying by 10⁻² instead of 10⁻⁴.",
        correction: "1 cm = 10⁻² m, therefore 1 cm² = (10⁻² m)² = 10⁻⁴ m². For a 10 cm × 5 cm coil, Area = 50 × 10⁻⁴ m² = 5.0 × 10⁻³ m².",
      },
      {
        id: "trap-turn-count",
        trap: "Omitting the turn count multiplier N when computing total induced EMF across a coil.",
        correction: "Total EMF scales directly with N: multiply single-loop EMF by N.",
      },
    ],
  },

  // 2. Physics Grade 12 - Unit 4: Wave Optics & Interference
  {
    id: "cs-phy-12-u4",
    unitId: "phy-12-u4",
    unitNumber: 4,
    unitTitle: "Wave Optics & Interference",
    subject: "Physics",
    subjectId: "physics",
    grade: 12,
    estimatedReadTime: "5 min read",
    summary:
      "Core principles of physical optics: Young's double-slit interference, fringe separation, diffraction grating spectroscopy, and polarization.",
    essentialFormulas: [
      {
        id: "f-fringe-width",
        name: "Linear Fringe Separation (Young's Experiment)",
        latex: "$$\\Delta y = \\frac{\\lambda D}{d}$$",
        description: "The physical distance on a screen between consecutive bright or consecutive dark interference fringes.",
        variables: [
          { symbol: "\\Delta y", meaning: "Fringe separation (fringe width)", unit: "meters (m)" },
          { symbol: "\\lambda", meaning: "Light wavelength", unit: "meters (m)" },
          { symbol: "D", meaning: "Distance from slits to observation screen", unit: "meters (m)" },
          { symbol: "d", meaning: "Center-to-center distance between slits", unit: "meters (m)" },
        ],
        highYieldTip: "Increasing screen distance D or using longer wavelength λ widens fringes; increasing slit spacing d packs fringes closer.",
      },
      {
        id: "f-bright-fringes",
        name: "Condition for Constructive Interference",
        latex: "$$d \\sin\\theta = m \\lambda \\quad (m = 0, \\pm 1, \\pm 2, \\dots)$$",
        description: "Path difference condition producing bright intensity maxima.",
        variables: [
          { symbol: "m", meaning: "Interference order number", unit: "integer" },
          { symbol: "\\theta", meaning: "Angular deflection of m-th maximum", unit: "radians or degrees" },
        ],
      },
      {
        id: "f-dark-fringes",
        name: "Condition for Destructive Interference",
        latex: "$$d \\sin\\theta = \\left(m + \\frac{1}{2}\\right)\\lambda \\quad (m = 0, \\pm 1, \\dots)$$",
        description: "Path difference condition resulting in complete wave cancellation (dark fringes).",
        variables: [{ symbol: "m", meaning: "Order of minimum", unit: "integer" }],
      },
      {
        id: "f-malus",
        name: "Malus's Law of Polarization",
        latex: "$$I = I_0 \\cos^2\\theta$$",
        description: "Transmitted light intensity when polarized light passes through an analyzer rotated at angle θ.",
        variables: [
          { symbol: "I_0", meaning: "Incident polarized intensity", unit: "W/m²" },
          { symbol: "I", meaning: "Transmitted intensity", unit: "W/m²" },
          { symbol: "\\theta", meaning: "Angle between transmission axes", unit: "degrees" },
        ],
      },
    ],
    coreLaws: [
      {
        id: "law-superposition",
        title: "Principle of Wave Superposition",
        statement:
          "When two or more coherent optical wavefronts overlap at a single spatial point, the resultant electric field vector equals the algebraic vector sum of individual electric field vectors.",
        keyApplication: "Coherent laser interference, thin-film anti-reflective coatings, and holographic storage.",
      },
      {
        id: "law-brewster",
        title: "Brewster's Law of Polarization by Reflection",
        statement:
          "Reflected light is completely linearly polarized perpendicular to the plane of incidence when light strikes an interface at Brewster's angle, where the reflected and refracted rays are orthogonal.",
        latexFormula: "$$\\tan\\theta_p = \\frac{n_2}{n_1}$$",
        keyApplication: "Polarized sunglasses, glare reduction filters, and laser cavity windows.",
      },
    ],
    commonTraps: [
      {
        id: "trap-nanometers",
        trap: "Forgetting to convert wavelength from nanometers (nm) to meters.",
        correction: "Always substitute λ in meters: 600 nm = 600 × 10⁻⁹ m = 6.0 × 10⁻⁷ m.",
      },
      {
        id: "trap-slit-unit",
        trap: "Confusing slit separation d (usually mm = 10⁻³ m) with screen distance D (usually meters).",
        correction: "Ensure d and D share identical units (m) before computing fringe width.",
      },
    ],
  },

  // 3. Physics Grade 12 - Unit 6: Modern Physics & Quantum Phenomena
  {
    id: "cs-phy-12-u6",
    unitId: "phy-12-u6",
    unitNumber: 6,
    unitTitle: "Modern Physics & Quantum Phenomena",
    subject: "Physics",
    subjectId: "physics",
    grade: 12,
    estimatedReadTime: "6 min read",
    summary:
      "Quantum nature of light and matter: Planck's photon hypothesis, Einstein's photoelectric effect, de Broglie matter waves, and atomic spectra.",
    essentialFormulas: [
      {
        id: "f-photon-energy",
        name: "Photon Energy & Momentum",
        latex: "$$E = h f = \\frac{h c}{\\lambda}, \\quad p = \\frac{h}{\\lambda}$$",
        description: "Fundamental quantum relation binding electromagnetic radiation energy and momentum to frequency and wavelength.",
        variables: [
          { symbol: "E", meaning: "Photon energy", unit: "Joules (J) or eV" },
          { symbol: "h", meaning: "Planck's constant (6.63 × 10⁻³⁴ J·s or 4.14 × 10⁻¹⁵ eV·s)", unit: "J·s or eV·s" },
          { symbol: "c", meaning: "Speed of light (3.00 × 10⁸ m/s)", unit: "m/s" },
        ],
      },
      {
        id: "f-photoelectric",
        name: "Einstein's Photoelectric Equation",
        latex: "$$K_{\\max} = h f - \\Phi = e V_s$$",
        description: "Maximum kinetic energy of emitted photoelectrons equals incident photon energy minus work function.",
        variables: [
          { symbol: "K_{\\max}", meaning: "Maximum kinetic energy of ejected electron", unit: "eV or J" },
          { symbol: "\\Phi", meaning: "Work function of the photosensitive metal", unit: "eV or J" },
          { symbol: "V_s", meaning: "Stopping potential", unit: "Volts (V)" },
        ],
        highYieldTip: "Light intensity increases the rate of emitted electrons (photocurrent), but does NOT alter K_max! Only photon frequency f changes K_max.",
      },
      {
        id: "f-de-broglie",
        name: "de Broglie Matter Wavelength",
        latex: "$$\\lambda = \\frac{h}{p} = \\frac{h}{m v} = \\frac{h}{\\sqrt{2 m K}}$$",
        description: "Wave-particle duality wavelength associated with any moving particle of mass m and momentum p.",
        variables: [
          { symbol: "m", meaning: "Particle rest mass", unit: "kg" },
          { symbol: "v", meaning: "Particle velocity", unit: "m/s" },
        ],
      },
    ],
    coreLaws: [
      {
        id: "law-photoelectric-principles",
        title: "Laws of the Photoelectric Effect",
        statement:
          "1. Emission occurs only if f ≥ f_0 (threshold frequency).\n2. Maximum kinetic energy K_max depends linearly on frequency f and is independent of intensity.\n3. Electron emission occurs instantaneously (< 10⁻⁹ s) without time lag.",
        keyApplication: "Solar cells, photodetectors, night vision goggles, and photomultiplier tubes.",
      },
    ],
    commonTraps: [
      {
        id: "trap-ev-joule",
        trap: "Mixing electron-volts (eV) and Joules (J) in Einstein's equation.",
        correction: "1 eV = 1.60 × 10⁻¹⁹ J. If using h in eV·s (4.14 × 10⁻¹⁵), keep Φ in eV. If using h in J·s, convert Φ to Joules.",
      },
    ],
  },

  // 4. Mathematics (Natural) Grade 12 - Unit 3: Calculus & Applications of Derivatives
  {
    id: "cs-math-12-u3",
    unitId: "math-12-u3",
    unitNumber: 3,
    unitTitle: "Calculus & Applications of Derivatives",
    subject: "Mathematics (Natural)",
    subjectId: "math-nat",
    grade: 12,
    estimatedReadTime: "7 min read",
    summary:
      "Mastery of differentiation techniques: product, quotient, and chain rules, critical numbers, optimization, concavity, and curve sketching.",
    essentialFormulas: [
      {
        id: "f-product-quotient",
        name: "Product & Quotient Rules",
        latex: "$$(u v)' = u'v + u v', \\quad \\left(\\frac{u}{v}\\right)' = \\frac{u'v - u v'}{v^2}$$",
        description: "Standard derivative operations on composite product and rational functions.",
        variables: [
          { symbol: "u, v", meaning: "Differentiable functions of x", unit: "dimensionless" },
          { symbol: "u', v'", meaning: "First derivatives du/dx and dv/dx", unit: "dimensionless" },
        ],
        highYieldTip: "In quotient rule: low d-high minus high d-low over the square of what's below! Subtraction is NOT commutative.",
      },
      {
        id: "f-chain-rule",
        name: "Chain Rule for Composite Functions",
        latex: "$$\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)$$",
        description: "Differentiating nested function compositions.",
        variables: [
          { symbol: "g(x)", meaning: "Inner function", unit: "dimensionless" },
          { symbol: "f(u)", meaning: "Outer function", unit: "dimensionless" },
        ],
      },
      {
        id: "f-exp-derivatives",
        name: "Exponential & Natural Log Derivatives",
        latex: "$$\\frac{d}{dx}[e^{u(x)}] = u'(x) e^{u(x)}, \\quad \\frac{d}{dx}[\\ln(u(x))] = \\frac{u'(x)}{u(x)}$$",
        description: "Standard calculus derivatives involving Euler's number e and natural logarithms.",
        variables: [{ symbol: "u(x)", meaning: "Differentiable argument", unit: "dimensionless" }],
      },
      {
        id: "f-second-deriv-test",
        name: "Second Derivative Test for Local Extrema",
        latex: "$$f'(c) = 0 \\text{ and } f''(c) > 0 \\implies \\text{Local Min}; \\quad f''(c) < 0 \\implies \\text{Local Max}$$",
        description: "Determining local extrema and concavity at stationary critical points.",
        variables: [{ symbol: "c", meaning: "Critical value where f'(c) = 0", unit: "dimensionless" }],
      },
    ],
    coreLaws: [
      {
        id: "law-mvt",
        title: "Mean Value Theorem (MVT)",
        statement:
          "If f is continuous on [a, b] and differentiable on (a, b), then there exists at least one real c ∈ (a, b) such that f'(c) = [f(b) - f(a)] / (b - a).",
        keyApplication: "Proving uniqueness of roots, monotonicity, and velocity estimation.",
      },
    ],
    commonTraps: [
      {
        id: "trap-min-max-sign",
        trap: "Assuming f''(c) > 0 means a maximum because of the positive sign.",
        correction: "Positive second derivative f''(c) > 0 means the curve is concave UP (holds water), establishing a local MINIMUM!",
      },
      {
        id: "trap-exp-zero",
        trap: "Attempting to solve e^x = 0 for critical numbers.",
        correction: "e^x > 0 for all real x! Exponential terms never vanish, so only the polynomial factor can equal zero.",
      },
    ],
  },

  // 5. Mathematics (Natural) Grade 12 - Unit 4: Integral Calculus & Definite Integrals
  {
    id: "cs-math-12-u4",
    unitId: "math-12-u4",
    unitNumber: 4,
    unitTitle: "Integral Calculus & Definite Integrals",
    subject: "Mathematics (Natural)",
    subjectId: "math-nat",
    grade: 12,
    estimatedReadTime: "6 min read",
    summary:
      "Core integration toolkit: anti-derivatives, Fundamental Theorem of Calculus, substitution method, integration by parts, and area between curves.",
    essentialFormulas: [
      {
        id: "f-by-parts",
        name: "Integration by Parts Formula",
        latex: "$$\\int u \\, dv = u v - \\int v \\, du$$",
        description: "Standard technique for integrating products of algebraic, exponential, and trigonometric terms.",
        variables: [
          { symbol: "u", meaning: "Function chosen via LIATE rule", unit: "dimensionless" },
          { symbol: "dv", meaning: "Remaining differential part to integrate", unit: "dimensionless" },
        ],
        highYieldTip: "Use the LIATE priority rule to select u: Logarithmic > Inverse Trig > Algebraic > Trigonometric > Exponential.",
      },
      {
        id: "f-ftc",
        name: "Fundamental Theorem of Calculus (FTC)",
        latex: "$$\\int_a^b f(x) \\, dx = F(b) - F(a) \\quad \\text{where } F'(x) = f(x)$$",
        description: "Connects differentiation and integration: definite integral equals net change of anti-derivative.",
        variables: [
          { symbol: "a, b", meaning: "Lower and upper limits of integration", unit: "dimensionless" },
          { symbol: "F(x)", meaning: "Anti-derivative of f(x)", unit: "dimensionless" },
        ],
      },
      {
        id: "f-area-curves",
        name: "Area Enclosed Between Two Curves",
        latex: "$$A = \\int_a^b [f_{\\text{top}}(x) - g_{\\text{bottom}}(x)] \\, dx$$",
        description: "Net geometric surface area bounded between two intersecting continuous functions.",
        variables: [
          { symbol: "f_{\\text{top}}", meaning: "Upper bounding function", unit: "dimensionless" },
          { symbol: "g_{\\text{bottom}}", meaning: "Lower bounding function", unit: "dimensionless" },
        ],
      },
    ],
    coreLaws: [
      {
        id: "law-ftc1",
        title: "Leibniz Rule (Differentiation of Integrals)",
        statement:
          "The derivative of an accumulation function with respect to its upper limit yields the integrand evaluated at that limit: d/dx [∫_a^x f(t) dt] = f(x).",
        keyApplication: "Solving differential equations, solving limit indeterminate forms via L'Hôpital's Rule.",
      },
    ],
    commonTraps: [
      {
        id: "trap-by-parts-sign",
        trap: "Adding instead of subtracting the secondary integral in integration by parts.",
        correction: "Always write: ∫ u dv = uv - ∫ v du. If v is negative, take careful note of the double minus sign: -(-∫ ...).",
      },
      {
        id: "trap-exp-factor",
        trap: "Writing ∫ e^(2x) dx = 2 e^(2x) instead of dividing by 2.",
        correction: "Integration is the inverse of differentiation: divide by the coefficient! ∫ e^(kx) dx = (1/k) e^(kx) + C.",
      },
    ],
  },

  // 6. Physics Grade 11 - Unit 2: Two-Dimensional Kinematics & Vectors
  {
    id: "cs-phy-11-u2",
    unitId: "phy-11-u2",
    unitNumber: 2,
    unitTitle: "Two-Dimensional Kinematics & Vectors",
    subject: "Physics",
    subjectId: "physics",
    grade: 11,
    estimatedReadTime: "5 min read",
    summary:
      "Comprehensive analysis of vector kinematics: orthogonal velocity decomposition, projectile trajectory equations, apex elevation, flight duration, and horizontal range.",
    essentialFormulas: [
      {
        id: "f-proj-apex",
        name: "Maximum Projectile Elevation (Apex)",
        latex: "$$H_{\\max} = \\frac{(v_0 \\sin\\theta)^2}{2g} = \\frac{v_{0y}^2}{2g}$$",
        description: "Vertical altitude achieved when vertical velocity component momentarily drops to zero (v_y = 0).",
        variables: [
          { symbol: "v_0", meaning: "Initial launch velocity", unit: "m/s" },
          { symbol: "\\theta", meaning: "Launch elevation angle relative to horizontal", unit: "degrees" },
          { symbol: "g", meaning: "Acceleration due to gravity (9.8 or 10)", unit: "m/s²" },
        ],
      },
      {
        id: "f-proj-range",
        name: "Horizontal Ground Range",
        latex: "$$R = \\frac{v_0^2 \\sin(2\\theta)}{g}$$",
        description: "Total horizontal displacement over level ground (launch height = landing height).",
        variables: [{ symbol: "R", meaning: "Horizontal range", unit: "meters (m)" }],
        highYieldTip: "Maximum range occurs at θ = 45°. Complementary angles (e.g. 30° and 60°) achieve identical horizontal ranges for identical v_0!",
      },
      {
        id: "f-proj-time",
        name: "Total Flight Duration",
        latex: "$$T_{\\text{flight}} = \\frac{2 v_0 \\sin\\theta}{g} = \\frac{2 v_{0y}}{g}$$",
        description: "Total round-trip time elapsed before projectile lands on level terrain.",
        variables: [{ symbol: "T_{\\text{flight}}", meaning: "Total hang time", unit: "seconds (s)" }],
      },
    ],
    coreLaws: [
      {
        id: "law-galileo-independence",
        title: "Independence of Perpendicular Motions",
        statement:
          "Horizontal motion at constant velocity and vertical motion under constant gravitational acceleration occur simultaneously without altering one another.",
        keyApplication: "Ballistic artillery trajectories, aerial supply drops, and sports kinematics.",
      },
    ],
    commonTraps: [
      {
        id: "trap-range-formula-limits",
        trap: "Applying R = (v_0² sin 2θ)/g when the projectile is launched from a cliff above ground level.",
        correction: "The standard range formula is strictly valid for level ground where initial and final vertical coordinates are equal (Δy = 0).",
      },
      {
        id: "trap-denominator-2g",
        trap: "Forgetting the factor of 2 in H_max = v_{0y}² / (2g).",
        correction: "Remember kinematic formula: v_y² = v_{0y}² - 2gΔy. Solving for Δy when v_y = 0 yields denominator 2g, NOT g.",
      },
    ],
  },

  // 7. Physics Grade 9 - Unit 3: Linear Motion & Newton's Laws
  {
    id: "cs-phy-9-u3",
    unitId: "phy-9-u3",
    unitNumber: 3,
    unitTitle: "Linear Motion & Newton's Laws",
    subject: "Physics",
    subjectId: "physics",
    grade: 9,
    estimatedReadTime: "5 min read",
    summary:
      "Foundations of classical mechanics: uniform acceleration, linear kinematics equations, Newton's three governing laws of motion, friction, and momentum conservation.",
    essentialFormulas: [
      {
        id: "f-kinematics-1",
        name: "Linear Kinematics Trio",
        latex: "$$v = u + at, \\quad s = ut + \\frac{1}{2}at^2, \\quad v^2 = u^2 + 2as$$",
        description: "Standard equations governing rectilinear displacement under uniform acceleration.",
        variables: [
          { symbol: "u", meaning: "Initial velocity", unit: "m/s" },
          { symbol: "v", meaning: "Final velocity", unit: "m/s" },
          { symbol: "a", meaning: "Constant acceleration", unit: "m/s²" },
          { symbol: "s", meaning: "Displacement distance", unit: "meters (m)" },
          { symbol: "t", meaning: "Elapsed travel time", unit: "seconds (s)" },
        ],
        highYieldTip: "If a body starts from rest, set u = 0. If it comes to a stop, set v = 0.",
      },
      {
        id: "f-newton2",
        name: "Newton's Second Law & Momentum",
        latex: "$$F_{\\text{net}} = ma = \\frac{\\Delta p}{\\Delta t}, \\quad p = mv$$",
        description: "Net unbalanced force equals mass times acceleration or rate of change of linear momentum.",
        variables: [
          { symbol: "F_{\\text{net}}", meaning: "Net external force", unit: "Newtons (N) = kg·m/s²" },
          { symbol: "m", meaning: "Inertial mass", unit: "kg" },
          { symbol: "p", meaning: "Linear momentum", unit: "kg·m/s" },
        ],
      },
      {
        id: "f-friction",
        name: "Static and Kinetic Friction",
        latex: "$$f_s \\le \\mu_s F_N, \\quad f_k = \\mu_k F_N$$",
        description: "Frictional resistance opposing relative motion between contacting surfaces.",
        variables: [
          { symbol: "\\mu_s, \\mu_k", meaning: "Coefficients of static and kinetic friction (dimensionless)", unit: "dimensionless" },
          { symbol: "F_N", meaning: "Normal contact force", unit: "Newtons (N)" },
        ],
      },
    ],
    coreLaws: [
      {
        id: "law-newton-1",
        title: "Newton's First Law (Law of Inertia)",
        statement:
          "An object continues in its state of rest or uniform motion in a straight line unless acted upon by a net external force.",
        keyApplication: "Seatbelts, orbital satellite persistence, and equilibrium analysis.",
      },
      {
        id: "law-newton-3",
        title: "Newton's Third Law (Action & Reaction)",
        statement:
          "Whenever one body exerts a force on a second body, the second body exerts an equal and oppositely directed force on the first.",
        keyApplication: "Rocket propulsion, walking traction, and recoil mechanics.",
      },
    ],
    commonTraps: [
      {
        id: "trap-action-reaction-cancel",
        trap: "Thinking action and reaction forces cancel each other out.",
        correction: "Action and reaction forces act on TWO DIFFERENT bodies, so they never cancel each other on a single body!",
      },
      {
        id: "trap-weight-mass",
        trap: "Confusing mass (m in kg) with weight (W = mg in Newtons).",
        correction: "Mass is invariant intrinsic inertia (kg); weight is gravitational force (N) varying with local gravity g.",
      },
    ],
  },

  // 8. Mathematics Grade 9 - Unit 4: Quadratic Equations & Inequalities
  {
    id: "cs-math-9-u4",
    unitId: "math-9-u4",
    unitNumber: 4,
    unitTitle: "Quadratic Equations & Inequalities",
    subject: "Mathematics (Natural)",
    subjectId: "math-nat",
    grade: 9,
    estimatedReadTime: "5 min read",
    summary:
      "Core algebraic toolkit for second-degree polynomials: factoring methods, completing the square, quadratic formula, discriminant nature of roots, and sign charts for inequalities.",
    essentialFormulas: [
      {
        id: "f-quad-formula",
        name: "General Quadratic Formula",
        latex: "$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$",
        description: "Analytic solution to any standard quadratic equation ax² + bx + c = 0.",
        variables: [
          { symbol: "a, b, c", meaning: "Real polynomial coefficients (a ≠ 0)", unit: "dimensionless" },
        ],
        highYieldTip: "The leading coefficient 'a' is in the denominator as 2a. When calculating -b, watch out when b is already negative: -(-b) = +b.",
      },
      {
        id: "f-discriminant",
        name: "Discriminant Analysis (Δ)",
        latex: "$$\\Delta = b^2 - 4ac \\implies \\begin{cases} \\Delta > 0: & 2 \\text{ distinct real roots} \\\\ \\Delta = 0: & 1 \\text{ repeated real root} \\\\ \\Delta < 0: & \\text{no real roots (complex)} \\end{cases}$$",
        description: "Determines the exact algebraic nature and graphical x-intercepts of a parabola.",
        variables: [{ symbol: "\\Delta", meaning: "Discriminant value", unit: "dimensionless" }],
      },
      {
        id: "f-quad-vertex",
        name: "Parabola Axis of Symmetry & Vertex",
        latex: "$$x_v = -\\frac{b}{2a}, \\quad y_v = f\\left(-\\frac{b}{2a}\\right) = \\frac{4ac - b^2}{4a}$$",
        description: "Coordinates of the extreme minimum (a > 0) or maximum (a < 0) point of a quadratic curve.",
        variables: [{ symbol: "(x_v, y_v)", meaning: "Vertex coordinate point", unit: "dimensionless" }],
      },
    ],
    coreLaws: [
      {
        id: "law-zero-product",
        title: "Zero Product Property",
        statement: "If the product of two real expressions equals zero (AB = 0), then at least one factor must equal zero (A = 0 or B = 0).",
        keyApplication: "Solving factorable quadratic polynomials and algebraic rational equations.",
      },
    ],
    commonTraps: [
      {
        id: "trap-inequality-negative-divide",
        trap: "Dividing an algebraic inequality by a negative number without reversing the inequality symbol.",
        correction: "Whenever you multiply or divide both sides by a negative scalar, the inequality sign MUST FLIP: -2x < 6 ⟹ x > -3.",
      },
    ],
  },

  // 9. Physics Grade 10 - Unit 4: Electrostatics & Electric Potential
  {
    id: "cs-phy-10-u4",
    unitId: "phy-10-u4",
    unitNumber: 4,
    unitTitle: "Electrostatics & Electric Fields",
    subject: "Physics",
    subjectId: "physics",
    grade: 10,
    estimatedReadTime: "6 min read",
    summary:
      "Core electrostatic principles: Coulomb's inverse-square law, vector electric field intensity, field line topology, electric potential energy, and parallel-plate capacitance.",
    essentialFormulas: [
      {
        id: "f-coulomb",
        name: "Coulomb's Law of Electrostatic Force",
        latex: "$$F = k_e \\frac{|q_1 q_2|}{r^2}, \\quad k_e = \\frac{1}{4\\pi \\varepsilon_0} \\approx 8.99 \\times 10^9 \\text{ N}\\cdot\\text{m}^2/\\text{C}^2$$",
        description: "Mutual electrostatic force between two stationary point charges separated by distance r in vacuum.",
        variables: [
          { symbol: "q_1, q_2", meaning: "Point charges", unit: "Coulombs (C)" },
          { symbol: "r", meaning: "Separation distance", unit: "meters (m)" },
          { symbol: "k_e", meaning: "Coulomb's constant", unit: "N·m²/C²" },
        ],
        highYieldTip: "Like charges repel; unlike charges attract. The force is an action-reaction pair along the line joining charge centers.",
      },
      {
        id: "f-electric-field",
        name: "Electric Field Intensity & Potential",
        latex: "$$E = \\frac{F}{q_0} = k_e \\frac{Q}{r^2}, \\quad V = \\frac{W}{q_0} = k_e \\frac{Q}{r}$$",
        description: "Vector force per unit positive test charge and scalar electric potential.",
        variables: [
          { symbol: "E", meaning: "Electric field strength", unit: "N/C or V/m" },
          { symbol: "V", meaning: "Electric potential", unit: "Volts (V) = J/C" },
        ],
      },
      {
        id: "f-capacitance",
        name: "Parallel Plate Capacitance",
        latex: "$$C = \\frac{Q}{V} = \\varepsilon_r \\varepsilon_0 \\frac{A}{d}$$",
        description: "Charge storage capacity of two parallel conducting plates of area A separated by distance d.",
        variables: [
          { symbol: "C", meaning: "Capacitance", unit: "Farads (F)" },
          { symbol: "A", meaning: "Plate surface area", unit: "m²" },
          { symbol: "d", meaning: "Plate separation", unit: "meters (m)" },
        ],
      },
    ],
    coreLaws: [
      {
        id: "law-charge-conservation",
        title: "Law of Conservation of Electric Charge",
        statement:
          "The net electric charge in an isolated physical system remains constant regardless of internal electronic transfers or chemical reactions.",
        keyApplication: "Triboelectric charging, electrostatic induction, and nuclear reaction balancing.",
      },
    ],
    commonTraps: [
      {
        id: "trap-vector-vs-scalar",
        trap: "Adding electric potential V as vectors with directional angles.",
        correction: "Electric potential V is a SCALAR quantity: simply add voltages algebraically with their signs (V_total = V_1 + V_2).",
      },
    ],
  },

  // 10. Mathematics Grade 10 - Unit 2: Polynomial & Rational Functions
  {
    id: "cs-math-10-u2",
    unitId: "math-10-u2",
    unitNumber: 2,
    unitTitle: "Polynomial & Rational Functions",
    subject: "Mathematics (Natural)",
    subjectId: "math-nat",
    grade: 10,
    estimatedReadTime: "6 min read",
    summary:
      "Advanced algebraic analysis: polynomial long division, synthetic division, Remainder Theorem, Factor Theorem, rational function zeros, and vertical/horizontal asymptotes.",
    essentialFormulas: [
      {
        id: "f-poly-division",
        name: "Polynomial Division Algorithm",
        latex: "$$P(x) = D(x) \\cdot Q(x) + R(x) \\quad \\text{where } \\deg(R) < \\deg(D)$$",
        description: "Expresses a dividend polynomial in terms of divisor, quotient, and remainder.",
        variables: [
          { symbol: "P(x)", meaning: "Dividend polynomial", unit: "dimensionless" },
          { symbol: "D(x)", meaning: "Divisor polynomial", unit: "dimensionless" },
          { symbol: "Q(x)", meaning: "Quotient polynomial", unit: "dimensionless" },
          { symbol: "R(x)", meaning: "Remainder polynomial", unit: "dimensionless" },
        ],
      },
      {
        id: "f-remainder-theorem",
        name: "Remainder Theorem & Factor Theorem",
        latex: "$$P(c) = R \\quad \\text{and} \\quad P(c) = 0 \\iff (x - c) \\text{ is a factor of } P(x)$$",
        description: "Direct evaluation of polynomial division remainder without performing long division.",
        variables: [{ symbol: "c", meaning: "Root evaluation scalar", unit: "dimensionless" }],
        highYieldTip: "If dividing by (ax - b), evaluate P(b/a). The remainder is always a constant if the divisor is linear.",
      },
      {
        id: "f-rational-asymptotes",
        name: "Rational Function Asymptotes",
        latex: "$$f(x) = \\frac{a_n x^n + \\dots}{b_m x^m + \\dots} \\implies \\begin{cases} n < m: & y = 0 \\\\ n = m: & y = \\frac{a_n}{b_m} \\\\ n = m + 1: & \\text{slant (oblique)} \\end{cases}$$",
        description: "End behavior and horizontal/oblique asymptotes governed by leading polynomial degrees.",
        variables: [{ symbol: "n, m", meaning: "Degrees of numerator and denominator", unit: "dimensionless" }],
      },
    ],
    coreLaws: [
      {
        id: "law-factor-theorem",
        title: "The Factor Theorem",
        statement: "A polynomial P(x) has a linear factor (x - c) if and only if P(c) = 0.",
        keyApplication: "Factoring cubic polynomials, solving higher-degree equations, and finding polynomial roots.",
      },
    ],
    commonTraps: [
      {
        id: "trap-hole-vs-asymptote",
        trap: "Assuming every zero of the denominator creates a vertical asymptote.",
        correction: "If (x - c) cancels completely with a factor in the numerator, it forms a removable discontinuity (HOLE), NOT a vertical asymptote!",
      },
    ],
  },

  // 11. Mathematics Grade 11 - Unit 2: Matrices and Determinants
  {
    id: "cs-math-11-u2",
    unitId: "math-11-u2",
    unitNumber: 2,
    unitTitle: "Matrices and Determinants",
    subject: "Mathematics (Natural)",
    subjectId: "math-nat",
    grade: 11,
    estimatedReadTime: "6 min read",
    summary:
      "Matrix algebra toolkit: matrix multiplication rules, determinants of 2x2 and 3x3 matrices, adjugate matrices, multiplicative inverses, and Cramer's Rule for linear systems.",
    essentialFormulas: [
      {
        id: "f-mat-det",
        name: "Determinant of 2x2 and 3x3 Matrices",
        latex: "$$\\det \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc$$",
        description: "Scalar value associated with square matrices reflecting geometric area scaling.",
        variables: [{ symbol: "a,b,c,d", meaning: "Matrix elements", unit: "dimensionless" }],
      },
      {
        id: "f-mat-inverse",
        name: "Matrix Inverse Formula",
        latex: "$$A^{-1} = \\frac{1}{\\det(A)} \\text{adj}(A) = \\frac{1}{ad - bc} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$$",
        description: "Multiplicative inverse satisfying AA⁻¹ = A⁻¹A = I.",
        variables: [{ symbol: "A^{-1}", meaning: "Inverse matrix (exists if det(A) ≠ 0)", unit: "dimensionless" }],
        highYieldTip: "Swap the main diagonal elements (a and d), and negate the off-diagonal elements (-b and -c). Divide every term by det(A).",
      },
    ],
    coreLaws: [
      {
        id: "law-mat-noncommutative",
        title: "Non-Commutativity of Matrix Multiplication",
        statement: "In general for matrices A and B, AB ≠ BA even when both matrix products are defined.",
        keyApplication: "Computer graphics transformations, cryptography, and linear systems.",
      },
    ],
    commonTraps: [
      {
        id: "trap-det-zero",
        trap: "Attempting to invert a singular matrix where det(A) = 0.",
        correction: "If det(A) = 0, the matrix is singular and has NO inverse (division by zero is undefined).",
      },
    ],
  },
  {
    "id": "cs-chem-12-u2",
    "unitId": "chem-12-u2",
    "unitNumber": 2,
    "unitTitle": "Chemical Kinetics & Reaction Rates",
    "subject": "Chemistry",
    "subjectId": "chemistry",
    "grade": 12,
    "estimatedReadTime": "6 min read",
    "summary": "Essential kinetics formulas: differential rate equations, reaction orders from initial rates, integrated first-order rate law, half-life formulas, Arrhenius equation, and catalyst mechanisms.",
    "essentialFormulas": [
      {
        "id": "f-rate-law",
        "name": "General Rate Law Equation",
        "latex": "$$\\text{Rate} = k [A]^m [B]^n$$",
        "description": "Expresses how reaction velocity depends on instantaneous molar concentrations of reactants.",
        "variables": [
          {
            "symbol": "k",
            "meaning": "Rate constant (temperature-dependent)",
            "unit": "depends on overall order"
          },
          {
            "symbol": "m, n",
            "meaning": "Reaction orders (determined experimentally)",
            "unit": "dimensionless"
          }
        ],
        "highYieldTip": "The reaction orders m and n NEVER come from stoichiometric coefficients of a balanced equation unless it is an elementary step!"
      },
      {
        "id": "f-first-order-half-life",
        "name": "First-Order Integrated Rate Law & Half-Life",
        "latex": "$$\\ln\\left(\\frac{[A]_t}{[A]_0}\\right) = -kt, \\quad t_{1/2} = \\frac{0.693}{k}$$",
        "description": "Describes exponential decay where half-life is strictly independent of starting reactant concentration.",
        "variables": [
          {
            "symbol": "t_{1/2}",
            "meaning": "Half-life of reaction",
            "unit": "seconds or minutes"
          },
          {
            "symbol": "[A]_0, [A]_t",
            "meaning": "Initial and remaining concentrations",
            "unit": "M (mol/L)"
          }
        ]
      },
      {
        "id": "f-arrhenius",
        "name": "Arrhenius Equation (Activation Energy)",
        "latex": "$$k = A e^{-\\frac{E_a}{RT}} \\iff \\ln\\left(\\frac{k_2}{k_1}\\right) = \\frac{E_a}{R}\\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right)$$",
        "description": "Quantifies the temperature dependence of reaction rate constants through activation barrier Ea.",
        "variables": [
          {
            "symbol": "E_a",
            "meaning": "Activation energy",
            "unit": "J/mol or kJ/mol"
          },
          {
            "symbol": "R",
            "meaning": "Universal gas constant = 8.314",
            "unit": "J/(mol·K)"
          },
          {
            "symbol": "T",
            "meaning": "Absolute temperature",
            "unit": "Kelvin (K)"
          }
        ]
      }
    ],
    "coreLaws": [
      {
        "id": "law-collision-theory",
        "title": "Collision Theory of Reaction Rates",
        "statement": "For a reaction to occur, reactant particles must collide with sufficient kinetic energy exceeding activation energy (Ea) and in proper spatial orientation.",
        "keyApplication": "Explains how increasing temperature, surface area, and concentration exponentially accelerate reaction rates."
      }
    ],
    "commonTraps": [
      {
        "id": "trap-order-stoich",
        "trap": "Writing the rate law directly from the balanced chemical equation coefficients.",
        "correction": "Rate laws must be determined empirically from initial rate experiments, not stoichiometric coefficients."
      }
    ]
  },
  {
    "id": "cs-chem-12-u3",
    "unitId": "chem-12-u3",
    "unitNumber": 3,
    "unitTitle": "Chemical Equilibrium & Le Chatelier",
    "subject": "Chemistry",
    "subjectId": "chemistry",
    "grade": 12,
    "estimatedReadTime": "7 min read",
    "summary": "Core principles of dynamic chemical equilibrium: equilibrium expressions Kc and Kp, reaction quotient Q, Le Chatelier's stress response rules, pH calculations, and buffer solutions.",
    "essentialFormulas": [
      {
        "id": "f-kc-kp",
        "name": "Equilibrium Constant Relation (Kc & Kp)",
        "latex": "$$K_p = K_c (RT)^{\\Delta n}$$",
        "description": "Relates partial pressure equilibrium constant Kp to molar concentration equilibrium constant Kc.",
        "variables": [
          {
            "symbol": "\\Delta n",
            "meaning": "Moles of gaseous products minus moles of gaseous reactants",
            "unit": "dimensionless"
          },
          {
            "symbol": "R",
            "meaning": "Gas constant = 0.0821",
            "unit": "L·atm/(mol·K)"
          }
        ],
        "highYieldTip": "Pure solids and pure liquids are OMITTED from the equilibrium expression! Only aqueous and gaseous species appear."
      },
      {
        "id": "f-henderson-hasselbalch",
        "name": "Henderson-Hasselbalch Buffer Equation",
        "latex": "$$\\text{pH} = \\text{pK}_a + \\log\\left(\\frac{[A^-]}{[HA]}\\right)$$",
        "description": "Calculates the pH of a conjugate acid-base buffer system.",
        "variables": [
          {
            "symbol": "\\text{pK}_a",
            "meaning": "-log₁₀(Ka) of weak acid",
            "unit": "dimensionless"
          },
          {
            "symbol": "[A^-]",
            "meaning": "Molar concentration of conjugate base",
            "unit": "M"
          },
          {
            "symbol": "[HA]",
            "meaning": "Molar concentration of weak acid",
            "unit": "M"
          }
        ]
      }
    ],
    "coreLaws": [
      {
        "id": "law-le-chatelier",
        "title": "Le Chatelier's Principle",
        "statement": "If a dynamic equilibrium system is subjected to a disturbance in concentration, pressure, or temperature, the system will shift its equilibrium position to partially counteract the applied stress.",
        "keyApplication": "Optimizing ammonia yield in the Haber Process and sulfuric acid yield in the Contact Process."
      }
    ],
    "commonTraps": [
      {
        "id": "trap-catalyst-eq",
        "trap": "Believing a catalyst increases the equilibrium yield of products.",
        "correction": "A catalyst speeds up both forward and reverse reactions equally; it shortens the time to reach equilibrium without changing Kc or yield."
      }
    ]
  },
  {
    "id": "cs-chem-12-u4",
    "unitId": "chem-12-u4",
    "unitNumber": 4,
    "unitTitle": "Electrochemistry & Galvanic Cells",
    "subject": "Chemistry",
    "subjectId": "chemistry",
    "grade": 12,
    "estimatedReadTime": "6 min read",
    "summary": "Redox mastery: galvanic cell potentials, anode vs. cathode identification (AN OX / RED CAT), Nernst equation, Faraday's laws of electrolysis, and corrosion prevention.",
    "essentialFormulas": [
      {
        "id": "f-cell-potential",
        "name": "Standard Cell Potential",
        "latex": "$$E^\\circ_{\\text{cell}} = E^\\circ_{\\text{cathode}} - E^\\circ_{\\text{anode}}$$",
        "description": "Electromotive force of a galvanic cell computed from standard reduction tables.",
        "variables": [
          {
            "symbol": "E^\\circ",
            "meaning": "Standard reduction potential at 25°C, 1 M, 1 atm",
            "unit": "Volts (V)"
          }
        ],
        "highYieldTip": "Spontaneous reactions always have E°cell > 0 and ΔG° < 0! Never multiply E° by stoichiometric multipliers when balancing electrons."
      },
      {
        "id": "f-faraday-electrolysis",
        "name": "Faraday's First Law of Electrolysis",
        "latex": "$$m = \\frac{M \\cdot I \\cdot t}{n \\cdot F}$$",
        "description": "Calculates the mass of substance liberated or electroplated onto an electrode.",
        "variables": [
          {
            "symbol": "m",
            "meaning": "Mass of deposited metal",
            "unit": "grams (g)"
          },
          {
            "symbol": "M",
            "meaning": "Molar mass of element",
            "unit": "g/mol"
          },
          {
            "symbol": "I",
            "meaning": "Electric current",
            "unit": "Amperes (A)"
          },
          {
            "symbol": "t",
            "meaning": "Time in seconds",
            "unit": "s"
          },
          {
            "symbol": "n",
            "meaning": "Number of electrons transferred per ion",
            "unit": "dimensionless"
          },
          {
            "symbol": "F",
            "meaning": "Faraday constant ≈ 96,500",
            "unit": "C/mol e⁻"
          }
        ]
      }
    ],
    "coreLaws": [
      {
        "id": "law-an-ox-red-cat",
        "title": "Electrode Polarity & Reactions (AN OX / RED CAT)",
        "statement": "Oxidation occurs at the Anode (An Ox); Reduction occurs at the Cathode (Red Cat). In a galvanic cell, the anode is negative and cathode is positive.",
        "keyApplication": "Batteries, fuel cells, electroplating, and sacrificial magnesium anodes on iron pipelines."
      }
    ],
    "commonTraps": [
      {
        "id": "trap-seconds-faraday",
        "trap": "Plugging time in minutes or hours directly into Faraday's equation without converting to seconds.",
        "correction": "Always convert time to seconds: t (seconds) = hours × 3600 or minutes × 60."
      }
    ]
  },
  {
    "id": "cs-chem-11-u3",
    "unitId": "chem-11-u3",
    "unitNumber": 3,
    "unitTitle": "States of Matter & Gas Laws",
    "subject": "Chemistry",
    "subjectId": "chemistry",
    "grade": 11,
    "estimatedReadTime": "5 min read",
    "summary": "Core gas laws: Ideal Gas Law PV = nRT, Boyle's, Charles's, and Avogadro's laws, Dalton's partial pressures, and Graham's effusion law.",
    "essentialFormulas": [
      {
        "id": "f-ideal-gas",
        "name": "Ideal Gas Law Equation",
        "latex": "$$P V = n R T = \\frac{m}{M} R T \\iff M = \\frac{\\rho R T}{P}$$",
        "description": "Fundamental equation of state connecting pressure, volume, moles, and temperature.",
        "variables": [
          {
            "symbol": "P",
            "meaning": "Pressure (atm)",
            "unit": "atm or kPa"
          },
          {
            "symbol": "V",
            "meaning": "Volume (Liters)",
            "unit": "L"
          },
          {
            "symbol": "n",
            "meaning": "Amount of gas",
            "unit": "moles"
          },
          {
            "symbol": "T",
            "meaning": "Absolute temperature in Kelvin (T = °C + 273)",
            "unit": "K"
          },
          {
            "symbol": "\\rho",
            "meaning": "Gas density",
            "unit": "g/L"
          }
        ],
        "highYieldTip": "Temperature MUST always be converted to Kelvin! T(K) = °C + 273.15."
      },
      {
        "id": "f-graham-effusion",
        "name": "Graham's Law of Effusion & Diffusion",
        "latex": "$$\\frac{\\text{Rate}_1}{\\text{Rate}_2} = \\sqrt{\\frac{M_2}{M_1}}$$",
        "description": "Lighter gas molecules travel and effuse faster than heavier gas molecules at identical temperature.",
        "variables": [
          {
            "symbol": "M_1, M_2",
            "meaning": "Molar masses of gases 1 and 2",
            "unit": "g/mol"
          }
        ]
      }
    ],
    "coreLaws": [
      {
        "id": "law-dalton-pressures",
        "title": "Dalton's Law of Partial Pressures",
        "statement": "The total pressure exerted by a mixture of non-reacting gases is equal to the sum of the partial pressures that each gas would exert if it alone occupied the volume.",
        "keyApplication": "Collecting gases over water: P(dry gas) = P(total) - P(water vapor)."
      }
    ],
    "commonTraps": [
      {
        "id": "trap-graham-inverse",
        "trap": "Writing Rate₁/Rate₂ = √(M₁/M₂) instead of the inverse ratio √(M₂/M₁).",
        "correction": "Heavier gases move slower; the molar masses are inversely positioned under the square root."
      }
    ]
  },
  {
    "id": "cs-bio-12-u1",
    "unitId": "bio-12-u1",
    "unitNumber": 1,
    "unitTitle": "Molecular Genetics & DNA Replication",
    "subject": "Biology",
    "subjectId": "biology",
    "grade": 12,
    "estimatedReadTime": "6 min read",
    "summary": "The molecular architecture of heredity: Watson-Crick DNA double helix, Chargaff's rules, semi-conservative replication machinery, transcription from DNA to mRNA, and translation of the genetic code.",
    "essentialFormulas": [
      {
        "id": "f-chargaff",
        "name": "Chargaff's Base-Pairing Rules",
        "latex": "$$\\%A = \\%T, \\quad \\%G = \\%C, \\quad \\frac{A + G}{T + C} = 1.0$$",
        "description": "In double-stranded DNA, purines (A+G) always equal pyrimidines (T+C) via complementary hydrogen bonding.",
        "variables": [
          {
            "symbol": "A, T",
            "meaning": "Adenine and Thymine (joined by 2 hydrogen bonds)",
            "unit": "percent"
          },
          {
            "symbol": "G, C",
            "meaning": "Guanine and Cytosine (joined by 3 hydrogen bonds)",
            "unit": "percent"
          }
        ],
        "highYieldTip": "G-C base pairs have 3 hydrogen bonds while A-T has only 2; DNA with higher GC content has a higher melting temperature (Tm)."
      }
    ],
    "coreLaws": [
      {
        "id": "law-central-dogma",
        "title": "The Central Dogma of Molecular Biology",
        "statement": "Genetic information flows unidirectionally from DNA to RNA (via transcription in nucleus) and from RNA to functional protein (via translation at ribosomes): DNA → RNA → Protein.",
        "keyApplication": "Recombinant insulin production, mRNA vaccines, and genetic testing."
      }
    ],
    "commonTraps": [
      {
        "id": "trap-rna-thymine",
        "trap": "Writing Thymine (T) in an mRNA sequence instead of Uracil (U).",
        "correction": "RNA contains Uracil (U) in place of Thymine (T). In transcription: Adenine (A) in DNA template pairs with Uracil (U) in mRNA."
      }
    ]
  },
  {
    "id": "cs-bio-11-u3",
    "unitId": "bio-11-u3",
    "unitNumber": 3,
    "unitTitle": "Cellular Respiration & Photosynthesis",
    "subject": "Biology",
    "subjectId": "biology",
    "grade": 11,
    "estimatedReadTime": "7 min read",
    "summary": "Bioenergetics breakdown: Glycolysis (cytoplasm), Krebs Cycle (mitochondrial matrix), Electron Transport Chain (cristae), light-dependent reactions (thylakoids), and Calvin cycle (stroma).",
    "essentialFormulas": [
      {
        "id": "f-respiration-yield",
        "name": "Aerobic Cellular Respiration Overall Equation & ATP Balance",
        "latex": "$$\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 \\rightarrow 6\\text{CO}_2 + 6\\text{H}_2\\text{O} + 30\\text{ to }32\\text{ ATP}$$",
        "description": "Complete enzymatic oxidation of glucose generating chemical energy stored in ATP molecules.",
        "variables": [
          {
            "symbol": "\\text{Glycolysis}",
            "meaning": "Produces net 2 ATP + 2 NADH (cytosol)",
            "unit": ""
          },
          {
            "symbol": "\\text{Krebs Cycle}",
            "meaning": "Produces 2 ATP + 6 NADH + 2 FADH₂ per glucose",
            "unit": ""
          },
          {
            "symbol": "\\text{ETC / Chemiosmosis}",
            "meaning": "Generates ~26-28 ATP via ATP synthase",
            "unit": ""
          }
        ],
        "highYieldTip": "Oxygen (O₂) is strictly required only at the final step of the electron transport chain as the terminal electron acceptor, forming H₂O!"
      }
    ],
    "coreLaws": [
      {
        "id": "law-chemiosmosis",
        "title": "Chemiosmotic ATP Synthesis (Mitchell Hypothesis)",
        "statement": "Electron transport along respiratory complexes pumps protons (H⁺) from the matrix into the intermembrane space, creating a proton-motive electrochemical gradient that drives ATP synthase.",
        "keyApplication": "Explains how ATP synthase produces the vast majority of cellular energy."
      }
    ],
    "commonTraps": [
      {
        "id": "trap-glycolysis-oxygen",
        "trap": "Believing that glycolysis requires molecular oxygen.",
        "correction": "Glycolysis is an anaerobic pathway occurring in the cytoplasm; it functions whether oxygen is present or absent."
      }
    ]
  },
  {
    "id": "cs-bio-11-u4",
    "unitId": "bio-11-u4",
    "unitNumber": 4,
    "unitTitle": "Mendelian Genetics & Inheritance Patterns",
    "subject": "Biology",
    "subjectId": "biology",
    "grade": 11,
    "estimatedReadTime": "6 min read",
    "summary": "Genetic inheritance laws: Mendel's Law of Segregation and Independent Assortment, monohybrid (3:1) and dihybrid (9:3:3:1) crosses, test crosses, codominance (ABO blood groups), and X-linked recessive traits.",
    "essentialFormulas": [
      {
        "id": "f-hardy-weinberg",
        "name": "Hardy-Weinberg Population Genetics Equilibrium",
        "latex": "$$p + q = 1, \\quad p^2 + 2pq + q^2 = 1$$",
        "description": "Calculates allele frequencies (p, q) and genotype frequencies (homozygous dominant, heterozygous, homozygous recessive) in an idealized population.",
        "variables": [
          {
            "symbol": "p",
            "meaning": "Frequency of dominant allele (A)",
            "unit": "fraction"
          },
          {
            "symbol": "q",
            "meaning": "Frequency of recessive allele (a)",
            "unit": "fraction"
          },
          {
            "symbol": "2pq",
            "meaning": "Frequency of heterozygous carriers (Aa)",
            "unit": "fraction"
          },
          {
            "symbol": "q^2",
            "meaning": "Frequency of homozygous recessive phenotype (aa)",
            "unit": "fraction"
          }
        ],
        "highYieldTip": "Always find q first! Take the square root of the recessive phenotype frequency: q = √(frequency of aa)."
      }
    ],
    "coreLaws": [
      {
        "id": "law-mendel-segregation",
        "title": "Mendel's First Law (Law of Segregation)",
        "statement": "During gamete formation (meiosis), the two alleles for each gene segregate from each other so that each gamete carries only one allele for each gene locus.",
        "keyApplication": "Explains the reappearance of recessive traits in F2 generations."
      },
      {
        "id": "law-mendel-independent",
        "title": "Mendel's Second Law (Law of Independent Assortment)",
        "statement": "Genes for different traits can segregate independently during the formation of gametes, provided the gene loci are on non-homologous chromosomes.",
        "keyApplication": "Generates the classical 9:3:3:1 phenotypic ratio in dihybrid crosses."
      }
    ],
    "commonTraps": [
      {
        "id": "trap-sex-linked-father",
        "trap": "Assuming a father can pass an X-linked recessive condition (like hemophilia or colorblindness) to his sons.",
        "correction": "Fathers pass their Y chromosome to sons and their X chromosome to daughters. Sons receive X-linked traits exclusively from their mother!"
      }
    ]
  }
];
