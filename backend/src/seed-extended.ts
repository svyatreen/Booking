import { db, hotelsTable, roomsTable } from "../db";

const hotels = [
  // EUROPE
  {
    name: "Le Grand Ritz",
    description: "Legendary Parisian palace hotel offering timeless elegance, Michelin-starred dining, and a world-famous cocktail bar in the heart of Place Vendôme.",
    city: "Paris",
    address: "15 Place Vendôme, 75001 Paris, France",
    stars: 5,
    amenities: ["Pool", "Spa", "Gym", "Restaurant", "Bar", "Concierge", "Room Service", "Valet Parking"],
    images: ["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=800"],
  },
  {
    name: "Hôtel de Crillon",
    description: "An 18th-century palace on Place de la Concorde with breathtaking views of the Eiffel Tower and exquisite French haute cuisine.",
    city: "Paris",
    address: "10 Place de la Concorde, 75008 Paris, France",
    stars: 5,
    amenities: ["Spa", "Pool", "Restaurant", "Bar", "Concierge", "Butler Service", "Gym"],
    images: ["https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&q=80&w=800"],
  },
  {
    name: "The Savoy",
    description: "London's most iconic hotel since 1889. Art Deco grandeur meets modern luxury on the Thames Embankment with world-class dining from Gordon Ramsay.",
    city: "London",
    address: "Strand, London WC2R 0EU, United Kingdom",
    stars: 5,
    amenities: ["Pool", "Spa", "Gym", "Restaurant", "Bar", "Theatre Access", "Concierge"],
    images: ["https://images.unsplash.com/photo-1542314831-c6a4d1400850?auto=format&fit=crop&q=80&w=800"],
  },
  {
    name: "The Langham London",
    description: "Europe's first grand hotel, reimagined for the modern traveller. Steps from Oxford Street and Regent Street with an award-winning spa.",
    city: "London",
    address: "1C Portland Place, Regent Street, London W1B 1JA, UK",
    stars: 5,
    amenities: ["Spa", "Pool", "Gym", "Restaurant", "Bar", "Concierge", "Business Center"],
    images: ["https://images.unsplash.com/photo-1551918120-9739cb430c6d?auto=format&fit=crop&q=80&w=800"],
  },
  {
    name: "Hotel Adlon Kempinski",
    description: "Berlin's most prestigious address since 1907. Located at the Brandenburg Gate with legendary service and world-class gastronomy.",
    city: "Berlin",
    address: "Unter den Linden 77, 10117 Berlin, Germany",
    stars: 5,
    amenities: ["Spa", "Pool", "Gym", "Restaurant", "Bar", "Concierge", "Valet"],
    images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800"],
  },
  {
    name: "Mandarin Oriental Munich",
    description: "Sophisticated urban retreat in the heart of Munich, blending Bavarian heritage with Asian serenity, near the English Garden.",
    city: "Munich",
    address: "Neuturmstrasse 1, 80331 Munich, Germany",
    stars: 5,
    amenities: ["Spa", "Pool", "Gym", "Restaurant", "Bar", "Concierge", "Sauna"],
    images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800"],
  },
  {
    name: "W Barcelona",
    description: "Iconic sail-shaped tower on Barceloneta Beach with 360° sea views, rooftop pool, celebrity DJs and the best cocktail scene in the city.",
    city: "Barcelona",
    address: "Plaça de la Rosa dels Vents 1, 08039 Barcelona, Spain",
    stars: 5,
    amenities: ["Rooftop Pool", "Spa", "Gym", "Restaurant", "Bar", "Beach Access", "DJ Lounge"],
    images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800"],
  },
  {
    name: "Hotel Arts Barcelona",
    description: "Soaring 44-storey tower on the seafront offering stunning Mediterranean views, Michelin-starred dining and a mosaic infinity pool.",
    city: "Barcelona",
    address: "Carrer de la Marina, 19-21, 08005 Barcelona, Spain",
    stars: 5,
    amenities: ["Infinity Pool", "Spa", "Gym", "Restaurant", "Bar", "Beach Access", "Concierge"],
    images: ["https://images.unsplash.com/photo-1529290130-4ca3753253ae?auto=format&fit=crop&q=80&w=800"],
  },
  {
    name: "Palazzo Versace Rome",
    description: "Fashion-forward luxury hotel in an 18th-century palazzo steps from the Colosseum, featuring Versace interiors and Mediterranean gardens.",
    city: "Rome",
    address: "Via Veneto 127, 00187 Rome, Italy",
    stars: 5,
    amenities: ["Pool", "Spa", "Gym", "Restaurant", "Bar", "Concierge", "Art Collection"],
    images: ["https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800"],
  },
  {
    name: "Aman Venice",
    description: "A 16th-century palazzo on the Grand Canal housing one of Venice's most extraordinary private residences with its own boats and gardens.",
    city: "Venice",
    address: "Calle Tiepolo 1364, 30135 Venice, Italy",
    stars: 5,
    amenities: ["Private Boats", "Garden", "Spa", "Restaurant", "Bar", "Concierge", "Butler Service"],
    images: ["https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80&w=800"],
  },
  {
    name: "Baur au Lac",
    description: "Zurich's most distinguished address since 1844 overlooking Lake Zurich, combining Swiss precision with opulent comfort and Michelin-star dining.",
    city: "Zurich",
    address: "Talstrasse 1, 8001 Zürich, Switzerland",
    stars: 5,
    amenities: ["Spa", "Restaurant", "Bar", "Concierge", "Lake View", "Gym", "Private Garden"],
    images: ["https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&q=80&w=800"],
  },
  {
    name: "Hotel Sacher Vienna",
    description: "The birthplace of the legendary Sachertorte. Vienna's most storied hotel blending imperial grandeur with contemporary luxury since 1876.",
    city: "Vienna",
    address: "Philharmoniker Str. 4, 1010 Vienna, Austria",
    stars: 5,
    amenities: ["Spa", "Restaurant", "Bar", "Concierge", "Café", "Gym", "Opera Access"],
    images: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800"],
  },
  {
    name: "Grand Hotel Stockholm",
    description: "Sweden's finest hotel since 1874, facing the Royal Palace across the water, with Nobel Prize banquets tradition and Nordic spa.",
    city: "Stockholm",
    address: "Södra Blasieholmshamnen 8, 103 27 Stockholm, Sweden",
    stars: 5,
    amenities: ["Spa", "Restaurant", "Bar", "Concierge", "Waterfront Views", "Gym"],
    images: ["https://images.unsplash.com/photo-1517840901100-8179e982acb7?auto=format&fit=crop&q=80&w=800"],
  },
  {
    name: "Four Seasons Amsterdam",
    description: "Twin 17th-century canal houses transformed into an intimate luxury retreat in the heart of the Golden Ring with private canal access.",
    city: "Amsterdam",
    address: "Keizergracht 99, 1015 AG Amsterdam, Netherlands",
    stars: 5,
    amenities: ["Spa", "Restaurant", "Bar", "Concierge", "Canal Terrace", "Gym"],
    images: ["https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=800"],
  },

  // ASIA
  {
    name: "The Peninsula Tokyo",
    description: "Tokyo's most prestigious address fusing Japanese harmony with Western luxury. Iconic views of the Imperial Palace from every room.",
    city: "Tokyo",
    address: "1-8-1 Yurakucho, Chiyoda City, Tokyo 100-0006, Japan",
    stars: 5,
    amenities: ["Rooftop Pool", "Spa", "Gym", "Restaurant", "Bar", "Concierge", "Helicopter Transfer"],
    images: ["https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800"],
  },
  {
    name: "Park Hyatt Tokyo",
    description: "Made famous by Lost in Translation, this sky-high hotel occupies floors 41-52 of a Shinjuku tower with incomparable city-and-Fuji views.",
    city: "Tokyo",
    address: "3-7-1-2 Nishi Shinjuku, Shinjuku-ku, Tokyo 163-1055, Japan",
    stars: 5,
    amenities: ["Infinity Pool", "Gym", "Restaurant", "Bar", "Spa", "Library"],
    images: ["https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&q=80&w=800"],
  },
  {
    name: "Raffles Singapore",
    description: "The birthplace of the Singapore Sling. A National Monument of Singapore with lush tropics, grand colonial architecture and impeccable butler service.",
    city: "Singapore",
    address: "1 Beach Road, Singapore 189673",
    stars: 5,
    amenities: ["Pool", "Spa", "Gym", "Restaurant", "Bar", "Concierge", "Butler Service", "Tennis"],
    images: ["https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=800"],
  },
  {
    name: "Marina Bay Sands",
    description: "The world-famous infinity pool in the sky. Three towers topped by a SkyPark with panoramic views over Singapore Bay and the city skyline.",
    city: "Singapore",
    address: "10 Bayfront Avenue, Singapore 018956",
    stars: 5,
    amenities: ["SkyPark Infinity Pool", "Casino", "Spa", "Gym", "Restaurant", "Bar", "Shopping Mall"],
    images: ["https://images.unsplash.com/photo-1508009603885-50cf7c8dd0d5?auto=format&fit=crop&q=80&w=800"],
  },
  {
    name: "Four Seasons Bali at Jimbaran Bay",
    description: "Private villas cascading down terraced hillsides to a pristine crescent bay, with a dedicated cooking school and artisan village.",
    city: "Bali",
    address: "Jimbaran, Kuta Sel., Kabupaten Badung, Bali 80361, Indonesia",
    stars: 5,
    amenities: ["Private Pool Villas", "Spa", "Cooking School", "Beach Club", "Gym", "Restaurant", "Bar"],
    images: ["https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800"],
  },
  {
    name: "Alila Villas Uluwatu",
    description: "Dramatic clifftop infinity pools hovering 70m above the Indian Ocean. Bali's most architecturally striking ultra-luxury villa resort.",
    city: "Bali",
    address: "Jalan Belimbing Sari, Banjar Tambiyak, Pecatu, Uluwatu, Bali 80364",
    stars: 5,
    amenities: ["Cliff Infinity Pool", "Spa", "Gym", "Restaurant", "Bar", "Ocean Views", "Butler Service"],
    images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800"],
  },
  {
    name: "Capella Singapore",
    description: "Nestled within 30 acres of lush tropical rainforest on Sentosa Island, with colonial bungalows, a beach club and world-class dining.",
    city: "Singapore",
    address: "1 The Knolls, Sentosa Island, Singapore 098297",
    stars: 5,
    amenities: ["Pool", "Beach Club", "Spa", "Gym", "Restaurant", "Bar", "Golf", "Tennis"],
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"],
  },
  {
    name: "Aman Tokyo",
    description: "Urban sanctuary spanning the top six floors of Otemachi Tower. Seamlessly blends zen philosophy with contemporary Japanese design.",
    city: "Tokyo",
    address: "The Otemachi Tower, 1-5-6 Otemachi, Chiyoda, Tokyo 100-0004",
    stars: 5,
    amenities: ["Indoor Pool", "Spa", "Gym", "Restaurant", "Bar", "Meditation Room", "Concierge"],
    images: ["https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&q=80&w=800"],
  },
  {
    name: "Rosewood Phuket",
    description: "Terraced hillside resort overlooking Emerald Bay with spectacular sea views, overwater villas and three sparkling pools.",
    city: "Phuket",
    address: "88/28 Muen-Ngoen Road, Patong, Phuket 83150, Thailand",
    stars: 5,
    amenities: ["Infinity Pool", "Spa", "Beach Club", "Gym", "Restaurant", "Bar", "Yacht Charter"],
    images: ["https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&q=80&w=800"],
  },
  {
    name: "Anantara Riverside Bangkok",
    description: "Enchanting riverside resort on the Chao Phraya with tropical gardens, traditional Thai cooking school and legendary Sunday brunch.",
    city: "Bangkok",
    address: "257/1-3 Charoennakorn Road, Thonburi, Bangkok 10600, Thailand",
    stars: 5,
    amenities: ["Riverside Pool", "Spa", "Cooking School", "Gym", "Restaurant", "Bar", "Free Ferry"],
    images: ["https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&q=80&w=800"],
  },

  // AMERICAS
  {
    name: "The Plaza New York",
    description: "A National Historic Landmark at Central Park. Eloise's home, host to presidents and royalty for over a century on 5th Avenue.",
    city: "New York",
    address: "768 5th Ave, New York, NY 10019, USA",
    stars: 5,
    amenities: ["Spa", "Gym", "Restaurant", "Bar", "Concierge", "Butler Service", "Shopping Arcade"],
    images: ["https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=800"],
  },
  {
    name: "The St. Regis New York",
    description: "John Jacob Astor's 1904 masterpiece on Fifth Avenue, renowned for the invention of the Bloody Mary and impeccable butler service.",
    city: "New York",
    address: "2 E 55th St, New York, NY 10022, USA",
    stars: 5,
    amenities: ["Spa", "Gym", "Restaurant", "Bar", "Butler Service", "Concierge"],
    images: ["https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=800"],
  },
  {
    name: "Faena Hotel Miami Beach",
    description: "South Beach's most theatrical luxury experience. Damien Hirst artworks, a gilded mammoth skeleton, cabaret shows and powdery beach.",
    city: "Miami",
    address: "3201 Collins Ave, Miami Beach, FL 33140, USA",
    stars: 5,
    amenities: ["Ocean Pool", "Spa", "Beach Club", "Gym", "Restaurant", "Bar", "Cabaret"],
    images: ["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=800"],
  },
  {
    name: "Post Ranch Inn",
    description: "Perched 1,200 feet above the Pacific Ocean in Big Sur. Eco-luxury treehouses and cliff houses merge with wild natural scenery.",
    city: "Big Sur",
    address: "47900 CA-1, Big Sur, CA 93920, USA",
    stars: 5,
    amenities: ["Cliff Pool", "Spa", "Restaurant", "Bar", "Yoga", "Stargazing", "Hiking"],
    images: ["https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?auto=format&fit=crop&q=80&w=800"],
  },
  {
    name: "Four Seasons Los Angeles",
    description: "Hollywood glamour meets Beverly Hills luxury. Poolside celebrity sightings, award-winning cuisine and walking distance from Rodeo Drive.",
    city: "Los Angeles",
    address: "300 S Doheny Dr, Los Angeles, CA 90048, USA",
    stars: 5,
    amenities: ["Outdoor Pool", "Spa", "Gym", "Restaurant", "Bar", "Concierge"],
    images: ["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800"],
  },

  // MIDDLE EAST & AFRICA
  {
    name: "Burj Al Arab Jumeirah",
    description: "The world's only 7-star hotel on its own man-made island. Gold-plated interiors, submarine dining, private butler and helipad.",
    city: "Dubai",
    address: "Jumeirah St, Dubai, United Arab Emirates",
    stars: 5,
    amenities: ["Private Beach", "Pool", "Spa", "Gym", "Restaurant", "Bar", "Helipad", "Butler Service"],
    images: ["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800"],
  },
  {
    name: "Atlantis The Palm",
    description: "Dubai's legendary resort on Palm Jumeirah with Aquaventure Waterpark, The Lost Chambers Aquarium and 46,000 sqm of water slides.",
    city: "Dubai",
    address: "Palm Jumeirah, Dubai, United Arab Emirates",
    stars: 5,
    amenities: ["Waterpark", "Aquarium", "Beach", "Pool", "Spa", "Gym", "Restaurant", "Bar", "Casino"],
    images: ["https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&q=80&w=800"],
  },
  {
    name: "Royal Mansour Marrakech",
    description: "A medina within the medina. 53 private riads built by King Mohammed VI with hammams, a three-Michelin-starred restaurant and endless gardens.",
    city: "Marrakech",
    address: "Rue Abou Abbas El Sebti, Marrakech 40000, Morocco",
    stars: 5,
    amenities: ["Private Riads", "Hammam", "Spa", "Pool", "Restaurant", "Bar", "Cooking Class"],
    images: ["https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&q=80&w=800"],
  },
  {
    name: "Singita Grumeti",
    description: "Ultra-exclusive safari lodge inside the private Grumeti Reserve bordering the Serengeti, with all-inclusive game drives and fine dining.",
    city: "Serengeti",
    address: "Grumeti Reserve, Mugumu, Tanzania",
    stars: 5,
    amenities: ["Game Drives", "Pool", "Spa", "Gym", "Restaurant", "Bar", "Conservation Activities"],
    images: ["https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800"],
  },
];

