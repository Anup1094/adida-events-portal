import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Gallery from "./models/Gallery.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "uploads");

// Same fallback logic as server/config/db.js — corporate networks may block
// the mongodb+srv:// SRV lookup, so fall back to a direct connection string.
const buildDirectUri = (uri) => {
  const m = uri.match(/^mongodb\+srv:\/\/([^@]+)@([^/]+)\/?\??(.*)$/);
  if (!m) return null;
  const creds = m[1];
  const host = m[2];
  const query = m[3] ? `&${m[3]}` : "";
  const suffix = host.split(".").slice(1).join(".");
  const shards = [
    `ac-ulj5mds-shard-00-00.${suffix}`,
    `ac-ulj5mds-shard-00-01.${suffix}`,
    `ac-ulj5mds-shard-00-02.${suffix}`,
  ].join(",");
  return `mongodb://${creds}@${shards}/?replicaSet=atlas-catqp5-shard-0&authSource=admin&tls=true&tlsAllowInvalidCertificates=true${query}`;
};

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    if (error.message && error.message.includes("querySrv")) {
      const direct = buildDirectUri(process.env.MONGO_URI);
      if (direct) {
        await mongoose.connect(direct);
        console.log("✅ Connected to MongoDB (direct connection)");
        return;
      }
    }
    throw error;
  }
};

// Service images available in the client assets that we can reuse
// for the gallery. Map each source file to a title + category.
const seedImages = [
  {
    src: path.join(__dirname, "..", "client", "src", "assets", "services", "wedding.jpg"),
    title: "Royal Wedding",
    category: "Weddings",
  },
  {
    src: path.join(__dirname, "..", "client", "src", "assets", "services", "birthday.jpg"),
    title: "Birthday Bash",
    category: "Birthdays",
  },
  {
    src: path.join(__dirname, "..", "client", "src", "assets", "services", "corporate.jpg"),
    title: "Corporate Gala",
    category: "Corporate",
  },
  {
    src: path.join(__dirname, "..", "client", "src", "assets", "services", "engagement.jpg"),
    title: "Engagement Soirée",
    category: "Engagements",
  },
  {
    src: path.join(__dirname, "..", "client", "src", "assets", "services", "anniversary.jpg"),
    title: "Anniversary Celebration",
    category: "Anniversaries",
  },
  {
    src: path.join(__dirname, "..", "client", "src", "assets", "services", "babyshower.jpg"),
    title: "Baby Shower",
    category: "Baby Showers",
  },
];

const seedGallery = async () => {
  try {
    await connect();

    let added = 0;

    for (const item of seedImages) {
      if (!fs.existsSync(item.src)) {
        console.log(`⚠️  Skipping missing source: ${item.src}`);
        continue;
      }

      // Copy the service image into the uploads folder with a unique name
      const ext = path.extname(item.src);
      const filename = `gallery-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      const dest = path.join(uploadsDir, filename);
      fs.copyFileSync(item.src, dest);

      const imageUrl = `/uploads/${filename}`;

      // Check if an image with this title already exists to avoid duplicates
      const existing = await Gallery.findOne({ title: item.title });
      if (existing) {
        console.log(`⏭️  "${item.title}" already exists, skipping.`);
        continue;
      }

      await Gallery.create({
        title: item.title,
        category: item.category,
        description: "",
        isFeatured: false,
        image: imageUrl,
      });

      added++;
      console.log(`✅ Added "${item.title}" → ${imageUrl}`);
    }

    const total = await Gallery.countDocuments();
    console.log(`\n🎉 Done! Added ${added} new image(s). Total gallery images: ${total}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

seedGallery();
