-- ==============================================================================
-- QELEM MATRIC PREP — SEED QUESTIONS
-- Run this in your Supabase SQL Editor to populate the initial question bank.
-- ==============================================================================

INSERT INTO public.questions (
  id, subject, stream, grade_level, unit_number, unit_title,
  exam_year, difficulty, prompt, options, correct_option_id,
  explanation, distractor_analysis, examiner_insight
) VALUES (
  'phy-12-01',
  'Physics',
  'natural',
  12,
  2,
  'Electromagnetism & Induction',
  'EUEE 2016 E.C.',
  'medium',
  'A rectangular coil of $N = 200$ turns with cross-sectional dimensions $10\text{ cm} \times 5\text{ cm}$ is placed perpendicular to a uniform magnetic field $B = 0.40\text{ T}$. If the field collapses to zero in $\Delta t = 0.05\text{ s}$, what is the magnitude of the average induced electromotive force $\mathcal{E}$ across the coil?',
  $json$[{"id":"A","text":"$4.0\\text{ V}$"},{"id":"B","text":"$8.0\\text{ V}$"},{"id":"C","text":"$16.0\\text{ V}$"},{"id":"D","text":"$40.0\\text{ V}$"}]$json$::jsonb,
  'B',
  'According to Faraday''s Law of Electromagnetic Induction, the magnitude of the induced EMF is proportional to the number of coil turns and the time rate of change of magnetic flux through the enclosed loop.',
  $json$[{"optionId":"A","trapExplanation":"Calculated with $N = 100$ turns or halved the turn multiplier, obtaining $4.0\\text{ V}$.","commonErrorType":"Omission / Turn Count Halving"},{"optionId":"C","trapExplanation":"Doubled the rate of change or misread $\\Delta t = 0.025\\text{ s}$ instead of $0.05\\text{ s}$, yielding $16.0\\text{ V}$.","commonErrorType":"Time Interval Reciprocal Error"},{"optionId":"D","trapExplanation":"Omitted converting $\\text{cm}^2$ to $\\text{m}^2$ ($50\\text{ cm}^2 = 50 \\times 10^{-4}\\text{ m}^2$), misplacing a power of 10 to obtain $40.0\\text{ V}$.","commonErrorType":"Metric Unit Area Conversion Trap"}]$json$::jsonb,
  'National university entrance examiners intentionally test whether students recall the factor of $10^{-4}$ when converting $\text{cm}^2$ into $\text{m}^2$, and whether they remember to multiply by the coil turn count $N = 200$.'
) ON CONFLICT (id) DO UPDATE SET
  prompt = EXCLUDED.prompt,
  options = EXCLUDED.options,
  correct_option_id = EXCLUDED.correct_option_id,
  explanation = EXCLUDED.explanation;

INSERT INTO public.questions (
  id, subject, stream, grade_level, unit_number, unit_title,
  exam_year, difficulty, prompt, options, correct_option_id,
  explanation, distractor_analysis, examiner_insight
) VALUES (
  'phy-12-02',
  'Physics',
  'natural',
  12,
  4,
  'Wave Optics & Interference',
  'EUEE 2015 E.C.',
  'medium',
  'In a Young''s double-slit experiment, monochromatic light of wavelength $\lambda = 600\text{ nm}$ illuminates two narrow slits separated by $d = 0.30\text{ mm}$. The interference fringe pattern is cast on a screen placed at distance $D = 1.50\text{ m}$. What is the linear fringe separation $\Delta y$ between two adjacent bright fringes?',
  $json$[{"id":"A","text":"$1.5\\text{ mm}$"},{"id":"B","text":"$3.0\\text{ mm}$"},{"id":"C","text":"$4.5\\text{ mm}$"},{"id":"D","text":"$6.0\\text{ mm}$"}]$json$::jsonb,
  'B',
  'The fringe separation $\Delta y$ between consecutive interference maxima in Young''s experiment is governed by the ratio of wavelength and slit separation scaled by the screen distance.',
  $json$[{"optionId":"A","trapExplanation":"Divided by 2 or calculated distance between adjacent bright and dark fringe (half-fringe width $\\Delta y / 2$).","commonErrorType":"Half-Fringe Maxima-Minima Confusion"},{"optionId":"C","trapExplanation":"Miscalculated $(6.0 \\times 1.5) / 2 = 4.5\\text{ mm}$, confusing slit spacing $0.30\\text{ mm}$ with $0.20\\text{ mm}$.","commonErrorType":"Denominator Substitution Slip"},{"optionId":"D","trapExplanation":"Doubled the separation or computed distance across two full fringe cycles ($2\\Delta y$).","commonErrorType":"Multi-Fringe Cycle Confusion"}]$json$::jsonb,
  'A high-frequency EUEE question testing dual metric prefixes: nanometers ($10^{-9}\text{ m}$) for wavelength and millimeters ($10^{-3}\text{ m}$) for slit spacing.'
) ON CONFLICT (id) DO UPDATE SET
  prompt = EXCLUDED.prompt,
  options = EXCLUDED.options,
  correct_option_id = EXCLUDED.correct_option_id,
  explanation = EXCLUDED.explanation;

