import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Helmet } from "react-helmet";

createRoot(document.getElementById("root")!).render(
  <>
    <Helmet>
      <title>MediFind - Find Medical Specialists & Hospitals</title>
      <meta name="description" content="Find the right medical specialists and hospitals for your healthcare needs. Search by specialty, location, and more." />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
      <meta property="og:title" content="MediFind - Medical Specialist & Hospital Finder" />
      <meta property="og:description" content="Find the right medical specialists and hospitals for your healthcare needs." />
      <meta property="og:type" content="website" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    </Helmet>
    <App />
  </>
);
