import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container" style={{ textAlign: "center", paddingTop: "4rem" }}>
      <h1 className="title">404 - Not Found</h1>
      <p style={{ marginBottom: "2rem", fontSize: "1.2rem" }}>
        The paste you are looking for does not exist, has expired, or the view limit has been reached.
      </p>
      <Link href="/" className="button" style={{ display: "inline-block", width: "auto" }}>
        Go Home
      </Link>
    </div>
  );
}
