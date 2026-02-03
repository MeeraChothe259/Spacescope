
import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar
} from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
    CloudRain,
    Thermometer,
    AlertTriangle,
    Sprout,
    Satellite,
    Map as MapIcon,
    Info,
    Droplets,
    Wind,
    Sun
} from 'lucide-react';
import './ClimateAgriculture.css';

// --- DATA CONSTANTS ---

const MOCK_REGIONS = [
    {
        id: 'punjab-in',
        name: 'Punjab, India',
        lat: 30.900965,
        lng: 75.857275,
        stress: 'high',
        risk: 'Groundwater Depletion',
        crops: ['Wheat', 'Rice', 'Sugarcane'],
        details: { soilType: 'Alluvial', avgRainfall: '650mm', growingSeason: 'Year-round' }
    },
    {
        id: 'california-us',
        name: 'California (Central Valley), USA',
        lat: 36.7783,
        lng: -119.4179,
        stress: 'high',
        risk: 'Drought & Water Scarcity',
        crops: ['Almonds', 'Grapes', 'Tomatoes'],
        details: { soilType: 'Loam', avgRainfall: '250mm', growingSeason: 'Feb - Nov' }
    },
    {
        id: 'mato-grosso-br',
        name: 'Mato Grosso, Brazil',
        lat: -12.6819,
        lng: -56.9211,
        stress: 'low',
        risk: 'Deforestation Heat Stress',
        crops: ['Soybean', 'Corn', 'Cotton'],
        details: { soilType: 'Ferralsol', avgRainfall: '1800mm', growingSeason: 'Oct - May' }
    },
    {
        id: 'nile-eg',
        name: 'Nile Delta, Egypt',
        lat: 30.5852,
        lng: 31.5035,
        stress: 'medium',
        risk: 'Salinity Intrusion',
        crops: ['Cotton', 'Rice', 'Citrus'],
        details: { soilType: 'Heavy Clay', avgRainfall: '150mm', growingSeason: 'Year-round' }
    },
    {
        id: 'pampas-ar',
        name: 'Pampas, Argentina',
        lat: -34.6037,
        lng: -58.3816,
        stress: 'medium',
        risk: 'Flood & Soil Erg',
        crops: ['Soybean', 'Maize', 'Wheat'],
        details: { soilType: 'Mollisol', avgRainfall: '1000mm', growingSeason: 'Sep - Apr' }
    },
    {
        id: 'murray-au',
        name: 'Murray-Darling Basin, AU',
        lat: -34.0000,
        lng: 141.0000,
        stress: 'high',
        risk: 'Severe Drought',
        crops: ['Wheat', 'Barley', 'Grapes'],
        details: { soilType: 'Vertisol', avgRainfall: '480mm', growingSeason: 'Apr - Nov' }
    },
    {
        id: 'ukraine-steppe',
        name: 'Steppe Zone, Ukraine',
        lat: 48.3794,
        lng: 31.1656,
        stress: 'medium',
        risk: 'Dry Spell Volatility',
        crops: ['Sunflower', 'Wheat', 'Corn'],
        details: { soilType: 'Chernozen (Black Soil)', avgRainfall: '550mm', growingSeason: 'Apr - Oct' }
    },
    {
        id: 'jiangsu-cn',
        name: 'Jiangsu, China',
        lat: 32.0617,
        lng: 118.7632,
        stress: 'low',
        risk: 'Urban Encroachment',
        crops: ['Rice', 'Wheat', 'Rapeseed'],
        details: { soilType: 'Paddy Soil', avgRainfall: '1000mm', growingSeason: 'Year-round' }
    },
    {
        id: 'iowa-us',
        name: 'Iowa, USA',
        lat: 41.8780,
        lng: -93.0977,
        stress: 'low',
        risk: 'Storm Damage',
        crops: ['Corn', 'Soybeans'],
        details: { soilType: 'Glacial Till', avgRainfall: '860mm', growingSeason: 'May - Oct' }
    },
    {
        id: 'bordeaux-fr',
        name: 'Bordeaux, France',
        lat: 44.8378,
        lng: -0.5792,
        stress: 'medium',
        risk: 'Heatwave (Vines)',
        crops: ['Grapes (Wine)'],
        details: { soilType: 'Limestone/Gravel', avgRainfall: '900mm', growingSeason: 'Mar - Sep' }
    }
];

// Generate somewhat realistic looking weather trends based on latitude roughly
const generateWeatherData = (lat) => {
    const isNorth = lat > 0;
    const baseTemp = Math.abs(lat) > 40 ? 10 : 25;

    return Array.from({ length: 12 }, (_, i) => {
        const monthIndex = i; // 0=Jan
        // Simple seasonal curve
        let seasonFactor = Math.sin((monthIndex / 12) * Math.PI * 2 - (isNorth ? 1.5 : 4.5)); // Offset for hemisphere

        return {
            month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
            rain: Math.max(10, Math.floor(Math.random() * 100 + 20 * seasonFactor)),
            temp: Math.floor(baseTemp + 10 * seasonFactor + Math.random() * 2),
            moisture: Math.max(20, Math.min(90, 50 + 20 * seasonFactor + (Math.random() * 10 - 5)))
        };
    });
};

