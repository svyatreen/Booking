/**
 * Patches images[0] (main hero image) for hotels where the first URL was unreliable.
 * Uses only verified Unsplash photo IDs.
 */
import pg from "pg";

const { Client } = pg;
const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

// Only replacing images[0] — keep images[1..4] as-is
// Using verified Unsplash IDs that are confirmed to load
const patches = [
  // Paris
  { name: "Le Grand Ritz",
    img0: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=85&w=1400" },
  { name: "Hôtel de Crillon",
    img0: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=85&w=1400" },
  { name: "Hôtel Particulier Montmartre",
    img0: "https://images.unsplash.com/photo-1549638441-b787d2e11f14?auto=format&fit=crop&q=85&w=1400" },
  // London
  { name: "The Savoy",
    img0: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=85&w=1400" },
  { name: "The Langham London",
    img0: "https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?auto=format&fit=crop&q=85&w=1400" },
  // Germany
  { name: "Hotel Adlon Kempinski",
    img0: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=85&w=1400" },
  { name: "Mandarin Oriental Munich",
    img0: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=85&w=1400" },
  { name: "The Fontenay Hamburg",
    img0: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=85&w=1400" },
  // Spain
  { name: "W Barcelona",
    img0: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=85&w=1400" },
  // Italy
  { name: "Aman Venice",
    img0: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=85&w=1400" },
  { name: "Belmond Villa San Michele",
    img0: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=85&w=1400" },
  // Switzerland
  { name: "Baur au Lac",
    img0: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&q=85&w=1400" },
  // Austria
  { name: "Hotel Sacher Vienna",
    img0: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=85&w=1400" },
  // Netherlands
  { name: "Four Seasons Amsterdam",
    img0: "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&q=85&w=1400" },
  // Scandinavia
  { name: "Grand Hotel Stockholm",
    img0: "https://images.unsplash.com/photo-1529290130-4ca3753253ae?auto=format&fit=crop&q=85&w=1400" },
  { name: "Copenhague Admiral Hotel",
    img0: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=85&w=1400" },
  // Japan
  { name: "The Peninsula Tokyo",
    img0: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=85&w=1400" },
  { name: "Park Hyatt Tokyo",
    img0: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&q=85&w=1400" },
  { name: "Aman Kyoto",
    img0: "https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&q=85&w=1400" },
  { name: "Hoshinoya Fuji",
    img0: "https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?auto=format&fit=crop&q=85&w=1400" },
  // Singapore
  { name: "Raffles Singapore",
    img0: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=85&w=1400" },
  { name: "Marina Bay Sands",
    img0: "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&q=85&w=1400" },
  // Bali
  { name: "Four Seasons Bali at Jimbaran Bay",
    img0: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=85&w=1400" },
  { name: "Alila Villas Uluwatu",
    img0: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=85&w=1400" },
  // Thailand
  { name: "Rosewood Phuket",
    img0: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=85&w=1400" },
  { name: "Anantara Riverside Bangkok",
    img0: "https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&q=85&w=1400" },
  // Vietnam
  { name: "The Reverie Saigon",
    img0: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=85&w=1400" },
  // New York
  { name: "The Plaza New York",
    img0: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=85&w=1400" },
  { name: "The St. Regis New York",
    img0: "https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&q=85&w=1400" },
  // Miami
  { name: "Faena Hotel Miami Beach",
    img0: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=85&w=1400" },
  // Los Angeles
  { name: "Four Seasons Los Angeles",
    img0: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=85&w=1400" },
  // Mexico
  { name: "Rosewood San Miguel de Allende",
    img0: "https://images.unsplash.com/photo-1502786129293-79981df4e689?auto=format&fit=crop&q=85&w=1400" },
  // Patagonia
  { name: "Awasi Patagonia",
    img0: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=85&w=1400" },
  // Dubai
  { name: "Burj Al Arab Jumeirah",
    img0: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=85&w=1400" },
  { name: "Atlantis The Palm",
    img0: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=85&w=1400" },
  // Morocco
  { name: "Royal Mansour Marrakech",
    img0: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=85&w=1400" },
  // Africa
  { name: "One&Only Cape Town",
    img0: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&q=85&w=1400" },
  { name: "Singita Grumeti",
    img0: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=85&w=1400" },
  // Australia
  { name: "Qualia Hamilton Island",
    img0: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=85&w=1400" },
  { name: "Park Hyatt Sydney",
    img0: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=85&w=1400" },
  // India
  { name: "Taj Lake Palace",
    img0: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=85&w=1400" },
  // Maldives
  { name: "Soneva Fushi",
    img0: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&q=85&w=1400" },
];

let updated = 0;
for (const { name, img0 } of patches) {
  // Set images[1] = img0 (PostgreSQL arrays are 1-indexed)
  const res = await client.query(
    `UPDATE hotels SET images[1] = $1 WHERE name = $2 RETURNING name`,
    [img0, name]
  );
  if (res.rowCount > 0) {
    console.log(`✓ ${name}`);
    updated++;
  } else {
    console.log(`⚠ Not found: ${name}`);
  }
}

await client.end();
console.log(`\n✅ Patched main images for ${updated} hotels.`);
