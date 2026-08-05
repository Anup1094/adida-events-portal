import mongoose from "mongoose";

/**
 * Some corporate networks block the DNS SRV/TXT lookups used by the
 * `mongodb+srv://` URI scheme, causing "querySrv ECONNREFUSED" — even though
 * the same lookups work via the system nslookup tool and direct TCP
 * connections to the Atlas shards succeed.
 *
 * As a fallback, this builds a direct "mongodb://" connection string using the
 * known Atlas shard hostnames and replica set, bypassing the driver's SRV
 * lookup entirely.
 */
const buildDirectUri = (uri) => {
  const m = uri.match(/^mongodb\+srv:\/\/([^@]+)@([^/]+)\/?\??(.*)$/);
  if (!m) return null;
  const creds = m[1];
  const host = m[2]; // e.g. cluster0.abcde.mongodb.net
  const query = m[3] ? `&${m[3]}` : "";

  // Atlas shard hostnames discovered via nslookup for this cluster.
  // The shard suffix is the host without the "clusterN." prefix.
  const suffix = host.split(".").slice(1).join("."); // e.g. abcde.mongodb.net
  const shards = [
    `ac-ulj5mds-shard-00-00.${suffix}`,
    `ac-ulj5mds-shard-00-01.${suffix}`,
    `ac-ulj5mds-shard-00-02.${suffix}`,
  ].join(",");

  return `mongodb://${creds}@${shards}/?replicaSet=atlas-catqp5-shard-0&authSource=admin&tls=true&tlsAllowInvalidCertificates=true${query}`;
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    // Fallback: retry with a direct connection if the SRV lookup failed.
    if (error.message && error.message.includes("querySrv")) {
      console.log("⚠️  SRV lookup failed, retrying with direct connection...");
      try {
        const direct = buildDirectUri(process.env.MONGO_URI);
        if (direct) {
          await mongoose.connect(direct);
          console.log("✅ MongoDB Connected Successfully! (direct connection)");
          return;
        }
      } catch (directError) {
        console.error("❌ MongoDB Error (direct):", directError.message);
        process.exit(1);
      }
    }
    console.error("❌ MongoDB Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
