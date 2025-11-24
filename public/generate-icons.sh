#!/bin/bash

# Create a simple blue SVG icon
cat > /tmp/icon.svg << 'SVGEOF'
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#2563eb"/>
  <circle cx="256" cy="256" r="100" fill="white" opacity="0.8"/>
  <text x="256" y="280" font-size="120" font-weight="bold" text-anchor="middle" fill="#2563eb" font-family="Arial">R</text>
</svg>
SVGEOF

# Create 192x192 icon using ImageMagick (if available) or just use placeholder
if command -v convert &> /dev/null; then
  convert /tmp/icon.svg -resize 192x192 /Users/vincentdesbrosses/Documents/Projects/Test-wt/public/icon-192.png
  convert /tmp/icon.svg -resize 512x512 /Users/vincentdesbrosses/Documents/Projects/Test-wt/public/icon-512.png
  convert /tmp/icon.svg -resize 192x192 /Users/vincentdesbrosses/Documents/Projects/Test-wt/public/icon-maskable-192.png
  convert /tmp/icon.svg -resize 512x512 /Users/vincentdesbrosses/Documents/Projects/Test-wt/public/icon-maskable-512.png
else
  # Create minimal 1x1 PNG placeholder (will be replaced later)
  echo "ImageMagick not found. Creating placeholder PNG files..."
fi
