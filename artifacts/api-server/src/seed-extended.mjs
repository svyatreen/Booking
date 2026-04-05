import pg from "pg";
const { Client } = pg;

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const hotels = [
  // EUROPE — Paris
  {
    name: "Le Grand Ritz",
    description: "Legendary Parisian palace hotel offering timeless elegance, Michelin-starred dining, and a world-famous cocktail bar in the heart of Place Vendôme.",
    city: "Paris", address: "15 Place Vendôme, 75001 Paris, France", stars: 5,
    amenities: ["Pool","Spa","Gym","Restaurant","Bar","Concierge","Room Service","Valet Parking"],
    images: ["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=800"],
    rating: 4.9,
  },
  {
    name: "Hôtel de Crillon",
    description: "An 18th-century palace on Place de la Concorde with breathtaking views of the Eiffel Tower and exquisite French haute cuisine.",
    city: "Paris", address: "10 Place de la Concorde, 75008 Paris, France", stars: 5,
    amenities: ["Spa","Pool","Restaurant","Bar","Concierge","Butler Service","Gym"],
    images: ["https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&q=80&w=800"],
    rating: 4.8,
  },
  {
    name: "Hôtel Particulier Montmartre",
    description: "Romantic 19th-century mansion hidden in Montmartre with garden suites, contemporary art and a charming cocktail bar.",
    city: "Paris", address: "23 Av. Junot, 75018 Paris, France", stars: 4,
    amenities: ["Garden","Bar","Concierge","Art Collection","Breakfast"],
    images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800"],
    rating: 4.5,
  },
  // EUROPE — London
  {
    name: "The Savoy",
    description: "London's most iconic hotel since 1889. Art Deco grandeur meets modern luxury on the Thames Embankment with world-class dining.",
    city: "London", address: "Strand, London WC2R 0EU, United Kingdom", stars: 5,
    amenities: ["Pool","Spa","Gym","Restaurant","Bar","Theatre Access","Concierge"],
    images: ["https://images.unsplash.com/photo-1542314831-c6a4d1400850?auto=format&fit=crop&q=80&w=800"],
    rating: 4.8,
  },
  {
    name: "The Langham London",
    description: "Europe's first grand hotel reimagined for the modern traveller. Steps from Oxford Street with an award-winning spa.",
    city: "London", address: "1C Portland Place, Regent Street, London W1B 1JA", stars: 5,
    amenities: ["Spa","Pool","Gym","Restaurant","Bar","Concierge","Business Center"],
    images: ["https://images.unsplash.com/photo-1551918120-9739cb430c6d?auto=format&fit=crop&q=80&w=800"],
    rating: 4.7,
  },
  {
    name: "The Hoxton Shoreditch",
    description: "Cool design hotel in East London's creative heartland with a lively all-day lobby restaurant and rooftop bar with skyline views.",
    city: "London", address: "81 Great Eastern St, London EC2A 3HU, United Kingdom", stars: 4,
    amenities: ["Restaurant","Bar","Gym","Concierge","Meeting Rooms"],
    images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800"],
    rating: 4.3,
  },
  // EUROPE — Germany
  {
    name: "Hotel Adlon Kempinski",
    description: "Berlin's most prestigious address since 1907 at the Brandenburg Gate with legendary service and world-class gastronomy.",
    city: "Berlin", address: "Unter den Linden 77, 10117 Berlin, Germany", stars: 5,
    amenities: ["Spa","Pool","Gym","Restaurant","Bar","Concierge","Valet"],
    images: ["https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=800"],
    rating: 4.7,
  },
  {
    name: "Mandarin Oriental Munich",
    description: "Sophisticated urban retreat in the heart of Munich blending Bavarian heritage with Asian serenity, near the English Garden.",
    city: "Munich", address: "Neuturmstrasse 1, 80331 Munich, Germany", stars: 5,
    amenities: ["Spa","Pool","Gym","Restaurant","Bar","Concierge","Sauna"],
    images: ["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=800"],
    rating: 4.6,
  },
  // EUROPE — Spain/Italy
  {
    name: "W Barcelona",
    description: "Iconic sail-shaped tower on Barceloneta Beach with 360° sea views, rooftop pool and celebrity DJ nights.",
    city: "Barcelona", address: "Plaça de la Rosa dels Vents 1, 08039 Barcelona, Spain", stars: 5,
    amenities: ["Rooftop Pool","Spa","Gym","Restaurant","Bar","Beach Access","DJ Lounge"],
    images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800"],
    rating: 4.6,
  },
  {
    name: "Aman Venice",
    description: "A 16th-century palazzo on the Grand Canal — one of Venice's most extraordinary private residences with its own boats and gardens.",
    city: "Venice", address: "Calle Tiepolo 1364, 30135 Venice, Italy", stars: 5,
    amenities: ["Private Boats","Garden","Spa","Restaurant","Bar","Concierge","Butler Service"],
    images: ["https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80&w=800"],
    rating: 4.9,
  },
  {
    name: "Belmond Villa San Michele",
    description: "A 15th-century monastery nestled in the hills above Florence, commanding panoramic views of the city and the Arno valley.",
    city: "Florence", address: "Via Doccia 4, 50014 Fiesole, Florence, Italy", stars: 5,
    amenities: ["Pool","Spa","Restaurant","Bar","Garden","Concierge","Cooking Classes"],
    images: ["https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800"],
    rating: 4.8,
  },
  // EUROPE — Other
  {
    name: "Baur au Lac",
    description: "Zurich's most distinguished address since 1844 overlooking Lake Zurich, with Swiss precision and Michelin-star dining.",
    city: "Zurich", address: "Talstrasse 1, 8001 Zürich, Switzerland", stars: 5,
    amenities: ["Spa","Restaurant","Bar","Concierge","Lake View","Gym","Private Garden"],
    images: ["https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&q=80&w=800"],
    rating: 4.8,
  },
  {
    name: "Hotel Sacher Vienna",
    description: "The birthplace of the legendary Sachertorte. Vienna's most storied hotel blending imperial grandeur with luxury since 1876.",
    city: "Vienna", address: "Philharmoniker Str. 4, 1010 Vienna, Austria", stars: 5,
    amenities: ["Spa","Restaurant","Bar","Concierge","Café","Gym","Opera Access"],
    images: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800"],
    rating: 4.7,
  },
  {
    name: "Four Seasons Amsterdam",
    description: "Twin 17th-century canal houses transformed into an intimate luxury retreat in the heart of the Golden Ring.",
    city: "Amsterdam", address: "Keizergracht 99, 1015 AG Amsterdam, Netherlands", stars: 5,
    amenities: ["Spa","Restaurant","Bar","Concierge","Canal Terrace","Gym"],
    images: ["https://images.unsplash.com/photo-1517840901100-8179e982acb7?auto=format&fit=crop&q=80&w=800"],
    rating: 4.6,
  },
  {
    name: "Grand Hotel Stockholm",
    description: "Sweden's finest hotel since 1874 facing the Royal Palace, with Nobel Prize banquet tradition and Nordic spa.",
    city: "Stockholm", address: "Södra Blasieholmshamnen 8, 103 27 Stockholm, Sweden", stars: 5,
    amenities: ["Spa","Restaurant","Bar","Concierge","Waterfront Views","Gym"],
    images: ["https://images.unsplash.com/photo-1529290130-4ca3753253ae?auto=format&fit=crop&q=80&w=800"],
    rating: 4.5,
  },
  {
    name: "Copenhague Admiral Hotel",
    description: "Historic 18th-century granary turned boutique hotel on the Copenhagen waterfront with exposed beams, timber and harbour views.",
    city: "Copenhagen", address: "Toldbodgade 24-28, 1253 Copenhagen, Denmark", stars: 4,
    amenities: ["Restaurant","Bar","Concierge","Waterfront Views","Gym"],
    images: ["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=800"],
    rating: 4.4,
  },
  {
    name: "The Fontenay Hamburg",
    description: "Sleek new-build icon on the inner Alster lake with a stunning infinity pool and contemporary art woven throughout every corner.",
    city: "Hamburg", address: "Fontenay 10, 20354 Hamburg, Germany", stars: 5,
    amenities: ["Infinity Pool","Spa","Gym","Restaurant","Bar","Lake Views","Concierge"],
    images: ["https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&q=80&w=800"],
    rating: 4.7,
  },
  // ASIA — Japan
  {
    name: "The Peninsula Tokyo",
    description: "Tokyo's most prestigious address fusing Japanese harmony with Western luxury. Iconic views of the Imperial Palace.",
    city: "Tokyo", address: "1-8-1 Yurakucho, Chiyoda City, Tokyo 100-0006, Japan", stars: 5,
    amenities: ["Rooftop Pool","Spa","Gym","Restaurant","Bar","Concierge","Helicopter Transfer"],
    images: ["https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800"],
    rating: 4.9,
  },
  {
    name: "Park Hyatt Tokyo",
    description: "Made famous by Lost in Translation, this sky-high hotel occupies floors 41-52 with incomparable city-and-Fuji views.",
    city: "Tokyo", address: "3-7-1-2 Nishi Shinjuku, Shinjuku-ku, Tokyo 163-1055, Japan", stars: 5,
    amenities: ["Infinity Pool","Gym","Restaurant","Bar","Spa","Library"],
    images: ["https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&q=80&w=800"],
    rating: 4.8,
  },
  {
    name: "Aman Kyoto",
    description: "Secreted in the forested hills of northern Higashiyama, this hushed sanctuary surrounds a private 10th-century garden.",
    city: "Kyoto", address: "Okitayama Washicho, Kita Ward, Kyoto 603-8814, Japan", stars: 5,
    amenities: ["Onsen","Spa","Restaurant","Bar","Garden","Tea Ceremony","Concierge"],
    images: ["https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&q=80&w=800"],
    rating: 4.9,
  },
  {
    name: "Hoshinoya Fuji",
    description: "Japan's first glamping resort perched above Lake Kawaguchi with unobstructed views of Mount Fuji and forest cabins.",
    city: "Fujikawaguchiko", address: "1408 Funatsu, Fujikawaguchiko, Minamitsuru District, Yamanashi", stars: 4,
    amenities: ["Forest Pool","Restaurant","Bar","Glamping Activities","Mount Fuji Views"],
    images: ["https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?auto=format&fit=crop&q=80&w=800"],
    rating: 4.7,
  },
  // ASIA — Southeast Asia
  {
    name: "Raffles Singapore",
    description: "The birthplace of the Singapore Sling. A National Monument with lush tropics, grand colonial architecture and butler service.",
    city: "Singapore", address: "1 Beach Road, Singapore 189673", stars: 5,
    amenities: ["Pool","Spa","Gym","Restaurant","Bar","Concierge","Butler Service","Tennis"],
    images: ["https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=800"],
    rating: 4.8,
  },
  {
    name: "Marina Bay Sands",
    description: "The world-famous infinity pool in the sky. Three towers topped by a SkyPark with panoramic views over Singapore Bay.",
    city: "Singapore", address: "10 Bayfront Avenue, Singapore 018956", stars: 5,
    amenities: ["SkyPark Infinity Pool","Casino","Spa","Gym","Restaurant","Bar","Shopping Mall"],
    images: ["https://images.unsplash.com/photo-1508009603885-50cf7c8dd0d5?auto=format&fit=crop&q=80&w=800"],
    rating: 4.7,
  },
  {
    name: "Four Seasons Bali at Jimbaran Bay",
    description: "Private villas cascading down terraced hillsides to a pristine crescent bay with a dedicated cooking school.",
    city: "Bali", address: "Jimbaran, Kuta Sel., Kabupaten Badung, Bali 80361, Indonesia", stars: 5,
    amenities: ["Private Pool Villas","Spa","Cooking School","Beach Club","Gym","Restaurant","Bar"],
    images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800"],
    rating: 4.8,
  },
  {
    name: "Alila Villas Uluwatu",
    description: "Dramatic clifftop infinity pools hovering 70m above the Indian Ocean. Bali's most architecturally striking ultra-luxury villa resort.",
    city: "Bali", address: "Jalan Belimbing Sari, Pecatu, Uluwatu, Bali 80364", stars: 5,
    amenities: ["Cliff Infinity Pool","Spa","Gym","Restaurant","Bar","Ocean Views","Butler Service"],
    images: ["https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800"],
    rating: 4.9,
  },
  {
    name: "Rosewood Phuket",
    description: "Terraced hillside resort overlooking Emerald Bay with spectacular sea views, overwater villas and three sparkling pools.",
    city: "Phuket", address: "88/28 Muen-Ngoen Road, Patong, Phuket 83150, Thailand", stars: 5,
    amenities: ["Infinity Pool","Spa","Beach Club","Gym","Restaurant","Bar","Yacht Charter"],
    images: ["https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&q=80&w=800"],
    rating: 4.7,
  },
  {
    name: "Anantara Riverside Bangkok",
    description: "Enchanting riverside resort on the Chao Phraya with tropical gardens, traditional Thai cooking school and legendary Sunday brunch.",
    city: "Bangkok", address: "257/1-3 Charoennakorn Road, Thonburi, Bangkok 10600, Thailand", stars: 5,
    amenities: ["Riverside Pool","Spa","Cooking School","Gym","Restaurant","Bar","Free Ferry"],
    images: ["https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&q=80&w=800"],
    rating: 4.6,
  },
  {
    name: "The Reverie Saigon",
    description: "Ho Chi Minh City's grandest new hotel with Italian-crafted furniture, a magnificent ballroom and riverside skyline views.",
    city: "Ho Chi Minh City", address: "22-36 Nguyen Hue Boulevard, District 1, Ho Chi Minh City, Vietnam", stars: 5,
    amenities: ["Pool","Spa","Gym","Restaurant","Bar","Concierge","Butler Service"],
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"],
    rating: 4.7,
  },
  // AMERICAS
  {
    name: "The Plaza New York",
    description: "A National Historic Landmark at Central Park. Eloise's home, host to presidents and royalty for over a century on 5th Avenue.",
    city: "New York", address: "768 5th Ave, New York, NY 10019, USA", stars: 5,
    amenities: ["Spa","Gym","Restaurant","Bar","Concierge","Butler Service","Shopping Arcade"],
    images: ["https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=800"],
    rating: 4.7,
  },
  {
    name: "The St. Regis New York",
    description: "John Jacob Astor's 1904 masterpiece on Fifth Avenue, renowned for the invention of the Bloody Mary and impeccable butler service.",
    city: "New York", address: "2 E 55th St, New York, NY 10022, USA", stars: 5,
    amenities: ["Spa","Gym","Restaurant","Bar","Butler Service","Concierge"],
    images: ["https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=800"],
    rating: 4.8,
  },
  {
    name: "Faena Hotel Miami Beach",
    description: "South Beach's most theatrical luxury experience with Damien Hirst artworks, a gilded mammoth skeleton and cabaret shows.",
    city: "Miami", address: "3201 Collins Ave, Miami Beach, FL 33140, USA", stars: 5,
    amenities: ["Ocean Pool","Spa","Beach Club","Gym","Restaurant","Bar","Cabaret"],
    images: ["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=800"],
    rating: 4.6,
  },
  {
    name: "Four Seasons Los Angeles",
    description: "Hollywood glamour meets Beverly Hills luxury. Poolside celebrity sightings and walking distance from Rodeo Drive.",
    city: "Los Angeles", address: "300 S Doheny Dr, Los Angeles, CA 90048, USA", stars: 5,
    amenities: ["Outdoor Pool","Spa","Gym","Restaurant","Bar","Concierge"],
    images: ["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800"],
    rating: 4.6,
  },
  {
    name: "Rosewood San Miguel de Allende",
    description: "Colonial palace in the UNESCO World Heritage city of San Miguel, with cobblestone courtyards, rooftop views and artisanal mezcal bar.",
    city: "San Miguel de Allende", address: "Nemesio Diez 11, Zona Centro, San Miguel de Allende, Mexico", stars: 5,
    amenities: ["Rooftop Pool","Spa","Gym","Restaurant","Bar","Concierge","Cultural Activities"],
    images: ["https://images.unsplash.com/photo-1502786129293-79981df4e689?auto=format&fit=crop&q=80&w=800"],
    rating: 4.8,
  },
  {
    name: "Awasi Patagonia",
    description: "Remote luxury eco-lodge on the edge of Torres del Paine National Park, with exclusive private guides and overwater bungalows.",
    city: "Patagonia", address: "Torres del Paine National Park, Magallanes, Chile", stars: 5,
    amenities: ["Private Guides","Spa","Restaurant","Bar","Hiking","Wildlife Watching"],
    images: ["https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&q=80&w=800"],
    rating: 4.9,
  },
  // MIDDLE EAST & AFRICA
  {
    name: "Burj Al Arab Jumeirah",
    description: "The world's only 7-star hotel on its own man-made island, with gold-plated interiors, submarine dining and a helipad.",
    city: "Dubai", address: "Jumeirah St, Dubai, United Arab Emirates", stars: 5,
    amenities: ["Private Beach","Pool","Spa","Gym","Restaurant","Bar","Helipad","Butler Service"],
    images: ["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800"],
    rating: 4.9,
  },
  {
    name: "Atlantis The Palm",
    description: "Dubai's legendary resort on Palm Jumeirah with Aquaventure Waterpark, The Lost Chambers Aquarium and 46,000 sqm of water slides.",
    city: "Dubai", address: "Palm Jumeirah, Dubai, United Arab Emirates", stars: 5,
    amenities: ["Waterpark","Aquarium","Beach","Pool","Spa","Gym","Restaurant","Bar"],
    images: ["https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&q=80&w=800"],
    rating: 4.7,
  },
  {
    name: "Royal Mansour Marrakech",
    description: "A medina within the medina — 53 private riads built by King Mohammed VI with hammams and a three-Michelin-starred restaurant.",
    city: "Marrakech", address: "Rue Abou Abbas El Sebti, Marrakech 40000, Morocco", stars: 5,
    amenities: ["Private Riads","Hammam","Spa","Pool","Restaurant","Bar","Cooking Class"],
    images: ["https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&q=80&w=800"],
    rating: 4.9,
  },
  {
    name: "One&Only Cape Town",
    description: "South Africa's most glamorous hotel on the Victoria & Alfred Waterfront with Table Mountain views and world-class cuisine.",
    city: "Cape Town", address: "Dock Road, V&A Waterfront, Cape Town 8002, South Africa", stars: 5,
    amenities: ["Pool","Spa","Gym","Restaurant","Bar","Concierge","Mountain Views"],
    images: ["https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&q=80&w=800"],
    rating: 4.8,
  },
  {
    name: "Singita Grumeti",
    description: "Ultra-exclusive safari lodge inside the private Grumeti Reserve bordering the Serengeti with all-inclusive game drives.",
    city: "Serengeti", address: "Grumeti Reserve, Mugumu, Tanzania", stars: 5,
    amenities: ["Game Drives","Pool","Spa","Gym","Restaurant","Bar","Conservation"],
    images: ["https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800"],
    rating: 4.9,
  },
  // AUSTRALIA / PACIFIC
  {
    name: "Qualia Hamilton Island",
    description: "Australia's most acclaimed resort, perched on the northern tip of Hamilton Island with 60 private pavilions and Great Barrier Reef access.",
    city: "Hamilton Island", address: "20 Whitsunday Boulevard, Hamilton Island QLD 4803, Australia", stars: 5,
    amenities: ["Infinity Pool","Spa","Gym","Restaurant","Bar","Reef Diving","Yacht Charter"],
    images: ["https://images.unsplash.com/photo-1468581264429-2548ef9eb732?auto=format&fit=crop&q=80&w=800"],
    rating: 4.9,
  },
  {
    name: "Park Hyatt Sydney",
    description: "Sydney Harbour's most coveted address in The Rocks with unobstructed views of the Opera House and Harbour Bridge from every room.",
    city: "Sydney", address: "7 Hickson Rd, The Rocks NSW 2000, Australia", stars: 5,
    amenities: ["Harbour Pool","Spa","Gym","Restaurant","Bar","Concierge","Yacht Access"],
    images: ["https://images.unsplash.com/photo-1549180030-48bf079fb38a?auto=format&fit=crop&q=80&w=800"],
    rating: 4.7,
  },
  // SOUTH ASIA
  {
    name: "Taj Lake Palace",
    description: "A white marble palace floating on Lake Pichola. Udaipur's most magical address built in 1746 as a royal summer palace.",
    city: "Udaipur", address: "Lake Pichola, Udaipur, Rajasthan 313001, India", stars: 5,
    amenities: ["Lake Pool","Spa","Restaurant","Bar","Boat Transfer","Concierge","Heritage Tours"],
    images: ["https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=800"],
    rating: 4.8,
  },
  {
    name: "Soneva Fushi",
    description: "Barefoot luxury at its finest — a private island in the Maldives with over-water villas, open-air cinema and organic gardens.",
    city: "Maldives", address: "Kunfunadhoo Island, Baa Atoll, Maldives", stars: 5,
    amenities: ["Private Beach","Overwater Villas","Spa","Diving","Restaurant","Bar","Observatory"],
    images: ["https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&q=80&w=800"],
    rating: 4.9,
  },
];

