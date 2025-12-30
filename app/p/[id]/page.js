import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getPaste } from "@/lib/pastes";
import Link from "next/link";
import AutoReload from "./AutoReload";

export default async function ViewPaste({ params }) {
  const headersList = await headers(); // Headers should be awaited in Next 15 too usually, but let's check params first.
  const { id } = await params; // Await params for Next.js 15 compatibility

  let data = null;
  try {
    data = await getPaste(id, headersList);
  } catch (error) {
    console.error("Error fetching paste:", error);
    // If Redis fails, we might want to show an error or 404. 
    // Requirement says "Unavailable cases must return HTTP 404".
    // But if DB is down, 500 might be better?
    // Let's throw to trigger error.js for strict DB failures, 
    // or just 404 if we consider "unavailable" broad.
    // However, if we want to be "robust", maybe just 404 safe?
    // But distinguishing "not found" vs "crashed" is good.
    // Let's rely on global error.js for crashes.
    throw error;
  }

  if (!data) {
    notFound();
  }

  // Calculate stats for display
  const viewsLeft = data.max_views
    ? Math.max(0, data.max_views - data.current_views)
    : "Unlimited";

  const expiresAt = data.expires_at
    ? new Date(data.expires_at).toLocaleString()
    : "Never";

  return (
    <div>
      <AutoReload expiresAt={data.expires_at} />
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/" style={{ fontSize: "0.9rem", color: "var(--primary)" }}>
          &larr; Create New Paste
        </Link>
      </div>

      <div className="card">
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          borderBottom: "1px solid var(--gray-200)",
          paddingBottom: "1rem"
        }}>
          <h1 style={{ margin: 0, fontSize: "1.5rem" }}>Paste {id}</h1>
          <div style={{ fontSize: "0.85rem", color: "#666", textAlign: "right" }}>
            <div>Expires: <strong>{expiresAt}</strong></div>
            <div>Remaining Views: <strong>{viewsLeft}</strong></div>
          </div>
        </div>

        <pre className="pre">
          {data.content}
        </pre>
      </div>
    </div>
  );
}
