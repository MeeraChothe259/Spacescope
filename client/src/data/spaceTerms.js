export const spaceTerms = {
    // Cosmic Weather
    "Space Weather": "Conditions on the Sun and in the solar wind, magnetosphere, ionosphere, and thermosphere that can influence the performance and reliability of space-borne and ground-based technological systems.",
    "Solar Wind": "A stream of charged particles released from the upper atmosphere of the Sun. Think of it as 'space wind'.",
    "Solar Density": "How distinct particles are packed together in the solar wind. High density can compress Earth's magnetic field.",
    "Magnetic Field": "Earth's protective shield (Magnetosphere) that deflects most of the solar wind particles.",
    "Bz": "The north-south direction of the interplanetary magnetic field. Negative Bz (South) allows more solar energy to enter Earth's system.",
    "Kp Index": "A scale from 0-9 measuring disturbances in Earth's magnetic field. Higher numbers mean stronger geomagnetic storms.",
    "Geomagnetic Storm": "A temporary disturbance of Earth's magnetosphere caused by a solar wind shock wave.",
    "Proton Flux": "The amount of energetic protons (ions) flowing through an area. High flux can damage satellites.",
    "Solar Flare": "A sudden flash of increased brightness on the Sun, often associated with Coronal Mass Ejections (CMEs).",
    "Coronal Mass Ejection": "A significant release of plasma and magnetic field from the solar corona.",
    "Aurora": "A natural light display in the Earth's sky, predominantly seen in the high-latitude regions.",

    // Asteroids
    "NEO": "Near-Earth Object. Comets and asteroids that have been nudged by the gravitational attraction of nearby planets into orbits that allow them to enter the Earth's neighborhood.",
    "Asteroid": "A small rocky body orbiting the sun.",
    "Meteor": "A small body of matter from outer space that enters the earth's atmosphere.",
    "Meteorite": "A meteor that survives its passage through the earth's atmosphere such that part of it strikes the ground.",
    "Hazardous": "Potentially Hazardous Objects (PHOs) are asteroids/comets with an orbit that intersects Earth's orbit and are large enough to cause significant damage.",
    "Velocity": "The speed of something in a given direction.",
    "Miss Distance": "The closest distance an object will come to Earth during its pass.",
    "Lunar Distance": "The average distance from the center of Earth to the center of the Moon (approx. 384,400 km). Used as a ruler for space distances.",

    // EarthLink / Tech
    "Satellite": "An artificial body placed in orbit around the earth or moon or another planet in order to collect information or for communication.",
    "Orbit": "The curved path of a celestial object or spacecraft around a star, planet, or moon.",
    "Orbiting Body": "The celestial body (like Earth, Sun, or a planet) that an object revolves around.",
    "Satellite": "An artificial body placed in orbit around the earth or moon or another planet in order to collect information or for communication.",
    "Sentinel": "A series of Earth observation satellites developed by ESA to monitor the environment.",
    "MODIS": "Moderate Resolution Imaging Spectroradiometer. A key instrument aboard NASA's Terra and Aqua satellites for monitoring Earth's atmosphere and surface.",
    "Landsat": "The longest-running enterprise for acquisition of satellite imagery of Earth.",
    "Air Quality": "A measure of how clean or polluted the air is.",
    "UV Index": "A measure of the strength of ultraviolet radiation from the sun at a particular place and time.",
    "Precision Farming": "Using satellite data to optimize water, fertilizer, and crop yields.",
    "GPS": "Global Positioning System. A satellite-based radionavigation system owned by the US government.",
    "Remote Sensing": "The process of detecting and monitoring the physical characteristics of an area by measuring its reflected and emitted radiation at a distance.",
    "Atmosphere": "The envelope of gases surrounding the earth or another planet.",
    "Ozone Layer": "A region of Earth's stratosphere that absorbs most of the Sun's ultraviolet radiation.",

    // Missions
    "ISS": "International Space Station. A modular space station in low Earth orbit.",
    "Moon Phase": "The shape of the directly sunlit portion of the Moon as viewed from Earth.",
    "Meteor Shower": "A celestial event in which a number of meteors are observed to radiate, or originate, from one point in the night sky.",
    "Conjunction": "An event where two astronomical bodies appear close together in the sky.",
    "Sunrise": "The instant at which the upper edge of the Sun appears over the horizon in the morning.",
    "Sunset": "The daily disappearance of the Sun below the horizon due to Earth's rotation.",
    "Altitude": "The angular distance of an object above the observer's horizon. 90° is directly overhead (Zenith).",
    "Azimuth": "The direction of a celestial object, measured in degrees clockwise from North.",
    "Visibility": "A measure of the clearness of the atmosphere. High visibility means the sky is transparent and dark.",
    "Cloud Cover": "The percentage of the sky obscured by clouds.",
    "Planet": "A large celestial body orbiting a star. Visible planets normally look like bright, steady stars.",
    "Launch Vehicle": "A rocket-powered vehicle used to transport a spacecraft or other payload from Earth's surface to outer space.",
    "Propulsion": "The action of driving or pushing forward.",
    "Rover": "A space exploration vehicle designed to move across the surface of a planet or other celestial body.",
    "Probe": "An unmanned spacecraft designed to explore the solar system and transmit data back to Earth."
};

/**
 * Helper to get definition. Case insensitive.
 */
export const getDefinition = (term) => {
    const key = Object.keys(spaceTerms).find(k => k.toLowerCase() === term.toLowerCase());
    return key ? spaceTerms[key] : null;
};
