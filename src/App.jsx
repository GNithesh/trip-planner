import React, { createContext, useContext, useState } from "react";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  MapPin,
  Calendar,
  Users,
  Wallet,
  Heart,
  UtensilsCrossed,
  ShieldAlert,
  Sparkles,
  Compass,
  Plus,
  Check,
  X,
  ArrowRight,
  Mountain,
  Waves,
  TrainFront,
  PlaneTakeoff,
  Lock,
  Mail,
  PhoneCall,
  Stethoscope,
  Route,
  Wind,
  HeartPulse,
  Bone,
  Leaf,
  Salad,
  Moon,
  Wheat,
  Ban,
  TreePine,
  Landmark,
  ShieldCheck,
  Accessibility,
  Footprints,
  UserPlus,
  User,
  Image as ImageIcon,
  Info,
  TrendingUp,
  Search,
  Car,
  Plane,
  ExternalLink,
  GripVertical,
  Trash2,
  Pin as PinIcon,
  Clock,
  Sun,
  Scale,
  Percent,
  AlertOctagon,
  ArrowLeftRight,
  Download,
  Globe,
  Mic,
  Camera,
  RefreshCcw,
  CloudRain,
  Radar,
  Gauge,
  Languages,
  ScanLine,
  ListChecks,
  MessageCircle,
  Send,
  Bookmark,
  QrCode,
  Share2,
  Siren,
  ArrowUpRightFromCircle,
  Wand2,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  OPTION TAXONOMIES (drive chips, badges, modal steps)               */
/* ------------------------------------------------------------------ */

const MOBILITY_LEVELS = ["Full Mobility", "Assisted", "Wheelchair-Accessible"];

const MEDICAL_OPTIONS = [
  { key: "Asthma", icon: Wind },
  { key: "Hypertension", icon: HeartPulse },
  { key: "Arthritis", icon: Bone },
  { key: "Motion Sickness", icon: Waves },
  { key: "Altitude Sensitivity", icon: Mountain },
];

const DIETARY_OPTIONS = [
  { key: "Pure Vegetarian", icon: Salad },
  { key: "Vegan", icon: Leaf },
  { key: "Halal", icon: Moon },
  { key: "Gluten-Free", icon: Wheat },
  { key: "Nut Allergy", icon: Ban },
  { key: "Shellfish Allergy", icon: Ban },
];

const LANDSCAPE_OPTIONS = [
  { key: "Beaches", icon: Waves },
  { key: "Dense Forests", icon: TreePine },
  { key: "Heritage Architecture", icon: Landmark },
  { key: "Trekking Trails", icon: Mountain },
];

const AVATAR_COLORS = [
  "bg-sky-500",
  "bg-rose-600",
  "bg-orange-600",
  "bg-amber-600",
  "bg-sky-800",
  "bg-zinc-600",
];

