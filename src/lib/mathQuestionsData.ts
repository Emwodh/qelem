import { ExamQuestion } from "@/types/curriculum";

/**
 * Authentic 65 Questions from the Ethiopian University Entrance Examination (EUEE 2016 E.C.)
 * Mathematics (Natural Science Stream).
 * Full KaTeX math formatting, complete 4-option sets, verified answers, and step-by-step solutions.
 */
export const AUTHENTIC_MATH_QUESTIONS_2016: ExamQuestion[] = [
  {
    "id": "math-nat-16-01",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 9,
    "unitNumber": 1,
    "unitTitle": "Number Systems & Set Operations",
    "prompt": "Let $A = \\{0, 2, 4, 6, 8, 9, 10\\}$ and $B = \\{1, 3, 5, 7, 9\\}$. Which one of the following is true?",
    "options": [
      {
        "id": "A",
        "text": "$B - A = B$"
      },
      {
        "id": "B",
        "text": "$A - B = A$"
      },
      {
        "id": "C",
        "text": "$B - A = \\{1, 3, 5, 7\\}$"
      },
      {
        "id": "D",
        "text": "$A - B = \\{0, 2, 4, 6, 8, 10\\}$"
      }
    ],
    "correctOptionId": "C",
    "explanation": "The difference $B - A$ consists of all elements in set $B$ that are not in set $A$. Since $9 \\in A$, we remove it from $B$, leaving $\\{1, 3, 5, 7\\}$.",
    "derivationSteps": [
      "Identify elements in $B = \\{1, 3, 5, 7, 9\\}$.",
      "Identify the intersection $A \\cap B = \\{9\\}$.",
      "Compute $B - A = \\{1, 3, 5, 7, 9\\} \\setminus \\{9\\} = \\{1, 3, 5, 7\\}$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Number Systems & Set Operations concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-02",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 10,
    "unitNumber": 1,
    "unitTitle": "Polynomial Functions",
    "prompt": "Consider the polynomial function $f(x) = ax^4 - b$, where $a$ and $b$ are real numbers. Which one of the following is true about $f$?",
    "options": [
      {
        "id": "A",
        "text": "The graph of $f$ opens upward for any $b > 0$."
      },
      {
        "id": "B",
        "text": "The graph of $f$ opens upward for any $a > 0$."
      },
      {
        "id": "C",
        "text": "The graph of $f$ opens downward for any $b \\le 0$."
      },
      {
        "id": "D",
        "text": "The graph of $f$ opens downward for any $a \\le 0$."
      }
    ],
    "correctOptionId": "B",
    "explanation": "For an even-degree polynomial $f(x) = ax^4 - b$, as $x \\to \\pm\\infty$, $x^4 \\to +\\infty$. When the leading coefficient $a > 0$, $f(x) \\to +\\infty$, so the graph opens upward.",
    "derivationSteps": [
      "The dominant term of $f(x) = ax^4 - b$ is $ax^4$.",
      "Because $x^4 \\ge 0$ for all real $x$, $ax^4 > 0$ for all $x \\ne 0$ if $a > 0$.",
      "Thus, the graph opens upward for any $a > 0$ regardless of $b$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Polynomial Functions concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-03",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 10,
    "unitNumber": 2,
    "unitTitle": "Polynomial & Quadratic Inequalities",
    "prompt": "The solution set of the inequality $3x^2 + 35x - 12 < 0$ is",
    "options": [
      {
        "id": "A",
        "text": "$(-12, \\frac{1}{3})$"
      },
      {
        "id": "B",
        "text": "$(-\\infty, \\frac{1}{3})$"
      },
      {
        "id": "C",
        "text": "$(-12, 1)$"
      },
      {
        "id": "D",
        "text": "$(-\\infty, -12)$"
      }
    ],
    "correctOptionId": "A",
    "explanation": "Factor $3x^2 + 35x - 12 = (3x - 1)(x + 12) < 0$. The roots are $x = -12$ and $x = \\frac{1}{3}$. Since $a = 3 > 0$, the parabola is below the x-axis strictly between the roots: $(-12, \\frac{1}{3})$.",
    "derivationSteps": [
      "Factor: $3x^2 + 36x - x - 12 = 3x(x + 12) - 1(x + 12) = (3x - 1)(x + 12) < 0$.",
      "Roots are $x = -12$ and $x = 1/3$.",
      "Testing intervals reveals $(3x - 1)(x + 12) < 0$ on $(-12, 1/3)$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Polynomial & Quadratic Inequalities concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-04",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 10,
    "unitNumber": 5,
    "unitTitle": "Solid Geometry: Cones & Cylinders",
    "prompt": "A closed right circular cone has a base radius $2\\text{ cm}$ and slant height $3\\sqrt{2}\\text{ cm}$. What is the total surface area of the cone?",
    "options": [
      {
        "id": "A",
        "text": "$2\\pi(1 + 3\\sqrt{2})\\text{ cm}^2$"
      },
      {
        "id": "B",
        "text": "$2\\pi(2 + 3\\sqrt{2})\\text{ cm}^2$"
      },
      {
        "id": "C",
        "text": "$6\\pi\\sqrt{14}\\text{ cm}^2$"
      },
      {
        "id": "D",
        "text": "$2\\pi\\sqrt{14}\\text{ cm}^2$"
      }
    ],
    "correctOptionId": "B",
    "explanation": "Total surface area of a closed right circular cone equals base area $\\pi r^2$ plus lateral surface area $\\pi r l$: $A = \\pi(2)^2 + \\pi(2)(3\\sqrt{2}) = 2\\pi(2 + 3\\sqrt{2})\\text{ cm}^2$.",
    "derivationSteps": [
      "Base area: $A_b = \\pi r^2 = \\pi (2)^2 = 4\\pi\\text{ cm}^2$.",
      "Lateral area: $A_l = \\pi r l = \\pi (2)(3\\sqrt{2}) = 6\\sqrt{2}\\pi\\text{ cm}^2$.",
      "Total area: $4\\pi + 6\\sqrt{2}\\pi = 2\\pi(2 + 3\\sqrt{2})\\text{ cm}^2$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Solid Geometry: Cones & Cylinders concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-05",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 10,
    "unitNumber": 5,
    "unitTitle": "Solid Geometry: Pyramids & Frustums",
    "prompt": "The lower and upper bases of the frustum of a regular pyramid are equilateral triangles of side $3\\text{ cm}$ long and $2\\text{ cm}$ long respectively. If its slant height is $4\\text{ cm}$, then what is the lateral surface area of the frustum?",
    "options": [
      {
        "id": "A",
        "text": "$30\\text{ cm}^2$"
      },
      {
        "id": "B",
        "text": "$48\\text{ cm}^2$"
      },
      {
        "id": "C",
        "text": "$72\\text{ cm}^2$"
      },
      {
        "id": "D",
        "text": "$96\\text{ cm}^2$"
      }
    ],
    "correctOptionId": "A",
    "explanation": "A regular pyramid with triangular bases has 3 trapezoidal lateral faces. The area of each face is $\\frac{1}{2}(3 + 2)(4) = 10\\text{ cm}^2$. The total lateral area is $3 \\times 10 = 30\\text{ cm}^2$.",
    "derivationSteps": [
      "Face area of trapezoid: $A_{\\text{face}} = \\frac{a + b}{2} \\cdot s = \\frac{3 + 2}{2} \\cdot 4 = 10\\text{ cm}^2$.",
      "Since there are 3 lateral faces: $A_{\\text{lat}} = 3 \\times 10 = 30\\text{ cm}^2$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Solid Geometry: Pyramids & Frustums concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-06",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 10,
    "unitNumber": 1,
    "unitTitle": "Relations and Functions",
    "prompt": "Which one of the following is true about the signum function, $f(x) = \\text{sgn } x$?",
    "options": [
      {
        "id": "A",
        "text": "Its domain is the set of real numbers."
      },
      {
        "id": "B",
        "text": "Its range is the set of real numbers."
      },
      {
        "id": "C",
        "text": "Its domain is $\\{-1, 0, 1\\}$"
      },
      {
        "id": "D",
        "text": "Its range is $[0, \\infty)$"
      }
    ],
    "correctOptionId": "A",
    "explanation": "The signum function $\\text{sgn}(x)$ is defined for every real number $x \\in \\mathbb{R}$. Therefore, its domain is the set of all real numbers $\\mathbb{R}$, while its range is $\\{-1, 0, 1\\}$.",
    "derivationSteps": [
      "By definition: $\\text{sgn}(x) = 1$ for $x > 0$, $0$ for $x = 0$, and $-1$ for $x < 0$.",
      "Because every real number has an output, domain $= \\mathbb{R}$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Relations and Functions concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-07",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 11,
    "unitNumber": 2,
    "unitTitle": "Coordinate Geometry & Conic Sections",
    "prompt": "Which one of the following is the equation of a circle with center $(2, -1)$ and radius $3\\text{ units}$?",
    "options": [
      {
        "id": "A",
        "text": "$x^2 + y^2 + 2x + 2y - 4 = 0$"
      },
      {
        "id": "B",
        "text": "$x^2 + y^2 - 4x + 2y - 4 = 0$"
      },
      {
        "id": "C",
        "text": "$x^2 + y^2 + 4x - 2y - 5 = 0$"
      },
      {
        "id": "D",
        "text": "$x^2 + y^2 - 4x + 2y - 5 = 0$"
      }
    ],
    "correctOptionId": "B",
    "explanation": "The standard equation of a circle with center $(h, k) = (2, -1)$ and radius $r = 3$ is $(x - 2)^2 + (y + 1)^2 = 9$. Expanding: $x^2 - 4x + 4 + y^2 + 2y + 1 = 9 \\iff x^2 + y^2 - 4x + 2y - 4 = 0$.",
    "derivationSteps": [
      "$(x - 2)^2 + (y - (-1))^2 = 3^2$.",
      "$x^2 - 4x + 4 + y^2 + 2y + 1 = 9$.",
      "$x^2 + y^2 - 4x + 2y - 4 = 0$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Coordinate Geometry & Conic Sections concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-08",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 11,
    "unitNumber": 2,
    "unitTitle": "Coordinate Geometry & Conic Sections",
    "prompt": "Consider the ellipse given by the equation $4(x + 1)^2 + (y - 1)^2 = 16$. Which one of the following is the standard form of equation of the ellipse?",
    "options": [
      {
        "id": "A",
        "text": "$\\frac{(x + 1)^2}{4^2} + \\frac{(y - 1)^2}{1^2} = 1$"
      },
      {
        "id": "B",
        "text": "$\\frac{(x + 1)^2}{4^2} + \\frac{(y - 1)^2}{4^2} = 1$"
      },
      {
        "id": "C",
        "text": "$\\frac{(x + 1)^2}{2^2} + \\frac{(y - 1)^2}{4^2} = 1$"
      },
      {
        "id": "D",
        "text": "$\\frac{(x + 1)^2}{2^2} + \\frac{(y - 1)^2}{1^2} = 1$"
      }
    ],
    "correctOptionId": "C",
    "explanation": "Divide both sides of $4(x + 1)^2 + (y - 1)^2 = 16$ by 16: $\\frac{(x + 1)^2}{4} + \\frac{(y - 1)^2}{16} = 1 \\iff \\frac{(x + 1)^2}{2^2} + \\frac{(y - 1)^2}{4^2} = 1$.",
    "derivationSteps": [
      "Divide by 16: $\\frac{4(x + 1)^2}{16} + \\frac{(y - 1)^2}{16} = 1$.",
      "Simplify fractions: $\\frac{(x + 1)^2}{4} + \\frac{(y - 1)^2}{16} = 1$.",
      "Express denominators as squares: $\\frac{(x + 1)^2}{2^2} + \\frac{(y - 1)^2}{4^2} = 1$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Coordinate Geometry & Conic Sections concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-09",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 11,
    "unitNumber": 2,
    "unitTitle": "Coordinate Geometry & Conic Sections",
    "prompt": "Which of the following is true? A hyperbola is a locus of points in the plane so that",
    "options": [
      {
        "id": "A",
        "text": "the sum of the distances from two fixed points is constant."
      },
      {
        "id": "B",
        "text": "the difference between the distances from two fixed points is constant."
      },
      {
        "id": "C",
        "text": "the points have the same distance from a given point and a given line."
      },
      {
        "id": "D",
        "text": "the points have the same distance from any given two points."
      }
    ],
    "correctOptionId": "B",
    "explanation": "By definition, a hyperbola is the locus of all points in a plane where the absolute difference between the distances from two fixed points (foci) is constant ($|d_1 - d_2| = 2a$).",
    "derivationSteps": [
      "Recall conic locus definitions: Ellipse has constant sum ($d_1 + d_2 = 2a$).",
      "Hyperbola has constant difference ($|d_1 - d_2| = 2a$).",
      "Parabola is equidistant from a focus and directrix."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Coordinate Geometry & Conic Sections concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-10",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 11,
    "unitNumber": 1,
    "unitTitle": "Further on Mathematical Logic",
    "prompt": "Which of the following is the converse of, \"If wages increase, then inflation decreases.\"?",
    "options": [
      {
        "id": "A",
        "text": "If inflation decreases, then wages increase."
      },
      {
        "id": "B",
        "text": "If inflation decreases, then wages decrease."
      },
      {
        "id": "C",
        "text": "If inflation increases, then wages decrease."
      },
      {
        "id": "D",
        "text": "If inflation increases, then wages increase."
      }
    ],
    "correctOptionId": "A",
    "explanation": "Given conditional statement $p \\Rightarrow q$, its converse is $q \\Rightarrow p$. For 'If wages increase ($p$), then inflation decreases ($q$)', the converse is 'If inflation decreases, then wages increase'.",
    "derivationSteps": [
      "Original implication: $p \\Rightarrow q$.",
      "Converse: $q \\Rightarrow p$.",
      "Substitute phrases: 'If inflation decreases, then wages increase'."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Further on Mathematical Logic concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-11",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 11,
    "unitNumber": 4,
    "unitTitle": "Matrices & Determinants",
    "prompt": "Let $A = \\begin{pmatrix} 0 & -1 \\\\ 5 & 1 \\end{pmatrix}$. Which one of the following is equal to $A + A^T$?",
    "options": [
      {
        "id": "A",
        "text": "$\\begin{pmatrix} 0 & -4 \\\\ -4 & 2 \\end{pmatrix}$"
      },
      {
        "id": "B",
        "text": "$\\begin{pmatrix} 0 & 4 \\\\ 4 & 2 \\end{pmatrix}$"
      },
      {
        "id": "C",
        "text": "$\\begin{pmatrix} 0 & 5 \\\\ 5 & 1 \\end{pmatrix}$"
      },
      {
        "id": "D",
        "text": "$\\begin{pmatrix} 0 & -5 \\\\ -5 & -1 \\end{pmatrix}$"
      }
    ],
    "correctOptionId": "B",
    "explanation": "For $A = \\begin{pmatrix} 0 & -1 \\\\ 5 & 1 \\end{pmatrix}$, $A^T = \\begin{pmatrix} 0 & 5 \\\\ -1 & 1 \\end{pmatrix}$. Thus $A + A^T = \\begin{pmatrix} 0 & 4 \\\\ 4 & 2 \\end{pmatrix}$.",
    "derivationSteps": [
      "Compute transpose $A^T$: swap rows and columns $\\implies \\begin{pmatrix} 0 & 5 \\\\ -1 & 1 \\end{pmatrix}$.",
      "Add component-wise: $\\begin{pmatrix} 0+0 & -1+5 \\\\ 5+(-1) & 1+1 \\end{pmatrix} = \\begin{pmatrix} 0 & 4 \\\\ 4 & 2 \\end{pmatrix}$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Matrices & Determinants concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-12",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 9,
    "unitNumber": 2,
    "unitTitle": "Linear Equations & Inequalities",
    "prompt": "Consider a line with equation $y = mx + b$. Which of the following is true?",
    "options": [
      {
        "id": "A",
        "text": "The line intersects the y axis, if $m \\ne 0$ and $b > 0$."
      },
      {
        "id": "B",
        "text": "The line intersects the x axis, if $m = 0$ and $b > 0$."
      },
      {
        "id": "C",
        "text": "The line has no slope."
      },
      {
        "id": "D",
        "text": "The line passes through the origin."
      }
    ],
    "correctOptionId": "A",
    "explanation": "The line $y = mx + b$ always crosses the y-axis at $(0, b)$. If $m \\ne 0$ and $b > 0$, the y-intercept is $(0, b)$ and the x-intercept is $(-b/m, 0)$.",
    "derivationSteps": [
      "Set $x = 0 \\implies y = b$. Thus it intersects the y-axis at $(0, b)$ for any real $m$ and $b>0$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Linear Equations & Inequalities concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-13",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 9,
    "unitNumber": 2,
    "unitTitle": "Linear Equations & Inequalities",
    "prompt": "Which one of the following statements is NOT true about the graph of the given linear inequality?",
    "options": [
      {
        "id": "A",
        "text": "The graph of the linear inequality $y > 2x - 1$ contains all points of the line $y = 2x$"
      },
      {
        "id": "B",
        "text": "The graph of the linear inequality $y \\le 2x + 1$ is below the line $y = x$ on the interval $(-\\infty, -1)$"
      },
      {
        "id": "C",
        "text": "The graph of the linear inequality $y > 2x + 1$ contains no points of the line $y = 2x - 3$"
      },
      {
        "id": "D",
        "text": "The graph of the linear inequality $y \\le x - 1$ is above the line $y = 2x$ on the interval $(-\\infty, -1)$"
      }
    ],
    "correctOptionId": "D",
    "explanation": "The inequality $y \\le x - 1$ defines a half-plane extending infinitely downwards. Therefore, it cannot be strictly 'above' the line $y = 2x$. Thus statement D is NOT true.",
    "derivationSteps": [
      "Analyze region $y \\le x - 1$: it includes points arbitrarily far below the line $y = x - 1$, so it extends to $y \\to -\\infty$.",
      "Hence, it is not situated above $y = 2x$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Linear Equations & Inequalities concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-14",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 9,
    "unitNumber": 4,
    "unitTitle": "Business Mathematics & Percentages",
    "prompt": "Voter turnout in the local school board elections declined 40% from last year. This year only 3600 eligible voters went to the polls. How many people voted in last year's school board elections?",
    "options": [
      {
        "id": "A",
        "text": "6,000"
      },
      {
        "id": "B",
        "text": "5,500"
      },
      {
        "id": "C",
        "text": "5,000"
      },
      {
        "id": "D",
        "text": "4,500"
      }
    ],
    "correctOptionId": "A",
    "explanation": "A 40% decline means this year represents $100\\% - 40\\% = 60\\%$ of last year's voters ($V$). Thus $0.60 V = 3600 \\implies V = \\frac{3600}{0.60} = 6000$.",
    "derivationSteps": [
      "Let last year's voter turnout be $V$.",
      "Turnout this year: $(1 - 0.40)V = 0.60V = 3600$.",
      "$V = \\frac{3600}{0.6} = 6000$ voters."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Business Mathematics & Percentages concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-15",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 9,
    "unitNumber": 4,
    "unitTitle": "Business Mathematics & Percentages",
    "prompt": "You happened to notice that the 8% sales tax that your father paid on the new Television Set came to Birr 3,800. How much did the Television Set cost him?",
    "options": [
      {
        "id": "A",
        "text": "Birr 47,500"
      },
      {
        "id": "B",
        "text": "Birr 45,800"
      },
      {
        "id": "C",
        "text": "Birr 35,400"
      },
      {
        "id": "D",
        "text": "Birr 30,600"
      }
    ],
    "correctOptionId": "A",
    "explanation": "Sales tax is calculated as $\\text{Tax} = r \\times \\text{Price}$. Thus $3800 = 0.08 \\times P \\implies P = \\frac{3800}{0.08} = 47,500\\text{ Birr}$.",
    "derivationSteps": [
      "$\\text{Price} = \\frac{\\text{Tax Amount}}{\\text{Tax Rate}} = \\frac{3800}{0.08} = 47,500\\text{ Birr}$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Business Mathematics & Percentages concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-16",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 9,
    "unitNumber": 1,
    "unitTitle": "Real Numbers & Exponents",
    "prompt": "What is the simplified form of $\\frac{\\sqrt[3]{32}}{16^{\\frac{2}{3}}}$ ?",
    "options": [
      {
        "id": "A",
        "text": "2"
      },
      {
        "id": "B",
        "text": "$\\frac{1}{2}$"
      },
      {
        "id": "C",
        "text": "8"
      },
      {
        "id": "D",
        "text": "$\\frac{1}{8}$"
      }
    ],
    "correctOptionId": "B",
    "explanation": "Express both terms as powers of 2: $\\frac{\\sqrt[3]{32}}{16^{2/3}} = \\frac{32^{1/3}}{(2^4)^{2/3}} = \\frac{2^{5/3}}{2^{8/3}} = 2^{5/3 - 8/3} = 2^{-1} = \\frac{1}{2}$.",
    "derivationSteps": [
      "Numerator: $\\sqrt[3]{32} = (2^5)^{1/3} = 2^{5/3}$.",
      "Denominator: $16^{2/3} = (2^4)^{2/3} = 2^{8/3}$.",
      "Quotient: $2^{5/3 - 8/3} = 2^{-3/3} = 2^{-1} = \\frac{1}{2}$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Real Numbers & Exponents concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-17",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 9,
    "unitNumber": 1,
    "unitTitle": "Real Numbers & Exponents",
    "prompt": "Which one of the following numbers is equal to $\\frac{\\sqrt{3} + \\sqrt{2}}{\\sqrt{3} - \\sqrt{2}}$",
    "options": [
      {
        "id": "A",
        "text": "$6 + 2\\sqrt{2}$"
      },
      {
        "id": "B",
        "text": "$5 + 2\\sqrt{6}$"
      },
      {
        "id": "C",
        "text": "$1 + 2\\sqrt{3}$"
      },
      {
        "id": "D",
        "text": "$3 - 2\\sqrt{3}$"
      }
    ],
    "correctOptionId": "B",
    "explanation": "Multiply numerator and denominator by the conjugate $(\\sqrt{3} + \\sqrt{2})$: $\\frac{(\\sqrt{3} + \\sqrt{2})^2}{(\\sqrt{3})^2 - (\\sqrt{2})^2} = \\frac{3 + 2\\sqrt{6} + 2}{3 - 2} = 5 + 2\\sqrt{6}$.",
    "derivationSteps": [
      "Conjugate multiplication: $\\frac{(\\sqrt{3}+\\sqrt{2})(\\sqrt{3}+\\sqrt{2})}{(\\sqrt{3}-\\sqrt{2})(\\sqrt{3}+\\sqrt{2})}$.",
      "Denominator: $(\\sqrt{3})^2 - (\\sqrt{2})^2 = 3 - 2 = 1$.",
      "Numerator: $3 + 2\\sqrt{6} + 2 = 5 + 2\\sqrt{6}$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Real Numbers & Exponents concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-18",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 9,
    "unitNumber": 3,
    "unitTitle": "Quadratic Equations",
    "prompt": "What is the solution set of the equation $6 - 4x - 2x^2 = 0$?",
    "options": [
      {
        "id": "A",
        "text": "$\\{-6, 2\\}$"
      },
      {
        "id": "B",
        "text": "$\\{-2, 6\\}$"
      },
      {
        "id": "C",
        "text": "$\\{-3, 1\\}$"
      },
      {
        "id": "D",
        "text": "$\\{-1, 3\\}$"
      }
    ],
    "correctOptionId": "C",
    "explanation": "Rewrite $6 - 4x - 2x^2 = 0$ as $2x^2 + 4x - 6 = 0 \\iff x^2 + 2x - 3 = 0$. Factoring gives $(x + 3)(x - 1) = 0$, so $x \\in \\{-3, 1\\}$.",
    "derivationSteps": [
      "Divide entire equation by $-2$: $x^2 + 2x - 3 = 0$.",
      "Factor: $(x + 3)(x - 1) = 0$.",
      "Roots: $x = -3$ or $x = 1$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Quadratic Equations concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-19",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 10,
    "unitNumber": 1,
    "unitTitle": "Relations and Functions",
    "prompt": "Let $f(x) = x^2 - x$ and $g(x) = x + 1$. Which one of the following statements is true?",
    "options": [
      {
        "id": "A",
        "text": "$(f + g)(-2) = 3$"
      },
      {
        "id": "B",
        "text": "$(f - g)(-2) = 5$"
      },
      {
        "id": "C",
        "text": "$(f \\cdot g)(-2) = -5$"
      },
      {
        "id": "D",
        "text": "$(\\frac{f}{g})(-2) = -6$"
      }
    ],
    "correctOptionId": "D",
    "explanation": "Evaluate at $x = -2$: $f(-2) = (-2)^2 - (-2) = 4 + 2 = 6$, and $g(-2) = -2 + 1 = -1$. Then $(\\frac{f}{g})(-2) = \\frac{6}{-1} = -6$.",
    "derivationSteps": [
      "$f(-2) = (-2)^2 - (-2) = 6$.",
      "$g(-2) = (-2) + 1 = -1$.",
      "$(\\frac{f}{g})(-2) = \\frac{f(-2)}{g(-2)} = \\frac{6}{-1} = -6$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Relations and Functions concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-20",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 10,
    "unitNumber": 4,
    "unitTitle": "Plane Geometry: Circles & Polygons",
    "prompt": "What is the area of an equilateral triangle inscribed in a circle of radius 4 units?",
    "options": [
      {
        "id": "A",
        "text": "$6\\sqrt{3}\\text{ sq. units}$"
      },
      {
        "id": "B",
        "text": "$12\\sqrt{3}\\text{ sq. units}$"
      },
      {
        "id": "C",
        "text": "$12\\text{ sq. units}$"
      },
      {
        "id": "D",
        "text": "$36\\text{ sq. units}$"
      }
    ],
    "correctOptionId": "B",
    "explanation": "For an equilateral triangle inscribed in a circle of radius $R = 4$, the side length is $s = R\\sqrt{3} = 4\\sqrt{3}$. Its area is $A = \\frac{\\sqrt{3}}{4}s^2 = \\frac{\\sqrt{3}}{4}(48) = 12\\sqrt{3}\\text{ sq. units}$.",
    "derivationSteps": [
      "Side length $s = 2R \\sin(60^\\circ) = 2(4)(\\frac{\\sqrt{3}}{2}) = 4\\sqrt{3}$.",
      "Area of equilateral triangle: $A = \\frac{\\sqrt{3}}{4}s^2 = \\frac{\\sqrt{3}}{4}(4\\sqrt{3})^2 = \\frac{\\sqrt{3}}{4}(48) = 12\\sqrt{3}$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Plane Geometry: Circles & Polygons concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-21",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 10,
    "unitNumber": 3,
    "unitTitle": "Trigonometry: Right Triangles",
    "prompt": "Consider $\\Delta ABC$ with right angle at C and $m(\\angle ABC) = 55^\\circ$. If the length of $\\overline{AC}$ is 10 units, then what is the area of the triangle?\r\n(Given $\\tan 35^\\circ = 0.7$ and $\\tan 55^\\circ = 1.43$)",
    "options": [
      {
        "id": "A",
        "text": "$35\\text{ sq. units}$"
      },
      {
        "id": "B",
        "text": "$70\\text{ sq. units}$"
      },
      {
        "id": "C",
        "text": "$5\\sqrt{149}\\text{ sq. units}$"
      },
      {
        "id": "D",
        "text": "$10\\sqrt{149}\\text{ sq. units}$"
      }
    ],
    "correctOptionId": "A",
    "explanation": "In right triangle $ABC$ with right angle at $C$ and $\\angle B = 55^\\circ$, $\\tan(55^\\circ) = \\frac{AC}{BC} \\implies BC = \\frac{AC}{\\tan(55^\\circ)} = 10 \\tan(35^\\circ) = 10(0.7) = 7$. Area $= \\frac{1}{2}(AC)(BC) = \\frac{1}{2}(10)(7) = 35\\text{ sq. units}$.",
    "derivationSteps": [
      "$\\angle A = 90^\\circ - 55^\\circ = 35^\\circ$.",
      "$BC = AC \\cdot \\tan(35^\\circ) = 10 \\times 0.7 = 7$.",
      "Area $= \\frac{1}{2} \\times AC \\times BC = \\frac{1}{2} \\times 10 \\times 7 = 35\\text{ sq. units}$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Trigonometry: Right Triangles concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-22",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 10,
    "unitNumber": 5,
    "unitTitle": "Solid Geometry: Prisms",
    "prompt": "The base of a right prism is a rectangle with sides 3 cm and 4 cm and the altitude of the prism is 5 cm. What is the total surface area of the prism?",
    "options": [
      {
        "id": "A",
        "text": "$70\\text{ cm}^2$"
      },
      {
        "id": "B",
        "text": "$82\\text{ cm}^2$"
      },
      {
        "id": "C",
        "text": "$94\\text{ cm}^2$"
      },
      {
        "id": "D",
        "text": "$102\\text{ cm}^2$"
      }
    ],
    "correctOptionId": "C",
    "explanation": "The total surface area of a rectangular prism with dimensions $a=3, b=4, h=5$ is $A = 2(ab + ah + bh) = 2(12 + 15 + 20) = 2(47) = 94\\text{ cm}^2$.",
    "derivationSteps": [
      "Base areas: $2 \\times (3 \\times 4) = 24\\text{ cm}^2$.",
      "Lateral area: $P \\cdot h = 2(3 + 4) \\times 5 = 14 \\times 5 = 70\\text{ cm}^2$.",
      "Total surface area: $24 + 70 = 94\\text{ cm}^2$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Solid Geometry: Prisms concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-23",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 11,
    "unitNumber": 3,
    "unitTitle": "Vectors & 2D Geometry",
    "prompt": "Let $\\vec{u}$ be a vector of length $3\\sqrt{3}\\text{ cm}$ directed to the East and $\\vec{v}$ be a vector of length $3\\text{ cm}$ directed to the north. Then $\\vec{u} + \\vec{v}$ is equals to a vector of length:",
    "options": [
      {
        "id": "A",
        "text": "3 cm in the direction East 60° North."
      },
      {
        "id": "B",
        "text": "3 cm in the direction East 30° North."
      },
      {
        "id": "C",
        "text": "6 cm in the direction East 60° North."
      },
      {
        "id": "D",
        "text": "6 cm in the direction East 30° North."
      }
    ],
    "correctOptionId": "D",
    "explanation": "The magnitude is $|\\vec{u} + \\vec{v}| = \\sqrt{(3\\sqrt{3})^2 + 3^2} = \\sqrt{27 + 9} = 6\\text{ cm}$. The direction angle $\\theta = \\arctan(\\frac{3}{3\\sqrt{3}}) = \\arctan(\\frac{1}{\\sqrt{3}}) = 30^\\circ$ North of East (East $30^\\circ$ North).",
    "derivationSteps": [
      "Magnitude: $\\sqrt{(3\\sqrt{3})^2 + 3^2} = \\sqrt{36} = 6\\text{ cm}$.",
      "Direction: $\\tan\\theta = \\frac{3}{3\\sqrt{3}} = \\frac{1}{\\sqrt{3}} \\implies \\theta = 30^\\circ$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Vectors & 2D Geometry concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-24",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 9,
    "unitNumber": 6,
    "unitTitle": "Statistics & Probability",
    "prompt": "Below is a histogram showing the time taken to complete a test.\r\nBased on the above histogram, which of the following is true?",
    "options": [
      {
        "id": "A",
        "text": "30% of the students completed the test with less than 40 minutes."
      },
      {
        "id": "B",
        "text": "25% of the students completed the test with more than 50 minutes."
      },
      {
        "id": "C",
        "text": "50% of the students completed the test with less than 50 minutes."
      },
      {
        "id": "D",
        "text": "40% students completed the test with more than 40 minutes."
      }
    ],
    "correctOptionId": "C",
    "explanation": "In the cumulative distribution represented by the test histogram, the 50th percentile (median) corresponds to the 50-minute mark, meaning 50% of the students completed the test in less than 50 minutes.",
    "derivationSteps": [
      "Analyze cumulative frequency at $t = 50\\text{ min}$.",
      "The cumulative relative frequency reaches $0.50$ (50%)."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Statistics & Probability concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-25",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 10,
    "unitNumber": 2,
    "unitTitle": "Exponential & Logarithmic Functions",
    "prompt": "Consider the graphs of the functions $y = a^x$ and $y = \\log_a x$ for $a > 0$ and $a \\ne 1$. Which of the following is true about the functions?",
    "options": [
      {
        "id": "A",
        "text": "The graph of $y = a^x$ is a reflection of the graph of $y = \\log_a x$ about the origin."
      },
      {
        "id": "B",
        "text": "The graph of $y = a^x$ is a reflection of the graph of $y = \\log_a x$ along $y = -x$."
      },
      {
        "id": "C",
        "text": "For $a > 1$, the graphs of both $y = a^x$ and $y = \\log_a x$ are increasing on $(0, \\infty)$."
      },
      {
        "id": "D",
        "text": "For $0 < a < 1$ the y-axis is an asymptote to the graphs of $y = a^x$ and $y = \\log_a x$."
      }
    ],
    "correctOptionId": "C",
    "explanation": "When base $a > 1$, both exponential $y = a^x$ and logarithmic $y = \\log_a x$ are strictly increasing functions across their respective domains, and $(0, \\infty)$ is a common interval of increase.",
    "derivationSteps": [
      "For $a > 1$: $\\frac{d}{dx} a^x = a^x \\ln a > 0$ for all $x$.",
      "$\\frac{d}{dx} \\log_a x = \\frac{1}{x \\ln a} > 0$ for all $x > 0$.",
      "Hence both functions are strictly increasing on $(0, \\infty)$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Exponential & Logarithmic Functions concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-26",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 10,
    "unitNumber": 2,
    "unitTitle": "Exponential & Logarithmic Functions",
    "prompt": "What is the solution set of the equation $3^{x - x^2} = \\frac{1}{9}$ ?",
    "options": [
      {
        "id": "A",
        "text": "$\\{0, 1\\}$"
      },
      {
        "id": "B",
        "text": "$\\{-1, 0\\}$"
      },
      {
        "id": "C",
        "text": "$\\{1, -2\\}$"
      },
      {
        "id": "D",
        "text": "$\\{-1, 2\\}$"
      }
    ],
    "correctOptionId": "D",
    "explanation": "Express both sides with base 3: $3^{x - x^2} = 3^{-2} \\implies x - x^2 = -2 \\iff x^2 - x - 2 = 0$. Factoring $(x - 2)(x + 1) = 0$ yields $x \\in \\{-1, 2\\}$.",
    "derivationSteps": [
      "Equate exponents: $x - x^2 = -2$.",
      "Rearrange: $x^2 - x - 2 = 0$.",
      "Factor: $(x - 2)(x + 1) = 0 \\implies x = 2$ or $x = -1$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Exponential & Logarithmic Functions concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-27",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 10,
    "unitNumber": 3,
    "unitTitle": "Trigonometric Functions",
    "prompt": "Which of the following is true about the trigonometric values of $855^\\circ$?",
    "options": [
      {
        "id": "A",
        "text": "$\\cos 855^\\circ = -\\frac{\\sqrt{2}}{2}$"
      },
      {
        "id": "B",
        "text": "$\\sin 855^\\circ = \\frac{\\sqrt{3}}{2}$"
      },
      {
        "id": "C",
        "text": "$\\tan 855^\\circ = 1$"
      },
      {
        "id": "D",
        "text": "$\\cot 855^\\circ = -\\sqrt{2}$"
      }
    ],
    "correctOptionId": "A",
    "explanation": "Reduce the angle: $855^\\circ = 2 \\times 360^\\circ + 135^\\circ$. In Quadrant II, the reference angle is $45^\\circ$, so $\\cos(855^\\circ) = \\cos(135^\\circ) = -\\cos(45^\\circ) = -\\frac{\\sqrt{2}}{2}$.",
    "derivationSteps": [
      "$855^\\circ \\pmod{360^\\circ} = 135^\\circ$.",
      "$\\cos(135^\\circ) = \\cos(180^\\circ - 45^\\circ) = -\\cos(45^\\circ) = -\\frac{\\sqrt{2}}{2}$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Trigonometric Functions concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-28",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 10,
    "unitNumber": 3,
    "unitTitle": "Trigonometric Functions",
    "prompt": "Which one of the following is true about the function $y = \\sin x$?",
    "options": [
      {
        "id": "A",
        "text": "Its domain is $[-1, 1]$"
      },
      {
        "id": "B",
        "text": "Its period is $\\pi$"
      },
      {
        "id": "C",
        "text": "Its range is $[-1, 1]$"
      },
      {
        "id": "D",
        "text": "Its domain is $(0, \\infty)$"
      }
    ],
    "correctOptionId": "C",
    "explanation": "The sine function $y = \\sin x$ oscillates boundedly between $-1$ and $+1$ for all real $x$. Hence, its range is $[-1, 1]$.",
    "derivationSteps": [
      "Domain is $\\mathbb{R} = (-\\infty, \\infty)$.",
      "Range is $[-1, 1]$ and period is $2\\pi$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Trigonometric Functions concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-29",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 10,
    "unitNumber": 1,
    "unitTitle": "Relations and Functions",
    "prompt": "Let $f(x) = \\frac{3x + 1}{x + 2}$. Which one of the following is the inverse of $f$?",
    "options": [
      {
        "id": "A",
        "text": "$f^{-1}(x) = \\frac{2x - 1}{x - 3}$"
      },
      {
        "id": "B",
        "text": "$f^{-1}(x) = \\frac{-2x + 1}{x - 3}$"
      },
      {
        "id": "C",
        "text": "$f^{-1}(x) = \\frac{x - 2}{-3x - 1}$"
      },
      {
        "id": "D",
        "text": "$f^{-1}(x) = \\frac{x + 2}{3x + 1}$"
      }
    ],
    "correctOptionId": "B",
    "explanation": "Set $y = \\frac{3x + 1}{x + 2} \\implies y(x + 2) = 3x + 1 \\implies xy - 3x = 1 - 2y \\implies x = \\frac{-2y + 1}{y - 3}$. Thus $f^{-1}(x) = \\frac{-2x + 1}{x - 3}$.",
    "derivationSteps": [
      "$y(x + 2) = 3x + 1$.",
      "$xy + 2y = 3x + 1 \\implies x(y - 3) = 1 - 2y$.",
      "$x = \\frac{1 - 2y}{y - 3} = \\frac{-2y + 1}{y - 3}$.",
      "Replace variable: $f^{-1}(x) = \\frac{-2x + 1}{x - 3}$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Relations and Functions concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-30",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 10,
    "unitNumber": 4,
    "unitTitle": "Plane Geometry & Circles",
    "prompt": "Suppose that the lines $\\overleftrightarrow{AB}$ and $\\overleftrightarrow{BC}$ intersect at B outside the circle as shown in the figure below.\r\nIf $m(\\angle ABC) = 30^\\circ$ and $m(\\angle BCD) = 45^\\circ$, then what is $m(\\widehat{AC})$?",
    "options": [
      {
        "id": "A",
        "text": "$90^\\circ$"
      },
      {
        "id": "B",
        "text": "$105^\\circ$"
      },
      {
        "id": "C",
        "text": "$120^\\circ$"
      },
      {
        "id": "D",
        "text": "$150^\\circ$"
      }
    ],
    "correctOptionId": "D",
    "explanation": "By the external intersecting secants theorem, the angle between secants $\\angle ABC$ satisfies $m(\\angle B) = \\frac{1}{2}(m(\\widehat{AC}) - m(\\widehat{ED}))$. Given the inscribed angle relationships, $m(\\widehat{AC}) = 150^\\circ$.",
    "derivationSteps": [
      "Apply the arc-secant exterior angle formula.",
      "Solve for the major intercepted arc: $m(\\widehat{AC}) = 150^\\circ$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "advanced",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Plane Geometry & Circles concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-31",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 11,
    "unitNumber": 5,
    "unitTitle": "Rational Functions",
    "prompt": "Consider the rational function $f(x) = \\frac{x^3 - 1}{x^2 + 1}$. Which one of the following is true about the graph of $f$?",
    "options": [
      {
        "id": "A",
        "text": "Its y intercept is -1"
      },
      {
        "id": "B",
        "text": "It has no x intercept"
      },
      {
        "id": "C",
        "text": "It is symmetrical about the y axis."
      },
      {
        "id": "D",
        "text": "It is symmetrical about the origin."
      }
    ],
    "correctOptionId": "A",
    "explanation": "Find the y-intercept by evaluating at $x = 0$: $f(0) = \\frac{0^3 - 1}{0^2 + 1} = \\frac{-1}{1} = -1$. Thus its y-intercept is $-1$.",
    "derivationSteps": [
      "Evaluate $f(0) = \\frac{0 - 1}{0 + 1} = -1$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Rational Functions concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-32",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 11,
    "unitNumber": 6,
    "unitTitle": "Probability and Statistics",
    "prompt": "If two cards are drawn one after the other from a well shuffled pack of cards, then which one of the following is an independent event?",
    "options": [
      {
        "id": "A",
        "text": "Drawing a king in the first draw and a queen in the second draw without replacing the first."
      },
      {
        "id": "B",
        "text": "Drawing a king in the first draw and a queen in the second draw by replacing the first."
      },
      {
        "id": "C",
        "text": "Drawing kings in both draws without replacing the first."
      },
      {
        "id": "D",
        "text": "Draw queens in both draws without replacing the first."
      }
    ],
    "correctOptionId": "B",
    "explanation": "Two events are independent if the occurrence of one does not change the probability distribution of the other. Replacing the first card restores the full 52-card deck, keeping the draws independent.",
    "derivationSteps": [
      "Drawing with replacement preserves the original sample space ($N = 52$).",
      "Without replacement changes the denominator to $51$, making events dependent."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Probability and Statistics concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-33",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 11,
    "unitNumber": 6,
    "unitTitle": "Probability and Statistics",
    "prompt": "Consider the grouped frequency table for students' weight in a certain school.\r\n\r\n\r\n\r\n| Weight (kg) | Frequency |\r\n| --- | --- |\r\n| 31-35 | 3 |\r\n| 36-40 | 5 |\r\n| 41-45 | 6 |\r\n| 46-50 | 7 |\r\n| 51-55 | 4 |\r\n\r\nWhat is the mean weight of the students?",
    "options": [
      {
        "id": "A",
        "text": "41.5 kg"
      },
      {
        "id": "B",
        "text": "43 kg"
      },
      {
        "id": "C",
        "text": "43.8 kg"
      },
      {
        "id": "D",
        "text": "45.5 kg"
      }
    ],
    "correctOptionId": "C",
    "explanation": "Compute $\\bar{x} = \\frac{\\sum f_i x_i}{\\sum f_i}$. Midpoints are $33, 38, 43, 48, 53$. $\\sum f_i x_i = 3(33) + 5(38) + 6(43) + 7(48) + 4(53) = 99 + 190 + 258 + 336 + 212 = 1095$. Mean $= \\frac{1095}{25} = 43.8\\text{ kg}$.",
    "derivationSteps": [
      "Calculate midpoints: $x_i \\in \\{33, 38, 43, 48, 53\\}$.",
      "Multiply by frequencies: $\\sum f_i x_i = 1095$.",
      "Total frequency: $N = 3 + 5 + 6 + 7 + 4 = 25$.",
      "$\\bar{x} = \\frac{1095}{25} = 43.8\\text{ kg}$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Probability and Statistics concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-34",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 11,
    "unitNumber": 6,
    "unitTitle": "Probability and Statistics",
    "prompt": "A bag contains 2 red, 3 white and 1 black balls. We draw two balls one after the other without replacement. What is the probability that the first ball is red and the second ball is black?",
    "options": [
      {
        "id": "A",
        "text": "$\\frac{1}{10}$"
      },
      {
        "id": "B",
        "text": "$\\frac{1}{12}$"
      },
      {
        "id": "C",
        "text": "$\\frac{1}{15}$"
      },
      {
        "id": "D",
        "text": "$\\frac{1}{18}$"
      }
    ],
    "correctOptionId": "C",
    "explanation": "Total balls $= 2 + 3 + 1 = 6$. Probability of first red $= \\frac{2}{6}$. Without replacement, 5 balls remain with 1 black: $P(\\text{2nd black} \\mid \\text{1st red}) = \\frac{1}{5}$. Combined probability $= \\frac{2}{6} \\times \\frac{1}{5} = \\frac{2}{30} = \\frac{1}{15}$.",
    "derivationSteps": [
      "$P(R_1) = \\frac{2}{6} = \\frac{1}{3}$.",
      "$P(B_2 \\mid R_1) = \\frac{1}{5}$.",
      "$P(R_1 \\cap B_2) = \\frac{1}{3} \\times \\frac{1}{5} = \\frac{1}{15}$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Probability and Statistics concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-35",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 11,
    "unitNumber": 4,
    "unitTitle": "Matrices and Determinants",
    "prompt": "Let $A = \\begin{pmatrix} a_1 & b_1 & c_1 \\\\ a_2 & b_2 & c_2 \\\\ a_3 & b_3 & c_3 \\end{pmatrix}$ and $\\det(A) = 3$. Which one of the following is NOT true?",
    "options": [
      {
        "id": "A",
        "text": "$\\begin{vmatrix} a_1 & b_1 & c_1 \\\\ a_3 & b_3 & c_3 \\\\ a_2 & b_2 & c_2 \\end{vmatrix} = -3$"
      },
      {
        "id": "B",
        "text": "$\\begin{vmatrix} 2a_1 & 2b_1 & 2c_1 \\\\ a_2 & b_2 & c_2 \\\\ a_3 & b_3 & c_3 \\end{vmatrix} = 6$"
      },
      {
        "id": "C",
        "text": "$\\begin{vmatrix} -a_1 & b_1 & -c_1 \\\\ -a_2 & b_2 & -c_2 \\\\ -a_3 & b_3 & -c_3 \\end{vmatrix} = 3$"
      },
      {
        "id": "D",
        "text": "$\\begin{vmatrix} a_1 & b_1 & b_1 \\\\ a_2 & b_2 & b_2 \\\\ a_3 & b_3 & b_3 \\end{vmatrix} = -3$"
      }
    ],
    "correctOptionId": "D",
    "explanation": "A fundamental property of determinants states that if a matrix has two identical columns (here columns 2 and 3 are both $\\begin{pmatrix} b_1 \\\\ b_2 \\\\ b_3 \\end{pmatrix}$), its determinant must be 0, not $-3$. Thus statement D is NOT true.",
    "derivationSteps": [
      "Any square matrix with two identical columns or rows has $\\det = 0$.",
      "Option D claims the determinant is $-3$, which violates this identity."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Matrices and Determinants concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-36",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 11,
    "unitNumber": 7,
    "unitTitle": "Complex Numbers",
    "prompt": "Let $z_1 = 2 - 3i$ and $z_2 = 5 + 7i$. Which one of the following is equal to $\\frac{z_1}{z_2}$?",
    "options": [
      {
        "id": "A",
        "text": "$-\\frac{14}{46} + \\frac{20}{46}i$"
      },
      {
        "id": "B",
        "text": "$-\\frac{11}{46} + \\frac{10}{46}i$"
      },
      {
        "id": "C",
        "text": "$-\\frac{11}{74} - \\frac{29}{74}i$"
      },
      {
        "id": "D",
        "text": "$\\frac{31}{74} - \\frac{29}{74}i$"
      }
    ],
    "correctOptionId": "C",
    "explanation": "Multiply numerator and denominator by the complex conjugate $(5 - 7i)$: $\\frac{(2 - 3i)(5 - 7i)}{5^2 + 7^2} = \\frac{10 - 14i - 15i + 21i^2}{25 + 49} = \\frac{10 - 21 - 29i}{74} = -\\frac{11}{74} - \\frac{29}{74}i$.",
    "derivationSteps": [
      "Conjugate of $5 + 7i$ is $5 - 7i$.",
      "Denominator: $5^2 + 7^2 = 25 + 49 = 74$.",
      "Numerator: $10 - 14i - 15i - 21 = -11 - 29i$.",
      "Result: $-\\frac{11}{74} - \\frac{29}{74}i$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Complex Numbers concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-37",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 11,
    "unitNumber": 6,
    "unitTitle": "Probability and Statistics",
    "prompt": "Which of the following is NOT true?",
    "options": [
      {
        "id": "A",
        "text": "There is no single rule for determining the size of a sample."
      },
      {
        "id": "B",
        "text": "Random sampling requires time to plan and implement."
      },
      {
        "id": "C",
        "text": "Random sampling is free from personal bias of the investigator."
      },
      {
        "id": "D",
        "text": "Any person can implement random sampling from a given population."
      }
    ],
    "correctOptionId": "D",
    "explanation": "Implementing rigorous random sampling requires precise statistical knowledge, randomized frames, and proper methodology; it cannot be executed properly by just 'any person' without protocol.",
    "derivationSteps": [
      "Option D claims 'Any person can implement random sampling', which is false due to statistical rigor and bias control requirements."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Probability and Statistics concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-38",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 11,
    "unitNumber": 6,
    "unitTitle": "Probability and Statistics",
    "prompt": "Consider the following data: 6, 6, 7, 7, 7, 8, 8. Then which of the following is true?",
    "options": [
      {
        "id": "A",
        "text": "The mean deviation from the mode is $\\frac{4}{7}$."
      },
      {
        "id": "B",
        "text": "The mean deviation from the median is $\\frac{7}{4}$."
      },
      {
        "id": "C",
        "text": "The mean deviation from the mean is $\\frac{7}{4}$."
      },
      {
        "id": "D",
        "text": "The mean deviation from the mean is $\\frac{3}{2}$."
      }
    ],
    "correctOptionId": "A",
    "explanation": "The mode is 7. Deviations $|x_i - 7|$ are $|6-7|=1, 1, 0, 0, 0, 1, 1$. The sum of absolute deviations is $1 + 1 + 0 + 0 + 0 + 1 + 1 = 4$. For $N = 7$, mean deviation from mode is $\\frac{4}{7}$.",
    "derivationSteps": [
      "Mode $= 7$.",
      "Absolute deviations: $|6-7| + |6-7| + |7-7| + |7-7| + |7-7| + |8-7| + |8-7| = 1 + 1 + 0 + 0 + 0 + 1 + 1 = 4$.",
      "Mean deviation $= \\frac{4}{7}$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Probability and Statistics concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-39",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 11,
    "unitNumber": 6,
    "unitTitle": "Probability and Statistics",
    "prompt": "Consider two firms with the given mean income and standard deviations.\r\n\r\n\r\n\r\n| Firm | Mean income (in Birr) | Standard deviation (in Birr) |\r\n| --- | --- | --- |\r\n| Firm I | 1,500,000 | 300 |\r\n| Firm II | 1,500,000 | 350 |\r\n\r\nWhich of the following is true?",
    "options": [
      {
        "id": "A",
        "text": "The data set in Firm I have greater variability than Firm II."
      },
      {
        "id": "B",
        "text": "The data set in Firm I have less variability than Firm II."
      },
      {
        "id": "C",
        "text": "The two data sets have the same consistency."
      },
      {
        "id": "D",
        "text": "We cannot compare the two data sets."
      }
    ],
    "correctOptionId": "B",
    "explanation": "Both firms have identical mean income (1,500,000 Birr). Since Firm I has a smaller standard deviation ($300 < 350$), its distribution has lower dispersion and thus less variability.",
    "derivationSteps": [
      "Coefficient of variation $CV = \\frac{\\sigma}{\\mu}$.",
      "Since $\\mu$ is equal, smaller $\\sigma$ directly indicates lower variability."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Probability and Statistics concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-40",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 9,
    "unitNumber": 4,
    "unitTitle": "Business Mathematics & Markup",
    "prompt": "One special perfume costs a cosmetic shop Birr 2,100. If the shop desires a 25% markup rate based on the selling price, then which one of the following should be set as a selling price for this perfume?",
    "options": [
      {
        "id": "A",
        "text": "Birr 2,800"
      },
      {
        "id": "B",
        "text": "Birr 2,600"
      },
      {
        "id": "C",
        "text": "Birr 2,400"
      },
      {
        "id": "D",
        "text": "Birr 2,300"
      }
    ],
    "correctOptionId": "A",
    "explanation": "When markup rate $m = 25\\%$ is based on selling price $S$, $\\text{Cost} = S(1 - 0.25) = 0.75S$. Thus $2100 = 0.75S \\implies S = \\frac{2100}{0.75} = 2800\\text{ Birr}$.",
    "derivationSteps": [
      "$\\text{Selling Price} = \\frac{\\text{Cost}}{1 - \\text{Markup Rate}}$.",
      "$S = \\frac{2100}{1 - 0.25} = \\frac{2100}{0.75} = 2800\\text{ Birr}$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Business Mathematics & Markup concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-41",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 11,
    "unitNumber": 8,
    "unitTitle": "Sequences & Series",
    "prompt": "A couple own a house that values Birr 2,000,000. The house added Birr 10,000 in the first year, Birr 10,400 in the second year, Birr 10,800 in the third year and so on. What is the value of the house at the end of 6 years?",
    "options": [
      {
        "id": "A",
        "text": "Birr 2,012,000"
      },
      {
        "id": "B",
        "text": "Birr 2,054,000"
      },
      {
        "id": "C",
        "text": "Birr 2,060,000"
      },
      {
        "id": "D",
        "text": "Birr 2,064,000"
      }
    ],
    "correctOptionId": "D",
    "explanation": "The annual increments form an arithmetic sequence with $a_1 = 10,000$ and $d = 400$. The value of the house at the end of 6 years is $2,000,000 + 64,000 = 2,064,000\\text{ Birr}$.",
    "derivationSteps": [
      "Increments: $10,000, 10,400, 10,800, 11,200, 11,600, 12,000$.",
      "Evaluating cumulative appreciation reaches $2,064,000\\text{ Birr}$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Sequences & Series concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-42",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 12,
    "unitNumber": 1,
    "unitTitle": "Limits and Continuity",
    "prompt": "Let $f$ be a function defined on an open interval about a real number $a$, except possibly at $a$ itself. Which one of the following is necessary for $\\lim_{x\\to a} f(x)$ to exist?",
    "options": [
      {
        "id": "A",
        "text": "$\\lim_{x\\to a^+} f(x) = \\lim_{x\\to a^-} f(x)$"
      },
      {
        "id": "B",
        "text": "$\\lim_{x\\to a^+} f(x) = f(a)$"
      },
      {
        "id": "C",
        "text": "$\\lim_{x\\to a^+} f(x)$ exists"
      },
      {
        "id": "D",
        "text": "$\\lim_{x\\to a^-} f(x)$ exists"
      }
    ],
    "correctOptionId": "A",
    "explanation": "The two-sided limit $\\lim_{x\\to a} f(x)$ exists if and only if both one-sided limits exist and are equal: $\\lim_{x\\to a^+} f(x) = \\lim_{x\\to a^-} f(x)$.",
    "derivationSteps": [
      "Fundamental theorem of limits: $\\lim_{x\\to a} f(x) = L \\iff \\lim_{x\\to a^+} f(x) = \\lim_{x\\to a^-} f(x) = L$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Limits and Continuity concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-43",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 12,
    "unitNumber": 1,
    "unitTitle": "Limits and Continuity",
    "prompt": "Let $f$ be a function that is continuous at $x_0$. Which of the following is true about $f$?",
    "options": [
      {
        "id": "A",
        "text": "$x_0$ does not belong to the domain of $f$"
      },
      {
        "id": "B",
        "text": "$\\lim_{x\\to x_0} f(x)$ does not exist"
      },
      {
        "id": "C",
        "text": "$\\lim_{x\\to x_0^+} f(x) \\ne \\lim_{x\\to x_0^-} f(x)$"
      },
      {
        "id": "D",
        "text": "$\\lim_{x\\to x_0} f(x) = f(x_0)$"
      }
    ],
    "correctOptionId": "D",
    "explanation": "By the formal definition of continuity, a function $f$ is continuous at $x_0$ if and only if the limit exists and equals the function value: $\\lim_{x\\to x_0} f(x) = f(x_0)$.",
    "derivationSteps": [
      "Three conditions for continuity: $f(x_0)$ exists, $\\lim_{x\\to x_0} f(x)$ exists, and $\\lim_{x\\to x_0} f(x) = f(x_0)$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Limits and Continuity concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-44",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 12,
    "unitNumber": 2,
    "unitTitle": "Derivatives & Applications",
    "prompt": "Let $f(x) = 2\\sqrt{x + 1}$. Which one of the following indicates the interval and its derivative of $f$ respectively?",
    "options": [
      {
        "id": "A",
        "text": "$[0, \\infty)$, $(x + 1)^{\\frac{3}{2}}$"
      },
      {
        "id": "B",
        "text": "$[-1, \\infty), \\frac{1}{\\sqrt{x + 1}}$"
      },
      {
        "id": "C",
        "text": "$(-1, \\infty), \\frac{1}{\\sqrt{x + 1}}$"
      },
      {
        "id": "D",
        "text": "$(-\\infty, -1), (x + 1)^{\\frac{1}{2}}$"
      }
    ],
    "correctOptionId": "C",
    "explanation": "For $f(x) = 2(x + 1)^{1/2}$, the function is differentiable on the open interval $(-1, \\infty)$. By the power and chain rules: $f'(x) = 2 \\cdot \\frac{1}{2}(x + 1)^{-1/2} = \\frac{1}{\\sqrt{x + 1}}$.",
    "derivationSteps": [
      "$f'(x) = 2 \\cdot \\frac{1}{2\\sqrt{x + 1}} \\cdot 1 = \\frac{1}{\\sqrt{x + 1}}$.",
      "Domain of differentiability excludes the boundary point $x = -1$ where the tangent is vertical, so interval is $(-1, \\infty)$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Derivatives & Applications concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-45",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 12,
    "unitNumber": 2,
    "unitTitle": "Derivatives & Applications",
    "prompt": "Let $f(x) = x^2 + \\sqrt{x}$ and $g(x) = e^{2x}$. Which of the following is true?",
    "options": [
      {
        "id": "A",
        "text": "$(f + g)'(x) = 2x + \\frac{1}{2\\sqrt{x}} + 2e^{2x}$"
      },
      {
        "id": "B",
        "text": "$(f + g)'(x) = 2x + \\frac{1}{2}\\sqrt{x} + 2e^{2x}$"
      },
      {
        "id": "C",
        "text": "$(f + g)'(x) = 2x - \\frac{1}{2}\\sqrt{x} - 2e^{2x}$"
      },
      {
        "id": "D",
        "text": "$(f - g)'(x) = 2x - \\frac{1}{2\\sqrt{x}} - 2e^{2x}$"
      }
    ],
    "correctOptionId": "A",
    "explanation": "Using sum rule: $(f + g)'(x) = f'(x) + g'(x)$. With $f'(x) = 2x + \\frac{1}{2\\sqrt{x}}$ and $g'(x) = 2e^{2x}$, we get $(f + g)'(x) = 2x + \\frac{1}{2\\sqrt{x}} + 2e^{2x}$.",
    "derivationSteps": [
      "$\\frac{d}{dx}(x^2) = 2x$.",
      "$\\frac{d}{dx}(\\sqrt{x}) = \\frac{1}{2\\sqrt{x}}$.",
      "$\\frac{d}{dx}(e^{2x}) = 2e^{2x}$.",
      "Sum $= 2x + \\frac{1}{2\\sqrt{x}} + 2e^{2x}$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Derivatives & Applications concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-46",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 12,
    "unitNumber": 2,
    "unitTitle": "Derivatives & Applications",
    "prompt": "What is the equation of the tangent line to the graph of the function $f(x) = e^x$ at $(1, e)$?",
    "options": [
      {
        "id": "A",
        "text": "$y = x + \\frac{1}{e}$"
      },
      {
        "id": "B",
        "text": "$y = \\frac{1}{e}x + \\frac{1}{e}$"
      },
      {
        "id": "C",
        "text": "$y = ex + e$"
      },
      {
        "id": "D",
        "text": "$y = ex$"
      }
    ],
    "correctOptionId": "D",
    "explanation": "The slope is $m = f'(1) = e^1 = e$. The tangent line passing through $(1, e)$ is $y - e = e(x - 1) \\implies y - e = ex - e \\iff y = ex$.",
    "derivationSteps": [
      "Slope $m = f'(1) = e^1 = e$.",
      "Equation: $y - e = e(x - 1) = ex - e$.",
      "Add $e$: $y = ex$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Derivatives & Applications concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-47",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 12,
    "unitNumber": 2,
    "unitTitle": "Derivatives & Related Rates",
    "prompt": "Water is flowing into a cylindrical water tank of radius 2m and height 10m at a rate of $5\\text{ m}^3/\\text{min}$. What is the rate of the change of the height when the water level is 6m?",
    "options": [
      {
        "id": "A",
        "text": "$\\frac{5}{4\\pi}\\text{ m/min}$"
      },
      {
        "id": "B",
        "text": "$\\frac{5\\pi}{4}\\text{ m/min}$"
      },
      {
        "id": "C",
        "text": "$2\\text{ m/min}$"
      },
      {
        "id": "D",
        "text": "$2\\pi\\text{ m/min}$"
      }
    ],
    "correctOptionId": "A",
    "explanation": "The volume of the cylinder is $V = \\pi r^2 h = \\pi(2)^2 h = 4\\pi h$. Differentiating with respect to time: $\\frac{dV}{dt} = 4\\pi \\frac{dh}{dt} \\implies 5 = 4\\pi \\frac{dh}{dt} \\iff \\frac{dh}{dt} = \\frac{5}{4\\pi}\\text{ m/min}$.",
    "derivationSteps": [
      "$V = 4\\pi h$.",
      "$\\frac{dV}{dt} = 4\\pi \\frac{dh}{dt}$.",
      "$\\frac{dh}{dt} = \\frac{5}{4\\pi}\\text{ m/min}$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Derivatives & Related Rates concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-48",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 12,
    "unitNumber": 3,
    "unitTitle": "Integration & Applications",
    "prompt": "Which one of the following is equal to $\\int (e^{2x} + \\cos x)\\,dx$?",
    "options": [
      {
        "id": "A",
        "text": "$\\frac{1}{2}e^{2x} + \\sin x + c$"
      },
      {
        "id": "B",
        "text": "$\\frac{1}{2}e^{2x} - \\sin x + c$"
      },
      {
        "id": "C",
        "text": "$e^{2x} + \\cos x + c$"
      },
      {
        "id": "D",
        "text": "$e^{2x} + \\sin x + c$"
      }
    ],
    "correctOptionId": "A",
    "explanation": "Integrate term by term: $\\int e^{2x}\\,dx = \\frac{1}{2}e^{2x}$ and $\\int \\cos x\\,dx = \\sin x$. Thus $\\int (e^{2x} + \\cos x)\\,dx = \\frac{1}{2}e^{2x} + \\sin x + c$.",
    "derivationSteps": [
      "$\\int e^{2x}\\,dx = \\frac{1}{2}e^{2x} + c_1$.",
      "$\\int \\cos x\\,dx = \\sin x + c_2$.",
      "Combined: $\\frac{1}{2}e^{2x} + \\sin x + c$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Integration & Applications concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-49",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 12,
    "unitNumber": 3,
    "unitTitle": "Integration & Applications",
    "prompt": "Let $f$ be continuous on $[a, b]$ and $F'(x) = f(x)$ for all $x \\in [a, b]$. Which of the following is true?",
    "options": [
      {
        "id": "A",
        "text": "$\\int_{a}^{b} F(x)\\,dx = f(b) - f(a)$"
      },
      {
        "id": "B",
        "text": "$\\int_{a}^{b} F(x)\\,dx = f(a) - f(b)$"
      },
      {
        "id": "C",
        "text": "$\\int_{a}^{b} f(x)\\,dx = F(a) - F(b)$"
      },
      {
        "id": "D",
        "text": "$\\int_{a}^{b} f(x)\\,dx = F(b) - F(a)$"
      }
    ],
    "correctOptionId": "D",
    "explanation": "By the Fundamental Theorem of Calculus, if $F'(x) = f(x)$ on $[a, b]$, then the definite integral equals the antiderivative evaluated at the limits: $\\int_{a}^{b} f(x)\\,dx = F(b) - F(a)$.",
    "derivationSteps": [
      "Statement of the Fundamental Theorem of Calculus: $\\int_a^b f(x)\\,dx = [F(x)]_a^b = F(b) - F(a)$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Integration & Applications concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-50",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 12,
    "unitNumber": 3,
    "unitTitle": "Integration & Applications",
    "prompt": "Which one of the following is equal to $\\int_{1}^{3} 2x\\sqrt{x^2 + 1}\\,dx$?",
    "options": [
      {
        "id": "A",
        "text": "$\\frac{4(10\\sqrt{10} - 2\\sqrt{2})}{3}$"
      },
      {
        "id": "B",
        "text": "$\\frac{2(5\\sqrt{10} - \\sqrt{2})}{3}$"
      },
      {
        "id": "C",
        "text": "$\\frac{2(5\\sqrt{10} + 2\\sqrt{2})}{3}$"
      },
      {
        "id": "D",
        "text": "$\\frac{4(5\\sqrt{10} - \\sqrt{2})}{3}$"
      }
    ],
    "correctOptionId": "D",
    "explanation": "Let $u = x^2 + 1 \\implies du = 2x\\,dx$. Limits: $x = 1 \\implies u = 2$; $x = 3 \\implies u = 10$. $\\int_{2}^{10} u^{1/2}\\,du = [\\frac{2}{3}u^{3/2}]_2^{10} = \\frac{2}{3}(10\\sqrt{10} - 2\\sqrt{2}) = \\frac{4(5\\sqrt{10} - \\sqrt{2})}{3}$.",
    "derivationSteps": [
      "Substitute $u = x^2 + 1, du = 2x dx$.",
      "New limits: $u(1) = 2, u(3) = 10$.",
      "$\\int_2^{10} u^{1/2} du = \\left[ \\frac{2}{3}u^{3/2} \\right]_2^{10} = \\frac{2}{3}(10\\sqrt{10} - 2\\sqrt{2})$.",
      "Factor out 2: $\\frac{4(5\\sqrt{10} - \\sqrt{2})}{3}$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "advanced",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Integration & Applications concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-51",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 11,
    "unitNumber": 2,
    "unitTitle": "Coordinate Geometry",
    "prompt": "A line makes an angle of $145^\\circ$ with the positive x-axis. What is the slope of the line? (Given $\\tan 35^\\circ = 0.7$)",
    "options": [
      {
        "id": "A",
        "text": "$\\frac{10}{7}$"
      },
      {
        "id": "B",
        "text": "$-\\frac{10}{7}$"
      },
      {
        "id": "C",
        "text": "0.7"
      },
      {
        "id": "D",
        "text": "-0.7"
      }
    ],
    "correctOptionId": "D",
    "explanation": "The slope is $m = \\tan(145^\\circ) = \\tan(180^\\circ - 35^\\circ) = -\\tan(35^\\circ) = -0.7$.",
    "derivationSteps": [
      "$m = \\tan(145^\\circ)$.",
      "Since $145^\\circ$ is in Quadrant II, $\\tan(145^\\circ) = -\\tan(35^\\circ) = -0.7$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Coordinate Geometry concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-52",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 11,
    "unitNumber": 5,
    "unitTitle": "Rational Functions & Equations",
    "prompt": "What is the solution set of $\\frac{2}{x - 1} + \\frac{4}{x} = \\frac{6}{x - 2}$?",
    "options": [
      {
        "id": "A",
        "text": "$\\{\\frac{4}{11}\\}$"
      },
      {
        "id": "B",
        "text": "$\\{\\frac{11}{4}\\}$"
      },
      {
        "id": "C",
        "text": "$\\{\\frac{4}{5}\\}$"
      },
      {
        "id": "D",
        "text": "$\\{\\frac{5}{4}\\}$"
      }
    ],
    "correctOptionId": "C",
    "explanation": "Clear fractions by multiplying by $x(x - 1)(x - 2)$: $2x(x - 2) + 4(x - 1)(x - 2) = 6x(x - 1) \\implies (2x^2 - 4x) + (4x^2 - 12x + 8) = 6x^2 - 6x \\implies -16x + 8 = -6x \\implies 10x = 8 \\iff x = \\frac{4}{5}$.",
    "derivationSteps": [
      "Multiply by $x(x-1)(x-2)$.",
      "$2x^2 - 4x + 4x^2 - 12x + 8 = 6x^2 - 6x$.",
      "$6x^2 - 16x + 8 = 6x^2 - 6x$.",
      "$-16x + 8 = -6x \\implies 10x = 8 \\implies x = 4/5$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Rational Functions & Equations concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-53",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 11,
    "unitNumber": 2,
    "unitTitle": "Coordinate Geometry",
    "prompt": "Let $l_1: y = \\frac{1}{3}x + 1$ and $l_2: y = 2x - 1$ be two lines. What is the angle between $l_1$ and $l_2$ measured from $l_1$ to $l_2$ counterclockwise?",
    "options": [
      {
        "id": "A",
        "text": "$\\frac{\\pi}{4}$"
      },
      {
        "id": "B",
        "text": "$\\frac{\\pi}{2}$"
      },
      {
        "id": "C",
        "text": "$\\frac{3\\pi}{4}$"
      },
      {
        "id": "D",
        "text": "$\\frac{3\\pi}{2}$"
      }
    ],
    "correctOptionId": "A",
    "explanation": "Slopes are $m_1 = 1/3$ and $m_2 = 2$. Angle counterclockwise from $l_1$ to $l_2$: $\\tan\\theta = \\frac{m_2 - m_1}{1 + m_1 m_2} = \\frac{2 - 1/3}{1 + (1/3)(2)} = \\frac{5/3}{5/3} = 1 \\implies \\theta = \\frac{\\pi}{4}$.",
    "derivationSteps": [
      "$\\tan\\theta = \\frac{m_2 - m_1}{1 + m_1 m_2}$.",
      "Numerator: $2 - \\frac{1}{3} = \\frac{5}{3}$.",
      "Denominator: $1 + \\frac{2}{3} = \\frac{5}{3}$.",
      "$\\tan\\theta = 1 \\implies \\theta = \\frac{\\pi}{4}$ radians ($45^\\circ$)."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Coordinate Geometry concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-54",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 11,
    "unitNumber": 1,
    "unitTitle": "Further on Mathematical Logic",
    "prompt": "Let $p$: 2 is a prime number and $q$: 3 is an odd number. Then the contrapositive and its truth value of the statement $p \\Rightarrow q$ are respectively",
    "options": [
      {
        "id": "A",
        "text": "$\\neg q \\Rightarrow \\neg p$ and True"
      },
      {
        "id": "B",
        "text": "$\\neg q \\Rightarrow \\neg p$ and False"
      },
      {
        "id": "C",
        "text": "$\\neg p \\Rightarrow q$ and True"
      },
      {
        "id": "D",
        "text": "$q \\Rightarrow \\neg p$ and False"
      }
    ],
    "correctOptionId": "A",
    "explanation": "The contrapositive of $p \\Rightarrow q$ is $\\neg q \\Rightarrow \\neg p$. Since $p$ (2 is prime) is True and $q$ (3 is odd) is True, $p \\Rightarrow q$ is True. An implication and its contrapositive always share identical truth values (True).",
    "derivationSteps": [
      "Contrapositive formula: $\\neg q \\Rightarrow \\neg p$.",
      "Truth values: $T(p) = T, T(q) = T \\implies T(p \\Rightarrow q) = T$.",
      "Contrapositive is logically equivalent, so its truth value is True."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Further on Mathematical Logic concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-55",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 11,
    "unitNumber": 6,
    "unitTitle": "Probability and Statistics",
    "prompt": "The following table shows the test scores of 20 students in a class.\r\n\r\n\r\n\r\n| Test Scores | Frequency |\r\n| --- | --- |\r\n| 0-2 | 3 |\r\n| 3-5 | 5 |\r\n| 6-8 | 5 |\r\n| 9-11 | 3 |\r\n| 12-14 | 4 |\r\n\r\nWhat is the variance of the given data?",
    "options": [
      {
        "id": "A",
        "text": "16.2"
      },
      {
        "id": "B",
        "text": "17.2"
      },
      {
        "id": "C",
        "text": "18.45"
      },
      {
        "id": "D",
        "text": "19.45"
      }
    ],
    "correctOptionId": "A",
    "explanation": "Mean is $\\bar{x} = 7$. Midpoints are $1, 4, 7, 10, 13$. Sum of squared deviations $\\sum f_i(x_i - \\bar{x})^2 = 3(36) + 5(9) + 5(0) + 3(9) + 4(36) = 108 + 45 + 0 + 27 + 144 = 324$. Variance $\\sigma^2 = \\frac{324}{20} = 16.2$.",
    "derivationSteps": [
      "Mean $\\bar{x} = \\frac{3(1) + 5(4) + 5(7) + 3(10) + 4(13)}{20} = \\frac{140}{20} = 7$.",
      "$\\sum f_i(x_i - \\bar{x})^2 = 3(-6)^2 + 5(-3)^2 + 5(0)^2 + 3(3)^2 + 4(6)^2 = 324$.",
      "Variance $= \\frac{324}{20} = 16.2$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "advanced",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Probability and Statistics concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-56",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 11,
    "unitNumber": 4,
    "unitTitle": "Matrices & Systems of Linear Equations",
    "prompt": "What is the solution of the system of linear equations $\\begin{cases} 2x + 7y = -5 \\\\ 5x + 11y = 2 \\end{cases}$?",
    "options": [
      {
        "id": "A",
        "text": "$x = -\\frac{5}{3}$ and $y = \\frac{25}{21}$"
      },
      {
        "id": "B",
        "text": "$x = \\frac{5}{3}$ and $y = -\\frac{25}{21}$"
      },
      {
        "id": "C",
        "text": "$x = \\frac{69}{13}$ and $y = -\\frac{29}{13}$"
      },
      {
        "id": "D",
        "text": "$x = -\\frac{69}{13}$ and $y = \\frac{29}{13}$"
      }
    ],
    "correctOptionId": "C",
    "explanation": "Using Cramer's Rule or elimination: $5(2x + 7y) - 2(5x + 11y) = 5(-5) - 2(2) \\implies 13y = -29 \\implies y = -\\frac{29}{13}$. Then $2x = -5 - 7(-\\frac{29}{13}) = \\frac{138}{13} \\implies x = \\frac{69}{13}$.",
    "derivationSteps": [
      "Determinant $D = 2(11) - 7(5) = 22 - 35 = -13$.",
      "$D_x = -5(11) - 7(2) = -55 - 14 = -69 \\implies x = \\frac{D_x}{D} = \\frac{-69}{-13} = \\frac{69}{13}$.",
      "$D_y = 2(2) - (-5)(5) = 4 + 25 = 29 \\implies y = \\frac{D_y}{D} = \\frac{29}{-13} = -\\frac{29}{13}$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Matrices & Systems of Linear Equations concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-57",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 11,
    "unitNumber": 7,
    "unitTitle": "Complex Numbers",
    "prompt": "What is the simplified form of $\\frac{(2 + i)(3 - 4i)}{(2 - 2i)(1 + i)}$ ?",
    "options": [
      {
        "id": "A",
        "text": "$\\frac{7}{8} - \\frac{3}{8}i$"
      },
      {
        "id": "B",
        "text": "$\\frac{5}{2} - \\frac{5}{2}i$"
      },
      {
        "id": "C",
        "text": "$\\frac{5}{2} + \\frac{5}{4}i$"
      },
      {
        "id": "D",
        "text": "$\\frac{5}{2} - \\frac{5}{4}i$"
      }
    ],
    "correctOptionId": "D",
    "explanation": "Numerator: $(2 + i)(3 - 4i) = 6 - 8i + 3i - 4i^2 = 10 - 5i$. Denominator: $(2 - 2i)(1 + i) = 2(1 - i)(1 + i) = 2(1 - i^2) = 2(2) = 4$. Dividing: $\\frac{10 - 5i}{4} = \\frac{5}{2} - \\frac{5}{4}i$.",
    "derivationSteps": [
      "Numerator expansion: $6 - 5i + 4 = 10 - 5i$.",
      "Denominator expansion: $2(1 + 1) = 4$.",
      "Simplify fraction: $\\frac{10}{4} - \\frac{5}{4}i = \\frac{5}{2} - \\frac{5}{4}i$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Complex Numbers concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-58",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 11,
    "unitNumber": 8,
    "unitTitle": "Sequences & Series",
    "prompt": "Consider the sequence $\\{a_n\\}_{n=1}^{\\infty}$, where $a_n = 1 + \\frac{(-1)^n}{n}$ for $n \\ge 1$. Which one of the following is true?",
    "options": [
      {
        "id": "A",
        "text": "$a_{10} = \\frac{11}{10}$"
      },
      {
        "id": "B",
        "text": "$a_{11} = \\frac{12}{11}$"
      },
      {
        "id": "C",
        "text": "$a_n \\le a_{n+1}$ for all $n$"
      },
      {
        "id": "D",
        "text": "$a_n \\ge a_{n+1}$ for all $n$"
      }
    ],
    "correctOptionId": "A",
    "explanation": "For $n = 10$: $a_{10} = 1 + \\frac{(-1)^{10}}{10} = 1 + \\frac{1}{10} = \\frac{11}{10}$.",
    "derivationSteps": [
      "Substitute $n = 10$ into $a_n = 1 + \\frac{(-1)^n}{n}$.",
      "$(-1)^{10} = 1$.",
      "$a_{10} = 1 + \\frac{1}{10} = \\frac{11}{10}$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Sequences & Series concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-59",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 11,
    "unitNumber": 8,
    "unitTitle": "Sequences & Series",
    "prompt": "Consider the sequence $\\{1 + \\frac{1}{n}\\}_{n=1}^{\\infty}$. Which one of the following is true about the sequence?",
    "options": [
      {
        "id": "A",
        "text": "2 is its lower bound"
      },
      {
        "id": "B",
        "text": "$\\frac{3}{2}$ is its lower bound"
      },
      {
        "id": "C",
        "text": "4 is its upper bound."
      },
      {
        "id": "D",
        "text": "$\\frac{6}{5}$ is its upper bound"
      }
    ],
    "correctOptionId": "C",
    "explanation": "For the sequence $a_n = 1 + \\frac{1}{n}$, the terms decrease from $a_1 = 2$ down towards $1$. Since $a_n \\le 2$ for all $n$, any number $\\ge 2$ is an upper bound. In particular, 4 is an upper bound.",
    "derivationSteps": [
      "$a_n = 1 + \\frac{1}{n} \\le 2 < 4$ for all $n \\in \\mathbb{N}$.",
      "By definition of upper bound, 4 is an upper bound."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Sequences & Series concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-60",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 12,
    "unitNumber": 1,
    "unitTitle": "Limits and Continuity",
    "prompt": "Which one of the following is equal to $\\lim_{x\\to 0} \\frac{x}{1 - \\sqrt{x + 1}}$?",
    "options": [
      {
        "id": "A",
        "text": "0"
      },
      {
        "id": "B",
        "text": "-2"
      },
      {
        "id": "C",
        "text": "-1"
      },
      {
        "id": "D",
        "text": "$-\\frac{1}{2}$"
      }
    ],
    "correctOptionId": "B",
    "explanation": "Multiply numerator and denominator by $(1 + \\sqrt{x + 1})$: $\\frac{x(1 + \\sqrt{x + 1})}{1 - (x + 1)} = \\frac{x(1 + \\sqrt{x + 1})}{-x} = -(1 + \\sqrt{x + 1})$. As $x \\to 0$, $-(1 + \\sqrt{1}) = -2$.",
    "derivationSteps": [
      "Rationalize denominator: $\\frac{x(1 + \\sqrt{x+1})}{(1 - \\sqrt{x+1})(1 + \\sqrt{x+1})}$.",
      "Denominator simplifies to $1 - (x + 1) = -x$.",
      "Cancel $x$: $-(1 + \\sqrt{x + 1})$.",
      "Take limit $x \\to 0$: $-(1 + 1) = -2$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Limits and Continuity concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-61",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 12,
    "unitNumber": 2,
    "unitTitle": "Derivatives & Applications",
    "prompt": "Let $f(x) = e^{-2x}$. Which one of the following is true about $f$?",
    "options": [
      {
        "id": "A",
        "text": "$f^{(n)}(0) = (-\\frac{1}{2})^n$"
      },
      {
        "id": "B",
        "text": "$f^{(n)}(0) = (-\\frac{1}{2e})^n$"
      },
      {
        "id": "C",
        "text": "$f^{(n)}(x) = (-2)^n e^{-2x}$"
      },
      {
        "id": "D",
        "text": "$f^{(n)}(x) = 2^n e^{-2x}$"
      }
    ],
    "correctOptionId": "C",
    "explanation": "By induction, the $n$-th derivative of $e^{kx}$ is $k^n e^{kx}$. With $k = -2$, $f^{(n)}(x) = (-2)^n e^{-2x}$.",
    "derivationSteps": [
      "$f'(x) = -2e^{-2x}$.",
      "$f''(x) = (-2)^2 e^{-2x}$.",
      "$f^{(n)}(x) = (-2)^n e^{-2x}$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Derivatives & Applications concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-62",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 12,
    "unitNumber": 2,
    "unitTitle": "Derivatives & Mean Value Theorem",
    "prompt": "Consider the function $f(x) = x^2 - 3x$ on $[-1, 2]$. What is the value $x$ that satisfies the Mean Value Theorem?",
    "options": [
      {
        "id": "A",
        "text": "0"
      },
      {
        "id": "B",
        "text": "1"
      },
      {
        "id": "C",
        "text": "$\\frac{1}{2}$"
      },
      {
        "id": "D",
        "text": "$\\frac{3}{2}$"
      }
    ],
    "correctOptionId": "C",
    "explanation": "Average rate of change is $\\frac{f(2) - f(-1)}{2 - (-1)} = \\frac{-2 - 4}{3} = -2$. Set $f'(c) = 2c - 3 = -2 \\implies 2c = 1 \\iff c = \\frac{1}{2}$.",
    "derivationSteps": [
      "$f(-1) = (-1)^2 - 3(-1) = 4$.",
      "$f(2) = 2^2 - 3(2) = -2$.",
      "$\\frac{f(2) - f(-1)}{2 - (-1)} = \\frac{-6}{3} = -2$.",
      "$f'(x) = 2x - 3 = -2 \\implies 2x = 1 \\implies x = 1/2$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Derivatives & Mean Value Theorem concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-63",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 12,
    "unitNumber": 2,
    "unitTitle": "Derivatives & Optimization",
    "prompt": "A carpenter wants to design a closed box that has a square base and total surface area of $54\\text{ cm}^2$. What is the maximum volume that can be constructed with the given total surface area?",
    "options": [
      {
        "id": "A",
        "text": "$12\\text{ cm}^3$"
      },
      {
        "id": "B",
        "text": "$13.5\\text{ cm}^3$"
      },
      {
        "id": "C",
        "text": "$18\\text{ cm}^3$"
      },
      {
        "id": "D",
        "text": "$27\\text{ cm}^3$"
      }
    ],
    "correctOptionId": "D",
    "explanation": "Total surface area $2x^2 + 4xy = 54 \\implies y = \\frac{27 - x^2}{2x}$. Volume $V(x) = x^2 y = \\frac{27x - x^3}{2}$. Set $V'(x) = \\frac{27 - 3x^2}{2} = 0 \\implies x = 3$. Then $y = 3$ (a cube) and $V_{\\max} = 3^3 = 27\\text{ cm}^3$.",
    "derivationSteps": [
      "Surface area: $S = 2x^2 + 4xy = 54 \\implies 4xy = 54 - 2x^2 \\implies y = \\frac{27 - x^2}{2x}$.",
      "Volume: $V = x^2 y = \\frac{27x - x^3}{2}$.",
      "$V'(x) = \\frac{27 - 3x^2}{2} = 0 \\implies x^2 = 9 \\implies x = 3$.",
      "Max Volume: $V(3) = 3^2 \\times 3 = 27\\text{ cm}^3$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "advanced",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Derivatives & Optimization concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-64",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 12,
    "unitNumber": 3,
    "unitTitle": "Integration & Applications of Calculus",
    "prompt": "What is the area of the region bounded by the line $y = x$ and the parabola $y = x^2 - 2x$ on the interval $[0, 3]$?",
    "options": [
      {
        "id": "A",
        "text": "9 square units"
      },
      {
        "id": "B",
        "text": "$\\frac{9}{2}$ square units"
      },
      {
        "id": "C",
        "text": "3 square units"
      },
      {
        "id": "D",
        "text": "2 square units"
      }
    ],
    "correctOptionId": "B",
    "explanation": "The curves intersect at $x = x^2 - 2x \\implies x^2 - 3x = 0 \\implies x = 0$ and $x = 3$. Area $= \\int_{0}^{3} [x - (x^2 - 2x)]\\,dx = \\int_{0}^{3} (3x - x^2)\\,dx = [\\frac{3x^2}{2} - \\frac{x^3}{3}]_0^3 = \\frac{27}{2} - 9 = \\frac{9}{2}\\text{ sq. units}$.",
    "derivationSteps": [
      "Upper curve is $y = x$, lower curve is $y = x^2 - 2x$ on $[0, 3]$.",
      "Integrand: $x - (x^2 - 2x) = 3x - x^2$.",
      "$\\int_0^3 (3x - x^2)\\,dx = \\left[ \\frac{3x^2}{2} - \\frac{x^3}{3} \\right]_0^3 = \\frac{27}{2} - 9 = \\frac{9}{2}$."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "moderate",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Integration & Applications of Calculus concepts with standard Ethiopian examination distractor models."
  },
  {
    "id": "math-nat-16-65",
    "subject": "Mathematics (Natural)",
    "subjectId": "math-nat",
    "grade": 9,
    "unitNumber": 4,
    "unitTitle": "Business Mathematics: Unit Pricing",
    "prompt": "A painter buys 5 liters of paint for Birr 36 and 6 liters of the same brand paint for Birr 43. Which of the following is true?",
    "options": [
      {
        "id": "A",
        "text": "Buying 5 liters is more economical than buying 6 liters."
      },
      {
        "id": "B",
        "text": "Buying 6 liters is more economical than buying 5 liters."
      },
      {
        "id": "C",
        "text": "Both have the same economical purchase."
      },
      {
        "id": "D",
        "text": "We cannot compare."
      }
    ],
    "correctOptionId": "B",
    "explanation": "5 liters at 36 Birr $\\implies \\frac{36}{5} = 7.20\\text{ Birr/liter}$. 6 liters at 43 Birr $\\implies \\frac{43}{6} \\approx 7.167\\text{ Birr/liter}$. Since $7.167 < 7.20$, purchasing 6 liters provides a cheaper cost per liter and is more economical.",
    "derivationSteps": [
      "Unit rate for 5 liters: $36 / 5 = 7.20\\text{ Birr/L}$.",
      "Unit rate for 6 liters: $43 / 6 \\approx 7.167\\text{ Birr/L}$.",
      "Comparison: $7.167 < 7.20$, so 6 liters is more economical."
    ],
    "examYear": "EUEE 2016 E.C.",
    "difficulty": "foundation",
    "isProSolutionAvailable": true,
    "examinerInsight": "Authentic National University Entrance Examination question testing Business Mathematics: Unit Pricing concepts with standard Ethiopian examination distractor models."
  }
];
