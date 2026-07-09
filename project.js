// Automatically inject Leaflet CSS into the Looker Head element
const leafletCSS = document.createElement('link');
leafletCSS.rel = 'stylesheet';
leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
document.head.appendChild(leafletCSS);

// Automatically inject Leaflet JS library script
const leafletJS = document.createElement('script');
leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
document.head.appendChild(leafletJS);

leafletJS.onload = function() {
    // Inject custom styling for tooltips directly into the document
    const style = document.createElement('style');
    style.innerHTML = `
        #map { position: absolute; top: 0; left: 0; right: 0; bottom: 0; height: 100% !important; width: 100% !important; }
        .custom-tooltip { background: rgba(15, 23, 42, 0.95) !important; color: #f8fafc !important; border: 1px solid rgba(56, 189, 248, 0.4) !important; border-radius: 8px !important; padding: 12px 16px !important; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5) !important; font-size: 12px; line-height: 1.5; }
        .custom-tooltip::before { border-right-color: rgba(15, 23, 42, 0.95) !important; }
        .tooltip-title { font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; font-size: 13px; }
        .tooltip-meta { font-size: 10px; color: #94a3b8; font-style: italic; margin-bottom: 6px; }
    `;
    document.head.appendChild(style);

    // Initialize map registration with Looker Studio
    looker.plugins.visualizations.add({
        create: function(element, config) {
            // Setup Map Element Container
            element.innerHTML = "<div id='map'></div>";

            const mapCenter = [12.9920, 80.1680];
            this._map = L.map('map').setView(mapCenter, 14); 

            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Imagery &copy; Esri'
            }).addTo(this._map);

            // 1. CHENNAI AIRPORT POLYGON
            const airportBoundaryCoords = [
                [13.0065, 80.1548], [13.0070, 80.1598], [13.0068, 80.1652], [13.0062, 80.1715],
                [13.0056, 80.1770], [13.0048, 80.1816], [13.0038, 80.1845], [13.0015, 80.1858],
                [12.9990, 80.1860], [12.9962, 80.1854], [12.9935, 80.1842], [12.9908, 80.1827],
                [12.9882, 80.1812], [12.9855, 80.1782], [12.9830, 80.1735], [12.9818, 80.1680],
                [12.9818, 80.1622], [12.9822, 80.1570], [12.9836, 80.1535], [12.9858, 80.1516],
                [12.9890, 80.1504], [12.9930, 80.1508], [12.9970, 80.1518], [13.0010, 80.1528],
                [13.0042, 80.1539], [13.0065, 80.1548]
            ];

            const airportHighlightZone = L.polygon(airportBoundaryCoords, {
                color: '#0ea5e9', weight: 3, opacity: 0.9, fillColor: '#0ea5e9', fillOpacity: 0.15
            }).addTo(this._map);

            airportHighlightZone.bindPopup("<strong style='color:#0ea5e9;'>CHENNAI INTERNATIONAL AIRPORT (MAA)</strong>");

            // 2. INTERACTIVE ASSETS
            const infrastructureAssets = [
                { name: "Chennai Intl Airport - T2", type: "Terminal Infrastructure", desc: "Primary terminal hub.", coords: [12.9822, 80.1636] },
                { name: "Airport Metro Station", type: "Mass Transit Corridor", desc: "Elevated direct metro alignment.", coords: [12.980806, 80.164197] },
                { name: "Terminal 1 (Kamaraj Domestic Terminal)", type: "Terminal Infrastructure", desc: "Domestic arrivals/departures gateway.", coords: [12.9832, 80.1666] }
            ];

            infrastructureAssets.forEach(asset => {
                const nodeMarker = L.circleMarker(asset.coords, {
                    radius: 8, fillColor: "#38bdf8", color: "#ffffff", weight: 2, fillOpacity: 0.9, interactive: true
                }).addTo(this._map);

                nodeMarker.bindTooltip(`<div class="tooltip-title">${asset.name}</div><div class="tooltip-meta">${asset.type}</div><div>${asset.desc}</div>`, {
                    className: 'custom-tooltip', direction: 'right', sticky: true, opacity: 0.98
                });
            });
        },
        updateAsync: function(data, element, config, queryResponse, details, done) {
            if (this._map) { this._map.invalidateSize(); }
            done();
        }
    });
};
