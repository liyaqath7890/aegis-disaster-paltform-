/**
 * Weather Service for Aegis Disaster Platform.
 * In production, this would integrate with OpenWeatherMap or NOAA APIs.
 */

export async function getLiveWeather(lat, lng) {
  // Mocking weather data for simulation purposes
  // In a real scenario, we would use:
  // const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}`);
  
  return {
    temp: 28.5,
    humidity: 85,
    rainfallMm: Math.random() * 200, // Simulated high rainfall
    windSpeedKmph: 45,
    pressureHpa: 1008,
    condition: 'Heavy Rain',
    timestamp: new Date().toISOString()
  };
}

export function calculateFloodRisk(rainfallMm, humidity) {
  const riskScore = (rainfallMm * 0.6) + (humidity * 0.4);
  if (riskScore > 120) return 'critical';
  if (riskScore > 80) return 'high';
  if (riskScore > 40) return 'moderate';
  return 'low';
}
