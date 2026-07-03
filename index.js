import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());

//----------------------
// Ricreiamo __dirname per gli ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// SERVIRE IL FRONTEND (I FILE STATICI)
// ==========================================
// 2. Diciamo a Express che tutto ciò che c'è in "public" è accessibile pubblicamente
app.use(express.static(path.join(__dirname, 'public')));


//---------------------



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

// ==========================================
// ROTTA DI FALLBACK (Sempre per ULTIMA)
// ==========================================
app.get(/.*/, (req, res) => {
  // Ignora le chiamate API che non esistono
  if (req.originalUrl.startsWith('/api/') || req.originalUrl === '/libri') {
    return res.status(404).json({ success: false, message: 'Endpoint API non trovato' });
  }
  // Per tutto il resto, restituisci l'interfaccia grafica
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});