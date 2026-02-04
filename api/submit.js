const lastRequests = new Map();

export default async function handler(req, res) {
  // 1️⃣ فقط POST
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  // 2️⃣ گرفتن IP و User-Agent برای لاگ و Rate limit
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || "unknown";
  const userAgent = req.headers["user-agent"] || "unknown";
  const now = Date.now();

  // 3️⃣ محدودیت: هر IP هر ۶۰ ثانیه فقط یک بار
  if (lastRequests.has(ip) && now - lastRequests.get(ip) < 60000) {
    return res.status(429).json({ error: "لطفاً کمی صبر کنید" });
  }
  lastRequests.set(ip, now);

  // 4️⃣ گرفتن داده‌ها
  const { name, phone, plate, lat, lng } = req.body || {};

  // 5️⃣ اعتبارسنجی داده‌ها
  if (!name || !phone || !plate || !lat || !lng) {
    return res.status(400).json({ error: "اطلاعات ناقص است" });
  }
  if (!/^09\d{9}$/.test(phone)) {
    return res.status(400).json({ error: "شماره تماس نامعتبر است" });
  }

  // 6️⃣ ارسال به Google Sheets
  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzJOlas9Qv3UgsDCZ55ct6vDvLxOYlP0t2_aVPL18v6PPThc_ZevhatINv32NqU-0_Plg/exec";

  await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      phone,
      plate,
      lat,
      lng,
      time: new Date().toISOString(),
      ip,
      userAgent
    })
  });

  // 7️⃣ پاسخ به کاربر
  res.json({ status: "ok" });
}