INSERT INTO public.questions (
  id, subject, stream, grade_level, unit_number, unit_title,
  exam_year, difficulty, prompt, options, correct_option_id,
  explanation, distractor_analysis, examiner_insight
) VALUES (
  'phy-12-03',
  'Physics',
  'natural',
  12,
  6,
  'Modern Physics & Quantum Phenomena',
  'EUEE 2016 E.C.',
  'medium',
  'A photosensitive metal target with work function $\Phi = 2.14\text{ eV}$ is illuminated by ultraviolet radiation of frequency $f = 1.00 \times 10^{15}\text{ Hz}$. Using Planck''s constant $h = 4.14 \times 10^{-15}\text{ eV}\cdot\text{s}$, what is the maximum kinetic energy $K_{\max}$ of the ejected photoelectrons?',
  $json$[{"id":"A","text":"$1.00\\text{ eV}$"},{"id":"B","text":"$2.00\\text{ eV}$"},{"id":"C","text":"$4.14\\text{ eV}$"},{"id":"D","text":"$6.28\\text{ eV}$"}]$json$::jsonb,
  'B',
  'According to Einstein''s photoelectric equation, the maximum kinetic energy of liberated electrons equals the incident photon energy $E = hf$ minus the work function $\Phi$ needed to overcome surface binding.',
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  prompt = EXCLUDED.prompt,
  options = EXCLUDED.options,
  correct_option_id = EXCLUDED.correct_option_id,
  explanation = EXCLUDED.explanation;

INSERT INTO public.questions (
  id, subject, stream, grade_level, unit_number, unit_title,
  exam_year, difficulty, prompt, options, correct_option_id,
  explanation, distractor_analysis, examiner_insight
) VALUES (
  'phy-11-01',
  'Physics',
  'natural',
  11,
  2,
  'Two-Dimensional Kinematics & Vectors',
  'EUEE 2014 E.C.',
  'easy',
  'A projectile is launched from ground level with initial speed $v_0 = 50\text{ m/s}$ at an angle $\theta = 30^\circ$ above the horizontal. Taking $g = 10\text{ m/s}^2$ and neglecting air resistance, what is the maximum vertical elevation $H_{\max}$ attained?',
  $json$[{"id":"A","text":"$25.0\\text{ m}$"},{"id":"B","text":"$31.25\\text{ m}$"},{"id":"C","text":"$62.50\\text{ m}$"},{"id":"D","text":"$125.0\\text{ m}$"}]$json$::jsonb,
  'B',
  'At the apex of the parabolic flight path, the vertical velocity component vanishes ($v_y = 0$). Maximum altitude depends strictly on the vertical velocity component $v_{0y}$.',
  $json$[{"optionId":"A","trapExplanation":"Took vertical launch velocity $v_{0y} = 25\\text{ m/s}$ directly as height without squaring or dividing by $2g$.","commonErrorType":"Dimensional Unit / Formula Omission"},{"optionId":"C","trapExplanation":"Omitted the factor of 2 in the denominator ($2g$), calculating $H = v_{0y}^2 / g = 625 / 10 = 62.5\\text{ m}$.","commonErrorType":"Denominator Factor 2 Omission"},{"optionId":"D","trapExplanation":"Used total launch speed $v_0 = 50\\text{ m/s}$ without multiplying by $\\sin 30^\\circ = 0.5$ for the vertical component.","commonErrorType":"Failure to Resolve Vector Component"}]$json$::jsonb,
  'A perennial Grade 11 entrance trap: candidate failure to decompose initial velocity into its orthogonal vertical component $v_{0y} = v_0 \sin\theta$ or dropping the factor $2$ in the denominator $2g$.'
) ON CONFLICT (id) DO UPDATE SET
  prompt = EXCLUDED.prompt,
  options = EXCLUDED.options,
  correct_option_id = EXCLUDED.correct_option_id,
  explanation = EXCLUDED.explanation;

INSERT INTO public.questions (
  id, subject, stream, grade_level, unit_number, unit_title,
  exam_year, difficulty, prompt, options, correct_option_id,
  explanation, distractor_analysis, examiner_insight
) VALUES (
  'phy-11-02',
  'Physics',
  'natural',
  11,
  3,
  'Work, Energy & Conservation Laws',
  'EUEE 2014 E.C.',
  'medium',
  'A mass $m = 4.0\text{ kg}$ is released from rest at the top of a frictionless ramp of vertical height $h = 5.0\text{ m}$. Taking $g = 9.8\text{ m/s}^2$, what is the speed $v$ of the mass as it reaches the bottom?',
  $json$[{"id":"A","text":"$v \\approx 9.9\\text{ m/s}$"},{"id":"B","text":"$v \\approx 7.0\\text{ m/s}$"},{"id":"C","text":"$v \\approx 14.0\\text{ m/s}$"},{"id":"D","text":"$v \\approx 19.6\\text{ m/s}$"}]$json$::jsonb,
  'A',
  'By conservation of mechanical energy in the absence of non-conservative dissipative forces, gravitational potential energy transforms completely into kinetic energy.',
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  prompt = EXCLUDED.prompt,
  options = EXCLUDED.options,
  correct_option_id = EXCLUDED.correct_option_id,
  explanation = EXCLUDED.explanation;

INSERT INTO public.questions (
  id, subject, stream, grade_level, unit_number, unit_title,
  exam_year, difficulty, prompt, options, correct_option_id,
  explanation, distractor_analysis, examiner_insight
) VALUES (
  'phy-10-01',
  'Physics',
  'natural',
  10,
  4,
  'Electrostatics & Electric Fields',
  'EUEE 2015 E.C.',
  'easy',
  'Two point charges $q_1 = +4.0\,\mu\text{C}$ and $q_2 = -2.0\,\mu\text{C}$ are separated in air by distance $r = 0.30\text{ m}$. Using Coulomb''s constant $k_e = 9.0 \times 10^9\text{ N}\cdot\text{m}^2/\text{C}^2$, what is the magnitude of the electrostatic attraction force $F$?',
  $json$[{"id":"A","text":"$0.80\\text{ N}$"},{"id":"B","text":"$1.60\\text{ N}$"},{"id":"C","text":"$2.40\\text{ N}$"},{"id":"D","text":"$0.40\\text{ N}$"}]$json$::jsonb,
  'A',
  'Coulomb''s Law dictates that the electrostatic force between two static point charges is proportional to the product of charge magnitudes and inversely proportional to the square of separation distance.',
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  prompt = EXCLUDED.prompt,
  options = EXCLUDED.options,
  correct_option_id = EXCLUDED.correct_option_id,
  explanation = EXCLUDED.explanation;

INSERT INTO public.questions (
  id, subject, stream, grade_level, unit_number, unit_title,
  exam_year, difficulty, prompt, options, correct_option_id,
  explanation, distractor_analysis, examiner_insight
) VALUES (
  'phy-9-01',
  'Physics',
  'natural',
  9,
  3,
  'Linear Motion & Newton''s Laws',
  'EUEE 2014 E.C.',
  'easy',
  'A vehicle of mass $m = 1200\text{ kg}$ accelerates uniformly from rest to a speed of $v = 24\text{ m/s}$ along a straight horizontal track in $t = 8.0\text{ s}$. What net accelerating force $F_{\text{net}}$ is exerted on the vehicle?',
  $json$[{"id":"A","text":"$1800\\text{ N}$"},{"id":"B","text":"$2400\\text{ N}$"},{"id":"C","text":"$3600\\text{ N}$"},{"id":"D","text":"$4800\\text{ N}$"}]$json$::jsonb,
  'C',
  'From Newton''s Second Law of Motion, the net force on an object equals its mass multiplied by its acceleration ($F_{\text{net}} = ma$).',
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  prompt = EXCLUDED.prompt,
  options = EXCLUDED.options,
  correct_option_id = EXCLUDED.correct_option_id,
  explanation = EXCLUDED.explanation;

INSERT INTO public.questions (
  id, subject, stream, grade_level, unit_number, unit_title,
  exam_year, difficulty, prompt, options, correct_option_id,
  explanation, distractor_analysis, examiner_insight
) VALUES (
  'math-12-01',
  'Mathematics (Natural)',
  'natural',
  12,
  3,
  'Calculus & Applications of Derivatives',
  'EUEE 2015 E.C.',
  'hard',
  'Let $f(x) = (x^2 - 3)e^x$ be defined for all $x \in \mathbb{R}$. At what real coordinate does $f(x)$ attain its local minimum value?',
  $json$[{"id":"A","text":"$x = -3$"},{"id":"B","text":"$x = -1$"},{"id":"C","text":"$x = 1$"},{"id":"D","text":"$x = 3$"}]$json$::jsonb,
  'C',
  'To detect local extrema, compute the first derivative via the product rule, determine critical numbers where $f''(x) = 0$, and inspect sign transitions.',
  $json$[{"optionId":"A","trapExplanation":"Found critical value $x = -3$ where $f'(x) = 0$, but misclassified it: $f''(-3) < 0$ corresponds to a local MAXIMUM.","commonErrorType":"Extremum Classification Inversion"},{"optionId":"B","trapExplanation":"Computed quadratic vertex axis of symmetry $x = -b/(2a) = -2/2 = -1$, confusing parabola vertex with derivative roots.","commonErrorType":"Parabola Vertex Confusion"},{"optionId":"D","trapExplanation":"Factored $x^2 + 2x - 3$ incorrectly as $(x - 3)(x + 1)$, leading to false root $x = 3$.","commonErrorType":"Quadratic Factoring Sign Error"}]$json$::jsonb,
  'Calculus questions on EUEE consistently feature products with $e^x$. Since $e^x \neq 0$ everywhere, critical points depend strictly on the polynomial factor. The primary trap is confusing local minimum with local maximum.'
) ON CONFLICT (id) DO UPDATE SET
  prompt = EXCLUDED.prompt,
  options = EXCLUDED.options,
  correct_option_id = EXCLUDED.correct_option_id,
  explanation = EXCLUDED.explanation;

INSERT INTO public.questions (
  id, subject, stream, grade_level, unit_number, unit_title,
  exam_year, difficulty, prompt, options, correct_option_id,
  explanation, distractor_analysis, examiner_insight
) VALUES (
  'math-12-04',
  'Mathematics (Natural)',
  'natural',
  12,
  4,
  'Integral Calculus & Definite Integrals',
  'EUEE 2016 E.C.',
  'hard',
  'Evaluate the definite integral $$\int_0^1 x e^{2x} \, dx$$',
  $json$[{"id":"A","text":"$\\frac{1}{4}(e^2 + 1)$"},{"id":"B","text":"$\\frac{1}{4}(e^2 - 1)$"},{"id":"C","text":"$\\frac{1}{2} e^2$"},{"id":"D","text":"$\\frac{1}{4} e^2$"}]$json$::jsonb,
  'A',
  'Definite integrals of polynomial-exponential products are evaluated via integration by parts: $\int u \, dv = uv - \int v \, du$.',
  $json$[{"optionId":"B","trapExplanation":"Subtracted the lower limit without accounting for the double negative: $1/4 e^2 - (1/4) = 1/4(e^2 - 1)$.","commonErrorType":"Double Negative Sign Blunder"},{"optionId":"C","trapExplanation":"Evaluated only the first term $[uv]_0^1 = 1/2(1)e^2 - 0 = 1/2 e^2$, forgetting to evaluate the integral $\\int v du$.","commonErrorType":"Second Integral Term Omission"},{"optionId":"D","trapExplanation":"Assumed evaluating at $x = 0$ vanishes to 0 because of the multiplier $x$, yielding $1/4 e^2 - 0 = 1/4 e^2$.","commonErrorType":"Zero Limit False Assumption"}]$json$::jsonb,
  'The classic definite integral trap: lower limit $x = 0$ yields $-1/4(e^0) = -1/4$, NOT zero! Subtracting $-1/4$ adds $+1/4$, creating the $+1$ term in $(e^2 + 1)/4$.'
) ON CONFLICT (id) DO UPDATE SET
  prompt = EXCLUDED.prompt,
  options = EXCLUDED.options,
  correct_option_id = EXCLUDED.correct_option_id,
  explanation = EXCLUDED.explanation;

INSERT INTO public.questions (
  id, subject, stream, grade_level, unit_number, unit_title,
  exam_year, difficulty, prompt, options, correct_option_id,
  explanation, distractor_analysis, examiner_insight
) VALUES (
  'math-12-02',
  'Mathematics (Natural)',
  'natural',
  12,
  1,
  'Sequences, Series & Limits',
  'EUEE 2016 E.C.',
  'easy',
  'An infinite geometric series has leading term $a_1 = 12$ and common ratio $r = -\frac{1}{3}$. What is the exact sum $S_\infty$ of the series?',
  $json$[{"id":"A","text":"$8$"},{"id":"B","text":"$9$"},{"id":"C","text":"$16$"},{"id":"D","text":"$18$"}]$json$::jsonb,
  'B',
  'An infinite geometric series converges if and only if $|r| < 1$. When convergent, its sum is given by $S_\infty = \frac{a_1}{1 - r}$.',
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  prompt = EXCLUDED.prompt,
  options = EXCLUDED.options,
  correct_option_id = EXCLUDED.correct_option_id,
  explanation = EXCLUDED.explanation;

INSERT INTO public.questions (
  id, subject, stream, grade_level, unit_number, unit_title,
  exam_year, difficulty, prompt, options, correct_option_id,
  explanation, distractor_analysis, examiner_insight
) VALUES (
  'math-12-03',
  'Mathematics (Natural)',
  'natural',
  12,
  5,
  'Vectors in Three Dimensions',
  'EUEE 2015 E.C.',
  'hard',
  'Given two spatial vectors $\vec{u} = 2\mathbf{i} + \mathbf{j} - \mathbf{k}$ and $\vec{v} = \mathbf{i} - \mathbf{j} + 2\mathbf{k}$, calculate the vector cross product $\vec{u} \times \vec{v}$.',
  $json$[{"id":"A","text":"$\\mathbf{i} - 5\\mathbf{j} - 3\\mathbf{k}$"},{"id":"B","text":"$-\\mathbf{i} + 5\\mathbf{j} + 3\\mathbf{k}$"},{"id":"C","text":"$3\\mathbf{i} - 3\\mathbf{j} + \\mathbf{k}$"},{"id":"D","text":"$2\\mathbf{i} - \\mathbf{j} - 2\\mathbf{k}$"}]$json$::jsonb,
  'A',
  'The vector cross product produces an orthogonal pseudo-vector whose coordinates are given by the formal determinant of a $3 \times 3$ matrix with basis vectors along the top row.',
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  prompt = EXCLUDED.prompt,
  options = EXCLUDED.options,
  correct_option_id = EXCLUDED.correct_option_id,
  explanation = EXCLUDED.explanation;

INSERT INTO public.questions (
  id, subject, stream, grade_level, unit_number, unit_title,
  exam_year, difficulty, prompt, options, correct_option_id,
  explanation, distractor_analysis, examiner_insight
) VALUES (
  'math-11-01',
  'Mathematics (Natural)',
  'natural',
  11,
  4,
  'Coordinate Geometry & Conic Sections',
  'EUEE 2016 E.C.',
  'medium',
  'What are the focus coordinates and directrix equation for the horizontal parabola defined by $y^2 = -12x$?',
  $json$[{"id":"A","text":"Focus $(-3, 0)$, Directrix $x = 3$"},{"id":"B","text":"Focus $(3, 0)$, Directrix $x = -3$"},{"id":"C","text":"Focus $(0, -3)$, Directrix $y = 3$"},{"id":"D","text":"Focus $(-6, 0)$, Directrix $x = 6$"}]$json$::jsonb,
  'A',
  'The canonical equation of a horizontal parabola with vertex at $(0,0)$ is $y^2 = 4px$, with focal point $(p, 0)$ and vertical directrix line $x = -p$.',
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  prompt = EXCLUDED.prompt,
  options = EXCLUDED.options,
  correct_option_id = EXCLUDED.correct_option_id,
  explanation = EXCLUDED.explanation;

INSERT INTO public.questions (
  id, subject, stream, grade_level, unit_number, unit_title,
  exam_year, difficulty, prompt, options, correct_option_id,
  explanation, distractor_analysis, examiner_insight
) VALUES (
  'math-11-02',
  'Mathematics (Natural)',
  'natural',
  11,
  2,
  'Matrices and Determinants',
  'EUEE 2015 E.C.',
  'medium',
  'Given the $2 \times 2$ matrix $A = \begin{pmatrix} 3 & 2 \\ 5 & 4 \end{pmatrix}$, determine the exact inverse matrix $A^{-1}$.',
  $json$[{"id":"A","text":"$\\begin{pmatrix} 2 & -1 \\\\ -2.5 & 1.5 \\end{pmatrix}$"},{"id":"B","text":"$\\begin{pmatrix} 4 & -2 \\\\ -5 & 3 \\end{pmatrix}$"},{"id":"C","text":"$\\begin{pmatrix} 2 & 1 \\\\ 2.5 & 1.5 \\end{pmatrix}$"},{"id":"D","text":"$\\begin{pmatrix} -2 & 1 \\\\ 2.5 & -1.5 \\end{pmatrix}$"}]$json$::jsonb,
  'A',
  'The multiplicative inverse of a $2 \times 2$ matrix $A = \begin{pmatrix} a & b \\ c & d \end{pmatrix}$ is $A^{-1} = \frac{1}{ad - bc} \begin{pmatrix} d & -b \\ -c & a \end{pmatrix}$, provided $\det(A) \neq 0$.',
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  prompt = EXCLUDED.prompt,
  options = EXCLUDED.options,
  correct_option_id = EXCLUDED.correct_option_id,
  explanation = EXCLUDED.explanation;

INSERT INTO public.questions (
  id, subject, stream, grade_level, unit_number, unit_title,
  exam_year, difficulty, prompt, options, correct_option_id,
  explanation, distractor_analysis, examiner_insight
) VALUES (
  'math-10-01',
  'Mathematics (Natural)',
  'natural',
  10,
  2,
  'Polynomial & Rational Functions',
  'EUEE 2014 E.C.',
  'easy',
  'If $P(x) = 2x^3 - 3x^2 + kx - 6$ is exactly divisible by $(x - 2)$, what is the numerical value of the coefficient $k$?',
  $json$[{"id":"A","text":"$k = 1$"},{"id":"B","text":"$k = 2$"},{"id":"C","text":"$k = -1$"},{"id":"D","text":"$k = -2$"}]$json$::jsonb,
  'A',
  'By the Factor Theorem, a polynomial $P(x)$ is divisible by a linear factor $(x - c)$ if and only if $P(c) = 0$.',
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  prompt = EXCLUDED.prompt,
  options = EXCLUDED.options,
  correct_option_id = EXCLUDED.correct_option_id,
  explanation = EXCLUDED.explanation;

INSERT INTO public.questions (
  id, subject, stream, grade_level, unit_number, unit_title,
  exam_year, difficulty, prompt, options, correct_option_id,
  explanation, distractor_analysis, examiner_insight
) VALUES (
  'math-9-01',
  'Mathematics (Natural)',
  'natural',
  9,
  4,
  'Quadratic Equations & Inequalities',
  'EUEE 2014 E.C.',
  'easy',
  'Find the complete real solution set for the quadratic equation $$2x^2 - 7x + 3 = 0$$',
  $json$[{"id":"A","text":"$x = 3 \\text{ or } x = \\frac{1}{2}$"},{"id":"B","text":"$x = -3 \\text{ or } x = -\\frac{1}{2}$"},{"id":"C","text":"$x = 2 \\text{ or } x = \\frac{3}{2}$"},{"id":"D","text":"$x = 1 \\text{ or } x = \\frac{3}{2}$"}]$json$::jsonb,
  'A',
  'Quadratic equations in standard form $ax^2 + bx + c = 0$ can be factored or resolved via the quadratic formula $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$.',
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  prompt = EXCLUDED.prompt,
  options = EXCLUDED.options,
  correct_option_id = EXCLUDED.correct_option_id,
  explanation = EXCLUDED.explanation;

INSERT INTO public.questions (
  id, subject, stream, grade_level, unit_number, unit_title,
  exam_year, difficulty, prompt, options, correct_option_id,
  explanation, distractor_analysis, examiner_insight
) VALUES (
  'phy-9-01',
  'Physics',
  'natural',
  9,
  3,
  'Linear Motion & Newton''s Laws',
  'National Bank Gr. 9',
  'easy',
  'A vehicle initially at rest accelerates uniformly in a straight line at $a = 3.0\text{ m/s}^2$ for an interval of $t = 8.0\text{ s}$. What is the total displacement $s$ covered by the vehicle during this period?',
  $json$[{"id":"A","text":"$96\\text{ m}$"},{"id":"B","text":"$48\\text{ m}$"},{"id":"C","text":"$24\\text{ m}$"},{"id":"D","text":"$192\\text{ m}$"}]$json$::jsonb,
  'A',
  'For rectilinear motion with constant acceleration starting from rest ($u = 0$), displacement is calculated from $s = ut + \frac{1}{2}at^2 = \frac{1}{2}at^2$.',
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  prompt = EXCLUDED.prompt,
  options = EXCLUDED.options,
  correct_option_id = EXCLUDED.correct_option_id,
  explanation = EXCLUDED.explanation;

INSERT INTO public.questions (
  id, subject, stream, grade_level, unit_number, unit_title,
  exam_year, difficulty, prompt, options, correct_option_id,
  explanation, distractor_analysis, examiner_insight
) VALUES (
  'phy-10-01',
  'Physics',
  'natural',
  10,
  4,
  'Electrostatics & Electric Fields',
  'National Bank Gr. 10',
  'medium',
  'Two point charges $q_1 = +4.0\ \mu\text{C}$ and $q_2 = -2.0\ \mu\text{C}$ are separated in air by distance $r = 0.30\text{ m}$. Taking Coulomb''s constant $k_e = 9.0 \times 10^9\text{ N}\cdot\text{m}^2/\text{C}^2$, what is the magnitude and direction of the electrostatic force between them?',
  $json$[{"id":"A","text":"$0.80\\text{ N}$, Attractive"},{"id":"B","text":"$0.80\\text{ N}$, Repulsive"},{"id":"C","text":"$2.40\\text{ N}$, Attractive"},{"id":"D","text":"$0.24\\text{ N}$, Repulsive"}]$json$::jsonb,
  'A',
  'By Coulomb''s Law, electrostatic force magnitude is $F = k_e \frac{|q_1 q_2|}{r^2}$. Because the two charges have opposite signs ($+4\mu\text{C}$ and $-2\mu\text{C}$), the force is attractive.',
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  prompt = EXCLUDED.prompt,
  options = EXCLUDED.options,
  correct_option_id = EXCLUDED.correct_option_id,
  explanation = EXCLUDED.explanation;

