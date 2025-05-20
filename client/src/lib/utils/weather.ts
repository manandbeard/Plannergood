// Map weather condition to Material Icon
export const getWeatherIcon = (condition: string): string => {
  const iconMap: Record<string, string> = {
    'Clear': 'wb_sunny',
    'Sunny': 'wb_sunny',
    'Clouds': 'cloud',
    'Partly Cloudy': 'partly_cloudy_day',
    'Cloudy': 'cloud',
    'Overcast': 'cloud',
    'Rain': 'rainy',
    'Drizzle': 'grain',
    'Thunderstorm': 'thunderstorm',
    'Snow': 'ac_unit',
    'Mist': 'foggy',
    'Fog': 'foggy',
    'Haze': 'foggy'
  };

  return iconMap[condition] || 'cloud';
};

// Get weather condition color
export const getWeatherColor = (condition: string): string => {
  const colorMap: Record<string, string> = {
    'Clear': 'text-yellow-500',
    'Sunny': 'text-yellow-500',
    'Clouds': 'text-gray-400',
    'Partly Cloudy': 'text-gray-400',
    'Cloudy': 'text-gray-400',
    'Overcast': 'text-gray-500',
    'Rain': 'text-blue-400',
    'Drizzle': 'text-blue-300',
    'Thunderstorm': 'text-purple-500',
    'Snow': 'text-blue-200',
    'Mist': 'text-gray-300',
    'Fog': 'text-gray-300',
    'Haze': 'text-gray-300'
  };

  return colorMap[condition] || 'text-gray-400';
};

// Format temperature with unit
export const formatTemperature = (temp: number, unit: string): string => {
  return `${Math.round(temp)}°${unit}`;
};