const StressGauge = ({ stress }) => {
    // Convert stress to a visual rotation percentage for a gauge
    // Low = Green, Medium = Yellow, High = Red
    // Let's pretend a gauge from 0 to 100.
    let val = 25;
    let color = "#4ade80";
    let text = "OPTIMAL";

    if (stress === 'medium') { val = 65; color = "#facc15"; text = "WARNING"; }
    if (stress === 'high') { val = 90; color = "#ef4444"; text = "CRITICAL"; }

    return (
        <div className="stress-gauge-container">
            <div className={`stress-circle stress-${stress}`}>
                {/* This would be an SVG in a real polished app, but CSS semi-circle works for now */}
                <div className="stress-fill" style={{
                    transform: `rotate(${val * 1.8 - 180}deg)`, // 180 degrees correspond to 100%
                    background: color
                }}></div>
            </div>
            <div className="stress-value-text">
                <span className="stress-number">{val}%</span>
                <span className="stress-status" style={{ color }}>{text}</span>
            </div>
        </div>
    );
};

const ClimateAgriculture = () => {
    const [selectedRegion, setSelectedRegion] = useState(MOCK_REGIONS[0]);
    const [weatherData, setWeatherData] = useState(generateWeatherData(MOCK_REGIONS[0].lat));

    useEffect(() => {
        // Update data when region changes (simulating API fetch)
        setWeatherData(generateWeatherData(selectedRegion.lat));
    }, [selectedRegion]);

    const handleRegionChange = (e) => {
        const region = MOCK_REGIONS.find(r => r.id === e.target.value);
        setSelectedRegion(region);
    };

    return (
        <div className="climate-dashboard">
            <header className="climate-header">
                <div>
                    <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '600', letterSpacing: '1px' }}>SPACESCOPE INTELLIGENCE</span>
                    <h1>Agri-Climate Monitor</h1>
                    <p style={{ color: '#94a3b8', maxWidth: '600px' }}>
                        Real-time satellite monitoring of global agricultural hotspots.
                        Analyze crop health, moisture levels, and climate risks using multi-spectral orbital data.
                    </p>
                </div>

                <div className="region-selector-container">
                    <label className="region-label">Select Target Zone</label>
                    <select
                        className="region-selector"
                        value={selectedRegion.id}
                        onChange={handleRegionChange}
                    >
                        {MOCK_REGIONS.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>
                </div>
            </header>

            <div className="dashboard-grid">

                {/* Soil Moisture Map Card */}
                <div className="dashboard-card map-card">
                    <div className="map-header">
                        <div className="card-title">
                            <MapIcon size={18} className="text-blue-400" />
                            <span>Satellite Moisture & Vegetation Map</span>
                        </div>
                    </div>

                    <div className="map-placeholder">
                        <MapContainer
                            center={[selectedRegion.lat, selectedRegion.lng]}
                            zoom={7}
                            style={{ height: '100%', width: '100%' }}
                            key={selectedRegion.id}
                            zoomControl={false}
                        >
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                attribution='&copy; CARTO'
                            />

                            {/* Main Region Market */}
                            <CircleMarker
                                center={[selectedRegion.lat, selectedRegion.lng]}
                                pathOptions={{
                                    color: selectedRegion.stress === 'high' ? '#ef4444' : selectedRegion.stress === 'medium' ? '#facc15' : '#4ade80',
                                    fillColor: selectedRegion.stress === 'high' ? '#ef4444' : selectedRegion.stress === 'medium' ? '#facc15' : '#4ade80',
                                    fillOpacity: 0.2,
                                    weight: 2
                                }}
                                radius={50}
                            >
                                <Popup className="custom-popup">
                                    <strong>{selectedRegion.name}</strong><br />
                                    Status: {selectedRegion.stress.toUpperCase()}
                                </Popup>
                            </CircleMarker>

                            {/* Simulated Field Polygons (Just decoration for "beauty") */}
                            <CircleMarker center={[selectedRegion.lat + 0.1, selectedRegion.lng + 0.1]} radius={10} pathOptions={{ color: 'white', opacity: 0.3, fillOpacity: 0.1 }} />
                            <CircleMarker center={[selectedRegion.lat - 0.15, selectedRegion.lng - 0.05]} radius={15} pathOptions={{ color: 'white', opacity: 0.3, fillOpacity: 0.1 }} />
                        </MapContainer>

                        <div className="map-overlay-detail">
                            <div className="detail-row">
                                <span className="detail-label">Surface Soil Moisture</span>
                                <span className="detail-val">
                                    {selectedRegion.stress === 'low' ? '0.35 m³/m³' : selectedRegion.stress === 'medium' ? '0.22 m³/m³' : '0.12 m³/m³'}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Vegetation Index (NDVI)</span>
                                <span className="detail-val">
                                    {selectedRegion.stress === 'low' ? '0.78 (Native)' : selectedRegion.stress === 'medium' ? '0.55 (Fair)' : '0.32 (Poor)'}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Precipitation (24h)</span>
                                <span className="detail-val">0.0 mm</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Crop Stress & Details */}
                <div className="dashboard-card stress-card">
                    <div className="card-title">
                        <Sprout size={18} className="text-green-400" />
                        <span>Crop Health Analytics</span>
                    </div>

                    <StressGauge stress={selectedRegion.stress} />

                    <div className="crop-tags">
                        {selectedRegion.crops.map(c => (
                            <span key={c} className="crop-tag">{c}</span>
                        ))}
                    </div>

                    <div style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
                        <div className="risk-item">
                            <span><AlertTriangle size={14} style={{ display: 'inline', marginRight: 5 }} /> Primary Concern</span>
                            <span style={{ color: '#fff', fontSize: '1rem', fontWeight: 500 }}>{selectedRegion.risk}</span>
                        </div>
                    </div>

                    <div className="micro-card">
                        <span className="micro-card-title"><Satellite size={14} /> SATELLITE INSIGHT</span>
                        <p>
                            Multi-spectral analysis indicates {selectedRegion.stress === 'high' ? 'severe moisture deficit in root zones.' : 'healthy chlorophyll levels in canopy.'}
                            Predicted yield impact: <span style={{ color: selectedRegion.stress === 'high' ? '#f87171' : '#4ade80' }}>{selectedRegion.stress === 'high' ? '-15%' : '+5%'}</span>
                        </p>
                    </div>
                </div>

                {/* Rainfall & Temp Graph */}
                <div className="dashboard-card graph-card">
                    <div className="card-title">
                        <CloudRain size={18} className="text-blue-400" />
                        <span>Precipitation vs. Soil Moisture</span>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={weatherData}>
                            <defs>
                                <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#334155', color: '#fff', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                            <Area type="monotone" dataKey="rain" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRain)" name="Rainfall (mm)" />
                            <Line type="monotone" dataKey="moisture" stroke="#4ade80" strokeWidth={2} dot={false} name="Soil Moisture Index" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Temperature Graph */}
                <div className="dashboard-card graph-card">
                    <div className="card-title">
                        <Thermometer size={18} className="text-orange-400" />
                        <span>Land Surface Temperature (LST)</span>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={weatherData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#334155', color: '#fff', borderRadius: '8px' }}
                            />
                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                            <Line type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={3} dot={{ r: 4, fill: '#f97316' }} name="Temperature (°C)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Climate Risk Zones */}
                <div className="dashboard-card risk-card">
                    <div className="card-title">
                        <AlertTriangle size={18} className="text-yellow-400" />
                        <span>Forecasted Climate Risks & Recommendations</span>
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <div className="risk-grid">
                                <div className="risk-item">
                                    <span>Flood Probability</span>
                                    <span className="risk-level-badge risk-low">12% (Low)</span>
                                </div>
                                <div className="risk-item">
                                    <span>Heatwave Prediction</span>
                                    <span className={`risk-level-badge ${selectedRegion.stress === 'high' ? 'risk-high' : 'risk-medium'}`}>
                                        {selectedRegion.stress === 'high' ? 'High (>5 days)' : 'Moderate'}
                                    </span>
                                </div>
                                <div className="risk-item">
                                    <span>Pest Susceptibility</span>
                                    <span className="risk-level-badge risk-medium">Moderate</span>
                                </div>
                                <div className="risk-item">
                                    <span>Wind Erosion Risk</span>
                                    <span className="risk-level-badge risk-low">Stable</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ flex: 1, minWidth: '300px', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h3 style={{ color: '#e2e8f0', fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Satellite size={16} /> AI-Driven Mitigation Strategies
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0, color: '#cbd5e1', fontSize: '0.95rem' }}>
                                <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'start', gap: '12px' }}>
                                    <div style={{ background: 'rgba(74, 222, 128, 0.2)', padding: '8px', borderRadius: '8px' }}><Droplets size={18} color="#4ade80" /></div>
                                    <div>
                                        <strong style={{ color: '#fff', display: 'block', marginBottom: '2px' }}>Irrigation Optimization</strong>
                                        Switch to drip irrigation to conserve 40% water during upcoming dry spell.
                                    </div>
                                </li>
                                <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'start', gap: '12px' }}>
                                    <div style={{ background: 'rgba(250, 204, 21, 0.2)', padding: '8px', borderRadius: '8px' }}><Sprout size={18} color="#facc15" /></div>
                                    <div>
                                        <strong style={{ color: '#fff', display: 'block', marginBottom: '2px' }}>Crop Cycle Adjustment</strong>
                                        Deploy heat-resistant seed varieties for next planting cycle ({selectedRegion.details.growingSeason}).
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ClimateAgriculture;