const roomTemplates: Record<string, Array<{ type: "single" | "double" | "deluxe" | "suite"; priceBase: number; guestsBase: number }>> = {
  budget: [
    { type: "single", priceBase: 120, guestsBase: 1 },
    { type: "double", priceBase: 180, guestsBase: 2 },
    { type: "deluxe", priceBase: 260, guestsBase: 2 },
    { type: "suite", priceBase: 450, guestsBase: 4 },
  ],
  luxury: [
    { type: "single", priceBase: 350, guestsBase: 1 },
    { type: "double", priceBase: 550, guestsBase: 2 },
    { type: "deluxe", priceBase: 850, guestsBase: 2 },
    { type: "suite", priceBase: 1800, guestsBase: 4 },
  ],
};

const roomImages: Record<string, string[]> = {
  single: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800"],
  double: ["https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800"],
  deluxe: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800"],
  suite: ["https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=800"],
};

const roomDescriptions: Record<string, string[]> = {
  single: [
    "Elegantly appointed single room with premium bedding, marble bathroom and city views.",
    "Cosy single room featuring bespoke furnishings, a king-size bed and espresso machine.",
  ],
  double: [
    "Spacious double room with separate lounge area, twin or king-size bed and panoramic views.",
    "Beautifully designed double room with rich fabrics, rainfall shower and pillow menu.",
  ],
  deluxe: [
    "Expansive deluxe room with separate living area, soaking tub and premium minibar.",
    "Superior deluxe room with floor-to-ceiling windows, a walk-in wardrobe and butler pantry.",
  ],
  suite: [
    "Lavish one-bedroom suite with a private terrace, dining area and dedicated butler service.",
    "Grand suite spanning an entire floor with dual bathrooms, kitchen and sweeping skyline views.",
  ],
};

