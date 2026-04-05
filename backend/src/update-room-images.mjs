/**
 * Assigns 4 unique, relevant images to every room.
 * Each room type has 10 hand-curated image sets.
 * Hotels cycle through the sets so neighbouring hotels always look different.
 */
import pg from "pg";
const { Client } = pg;
const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const Q = "auto=format&fit=crop&q=85&w=1200";
const u = (id) => `https://images.unsplash.com/${id}?${Q}`;

// ─── IMAGE SETS PER ROOM TYPE ────────────────────────────────────────────────
// 10 distinct sets × 4 images.  Hotels cycle: hotel i → set i % 10.

const SETS = {
  single: [
    // 0 – clean Scandinavian
    [u("photo-1631049307264-da0ec9d70304"), u("photo-1484101403633-562f891dc89a"), u("photo-1590073242678-70ee3fc28e8e"), u("photo-1522771739844-6a9f6d5f14af")],
    // 1 – warm boutique
    [u("photo-1560347876-aeef00ee58a1"), u("photo-1566073771259-6a8506099945"), u("photo-1568495248636-6432b97bd949"), u("photo-1549638441-b787d2e11f14")],
    // 2 – modern urban
    [u("photo-1578683010236-d716f9a3f461"), u("photo-1590490360182-c33d57733427"), u("photo-1596178065887-1198b6148b2b"), u("photo-1611892440504-42a792e24d32")],
    // 3 – classic European
    [u("photo-1618773928121-c32242e63f39"), u("photo-1455587734955-081b22074882"), u("photo-1551882547-ff40c63fe5fa"), u("photo-1584132967334-10e028bd69f7")],
    // 4 – crisp contemporary
    [u("photo-1629078524994-11f9cfc6b2b2"), u("photo-1595576508898-0ad5d87f2ac8"), u("photo-1493809842364-78817add7ffb"), u("photo-1556742049-0cfed4f6a45d")],
    // 5 – Asian minimalist
    [u("photo-1495362979636-1dc8b872e23e"), u("photo-1526481280693-3bfa7568e0f3"), u("photo-1509316785289-025f5b846b35"), u("photo-1544161515-4ab6ce6db874")],
    // 6 – tropical resort
    [u("photo-1558618666-fcd25c85cd64"), u("photo-1537996194471-e657df975ab4"), u("photo-1507525428034-b723cf961d3e"), u("photo-1563911302283-d2bc129e7570")],
    // 7 – city view
    [u("photo-1551918120-9739cb430c6d"), u("photo-1571003123894-1f0594d2b5d9"), u("photo-1477959858617-67f85cf4f1df"), u("photo-1502602898657-3e91760cbb34")],
    // 8 – desert / exotic
    [u("photo-1547471080-7cc2caa01a7e"), u("photo-1553267751-1c148a7280a1"), u("photo-1539020140153-e479b8c22e70"), u("photo-1519681393784-d120267933ba")],
    // 9 – safari / nature lodge
    [u("photo-1516426122078-c23e76319801"), u("photo-1564760290292-23341e4df6ec"), u("photo-1509316785289-025f5b846b35"), u("photo-1568495248636-6432b97bd949")],
  ],

  double: [
    // 0
    [u("photo-1618773928121-c32242e63f39"), u("photo-1584132967334-10e028bd69f7"), u("photo-1590073242678-70ee3fc28e8e"), u("photo-1566073771259-6a8506099945")],
    // 1
    [u("photo-1571003123894-1f0594d2b5d9"), u("photo-1568495248636-6432b97bd949"), u("photo-1551882547-ff40c63fe5fa"), u("photo-1563911302283-d2bc129e7570")],
    // 2
    [u("photo-1596178065887-1198b6148b2b"), u("photo-1613977257592-4871e5fcd7c4"), u("photo-1560347876-aeef00ee58a1"), u("photo-1590073242678-70ee3fc28e8e")],
    // 3
    [u("photo-1615460549969-36fa19521a4f"), u("photo-1622547748225-3fc4abd2cca0"), u("photo-1556742049-0cfed4f6a45d"), u("photo-1544161515-4ab6ce6db874")],
    // 4
    [u("photo-1582719478250-c89cae4dc85b"), u("photo-1537996194471-e657df975ab4"), u("photo-1507525428034-b723cf961d3e"), u("photo-1558618666-fcd25c85cd64")],
    // 5
    [u("photo-1526481280693-3bfa7568e0f3"), u("photo-1480796927426-f609979314bd"), u("photo-1545569341-9eb8b30979d9"), u("photo-1544161515-4ab6ce6db874")],
    // 6
    [u("photo-1590490360182-c33d57733427"), u("photo-1455587734955-081b22074882"), u("photo-1549638441-b787d2e11f14"), u("photo-1502602898657-3e91760cbb34")],
    // 7
    [u("photo-1551918120-9739cb430c6d"), u("photo-1631049307264-da0ec9d70304"), u("photo-1484101403633-562f891dc89a"), u("photo-1578683010236-d716f9a3f461")],
    // 8
    [u("photo-1563492065-d1e8a9739282"), u("photo-1583417319070-4a69db38a482"), u("photo-1565967511849-76a60a516170"), u("photo-1508009603885-50cf7c8dd0d5")],
    // 9
    [u("photo-1516426122078-c23e76319801"), u("photo-1474511320723-9a56873867b5"), u("photo-1509316785289-025f5b846b35"), u("photo-1519681393784-d120267933ba")],
  ],

  deluxe: [
    // 0
    [u("photo-1582719478250-c89cae4dc85b"), u("photo-1590073242678-70ee3fc28e8e"), u("photo-1571003123894-1f0594d2b5d9"), u("photo-1584132967334-10e028bd69f7")],
    // 1
    [u("photo-1615460549969-36fa19521a4f"), u("photo-1613977257592-4871e5fcd7c4"), u("photo-1596178065887-1198b6148b2b"), u("photo-1566073771259-6a8506099945")],
    // 2
    [u("photo-1563911302283-d2bc129e7570"), u("photo-1551882547-ff40c63fe5fa"), u("photo-1568495248636-6432b97bd949"), u("photo-1556742049-0cfed4f6a45d")],
    // 3
    [u("photo-1590490360182-c33d57733427"), u("photo-1618773928121-c32242e63f39"), u("photo-1559508551-44bff1de756b"), u("photo-1544161515-4ab6ce6db874")],
    // 4
    [u("photo-1537996194471-e657df975ab4"), u("photo-1558618666-fcd25c85cd64"), u("photo-1507525428034-b723cf961d3e"), u("photo-1582719478250-c89cae4dc85b")],
    // 5
    [u("photo-1480796927426-f609979314bd"), u("photo-1526481280693-3bfa7568e0f3"), u("photo-1545569341-9eb8b30979d9"), u("photo-1590073242678-70ee3fc28e8e")],
    // 6
    [u("photo-1508009603885-50cf7c8dd0d5"), u("photo-1565967511849-76a60a516170"), u("photo-1525625293386-3f8f99389edd"), u("photo-1583417319070-4a69db38a482")],
    // 7
    [u("photo-1512453979798-5ea266f8880c"), u("photo-1518684079-3c830dcef090"), u("photo-1563492065-d1e8a9739282"), u("photo-1539020140153-e479b8c22e70")],
    // 8
    [u("photo-1573843981267-be1999ff37cd"), u("photo-1537996194471-e657df975ab4"), u("photo-1507525428034-b723cf961d3e"), u("photo-1571896349842-33c89424de2d")],
    // 9
    [u("photo-1516426122078-c23e76319801"), u("photo-1564760290292-23341e4df6ec"), u("photo-1474511320723-9a56873867b5"), u("photo-1580060839134-75a5edca2e99")],
  ],

  suite: [
    // 0
    [u("photo-1591088398332-8a7791972843"), u("photo-1571003123894-1f0594d2b5d9"), u("photo-1590073242678-70ee3fc28e8e"), u("photo-1563911302283-d2bc129e7570")],
    // 1
    [u("photo-1615460549969-36fa19521a4f"), u("photo-1584132967334-10e028bd69f7"), u("photo-1582719478250-c89cae4dc85b"), u("photo-1551882547-ff40c63fe5fa")],
    // 2
    [u("photo-1613977257592-4871e5fcd7c4"), u("photo-1596178065887-1198b6148b2b"), u("photo-1568495248636-6432b97bd949"), u("photo-1556742049-0cfed4f6a45d")],
    // 3
    [u("photo-1566073771259-6a8506099945"), u("photo-1551918120-9739cb430c6d"), u("photo-1559508551-44bff1de756b"), u("photo-1544161515-4ab6ce6db874")],
    // 4
    [u("photo-1582719478250-c89cae4dc85b"), u("photo-1537996194471-e657df975ab4"), u("photo-1558618666-fcd25c85cd64"), u("photo-1507525428034-b723cf961d3e")],
    // 5
    [u("photo-1480796927426-f609979314bd"), u("photo-1526481280693-3bfa7568e0f3"), u("photo-1571003123894-1f0594d2b5d9"), u("photo-1590073242678-70ee3fc28e8e")],
    // 6
    [u("photo-1508009603885-50cf7c8dd0d5"), u("photo-1565967511849-76a60a516170"), u("photo-1525625293386-3f8f99389edd"), u("photo-1583417319070-4a69db38a482")],
    // 7
    [u("photo-1512453979798-5ea266f8880c"), u("photo-1518684079-3c830dcef090"), u("photo-1584132967334-10e028bd69f7"), u("photo-1591088398332-8a7791972843")],
    // 8
    [u("photo-1573843981267-be1999ff37cd"), u("photo-1563492065-d1e8a9739282"), u("photo-1553267751-1c148a7280a1"), u("photo-1539020140153-e479b8c22e70")],
    // 9
    [u("photo-1580060839134-75a5edca2e99"), u("photo-1611288875785-5fcfa2cf5aa9"), u("photo-1516426122078-c23e76319801"), u("photo-1564760290292-23341e4df6ec")],
  ],
};

// ─── FETCH ALL ROOMS ORDERED BY HOTEL ────────────────────────────────────────
const { rows } = await client.query(`
  SELECT r.id, r.type, h.id AS hotel_id
  FROM rooms r
  JOIN hotels h ON r.hotel_id = h.id
  ORDER BY h.id, r.id
`);

// Build hotel index (0-based position among sorted hotel IDs)
const hotelOrder = [...new Set(rows.map((r) => r.hotel_id))];

let updated = 0;
for (const row of rows) {
  const hotelIdx = hotelOrder.indexOf(row.hotel_id);
  const setIdx = hotelIdx % 10;
  const images = SETS[row.type][setIdx];

  await client.query(`UPDATE rooms SET images = $1 WHERE id = $2`, [images, row.id]);
  updated++;
}

await client.end();
console.log(`✅ Done! Updated ${updated} rooms with 4 images each.`);
