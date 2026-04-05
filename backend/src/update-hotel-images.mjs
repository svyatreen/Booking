import pg from "pg";

const { Client } = pg;
const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

// W = 1400 high-quality images
const W = "auto=format&fit=crop&q=85&w=1400";

const hotelImages = {
  // ── Paris ──────────────────────────────────────────────────────────────────
  "Le Grand Ritz": [
    `https://images.unsplash.com/photo-1549638441-b787d2e11f14?${W}`, // Paris luxury hotel facade
    `https://images.unsplash.com/photo-1502602898657-3e91760cbb34?${W}`, // Paris Place Vendôme at night
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // grand hotel suite interior
    `https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?${W}`, // luxury hotel pool
    `https://images.unsplash.com/photo-1455587734955-081b22074882?${W}`, // hotel restaurant / bar
  ],
  "Hôtel de Crillon": [
    `https://images.unsplash.com/photo-1455587734955-081b22074882?${W}`, // ornate hotel entrance / facade
    `https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?${W}`, // Paris Place de la Concorde
    `https://images.unsplash.com/photo-1584132967334-10e028bd69f7?${W}`, // elegant hotel suite
    `https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?${W}`, // luxury bathroom
    `https://images.unsplash.com/photo-1502602898657-3e91760cbb34?${W}`, // Paris at night
  ],
  "Hôtel Particulier Montmartre": [
    `https://images.unsplash.com/photo-1543274189-f00657900c66?${W}`, // Montmartre Paris
    `https://images.unsplash.com/photo-1502602898657-3e91760cbb34?${W}`, // Paris at night / rooftops
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // chic hotel room
    `https://images.unsplash.com/photo-1563911302283-d2bc129e7570?${W}`, // garden pool / terrace
    `https://images.unsplash.com/photo-1499856871958-5b9627545d1a?${W}`, // Paris rooftop view
  ],

  // ── London ─────────────────────────────────────────────────────────────────
  "The Savoy": [
    `https://images.unsplash.com/photo-1542314831-c6a4d1400850?${W}`, // The Savoy grand hotel exterior
    `https://images.unsplash.com/photo-1551918120-9739cb430c6d?${W}`, // The Savoy / grand hotel lobby
    `https://images.unsplash.com/photo-1584132967334-10e028bd69f7?${W}`, // luxury hotel suite
    `https://images.unsplash.com/photo-1559508551-44bff1de756b?${W}`, // hotel bar / American Bar
    `https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?${W}`, // London / Thames view
  ],
  "The Langham London": [
    `https://images.unsplash.com/photo-1551918120-9739cb430c6d?${W}`, // The Langham exterior/lobby
    `https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?${W}`, // grand hotel dining room
    `https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?${W}`, // luxury bathroom
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // elegant suite
    `https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?${W}`, // London view
  ],
  "The Hoxton Shoreditch": [
    `https://images.unsplash.com/photo-1590490360182-c33d57733427?${W}`, // The Hoxton modern hotel
    `https://images.unsplash.com/photo-1568495248636-6432b97bd949?${W}`, // trendy hotel lobby
    `https://images.unsplash.com/photo-1566073771259-6a8506099945?${W}`, // stylish hotel room
    `https://images.unsplash.com/photo-1544161515-4ab6ce6db874?${W}`, // hotel restaurant/bar
    `https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?${W}`, // London East End
  ],

  // ── Germany ────────────────────────────────────────────────────────────────
  "Hotel Adlon Kempinski": [
    `https://images.unsplash.com/photo-1467269204594-9661b134dd2b?${W}`, // Brandenburg Gate / Berlin
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // grand hotel suite
    `https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?${W}`, // hotel pool
    `https://images.unsplash.com/photo-1584132967334-10e028bd69f7?${W}`, // luxury hotel room
    `https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?${W}`, // hotel restaurant
  ],
  "Mandarin Oriental Munich": [
    `https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?${W}`, // Munich / Bavaria
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // luxury hotel suite
    `https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?${W}`, // hotel bathroom
    `https://images.unsplash.com/photo-1559508551-44bff1de756b?${W}`, // hotel bar
    `https://images.unsplash.com/photo-1544161515-4ab6ce6db874?${W}`, // spa
  ],
  "The Fontenay Hamburg": [
    `https://images.unsplash.com/photo-1534430480872-3498386e7856?${W}`, // Hamburg Alster lake
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // modern hotel suite
    `https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?${W}`, // hotel pool with city view
    `https://images.unsplash.com/photo-1584132967334-10e028bd69f7?${W}`, // luxury room
    `https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?${W}`, // hotel interior
  ],

  // ── Spain ──────────────────────────────────────────────────────────────────
  "W Barcelona": [
    `https://images.unsplash.com/photo-1539037116277-4db20889f2d4?${W}`, // Barcelona W Hotel sail building exterior
    `https://images.unsplash.com/photo-1571896349842-33c89424de2d?${W}`, // Barcelona beachfront
    `https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?${W}`, // rooftop infinity pool sea view
    `https://images.unsplash.com/photo-1566073771259-6a8506099945?${W}`, // modern hotel suite
    `https://images.unsplash.com/photo-1559508551-44bff1de756b?${W}`, // hotel bar
  ],

  // ── Italy ──────────────────────────────────────────────────────────────────
  "Aman Venice": [
    `https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?${W}`, // Venice Grand Canal at sunset
    `https://images.unsplash.com/photo-1514890547357-a9ee288728e0?${W}`, // Venice palace / canal
    `https://images.unsplash.com/photo-1534430480872-3498386e7856?${W}`, // Venice waterfront
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // grand historic hotel suite
    `https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?${W}`, // luxury interior
  ],
  "Belmond Villa San Michele": [
    `https://images.unsplash.com/photo-1543721938-a7c37e4ced7d?${W}`, // Tuscan villa / Fiesole hillside
    `https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?${W}`, // Florence view from hills
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // luxury hotel suite
    `https://images.unsplash.com/photo-1563911302283-d2bc129e7570?${W}`, // pool in Italian garden
    `https://images.unsplash.com/photo-1555854877-bab0e564b8d5?${W}`, // monastery / historic dining
  ],

  // ── Switzerland ────────────────────────────────────────────────────────────
  "Baur au Lac": [
    `https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?${W}`, // Lake Zurich / waterfront
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // grand hotel suite
    `https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?${W}`, // luxury bathroom
    `https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?${W}`, // hotel restaurant
    `https://images.unsplash.com/photo-1544161515-4ab6ce6db874?${W}`, // spa
  ],

  // ── Austria ────────────────────────────────────────────────────────────────
  "Hotel Sacher Vienna": [
    `https://images.unsplash.com/photo-1555854877-bab0e564b8d5?${W}`, // Hotel Sacher Vienna facade
    `https://images.unsplash.com/photo-1516550893923-42d28e5677af?${W}`, // Vienna Opera / city
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // grand hotel suite
    `https://images.unsplash.com/photo-1559508551-44bff1de756b?${W}`, // hotel cafe / bar
    `https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?${W}`, // hotel dining room
  ],

  // ── Netherlands ────────────────────────────────────────────────────────────
  "Four Seasons Amsterdam": [
    `https://images.unsplash.com/photo-1584003564911-c6d9b2051098?${W}`, // Amsterdam canal houses
    `https://images.unsplash.com/photo-1517840901100-8179e982acb7?${W}`, // Amsterdam / Dutch interior
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // luxury hotel suite
    `https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?${W}`, // hotel bathroom
    `https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?${W}`, // hotel restaurant
  ],

  // ── Scandinavia ────────────────────────────────────────────────────────────
  "Grand Hotel Stockholm": [
    `https://images.unsplash.com/photo-1529290130-4ca3753253ae?${W}`, // Stockholm waterfront / Grand Hotel
    `https://images.unsplash.com/photo-1509356843151-3e7d96241e11?${W}`, // Stockholm at night
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // grand hotel suite
    `https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?${W}`, // hotel interior
    `https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?${W}`, // hotel dining
  ],
  "Copenhague Admiral Hotel": [
    `https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?${W}`, // Copenhagen / Nordic harbour
    `https://images.unsplash.com/photo-1598560917807-1bae44bd2be8?${W}`, // Copenhagen Nyhavn
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // Nordic hotel suite
    `https://images.unsplash.com/photo-1566073771259-6a8506099945?${W}`, // Scandinavian interior
    `https://images.unsplash.com/photo-1544161515-4ab6ce6db874?${W}`, // spa/wellness
  ],

  // ── Japan ──────────────────────────────────────────────────────────────────
  "The Peninsula Tokyo": [
    `https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?${W}`, // Tokyo skyline / Imperial Palace
    `https://images.unsplash.com/photo-1503899036084-c55cdd92da26?${W}`, // Tokyo at night
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // luxury hotel suite
    `https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?${W}`, // soaking tub with city view
    `https://images.unsplash.com/photo-1544161515-4ab6ce6db874?${W}`, // Peninsula spa
  ],
  "Park Hyatt Tokyo": [
    `https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?${W}`, // Park Hyatt Tokyo skyline view
    `https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?${W}`, // Tokyo from above / Shinjuku
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // hotel suite high floor
    `https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?${W}`, // sky pool / city view
    `https://images.unsplash.com/photo-1559508551-44bff1de756b?${W}`, // New York Bar
  ],
  "Aman Kyoto": [
    `https://images.unsplash.com/photo-1480796927426-f609979314bd?${W}`, // Kyoto bamboo / forest
    `https://images.unsplash.com/photo-1545569341-9eb8b30979d9?${W}`, // Kyoto temple / autumn
    `https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?${W}`, // Japanese garden / stone path
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // minimalist hotel suite
    `https://images.unsplash.com/photo-1544161515-4ab6ce6db874?${W}`, // onsen / spa
  ],
  "Hoshinoya Fuji": [
    `https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?${W}`, // Hoshinoya Fuji forest cabins
    `https://images.unsplash.com/photo-1510023115788-fd3fdce8ca89?${W}`, // Mount Fuji / Kawaguchiko lake
    `https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?${W}`, // Japanese nature / forest
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // minimalist cabin suite
    `https://images.unsplash.com/photo-1509316785289-025f5b846b35?${W}`, // sunrise / misty forest
  ],

  // ── Singapore ──────────────────────────────────────────────────────────────
  "Raffles Singapore": [
    `https://images.unsplash.com/photo-1525625293386-3f8f99389edd?${W}`, // Raffles Hotel facade at night
    `https://images.unsplash.com/photo-1565967511849-76a60a516170?${W}`, // Singapore colonial hotel courtyard
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // colonial hotel suite
    `https://images.unsplash.com/photo-1559508551-44bff1de756b?${W}`, // Long Bar / cocktail bar
    `https://images.unsplash.com/photo-1544161515-4ab6ce6db874?${W}`, // spa / courtyard pool
  ],
  "Marina Bay Sands": [
    `https://images.unsplash.com/photo-1508009603885-50cf7c8dd0d5?${W}`, // Marina Bay Sands SkyPark infinity pool
    `https://images.unsplash.com/photo-1525625293386-3f8f99389edd?${W}`, // Singapore skyline / MBS exterior
    `https://images.unsplash.com/photo-1565967511849-76a60a516170?${W}`, // Gardens by the Bay / Supertrees
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // hotel suite with bay view
    `https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?${W}`, // infinity pool edge over city
  ],

  // ── Bali ───────────────────────────────────────────────────────────────────
  "Four Seasons Bali at Jimbaran Bay": [
    `https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?${W}`, // Bali villa infinity pool at sunset
    `https://images.unsplash.com/photo-1537996194471-e657df975ab4?${W}`, // Bali rice terraces / lush green
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // thatched villa suite
    `https://images.unsplash.com/photo-1544161515-4ab6ce6db874?${W}`, // Balinese spa treatment
    `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?${W}`, // Bali flower ceremony / temple
  ],
  "Alila Villas Uluwatu": [
    `https://images.unsplash.com/photo-1537996194471-e657df975ab4?${W}`, // Uluwatu cliffside
    `https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?${W}`, // cliff-edge infinity pool
    `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?${W}`, // Bali sunset / temple
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // villa suite
    `https://images.unsplash.com/photo-1563911302283-d2bc129e7570?${W}`, // private pool villa
  ],

  // ── Thailand ───────────────────────────────────────────────────────────────
  "Rosewood Phuket": [
    `https://images.unsplash.com/photo-1569124589354-615739ae007b?${W}`, // Phuket limestone cliffs / Andaman Sea
    `https://images.unsplash.com/photo-1566073771259-6a8506099945?${W}`, // tropical pool villa
    `https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?${W}`, // resort pool ocean view
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // suite with sea view
    `https://images.unsplash.com/photo-1544161515-4ab6ce6db874?${W}`, // spa treatment
  ],
  "Anantara Riverside Bangkok": [
    `https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?${W}`, // Chao Phraya river / Bangkok skyline
    `https://images.unsplash.com/photo-1563492065-d1e8a9739282?${W}`, // Bangkok temple riverside
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // hotel suite river view
    `https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?${W}`, // riverside pool
    `https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?${W}`, // Thai fine dining
  ],

  // ── Vietnam ────────────────────────────────────────────────────────────────
  "The Reverie Saigon": [
    `https://images.unsplash.com/photo-1566073771259-6a8506099945?${W}`, // The Reverie grand lobby
    `https://images.unsplash.com/photo-1583417319070-4a69db38a482?${W}`, // Ho Chi Minh City skyline
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // opulent hotel suite
    `https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?${W}`, // luxury bathroom
    `https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?${W}`, // fine dining restaurant
  ],

  // ── New York ───────────────────────────────────────────────────────────────
  "The Plaza New York": [
    `https://images.unsplash.com/photo-1499092346302-2a0cbc38abd7?${W}`, // The Plaza exterior / Central Park South
    `https://images.unsplash.com/photo-1496588152823-86ff7695e68f?${W}`, // Central Park / NYC skyline
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // grand suite
    `https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?${W}`, // hotel ballroom / Palm Court
    `https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?${W}`, // hotel dining
  ],
  "The St. Regis New York": [
    `https://images.unsplash.com/photo-1496588152823-86ff7695e68f?${W}`, // NYC / Midtown Manhattan
    `https://images.unsplash.com/photo-1542314831-c6a4d1400850?${W}`, // grand luxury hotel exterior
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // beaux-arts hotel suite
    `https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?${W}`, // luxury marble bathroom
    `https://images.unsplash.com/photo-1559508551-44bff1de756b?${W}`, // King Cole Bar
  ],

  // ── Miami ──────────────────────────────────────────────────────────────────
  "Faena Hotel Miami Beach": [
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // Faena Hotel suite / bold design
    `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?${W}`, // Miami Beach / ocean
    `https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?${W}`, // hotel pool / South Beach
    `https://images.unsplash.com/photo-1566073771259-6a8506099945?${W}`, // flamboyant hotel interior
    `https://images.unsplash.com/photo-1559508551-44bff1de756b?${W}`, // hotel bar
  ],

  // ── Los Angeles ────────────────────────────────────────────────────────────
  "Four Seasons Los Angeles": [
    `https://images.unsplash.com/photo-1542314831-c6a4d1400850?${W}`, // Beverly Hills / luxury hotel exterior
    `https://images.unsplash.com/photo-1449034446853-66c86144b0ad?${W}`, // Los Angeles cityscape
    `https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?${W}`, // rooftop pool / Hollywood Hills
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // hotel suite
    `https://images.unsplash.com/photo-1544161515-4ab6ce6db874?${W}`, // spa / wellness
  ],

  // ── Mexico ─────────────────────────────────────────────────────────────────
  "Rosewood San Miguel de Allende": [
    `https://images.unsplash.com/photo-1502786129293-79981df4e689?${W}`, // San Miguel de Allende colonial street
    `https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?${W}`, // Mexican hacienda / courtyard pool
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // colonial hotel suite
    `https://images.unsplash.com/photo-1563911302283-d2bc129e7570?${W}`, // garden pool
    `https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?${W}`, // Mexican fine dining
  ],

  // ── Patagonia ──────────────────────────────────────────────────────────────
  "Awasi Patagonia": [
    `https://images.unsplash.com/photo-1519681393784-d120267933ba?${W}`, // Torres del Paine / Patagonia peaks
    `https://images.unsplash.com/photo-1516912481808-3406841bd33c?${W}`, // Patagonia wilderness / glaciers
    `https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?${W}`, // Patagonian steppe / guanacos
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // private lodge suite
    `https://images.unsplash.com/photo-1509316785289-025f5b846b35?${W}`, // starry Patagonian night sky
  ],

  // ── Dubai ──────────────────────────────────────────────────────────────────
  "Burj Al Arab Jumeirah": [
    `https://images.unsplash.com/photo-1512453979798-5ea266f8880c?${W}`, // Burj Al Arab sail exterior
    `https://images.unsplash.com/photo-1518684079-3c830dcef090?${W}`, // Dubai skyline / Arabian Gulf
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // ultra-luxury gold suite
    `https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?${W}`, // private beach / infinity pool
    `https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?${W}`, // Al Mahara underwater restaurant
  ],
  "Atlantis The Palm": [
    `https://images.unsplash.com/photo-1580674684081-7617fbf3d745?${W}`, // Atlantis The Palm exterior / Palm Island
    `https://images.unsplash.com/photo-1518684079-3c830dcef090?${W}`, // Dubai / Palm Jumeirah aerial
    `https://images.unsplash.com/photo-1566073771259-6a8506099945?${W}`, // aquaventure / waterpark
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // hotel suite sea view
    `https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?${W}`, // lagoon pool
  ],

  // ── Morocco ────────────────────────────────────────────────────────────────
  "Royal Mansour Marrakech": [
    `https://images.unsplash.com/photo-1563492065-d1e8a9739282?${W}`, // Royal Mansour riad courtyard / zellij tiles
    `https://images.unsplash.com/photo-1539020140153-e479b8c22e70?${W}`, // Marrakech / Moroccan architecture
    `https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?${W}`, // Marrakech medina / souks
    `https://images.unsplash.com/photo-1553267751-1c148a7280a1?${W}`, // Moroccan riad pool / courtyard
    `https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?${W}`, // Moroccan fine dining
  ],

  // ── South Africa ───────────────────────────────────────────────────────────
  "One&Only Cape Town": [
    `https://images.unsplash.com/photo-1580060839134-75a5edca2e99?${W}`, // Cape Town / Table Mountain
    `https://images.unsplash.com/photo-1611288875785-5fcfa2cf5aa9?${W}`, // Cape Town waterfront / harbour
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // hotel suite with mountain view
    `https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?${W}`, // marina pool
    `https://images.unsplash.com/photo-1544161515-4ab6ce6db874?${W}`, // spa
  ],

  // ── Tanzania ───────────────────────────────────────────────────────────────
  "Singita Grumeti": [
    `https://images.unsplash.com/photo-1516426122078-c23e76319801?${W}`, // Serengeti / African savannah
    `https://images.unsplash.com/photo-1564760290292-23341e4df6ec?${W}`, // safari / Great Migration wildebeest
    `https://images.unsplash.com/photo-1474511320723-9a56873867b5?${W}`, // lion in savannah
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // luxury safari lodge suite
    `https://images.unsplash.com/photo-1516516297228-a39abbbf20d4?${W}`, // Africa landscape sunset
  ],

  // ── Australia ──────────────────────────────────────────────────────────────
  "Qualia Hamilton Island": [
    `https://images.unsplash.com/photo-1546519638-68e109498ffc?${W}`, // Great Barrier Reef / Whitsundays
    `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?${W}`, // tropical beach / turquoise water
    `https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?${W}`, // infinity pool overlooking sea
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // pavilion suite with ocean view
    `https://images.unsplash.com/photo-1468581264429-2548ef9eb732?${W}`, // Hamilton Island / coral sea
  ],
  "Park Hyatt Sydney": [
    `https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?${W}`, // Sydney Opera House from the water
    `https://images.unsplash.com/photo-1549180030-48bf079fb38a?${W}`, // Sydney Harbour Bridge view
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // hotel suite harbour view
    `https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?${W}`, // rooftop pool Opera House view
    `https://images.unsplash.com/photo-1544161515-4ab6ce6db874?${W}`, // spa
  ],

  // ── India ──────────────────────────────────────────────────────────────────
  "Taj Lake Palace": [
    `https://images.unsplash.com/photo-1587474260584-136574528ed5?${W}`, // Taj Lake Palace on Lake Pichola
    `https://images.unsplash.com/photo-1524492412937-b28074a47d70?${W}`, // Rajasthan / Indian palace at dusk
    `https://images.unsplash.com/photo-1598091383021-15ddea10925d?${W}`, // Udaipur City Palace / lake
    `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?${W}`, // palace suite / marble interior
    `https://images.unsplash.com/photo-1544161515-4ab6ce6db874?${W}`, // Jiva Spa / marble hammam
  ],

  // ── Maldives ───────────────────────────────────────────────────────────────
  "Soneva Fushi": [
    `https://images.unsplash.com/photo-1573843981267-be1999ff37cd?${W}`, // Soneva Fushi overwater villa
    `https://images.unsplash.com/photo-1540202404-1b927e27fa8b?${W}`, // Maldives crystal lagoon
    `https://images.unsplash.com/photo-1514282401047-d79a71a590e8?${W}`, // Maldives sunset / overwater bungalow
    `https://images.unsplash.com/photo-1596436889106-be35e843f974?${W}`, // barefoot luxury beach
    `https://images.unsplash.com/photo-1555854877-bab0e564b8d5?${W}`, // dining in the Maldives / beach
  ],
};

console.log("Updating hotel images...");
let updated = 0;
let missing = [];

for (const [name, images] of Object.entries(hotelImages)) {
  const res = await client.query(
    "UPDATE hotels SET images = $1 WHERE name = $2 RETURNING id",
    [images, name]
  );
  if (res.rowCount > 0) {
    console.log(`✓ ${name} — ${images.length} images`);
    updated++;
  } else {
    missing.push(name);
  }
}

if (missing.length > 0) {
  console.log("\n⚠️  Not found:", missing.join(", "));
}

await client.end();
console.log(`\n✅ Updated ${updated} hotels with multiple images.`);
