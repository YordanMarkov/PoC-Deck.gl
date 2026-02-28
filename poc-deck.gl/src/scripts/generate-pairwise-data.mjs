// scripts/generate-pairwise-data.mjs
// Node 18+ recommended
// Usage examples:
//   node scripts/generate-pairwise-data.mjs --count 10000 --out public/pairwise-data.json
//   node scripts/generate-pairwise-data.mjs --count 100000 --clusters 10 --seed 42 --out public/pairwise-data.json

import fs from "node:fs";
import path from "node:path";

// --------------------- CLI args ---------------------
const args = process.argv.slice(2);
function getArg(name, def) {
  const idx = args.indexOf(`--${name}`);
  if (idx === -1) return def;
  const val = args[idx + 1];
  if (!val || val.startsWith("--")) return true;
  return val;
}

const COUNT = parseInt(getArg("count", "10000"), 10);
const CLUSTERS = parseInt(getArg("clusters", "8"), 10);
const SEED = parseInt(getArg("seed", "7"), 10);
const OUT = String(getArg("out", "public/pairwise-data.json"));

fs.mkdirSync(path.dirname(OUT), { recursive: true });

// --------------------- Deterministic RNG ---------------------
function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(SEED);
const r01 = () => rand();
const rInt = (min, max) => Math.floor(r01() * (max - min + 1)) + min;
const pick = (arr) => arr[rInt(0, arr.length - 1)];
const sample = (arr, k) => {
  const copy = arr.slice();
  const out = [];
  for (let i = 0; i < k && copy.length; i++) {
    const idx = rInt(0, copy.length - 1);
    out.push(copy[idx]);
    copy.splice(idx, 1);
  }
  return out;
};
const clamp01 = (x) => Math.max(0, Math.min(1, x));

// Normal-ish noise via Box-Muller
function randNorm(mean = 0, std = 1) {
  let u = 0, v = 0;
  while (u === 0) u = r01();
  while (v === 0) v = r01();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + z * std;
}

// --------------------- Pairwise-ish query profile ---------------------
const queryProfile = {
  id: "q1",
  name: "ICP: Dutch mid-size B2B SaaS / Data products",
  // “what we’re looking for” (used to compute explainable scores)
  target: {
    country: "Netherlands",
    industries: ["Technology", "Software", "SaaS", "Data/AI"],
    employeesRange: [50, 500],
    revenueMRange: [5, 60],
    keywords: ["saas", "b2b", "crm", "analytics", "data", "ai", "workflow", "platform"],
    techStack: ["React", "Node", "Postgres", "AWS", "Docker", "Kubernetes"],
  },
  criteriaWeights: {
    country: 0.20,
    industry: 0.20,
    employees: 0.15,
    revenue: 0.10,
    keywords: 0.20,
    techStack: 0.15,
  },
};

// --------------------- Synthetic “org universe” ---------------------
const COUNTRIES = [
  "Netherlands", "Belgium", "Germany", "France", "United Kingdom", "Sweden",
  "Spain", "Italy", "Denmark", "Switzerland", "Poland", "Ireland"
];

const INDUSTRIES = [
  "Technology", "Software", "SaaS", "Data/AI", "FinTech", "HealthTech", "E-commerce",
  "Manufacturing", "Logistics", "Energy", "Consulting", "Education"
];

const KEYWORDS = [
  "saas", "b2b", "crm", "analytics", "data", "ai", "workflow", "platform", "security",
  "cloud", "payments", "iot", "mobile", "devops", "compliance", "automation",
  "customer-success", "integration", "api", "marketplace"
];

const TECH = [
  "React", "Vue", "Angular", "Node", "Django", "Flask", "Spring", "Go",
  "Postgres", "MySQL", "MongoDB", "Redis", "Kafka", "RabbitMQ",
  "AWS", "GCP", "Azure", "Docker", "Kubernetes", "Terraform"
];

const NAME_A = ["Acme", "Blue", "Quantum", "Nova", "Orchard", "Pine", "Delta", "Redbeech", "Hedge", "Beacon", "Cloud", "Bridge"];
const NAME_B = ["Analytics", "Systems", "Labs", "Works", "Solutions", "Platform", "AI", "Data", "Flow", "Stack", "Ops", "Logic"];
const SUFFIX = ["BV", "GmbH", "Ltd", "SAS", "Sp. z o.o.", "AB", "SA", "AG"];

// cluster centers (UMAP-like space)
const clusterCenters = Array.from({ length: CLUSTERS }, (_, i) => ({
  id: i,
  cx: randNorm(0, 25),
  cy: randNorm(0, 25),
}));

// --------------------- Scoring helpers ---------------------
function scoreCountry(country) {
  return country === queryProfile.target.country ? 1 : 0.2; // small partial
}

function scoreIndustry(industry) {
  return queryProfile.target.industries.includes(industry) ? 1 : 0.4;
}

function scoreRange(value, [min, max]) {
  if (value >= min && value <= max) return 1;
  // degrade smoothly with distance
  const dist = value < min ? (min - value) : (value - max);
  const span = (max - min) || 1;
  const penalty = dist / (span * 2); // softer falloff
  return clamp01(1 - penalty);
}

function scoreOverlap(list, wanted) {
  const set = new Set(list);
  const overlap = wanted.filter((x) => set.has(x)).length;
  return clamp01(overlap / Math.max(1, Math.min(wanted.length, 6))); // cap denominator to avoid tiny scores
}