function initialsFor(name) {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function crowdLabel(v) {
  if (v <= 33) return "Serene, hidden spots";
  if (v <= 66) return "Balanced mix";
  return "Popular cultural hubs";
}

function pacingLabel(v) {
  if (v <= 33) return "Relaxed exploration";
  if (v <= 66) return "Balanced pacing";
  return "Action-packed";
}

/* ------------------------------------------------------------------ */
/*  DISCOVERY DASHBOARD DATA & LOGIC                                   */
/* ------------------------------------------------------------------ */

const MOCK_POIS = [
  {
    id: "poi1",
    name: "Abbey Falls Viewpoint",
    landscape: "Dense Forests",
    crowdDensity: "Low",
    accessibility: "Moderate Terrain",
    gradient: "from-sky-900 to-black",
    icon: TreePine,
    blurb: "Social-mined hidden gem \u00b7 monsoon-fed cascades off the main trail.",
  },
  {
    id: "poi2",
    name: "Raja's Seat Heritage Garden",
    landscape: "Heritage Architecture",
    crowdDensity: "Medium",
    accessibility: "Easy Access",
    gradient: "from-orange-900 to-black",
    icon: Landmark,
    blurb: "Colonial-era garden with a sunset viewpoint over the Western Ghats.",
  },
  {
    id: "poi3",
    name: "Chelavara Falls Trail",
    landscape: "Trekking Trails",
    crowdDensity: "Low",
    accessibility: "Difficult Terrain",
    gradient: "from-zinc-700 to-black",
    icon: Mountain,
    blurb: "Steep basalt-rock descent \u00b7 rewarding twin-tier waterfall.",
  },
  {
    id: "poi4",
    name: "Mallalli Falls Coastline Walk",
    landscape: "Beaches",
    crowdDensity: "High",
    accessibility: "Easy Access",
    gradient: "from-rose-900 to-black",
    icon: Waves,
    blurb: "Popular riverside stretch, lively in the late afternoon.",
  },
  {
    id: "poi5",
    name: "Nalknad Palace Ruins",
    landscape: "Heritage Architecture",
    crowdDensity: "Low",
    accessibility: "Easy Access",
    gradient: "from-sky-950 to-zinc-900",
    icon: Landmark,
    blurb: "Underrated Reddit find \u2014 near-empty on weekday mornings.",
  },
  {
    id: "poi6",
    name: "Thadiyandamol Summit Trek",
    landscape: "Trekking Trails",
    crowdDensity: "Medium",
    accessibility: "Difficult Terrain",
    gradient: "from-sky-800 to-black",
    icon: Mountain,
    blurb: "Highest peak in the district \u00b7 altitude gain over 5km.",
  },
];

const CROWD_DENSITY_VALUE = { Low: 20, Medium: 50, High: 80 };

function computeMatchScore(poi, profile) {
  if (!profile) return 70;
  let score = 58;

  if (profile.vibe.includes(poi.landscape)) score += 24;

  const crowdVal = CROWD_DENSITY_VALUE[poi.crowdDensity] ?? 50;
  const tolerance = profile.crowdTolerance ?? 50;
  const diff = Math.abs(crowdVal - tolerance);
  score += Math.max(0, 14 - Math.round(diff / 8));

  const mobilityRestricted =
    profile.mobility === "Wheelchair-Accessible" ||
    profile.mobility === "Assisted";
  if (mobilityRestricted && poi.accessibility === "Difficult Terrain") {
    score -= 22;
  }
  if (
    (profile.medical.includes("Arthritis") ||
      profile.medical.includes("Altitude Sensitivity")) &&
    poi.accessibility === "Difficult Terrain"
  ) {
    score -= 12;
  }

  return Math.max(38, Math.min(99, score));
}

function safeZoneStatus(profile) {
  if (!profile) return { label: "Safe zone: Cleared", tone: "emerald" };
  if (profile.medical.length === 0) {
    return { label: "Safe zone: Cleared", tone: "emerald" };
  }
  return { label: "Safe zone: Caution advised", tone: "amber" };
}

function getHealthAdvisories(profile) {
  if (!profile) return [];
  const advisories = [];
  if (
    profile.medical.includes("Asthma") ||
    profile.medical.includes("Altitude Sensitivity")
  ) {
    advisories.push({
      text: `High-altitude caution active for ${profile.name.split(" ")[0]} \u2014 flagged for asthma/altitude sensitivity. Keep an inhaler or Diamox accessible above 1,500m.`,
      severity: "high",
    });
  }
  if (profile.medical.includes("Motion Sickness")) {
    advisories.push({
      text: `Winding ghat roads on today's route \u2014 consider an antiemetic before transit-heavy legs.`,
      severity: "medium",
    });
  }
  if (
    profile.medical.includes("Hypertension") ||
    profile.medical.includes("Arthritis")
  ) {
    advisories.push({
      text: `Difficult-terrain treks have been de-prioritized in favor of easy-access alternatives for this traveler.`,
      severity: "medium",
    });
  }
  return advisories;
}

/* ------------------------------------------------------------------ */
/*  PLANNER WIZARD DATA & LOGIC                                        */
/* ------------------------------------------------------------------ */

const DESTINATION_POIS = {
  Goa: ["Divar Island", "Fontainhas", "Cola Beach", "Chapora Fort", "Anjuna Flea Market"],
  "Himachal Pradesh": ["Old Manali", "Kasol Riverside", "Bijli Mahadev Trek", "Naggar Castle", "Tirthan Valley"],
  Kyoto: ["Fushimi Inari Trail", "Arashiyama Bamboo Grove", "Philosopher's Path", "Gion Backstreets", "Nishiki Market"],
  "Coorg, Karnataka": ["Abbey Falls", "Raja's Seat", "Dubare Elephant Camp", "Nalknad Palace", "Mallalli Falls"],
};

const DESTINATION_SUGGESTIONS = ["Goa", "Himachal Pradesh", "Kyoto", "Coorg, Karnataka"];

function getNearbyPOIs(destination) {
  const key = Object.keys(DESTINATION_POIS).find(
    (k) => k.toLowerCase() === (destination || "").trim().toLowerCase()
  );
  if (key) return DESTINATION_POIS[key];
  return ["Old Town Quarter", "Riverside Promenade", "Hilltop Viewpoint", "Local Artisan Market", "Nature Reserve Trail"];
}

function getGroupRiskWarnings(profiles) {
  const warnings = [];
  const motionSick = profiles.filter((p) => p.medical.includes("Motion Sickness"));
  if (motionSick.length) {
    warnings.push(
      `${motionSick.length} traveler${motionSick.length > 1 ? "s" : ""} flagged for motion sickness \u2014 route engine will avoid winding ghats.`
    );
  }
  const altitude = profiles.filter(
    (p) => p.medical.includes("Altitude Sensitivity") || p.medical.includes("Asthma")
  );
  if (altitude.length) {
    warnings.push(
      `${altitude.length} traveler${altitude.length > 1 ? "s" : ""} flagged for altitude/asthma risk \u2014 high-elevation stops will be capped.`
    );
  }
  const mobility = profiles.filter(
    (p) => p.mobility === "Assisted" || p.mobility === "Wheelchair-Accessible"
  );
  if (mobility.length) {
    warnings.push(
      `${mobility.length} traveler${mobility.length > 1 ? "s" : ""} require${mobility.length > 1 ? "" : "s"} accessible terrain \u2014 difficult treks will be swapped for easy-access alternatives.`
    );
  }
  return warnings;
}

const BOOKING_LINKS = [
  { name: "Skyscanner", url: "https://www.skyscanner.net", icon: Plane },
  { name: "Google Flights", url: "https://www.google.com/travel/flights", icon: Plane },
  { name: "IRCTC", url: "https://www.irctc.co.in", icon: TrainFront },
  { name: "MakeMyTrip", url: "https://www.makemytrip.com", icon: ExternalLink },
];

/* ------------------------------------------------------------------ */
/*  OUTPUT WORKSPACE DATA & LOGIC                                      */
/* ------------------------------------------------------------------ */

function initialStops(destination) {
  const pois = getNearbyPOIs(destination).slice(0, 4);
  const templates = [
    { time: "7:30 AM", dwell: "45 min", window: "Best 7\u20139 AM (golden hour)", icon: Waves },
    { time: "10:00 AM", dwell: "60 min", window: "Before 11 AM (low crowd)", icon: Mountain },
    { time: "1:00 PM", dwell: "75 min", window: "Lunch window 12\u20132 PM", icon: UtensilsCrossed },
    { time: "4:00 PM", dwell: "90 min", window: "Afternoon 3\u20135 PM", icon: Landmark },
  ];
  return pois.map((name, i) => ({
    id: `stop-${i}-${name.replace(/\s+/g, "")}`,
    name,
    pinned: i === 0,
    ...templates[i % templates.length],
  }));
}

const MEDICAL_KIT_MAP = {
  Asthma: { item: "Inhaler / bronchodilator", icon: Wind },
  "Altitude Sensitivity": { item: "Diamox (acetazolamide) \u2014 consult physician", icon: Mountain },
  "Motion Sickness": { item: "Antiemetic tablets (e.g. Dramamine)", icon: Waves },
  Hypertension: { item: "BP monitor + regular medication supply", icon: HeartPulse },
  Arthritis: { item: "Anti-inflammatory gel / topical relief", icon: Bone },
};

const GENERIC_KIT_ITEMS = [
  "Paracetamol (fever/pain)",
  "ORS rehydration sachets",
  "Antiseptic wipes & adhesive bandages",
  "Mosquito repellent",
];

const ETIQUETTE_ITEMS = [
  { label: "Dress code", detail: "Cover shoulders and knees when entering temples or heritage religious sites.", icon: ShieldCheck },
  { label: "Tipping norms", detail: "10% at sit-down restaurants is customary; rounding up is fine for cabs.", icon: Wallet },
  { label: "Photography", detail: "Avoid photographing local residents or religious ceremonies without asking first.", icon: ImageIcon },
  { label: "Common scams", detail: "Beware of inflated \u201cclosed for renovation\u201d taxi redirects near major attractions.", icon: AlertOctagon },
  { label: "Local law note", detail: "Carry a photo ID at all times; some reserve areas require entry permits.", icon: Scale },
];

/* ------------------------------------------------------------------ */
/*  OPERATIONS COCKPIT: DATA & LOGIC                                   */
/* ------------------------------------------------------------------ */

const LANGUAGE_MAP = {
  Kyoto: { language: "Japanese", size: "210 MB" },
  Goa: { language: "Konkani / Hindi", size: "95 MB" },
  "Himachal Pradesh": { language: "Hindi / Pahari", size: "85 MB" },
  "Coorg, Karnataka": { language: "Kannada / Kodava", size: "110 MB" },
  Paris: { language: "French", size: "130 MB" },
};

function getLanguagePack(destination) {
  const key = Object.keys(LANGUAGE_MAP).find(
    (k) => k.toLowerCase() === (destination || "").trim().toLowerCase()
  );
  return key ? LANGUAGE_MAP[key] : { language: "English", size: "20 MB" };
}

const MENU_SAMPLE = [
  { original: "\u30a8\u30d3\u5929\u3077\u3089", translated: "Shrimp Tempura", allergens: ["Shellfish Allergy"] },
  { original: "\u5473\u566c\u6c41", translated: "Miso Soup", allergens: [] },
  { original: "\u30d0\u30bf\u30fc\u30c1\u30ad\u30f3\u30ab\u30ec\u30fc", translated: "Butter Chicken Curry", allergens: [] },
  { original: "\u62b9\u8336\u30a2\u30a4\u30b9\uff08\u30ca\u30c3\u30c4\u5165\uff09", translated: "Matcha Ice Cream (contains nuts)", allergens: ["Nut Allergy"] },
];

const DINING_SPOTS = [
  { id: "d1", name: "Coastal Spice Kitchen", cuisine: "Coastal Indian", costForTwo: 900, distanceKm: 1.2, supports: ["Pure Vegetarian", "Gluten-Free"], allergens: [] },
  { id: "d2", name: "Bamboo Leaf Thai", cuisine: "Thai", costForTwo: 1400, distanceKm: 2.4, supports: ["Vegan"], allergens: ["Nut Allergy"] },
  { id: "d3", name: "Old Town Trattoria", cuisine: "Italian", costForTwo: 2200, distanceKm: 3.1, supports: [], allergens: ["Shellfish Allergy"] },
  { id: "d4", name: "Ghat View Cafe", cuisine: "Multi-cuisine", costForTwo: 650, distanceKm: 0.8, supports: ["Pure Vegetarian", "Halal"], allergens: [] },
  { id: "d5", name: "Riverside Grill House", cuisine: "Continental Grill", costForTwo: 1800, distanceKm: 2.9, supports: ["Gluten-Free"], allergens: ["Shellfish Allergy"] },
];

const DIET_PREFERENCE_KEYS = ["Pure Vegetarian", "Vegan", "Halal", "Gluten-Free"];
const DIET_ALLERGY_KEYS = ["Nut Allergy", "Shellfish Allergy"];

function evaluateDiningSpot(spot, groupDietaryFlags, costCap) {
  const reasons = [];
  if (spot.costForTwo > costCap) {
    reasons.push(`Over cost-for-two cap (\u20B9${spot.costForTwo} > \u20B9${costCap})`);
  }
  DIET_PREFERENCE_KEYS.forEach((pref) => {
    if (groupDietaryFlags.includes(pref) && !spot.supports.includes(pref)) {
      reasons.push(`Doesn't accommodate ${pref}`);
    }
  });
  DIET_ALLERGY_KEYS.forEach((allergy) => {
    if (groupDietaryFlags.includes(allergy) && spot.allergens.includes(allergy)) {
      reasons.push(`Contains flagged allergen: ${allergy}`);
    }
  });
  return { pass: reasons.length === 0, reasons };
}

function getRegulatoryChecklist(destination) {
  const base = [
    "Carry a valid government-issued photo ID at all times",
    "Register with the local health authority if required on arrival",
  ];
  const d = (destination || "").toLowerCase();
  if (d.includes("kyoto") || d.includes("japan")) {
    return [
      ...base,
      "Visa-free entry \u2264 90 days for many passports \u2014 verify eligibility",
      "Cabin liquids cap: 100ml containers in a 1L resealable bag",
      "Travel health insurance registry recommended",
    ];
  }
  if (d.includes("paris") || d.includes("france")) {
    return [
      ...base,
      "Schengen visa required for most non-EU passports",
      "Check-in luggage cap typically 23kg (economy)",
      "EHIC / travel insurance strongly recommended",
    ];
  }
  return [
    ...base,
    "Domestic flights: 15\u201320kg check-in, 7kg cabin cap",
    "Keep a digital + physical copy of ID proofs",
    "Verify entry permits for reserve/forest areas",
  ];
}

const OUTDOOR_ICONS = [Waves, Mountain, TreePine];

function isOutdoorStop(stop) {
  return OUTDOOR_ICONS.includes(stop.icon);
}



const MOCK_PROFILES = [
  {
    id: "p1",
    name: "Aarav Mehta",
    age: 34,
    avatarColor: "bg-sky-500",
    initials: "AM",
    mobility: "Full Mobility",
    medical: ["Asthma"],
    dietary: ["Shellfish Allergy"],
    vibe: ["Heritage Architecture", "Relaxed exploration"],
    crowdTolerance: 25,
    pacing: 30,
    emergencyContact: { name: "Riya Mehta", phone: "+91 98200 11223" },
    guardian: { name: "", phone: "" },
    insurancePolicyId: "ICICI-TRV-88213",
  },
  {
    id: "p2",
    name: "Neha Mehta",
    age: 31,
    avatarColor: "bg-rose-600",
    initials: "NM",
    mobility: "Full Mobility",
    medical: ["Motion Sickness"],
    dietary: ["Pure Vegetarian"],
    vibe: ["Beaches", "Balanced mix"],
    crowdTolerance: 30,
    pacing: 45,
    emergencyContact: { name: "Aarav Mehta", phone: "+91 98200 44556" },
    guardian: { name: "", phone: "" },
    insurancePolicyId: "ICICI-TRV-88214",
  },
  {
    id: "p3",
    name: "Kabir Mehta",
    age: 8,
    avatarColor: "bg-amber-600",
    initials: "KM",
    mobility: "Full Mobility",
    medical: [],
    dietary: ["Nut Allergy"],
    vibe: ["Trekking Trails", "Action-packed"],
    crowdTolerance: 60,
    pacing: 80,
    emergencyContact: { name: "Neha Mehta", phone: "+91 98200 44556" },
    guardian: { name: "Neha Mehta", phone: "+91 98200 44556" },
    insurancePolicyId: "ICICI-TRV-88215",
  },
  {
    id: "p4",
    name: "Devika Rao",
    age: 68,
    avatarColor: "bg-zinc-600",
    initials: "DR",
    mobility: "Assisted",
    medical: ["Hypertension", "Arthritis"],
    dietary: ["Gluten-Free"],
    vibe: ["Heritage Architecture", "Relaxed exploration"],
    crowdTolerance: 15,
    pacing: 15,
    emergencyContact: { name: "Aarav Mehta", phone: "+91 98200 11223" },
    guardian: { name: "", phone: "" },
    insurancePolicyId: "STAR-TRV-40021",
  },
];

const MOCK_TRIP = {
  destination: "Coorg, Karnataka",
  startDate: "2026-11-12",
  endDate: "2026-11-17",
  groupSize: 4,
  totalBudget: 120000,
  dailyPerPersonBudget: 3000,
  currency: "\u20B9",
  budgetBreakdown: {
    stays: 35,
    dining: 25,
    transit: 20,
    activities: 20,
  },
  selectedProfileIds: ["p1", "p2", "p3", "p4"],
  nearbyPOIs: ["Abbey Falls", "Raja's Seat"],
  transit: {
    mode: "Self-Drive",
    flightNumber: "",
    trainNumber: "",
    departureHub: "",
    arrivalHub: "",
  },
};

const NAV_STATES = [
  "AUTH",
  "PROFILES",
  "HOME",
  "PLANNER_WIZARD",
  "ITINERARY_OUTPUT",
];

const TripPlannerContext = createContext(null);

function useTripPlanner() {
  const ctx = useContext(TripPlannerContext);
  if (!ctx) throw new Error("useTripPlanner must be used within provider");
  return ctx;
}

function TripPlannerProvider({ children }) {
  const [userProfiles, setUserProfiles] = useState(MOCK_PROFILES);
  const [activeTrip, setActiveTrip] = useState(MOCK_TRIP);
  const [navigation, setNavigation] = useState("HOME");
  const [activeProfileId, setActiveProfileId] = useState(MOCK_PROFILES[0].id);
  const [wishlist, setWishlist] = useState([]);
  const [stops, setStops] = useState(() => initialStops(MOCK_TRIP.destination));
  const [offlinePackDownloaded, setOfflinePackDownloaded] = useState(false);

  const addProfile = (profile) => {
    setUserProfiles((prev) => [...prev, profile]);
  };

  const toggleWishlist = (poiId) => {
    setWishlist((prev) =>
      prev.includes(poiId) ? prev.filter((id) => id !== poiId) : [...prev, poiId]
    );
  };

  const updateTrip = (patch) => {
    setActiveTrip((prev) => ({ ...prev, ...patch }));
  };

  const regenerateRoute = () => {
    setStops(initialStops(activeTrip.destination));
  };

  const value = {
    userProfiles,
    setUserProfiles,
    addProfile,
    activeTrip,
    setActiveTrip,
    updateTrip,
    navigation,
    setNavigation,
    activeProfileId,
    setActiveProfileId,
    wishlist,
    toggleWishlist,
    stops,
    setStops,
    regenerateRoute,
    offlinePackDownloaded,
    setOfflinePackDownloaded,
  };

  return (
    <TripPlannerContext.Provider value={value}>
      {children}
    </TripPlannerContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  SHARED UI PRIMITIVES  (dark / crimson design system)                */
/* ------------------------------------------------------------------ */

function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-lg shadow-xl shadow-black/50 ${className}`}
    >
      {children}
    </div>
  );
}

function Pill({ children, tone = "emerald" }) {
  const tones = {
    emerald: "bg-sky-950/50 text-sky-200 border-sky-800/60",
    amber: "bg-amber-950/40 text-amber-300 border-amber-800/50",
    slate: "bg-zinc-800/60 text-zinc-300 border-zinc-700",
    teal: "bg-orange-950/40 text-orange-300 border-orange-800/50",
    rose: "bg-rose-950/50 text-rose-300 border-rose-800/60",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function PrimaryButton({ children, onClick, icon: Icon, className = "", type = "button", disabled }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center gap-2 bg-sky-400 hover:bg-sky-300 disabled:opacity-40 disabled:pointer-events-none text-zinc-950 font-semibold px-4 py-2.5 rounded-lg shadow-md shadow-sky-500/10 transition-all active:scale-95 ${className}`}
    >
      {Icon && <Icon size={17} />}
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick, icon: Icon, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 font-medium px-4 py-2.5 rounded-md transition-colors ${className}`}
    >
      {Icon && <Icon size={17} />}
      {children}
    </button>
  );
}

/** Toggleable chip used across intake steps */
function Chip({ label, icon: Icon, active, onClick, tone = "emerald" }) {
  const activeTones = {
    emerald: "bg-sky-500 border-sky-500 text-white shadow-sky-950/40",
    rose: "bg-rose-600 border-rose-600 text-white shadow-rose-950/40",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 text-sm font-medium px-3.5 py-2 rounded-md border transition-all shadow-sm ${
        active
          ? activeTones[tone]
          : "bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-500"
      }`}
    >
      {Icon && <Icon size={14} />}
      {label}
    </button>
  );
}

/** Labeled slider with descriptive end captions */
function LabeledSlider({ label, value, onChange, leftCaption, rightCaption, resultLabel }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-zinc-200">{label}</span>
        <span className="text-xs font-semibold text-sky-300">
          {resultLabel}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-sky-500 h-2 cursor-pointer"
      />
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-zinc-500">{leftCaption}</span>
        <span className="text-xs text-zinc-500">{rightCaption}</span>
      </div>
    </div>
  );
}

