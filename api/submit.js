export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ status:"error", message:"Method Not Allowed" });

  const SECRET = process.env.API_SECRET;
  if (req.headers["x-api-key"] !== SECRET) {
    return res.status(401).json({ status:"error", message:"Unauthorized" });
  }

  const GOOGLE_SCRIPT_URL ="https://script.google.com/macros/s/AKfycbzJOlas9Qv3UgsDCZ55ct6vDvLxOYlP0t2_aVPL18v6PPThc_ZevhatINv32NqU-0_Plg/exec";

  // اعتبارسنجی ساده فرم
  const { service, name, phone, plate, lat, lon } = req.body;
  if (!service || !name || !phone || !plate || !lat || !lon) {
    return res.status(400).json({ status:"error", message:"تمام فیلدهای ضروری را پر کنید" });
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({
        ...req.body,
        userAgent: req.headers["user-agent"],
        ip: req.headers["x-forwarded-for"] || "unknown"
      })
    });

    const data = await response.json();
    res.status(200).json({ status:"ok", data });
  } catch (error) {
    res.status(500).json({ status:"error", message: error.message });
  }
}