function summarize(criteria) {
  const sorted = [...criteria].sort((a, b) => b.contribution - a.contribution);
  const top = sorted.slice(0, 2).map(c => c.name).join(", ");
  const weak = sorted[sorted.length - 1]?.name ?? "n/a";
  return `Strong on ${top}; weaker on ${weak}.`;
}

// --------------------- Generator ---------------------
function makeOrg(i) {
  const country = r01() < 0.35 ? "Netherlands" : pick(COUNTRIES);
  const industry = r01() < 0.45 ? pick(["Technology", "Software", "SaaS", "Data/AI"]) : pick(INDUSTRIES);

  // employees: bias toward SMEs
  const employees = Math.max(5, Math.floor(Math.exp(randNorm(Math.log(120), 0.7))));
  const revenueM = clamp01(r01()) < 0.7
    ? Math.round(Math.max(0.5, randNorm(18, 15)) * 10) / 10
    : Math.round(Math.max(0.5, randNorm(80, 60)) * 10) / 10;

  const keywords = sample(KEYWORDS, rInt(3, 7));
  const techStack = sample(TECH, rInt(3, 7));

  const name = `${pick(NAME_A)} ${pick(NAME_B)} ${pick(SUFFIX)}`;
  const description = `We build ${pick(KEYWORDS)} products for ${pick(["SMBs", "enterprises", "scale-ups", "regulated markets"])} with a focus on ${pick(KEYWORDS)} and ${pick(KEYWORDS)}.`;

  // cluster assignment + 2D embedding
  const cluster = rInt(0, CLUSTERS - 1);
  const center = clusterCenters[cluster];
  const x = center.cx + randNorm(0, 4.5);
  const y = center.cy + randNorm(0, 4.5);

  // criterion scores
  const sCountry = scoreCountry(country);
  const sIndustry = scoreIndustry(industry);
  const sEmployees = scoreRange(employees, queryProfile.target.employeesRange);
  const sRevenue = scoreRange(revenueM, queryProfile.target.revenueMRange);
  const sKeywords = scoreOverlap(keywords, queryProfile.target.keywords);
  const sTech = scoreOverlap(techStack, queryProfile.target.techStack);

  const w = queryProfile.criteriaWeights;

  const criteria = [
    {
      name: "country",
      score: +sCountry.toFixed(3),
      weight: w.country,
      contribution: +(sCountry * w.country).toFixed(3),
      explain: country === queryProfile.target.country ? "Same country: NL" : `Different country: ${country}`,
    },
    {
      name: "industry",
      score: +sIndustry.toFixed(3),
      weight: w.industry,
      contribution: +(sIndustry * w.industry).toFixed(3),
      explain: queryProfile.target.industries.includes(industry) ? `Target industry match: ${industry}` : `Non-target industry: ${industry}`,
    },
    {
      name: "employees",
      score: +sEmployees.toFixed(3),
      weight: w.employees,
      contribution: +(sEmployees * w.employees).toFixed(3),
      explain:
        employees >= queryProfile.target.employeesRange[0] && employees <= queryProfile.target.employeesRange[1]
          ? `Within target range: ${employees}`
          : `Outside target range: ${employees}`,
    },
    {
      name: "revenue",
      score: +sRevenue.toFixed(3),
      weight: w.revenue,
      contribution: +(sRevenue * w.revenue).toFixed(3),
      explain:
        revenueM >= queryProfile.target.revenueMRange[0] && revenueM <= queryProfile.target.revenueMRange[1]
          ? `Within target range: €${revenueM}M`
          : `Outside target range: €${revenueM}M`,
    },
    {
      name: "keywords",
      score: +sKeywords.toFixed(3),
      weight: w.keywords,
      contribution: +(sKeywords * w.keywords).toFixed(3),
      explain: `Keyword overlap: ${Math.round(sKeywords * 100)}%`,
    },
    {
      name: "techStack",
      score: +sTech.toFixed(3),
      weight: w.techStack,
      contribution: +(sTech * w.techStack).toFixed(3),
      explain: `Tech overlap: ${Math.round(sTech * 100)}%`,
    },
  ];

  const totalScore = criteria.reduce((sum, c) => sum + c.contribution, 0);

  return {
    id: `org_${String(i).padStart(6, "0")}`,
    name,
    country,
    industry,
    employees,
    revenueM,
    description,
    keywords,
    techStack,
    embedding2d: { x: +x.toFixed(3), y: +y.toFixed(3), cluster },
    match: {
      totalScore: +totalScore.toFixed(3),
      criteria,
      summary: summarize(criteria),
    },
  };
}

// --------------------- Stream JSON writer ---------------------
const ws = fs.createWriteStream(OUT, { encoding: "utf8" });

ws.write("{\n");
ws.write(`  "queryProfile": ${JSON.stringify(queryProfile, null, 2)},\n`);
ws.write(`  "meta": ${JSON.stringify({ count: COUNT, clusters: CLUSTERS, seed: SEED, generatedAt: new Date().toISOString() }, null, 2)},\n`);
ws.write(`  "organizations": [\n`);

for (let i = 1; i <= COUNT; i++) {
  const org = makeOrg(i);
  const json = JSON.stringify(org);
  ws.write("    " + json + (i === COUNT ? "\n" : ",\n"));

  // progress
  if (i % Math.max(1000, Math.floor(COUNT / 20)) === 0) {
    process.stdout.write(`Generated ${i}/${COUNT}\r`);
  }
}

ws.write("  ]\n");
ws.write("}\n");
ws.end();

ws.on("finish", () => {
  console.log(`\nDone. Wrote ${COUNT} organizations to: ${OUT}`);
  console.log(`Tip: Start with --count 10000, then scale up.`);
});