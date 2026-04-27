export default function HomePage() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0f172a",
      color: "white",
      padding: "40px",
      textAlign: "center"
    }}>
      <div>
        <h1 style={{ fontSize: "48px", marginBottom: "16px" }}>
          Keypillar Hub is live
        </h1>
        <p style={{ fontSize: "20px", opacity: 0.85 }}>
          Localhost 3000 is working through Cloudflare Tunnel.
        </p>
      </div>
    </main>
  );
}
