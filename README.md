# Des Arts Wine Bar - WebGIS Location Assessment

Interactive WebGIS application for Phase 1 Location & Demand Assessment of Des Arts Wine Bar in Lucca, Italy.

![Project Status](https://img.shields.io/badge/status-Phase%201%20Complete-green)
![License](https://img.shields.io/badge/license-Private-red)

## 📍 Project Overview

This repository contains an interactive web-based GIS application that visualizes spatial analysis, competitive intelligence, and tourism data for the Des Arts Wine Bar acquisition assessment.

**Property:** Des Arts Wine Bar (Bistrot e Winebar Des Arts)  
**Location:** Piazza San Giusto 9, 55100 Lucca, Italy  
**Classification:** SECONDARY-TRACK / NEAR-SPINE

## 🗺️ Features

### Interactive Map Layers
- **Walking Isochrones** - 3/5/8 minute walking catchments
- **Competitor Markers** - Wine bars, enoteche, cocktail bars with ratings
- **Landmarks & Attractions** - Tourist nodes and points of interest
- **Pedestrian Spine** - Primary and secondary foot traffic corridors
- **Distance Bands** - 150m, 300m, 600m radius from property

### Analytics Dashboard
- Property details and financials
- Online ratings comparison (Google, TripAdvisor, TheFork)
- Walking distance matrix to key destinations
- Competitor score comparison chart
- Lucca tourism statistics (2024)
- Risk assessment visualization

## 📁 Repository Structure

```
des-arts-webgis/
├── index.html              # Main application
├── css/
│   └── style.css           # Styling
├── js/
│   └── app.js              # Application logic & map
├── data/
│   └── des_arts_data.json  # GeoJSON and project data
├── img/                    # Images and assets
└── README.md               # This file
```

## 🚀 Quick Start

### Option 1: Local Server
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Then open http://localhost:8000
```

### Option 2: GitHub Pages
1. Push to GitHub
2. Enable GitHub Pages in repository settings
3. Access at `https://[username].github.io/des-arts-webgis/`

### Option 3: Direct File
Open `index.html` in a modern browser (some features may require a server).

## 🔑 Mapbox Configuration

The application uses Mapbox GL JS. To use with your own token:

1. Get a token at [mapbox.com](https://www.mapbox.com/)
2. Replace the token in `js/app.js`:
```javascript
mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN';
```

## 📊 Data Sources

| Source | Data Type |
|--------|-----------|
| Mapbox | Geocoding, routing, isochrones |
| ISTAT | Tourism statistics |
| Google Maps | Business ratings, reviews |
| TripAdvisor | Restaurant ratings |
| TheFork | Reservation platform data |
| OSM | Base map data |

## 📈 Key Findings

### Location Assessment
- **Track Position:** Off primary pedestrian spine (~150m from Via Fillungo)
- **Walking Time:** 1.4 min to Piazza San Michele, 2.8 min to Duomo
- **Demand Model:** HYBRID (walk-in + destination intent)

### Competition (0-300m radius)
- 6 direct competitors within walking distance
- Mix of enoteche, wine bars, cocktail bars
- High substitution risk in tourist core

### Tourism Context (Lucca 2024)
- 385,595 arrivals (+9.3% YoY)
- 1,026,570 overnight stays (+9.0% YoY)
- 70% concentrated in May-September (seasonality risk)

## ⚠️ Limitations

- **No street-level footfall data** - Pedestrian indicators are spatial proxies
- Isochrones are approximations based on walking profile
- Competitor ratings snapshot (may change)
- Desktop assessment only (no site visit)

## 📋 Phase 2 Recommendations

1. Verify terrace permit terms and conditions
2. Obtain monthly P&L by season and service period
3. Conduct on-site pedestrian observations
4. Review staffing and operational dependencies
5. Analyze wine list economics and margins

## 👤 Author

**Avner Gomes**  
Data Scientist  
December 2025

## 📄 License

This project is proprietary and confidential. All rights reserved.

---

*Part of Des Arts Wine Bar Investment Due Diligence - Phase 1*