const roomData = {
  single: {
    descriptions: [
      "Elegantly appointed single room with premium bedding, marble bathroom and panoramic views.",
      "Cosy single room featuring bespoke furnishings, king-size bed and espresso machine.",
    ],
    images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800"],
  },
  double: {
    descriptions: [
      "Spacious double room with separate lounge area, twin or king-size bed and panoramic views.",
      "Beautifully designed double room with rich fabrics, rainfall shower and pillow menu.",
    ],
    images: ["https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800"],
  },
  deluxe: {
    descriptions: [
      "Expansive deluxe room with separate living area, soaking tub and premium minibar.",
      "Superior deluxe room with floor-to-ceiling windows, walk-in wardrobe and butler pantry.",
    ],
    images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800"],
  },
  suite: {
    descriptions: [
      "Lavish one-bedroom suite with private terrace, dining area and dedicated butler service.",
      "Grand suite spanning an entire floor with dual bathrooms, kitchen and sweeping skyline views.",
    ],
    images: ["https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=800"],
  },
};

const luxuryRooms = [
  { type: "single", priceBase: 380, guests: 1 },
  { type: "double", priceBase: 580, guests: 2 },
  { type: "deluxe", priceBase: 920, guests: 2 },
  { type: "suite", priceBase: 2200, guests: 4 },
];
const upscaleRooms = [
  { type: "single", priceBase: 220, guests: 1 },
  { type: "double", priceBase: 320, guests: 2 },
  { type: "deluxe", priceBase: 480, guests: 2 },
  { type: "suite", priceBase: 850, guests: 4 },
];

