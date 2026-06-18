import type {
  Center,
  Partner,
  Service,
  TrainingSession,
} from "../types";

// ## [WHAT CAN WE EDIT] All demo content lives in this file: training centers,
// training sessions, and services. Edit names/descriptions (each has en + ar +
// optionally tl/hi), times, capacity, prices (free: true/false), tags (used by
// the chatbot to match), and eligibility rules. Add or remove entries freely.

// Static weekly hours honoring the UAE working week (Mon=1 .. Sun=0).
// Friday (5) shortened for prayers; data-driven so Ramadan/holidays can override.
const standardHours = {
  weekly: [
    { day: 1, open: "08:00", close: "20:00" },
    { day: 2, open: "08:00", close: "20:00" },
    { day: 3, open: "08:00", close: "20:00" },
    { day: 4, open: "08:00", close: "20:00" },
    { day: 5, open: "08:00", close: "11:30" },
    { day: 6, open: "09:00", close: "17:00" },
    { day: 0, open: "09:00", close: "17:00" },
  ],
  notes: { en: "Friday hours shortened for prayers. Ramadan hours vary." },
};

export const centers: Center[] = [
  {
    id: "ctr-corniche",
    name: { en: "Corniche Care Center", ar: "مركز رعاية الكورنيش" },
    geo: { lat: 24.4764, lng: 54.3705 },
    address: { en: "Corniche Road, Abu Dhabi", ar: "طريق الكورنيش، أبوظبي" },
    hours: standardHours,
  },
  {
    id: "ctr-khalifa",
    name: { en: "Khalifa City Wellness Hub", ar: "مركز خليفة سيتي للعافية" },
    geo: { lat: 24.4196, lng: 54.579 },
    address: { en: "Khalifa City A, Abu Dhabi", ar: "مدينة خليفة أ، أبوظبي" },
    hours: standardHours,
  },
  {
    id: "ctr-mussafah",
    name: { en: "Mussafah Community Center", ar: "مركز مصفح المجتمعي" },
    geo: { lat: 24.349, lng: 54.503 },
    address: { en: "Mussafah M-10, Abu Dhabi", ar: "مصفح م-10، أبوظبي" },
    hours: standardHours,
  },
  {
    id: "ctr-alain",
    name: { en: "Al Ain Family Center", ar: "مركز العين للأسرة" },
    geo: { lat: 24.2075, lng: 55.7447 },
    address: { en: "Town Center, Al Ain", ar: "وسط المدينة، العين" },
    hours: standardHours,
  },
];

const inDays = (d: number, h = 9) => {
  const date = new Date();
  date.setDate(date.getDate() + d);
  date.setHours(h, 0, 0, 0);
  return date.toISOString();
};
const plusHours = (iso: string, h: number) =>
  new Date(new Date(iso).getTime() + h * 3600_000).toISOString();

