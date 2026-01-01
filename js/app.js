// === DES ARTS WEBGIS APPLICATION ===
// Phase 1 Location Assessment - Interactive Map
// Using Leaflet with OpenStreetMap tiles

// Global variables
let map;
let appData = null;
let layers = {
    routes: null,
    competitors: null,
    landmarks: null,
    distance: null
};

// Color configurations
const routeStyles = {
    primary_pedestrian: { color: "#ef4444", weight: 5, opacity: 0.9 },
    secondary_route: { color: "#f97316", weight: 4, opacity: 0.85 },
    tertiary_offtrack: { color: "#6b7280", weight: 3, opacity: 0.7 },
    walls_path: { color: "#8b5cf6", weight: 4, opacity: 0.85 }
};

const trackColors = {
    primary_spine: "#ef4444",
    secondary: "#f97316",
    off_track: "#6b7280"
};

const landmarkColors = {
    primary_attraction: "#fbbf24",
    secondary_attraction: "#fb923c",
    tertiary_attraction: "#fdba74",
    entry_point: "#22c55e"
};

const categoryColors = {
    wine_bar: "#8b5cf6",
    wine_cocktail_bar: "#a855f7",
    enoteca: "#f59e0b",
    cocktail_bar: "#10b981"
};

// === INITIALIZE APPLICATION ===
async function initApp() {
    try {
        const response = await fetch('data/des_arts_data.json');
        appData = await response.json();
        initMap();
        initLayerControls();
        initCompetitorChart();
        updateAnalytics();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// === INITIALIZE MAP ===
function initMap() {
    // Create map centered on Des Arts
    map = L.map('map', {
        center: [appData.mapCenter[1], appData.mapCenter[0]], // Leaflet uses [lat, lng]
        zoom: appData.mapZoom,
        zoomControl: true
    });

    // Add dark tile layer (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Add layers
    addPedestrianRoutes();
    addDistanceBands();
    addLandmarks();
    addCompetitors();
    addDesArtsMarker();

    // Initially hide distance bands
    map.removeLayer(layers.distance);
}

// === ADD PEDESTRIAN ROUTES ===
function addPedestrianRoutes() {
    const routeFeatures = appData.pedestrianRoutes.map(route => {
        // Convert [lng, lat] to [lat, lng] for Leaflet
        const latLngs = route.coordinates.map(coord => [coord[1], coord[0]]);
        const style = routeStyles[route.type] || routeStyles.secondary_route;
        
        const polyline = L.polyline(latLngs, {
            color: style.color,
            weight: style.weight,
            opacity: style.opacity,
            lineCap: 'round',
            lineJoin: 'round'
        });

        // Add popup
        const typeLabel = route.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        polyline.bindPopup(`
            <div class="popup-content">
                <h3>${route.name}</h3>
                <p><strong>Classification:</strong> ${typeLabel}</p>
                <p><strong>Footfall Index:</strong> ${route.footfall}</p>
                ${route.description ? `<p class="description">${route.description}</p>` : ''}
            </div>
        `);

        // Add tooltip with route name
        polyline.bindTooltip(route.name, {
            permanent: false,
            direction: 'center',
            className: 'route-tooltip'
        });

        return polyline;
    });

    layers.routes = L.layerGroup(routeFeatures).addTo(map);
}

// === ADD DISTANCE BANDS ===
function addDistanceBands() {
    const center = [appData.desArts.coordinates[1], appData.desArts.coordinates[0]];
    const bands = [
        { radius: 500, color: "#eab308", fillOpacity: 0.05, label: "500m" },
        { radius: 300, color: "#f97316", fillOpacity: 0.08, label: "300m" },
        { radius: 150, color: "#ef4444", fillOpacity: 0.1, label: "150m" }
    ];

    const circles = bands.map(band => {
        return L.circle(center, {
            radius: band.radius,
            color: band.color,
            weight: 1,
            opacity: 0.5,
            fillColor: band.color,
            fillOpacity: band.fillOpacity,
            dashArray: '5, 5'
        }).bindTooltip(band.label, { permanent: false, direction: 'right' });
    });

    layers.distance = L.layerGroup(circles);
}

// === ADD LANDMARKS ===
function addLandmarks() {
    const landmarkMarkers = appData.landmarks.map(landmark => {
        const latLng = [landmark.coordinates[1], landmark.coordinates[0]];
        const color = landmarkColors[landmark.category] || "#94a3b8";
        const size = landmark.category === 'primary_attraction' ? 12 : 
                     landmark.category === 'entry_point' ? 11 : 9;

        const marker = L.circleMarker(latLng, {
            radius: size,
            fillColor: color,
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9
        });

        const categoryLabel = landmark.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        marker.bindPopup(`
            <div class="popup-content">
                <h3>${landmark.name}</h3>
                <p><strong>Type:</strong> ${landmark.type}</p>
                <p><strong>Category:</strong> ${categoryLabel}</p>
                <p><strong>Footfall Index:</strong> ${landmark.footfall}</p>
                ${landmark.description ? `<p class="description">${landmark.description}</p>` : ''}
            </div>
        `);

        marker.bindTooltip(landmark.name, {
            permanent: false,
            direction: 'top',
            offset: [0, -10]
        });

        return marker;
    });

    layers.landmarks = L.layerGroup(landmarkMarkers).addTo(map);
}

// === ADD COMPETITORS ===
function addCompetitors() {
    const competitorMarkers = appData.competitors.map(comp => {
        const latLng = [comp.coordinates[1], comp.coordinates[0]];
        const fillColor = categoryColors[comp.type] || "#6b7280";
        const strokeColor = trackColors[comp.trackPosition] || "#6b7280";
        const strokeWidth = comp.trackPosition === 'primary_spine' ? 3 : 
                           comp.trackPosition === 'secondary' ? 2 : 1;

        const marker = L.circleMarker(latLng, {
            radius: 8,
            fillColor: fillColor,
            color: strokeColor,
            weight: strokeWidth,
            opacity: 1,
            fillOpacity: 0.9
        });

        const trackClass = comp.trackPosition === 'primary_spine' ? 'on-track' : 
                          comp.trackPosition === 'secondary' ? 'near-track' : 'off-track';
        const trackLabel = comp.trackPosition.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const typeLabel = comp.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        marker.bindPopup(`
            <div class="popup-content competitor-popup">
                <h3>${comp.name}</h3>
                <p><strong>Address:</strong> ${comp.address}</p>
                <p><strong>Type:</strong> ${typeLabel}</p>
                <p><strong>Track Position:</strong> <span class="${trackClass}">${trackLabel}</span></p>
                <p><strong>Footfall Index:</strong> ${comp.footfall}</p>
            </div>
        `);

        marker.bindTooltip(comp.name, {
            permanent: false,
            direction: 'top',
            offset: [0, -10]
        });

        return marker;
    });

    layers.competitors = L.layerGroup(competitorMarkers).addTo(map);
}

// === ADD DES ARTS MARKER ===
function addDesArtsMarker() {
    const latLng = [appData.desArts.coordinates[1], appData.desArts.coordinates[0]];
    
    // Create custom icon with HTML
    const desArtsIcon = L.divIcon({
        className: 'des-arts-marker',
        html: `
            <div class="marker-pulse"></div>
            <div class="marker-icon">
                <span>🍷</span>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    const marker = L.marker(latLng, { icon: desArtsIcon, zIndexOffset: 1000 });
    
    marker.bindPopup(`
        <div class="popup-content des-arts-popup">
            <h3>${appData.desArts.name}</h3>
            <p><strong>Address:</strong> ${appData.desArts.address}</p>
            <p><strong>Position:</strong> <span class="off-track">Secondary Track</span></p>
            <p><strong>Footfall Index:</strong> ${appData.desArts.footfall}</p>
            <p class="description">Located off the primary pedestrian spine, within 2-3 min walk of main tourist nodes.</p>
            <div class="popup-footer">Subject Property</div>
        </div>
    `);

    marker.addTo(map);
}

// === LAYER CONTROLS ===
function initLayerControls() {
    document.querySelectorAll('.layer-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const layerName = btn.dataset.layer;
            btn.classList.toggle('active');
            
            const layer = layers[layerName];
            if (!layer) return;

            if (btn.classList.contains('active')) {
                map.addLayer(layer);
            } else {
                map.removeLayer(layer);
            }
        });
    });
}

// === COMPETITOR CHART ===
function initCompetitorChart() {
    const ctx = document.getElementById('competitorChart');
    if (!ctx) return;

    // Sort by footfall descending
    const sortedCompetitors = [...appData.competitors].sort((a, b) => b.footfall - a.footfall);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedCompetitors.map(c => c.name.length > 12 ? c.name.substring(0, 12) + '...' : c.name),
            datasets: [{
                label: 'Footfall Index',
                data: sortedCompetitors.map(c => c.footfall),
                backgroundColor: sortedCompetitors.map(c => {
                    if (c.trackPosition === 'primary_spine') return 'rgba(239, 68, 68, 0.7)';
                    if (c.trackPosition === 'secondary') return 'rgba(249, 115, 22, 0.7)';
                    return 'rgba(107, 114, 128, 0.7)';
                }),
                borderColor: sortedCompetitors.map(c => {
                    if (c.trackPosition === 'primary_spine') return '#ef4444';
                    if (c.trackPosition === 'secondary') return '#f97316';
                    return '#6b7280';
                }),
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const comp = sortedCompetitors[context.dataIndex];
                            return `Footfall: ${comp.footfall} (${comp.trackPosition.replace(/_/g, ' ')})`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    ticks: { color: '#94a3b8' }
                },
                y: {
                    grid: { display: false },
                    ticks: { color: '#e2e8f0', font: { size: 10 } }
                }
            }
        }
    });
}

// === UPDATE ANALYTICS ===
function updateAnalytics() {
    const competitors = appData.competitors;
    const primarySpine = competitors.filter(c => c.trackPosition === 'primary_spine');
    
    // Calculate averages
    const avgFootfall = Math.round(competitors.reduce((sum, c) => sum + c.footfall, 0) / competitors.length);
    const primaryAvg = primarySpine.length > 0 
        ? Math.round(primarySpine.reduce((sum, c) => sum + c.footfall, 0) / primarySpine.length)
        : 0;

    // Update DOM
    const el = (id, val) => {
        const elem = document.getElementById(id);
        if (elem) elem.textContent = val;
    };
    
    el('des-arts-footfall', appData.desArts.footfall);
    el('avg-competitor-footfall', avgFootfall);
    el('primary-spine-count', primarySpine.length);
    el('primary-avg-footfall', primaryAvg);
}

// === INITIALIZE ===
document.addEventListener('DOMContentLoaded', initApp);
