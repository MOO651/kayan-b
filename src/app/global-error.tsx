"use client";

/**
 * Custom global error boundary. Next.js prerenders /_global-error at build
 * time; providing this file replaces the built-in one that crashed the
 * build with "Cannot read properties of null (reading 'useContext')" on
 * some environments. Must render its own <html>/<body>.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0e1015",
          color: "#f5f1e7",
          fontFamily: "system-ui, Tahoma, sans-serif",
          margin: 0,
        }}
      >
        <main style={{ textAlign: "center", padding: "2rem" }}>
          <p
            style={{
              color: "#b08d57",
              fontSize: "0.875rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            حدث خطأ
          </p>
          <h1 style={{ fontSize: "1.75rem", margin: "0.5rem 0 1rem" }}>
            عذراً، حدث خطأ غير متوقع
          </h1>
          <p style={{ color: "#9aa0ab", marginBottom: "1.5rem" }}>
            {error.digest
              ? `رمز الخطأ: ${error.digest}`
              : "برجاء المحاولة مرة أخرى."}
          </p>
          <button
            onClick={reset}
            style={{
              background: "#b08d57",
              color: "#0e1015",
              border: "none",
              padding: "0.75rem 2rem",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            إعادة المحاولة
          </button>
        </main>
      </body>
    </html>
  );
}
