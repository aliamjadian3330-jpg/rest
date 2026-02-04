"use client";
import { useState } from "react";

export default function TowingForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const data = Object.fromEntries(new FormData(form));

    // اعتبارسنجی مختصات
    if (!data.lat || !data.lon) {
      alert("لطفاً موقعیت خود را ثبت کنید 📍");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      if(result.status === "ok") {
        alert("درخواست ثبت شد ✅");
        form.reset();
      } else {
        alert("خطا: " + result.message);
      }
    } catch(err) {
      alert("خطای شبکه: " + err.message);
    }

    setLoading(false);
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        document.getElementById("lat").value = pos.coords.latitude;
        document.getElementById("lon").value = pos.coords.longitude;
        alert("موقعیت ثبت شد ✅");
      },
      () => alert("GPS فعال نیست")
    );
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth:420, margin:"30px auto", padding:20, background:"#fff", borderRadius:10 }}>
      <h3>درخواست خدمات</h3>
      <select name="service" required>
        <option value="">نوع خدمات</option>
        <option value="یدک‌کش">یدک‌کش</option>
        <option value="مکانیک سیار">مکانیک سیار</option>
      </select>
      <input name="name" placeholder="نام" required />
      <input name="phone" placeholder="شماره تماس" required />
      <input name="plate" placeholder="شماره پلاک" required />
      <textarea name="desc" placeholder="توضیح (اختیاری)"></textarea>
      <input type="hidden" name="lat" id="lat" />
      <input type="hidden" name="lon" id="lon" />
      <button type="button" onClick={getLocation} style={{ background:"#007bff", color:"#fff", marginTop:10 }}>📍 ثبت موقعیت</button>
      <button type="submit" style={{ background:"#28a745", color:"#fff", marginTop:10 }} disabled={loading}>
        {loading ? "در حال ارسال..." : "ارسال درخواست"}
      </button>
    </form>
  );
}