export const trainings: TrainingSession[] = [
  {
    id: "trn-oxygen",
    topic: "medical_devices",
    title: { en: "Safe use of home oxygen", ar: "الاستخدام الآمن للأكسجين المنزلي", tl: "Ligtas na paggamit ng home oxygen", hi: "घरेलू ऑक्सीजन का सुरक्षित उपयोग" },
    summary: { en: "Hands-on session on setting up, using, and storing home oxygen equipment safely.", ar: "جلسة عملية حول إعداد واستخدام وتخزين معدات الأكسجين المنزلي بأمان." },
    format: "in_person",
    centerId: "ctr-corniche",
    trainerName: "Nurse Lobna Haddad",
    startsAt: inDays(3),
    endsAt: plusHours(inDays(3), 3),
    capacity: 20,
    seatsTaken: 14,
    certificationOffered: true,
    materials: [
      { id: "m1", title: { en: "Oxygen safety checklist (PDF)" }, kind: "download", offline: true },
      { id: "m2", title: { en: "Step-by-step audio guide" }, kind: "audio", offline: true },
    ],
    reviewedBy: "Dr. Khaled Al Marzooqi",
    reviewedAt: "2026-05-02",
  },
  {
    id: "trn-glucometer",
    topic: "medical_devices",
    title: { en: "Using a glucometer correctly", ar: "استخدام جهاز قياس السكر بشكل صحيح" },
    summary: { en: "Learn to measure blood sugar, read results, and record them for the doctor.", ar: "تعلّم قياس سكر الدم وقراءة النتائج وتسجيلها للطبيب." },
    format: "hybrid",
    centerId: "ctr-khalifa",
    trainerName: "Nurse Maria Santos",
    startsAt: inDays(5),
    endsAt: plusHours(inDays(5), 2),
    capacity: 25,
    seatsTaken: 9,
    certificationOffered: true,
    materials: [{ id: "m3", title: { en: "Reading your results (video)" }, kind: "recording", offline: false }],
    reviewedBy: "Dr. Aisha Rahman",
    reviewedAt: "2026-04-18",
  },
  {
    id: "trn-burnout",
    topic: "mental_health",
    title: { en: "Caregiver burnout: spotting the signs", ar: "إرهاق مقدّم الرعاية: التعرّف على العلامات" },
    summary: { en: "Recognize stress and burnout early, and learn simple coping techniques.", ar: "تعرّف على التوتر والإرهاق مبكرًا وتعلّم تقنيات بسيطة للتأقلم." },
    format: "online",
    trainerName: "Counselor Grace Mendoza",
    startsAt: inDays(2, 18),
    endsAt: plusHours(inDays(2, 18), 1),
    capacity: 100,
    seatsTaken: 41,
    certificationOffered: false,
    materials: [{ id: "m4", title: { en: "Breathing exercises (audio)" }, kind: "audio", offline: true }],
    reviewedBy: "Dr. Sara Ibrahim",
    reviewedAt: "2026-05-20",
  },
  {
    id: "trn-selfcare",
    topic: "self_care",
    title: { en: "Looking after yourself while caring", ar: "العناية بنفسك أثناء تقديم الرعاية" },
    summary: { en: "Sleep, rest, and small daily habits that protect your own health.", ar: "النوم والراحة وعادات يومية صغيرة تحمي صحتك." },
    format: "online",
    trainerName: "Counselor Grace Mendoza",
    startsAt: inDays(7, 19),
    endsAt: plusHours(inDays(7, 19), 1),
    capacity: 100,
    seatsTaken: 22,
    certificationOffered: false,
    materials: [],
    reviewedBy: "Dr. Sara Ibrahim",
    reviewedAt: "2026-05-20",
  },
  {
    id: "trn-finance",
    topic: "financial_literacy",
    title: { en: "Managing money and remittances", ar: "إدارة المال والتحويلات المالية" },
    summary: { en: "Budgeting, saving, and sending money home safely and cheaply.", ar: "وضع الميزانية والادخار وإرسال المال إلى الوطن بأمان وبتكلفة أقل." },
    format: "in_person",
    centerId: "ctr-mussafah",
    trainerName: "Advisor Rajesh Kumar",
    startsAt: inDays(4, 14),
    endsAt: plusHours(inDays(4, 14), 2),
    capacity: 30,
    seatsTaken: 30,
    certificationOffered: true,
    materials: [{ id: "m5", title: { en: "Budget template (PDF)" }, kind: "download", offline: true }],
    reviewedBy: "Finance review board",
    reviewedAt: "2026-03-10",
  },
  {
    id: "trn-mobility",
    topic: "medical_devices",
    title: { en: "Helping with mobility aids", ar: "المساعدة في استخدام وسائل التنقل" },
    summary: { en: "Safe transfers, wheelchair use, and preventing falls at home.", ar: "النقل الآمن واستخدام الكرسي المتحرك ومنع السقوط في المنزل." },
    format: "in_person",
    centerId: "ctr-alain",
    trainerName: "Physiotherapist Omar Saleh",
    startsAt: inDays(6),
    endsAt: plusHours(inDays(6), 3),
    capacity: 15,
    seatsTaken: 5,
    certificationOffered: true,
    materials: [],
    reviewedBy: "Dr. Khaled Al Marzooqi",
    reviewedAt: "2026-05-02",
  },
];

const anyEmirate = ["abu_dhabi", "dubai", "sharjah", "other"];

