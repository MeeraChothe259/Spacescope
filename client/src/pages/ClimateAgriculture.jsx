
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
    Sun,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Activity
} from 'lucide-react';
import SmartTerm from '../components/SmartTerm';
import './ClimateAgriculture.css';

// --- DATA CONSTANTS ---

const MOCK_REGIONS = [
    // --- ASIA ---
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
        id: 'mekong-vn',
        name: 'Mekong Delta, Vietnam',
        lat: 10.0371,
        lng: 105.7882,
        stress: 'medium',
        risk: 'Saline Intrusion',
        crops: ['Rice', 'Fruit', 'Coconut'],
        details: { soilType: 'Alluvial/Acid Sulfate', avgRainfall: '1800mm', growingSeason: 'Year-round' }
    },
    {
        id: 'hokkaido-jp',
        name: 'Hokkaido, Japan',
        lat: 43.0642,
        lng: 141.3469,
        stress: 'low',
        risk: 'Cold Snap Damage',
        crops: ['Potatoes', 'Wheat', 'Dairy'],
        details: { soilType: 'Volcanic Ash', avgRainfall: '1100mm', growingSeason: 'May - Oct' }
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
        id: 'sindh-pk',
        name: 'Sindh, Pakistan',
        lat: 25.8943,
        lng: 68.5247,
        stress: 'high',
        risk: 'Extreme Heat & Drought',
        crops: ['Cotton', 'Wheat', 'Dates'],
        details: { soilType: 'Silt/Clay', avgRainfall: '150mm', growingSeason: 'Year-round' }
    },
    {
        id: 'isaan-th',
        name: 'Isaan Region, Thailand',
        lat: 15.1258,
        lng: 103.1674,
        stress: 'medium',
        risk: 'Erratic Rainfall',
        crops: ['Jasmine Rice', 'Cassava'],
        details: { soilType: 'Sandy Loam', avgRainfall: '1300mm', growingSeason: 'Jun - Dec' }
    },
    {
        id: 'java-id',
        name: 'Central Java, Indonesia',
        lat: -7.1509,
        lng: 110.1403,
        stress: 'low',
        risk: 'Volcanic Ash Fall',
        crops: ['Rice', 'Coffee', 'Tobacco'],
        details: { soilType: 'Andisols', avgRainfall: '2500mm', growingSeason: 'Year-round' }
    },

    // --- NORTH AMERICA ---
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
        id: 'saskatchewan-ca',
        name: 'Saskatchewan, Canada',
        lat: 52.9399,
        lng: -106.4509,
        stress: 'medium',
        risk: 'Early Frost',
        crops: ['Canola', 'Wheat', 'Lentils'],
        details: { soilType: 'Chernozem', avgRainfall: '450mm', growingSeason: 'May - Sep' }
    },
    {
        id: 'sonora-mx',
        name: 'Sonora, Mexico',
        lat: 29.0892,
        lng: -110.9613,
        stress: 'high',
        risk: 'Desertification',
        crops: ['Wheat', 'Grapes', 'Asparagus'],
        details: { soilType: 'Aridisol', avgRainfall: '200mm', growingSeason: 'Nov - May' }
    },

    // --- SOUTH AMERICA ---
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
        id: 'pampas-ar',
        name: 'Pampas, Argentina',
        lat: -34.6037,
        lng: -58.3816,
        stress: 'medium',
        risk: 'Flood & Soil Erosion',
        crops: ['Soybean', 'Maize', 'Wheat'],
        details: { soilType: 'Mollisol', avgRainfall: '1000mm', growingSeason: 'Sep - Apr' }
    },
    {
        id: 'valle-central-cl',
        name: 'Central Valley, Chile',
        lat: -35.6751,
        lng: -71.5430,
        stress: 'medium',
        risk: 'Glacial Melt Reduction',
        crops: ['Grapes', 'Apples', 'Cherries'],
        details: { soilType: 'Aluvial', avgRainfall: '500mm', growingSeason: 'Sep - May' }
    },

    // --- EUROPE ---
    {
        id: 'ukraine-steppe',
        name: 'Steppe Zone, Ukraine',
        lat: 48.3794,
        lng: 31.1656,
        stress: 'medium',
        risk: 'Dry Spell Volatility',
        crops: ['Sunflower', 'Wheat', 'Corn'],
        details: { soilType: 'Chernozem', avgRainfall: '550mm', growingSeason: 'Apr - Oct' }
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
    },
    {
        id: 'andalusia-es',
        name: 'Andalusia, Spain',
        lat: 37.3891,
        lng: -5.9845,
        stress: 'high',
        risk: 'Extreme Drought',
        crops: ['Olives', 'Citrus', 'Strawberries'],
        details: { soilType: 'Calcareous', avgRainfall: '500mm', growingSeason: 'Year-round' }
    },
    {
        id: 'puglia-it',
        name: 'Puglia, Italy',
        lat: 41.1259,
        lng: 16.8667,
        stress: 'medium',
        risk: 'Xylella Fastidiosa (Outbreak)',
        crops: ['Olives', 'Durum Wheat'],
        details: { soilType: 'Terra Rossa', avgRainfall: '600mm', growingSeason: 'Year-round' }
    },
    {
        id: 'bavaria-de',
        name: 'Bavaria, Germany',
        lat: 48.3953,
        lng: 11.4333,
        stress: 'low',
        risk: 'Flash Flooding',
        crops: ['Hops', 'Barley', 'Wheat'],
        details: { soilType: 'Luvisol', avgRainfall: '850mm', growingSeason: 'Apr - Oct' }
    },

    // --- AFRICA ---
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
        id: 'western-cape-za',
        name: 'Western Cape, South Africa',
        lat: -33.9249,
        lng: 18.4241,
        stress: 'high',
        risk: 'Water Scarcity ("Day Zero")',
        crops: ['Grapes', 'Citrus', 'Wheat'],
        details: { soilType: 'Sandy Loam', avgRainfall: '500mm', growingSeason: 'May - Oct' }
    },
    {
        id: 'rift-valley-ke',
        name: 'Rift Valley, Kenya',
        lat: -0.2833,
        lng: 36.0667,
        stress: 'medium',
        risk: 'Locust Infestation',
        crops: ['Maize', 'Tea', 'Flowers'],
        details: { soilType: 'Volcanic Soil', avgRainfall: '1200mm', growingSeason: 'Mar - Nov' }
    },
    {
        id: 'kano-ng',
        name: 'Kano State, Nigeria',
        lat: 12.0022,
        lng: 8.5920,
        stress: 'medium',
        risk: 'Harmattan Dust & Heat',
        crops: ['Sorghum', 'Millet', 'Groundnuts'],
        details: { soilType: 'Sandy Soil', avgRainfall: '800mm', growingSeason: 'Jun - Sep' }
    },
    {
        id: 'high-atlas-ma',
        name: 'High Atlas, Morocco',
        lat: 31.2500,
        lng: -7.0000,
        stress: 'high',
        risk: 'Soil Erosion',
        crops: ['Almonds', 'Olives', 'Barely'],
        details: { soilType: 'Lithosols', avgRainfall: '300mm', growingSeason: 'Oct - May' }
    },

    // --- OCEANIA ---
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
        id: 'canterbury-nz',
        name: 'Canterbury Plains, NZ',
        lat: -43.5321,
        lng: 172.6362,
        stress: 'low',
        risk: 'Nitrate Leaching',
        crops: ['Dairy', 'Wheat', 'Seeds'],
        details: { soilType: 'Brown Soil', avgRainfall: '650mm', growingSeason: 'Sep - May' }
    },
    // --- ADDITIONAL GLOBAL REGIONS ---
    {
        id: 'central-valley-cr',
        name: 'Central Valley, Costa Rica',
        lat: 9.9281,
        lng: -84.0907,
        stress: 'low',
        risk: 'Volcanic Activity',
        crops: ['Coffee', 'Bananas', 'Sugar'],
        details: { soilType: 'Volcanic Ash', avgRainfall: '2000mm', growingSeason: 'Year-round' }
    },
    {
        id: 'al-ahsa-sa',
        name: 'Al-Ahsa Oasis, Saudi Arabia',
        lat: 25.3833,
        lng: 49.5833,
        stress: 'high',
        risk: 'Sand Encroachment',
        crops: ['Dates', 'Rice', 'Alfalfa'],
        details: { soilType: 'Sandy Loam', avgRainfall: '80mm', growingSeason: 'Year-round' }
    },
    {
        id: 'hedmark-no',
        name: 'Hedmark, Norway',
        lat: 60.7945,
        lng: 11.0678,
        stress: 'low',
        risk: 'Short Growing Season',
        crops: ['Wheat', 'Barley', 'Potato'],
        details: { soilType: 'Moraine', avgRainfall: '600mm', growingSeason: 'May - Aug' }
    },
    {
        id: 'turkistan-kz',
        name: 'Turkistan, Kazakhstan',
        lat: 43.3000,
        lng: 68.2000,
        stress: 'high',
        risk: 'Water Diversion (Aral Sea)',
        crops: ['Cotton', 'Wheat', 'Rice'],
        details: { soilType: 'Sierozem', avgRainfall: '250mm', growingSeason: 'Apr - Oct' }
    },
    {
        id: 'sidamo-et',
        name: 'Sidamo Region, Ethiopia',
        lat: 6.7000,
        lng: 38.5000,
        stress: 'medium',
        risk: 'Soil Acidification',
        crops: ['Coffee', 'Enset', 'Maize'],
        details: { soilType: 'Nitisols', avgRainfall: '1200mm', growingSeason: 'Mar - Oct' }
    },
    {
        id: 'central-luzon-ph',
        name: 'Central Luzon, Philippines',
        lat: 15.4828,
        lng: 120.7120,
        stress: 'medium',
        risk: 'Typhoon Damage',
        crops: ['Rice', 'Corn', 'Sugar'],
        details: { soilType: 'Alluvial', avgRainfall: '2000mm', growingSeason: 'Year-round' }
    },
    {
        id: 'mazovia-pl',
        name: 'Mazovia, Poland',
        lat: 52.2297,
        lng: 21.0122,
        stress: 'low',
        risk: 'Late Spring Frost',
        crops: ['Apples', 'Sugar Beets', 'Rye'],
        details: { soilType: 'Podzols', avgRainfall: '550mm', growingSeason: 'Apr - Oct' }
    },
    {
        id: 'charentes-fr',
        name: 'Charentes, France',
        lat: 45.7500,
        lng: 0.1667,
        stress: 'medium',
        risk: 'Drought Impact (Cognac)',
        crops: ['Grapes', 'Sunflower', 'Corn'],
        details: { soilType: 'Clay-Limestone', avgRainfall: '800mm', growingSeason: 'Mar - Sep' }
    },
    {
        id: 'minnas-gerais-br',
        name: 'Minas Gerais, Brazil',
        lat: -18.5122,
        lng: -44.5550,
        stress: 'medium',
        risk: 'Frost in Highlands',
        crops: ['Coffee', 'Corn', 'Dairy'],
        details: { soilType: 'Latosols', avgRainfall: '1400mm', growingSeason: 'Oct - Mar' }
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
            moisture: Math.max(20, Math.min(90, 50 + 20 * seasonFactor + (Math.random() * 10 - 5))),
            projectedProfit: Math.floor(5000 + (Math.random() * 2000) + (seasonFactor * 1500)),
            actualProfit: Math.floor(4500 + (Math.random() * 2500) + (seasonFactor * 1000))
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
                        Real-time <SmartTerm term="Satellite" /> monitoring of global agricultural hotspots.
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
                            <SmartTerm term="Orbit" display={<MapIcon size={18} className="text-blue-400" />} />
                            <span><SmartTerm term="Satellite" /> Moisture & Vegetation Map</span>
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
                        <span className="micro-card-title"><Satellite size={14} /> <SmartTerm term="Satellite" display="SATELLITE INSIGHT" /></span>
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

                {/* Economic Impact / Farm Profits Card */}
                <div className="dashboard-card economic-card">
                    <div className="card-title">
                        <DollarSign size={18} className="text-yellow-400" />
                        <span>Economic Yield & Profit Forecast</span>
                    </div>

                    <div className="economic-summary">
                        <div className="econ-stat">
                            <span className="econ-label">Estimated Annual Profit</span>
                            <span className="econ-val">$ {selectedRegion.stress === 'high' ? '42,500' : selectedRegion.stress === 'medium' ? '68,200' : '94,800'}</span>
                            <span className={`econ-trend ${selectedRegion.stress === 'high' ? 'down' : 'up'}`}>
                                {selectedRegion.stress === 'high' ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                                {selectedRegion.stress === 'high' ? '-12.4%' : '+5.2%'} vs Last Year
                            </span>
                        </div>
                        <div className="econ-stat">
                            <span className="econ-label">Resource Efficiency</span>
                            <span className="econ-val">{selectedRegion.stress === 'high' ? '64%' : '88%'}</span>
                            <div className="efficiency-bar">
                                <div className="efficiency-fill" style={{ width: selectedRegion.stress === 'high' ? '64%' : '88%', background: selectedRegion.stress === 'high' ? '#f87171' : '#4ade80' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="profit-chart-container">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={weatherData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#334155', color: '#fff' }}
                                />
                                <Legend iconType="rect" />
                                <Bar dataKey="projectedProfit" fill="#3b82f6" name="Projected ($)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="actualProfit" fill="#facc15" name="Actual ($)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="micro-card economics-insight">
                        <span className="micro-card-title"><Activity size={14} /> ECONOMIC GUARD</span>
                        <p>
                            Estimated loss due to {selectedRegion.risk}:
                            <span style={{ color: '#f87171', marginLeft: '5px', fontWeight: 'bold' }}>
                                $ {selectedRegion.stress === 'high' ? '12,400' : '2,100'}
                            </span>.
                            Satellites suggest adjusting insurance premiums based on 30-day volatility.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ClimateAgriculture;
