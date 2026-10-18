"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Clock,
  Sparkles,
  ArrowRight,
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  Landmark,
  Globe,
  TrendingUp,
  CheckCircle2,
  Zap,
  Layers,
  BookOpen,
  Target,
  GraduationCap,
} from "lucide-react";
import {
  getUserProfile,
  saveUserProfile,
  getExamCountdown,
  DEFAULT_PROFILE,
} from "@/lib/userStore";
import { UserProfile, ExamStream } from "@/types/user";
import { GradeLevel } from "@/types/curriculum";
import {
  createClient as createBrowserSupabaseClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";

interface DashboardClientProps {
  initialProfile: UserProfile | null;
  isAuthenticated: boolean;
}

interface SubjectCardItem {
  id: string;
  name: string;
  amharicName: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  badgeBg: string;
  description: string;
  unitsCount: number;
  topicsSample: string;
}

const NATURAL_SUBJECTS_BY_GRADE: Record<GradeLevel, SubjectCardItem[]> = {
  9: [
    {
      id: "physics",
      name: "Physics",
      amharicName: "ፊዚክስ",
      icon: Atom,
      iconColor: "text-blue-600",
      badgeBg: "bg-blue-50 text-blue-700 border-blue-100",
      description: "Linear motion, Newton's laws of motion, force, friction, momentum, and work.",
      unitsCount: 6,
      topicsSample: "Linear Kinematics, Newton's Laws, Friction, Momentum",
    },
    {
      id: "math-nat",
      name: "Mathematics",
      amharicName: "ሒሳብ",
      icon: Calculator,
      iconColor: "text-indigo-600",
      badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-100",
      description: "Real number system, linear and quadratic equations, inequalities, geometry.",
      unitsCount: 6,
      topicsSample: "Quadratic Equations, Factoring, Coordinate Geometry",
    },
    {
      id: "chemistry",
      name: "Chemistry",
      amharicName: "ኬሚስትሪ",
      icon: FlaskConical,
      iconColor: "text-amber-600",
      badgeBg: "bg-amber-50 text-amber-700 border-amber-100",
      description: "Structure of matter, periodic classification, chemical reactions and bonding.",
      unitsCount: 5,
      topicsSample: "Atomic Structure, Periodic Table, Chemical Bonding",
    },
    {
      id: "biology",
      name: "Biology",
      amharicName: "ሥነ-ህይወት",
      icon: Dna,
      iconColor: "text-emerald-600",
      badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-100",
      description: "Introduction to biology, cell biology, human organ systems, and plants.",
      unitsCount: 5,
      topicsSample: "Cell Biology, Organ Systems, Plants & Ecosystems",
    },
  ],
  10: [
    {
      id: "physics",
      name: "Physics",
      amharicName: "ፊዚክስ",
      icon: Atom,
      iconColor: "text-blue-600",
      badgeBg: "bg-blue-50 text-blue-700 border-blue-100",
      description: "Electrostatics, electric fields, current electricity, circuits, and magnetism.",
      unitsCount: 6,
      topicsSample: "Coulomb's Law, Electric Fields, Current & Voltage",
    },
    {
      id: "math-nat",
      name: "Mathematics",
      amharicName: "ሒሳብ",
      icon: Calculator,
      iconColor: "text-indigo-600",
      badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-100",
      description: "Polynomial and rational functions, exponential and logarithmic curves.",
      unitsCount: 6,
      topicsSample: "Polynomial Division, Rational Functions, Exponents",
    },
    {
      id: "chemistry",
      name: "Chemistry",
      amharicName: "ኬሚስትሪ",
      icon: FlaskConical,
      iconColor: "text-amber-600",
      badgeBg: "bg-amber-50 text-amber-700 border-amber-100",
      description: "Introduction to organic chemistry, hydrocarbons, reaction rates, and equilibrium.",
      unitsCount: 6,
      topicsSample: "Hydrocarbons, Alkanes, Reaction Rates, Equilibrium",
    },
    {
      id: "biology",
      name: "Biology",
      amharicName: "ሥነ-ህይወት",
      icon: Dna,
      iconColor: "text-emerald-600",
      badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-100",
      description: "Heredity and Mendelian genetics, ecology, conservation, and microorganisms.",
      unitsCount: 5,
      topicsSample: "Mendelian Genetics, DNA, Ecology & Biomes",
    },
  ],
  11: [
    {
      id: "physics",
      name: "Physics",
      amharicName: "ፊዚክስ",
      icon: Atom,
      iconColor: "text-blue-600",
      badgeBg: "bg-blue-50 text-blue-700 border-blue-100",
      description: "2D Kinematics, vectors, rotational dynamics, gravitation, and oscillations.",
      unitsCount: 8,
      topicsSample: "2D Projectile Motion, Vectors, Rotational Dynamics",
    },
    {
      id: "math-nat",
      name: "Mathematics",
      amharicName: "ሒሳብ",
      icon: Calculator,
      iconColor: "text-indigo-600",
      badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-100",
      description: "Matrices, determinants, 3D vectors, coordinate systems, and sequences.",
      unitsCount: 7,
      topicsSample: "Matrices & Determinants, 3D Vectors, Sequences",
    },
    {
      id: "chemistry",
      name: "Chemistry",
      amharicName: "ኬሚስትሪ",
      icon: FlaskConical,
      iconColor: "text-amber-600",
      badgeBg: "bg-amber-50 text-amber-700 border-amber-100",
      description: "Atomic theory, chemical bonding models, thermodynamics, and solutions.",
      unitsCount: 6,
      topicsSample: "Atomic Orbitals, Thermochemistry, Solution Kinetics",
    },
    {
      id: "biology",
      name: "Biology",
      amharicName: "ሥነ-ህይወት",
      icon: Dna,
      iconColor: "text-emerald-600",
      badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-100",
      description: "Biochemical molecules, cellular respiration, photosynthesis, genetics.",
      unitsCount: 6,
      topicsSample: "Biomolecules, Cellular Respiration, Photosynthesis",
    },
  ],
  12: [
    {
      id: "physics",
      name: "Physics",
      amharicName: "ፊዚክስ",
      icon: Atom,
      iconColor: "text-blue-600",
      badgeBg: "bg-blue-50 text-blue-700 border-blue-100",
      description: "Electromagnetism, induction, wave optics, quantum physics, and relativity.",
      unitsCount: 8,
      topicsSample: "Faraday's Law, Wave Optics, Quantum Phenomena",
    },
    {
      id: "math-nat",
      name: "Mathematics",
      amharicName: "ሒሳብ",
      icon: Calculator,
      iconColor: "text-indigo-600",
      badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-100",
      description: "Calculus: limits, differential calculus, applications, and definite integrals.",
      unitsCount: 6,
      topicsSample: "Derivatives, Integrals, Applications of Calculus",
    },
    {
      id: "chemistry",
      name: "Chemistry",
      amharicName: "ኬሚስትሪ",
      icon: FlaskConical,
      iconColor: "text-amber-600",
      badgeBg: "bg-amber-50 text-amber-700 border-amber-100",
      description: "Acid-base equilibria, electrochemistry, metallurgy, and industrial polymers.",
      unitsCount: 6,
      topicsSample: "Acid-Base Equilibria, Galvanic Cells, Polymers",
    },
    {
      id: "biology",
      name: "Biology",
      amharicName: "ሥነ-ህይወት",
      icon: Dna,
      iconColor: "text-emerald-600",
      badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-100",
      description: "Evolutionary biology, behavioral ecology, biotechnology, and applications.",
      unitsCount: 5,
      topicsSample: "Molecular Genetics, Biotechnology, Evolution",
    },
  ],
};

const SOCIAL_SUBJECTS_BY_GRADE: Record<GradeLevel, SubjectCardItem[]> = {
  9: [
    {
      id: "math-soc",
      name: "Mathematics (Social)",
      amharicName: "ሒሳብ (ማህበራዊ)",
      icon: Calculator,
      iconColor: "text-indigo-600",
      badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-100",
      description: "Real numbers, algebraic equations, and data handling fundamentals.",
      unitsCount: 6,
      topicsSample: "Algebraic Equations, Linear Inequalities, Basic Statistics",
    },
    {
      id: "history",
      name: "History",
      amharicName: "ታሪክ",
      icon: Landmark,
      iconColor: "text-rose-600",
      badgeBg: "bg-rose-50 text-rose-700 border-rose-100",
      description: "Ancient civilizations, early Ethiopian states, trade routes, kingdoms.",
      unitsCount: 6,
      topicsSample: "Ancient Civilizations, Early Ethiopian States, Medieval Horn",
    },
    {
      id: "geography",
      name: "Geography",
      amharicName: "ጂኦግራፊ",
      icon: Globe,
      iconColor: "text-teal-600",
      badgeBg: "bg-teal-50 text-teal-700 border-teal-100",
      description: "Map reading, earth systems, climate, and African natural resources.",
      unitsCount: 5,
      topicsSample: "Map Reading, Earth Systems, Climate Fundamentals",
    },
    {
      id: "economics",
      name: "Economics",
      amharicName: "ኢኮኖሚክስ",
      icon: TrendingUp,
      iconColor: "text-purple-600",
      badgeBg: "bg-purple-50 text-purple-700 border-purple-100",
      description: "Foundations of economics, scarcity, opportunity cost, and systems.",
      unitsCount: 5,
      topicsSample: "Scarcity & Choice, Economic Systems, Production",
    },
  ],
  10: [
    {
      id: "math-soc",
      name: "Mathematics (Social)",
      amharicName: "ሒሳብ (ማህበራዊ)",
      icon: Calculator,
      iconColor: "text-indigo-600",
      badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-100",
      description: "Polynomials, commercial mathematics, and basic financial algebra.",
      unitsCount: 6,
      topicsSample: "Polynomials, Commercial Math, Descriptive Statistics",
    },
    {
      id: "history",
      name: "History",
      amharicName: "ታሪክ",
      icon: Landmark,
      iconColor: "text-rose-600",
      badgeBg: "bg-rose-50 text-rose-700 border-rose-100",
      description: "Modern history, anti-colonial resistance, Battle of Adwa, state formation.",
      unitsCount: 6,
      topicsSample: "Battle of Adwa, 19th Century State Formation, Colonialism",
    },
    {
      id: "geography",
      name: "Geography",
      amharicName: "ጂኦግራፊ",
      icon: Globe,
      iconColor: "text-teal-600",
      badgeBg: "bg-teal-50 text-teal-700 border-teal-100",
      description: "Economic geography, agricultural patterns, urbanization, trade.",
      unitsCount: 5,
      topicsSample: "Agriculture, Urban Settlement, International Trade",
    },
    {
      id: "economics",
      name: "Economics",
      amharicName: "ኢኮኖሚክስ",
      icon: TrendingUp,
      iconColor: "text-purple-600",
      badgeBg: "bg-purple-50 text-purple-700 border-purple-100",
      description: "Supply and demand, market equilibrium, consumer behavior.",
      unitsCount: 5,
      topicsSample: "Supply & Demand, Market Equilibrium, Price Elasticity",
    },
  ],
  11: [
    {
      id: "math-soc",
      name: "Mathematics (Social)",
      amharicName: "ሒሳብ (ማህበራዊ)",
      icon: Calculator,
      iconColor: "text-indigo-600",
      badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-100",
      description: "Matrices, business linear programming, statistics, and probability.",
      unitsCount: 6,
      topicsSample: "Matrices, Linear Programming, Probability",
    },
    {
      id: "history",
      name: "History",
      amharicName: "ታሪክ",
      icon: Landmark,
      iconColor: "text-rose-600",
      badgeBg: "bg-rose-50 text-rose-700 border-rose-100",
      description: "Ethiopia and the Horn, imperial consolidation, regional diplomacy.",
      unitsCount: 6,
      topicsSample: "Imperial Consolidation, Regional Diplomacy, World Wars",
    },
    {
      id: "geography",
      name: "Geography",
      amharicName: "ጂኦግራፊ",
      icon: Globe,
      iconColor: "text-teal-600",
      badgeBg: "bg-teal-50 text-teal-700 border-teal-100",
      description: "Physical geography of Ethiopia, relief, hydrology, and ecosystems.",
      unitsCount: 6,
      topicsSample: "Ethiopian Relief & Topography, Drainage & Rivers, Soils",
    },
    {
      id: "economics",
      name: "Economics",
      amharicName: "ኢኮኖሚክስ",
      icon: TrendingUp,
      iconColor: "text-purple-600",
      badgeBg: "bg-purple-50 text-purple-700 border-purple-100",
      description: "National income accounting, inflation, unemployment, fiscal policies.",
      unitsCount: 6,
      topicsSample: "GDP Accounting, Inflation & Unemployment, Fiscal Policy",
    },
  ],
  12: [
    {
      id: "math-soc",
      name: "Mathematics (Social)",
      amharicName: "ሒሳብ (ማህበራዊ)",
      icon: Calculator,
      iconColor: "text-indigo-600",
      badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-100",
      description: "Applied functions, limits, derivatives in economics, regression.",
      unitsCount: 5,
      topicsSample: "Business Calculus, Marginal Analysis, Regression",
    },
    {
      id: "history",
      name: "History",
      amharicName: "ታሪክ",
      icon: Landmark,
      iconColor: "text-rose-600",
      badgeBg: "bg-rose-50 text-rose-700 border-rose-100",
      description: "20th-century Ethiopia, 1974 revolution, global ideological conflicts.",
      unitsCount: 6,
      topicsSample: "1974 Ethiopian Revolution, Cold War in Africa, Contemporary",
    },
    {
      id: "geography",
      name: "Geography",
      amharicName: "ጂኦግራፊ",
      icon: Globe,
      iconColor: "text-teal-600",
      badgeBg: "bg-teal-50 text-teal-700 border-teal-100",
      description: "Population geography, hazard management, environmental sustainability.",
      unitsCount: 6,
      topicsSample: "Demographics, Natural Hazards, Resource Management",
    },
    {
      id: "economics",
      name: "Economics",
      amharicName: "ኢኮኖሚክስ",
      icon: TrendingUp,
      iconColor: "text-purple-600",
      badgeBg: "bg-purple-50 text-purple-700 border-purple-100",
      description: "Ethiopian economic development, international trade, globalization.",
      unitsCount: 6,
      topicsSample: "Ethiopian Development Strategy, Balance of Payments, Forex",
    },
  ],
};

// --- Subject Doodles (Crisp, Playful Educational Vector Art) ---

function PhysicsDoodle() {
  return (
    <svg viewBox="0 0 200 130" className="w-full h-28 sm:h-32 text-blue-500 fill-none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {/* Central atom with orbiting electrons */}
      <g className="origin-center transition-transform duration-700 group-hover:rotate-12">
        <circle cx="100" cy="65" r="7" className="fill-blue-600 stroke-blue-700" />
        <ellipse cx="100" cy="65" rx="52" ry="18" transform="rotate(-30 100 65)" strokeDasharray="4 3" opacity="0.75" />
        <circle cx="138" cy="46" r="3.5" className="fill-blue-500" />
        <ellipse cx="100" cy="65" rx="52" ry="18" transform="rotate(30 100 65)" opacity="0.75" />
        <circle cx="62" cy="84" r="3.5" className="fill-blue-500" />
        <ellipse cx="100" cy="65" rx="52" ry="18" transform="rotate(90 100 65)" strokeDasharray="5 3" opacity="0.6" />
        <circle cx="100" cy="13" r="3.5" className="fill-blue-500" />
      </g>

      {/* Horseshoe Magnet doodle on top-left */}
      <path d="M 28 32 C 28 20, 44 20, 44 32 L 44 46 L 39 46 L 39 32 C 39 26, 33 26, 33 32 L 33 46 L 28 46 Z" className="fill-blue-100/60" opacity="0.85" />
      <line x1="28" y1="40" x2="33" y2="40" opacity="0.6" />
      <line x1="39" y1="40" x2="44" y2="40" opacity="0.6" />
      <path d="M 26 48 C 24 58, 48 58, 46 48" strokeDasharray="2 2" opacity="0.4" />

      {/* Sine wave doodle at bottom */}
      <path d="M 20 112 Q 40 96, 60 112 T 100 112 T 140 112 T 180 112" strokeWidth="2" opacity="0.5" />

      {/* Prism with light dispersion on top-right */}
      <polygon points="160,28 178,56 142,56" className="fill-blue-50" opacity="0.75" />
      <line x1="126" y1="46" x2="152" y2="44" strokeWidth="1.5" opacity="0.6" />
      <line x1="168" y1="44" x2="190" y2="38" strokeWidth="1.5" className="text-indigo-500" />
      <line x1="169" y1="46" x2="190" y2="46" strokeWidth="1.5" className="text-cyan-500" />
      <line x1="168" y1="48" x2="190" y2="54" strokeWidth="1.5" className="text-blue-600" />

      {/* Floating physics formula & doodle symbols */}
      <text x="56" y="36" fontSize="11" fontFamily="monospace" fontStyle="italic" fontWeight="bold" className="fill-blue-700 stroke-none opacity-70">
        E=mc²
      </text>
      <text x="145" y="98" fontSize="10" fontFamily="monospace" fontStyle="italic" className="fill-blue-600 stroke-none opacity-60">
        F=ma
      </text>

      {/* Sparkles */}
      <path d="M 22 75 L 24 79 L 28 80 L 24 81 L 22 85 L 20 81 L 16 80 L 20 79 Z" className="fill-blue-400/40" />
      <circle cx="178" cy="80" r="1.5" className="fill-blue-400" />
    </svg>
  );
}

function MathDoodle() {
  return (
    <svg viewBox="0 0 200 130" className="w-full h-28 sm:h-32 text-indigo-500 fill-none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {/* Coordinate axes */}
      <line x1="30" y1="105" x2="170" y2="105" opacity="0.4" />
      <line x1="164" y1="101" x2="170" y2="105" opacity="0.4" />
      <line x1="164" y1="109" x2="170" y2="105" opacity="0.4" />
      <line x1="55" y1="118" x2="55" y2="20" opacity="0.4" />
      <line x1="51" y1="26" x2="55" y2="20" opacity="0.4" />
      <line x1="59" y1="26" x2="55" y2="20" opacity="0.4" />

      {/* Smooth continuous curve / Parabola */}
      <path d="M 42 98 Q 78 106, 105 68 T 160 30" strokeWidth="2.5" className="text-indigo-600" />

      {/* Integral sign doodle */}
      <path d="M 85 28 C 80 28, 74 32, 74 38 L 74 82 C 74 88, 68 92, 63 92" strokeWidth="2.2" opacity="0.85" className="text-indigo-700" />
      <text x="82" y="32" fontSize="9" fontWeight="bold" className="fill-indigo-600 stroke-none">b</text>
      <text x="56" y="98" fontSize="9" fontWeight="bold" className="fill-indigo-600 stroke-none">a</text>

      {/* Geometry Right Triangle with hypotenuse */}
      <polygon points="125,105 168,105 168,58" className="fill-indigo-50/70" opacity="0.75" strokeDasharray="3 2" />
      <polyline points="160,105 160,97 168,97" opacity="0.5" />
      <text x="142" y="76" fontSize="10" fontStyle="italic" className="fill-indigo-600 stroke-none opacity-80">c</text>

      {/* Pi symbol */}
      <path d="M 24 45 L 42 45 M 29 45 L 29 64 M 37 45 C 37 58, 39 64, 43 63" strokeWidth="2" opacity="0.8" />

      {/* Summation Sigma */}
      <polyline points="158,22 138,22 147,33 138,44 158,44" strokeWidth="2" opacity="0.8" />

      {/* Square root formula doodle */}
      <path d="M 102 38 L 106 43 L 112 28 L 126 28" strokeWidth="1.8" opacity="0.8" />
      <text x="115" y="38" fontSize="10" fontStyle="italic" className="fill-indigo-600 stroke-none">x</text>

      {/* Infinity symbol */}
      <path d="M 22 88 C 22 83, 28 83, 31 88 C 34 93, 40 93, 40 88 C 40 83, 34 83, 31 88 C 28 93, 22 93, 22 88 Z" strokeWidth="1.8" opacity="0.6" />

      {/* Floating math operators */}
      <text x="96" y="100" fontSize="12" fontWeight="bold" className="fill-indigo-400 stroke-none opacity-60">+</text>
      <text x="118" y="118" fontSize="12" fontWeight="bold" className="fill-indigo-400 stroke-none opacity-60">×</text>
    </svg>
  );
}

function ChemistryDoodle() {
  return (
    <svg viewBox="0 0 200 130" className="w-full h-28 sm:h-32 text-amber-500 fill-none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {/* Central Erlenmeyer Flask */}
      <g className="origin-bottom transition-transform duration-500 group-hover:scale-105">
        <path d="M 88 30 L 112 30 M 94 30 L 94 52 L 68 104 C 64 112, 70 120, 80 120 L 120 120 C 130 120, 136 112, 132 104 L 106 52 L 106 30" strokeWidth="2.2" className="text-amber-600" />
        <path d="M 75 96 Q 88 90, 100 96 T 125 96" strokeWidth="1.8" className="text-amber-500" />
        <path d="M 75 96 Q 88 90, 100 96 T 125 96 L 120 120 L 80 120 Z" className="fill-amber-400/25 stroke-none" />
        <circle cx="92" cy="84" r="3" className="fill-amber-400" />
        <circle cx="108" cy="78" r="2.5" className="fill-amber-400" />
        <circle cx="98" cy="64" r="3.5" className="fill-amber-400" />
        <circle cx="104" cy="46" r="2" opacity="0.7" />
        <circle cx="98" cy="20" r="2.5" opacity="0.5" />
      </g>

      {/* Benzene Ring Doodle on Left */}
      <g className="opacity-80">
        <polygon points="34,44 50,34 66,44 66,62 50,72 34,62" strokeWidth="2" className="fill-amber-50/60" />
        <circle cx="50" cy="53" r="9" strokeDasharray="3 2" opacity="0.6" />
        <line x1="50" y1="34" x2="50" y2="22" strokeWidth="1.8" />
        <text x="44" y="18" fontSize="10" fontWeight="bold" className="fill-amber-700 stroke-none">OH</text>
      </g>

      {/* Test Tube on Right */}
      <g className="opacity-80">
        <path d="M 152 35 L 166 35 M 155 35 L 155 85 C 155 92, 163 92, 163 85 L 163 35" strokeWidth="2" />
        <path d="M 155 64 Q 159 60, 163 64" strokeWidth="1.5" />
        <path d="M 155 64 Q 159 60, 163 64 L 163 85 C 163 92, 155 92, 155 85 Z" className="fill-amber-400/25 stroke-none" />
        <circle cx="159" cy="52" r="2" opacity="0.7" />
      </g>

      {/* Molecular bonds */}
      <circle cx="28" cy="104" r="5" className="fill-amber-400/40 text-amber-600" />
      <line x1="33" y1="104" x2="48" y2="104" strokeWidth="1.8" opacity="0.6" />
      <circle cx="53" cy="104" r="5" className="fill-amber-400/40 text-amber-600" />

      {/* Chemical Formula text doodle */}
      <text x="140" y="116" fontSize="11" fontFamily="monospace" fontWeight="bold" className="fill-amber-700 stroke-none opacity-70">
        H₂O
      </text>

      {/* Sparkles */}
      <path d="M 22 28 L 24 32 L 28 33 L 24 34 L 22 38 L 20 34 L 16 33 L 20 32 Z" className="fill-amber-400/40" />
    </svg>
  );
}

function BiologyDoodle() {
  return (
    <svg viewBox="0 0 200 130" className="w-full h-28 sm:h-32 text-emerald-500 fill-none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {/* DNA Double Helix on Left */}
      <g className="opacity-85">
        <path d="M 52 18 Q 32 42, 52 66 T 52 114" strokeWidth="2.2" className="text-emerald-600" />
        <path d="M 32 18 Q 52 42, 32 66 T 32 114" strokeWidth="2.2" className="text-emerald-500" />
        <line x1="37" y1="28" x2="47" y2="30" strokeWidth="1.5" opacity="0.7" />
        <line x1="32" y1="42" x2="52" y2="42" strokeWidth="1.5" opacity="0.7" />
        <line x1="37" y1="56" x2="47" y2="54" strokeWidth="1.5" opacity="0.7" />
        <line x1="33" y1="92" x2="51" y2="92" strokeWidth="1.5" opacity="0.7" />
        <line x1="37" y1="106" x2="47" y2="104" strokeWidth="1.5" opacity="0.7" />
      </g>

      {/* Central Botanical Leaf */}
      <g className="origin-bottom transition-transform duration-500 group-hover:rotate-6">
        <path d="M 95 116 C 95 116, 76 80, 102 44 C 126 80, 95 116, 95 116" strokeWidth="2.2" className="fill-emerald-400/20 text-emerald-600" />
        <path d="M 95 116 Q 98 84, 102 44" strokeWidth="1.8" opacity="0.7" />
        <path d="M 97 96 Q 106 92, 109 86" strokeWidth="1.4" opacity="0.6" />
        <path d="M 96 82 Q 90 78, 86 74" strokeWidth="1.4" opacity="0.6" />
        <path d="M 99 72 Q 107 68, 110 62" strokeWidth="1.4" opacity="0.6" />
      </g>

      {/* Microscope on Right */}
      <g className="opacity-80">
        <path d="M 148 116 L 178 116 M 163 116 L 163 85 C 163 72, 172 65, 172 52" strokeWidth="2" />
        <rect x="146" y="46" width="18" height="34" rx="4" transform="rotate(-30 155 63)" strokeWidth="2" className="fill-emerald-50" />
        <line x1="140" y1="92" x2="168" y2="92" strokeWidth="2.5" />
      </g>

      {/* Cell with nucleus on top center */}
      <ellipse cx="78" cy="35" rx="12" ry="9" opacity="0.6" strokeDasharray="3 2" />
      <circle cx="78" cy="35" r="4" className="fill-emerald-500" />

      {/* Sparkles */}
      <path d="M 132 26 L 134 30 L 138 31 L 134 32 L 132 36 L 130 32 L 126 31 L 130 30 Z" className="fill-emerald-400/40" />
    </svg>
  );
}

function HistoryDoodle() {
  return (
    <svg viewBox="0 0 200 130" className="w-full h-28 sm:h-32 text-rose-500 fill-none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {/* Obelisk / Monument (Axum stele) */}
      <g className="opacity-85">
        <path d="M 40 118 L 44 32 Q 49 20, 54 32 L 58 118 Z" strokeWidth="2.2" className="fill-rose-400/15 text-rose-600" />
        <line x1="36" y1="118" x2="62" y2="118" strokeWidth="3" />
        <line x1="45" y1="46" x2="53" y2="46" opacity="0.6" />
        <line x1="44" y1="62" x2="54" y2="62" opacity="0.6" />
        <line x1="43" y1="80" x2="55" y2="80" opacity="0.6" />
        <line x1="42" y1="98" x2="56" y2="98" opacity="0.6" />
      </g>

      {/* Ancient Scroll / Manuscript with Quill in Center */}
      <g className="origin-center transition-transform duration-500 group-hover:scale-105">
        <path d="M 85 45 C 78 45, 78 54, 85 54 L 135 54 C 142 54, 142 45, 135 45 Z" strokeWidth="1.8" className="fill-rose-50" />
        <path d="M 85 54 L 85 102 C 85 110, 94 110, 94 102 L 94 54" strokeWidth="1.8" />
        <path d="M 135 54 L 135 98 C 135 106, 126 106, 126 98 L 126 54" strokeWidth="1.8" />
        <line x1="97" y1="65" x2="123" y2="65" opacity="0.5" strokeDasharray="3 2" />
        <line x1="97" y1="76" x2="123" y2="76" opacity="0.5" strokeDasharray="3 2" />
        <line x1="97" y1="87" x2="116" y2="87" opacity="0.5" strokeDasharray="3 2" />
      </g>

      {/* Quill Feather */}
      <path d="M 148 24 Q 164 48, 134 82" strokeWidth="2.2" className="text-rose-600" />
      <path d="M 148 24 Q 168 36, 152 52" strokeWidth="1.6" opacity="0.6" />

      {/* Historical year badge doodle */}
      <text x="76" y="32" fontSize="12" fontFamily="serif" fontWeight="bold" className="fill-rose-700 stroke-none opacity-80">
        1896 Adwa
      </text>

      {/* Sparkles */}
      <path d="M 24 65 L 26 69 L 30 70 L 26 71 L 24 75 L 22 71 L 18 70 L 22 69 Z" className="fill-rose-400/40" />
    </svg>
  );
}

function GeographyDoodle() {
  return (
    <svg viewBox="0 0 200 130" className="w-full h-28 sm:h-32 text-teal-500 fill-none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {/* Globe with parallels and meridians on Left */}
      <g className="origin-center transition-transform duration-700 group-hover:rotate-12">
        <circle cx="60" cy="65" r="38" strokeWidth="2.2" className="fill-teal-400/15 text-teal-600" />
        <ellipse cx="60" cy="65" rx="38" ry="13" opacity="0.7" />
        <ellipse cx="60" cy="45" rx="32" ry="9" strokeDasharray="3 2" opacity="0.4" />
        <ellipse cx="60" cy="85" rx="32" ry="9" strokeDasharray="3 2" opacity="0.4" />
        <ellipse cx="60" cy="65" rx="16" ry="38" opacity="0.7" />
      </g>

      {/* Mountain Peaks with Sun in Center/Right */}
      <g className="opacity-85">
        <polygon points="106,112 134,58 162,112" strokeWidth="2.2" className="fill-teal-400/25 text-teal-600" />
        <polygon points="138,112 160,72 182,112" strokeWidth="2" opacity="0.8" />
        <polyline points="125,76 134,81 143,76" opacity="0.7" />
        <circle cx="166" cy="42" r="9" className="fill-amber-400/40 text-amber-500" strokeWidth="1.8" />
      </g>

      {/* Compass Rose doodle */}
      <g className="opacity-80">
        <path d="M 112 36 L 115 24 L 118 36 L 129 38 L 118 41 L 115 52 L 112 41 L 102 38 Z" className="fill-teal-500 text-teal-600" />
        <text x="113" y="19" fontSize="9" fontWeight="bold" className="fill-teal-800 stroke-none">N</text>
      </g>
    </svg>
  );
}

function EconomicsDoodle() {
  return (
    <svg viewBox="0 0 200 130" className="w-full h-28 sm:h-32 text-purple-500 fill-none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {/* Coordinate axes */}
      <line x1="28" y1="112" x2="168" y2="112" opacity="0.4" />
      <line x1="40" y1="120" x2="40" y2="22" opacity="0.4" />

      {/* Bar Chart Bars */}
      <rect x="56" y="80" width="14" height="32" rx="3" className="fill-purple-200/50" opacity="0.7" />
      <rect x="80" y="62" width="14" height="50" rx="3" className="fill-purple-200/60" opacity="0.8" />
      <rect x="104" y="50" width="14" height="62" rx="3" className="fill-purple-300/60" opacity="0.85" />
      <rect x="128" y="32" width="14" height="80" rx="3" className="fill-purple-400/50 text-purple-600" />

      {/* Upward Growth Trend line with arrow */}
      <path d="M 44 98 L 74 74 L 98 84 L 148 34" strokeWidth="2.8" className="text-purple-600" />
      <polyline points="136,34 148,34 148,46" strokeWidth="2.8" className="text-purple-600" />

      {/* Coin stack / currency on Right */}
      <g className="opacity-80">
        <ellipse cx="172" cy="104" rx="13" ry="5" className="fill-purple-300/40" />
        <ellipse cx="172" cy="97" rx="13" ry="5" className="fill-purple-300/50" />
        <ellipse cx="172" cy="90" rx="13" ry="5" className="fill-purple-400/50" />
        <ellipse cx="172" cy="83" rx="13" ry="5" className="fill-purple-400/60" />
      </g>

      <text x="22" y="44" fontSize="14" fontWeight="bold" opacity="0.6" className="fill-purple-600 stroke-none">%</text>
      <text x="164" y="40" fontSize="13" fontWeight="bold" opacity="0.7" className="fill-purple-700 stroke-none">ETB</text>
    </svg>
  );
}

function SubjectDoodle({ subjectId }: { subjectId: string }) {
  switch (subjectId) {
    case "physics":
      return <PhysicsDoodle />;
    case "math-nat":
    case "math-soc":
      return <MathDoodle />;
    case "chemistry":
      return <ChemistryDoodle />;
    case "biology":
      return <BiologyDoodle />;
    case "history":
      return <HistoryDoodle />;
    case "geography":
      return <GeographyDoodle />;
    case "economics":
      return <EconomicsDoodle />;
    default:
      return <PhysicsDoodle />;
  }
}

function getSubjectTheme(id: string) {
  switch (id) {
    case "physics":
      return {
        cardBg: "bg-gradient-to-b from-blue-50/70 via-white to-blue-50/20 hover:from-blue-50 hover:to-blue-100/30",
        border: "border-blue-200/80 hover:border-blue-400",
        titleHover: "group-hover:text-blue-600",
        pill: "bg-blue-100/80 text-blue-700 border border-blue-200/60",
      };
    case "math-nat":
    case "math-soc":
      return {
        cardBg: "bg-gradient-to-b from-indigo-50/70 via-white to-indigo-50/20 hover:from-indigo-50 hover:to-indigo-100/30",
        border: "border-indigo-200/80 hover:border-indigo-400",
        titleHover: "group-hover:text-indigo-600",
        pill: "bg-indigo-100/80 text-indigo-700 border border-indigo-200/60",
      };
    case "chemistry":
      return {
        cardBg: "bg-gradient-to-b from-amber-50/70 via-white to-amber-50/20 hover:from-amber-50 hover:to-amber-100/30",
        border: "border-amber-200/80 hover:border-amber-400",
        titleHover: "group-hover:text-amber-600",
        pill: "bg-amber-100/80 text-amber-700 border border-amber-200/60",
      };
    case "biology":
      return {
        cardBg: "bg-gradient-to-b from-emerald-50/70 via-white to-emerald-50/20 hover:from-emerald-50 hover:to-emerald-100/30",
        border: "border-emerald-200/80 hover:border-emerald-400",
        titleHover: "group-hover:text-emerald-600",
        pill: "bg-emerald-100/80 text-emerald-700 border border-emerald-200/60",
      };
    case "history":
      return {
        cardBg: "bg-gradient-to-b from-rose-50/70 via-white to-rose-50/20 hover:from-rose-50 hover:to-rose-100/30",
        border: "border-rose-200/80 hover:border-rose-400",
        titleHover: "group-hover:text-rose-600",
        pill: "bg-rose-100/80 text-rose-700 border border-rose-200/60",
      };
    case "geography":
      return {
        cardBg: "bg-gradient-to-b from-teal-50/70 via-white to-teal-50/20 hover:from-teal-50 hover:to-teal-100/30",
        border: "border-teal-200/80 hover:border-teal-400",
        titleHover: "group-hover:text-teal-600",
        pill: "bg-teal-100/80 text-teal-700 border border-teal-200/60",
      };
    case "economics":
      return {
        cardBg: "bg-gradient-to-b from-purple-50/70 via-white to-purple-50/20 hover:from-purple-50 hover:to-purple-100/30",
        border: "border-purple-200/80 hover:border-purple-400",
        titleHover: "group-hover:text-purple-600",
        pill: "bg-purple-100/80 text-purple-700 border border-purple-200/60",
      };
    default:
      return {
        cardBg: "bg-white hover:bg-neutral-50",
        border: "border-neutral-200 hover:border-neutral-300",
        titleHover: "group-hover:text-neutral-900",
        pill: "bg-neutral-100 text-neutral-700 border border-neutral-200",
      };
  }
}

// Helper to generate dynamic weekly activity from local exam history
function getDynamicWeeklyActivity(history: import("@/types/exam").MockExamAttempt[]) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const activityMap = new Map<string, number>();
  
  // Initialize with 0s
  days.forEach(d => activityMap.set(d, 0));

  // Get current week dates
  const today = new Date();
  
  history.forEach(attempt => {
    if (!attempt.startedAt) return;
    const date = new Date(attempt.startedAt);
    // Simple mock logic: if the attempt was in the last 7 days, add it to the respective day bucket
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) {
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      const answered = Object.keys(attempt.answers || {}).length;
      if (activityMap.has(dayName)) {
        activityMap.set(dayName, (activityMap.get(dayName) || 0) + answered);
      }
    }
  });

  const weeklyActivity = days.map(day => ({
    day,
    questions: activityMap.get(day) || 0,
    isPeak: false,
  }));
  
  // Identify peak
  let max = 0;
  let peakIndex = -1;
  weeklyActivity.forEach((item, index) => {
    if (item.questions > max) {
      max = item.questions;
      peakIndex = index;
    }
  });
  
  if (peakIndex >= 0 && max > 0) {
    weeklyActivity[peakIndex].isPeak = true;
  }

  // If entirely empty (new user), fall back to some seed data to make the dashboard look good
  if (max === 0) {
    return days.map(d => ({ day: d, questions: 0, isPeak: false }));
  }

  return weeklyActivity;
}