export const services: Service[] = [
  {
    id: "svc-counseling",
    name: { en: "Free mental health counseling", ar: "استشارات نفسية مجانية" },
    description: { en: "Confidential sessions with a licensed counselor, in your language.", ar: "جلسات سرية مع مستشار مرخّص بلغتك." },
    category: "mental_health",
    providerType: "counselor",
    bookable: true,
    free: true,
    tags: ["stress", "burnout", "overwhelmed", "sad", "anxiety", "lonely", "mental health"],
    eligibilityRules: [
      { field: "emirate", op: "in", value: anyEmirate, message: { en: "Available across the UAE." } },
    ],
  },
  {
    id: "svc-home-nursing",
    name: { en: "Home nursing visit", ar: "زيارة تمريض منزلي" },
    description: { en: "A nurse visits to help with wound care, feeding, or device checks.", ar: "ممرض يزور للمساعدة في العناية بالجروح أو التغذية أو فحص الأجهزة." },
    category: "home_nursing",
    providerType: "nurse",
    bookable: true,
    free: false,
    tags: ["wont eat", "feeding", "wound", "nursing", "device", "bedridden", "pressure sore"],
    eligibilityRules: [
      { field: "emirate", op: "equals", value: "abu_dhabi", message: { en: "Currently available in Abu Dhabi only." } },
    ],
  },
  {
    id: "svc-clinic",
    name: { en: "Clinic appointment for your dependent", ar: "موعد عيادة لمن ترعاه" },
    description: { en: "Book a general check-up with a doctor for the person you care for.", ar: "احجز فحصًا عامًا مع طبيب للشخص الذي ترعاه." },
    category: "clinical_appointment",
    providerType: "doctor",
    bookable: true,
    free: false,
    tags: ["doctor", "checkup", "appointment", "fever", "pain", "clinic", "sick"],
    eligibilityRules: [
      { field: "hasConsent", op: "equals", value: "health_data", message: { en: "Needs your consent to store health information." } },
    ],
  },
  {
    id: "svc-financial-aid",
    name: { en: "Financial support guidance", ar: "إرشاد الدعم المالي" },
    description: { en: "Talk to an advisor about money worries, debt, and remittances.", ar: "تحدّث إلى مستشار حول هموم المال والديون والتحويلات." },
    category: "financial_support",
    providerType: "support_agent",
    bookable: true,
    free: true,
    tags: ["money", "debt", "salary", "remittance", "financial", "cant afford"],
    eligibilityRules: [
      { field: "emirate", op: "in", value: anyEmirate, message: { en: "Available across the UAE." } },
    ],
  },
  {
    id: "svc-respite",
    name: { en: "Respite & relief support", ar: "دعم الراحة والإغاثة" },
    description: { en: "Short-term relief so you can rest. We help arrange cover.", ar: "إغاثة قصيرة المدى لتتمكن من الراحة. نساعد في ترتيب البديل." },
    category: "respite",
    providerType: "support_agent",
    bookable: true,
    free: true,
    tags: ["tired", "rest", "break", "exhausted", "no time", "respite"],
    eligibilityRules: [
      { field: "emirate", op: "in", value: anyEmirate, message: { en: "Available across the UAE." } },
    ],
  },
];