async function seed() {
  console.log("🌱 Seeding extended hotel data...");

  let insertedHotels = 0;
  let insertedRooms = 0;

  for (const hotel of hotels) {
    try {
      const [inserted] = await db
        .insert(hotelsTable)
        .values({
          name: hotel.name,
          description: hotel.description,
          city: hotel.city,
          address: hotel.address,
          stars: hotel.stars,
          amenities: hotel.amenities,
          images: hotel.images,
          rating: parseFloat((3.8 + Math.random() * 1.2).toFixed(1)),
        })
        .returning();

      insertedHotels++;

      const template = hotel.stars === 5 ? roomTemplates.luxury : roomTemplates.budget;

      for (const room of template) {
        const jitter = Math.floor(Math.random() * 50) - 20;
        const descIdx = Math.floor(Math.random() * 2);

        await db.insert(roomsTable).values({
          hotelId: inserted.id,
          type: room.type,
          price: room.priceBase + jitter,
          guests: room.guestsBase,
          description: roomDescriptions[room.type][descIdx],
          images: roomImages[room.type],
        });

        insertedRooms++;
      }
    } catch (err) {
      console.error(`Failed to insert ${hotel.name}:`, err);
    }
  }

  console.log(`✅ Inserted ${insertedHotels} hotels and ${insertedRooms} rooms`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