let hotelCount = 0;
let roomCount = 0;

for (const hotel of hotels) {
  const r = await client.query(
    `INSERT INTO hotels (name, description, city, address, stars, amenities, images, rating)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     ON CONFLICT DO NOTHING
     RETURNING id`,
    [
      hotel.name,
      hotel.description,
      hotel.city,
      hotel.address,
      hotel.stars,
      hotel.amenities,
      hotel.images,
      hotel.rating,
    ]
  );

  if (r.rows.length === 0) {
    console.log(`Skipping ${hotel.name} (already exists)`);
    continue;
  }

  const hotelId = r.rows[0].id;
  hotelCount++;

  const template = hotel.stars === 5 ? luxuryRooms : upscaleRooms;
  for (const room of template) {
    const jitter = Math.floor(Math.random() * 60) - 25;
    const rd = roomData[room.type];
    const desc = rd.descriptions[Math.floor(Math.random() * rd.descriptions.length)];

    await client.query(
      `INSERT INTO rooms (hotel_id, type, price, guests, description, images)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [hotelId, room.type, room.priceBase + jitter, room.guests, desc, rd.images]
    );
    roomCount++;
  }
  console.log(`✓ ${hotel.name} (${hotel.city}) — 4 rooms added`);
}

console.log(`\n✅ Done! Inserted ${hotelCount} hotels and ${roomCount} rooms.`);
await client.end();
