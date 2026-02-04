﻿export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).send("Method Not Allowed");

  const GOOGLE_SCRIPT_URL ="https://script.google.com/macros/s/AKfycbzJOlas9Qv3UgsDCZ55ct6vDvLxOYlP0t2_aVPL18v6PPThc_ZevhatINv32NqU-0_Plg/exec";

  await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req.body)
  });

  res.json({ status: "ok" });
}