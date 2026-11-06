import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "مكي و باشميل — Law Firm & Legal Consultancy",
    short_name: "مكي و باشميل",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f2",
    theme_color: "#0e1015",
    icons: [{ src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" }],
  };
}