function TextField({ label, icon: Icon, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5 block">
        {label}
      </label>
      <div className="flex items-center gap-2 border border-zinc-700 rounded-md px-3 py-2.5 focus-within:border-sky-500 transition-colors bg-zinc-900">
        {Icon && <Icon size={16} className="text-zinc-500 shrink-0" />}
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 text-sm outline-none text-zinc-100 placeholder:text-zinc-600 min-w-0 bg-transparent [color-scheme:dark]"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TOP NAVIGATION BAR                                                 */
/* ------------------------------------------------------------------ */

function TopNav() {
  const {
    userProfiles,
    activeProfileId,
    setActiveProfileId,
    navigation,
    setNavigation,
  } = useTripPlanner();
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const activeProfile =
    userProfiles.find((p) => p.id === activeProfileId) || userProfiles[0];

  if (navigation === "AUTH") return null;

  return (
    <div className="sticky top-0 z-30 bg-black/95 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <button
          onClick={() => setNavigation("HOME")}
          className="flex items-center gap-2 group"
        >
          <div className="h-9 w-9 rounded-md bg-gradient-to-br from-sky-500 to-sky-950 flex items-center justify-center shadow-md shadow-sky-950/50 group-hover:scale-105 transition-transform">
            <Compass size={20} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            Way<span className="text-sky-400">fare</span>
          </span>
        </button>

        <div className="flex items-center gap-3">
          <PrimaryButton
            icon={Sparkles}
            onClick={() => setNavigation("PLANNER_WIZARD")}
            className="!py-2 !px-3.5 text-sm hidden sm:inline-flex"
          >
            Plan Trip
          </PrimaryButton>

          <button className="relative h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-zinc-800 transition-colors">
            <Bell size={18} className="text-zinc-300" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-sky-500 text-[10px] font-bold text-white flex items-center justify-center border-2 border-black">
              3
            </span>
          </button>

          <div className="relative">
            <button
              onClick={() => setSwitcherOpen((o) => !o)}
              className="flex items-center gap-2 h-10 pl-1 pr-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-zinc-800 transition-colors"
            >
              <span
                className={`h-8 w-8 rounded-full ${activeProfile.avatarColor} flex items-center justify-center text-white text-xs font-bold`}
              >
                {activeProfile.initials}
              </span>
              <ChevronDown size={14} className="text-zinc-400" />
            </button>

            {switcherOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-lg bg-zinc-900 shadow-2xl border border-zinc-800 overflow-hidden">
                <div className="px-4 py-3 border-b border-zinc-800">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                    Switch traveler
                  </p>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {userProfiles.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActiveProfileId(p.id);
                        setSwitcherOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-800 transition-colors"
                    >
                      <span
                        className={`h-8 w-8 rounded-full ${p.avatarColor} flex items-center justify-center text-white text-xs font-bold`}
                      >
                        {p.initials}
                      </span>
                      <div className="text-left flex-1">
                        <p className="text-sm font-medium text-zinc-100">
                          {p.name}
                        </p>
                        <p className="text-xs text-zinc-500">{p.age} yrs</p>
                      </div>
                      {p.id === activeProfileId && (
                        <Check size={16} className="text-sky-400" />
                      )}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setNavigation("PROFILES");
                    setSwitcherOpen(false);
                  }}
                  className="w-full text-sm font-medium text-sky-400 hover:bg-sky-950/30 py-3 flex items-center justify-center gap-1.5 border-t border-zinc-800"
                >
                  <Plus size={15} /> Manage profiles
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 pb-2 flex gap-1 overflow-x-auto">
        {NAV_STATES.filter((s) => s !== "AUTH").map((s) => (
          <button
            key={s}
            onClick={() => setNavigation(s)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
              navigation === s
                ? "bg-sky-500/20 text-sky-200 border border-sky-500/30"
                : "text-zinc-500 hover:text-zinc-300 border border-transparent"
            }`}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SCREEN: AUTH                                                       */
/* ------------------------------------------------------------------ */

function AuthScreen() {
  const { setNavigation } = useTripPlanner();
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-5 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 h-96 w-96 bg-sky-700/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 bg-sky-900/20 rounded-full blur-3xl" />

      <GlassCard className="w-full max-w-sm p-8 relative z-10">
        <div className="flex flex-col items-center mb-6">
          <div className="h-14 w-14 rounded-md bg-gradient-to-br from-sky-500 to-sky-950 flex items-center justify-center shadow-lg shadow-sky-950/50 mb-3">
            <Compass size={28} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">
            Welcome to Wayfare
          </h1>
          <p className="text-sm text-zinc-400 mt-1 text-center">
            Your trip, planned, monitored, and adapted in real time.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 border border-zinc-700 rounded-md px-3 py-2.5 focus-within:border-sky-500 transition-colors bg-zinc-900">
            <Mail size={16} className="text-zinc-500" />
            <input
              placeholder="Email address"
              className="flex-1 text-sm outline-none text-zinc-100 placeholder:text-zinc-600 bg-transparent"
            />
          </div>
          <div className="flex items-center gap-2 border border-zinc-700 rounded-md px-3 py-2.5 focus-within:border-sky-500 transition-colors bg-zinc-900">
            <Lock size={16} className="text-zinc-500" />
            <input
              type="password"
              placeholder="Password"
              className="flex-1 text-sm outline-none text-zinc-100 placeholder:text-zinc-600 bg-transparent"
            />
          </div>
        </div>

        <PrimaryButton
          onClick={() => setNavigation("PROFILES")}
          className="w-full justify-center mt-5"
          icon={ArrowRight}
        >
          Continue
        </PrimaryButton>

        <p className="text-xs text-center text-zinc-600 mt-4">
          Prototype build — authentication is mocked for testing.
        </p>
      </GlassCard>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MULTI-STEP INTAKE MODAL (traveler profile)                         */
/* ------------------------------------------------------------------ */

const STEP_META = [
  { key: "personal", label: "Personal & Medical", icon: Stethoscope },
  { key: "dietary", label: "Dietary", icon: UtensilsCrossed },
  { key: "vibe", label: "Vibe & Atmosphere", icon: Sparkles },
  { key: "safety", label: "Safety Anchors", icon: ShieldCheck },
];

const EMPTY_FORM = {
  name: "",
  age: "",
  mobility: "Full Mobility",
  medical: [],
  dietary: [],
  landscape: [],
  crowdTolerance: 50,
  pacing: 50,
  emergencyContactName: "",
  emergencyContactPhone: "",
  guardianName: "",
  guardianPhone: "",
  insurancePolicyId: "",
};

function toggleInArray(arr, value) {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

function AddProfileModal({ onClose, onCreated }) {
  const { addProfile, userProfiles } = useTripPlanner();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY_FORM);

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  const isStep1Valid = form.name.trim().length > 0 && String(form.age).trim().length > 0;
  const canAdvance = step === 0 ? isStep1Valid : true;

  const handleNext = () => setStep((s) => Math.min(s + 1, STEP_META.length - 1));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = () => {
    const color = AVATAR_COLORS[userProfiles.length % AVATAR_COLORS.length];
    const vibeTags = [
      ...form.landscape,
      crowdLabel(form.crowdTolerance),
      pacingLabel(form.pacing),
    ];

    const newProfile = {
      id: `p${Date.now()}`,
      name: form.name.trim(),
      age: Number(form.age),
      avatarColor: color,
      initials: initialsFor(form.name.trim() || "New Traveler"),
      mobility: form.mobility,
      medical: form.medical,
      dietary: form.dietary,
      vibe: vibeTags,
      crowdTolerance: form.crowdTolerance,
      pacing: form.pacing,
      emergencyContact: {
        name: form.emergencyContactName.trim(),
        phone: form.emergencyContactPhone.trim(),
      },
      guardian: {
        name: form.guardianName.trim(),
        phone: form.guardianPhone.trim(),
      },
      insurancePolicyId: form.insurancePolicyId.trim(),
    };

    addProfile(newProfile);
    if (onCreated) onCreated(newProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-6 pt-6 pb-4 border-b border-zinc-800 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">
              Add traveler profile
            </h2>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-zinc-800 flex items-center justify-center text-zinc-500"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex items-center">
            {STEP_META.map((s, i) => (
              <React.Fragment key={s.key}>
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`h-9 w-9 rounded-full flex items-center justify-center border-2 transition-colors ${
                      i < step
                        ? "bg-sky-500 border-sky-500 text-white"
                        : i === step
                        ? "border-sky-500 text-sky-300 bg-sky-950/30"
                        : "border-zinc-700 text-zinc-600"
                    }`}
                  >
                    {i < step ? <Check size={15} /> : <s.icon size={15} />}
                  </div>
                  <span
                    className={`text-[10px] font-medium hidden sm:block ${
                      i <= step ? "text-zinc-300" : "text-zinc-600"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEP_META.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-1 mb-4 sm:mb-4 ${
                      i < step ? "bg-sky-500" : "bg-zinc-800"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="px-6 py-5 overflow-y-auto flex-1">
          {step === 0 && (
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <TextField
                  label="Full name"
                  icon={User}
                  value={form.name}
                  onChange={(v) => update({ name: v })}
                  placeholder="e.g. Priya Sharma"
                />
                <TextField
                  label="Age"
                  type="number"
                  value={form.age}
                  onChange={(v) => update({ age: v })}
                  placeholder="e.g. 29"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5 block">
                  Mobility level
                </label>
                <div className="flex flex-wrap gap-2">
                  {MOBILITY_LEVELS.map((m) => (
                    <Chip
                      key={m}
                      label={m}
                      icon={
                        m === "Full Mobility"
                          ? Footprints
                          : m === "Assisted"
                          ? Heart
                          : Accessibility
                      }
                      active={form.mobility === m}
                      onClick={() => update({ mobility: m })}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5 block">
                  High-risk conditions
                </label>
                <p className="text-xs text-zinc-500 mb-2.5">
                  Used to filter out high-strain activities and unsuitable
                  terrain.
                </p>
                <div className="flex flex-wrap gap-2">
                  {MEDICAL_OPTIONS.map((m) => (
                    <Chip
                      key={m.key}
                      label={m.key}
                      icon={m.icon}
                      tone="rose"
                      active={form.medical.includes(m.key)}
                      onClick={() =>
                        update({ medical: toggleInArray(form.medical, m.key) })
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-zinc-200 mb-1">
                  Dietary preferences & restrictions
                </h3>
                <p className="text-xs text-zinc-500 mb-3">
                  These flags filter every culinary suggestion downstream.
                </p>
                <div className="flex flex-wrap gap-2">
                  {DIETARY_OPTIONS.map((d) => (
                    <Chip
                      key={d.key}
                      label={d.key}
                      icon={d.icon}
                      active={form.dietary.includes(d.key)}
                      onClick={() =>
                        update({ dietary: toggleInArray(form.dietary, d.key) })
                      }
                    />
                  ))}
                </div>
              </div>

              {form.dietary.some((d) => d.includes("Allergy")) && (
                <div className="flex items-start gap-2 bg-amber-950/30 border border-amber-800/50 rounded-md px-3.5 py-3">
                  <ShieldAlert
                    size={16}
                    className="text-amber-400 shrink-0 mt-0.5"
                  />
                  <p className="text-xs text-amber-300">
                    Severe allergy flags will be highlighted across dining and
                    medical-kit recommendations for this traveler.
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-zinc-200 mb-1">
                  Landscape preferences
                </h3>
                <p className="text-xs text-zinc-500 mb-3">
                  Select the settings this traveler is most drawn to.
                </p>
                <div className="flex flex-wrap gap-2">
                  {LANDSCAPE_OPTIONS.map((l) => (
                    <Chip
                      key={l.key}
                      label={l.key}
                      icon={l.icon}
                      active={form.landscape.includes(l.key)}
                      onClick={() =>
                        update({
                          landscape: toggleInArray(form.landscape, l.key),
                        })
                      }
                    />
                  ))}
                </div>
              </div>

              <LabeledSlider
                label="Crowd tolerance"
                value={form.crowdTolerance}
                onChange={(v) => update({ crowdTolerance: v })}
                leftCaption="Serene / hidden"
                rightCaption="Popular hubs"
                resultLabel={crowdLabel(form.crowdTolerance)}
              />

              <LabeledSlider
                label="Pacing"
                value={form.pacing}
                onChange={(v) => update({ pacing: v })}
                leftCaption="Relaxed exploration"
                rightCaption="Action-packed"
                resultLabel={pacingLabel(form.pacing)}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center gap-2">
                  <PhoneCall size={15} className="text-sky-400" />
                  Primary emergency contact
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <TextField
                    label="Contact name"
                    value={form.emergencyContactName}
                    onChange={(v) => update({ emergencyContactName: v })}
                    placeholder="e.g. Riya Mehta"
                  />
                  <TextField
                    label="Phone number"
                    value={form.emergencyContactPhone}
                    onChange={(v) => update({ emergencyContactPhone: v })}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center gap-2">
                  <ShieldCheck size={15} className="text-orange-400" />
                  Local guardian (optional)
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <TextField
                    label="Guardian name"
                    value={form.guardianName}
                    onChange={(v) => update({ guardianName: v })}
                    placeholder="On-ground contact"
                  />
                  <TextField
                    label="Phone number"
                    value={form.guardianPhone}
                    onChange={(v) => update({ guardianPhone: v })}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              <TextField
                label="Travel insurance policy ID"
                icon={ShieldCheck}
                value={form.insurancePolicyId}
                onChange={(v) => update({ insurancePolicyId: v })}
                placeholder="e.g. ICICI-TRV-88213"
              />
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-between shrink-0 bg-black/30">
          {step > 0 ? (
            <SecondaryButton icon={ChevronLeft} onClick={handleBack}>
              Back
            </SecondaryButton>
          ) : (
            <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          )}

          {step < STEP_META.length - 1 ? (
            <PrimaryButton
              icon={ChevronRight}
              onClick={handleNext}
              disabled={!canAdvance}
              className="flex-row-reverse"
            >
              Next
            </PrimaryButton>
          ) : (
            <PrimaryButton icon={Check} onClick={handleSubmit}>
              Save profile
            </PrimaryButton>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SCREEN: PROFILE MANAGER HUB                                        */
/* ------------------------------------------------------------------ */

function ProfileCard({ profile }) {
  return (
    <GlassCard className="p-5 flex flex-col">
      <div className="flex items-start gap-3.5">
        <span
          className={`h-12 w-12 shrink-0 rounded-full ${profile.avatarColor} flex items-center justify-center text-white font-bold`}
        >
          {profile.initials}
        </span>
        <div className="min-w-0">
          <h3 className="font-semibold text-white truncate">
            {profile.name}
          </h3>
          <p className="text-xs text-zinc-500">
            {profile.age} yrs \u00b7 {profile.mobility}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2.5 flex-1">
        <div>
          <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
            Dietary
          </p>
          <div className="flex flex-wrap gap-1.5">
            {profile.dietary.length ? (
              profile.dietary.map((d) => (
                <Pill key={d} tone={d.includes("Allergy") ? "rose" : "teal"}>
                  {d}
                </Pill>
              ))
            ) : (
              <span className="text-xs text-zinc-600">No flags</span>
            )}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
            Vibe
          </p>
          <div className="flex flex-wrap gap-1.5">
            {profile.vibe.map((v) => (
              <Pill key={v} tone="emerald">
                {v}
              </Pill>
            ))}
          </div>
        </div>
      </div>

      {profile.medical.length > 0 && (
        <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center gap-1.5">
          <Stethoscope size={13} className="text-rose-400 shrink-0" />
          <span className="text-xs text-zinc-400 truncate">
            {profile.medical.join(", ")}
          </span>
        </div>
      )}
    </GlassCard>
  );
}

function AddProfileCard({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-zinc-700 hover:border-sky-500 hover:bg-sky-950/20 transition-colors min-h-[220px] group"
    >
      <div className="h-16 w-16 rounded-full bg-zinc-900 border-2 border-zinc-700 group-hover:border-sky-500 group-hover:bg-sky-500 flex items-center justify-center transition-colors shadow-sm">
        <Plus
          size={26}
          className="text-zinc-500 group-hover:text-white transition-colors"
        />
      </div>
      <span className="text-sm font-semibold text-zinc-500 group-hover:text-sky-300">
        Add Profile
      </span>
    </button>
  );
}

function ProfilesScreen() {
  const { userProfiles, setNavigation } = useTripPlanner();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Profile manager
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Medical, dietary, and vibe details power every downstream
            recommendation.
          </p>
        </div>
        <PrimaryButton icon={UserPlus} onClick={() => setModalOpen(true)}>
          Add traveler
        </PrimaryButton>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {userProfiles.map((p) => (
          <ProfileCard key={p.id} profile={p} />
        ))}
        <AddProfileCard onClick={() => setModalOpen(true)} />
      </div>

      <div className="mt-8 flex justify-end">
        <PrimaryButton icon={ArrowRight} onClick={() => setNavigation("HOME")}>
          Continue to dashboard
        </PrimaryButton>
      </div>

      {modalOpen && (
        <AddProfileModal onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SCREEN: HOME / DISCOVERY DASHBOARD                                 */
/* ------------------------------------------------------------------ */

function ACCESSIBILITY_TONE(level) {
  if (level === "Easy Access") return { tone: "emerald", label: "Easy Access" };
  if (level === "Moderate Terrain") return { tone: "amber", label: "Moderate Terrain" };
  return { tone: "rose", label: "Difficult Terrain" };
}

function CROWD_TONE(level) {
  if (level === "Low") return { dot: "bg-sky-400", text: "text-sky-200", label: "Low crowd \u00b7 serene" };
  if (level === "Medium") return { dot: "bg-amber-400", text: "text-amber-300", label: "Medium crowd" };
  return { dot: "bg-rose-500", text: "text-rose-300", label: "High crowd \u00b7 popular hub" };
}

function POICard({ poi, matchScore, isWishlisted, onToggleWishlist }) {
  const accessibility = ACCESSIBILITY_TONE(poi.accessibility);
  const crowd = CROWD_TONE(poi.crowdDensity);

  return (
    <GlassCard className="overflow-hidden flex flex-col">
      <div
        className={`relative h-32 bg-gradient-to-br ${poi.gradient} flex items-center justify-center`}
      >
        <poi.icon size={34} className="text-white/90" />
        <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 bg-black/80 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full border border-zinc-800">
          <TrendingUp size={12} className="text-sky-400" />
          {matchScore}% Vibe Match
        </span>
        <span className="absolute bottom-2.5 right-2.5 text-white/60">
          <ImageIcon size={14} />
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-white text-sm leading-snug">
          {poi.name}
        </h3>
        <p className="text-xs text-zinc-500 mt-1 flex-1">{poi.blurb}</p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full bg-zinc-950 border border-zinc-800 ${crowd.text}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${crowd.dot}`} />
            {crowd.label}
          </span>
          <Pill tone={accessibility.tone}>
            <Accessibility size={11} /> {accessibility.label}
          </Pill>
        </div>

        <button
          onClick={() => onToggleWishlist(poi.id)}
          className={`mt-3.5 w-full inline-flex items-center justify-center gap-1.5 text-sm font-semibold px-3 py-2.5 rounded-md transition-colors ${
            isWishlisted
              ? "bg-sky-950/40 text-sky-200 border border-sky-800/50"
              : "bg-zinc-800 text-white hover:bg-sky-900"
          }`}
        >
          <Heart
            size={15}
            className={isWishlisted ? "fill-sky-400 text-sky-400" : ""}
          />
          {isWishlisted ? "Added to Wishlist" : "Add to Trip Wishlist"}
        </button>
      </div>
    </GlassCard>
  );
}

function HomeScreen() {
  const {
    activeTrip,
    userProfiles,
    activeProfileId,
    wishlist,
    toggleWishlist,
    setNavigation,
  } = useTripPlanner();

  const activeProfile =
    userProfiles.find((p) => p.id === activeProfileId) || userProfiles[0];

  const firstName = activeProfile.name.split(" ")[0];
  const safeZone = safeZoneStatus(activeProfile);
  const advisories = getHealthAdvisories(activeProfile);

  const rankedPOIs = [...MOCK_POIS]
    .map((poi) => ({ poi, score: computeMatchScore(poi, activeProfile) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <GlassCard className="p-0 overflow-hidden mb-6">
        <div className="bg-gradient-to-br from-black via-zinc-900 to-sky-950 px-6 py-7 relative">
          <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-sky-700/10 to-transparent" />

          <div className="flex items-start gap-4 relative">
            <span
              className={`h-14 w-14 shrink-0 rounded-full ${activeProfile.avatarColor} border-2 border-white/20 flex items-center justify-center text-white font-bold text-lg`}
            >
              {activeProfile.initials}
            </span>
            <div>
              <p className="text-sky-300 text-sm font-medium">
                Welcome back, {firstName}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mt-0.5 flex items-center gap-2 flex-wrap">
                <MapPin size={20} className="text-sky-400" />
                {activeTrip.destination}
              </h1>
              <div className="flex flex-wrap gap-4 mt-2 text-zinc-400 text-sm">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {activeTrip.startDate} → {activeTrip.endDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={14} />
                  {activeTrip.groupSize} travelers
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-5 relative">
            {activeProfile.vibe.map((v) => (
              <span
                key={v}
                className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-white/5 text-sky-200 border border-sky-900/30"
              >
                <Sparkles size={11} />
                {v}
              </span>
            ))}
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                safeZone.tone === "emerald"
                  ? "bg-sky-500/15 text-sky-200 border-sky-500/30"
                  : "bg-amber-400/15 text-amber-300 border-amber-400/30"
              }`}
            >
              <ShieldCheck size={11} />
              {safeZone.label}
            </span>
          </div>
        </div>
      </GlassCard>

      <div className="flex items-center justify-between mb-4 mt-8">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Compass size={18} className="text-sky-400" />
            Matched for {firstName}'s vibe
          </h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            Mined from social hotspots and filtered against this traveler's
            profile.
          </p>
        </div>
        {wishlist.length > 0 && (
          <Pill tone="emerald">
            <Heart size={11} className="fill-sky-400" />
            {wishlist.length} on wishlist
          </Pill>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {rankedPOIs.map(({ poi, score }) => (
          <POICard
            key={poi.id}
            poi={poi}
            matchScore={score}
            isWishlisted={wishlist.includes(poi.id)}
            onToggleWishlist={toggleWishlist}
          />
        ))}
      </div>

      <GlassCard
        className={`p-5 mb-8 border-l-4 ${
          advisories.length ? "border-l-amber-500" : "border-l-sky-500"
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          {advisories.length ? (
            <ShieldAlert size={18} className="text-amber-400" />
          ) : (
            <ShieldCheck size={18} className="text-sky-400" />
          )}
          <h2 className="font-semibold text-white">
            Health & safety advisory
          </h2>
          <span className="ml-auto text-xs text-zinc-500">
            Based on {activeProfile.name}'s profile
          </span>
        </div>

        {advisories.length ? (
          <div className="space-y-2.5">
            {advisories.map((a, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 bg-amber-950/30 border border-amber-800/50 rounded-md px-3.5 py-3"
              >
                <Info size={15} className="text-amber-400 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-200">{a.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-start gap-2.5 bg-sky-950/20 border border-sky-800/40 rounded-md px-3.5 py-3">
            <Check size={15} className="text-sky-400 shrink-0 mt-0.5" />
            <p className="text-sm text-sky-100">
              No medical flags on this profile \u2014 no destination-specific
              cautions right now.
            </p>
          </div>
        )}
      </GlassCard>

      <div className="flex flex-wrap items-center gap-3 justify-center bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-lg p-6">
        <div className="text-center w-full mb-1">
          <p className="text-sm text-zinc-400">
            Ready to turn this into a day-by-day plan?
          </p>
        </div>
        <PrimaryButton
          icon={Sparkles}
          onClick={() => setNavigation("PLANNER_WIZARD")}
          className="!px-6 !py-3 text-base"
        >
          Start Custom Trip Planner
        </PrimaryButton>
        <SecondaryButton
          icon={Users}
          onClick={() => setNavigation("PROFILES")}
          className="!px-6 !py-3 border border-zinc-700"
        >
          Manage Passenger Profiles
        </SecondaryButton>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SCREEN: CUSTOM TRIP PLANNER WIZARD                                 */
/* ------------------------------------------------------------------ */

const WIZARD_STEPS = [
  { key: "destination", label: "Destination & Budget", icon: MapPin },
  { key: "passengers", label: "Passenger Assignment", icon: Users },
  { key: "transit", label: "Transit & Booking", icon: Route },
];

function BudgetAllocationBar({ breakdown }) {
  const segments = [
    { key: "stays", label: "Stays", icon: Wallet, color: "bg-sky-500" },
    { key: "dining", label: "Dining", icon: UtensilsCrossed, color: "bg-orange-500" },
    { key: "transit", label: "Transit", icon: TrainFront, color: "bg-amber-500" },
    { key: "activities", label: "Activities", icon: Percent, color: "bg-rose-600" },
  ];
  return (
    <div>
      <div className="h-3 w-full rounded-full overflow-hidden flex bg-zinc-800">
        {segments.map((s) => (
          <div
            key={s.key}
            className={s.color}
            style={{ width: `${breakdown[s.key]}%` }}
            title={`${s.label} ${breakdown[s.key]}%`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-3 mt-2.5">
        {segments.map((s) => (
          <span
            key={s.key}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400"
          >
            <span className={`h-2 w-2 rounded-full ${s.color}`} />
            {s.label} <span className="text-zinc-200 font-semibold">{breakdown[s.key]}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function DestinationBudgetStep() {
  const { activeTrip, updateTrip } = useTripPlanner();
  const nearby = getNearbyPOIs(activeTrip.destination);
  const nights =
    activeTrip.startDate && activeTrip.endDate
      ? Math.max(
          0,
          Math.round(
            (new Date(activeTrip.endDate) - new Date(activeTrip.startDate)) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <TextField
          label="Destination"
          icon={Search}
          value={activeTrip.destination}
          onChange={(v) => updateTrip({ destination: v })}
          placeholder="e.g. Goa, Himachal Pradesh, Kyoto"
        />
        <div className="flex flex-wrap gap-2 mt-2.5">
          {DESTINATION_SUGGESTIONS.map((d) => (
            <button
              key={d}
              onClick={() => updateTrip({ destination: d })}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                activeTrip.destination === d
                  ? "bg-sky-500 border-sky-500 text-white"
                  : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField
          label="Check-in date"
          icon={Calendar}
          type="date"
          value={activeTrip.startDate}
          onChange={(v) => updateTrip({ startDate: v })}
        />
        <TextField
          label="Check-out date"
          icon={Calendar}
          type="date"
          value={activeTrip.endDate}
          onChange={(v) => updateTrip({ endDate: v })}
        />
      </div>
      <p className="text-xs text-zinc-500 -mt-3">
        Duration: <span className="text-sky-300 font-semibold">{nights} nights</span>
      </p>

      <div className="grid sm:grid-cols-3 gap-4">
        <TextField
          label="Group size"
          icon={Users}
          type="number"
          value={activeTrip.groupSize}
          onChange={(v) => updateTrip({ groupSize: Number(v) || 0 })}
        />
        <TextField
          label={`Total trip budget (${activeTrip.currency})`}
          icon={Wallet}
          type="number"
          value={activeTrip.totalBudget}
          onChange={(v) => updateTrip({ totalBudget: Number(v) || 0 })}
        />
        <TextField
          label={`Daily per-person cap (${activeTrip.currency})`}
          icon={Percent}
          type="number"
          value={activeTrip.dailyPerPersonBudget}
          onChange={(v) => updateTrip({ dailyPerPersonBudget: Number(v) || 0 })}
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-zinc-200 mb-2">
          Budget allocation
        </h3>
        <BudgetAllocationBar breakdown={activeTrip.budgetBreakdown} />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-zinc-200 mb-1">
          Nearby feasible POIs
        </h3>
        <p className="text-xs text-zinc-500 mb-3">
          Select attractions near {activeTrip.destination || "your destination"} to
          seed the itinerary.
        </p>
        <div className="flex flex-wrap gap-2">
          {nearby.map((poi) => (
            <Chip
              key={poi}
              label={poi}
              icon={MapPin}
              active={activeTrip.nearbyPOIs.includes(poi)}
              onClick={() =>
                updateTrip({
                  nearbyPOIs: toggleInArray(activeTrip.nearbyPOIs, poi),
                })
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PassengerAssignmentStep() {
  const { userProfiles, activeTrip, updateTrip } = useTripPlanner();
  const [inviteOpen, setInviteOpen] = useState(false);

  const selectedProfiles = userProfiles.filter((p) =>
    activeTrip.selectedProfileIds.includes(p.id)
  );
  const warnings = getGroupRiskWarnings(selectedProfiles);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-200">
            Assign travelers to this trip
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Select which saved profiles are joining.
          </p>
        </div>
        <SecondaryButton
          icon={UserPlus}
          onClick={() => setInviteOpen(true)}
          className="border border-zinc-700 !text-sky-300"
        >
          + Invite / Add New Profile
        </SecondaryButton>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {userProfiles.map((p) => {
          const selected = activeTrip.selectedProfileIds.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() =>
                updateTrip({
                  selectedProfileIds: toggleInArray(
                    activeTrip.selectedProfileIds,
                    p.id
                  ),
                })
              }
              className={`flex items-center gap-3 text-left px-4 py-3 rounded-md border transition-colors ${
                selected
                  ? "bg-sky-950/30 border-sky-700/60"
                  : "bg-zinc-900 border-zinc-800 hover:border-zinc-600"
              }`}
            >
              <span
                className={`h-10 w-10 shrink-0 rounded-full ${p.avatarColor} flex items-center justify-center text-white text-xs font-bold`}
              >
                {p.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-100 truncate">
                  {p.name}
                </p>
                <p className="text-xs text-zinc-500">
                  {p.age} yrs {p.medical.length ? `\u00b7 ${p.medical.join(", ")}` : ""}
                </p>
              </div>
              <span
                className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  selected ? "bg-sky-500 border-sky-500" : "border-zinc-600"
                }`}
              >
                {selected && <Check size={12} className="text-white" />}
              </span>
            </button>
          );
        })}
      </div>

      {warnings.length > 0 && (
        <div className="space-y-2">
          {warnings.map((w, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 bg-amber-950/30 border border-amber-800/50 rounded-md px-3.5 py-3"
            >
              <AlertOctagon size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-200">{w}</p>
            </div>
          ))}
        </div>
      )}

      {inviteOpen && (
        <AddProfileModal
          onClose={() => setInviteOpen(false)}
          onCreated={(profile) =>
            updateTrip({
              selectedProfileIds: [...activeTrip.selectedProfileIds, profile.id],
            })
          }
        />
      )}
    </div>
  );
}

function TransitBookingStep() {
  const { activeTrip, updateTrip } = useTripPlanner();
  const transit = activeTrip.transit;

  const updateTransit = (patch) =>
    updateTrip({ transit: { ...transit, ...patch } });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-zinc-200 mb-2">
          Transit medium
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <button
            onClick={() => updateTransit({ mode: "Self-Drive" })}
            className={`flex items-center gap-3 px-4 py-4 rounded-md border transition-colors text-left ${
              transit.mode === "Self-Drive"
                ? "bg-sky-950/30 border-sky-700/60"
                : "bg-zinc-900 border-zinc-800 hover:border-zinc-600"
            }`}
          >
            <Car size={20} className="text-sky-300" />
            <div>
              <p className="text-sm font-semibold text-zinc-100">
                Own Vehicle / Self-Drive
              </p>
              <p className="text-xs text-zinc-500">Full route flexibility</p>
            </div>
          </button>
          <button
            onClick={() => updateTransit({ mode: "Public Transport" })}
            className={`flex items-center gap-3 px-4 py-4 rounded-md border transition-colors text-left ${
              transit.mode === "Public Transport"
                ? "bg-sky-950/30 border-sky-700/60"
                : "bg-zinc-900 border-zinc-800 hover:border-zinc-600"
            }`}
          >
            <Plane size={20} className="text-sky-300" />
            <div>
              <p className="text-sm font-semibold text-zinc-100">
                Public Transport
              </p>
              <p className="text-xs text-zinc-500">Flights & trains</p>
            </div>
          </button>
        </div>
      </div>

      {transit.mode === "Public Transport" && (
        <div className="grid sm:grid-cols-2 gap-4">
          <TextField
            label="Flight number"
            icon={Plane}
            value={transit.flightNumber}
            onChange={(v) => updateTransit({ flightNumber: v })}
            placeholder="e.g. 6E 204"
          />
          <TextField
            label="Train number"
            icon={TrainFront}
            value={transit.trainNumber}
            onChange={(v) => updateTransit({ trainNumber: v })}
            placeholder="e.g. 12628"
          />
          <TextField
            label="Departure hub"
            icon={MapPin}
            value={transit.departureHub}
            onChange={(v) => updateTransit({ departureHub: v })}
            placeholder="e.g. Bengaluru (BLR)"
          />
          <TextField
            label="Arrival hub"
            icon={MapPin}
            value={transit.arrivalHub}
            onChange={(v) => updateTransit({ arrivalHub: v })}
            placeholder="e.g. Mangaluru (IXE)"
          />
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-zinc-200 mb-2">
          Book directly
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {BOOKING_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 px-4 py-3 rounded-md border border-zinc-800 bg-zinc-900 hover:border-sky-700/60 hover:bg-sky-950/20 transition-colors"
            >
              <span className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                <link.icon size={16} className="text-sky-300" />
                {link.name}
              </span>
              <ExternalLink size={14} className="text-zinc-500" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlannerWizardScreen() {
  const { activeTrip, setNavigation, regenerateRoute } = useTripPlanner();
  const [wizardStep, setWizardStep] = useState(0);

  const nightsValid =
    activeTrip.startDate &&
    activeTrip.endDate &&
    new Date(activeTrip.endDate) > new Date(activeTrip.startDate);

  const step0Valid =
    activeTrip.destination.trim().length > 0 &&
    nightsValid &&
    activeTrip.groupSize > 0 &&
    activeTrip.totalBudget > 0;

  const step1Valid = activeTrip.selectedProfileIds.length > 0;

  const step2Valid =
    activeTrip.transit.mode === "Self-Drive" ||
    (activeTrip.transit.departureHub.trim().length > 0 &&
      activeTrip.transit.arrivalHub.trim().length > 0);

  const validForStep = [step0Valid, step1Valid, step2Valid];

  const handleNext = () => {
    if (!validForStep[wizardStep]) return;
    if (wizardStep === WIZARD_STEPS.length - 1) {
      regenerateRoute();
      setNavigation("ITINERARY_OUTPUT");
    } else {
      setWizardStep((s) => s + 1);
    }
  };
  const handleBack = () => setWizardStep((s) => Math.max(0, s - 1));

  return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      <h1 className="text-2xl font-bold text-white mb-1">
        Custom trip planner
      </h1>
      <p className="text-sm text-zinc-500 mb-6">
        Every field here writes straight into the active trip state.
      </p>

      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-8">
          {WIZARD_STEPS.map((s, i) => (
            <React.Fragment key={s.key}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    i < wizardStep
                      ? "bg-sky-500 border-sky-500 text-white"
                      : i === wizardStep
                      ? "border-sky-500 text-sky-300 bg-sky-950/30"
                      : "border-zinc-700 text-zinc-600"
                  }`}
                >
                  {i < wizardStep ? <Check size={16} /> : <s.icon size={16} />}
                </div>
                <span className="text-xs text-zinc-400 hidden sm:block text-center max-w-[90px]">
                  {s.label}
                </span>
              </div>
              {i < WIZARD_STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1 ${
                    i < wizardStep ? "bg-sky-500" : "bg-zinc-800"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {wizardStep === 0 && <DestinationBudgetStep />}
        {wizardStep === 1 && <PassengerAssignmentStep />}
        {wizardStep === 2 && <TransitBookingStep />}

        <div className="flex justify-between mt-8">
          {wizardStep > 0 ? (
            <SecondaryButton icon={ChevronLeft} onClick={handleBack}>
              Back
            </SecondaryButton>
          ) : (
            <span />
          )}
          {wizardStep < WIZARD_STEPS.length - 1 ? (
            <PrimaryButton
              icon={ChevronRight}
              onClick={handleNext}
              disabled={!validForStep[wizardStep]}
              className="flex-row-reverse"
            >
              Next step
            </PrimaryButton>
          ) : (
            <PrimaryButton
              icon={Route}
              onClick={handleNext}
              disabled={!validForStep[wizardStep]}
            >
              Generate AI Route & Dynamic Map
            </PrimaryButton>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SCREEN: OUTPUT WORKSPACE (interactive node map + timeline + tabs)  */
/* ------------------------------------------------------------------ */

function distanceForIndex(i) {
  const km = (2 + i * 1.3).toFixed(1);
  const mins = 10 + i * 6;
  return `${mins} min \u00b7 ${km} km`;
}

function NodeMap({ stops, selectedId, onSelectNode }) {
  const spacing = 150;
  const width = Math.max(600, stops.length * spacing + 80);
  const midY = 110;

  const points = stops.map((s, i) => ({
    ...s,
    x: 60 + i * spacing,
    y: midY + (i % 2 === 0 ? -35 : 35),
  }));

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} 220`}
        className="w-full"
        style={{ minWidth: `${width}px`, height: "220px" }}
      >
        {points.slice(1).map((p, idx) => {
          const prev = points[idx];
          return (
            <g key={`link-${p.id}`}>
              <line
                x1={prev.x}
                y1={prev.y}
                x2={p.x}
                y2={p.y}
                stroke="#0c4a6e"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
              <rect
                x={(prev.x + p.x) / 2 - 44}
                y={(prev.y + p.y) / 2 - 12}
                width="88"
                height="20"
                rx="4"
                fill="#09090b"
                stroke="#0c4a6e"
              />
              <text
                x={(prev.x + p.x) / 2}
                y={(prev.y + p.y) / 2 + 4}
                textAnchor="middle"
                fontSize="9"
                fill="#38bdf8"
                fontWeight="600"
              >
                {distanceForIndex(idx)}
              </text>
            </g>
          );
        })}

        {points.map((p, i) => (
          <g
            key={p.id}
            onClick={() => onSelectNode(p.id)}
            className="cursor-pointer"
          >
            <circle
              cx={p.x}
              cy={p.y}
              r="22"
              fill={selectedId === p.id ? "#0ea5e9" : p.pinned ? "#78350f" : "#18181b"}
              stroke={selectedId === p.id ? "#7dd3fc" : "#0c4a6e"}
              strokeWidth="2.5"
            />
            <text
              x={p.x}
              y={p.y + 5}
              textAnchor="middle"
              fontSize="13"
              fontWeight="700"
              fill="#fff"
            >
              {i + 1}
            </text>
            <text
              x={p.x}
              y={p.y + (i % 2 === 0 ? -34 : 50)}
              textAnchor="middle"
              fontSize="10.5"
              fontWeight="600"
              fill="#e4e4e7"
            >
              {p.name.length > 20 ? p.name.slice(0, 18) + "\u2026" : p.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function NodeEditPanel({ stop, onRename, onMove, onTogglePin, onRemove, onClose, canMoveLeft, canMoveRight }) {
  return (
    <div className="mt-4 bg-black/50 border border-zinc-800 rounded-md p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-sky-300 uppercase tracking-wide">
          Editing node
        </span>
        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200">
          <X size={16} />
        </button>
      </div>
      <TextField
        label="Stop name"
        icon={MapPin}
        value={stop.name}
        onChange={onRename}
      />
      <div className="flex flex-wrap gap-2 mt-3">
        <SecondaryButton
          icon={ChevronLeft}
          onClick={() => onMove(-1)}
          className="border border-zinc-700"
        >
          {canMoveLeft ? "Move earlier" : "First stop"}
        </SecondaryButton>
        <SecondaryButton
          icon={ChevronRight}
          onClick={() => onMove(1)}
          className="border border-zinc-700 flex-row-reverse"
        >
          {canMoveRight ? "Move later" : "Last stop"}
        </SecondaryButton>
        <SecondaryButton
          icon={PinIcon}
          onClick={onTogglePin}
          className={`border ${stop.pinned ? "border-amber-700 text-amber-400" : "border-zinc-700"}`}
        >
          {stop.pinned ? "Unpin stop" : "Pin stop"}
        </SecondaryButton>
        <SecondaryButton
          icon={Trash2}
          onClick={onRemove}
          className="border border-rose-900/60 !text-rose-400 hover:bg-rose-500/10"
        >
          Remove
        </SecondaryButton>
      </div>
    </div>
  );
}

function TimelinePanel({ stops, selectedId, onSelectNode, onReorder, onTogglePin, onRemove }) {
  const [draggedId, setDraggedId] = useState(null);

  const handleDrop = (targetId) => {
    if (!draggedId || draggedId === targetId) return;
    const fromIdx = stops.findIndex((s) => s.id === draggedId);
    const toIdx = stops.findIndex((s) => s.id === targetId);
    onReorder(fromIdx, toIdx);
    setDraggedId(null);
  };

  return (
    <GlassCard className="p-4 lg:sticky lg:top-20">
      <h2 className="font-semibold text-white flex items-center gap-2 mb-1">
        <Clock size={16} className="text-sky-400" />
        Daily timeline
      </h2>
      <p className="text-xs text-zinc-500 mb-4">
        Drag rows to reorder \u2014 changes reflect on the map instantly.
      </p>

      <div className="space-y-2.5">
        {stops.map((stop, i) => (
          <div
            key={stop.id}
            draggable
            onDragStart={() => setDraggedId(stop.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(stop.id)}
            onClick={() => onSelectNode(stop.id)}
            className={`flex items-start gap-2.5 rounded-md border px-3 py-2.5 cursor-pointer transition-colors ${
              selectedId === stop.id
                ? "bg-sky-950/30 border-sky-700/60"
                : "bg-zinc-950 border-zinc-800 hover:border-zinc-600"
            }`}
          >
            <GripVertical size={14} className="text-zinc-600 mt-1 shrink-0 cursor-grab" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-sky-300">
                  #{i + 1}
                </span>
                <span className="text-xs font-semibold text-zinc-500">{stop.time}</span>
                {stop.pinned && (
                  <PinIcon size={11} className="text-amber-500" />
                )}
              </div>
              <p className="text-sm font-medium text-zinc-100 truncate">
                {stop.name}
              </p>
              <p className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                <Sun size={10} /> {stop.window}
              </p>
              <p className="text-[11px] text-zinc-600">Dwell: {stop.dwell}</p>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(stop.id);
                }}
                className={`h-6 w-6 rounded-full flex items-center justify-center ${
                  stop.pinned ? "bg-amber-900/40 text-amber-400" : "text-zinc-600 hover:text-zinc-300"
                }`}
                title="Pin / unpin"
              >
                <PinIcon size={12} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(stop.id);
                }}
                className="h-6 w-6 rounded-full flex items-center justify-center text-zinc-600 hover:text-rose-400"
                title="Remove stop"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        ))}
        {stops.length === 0 && (
          <p className="text-sm text-zinc-600 text-center py-6">
            No stops left \u2014 every location has been removed.
          </p>
        )}
      </div>
    </GlassCard>
  );
}

/* ---------- Module 1: Integrated Offline Toolkit ---------- */

function LanguagePackWidget({ destination }) {
  const { offlinePackDownloaded, setOfflinePackDownloaded } = useTripPlanner();
  const pack = getLanguagePack(destination);
  const [status, setStatus] = useState(offlinePackDownloaded ? "done" : "idle"); // idle | downloading | done

  const handleDownload = () => {
    if (status !== "idle") return;
    setStatus("downloading");
    setTimeout(() => {
      setStatus("done");
      setOfflinePackDownloaded(true);
    }, 1400);
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-md p-4">
      <div className="flex items-center gap-2 mb-1">
        <Languages size={15} className="text-sky-400" />
        <h3 className="text-sm font-semibold text-zinc-100">
          Destination Language Engine
        </h3>
      </div>
      <p className="text-xs text-zinc-500 mb-3">
        Detected primary language: <span className="text-sky-300 font-semibold">{pack.language}</span>
      </p>
      <button
        onClick={handleDownload}
        disabled={status === "downloading"}
        className={`w-full inline-flex items-center justify-center gap-2 text-sm font-semibold px-3 py-2.5 rounded-md transition-colors ${
          status === "done"
            ? "bg-sky-500/10 text-sky-200 border border-sky-400/30"
            : "bg-sky-400 hover:bg-sky-300 text-zinc-950"
        }`}
      >
        {status === "idle" && <Download size={15} />}
        {status === "downloading" && <RefreshCcw size={15} className="animate-spin" />}
        {status === "done" && <Check size={15} />}
        {status === "idle" && `Download Offline Voice & Text Pack (${pack.size})`}
        {status === "downloading" && `Downloading ${pack.language} pack\u2026`}
        {status === "done" && `${pack.language} pack ready offline`}
      </button>
    </div>
  );
}

function OCRTranslatorWidget({ groupDietaryFlags }) {
  const [scanning, setScanning] = useState(false);

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-md p-4">
      <div className="flex items-center gap-2 mb-1">
        <ScanLine size={15} className="text-sky-400" />
        <h3 className="text-sm font-semibold text-zinc-100">
          OCR Menu & Signboard Translator
        </h3>
      </div>
      <p className="text-xs text-zinc-500 mb-3">
        Simulated camera scan \u2014 overlays allergy warnings from the group's dietary flags.
      </p>

      <button
        onClick={() => setScanning((s) => !s)}
        className={`w-full flex flex-col items-center justify-center gap-1.5 h-24 rounded-md border-2 border-dashed transition-colors mb-3 ${
          scanning ? "border-sky-500 bg-sky-950/20" : "border-zinc-700 hover:border-zinc-500"
        }`}
      >
        <Camera size={22} className={scanning ? "text-sky-300 animate-pulse" : "text-zinc-500"} />
        <span className="text-xs font-medium text-zinc-400">
          {scanning ? "Scanning menu\u2026 tap to stop" : "Tap to scan a menu / signboard"}
        </span>
      </button>

      {scanning && (
        <div className="space-y-1.5">
          {MENU_SAMPLE.map((item) => {
            const flagged = item.allergens.some((a) => groupDietaryFlags.includes(a));
            return (
              <div
                key={item.original}
                className={`flex items-center justify-between gap-2 px-3 py-2 rounded-md border text-xs ${
                  flagged
                    ? "bg-rose-950/30 border-rose-800/50"
                    : "bg-zinc-900 border-zinc-800"
                }`}
              >
                <div>
                  <p className="text-zinc-500">{item.original}</p>
                  <p className={`font-medium ${flagged ? "text-rose-300" : "text-zinc-200"}`}>
                    {item.translated}
                  </p>
                </div>
                {flagged && (
                  <span className="inline-flex items-center gap-1 text-rose-300 font-semibold shrink-0">
                    <AlertOctagon size={12} /> {item.allergens.join(", ")}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function VoiceTranslatorWidget() {
  const [listening, setListening] = useState(false);
  const bars = Array.from({ length: 22 });

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-md p-4">
      <div className="flex items-center gap-2 mb-1">
        <Volume2Icon />
        <h3 className="text-sm font-semibold text-zinc-100">
          Multilingual Voice Translator
        </h3>
      </div>
      <p className="text-xs text-zinc-500 mb-3">
        Two-way offline speech translation for on-ground conversations.
      </p>

      <div className="flex items-center justify-center gap-[3px] h-14 bg-zinc-900 border border-zinc-800 rounded-md px-3 mb-3 overflow-hidden">
        {bars.map((_, i) => (
          <span
            key={i}
            className={`w-1 rounded-full ${listening ? "bg-sky-400 animate-pulse" : "bg-zinc-700"}`}
            style={{
              height: listening
                ? `${20 + Math.round(18 * Math.abs(Math.sin(i * 0.9)))}px`
                : "6px",
              animationDelay: `${i * 60}ms`,
            }}
          />
        ))}
      </div>

      <button
        onClick={() => setListening((l) => !l)}
        className={`w-full inline-flex items-center justify-center gap-2 text-sm font-semibold px-3 py-2.5 rounded-md transition-colors ${
          listening
            ? "bg-sky-500 text-white"
            : "bg-zinc-800 text-zinc-200 hover:bg-sky-900"
        }`}
      >
        <Mic size={15} />
        {listening ? "Listening\u2026 tap to stop" : "Tap to speak"}
      </button>
    </div>
  );
}

function Volume2Icon() {
  return <Globe size={15} className="text-sky-400" />;
}

function OfflineToolkitPanel({ destination, groupDietaryFlags }) {
  return (
    <div className="grid md:grid-cols-2 gap-3">
      <LanguagePackWidget destination={destination} />
      <VoiceTranslatorWidget />
      <div className="md:col-span-2">
        <OCRTranslatorWidget groupDietaryFlags={groupDietaryFlags} />
      </div>
    </div>
  );
}

/* ---------- Module 2: Live Expenditure & Burn-Rate Tracker ---------- */

function BurnRateTracker({ budgetBreakdown, stops, setStops }) {
  const [spend, setSpend] = useState({ stays: 92, dining: 112, transit: 58, activities: 70 });

  const buckets = [
    { key: "stays", label: "Stays", icon: Wallet },
    { key: "dining", label: "Dining", icon: UtensilsCrossed },
    { key: "transit", label: "Transit", icon: TrainFront },
    { key: "activities", label: "Activities", icon: Percent },
  ];

  const overBudget = buckets.filter((b) => spend[b.key] > 100);

  const handleReplan = () => {
    if (stops.length === 0) return;
    const swapIdx = stops.findIndex((s) => !s.pinned) === -1 ? 0 : stops.findIndex((s) => !s.pinned);
    setStops((prev) =>
      prev.map((s, i) =>
        i === swapIdx
          ? { ...s, name: `${s.name.split(" (swapped")[0]} (swapped \u2192 Free Scenic Viewpoint)` }
          : s
      )
    );
    setSpend((prev) => {
      const next = { ...prev };
      overBudget.forEach((b) => {
        next[b.key] = 88;
      });
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        {buckets.map((b) => {
          const pct = spend[b.key];
          const over = pct > 100;
          return (
            <div key={b.key} className="bg-zinc-950 border border-zinc-800 rounded-md p-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                  <b.icon size={13} className="text-sky-400" /> {b.label}
                </span>
                <span className={`text-xs font-bold ${over ? "text-rose-400" : "text-zinc-400"}`}>
                  {pct}% of {budgetBreakdown[b.key]}% bucket
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${over ? "bg-rose-600 animate-pulse" : "bg-sky-500"}`}
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {overBudget.length > 0 && (
        <div className="flex items-start gap-3 bg-rose-950/30 border border-rose-800/50 rounded-md px-4 py-3.5">
          <AlertOctagon size={18} className="text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-rose-200">
              Overspending detected: {overBudget.map((b) => b.label).join(", ")}
            </p>
            <p className="text-xs text-rose-300/80 mt-0.5">
              Swap a paid attraction for a free scenic viewpoint to bring this trip back on budget.
            </p>
          </div>
          <PrimaryButton icon={RefreshCcw} onClick={handleReplan} className="!px-3 !py-2 text-xs shrink-0">
            Compensatory Re-Plan
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}

/* ---------- Module 3: Smart Dining & Stay Matrix ---------- */

function DiningStayMatrix({ groupDietaryFlags, costCap }) {
  const evaluated = DINING_SPOTS.map((spot) => ({
    spot,
    ...evaluateDiningSpot(spot, groupDietaryFlags, costCap),
  })).sort((a, b) => (a.pass === b.pass ? a.spot.distanceKm - b.spot.distanceKm : a.pass ? -1 : 1));

  const radius = 90;
  const center = 100;

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-md p-4 flex flex-col items-center">
        <p className="text-xs font-semibold text-zinc-400 mb-2 self-start flex items-center gap-1.5">
          <Radar size={13} className="text-sky-400" /> Proximity radar
        </p>
        <svg viewBox="0 0 200 200" className="w-full max-w-[220px]">
          {[30, 60, 90].map((r) => (
            <circle key={r} cx={center} cy={center} r={r} fill="none" stroke="#3f3f46" strokeWidth="1" />
          ))}
          <line x1={center} y1="10" x2={center} y2="190" stroke="#27272a" strokeWidth="1" />
          <line x1="10" y1={center} x2="190" y2={center} stroke="#27272a" strokeWidth="1" />
          {evaluated.map(({ spot, pass }, i) => {
            const angle = (i / evaluated.length) * 2 * Math.PI;
            const r = Math.min(1, spot.distanceKm / 3.5) * radius;
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            return (
              <circle
                key={spot.id}
                cx={x}
                cy={y}
                r="6"
                fill={pass ? "#0ea5e9" : "#3f3f46"}
                stroke={pass ? "#7dd3fc" : "#71717a"}
                strokeWidth="1.5"
              />
            );
          })}
          <circle cx={center} cy={center} r="4" fill="#38bdf8" />
        </svg>
        <p className="text-[10px] text-zinc-600 mt-1">Center = your stay \u00b7 rings = 1 / 2 / 3.5 km</p>
      </div>

      <div className="space-y-2">
        {evaluated.map(({ spot, pass, reasons }) => (
          <div
            key={spot.id}
            className={`px-3.5 py-2.5 rounded-md border text-xs ${
              pass ? "bg-sky-950/20 border-sky-800/50" : "bg-zinc-900 border-zinc-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`font-semibold ${pass ? "text-sky-200" : "text-zinc-500"}`}>
                {spot.name}
              </span>
              {pass ? (
                <Check size={13} className="text-sky-300 shrink-0" />
              ) : (
                <X size={13} className="text-zinc-600 shrink-0" />
              )}
            </div>
            <p className="text-zinc-500 mt-0.5">
              {spot.cuisine} \u00b7 \u20B9{spot.costForTwo} for two \u00b7 {spot.distanceKm} km
            </p>
            {!pass && (
              <p className="text-rose-400/80 mt-1">{reasons.join(" \u00b7 ")}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Module 4: Dynamic Adaptation & Weather Reroute Simulator ---------- */

function WeatherRerouteSimulator({ stops, setStops, destination }) {
  const [simulating, setSimulating] = useState(false);
  const [snapshot, setSnapshot] = useState(null);
  const [checked, setChecked] = useState({});

  const checklist = getRegulatoryChecklist(destination);

  const handleToggleStorm = () => {
    if (!simulating) {
      setSnapshot(stops);
      setStops((prev) =>
        prev.map((s, i) => {
          if (isOutdoorStop(s)) {
            return {
              ...s,
              name: `${s.name} \u2192 Indoor Alt: Heritage Museum Hall`,
              icon: Landmark,
              time: `${s.time} (+${(i + 1) * 20} min reroute)`,
            };
          }
          return { ...s, time: `${s.time} (+${(i + 1) * 10} min delay)` };
        })
      );
      setSimulating(true);
    } else {
      if (snapshot) setStops(snapshot);
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-5">
      <div
        className={`flex items-start gap-3 rounded-md border px-4 py-3.5 ${
          simulating ? "bg-rose-950/30 border-rose-800/50" : "bg-zinc-950 border-zinc-800"
        }`}
      >
        <CloudRain size={18} className={simulating ? "text-rose-400" : "text-zinc-500"} />
        <div className="flex-1">
          <p className="text-sm font-semibold text-zinc-100">
            {simulating ? "Storm / severe traffic simulation active" : "Simulate Storm / Severe Traffic"}
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">
            {simulating
              ? "Outdoor stops rerouted indoors; arrival times recalculated on the map and timeline."
              : "Live re-optimizes the route \u2014 outdoor stops shift to indoor cultural landmarks."}
          </p>
        </div>
        <button
          onClick={handleToggleStorm}
          className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-md transition-colors ${
            simulating
              ? "bg-rose-600 text-white"
              : "bg-sky-400 text-zinc-950 hover:bg-sky-300"
          }`}
        >
          <RefreshCcw size={13} />
          {simulating ? "Revert route" : "Run simulation"}
        </button>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-zinc-200 mb-2 flex items-center gap-1.5">
          <ListChecks size={15} className="text-sky-400" />
          Pre-departure regulatory checklist
        </h3>
        <div className="space-y-1.5">
          {checklist.map((item, i) => (
            <label
              key={i}
              className="flex items-start gap-2.5 bg-zinc-950 border border-zinc-800 rounded-md px-3.5 py-2.5 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={!!checked[i]}
                onChange={() => setChecked((c) => ({ ...c, [i]: !c[i] }))}
                className="mt-0.5 accent-sky-500"
              />
              <span className={`text-sm ${checked[i] ? "text-zinc-600 line-through" : "text-zinc-300"}`}>
                {item}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Unified cockpit tab bar (below the interactive map) ---------- */

const COCKPIT_TABS = [
  { key: "offline", label: "Offline Toolkit", icon: Globe },
  { key: "burn", label: "Burn-Rate", icon: Gauge },
  { key: "dining", label: "Dining Matrix", icon: Radar },
  { key: "weather", label: "Weather Reroute", icon: CloudRain },
  { key: "health", label: "Medical Kit", icon: Stethoscope },
  { key: "etiquette", label: "Do's & Don'ts", icon: Scale },
];

function OperationsCockpit({ activeTrip, selectedProfiles, stops, setStops }) {
  const [tab, setTab] = useState("offline");

  const groupDietaryFlags = [...new Set(selectedProfiles.flatMap((p) => p.dietary))];
  const conditionSet = new Set();
  selectedProfiles.forEach((p) => p.medical.forEach((m) => conditionSet.add(m)));
  const kitItems = [...conditionSet].map((c) => MEDICAL_KIT_MAP[c]).filter(Boolean);
  const costCap = (activeTrip.dailyPerPersonBudget || 1500) * 2;

  return (
    <GlassCard className="p-5">
      <div className="flex items-center gap-2 mb-1">
        <Gauge size={16} className="text-sky-400" />
        <h2 className="font-semibold text-white">Travel Operations Cockpit</h2>
      </div>
      <p className="text-xs text-zinc-500 mb-4">
        Every module below reuses live trip, profile, and route state.
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4 border-b border-zinc-800 pb-3">
        {COCKPIT_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3 py-2 rounded-md transition-colors ${
              tab === t.key
                ? "bg-sky-950/40 text-sky-200 border border-sky-800/50"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {tab === "offline" && (
        <OfflineToolkitPanel destination={activeTrip.destination} groupDietaryFlags={groupDietaryFlags} />
      )}

      {tab === "burn" && (
        <BurnRateTracker budgetBreakdown={activeTrip.budgetBreakdown} stops={stops} setStops={setStops} />
      )}

      {tab === "dining" && (
        <DiningStayMatrix groupDietaryFlags={groupDietaryFlags} costCap={costCap} />
      )}

      {tab === "weather" && (
        <WeatherRerouteSimulator stops={stops} setStops={setStops} destination={activeTrip.destination} />
      )}

      {tab === "health" && (
        <div className="space-y-2.5">
          {kitItems.length === 0 && (
            <p className="text-sm text-zinc-500">
              No condition-specific items flagged for this group.
            </p>
          )}
          {kitItems.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-md px-3.5 py-2.5"
            >
              <item.icon size={16} className="text-sky-400 shrink-0" />
              <span className="text-sm text-zinc-200">{item.item}</span>
            </div>
          ))}
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide pt-2">
            Generic essentials
          </p>
          {GENERIC_KIT_ITEMS.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-md px-3.5 py-2.5"
            >
              <Check size={16} className="text-zinc-600 shrink-0" />
              <span className="text-sm text-zinc-400">{item}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "etiquette" && (
        <div className="space-y-2.5">
          {ETIQUETTE_ITEMS.map((e) => (
            <div
              key={e.label}
              className="flex items-start gap-3 bg-zinc-950 border border-zinc-800 rounded-md px-3.5 py-3"
            >
              <e.icon size={16} className="text-sky-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-zinc-100">{e.label}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{e.detail}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}

function ItineraryOutputScreen() {
  const { activeTrip, userProfiles, stops, setStops } = useTripPlanner();
  const [selectedId, setSelectedId] = useState(null);

  const selectedProfiles = userProfiles.filter((p) =>
    activeTrip.selectedProfileIds.includes(p.id)
  );

  const selectedStop = stops.find((s) => s.id === selectedId) || null;
  const selectedIdx = stops.findIndex((s) => s.id === selectedId);

  const handleSelectNode = (id) => setSelectedId((cur) => (cur === id ? null : id));

  const handleReorder = (fromIdx, toIdx) => {
    setStops((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  };

  const handleMove = (direction) => {
    if (selectedIdx === -1) return;
    const targetIdx = selectedIdx + direction;
    if (targetIdx < 0 || targetIdx >= stops.length) return;
    handleReorder(selectedIdx, targetIdx);
  };

  const handleRename = (name) => {
    setStops((prev) => prev.map((s) => (s.id === selectedId ? { ...s, name } : s)));
  };

  const handleTogglePin = (id) => {
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, pinned: !s.pinned } : s)));
  };

  const handleRemove = (id) => {
    setStops((prev) => prev.filter((s) => s.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Route size={22} className="text-sky-400" />
            Output workspace
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {activeTrip.destination} \u00b7 Day 1 \u00b7 live-adaptive route
          </p>
        </div>
        <Pill tone="amber">
          <ShieldAlert size={12} /> Auto-adapted for weather
        </Pill>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <ArrowLeftRight size={16} className="text-sky-400" />
                Connected route map
              </h2>
              <span className="text-xs text-zinc-500">Click a node to edit</span>
            </div>
            <p className="text-xs text-zinc-500 mb-3">
              Nodes are editable, reorderable, and swappable in real time.
            </p>

            {stops.length > 0 ? (
              <NodeMap stops={stops} selectedId={selectedId} onSelectNode={handleSelectNode} />
            ) : (
              <p className="text-sm text-zinc-600 text-center py-10">
                No stops on the route \u2014 add some from the timeline.
              </p>
            )}

            {selectedStop && (
              <NodeEditPanel
                stop={selectedStop}
                onRename={handleRename}
                onMove={handleMove}
                onTogglePin={() => handleTogglePin(selectedStop.id)}
                onRemove={() => handleRemove(selectedStop.id)}
                onClose={() => setSelectedId(null)}
                canMoveLeft={selectedIdx > 0}
                canMoveRight={selectedIdx < stops.length - 1}
              />
            )}
          </GlassCard>

          <OperationsCockpit
            activeTrip={activeTrip}
            selectedProfiles={selectedProfiles}
            stops={stops}
            setStops={setStops}
          />
        </div>

        <div className="lg:col-span-1">
          <TimelinePanel
            stops={stops}
            selectedId={selectedId}
            onSelectNode={handleSelectNode}
            onReorder={handleReorder}
            onTogglePin={handleTogglePin}
            onRemove={handleRemove}
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  GLOBAL FLOATING MODULES: COPILOT / BUCKET LIST / SHARE HUB          */
/* ------------------------------------------------------------------ */

const TIME_SLOTS = ["7:30 AM", "9:15 AM", "11:00 AM", "1:00 PM", "2:45 PM", "4:30 PM", "6:15 PM", "8:00 PM"];

function reoptimizeStops(stopsArr) {
  return stopsArr.map((s, i) => ({ ...s, time: TIME_SLOTS[i % TIME_SLOTS.length] }));
}

function bumpDwell(dwellStr) {
  const num = parseInt(dwellStr, 10) || 45;
  return `${num + 15} min`;
}

const QUICK_PROMPTS = [
  { key: "relax", label: "Make Day 2 more relaxed", icon: Sun },
  { key: "reroute", label: "Swap outdoor trek for an indoor museum", icon: CloudRain },
  { key: "dining", label: "Find a top-rated vegan dinner near Stop 2", icon: UtensilsCrossed },
];

function CopilotDrawer() {
  const { stops, setStops, activeProfileId, userProfiles, setUserProfiles } = useTripPlanner();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm your trip copilot. Try a quick action below or type a request." },
  ]);

  const pushMessage = (role, text) => setMessages((prev) => [...prev, { role, text }]);

  const activeProfile = userProfiles.find((p) => p.id === activeProfileId);

  const runRelax = () => {
    setStops((prev) =>
      reoptimizeStops(prev.map((s) => (s.pinned ? s : { ...s, dwell: bumpDwell(s.dwell) })))
    );
    setUserProfiles((prev) =>
      prev.map((p) => (p.id === activeProfileId ? { ...p, pacing: Math.max(0, p.pacing - 25) } : p))
    );
    pushMessage(
      "assistant",
      `Loosened the schedule \u2014 added buffer time at each unpinned stop and eased ${activeProfile?.name.split(" ")[0] || "the traveler"}'s pacing preference toward relaxed exploration.`
    );
  };

  const runReroute = () => {
    const idx = stops.findIndex((s) => isOutdoorStop(s));
    if (idx === -1) {
      pushMessage("assistant", "No outdoor stops left on the route \u2014 it's already fully indoor-friendly.");
      return;
    }
    const original = stops[idx].name;
    setStops((prev) =>
      prev.map((s, i) =>
        i === idx ? { ...s, name: `${s.name} \u2192 Indoor Alt: Heritage Museum Hall`, icon: Landmark } : s
      )
    );
    pushMessage("assistant", `Swapped "${original}" for an indoor cultural landmark \u2014 updated on the route map.`);
  };

  const runDining = () => {
    const spot = DINING_SPOTS.find((d) => d.supports.includes("Vegan")) || DINING_SPOTS[0];
    const already = stops.some((s) => s.sourceId === `dine-${spot.id}`);
    if (already) {
      pushMessage("assistant", `${spot.name} is already on the route.`);
      return;
    }
    const insertAt = Math.min(2, stops.length);
    const newStop = {
      id: `dine-${spot.id}-${Date.now()}`,
      sourceId: `dine-${spot.id}`,
      name: spot.name,
      icon: UtensilsCrossed,
      dwell: "75 min",
      window: "Dinner 7\u20139 PM",
      pinned: false,
    };
    setStops((prev) => {
      const next = [...prev];
      next.splice(insertAt, 0, newStop);
      return reoptimizeStops(next);
    });
    pushMessage(
      "assistant",
      `Found ${spot.name} (${spot.cuisine}, \u20B9${spot.costForTwo} for two, ${spot.distanceKm} km away) \u2014 added near Stop ${insertAt + 1}.`
    );
  };

  const handleQuickPrompt = (key) => {
    const prompt = QUICK_PROMPTS.find((p) => p.key === key);
    pushMessage("user", prompt.label);
    if (key === "relax") runRelax();
    if (key === "reroute") runReroute();
    if (key === "dining") runDining();
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    pushMessage("user", text);
    setInput("");
    const lower = text.toLowerCase();
    if (/relax|slow|chill|less busy/.test(lower)) runRelax();
    else if (/museum|indoor|rain|storm|weather/.test(lower)) runReroute();
    else if (/vegan|dinner|food|restaurant|eat/.test(lower)) runDining();
    else pushMessage("assistant", "Noted \u2014 I've logged that for the route engine. (Simulated response in this prototype.)");
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-sky-400 hover:bg-sky-300 text-zinc-950 shadow-lg shadow-sky-500/20 flex items-center justify-center transition-transform active:scale-95"
        title="AI Copilot"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-[22rem] max-w-[90vw] h-[30rem] max-h-[75vh] bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-2 bg-zinc-950">
            <Wand2 size={16} className="text-sky-400" />
            <span className="text-sm font-semibold text-zinc-100">Trip Copilot</span>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] text-sm rounded-lg px-3 py-2 ${
                  m.role === "user"
                    ? "ml-auto bg-sky-500/10 text-sky-100 border border-sky-400/20"
                    : "bg-zinc-800 text-zinc-200"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="px-3 pt-2 flex flex-wrap gap-1.5 border-t border-zinc-800">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p.key}
                onClick={() => handleQuickPrompt(p.key)}
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 rounded-full bg-zinc-800 text-zinc-300 hover:bg-sky-500/10 hover:text-sky-300 border border-zinc-700 hover:border-sky-400/30 transition-colors"
              >
                <p.icon size={11} /> {p.label}
              </button>
            ))}
          </div>

          <div className="p-3 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask the copilot to adjust your trip\u2026"
              className="flex-1 text-sm bg-zinc-950 border border-zinc-700 rounded-md px-3 py-2 outline-none text-zinc-100 placeholder:text-zinc-600 focus:border-sky-400/60"
            />
            <button
              onClick={handleSend}
              className="h-9 w-9 shrink-0 rounded-md bg-sky-400 hover:bg-sky-300 text-zinc-950 flex items-center justify-center"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function BucketListDrawer() {
  const { wishlist, stops, setStops } = useTripPlanner();
  const [open, setOpen] = useState(false);

  const items = MOCK_POIS.filter((poi) => wishlist.includes(poi.id));

  const handleInsert = (poi) => {
    const sourceId = `wl-${poi.id}`;
    if (stops.some((s) => s.sourceId === sourceId)) return;
    const newStop = {
      id: `${sourceId}-${Date.now()}`,
      sourceId,
      name: poi.name,
      icon: poi.icon,
      dwell: "60 min",
      window: "Flexible",
      pinned: false,
    };
    setStops((prev) => reoptimizeStops([...prev, newStop]));
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-24 z-40 h-14 w-14 rounded-full bg-zinc-800 hover:bg-sky-500/20 text-sky-300 border border-zinc-700 hover:border-sky-400/30 shadow-lg flex items-center justify-center transition-colors"
        title="Bucket List"
      >
        <Bookmark size={20} className={wishlist.length ? "fill-sky-400 text-sky-400" : ""} />
        {wishlist.length > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-sky-400 text-[10px] font-bold text-zinc-950 flex items-center justify-center border-2 border-zinc-950">
            {wishlist.length}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-80 max-w-[90vw] bg-zinc-900 border-l border-zinc-800 shadow-2xl flex flex-col">
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Bookmark size={15} className="text-sky-400" /> Bucket list
              </h2>
              <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-zinc-200">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 && (
                <p className="text-sm text-zinc-500 text-center py-10">
                  No saved places yet \u2014 bookmark POIs from the Discovery dashboard.
                </p>
              )}
              {items.map((poi) => {
                const inserted = stops.some((s) => s.sourceId === `wl-${poi.id}`);
                return (
                  <div key={poi.id} className="bg-zinc-950 border border-zinc-800 rounded-md overflow-hidden">
                    <div className={`h-16 bg-gradient-to-br ${poi.gradient} flex items-center justify-center`}>
                      <poi.icon size={22} className="text-white/90" />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold text-zinc-100">{poi.name}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{poi.blurb}</p>
                      <button
                        onClick={() => handleInsert(poi)}
                        disabled={inserted}
                        className={`mt-2.5 w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-md transition-colors ${
                          inserted
                            ? "bg-sky-500/10 text-sky-300 border border-sky-400/30"
                            : "bg-sky-400 hover:bg-sky-300 text-zinc-950"
                        }`}
                      >
                        {inserted ? <Check size={13} /> : <ArrowUpRightFromCircle size={13} />}
                        {inserted ? "In route" : "Insert into Route"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function QRCodeMock({ seed }) {
  const cells = 11;
  const hash = (seed || "trip").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const pattern = Array.from({ length: cells * cells }, (_, i) => (i * 7 + hash) % 5 < 2);
  return (
    <svg viewBox={`0 0 ${cells} ${cells}`} className="w-32 h-32 bg-white rounded-md p-1.5">
      {pattern.map((on, i) =>
        on ? (
          <rect key={i} x={i % cells} y={Math.floor(i / cells)} width="1" height="1" fill="#09090b" />
        ) : null
      )}
    </svg>
  );
}

function ShareHubModal({ onClose }) {
  const { activeTrip, userProfiles, stops, offlinePackDownloaded } = useTripPlanner();
  const [shared, setShared] = useState(false);

  const selectedProfiles = userProfiles.filter((p) => activeTrip.selectedProfileIds.includes(p.id));
  const pack = getLanguagePack(activeTrip.destination);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Share2 size={17} className="text-sky-400" /> Trip Summary & Share Hub
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 overflow-y-auto space-y-5">
          <div>
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">Itinerary</h3>
            <div className="bg-zinc-950 border border-zinc-800 rounded-md divide-y divide-zinc-800">
              {stops.map((s, i) => (
                <div key={s.id} className="flex items-center gap-2.5 px-3.5 py-2 text-sm">
                  <span className="text-sky-400 font-semibold text-xs w-5">{i + 1}</span>
                  <span className="text-zinc-200 flex-1 truncate">{s.name}</span>
                  <span className="text-zinc-500 text-xs">{s.time}</span>
                </div>
              ))}
              {stops.length === 0 && (
                <p className="text-xs text-zinc-600 px-3.5 py-3">No stops on the route yet.</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <QRCodeMock seed={activeTrip.destination} />
            <div>
              <p className="text-sm font-semibold text-zinc-200 flex items-center gap-1.5">
                <QrCode size={14} className="text-sky-400" /> Offline sync QR
              </p>
              <p className="text-xs text-zinc-500 mt-1 max-w-[16rem]">
                Scan to sync this itinerary to a companion device without data.
              </p>
              <p
                className={`text-xs mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-full border ${
                  offlinePackDownloaded
                    ? "bg-sky-500/10 text-sky-300 border-sky-400/30"
                    : "bg-zinc-800 text-zinc-500 border-zinc-700"
                }`}
              >
                <Languages size={11} />
                {pack.language} pack {offlinePackDownloaded ? "downloaded" : "not downloaded"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Siren size={12} className="text-rose-400" /> Emergency summary
            </h3>
            <div className="space-y-2">
              {selectedProfiles.map((p) => (
                <div key={p.id} className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-md px-3.5 py-2.5">
                  <span className={`h-8 w-8 rounded-full ${p.avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                    {p.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-zinc-200 truncate">{p.name}</p>
                    <p className="text-xs text-zinc-500 truncate">
                      {p.medical.length ? p.medical.join(", ") : "No medical flags"} \u00b7 {p.emergencyContact.name || "No contact"} {p.emergencyContact.phone}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-zinc-800 flex justify-end">
          <PrimaryButton icon={shared ? Check : Share2} onClick={() => setShared(true)}>
            {shared ? "Ready to share" : "Mark as shared"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ROOT SHELL                                                         */
/* ------------------------------------------------------------------ */

function AppShell() {
  const { navigation } = useTripPlanner();
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950">
      <TopNav onOpenShare={() => setShareOpen(true)} />
      {navigation === "AUTH" && <AuthScreen />}
      {navigation === "PROFILES" && <ProfilesScreen />}
      {navigation === "HOME" && <HomeScreen />}
      {navigation === "PLANNER_WIZARD" && <PlannerWizardScreen />}
      {navigation === "ITINERARY_OUTPUT" && <ItineraryOutputScreen />}

      {navigation !== "AUTH" && (
        <>
          <CopilotDrawer />
          <BucketListDrawer />
        </>
      )}
      {shareOpen && <ShareHubModal onClose={() => setShareOpen(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <TripPlannerProvider>
      <AppShell />
    </TripPlannerProvider>
  );
}
