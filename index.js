import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());

// 🔐 Legge variabili da .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log(supabaseUrl);
console.log(supabaseKey);


// Cliente Supabase senza hardcoding
const supabase = createClient(supabaseUrl, supabaseKey);

// Endpoint API
app.get("/libri", async (req, res) => {
  const { data, error } = await supabase
    .from("test")
    .select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});