export default function DashboardClient({
  initialProfile,
  isAuthenticated,
}: DashboardClientProps) {
  const [weeklyActivity, setWeeklyActivity] = useState<Array<{ day: string; questions: number; isPeak: boolean }>>([]);

  useEffect(() => {
    // Dynamically calculate from real local storage history
    import("@/lib/mockExamData").then((m) => {
      const history = m.getExamHistory();
      setWeeklyActivity(getDynamicWeeklyActivity(history));
    });
  }, []);
  const [profile, setProfile] = useState<UserProfile>(
    initialProfile || DEFAULT_PROFILE
  );
  const [activeStream, setActiveStream] = useState<ExamStream>(
    initialProfile?.stream || "natural"
  );
  const [activeGrade, setActiveGrade] = useState<GradeLevel>(
    (initialProfile?.grade as GradeLevel) || 12
  );
  const [activityTimeframe, setActivityTimeframe] = useState<"day" | "week" | "month">("week");
  const countdown = getExamCountdown();

  useEffect(() => {
    if (!initialProfile) {
      const local = getUserProfile();
      setProfile(local);
      setActiveStream(local.stream);
      if (local.grade) setActiveGrade(local.grade as GradeLevel);
    }
  }, [initialProfile]);

  const handleStreamChange = async (newStream: ExamStream) => {
    setActiveStream(newStream);
    const updated = saveUserProfile({ stream: newStream });
    setProfile(updated);

    if (isAuthenticated && isSupabaseConfigured()) {
      try {
        const supabase = createBrowserSupabaseClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from("profiles")
            .update({ stream: newStream, updated_at: new Date().toISOString() })
            .eq("id", user.id);
        }
      } catch (err) {
        console.warn("Could not sync stream preference to Supabase:", err);
      }
    }
  };

  const handleGradeChange = async (newGrade: GradeLevel) => {
    setActiveGrade(newGrade);
    const updated = saveUserProfile({ grade: newGrade });
    setProfile(updated);

    if (isAuthenticated && isSupabaseConfigured()) {
      try {
        const supabase = createBrowserSupabaseClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from("profiles")
            .update({ grade: newGrade, updated_at: new Date().toISOString() })
            .eq("id", user.id);
        }
      } catch (err) {
        console.warn("Could not sync grade preference to Supabase:", err);
      }
    }
  };

  // Active subjects for current stream and grade
  const currentSubjects = useMemo(() => {
    const list =
      activeStream === "natural"
        ? NATURAL_SUBJECTS_BY_GRADE[activeGrade]
        : SOCIAL_SUBJECTS_BY_GRADE[activeGrade];
    return list || NATURAL_SUBJECTS_BY_GRADE[12];
  }, [activeStream, activeGrade]);

  const firstName = profile.name?.trim()
    ? profile.name.trim().split(" ")[0]
    : "Student";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-in fade-in-50 duration-300">
      {/* Top Context Anchor & Stream Bar */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
            Welcome back, {firstName}
          </h1>
          <p className="text-xs text-neutral-400 font-medium mt-1">
            Grade {activeGrade} • {activeStream === "natural" ? "Natural Science" : "Social Science"} Track
          </p>
        </div>

        {/* Grade & Stream Selectors */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {/* Grade Selector Switcher */}
          <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200/80">
            {([9, 10, 11, 12] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => handleGradeChange(g)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeGrade === g
                    ? "bg-neutral-950 text-white shadow-2xs"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
                title={g === 12 ? "Grade 12: National Matric Revision (All 4 Years)" : `Grade ${g} Syllabus`}
              >
                Gr. {g} {g === 12 ? "(Matric)" : ""}
              </button>
            ))}
          </div>

          {/* Stream Selector Pill */}
          <button
            type="button"
            onClick={() =>
              handleStreamChange(activeStream === "natural" ? "social" : "natural")
            }
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200/80 bg-white hover:bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-neutral-800 shadow-2xs transition-all cursor-pointer"
            title="Click to toggle between Natural and Social Science tracks"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>
              {activeStream === "natural" ? "Natural" : "Social"}
            </span>
            <span className="text-[10px] text-neutral-400 font-mono">⇄</span>
          </button>
        </div>
      </section>

      {/* Quick Launch Shortcuts */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/mock-exams"
          className="group flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white p-3.5 hover:border-neutral-900 hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 group-hover:bg-neutral-950 group-hover:text-white transition-colors">
            <Clock className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-neutral-900 block truncate">Mock Exams</span>
            <span className="text-[11px] text-neutral-500 block truncate">Timed entrance papers</span>
          </div>
        </Link>

        <Link
          href="/bank"
          className="group flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white p-3.5 hover:border-neutral-900 hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 group-hover:bg-neutral-950 group-hover:text-white transition-colors">
            <Layers className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-neutral-900 block truncate">Question Bank</span>
            <span className="text-[11px] text-neutral-500 block truncate">Chapter-by-chapter</span>
          </div>
        </Link>

        <Link
          href="/study-plan"
          className="group flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white p-3.5 hover:border-neutral-900 hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 group-hover:bg-neutral-950 group-hover:text-white transition-colors">
            <BookOpen className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-neutral-900 block truncate">Formula Sheets</span>
            <span className="text-[11px] text-neutral-500 block truncate">High-yield revision</span>
          </div>
        </Link>

        <Link
          href="/practice"
          className="group flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white p-3.5 hover:border-neutral-900 hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 group-hover:bg-neutral-950 group-hover:text-white transition-colors">
            <Target className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-neutral-900 block truncate">Diagnostic Test</span>
            <span className="text-[11px] text-neutral-500 block truncate">Pinpoint weak spots</span>
          </div>
        </Link>
      </section>

      {/* 2. Subjects Grid */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-950">
              {activeGrade === 12 ? "Matric Subjects" : `Grade ${activeGrade} Subjects`}
            </h2>
          </div>

          <Link
            href={`/learn?grade=${activeGrade}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors self-start sm:self-auto"
          >
            <span>Explore All Gr. {activeGrade} Lessons</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 4 Subject Cards Grid (Minimal: Name + Doodles + Clickable) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {currentSubjects.map((subj) => {
            const theme = getSubjectTheme(subj.id);

            return (
              <Link
                key={subj.id}
                href={`/learn?subject=${subj.id}&grade=${activeGrade}`}
                className={`group relative overflow-hidden rounded-3xl border ${theme.border} ${theme.cardBg} p-5 sm:p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer min-h-[250px]`}
              >
                {/* Top: Subject Name & Amharic */}
                <div className="flex items-start justify-between gap-1.5 z-10">
                  <div className="min-w-0">
                    <h3 className={`text-lg sm:text-xl font-black tracking-tight text-neutral-950 ${theme.titleHover} transition-colors truncate`}>
                      {subj.name}
                    </h3>
                    <span className="text-xs font-semibold text-neutral-400 mt-0.5 block">
                      {subj.amharicName}
                    </span>
                  </div>

                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${theme.pill} font-mono shrink-0 shadow-2xs`}>
                    {subj.unitsCount} Units
                  </span>
                </div>

                {/* Middle: Subject Doodle Art */}
                <div className="py-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  <SubjectDoodle subjectId={subj.id} />
                </div>

                {/* Bottom: Minimal "Start Learning" bar */}
                <div className="flex items-center justify-between pt-3 border-t border-neutral-200/50 z-10">
                  <span className="text-xs font-bold text-neutral-500 group-hover:text-neutral-950 transition-colors">
                    Start Learning
                  </span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-950 text-white shadow-2xs group-hover:scale-110 transition-transform">
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Weekly Practice Activity Analytics */}
      <section className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
          <div>
            <h3 className="text-base font-bold text-neutral-950 tracking-tight">
              Weekly Practice Activity
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              {weeklyActivity.reduce((acc, curr) => acc + curr.questions, 0)} questions attempted this week
            </p>
          </div>

          {/* Day / Week / Month Toggle */}
          <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200/70 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActivityTimeframe("day")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activityTimeframe === "day"
                  ? "bg-white text-neutral-950 shadow-2xs border border-neutral-200/70"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Day
            </button>
            <button
              type="button"
              onClick={() => setActivityTimeframe("week")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activityTimeframe === "week"
                  ? "bg-white text-neutral-950 shadow-2xs border border-neutral-200/70"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Week
            </button>
            <button
              type="button"
              onClick={() => setActivityTimeframe("month")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activityTimeframe === "month"
                  ? "bg-white text-neutral-950 shadow-2xs border border-neutral-200/70"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Month
            </button>
          </div>
        </div>

        {/* Clean Bar Chart Mockup (Mon–Sun) */}
        <div className="mt-8">
          <div className="relative h-40 flex items-end justify-between gap-2 sm:gap-6 px-2 sm:px-8 pb-2 border-b border-neutral-200/80">
            {/* Horizontal guide lines */}
            <div className="absolute inset-x-0 top-0 border-b border-dashed border-neutral-100 pointer-events-none" />
            <div className="absolute inset-x-0 top-1/2 border-b border-dashed border-neutral-100 pointer-events-none" />

            {weeklyActivity.map((item) => {
              const maxVal = 50;
              const heightPercent = Math.round((item.questions / maxVal) * 100);

              return (
                <div
                  key={item.day}
                  className="group flex-1 flex flex-col items-center justify-end h-full relative"
                >
                  {/* Peak indicator pill */}
                  {item.isPeak && (
                    <div className="absolute -top-7 z-10 whitespace-nowrap rounded-full bg-[#4F46E5] px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                      {item.questions} Qs (Peak)
                    </div>
                  )}

                  {/* Bar Column */}
                  <div
                    className={`w-full max-w-[48px] rounded-t-xl transition-all duration-300 group-hover:opacity-90 ${
                      item.isPeak
                        ? "bg-[#4F46E5] shadow-xs"
                        : "bg-indigo-100 hover:bg-indigo-200"
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Day Labels Beneath Bars */}
          <div className="flex items-center justify-between gap-2 sm:gap-6 px-2 sm:px-8 pt-2.5 text-xs font-medium text-neutral-500">
            {weeklyActivity.map((item) => (
              <span
                key={item.day}
                className={`flex-1 text-center font-mono ${
                  item.isPeak ? "font-bold text-indigo-700" : ""
                }`}
              >
                {item.day}
              </span>
            ))}
          </div>
        </div>

        {/* Target pace banner */}
        <div className="mt-6 pt-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-neutral-500">
          <span className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span>Target daily pace: 25 questions / day to complete 100% syllabus.</span>
          </span>
          <Link
            href="/practice"
            className="font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Practice Today&apos;s Quota</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </section>
    </div>
  );
}
