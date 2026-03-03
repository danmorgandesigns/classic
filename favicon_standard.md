# Bullet-Proof Favicon Standard

This document outlines the standard, consistent "bullet-proof" approach for implementing favicons across all your website projects. This approach ensures perfect compatibility with Safari (Mac/iOS), Chrome, Firefox, Edge, Android, and bookmarks.

## 1. Asset Generation & Placement

All favicon assets must be placed in the **ROOT** directory of the website (e.g., `favicon.ico`), NOT inside a nested folder like `images/`. This is critical because Safari and many automated scrapers will look exclusively in the root directory by default.

Starting from a high-resolution master square logo (e.g., `app-icon.png`), generate the following three files:

1.  **`favicon.ico`** (Required)
    *   Format: A true `.ico` file containing at least a 32x32 image.
    *   **Placement:** Root folder
    *   **Why:** Safari's ultimate fallback and required for legacy browsers.
2.  **`icon.png`** (Required)
    *   Format: A 512x512 or 192x192 PNG file.
    *   **Placement:** Root folder
    *   **Why:** The high-quality standard tab icon for modern Chrome, Firefox, and Edge.
3.  **`apple-touch-icon.png`** (Required)
    *   Format: A 180x180 PNG file.
    *   **Placement:** Root folder
    *   **Why:** Extremely important for the Apple ecosystem. Safari uses this for iOS Home Screen saves, macOS Safari bookmarks, and macOS pinned tabs.

## 2. HTML Implementation

Include this exact snippet inside the `<head>` of **every** `.html` page on the website.

```html
<link rel="icon" href="favicon.ico" sizes="32x32">
<link rel="icon" href="icon.png" type="image/png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
```

*Note: The `href` values do not start with a slash or directory, meaning they point to the same directory as the HTML file (the root).*