// ## [WHAT CAN WE EDIT] Care partners shown in the strip + on /partners. These
// are illustrative placeholders for the demo — replace names/blurbs with real
// partners and drop a logo at public/images/partners/<id>.png. Until then a
// styled name-chip shows automatically.
export const partners: Partner[] = [
  // — Government & public bodies —
  {
    id: "partner-maan",
    name: { en: "Ma'an — Authority of Social Contribution", ar: "معًا — هيئة المساهمات المجتمعية" },
    category: "government",
    blurb: { en: "Abu Dhabi's authority connecting community programs and social support.", ar: "هيئة أبوظبي التي تربط البرامج المجتمعية والدعم الاجتماعي." },
    logo: "/images/partners/partner-maan.png",
  },
  {
    id: "partner-fdf",
    name: { en: "Family Development Foundation", ar: "مؤسسة التنمية الأسرية" },
    category: "government",
    blurb: { en: "Family-focused programs, counseling and community awareness.", ar: "برامج أسرية واستشارات وتوعية مجتمعية." },
    logo: "/images/partners/partner-fdf.png",
  },
  {
    id: "partner-fca",
    name: { en: "Family Care Authority", ar: "هيئة رعاية الأسرة" },
    category: "government",
    blurb: { en: "Protects and supports family and child wellbeing.", ar: "تحمي وتدعم رفاهية الأسرة والطفل." },
    logo: "/images/partners/partner-fca.png",
  },
  {
    id: "partner-adphc",
    name: { en: "Abu Dhabi Public Health Centre (ADPHC)", ar: "مركز أبوظبي للصحة العامة" },
    category: "government",
    blurb: { en: "Public-health programs and preventive-care guidance.", ar: "برامج الصحة العامة وإرشاد الرعاية الوقائية." },
    logo: "/images/partners/partner-adphc.png",
  },
  {
    id: "partner-doh",
    name: { en: "Department of Health — Abu Dhabi", ar: "دائرة الصحة — أبوظبي" },
    category: "government",
    blurb: { en: "The regulator of Abu Dhabi's healthcare sector.", ar: "الجهة المنظِّمة لقطاع الرعاية الصحية في أبوظبي." },
    logo: "/images/partners/partner-doh.png",
  },
  {
    id: "partner-ehs",
    name: { en: "Emirates Health Services (EHS)", ar: "مؤسسة الإمارات للخدمات الصحية" },
    category: "government",
    blurb: { en: "Federal health services across the UAE.", ar: "خدمات صحية اتحادية في جميع أنحاء الإمارات." },
    logo: "/images/partners/partner-ehs.png",
  },

  // — Private home & specialist care —
  {
    id: "partner-bayti",
    name: { en: "Bayti Health Services", ar: "بيتي للخدمات الصحية" },
    category: "homecare",
    blurb: { en: "Home nursing and personal care at home.", ar: "تمريض منزلي ورعاية شخصية في المنزل." },
    logo: "/images/partners/partner-bayti.png",
  },
  {
    id: "partner-malaak",
    name: { en: "Malaak Homecare", ar: "ملاك للرعاية المنزلية" },
    category: "homecare",
    blurb: { en: "Home healthcare and mother & baby care.", ar: "رعاية صحية منزلية ورعاية الأم والطفل." },
    logo: "/images/partners/partner-malaak.jpg",
  },
  {
    id: "partner-ach",
    name: { en: "ACH Healthcare — Dubai", ar: "ACH للرعاية الصحية — دبي" },
    category: "homecare",
    blurb: { en: "Home healthcare services in Dubai.", ar: "خدمات الرعاية الصحية المنزلية في دبي." },
    logo: "/images/partners/partner-ach.jpg",
  },
  {
    id: "partner-amana",
    name: { en: "Amana Healthcare", ar: "أمانة للرعاية الصحية" },
    category: "homecare",
    blurb: { en: "Long-term and rehabilitation care.", ar: "رعاية طويلة الأمد وإعادة تأهيل." },
    logo: "/images/partners/partner-amana.jpg",
  },
  {
    id: "partner-burjeel-homecare",
    name: { en: "Burjeel Homecare", ar: "برجيل للرعاية المنزلية" },
    category: "homecare",
    blurb: { en: "Doctor-led home medical and nursing care.", ar: "رعاية طبية وتمريضية منزلية بإشراف أطباء." },
    logo: "/images/partners/partner-burjeel-homecare.png",
  },

  // — Insurance platforms —
  {
    id: "partner-sukoon",
    name: { en: "Sukoon Insurance", ar: "سُكون للتأمين" },
    category: "insurance",
    blurb: { en: "Health insurance plans and claims support.", ar: "خطط التأمين الصحي ودعم المطالبات." },
    logo: "/images/partners/partner-sukoon.jpg",
  },
  {
    id: "partner-daman",
    name: { en: "Daman — National Health Insurance", ar: "ضمان — الشركة الوطنية للضمان الصحي" },
    category: "insurance",
    blurb: { en: "National health insurance coverage.", ar: "تغطية التأمين الصحي الوطني." },
    logo: "/images/partners/partner-daman.png",
  },

  // — Domestic staffing —
  {
    id: "partner-homestaff",
    name: { en: "Home Staff International UAE", ar: "هوم ستاف إنترناشونال الإمارات" },
    category: "staffing",
    blurb: { en: "Licensed domestic and caregiver staffing.", ar: "توظيف عمالة منزلية ومقدّمي رعاية مرخّصين." },
    logo: "/images/partners/partner-homestaff.jpg",
  },
];
