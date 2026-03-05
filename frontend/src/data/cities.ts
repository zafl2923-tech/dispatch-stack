export interface City {
  id: string
  name: string
  country: 'United States' | 'Canada' | 'Mexico'
  stateProvince: string
  coordinates: {
    lat: number
    lng: number
  }
}

export const cities: City[] = [
  // United States - Major Cities by State
  { id: 'us-ny-nyc', name: 'New York City', country: 'United States', stateProvince: 'New York', coordinates: { lat: 40.7128, lng: -74.0060 } },
  { id: 'us-ca-la', name: 'Los Angeles', country: 'United States', stateProvince: 'California', coordinates: { lat: 34.0522, lng: -118.2437 } },
  { id: 'us-il-chicago', name: 'Chicago', country: 'United States', stateProvince: 'Illinois', coordinates: { lat: 41.8781, lng: -87.6298 } },
  { id: 'us-tx-houston', name: 'Houston', country: 'United States', stateProvince: 'Texas', coordinates: { lat: 29.7604, lng: -95.3698 } },
  { id: 'us-az-phoenix', name: 'Phoenix', country: 'United States', stateProvince: 'Arizona', coordinates: { lat: 33.4484, lng: -112.0740 } },
  { id: 'us-pa-philly', name: 'Philadelphia', country: 'United States', stateProvince: 'Pennsylvania', coordinates: { lat: 39.9526, lng: -75.1652 } },
  { id: 'us-tx-san-antonio', name: 'San Antonio', country: 'United States', stateProvince: 'Texas', coordinates: { lat: 29.4241, lng: -98.4936 } },
  { id: 'us-ca-san-diego', name: 'San Diego', country: 'United States', stateProvince: 'California', coordinates: { lat: 32.7157, lng: -117.1611 } },
  { id: 'us-tx-dallas', name: 'Dallas', country: 'United States', stateProvince: 'Texas', coordinates: { lat: 32.7767, lng: -96.7970 } },
  { id: 'us-ca-san-jose', name: 'San Jose', country: 'United States', stateProvince: 'California', coordinates: { lat: 37.3382, lng: -121.8863 } },
  { id: 'us-tx-austin', name: 'Austin', country: 'United States', stateProvince: 'Texas', coordinates: { lat: 30.2672, lng: -97.7431 } },
  { id: 'us-nc-jacksonville', name: 'Jacksonville', country: 'United States', stateProvince: 'North Carolina', coordinates: { lat: 30.3322, lng: -81.6557 } },
  { id: 'us-ca-san-francisco', name: 'San Francisco', country: 'United States', stateProvince: 'California', coordinates: { lat: 37.7749, lng: -122.4194 } },
  { id: 'us-oh-columbus', name: 'Columbus', country: 'United States', stateProvince: 'Ohio', coordinates: { lat: 39.9612, lng: -82.9988 } },
  { id: 'us-in-indianapolis', name: 'Indianapolis', country: 'United States', stateProvince: 'Indiana', coordinates: { lat: 39.7684, lng: -86.1581 } },
  { id: 'us-wa-seattle', name: 'Seattle', country: 'United States', stateProvince: 'Washington', coordinates: { lat: 47.6062, lng: -122.3321 } },
  { id: 'us-co-denver', name: 'Denver', country: 'United States', stateProvince: 'Colorado', coordinates: { lat: 39.7392, lng: -104.9903 } },
  { id: 'us-ma-boston', name: 'Boston', country: 'United States', stateProvince: 'Massachusetts', coordinates: { lat: 42.3601, lng: -71.0589 } },
  { id: 'us-mn-minneapolis', name: 'Minneapolis', country: 'United States', stateProvince: 'Minnesota', coordinates: { lat: 44.9778, lng: -93.2650 } },
  { id: 'us-mi-detroit', name: 'Detroit', country: 'United States', stateProvince: 'Michigan', coordinates: { lat: 42.3314, lng: -83.0458 } },
  { id: 'us-fl-miami', name: 'Miami', country: 'United States', stateProvince: 'Florida', coordinates: { lat: 25.7617, lng: -80.1918 } },
  { id: 'us-ca-sacramento', name: 'Sacramento', country: 'United States', stateProvince: 'California', coordinates: { lat: 38.5816, lng: -121.4944 } },
  { id: 'us-az-tucson', name: 'Tucson', country: 'United States', stateProvince: 'Arizona', coordinates: { lat: 32.2226, lng: -110.9747 } },
  { id: 'us-fl-tampa', name: 'Tampa', country: 'United States', stateProvince: 'Florida', coordinates: { lat: 27.9506, lng: -82.4572 } },
  { id: 'us-mo-kansas-city', name: 'Kansas City', country: 'United States', stateProvince: 'Missouri', coordinates: { lat: 39.0997, lng: -94.5786 } },
  { id: 'us-mo-st-louis', name: 'St. Louis', country: 'United States', stateProvince: 'Missouri', coordinates: { lat: 38.6270, lng: -90.1994 } },
  { id: 'us-md-baltimore', name: 'Baltimore', country: 'United States', stateProvince: 'Maryland', coordinates: { lat: 39.2904, lng: -76.6122 } },
  { id: 'us-wa-spokane', name: 'Spokane', country: 'United States', stateProvince: 'Washington', coordinates: { lat: 47.6588, lng: -117.4260 } },
  { id: 'us-al-birmingham', name: 'Birmingham', country: 'United States', stateProvince: 'Alabama', coordinates: { lat: 33.5207, lng: -86.8025 } },
  { id: 'us-ut-salt-lake-city', name: 'Salt Lake City', country: 'United States', stateProvince: 'Utah', coordinates: { lat: 40.7608, lng: -111.8910 } },
  { id: 'us-tn-memphis', name: 'Memphis', country: 'United States', stateProvince: 'Tennessee', coordinates: { lat: 35.1495, lng: -90.0490 } },
  { id: 'us-tn-nashville', name: 'Nashville', country: 'United States', stateProvince: 'Tennessee', coordinates: { lat: 36.1627, lng: -86.7816 } },
  { id: 'us-or-portland', name: 'Portland', country: 'United States', stateProvince: 'Oregon', coordinates: { lat: 45.5152, lng: -122.6784 } },
  { id: 'us-nc-charlotte', name: 'Charlotte', country: 'United States', stateProvince: 'North Carolina', coordinates: { lat: 35.2271, lng: -80.8431 } },
  { id: 'us-nv-las-vegas', name: 'Las Vegas', country: 'United States', stateProvince: 'Nevada', coordinates: { lat: 36.1699, lng: -115.1398 } },
  { id: 'us-wi-milwaukee', name: 'Milwaukee', country: 'United States', stateProvince: 'Wisconsin', coordinates: { lat: 43.0389, lng: -87.9065 } },
  { id: 'us-ak-anchorage', name: 'Anchorage', country: 'United States', stateProvince: 'Alaska', coordinates: { lat: 61.2181, lng: -149.9003 } },
  { id: 'us-hi-honolulu', name: 'Honolulu', country: 'United States', stateProvince: 'Hawaii', coordinates: { lat: 21.3099, lng: -157.8581 } },

  // Canada - Major Cities by Province
  { id: 'ca-on-toronto', name: 'Toronto', country: 'Canada', stateProvince: 'Ontario', coordinates: { lat: 43.6532, lng: -79.3832 } },
  { id: 'ca-qc-montreal', name: 'Montreal', country: 'Canada', stateProvince: 'Quebec', coordinates: { lat: 45.5017, lng: -73.5673 } },
  { id: 'ca-bc-vancouver', name: 'Vancouver', country: 'Canada', stateProvince: 'British Columbia', coordinates: { lat: 49.2827, lng: -123.1207 } },
  { id: 'ca-ab-calgary', name: 'Calgary', country: 'Canada', stateProvince: 'Alberta', coordinates: { lat: 51.0447, lng: -114.0719 } },
  { id: 'ca-ab-edmonton', name: 'Edmonton', country: 'Canada', stateProvince: 'Alberta', coordinates: { lat: 53.5461, lng: -113.4938 } },
  { id: 'ca-on-ottawa', name: 'Ottawa', country: 'Canada', stateProvince: 'Ontario', coordinates: { lat: 45.4215, lng: -75.6972 } },
  { id: 'ca-mb-winnipeg', name: 'Winnipeg', country: 'Canada', stateProvince: 'Manitoba', coordinates: { lat: 49.8951, lng: -97.1384 } },
  { id: 'ca-qc-quebec-city', name: 'Quebec City', country: 'Canada', stateProvince: 'Quebec', coordinates: { lat: 46.8139, lng: -71.2080 } },
  { id: 'ca-on-hamilton', name: 'Hamilton', country: 'Canada', stateProvince: 'Ontario', coordinates: { lat: 43.2557, lng: -79.8711 } },
  { id: 'ca-bc-victoria', name: 'Victoria', country: 'Canada', stateProvince: 'British Columbia', coordinates: { lat: 48.4284, lng: -123.3656 } },
  { id: 'ca-ns-halifax', name: 'Halifax', country: 'Canada', stateProvince: 'Nova Scotia', coordinates: { lat: 44.6488, lng: -63.5752 } },
  { id: 'ca-sk-regina', name: 'Regina', country: 'Canada', stateProvince: 'Saskatchewan', coordinates: { lat: 50.4452, lng: -104.6189 } },
  { id: 'ca-sk-saskatoon', name: 'Saskatoon', country: 'Canada', stateProvince: 'Saskatchewan', coordinates: { lat: 52.1579, lng: -106.6702 } },
  { id: 'ca-nb-moncton', name: 'Moncton', country: 'Canada', stateProvince: 'New Brunswick', coordinates: { lat: 46.0878, lng: -64.7782 } },
  { id: 'ca-nl-st-johns', name: 'St. John\'s', country: 'Canada', stateProvince: 'Newfoundland', coordinates: { lat: 47.5615, lng: -52.7126 } },
  { id: 'ca-pe-charlottetown', name: 'Charlottetown', country: 'Canada', stateProvince: 'Prince Edward Island', coordinates: { lat: 46.2382, lng: -63.1381 } },
  { id: 'ca-yt-whitehorse', name: 'Whitehorse', country: 'Canada', stateProvince: 'Yukon', coordinates: { lat: 60.7212, lng: -135.0568 } },
  { id: 'ca-nt-yellowknife', name: 'Yellowknife', country: 'Canada', stateProvince: 'Northwest Territories', coordinates: { lat: 62.4540, lng: -114.3718 } },
  { id: 'ca-nu-iqualuit', name: 'Iqaluit', country: 'Canada', stateProvince: 'Nunavut', coordinates: { lat: 63.7467, lng: -68.5170 } },

  // Mexico - Major Cities by State
  { id: 'mx-df-mexico-city', name: 'Mexico City', country: 'Mexico', stateProvince: 'Distrito Federal', coordinates: { lat: 19.4326, lng: -99.1332 } },
  { id: 'mx-nl-monterrey', name: 'Monterrey', country: 'Mexico', stateProvince: 'Nuevo León', coordinates: { lat: 25.6866, lng: -100.3161 } },
  { id: 'mx-jal-guadalajara', name: 'Guadalajara', country: 'Mexico', stateProvince: 'Jalisco', coordinates: { lat: 20.6597, lng: -103.3496 } },
  { id: 'mx-qt-puebla', name: 'Puebla', country: 'Mexico', stateProvince: 'Puebla', coordinates: { lat: 19.0414, lng: -98.2063 } },
  { id: 'mx-ags-tijuana', name: 'Tijuana', country: 'Mexico', stateProvince: 'Baja California', coordinates: { lat: 32.5149, lng: -117.0382 } },
  { id: 'mx-ags-mexicali', name: 'Mexicali', country: 'Mexico', stateProvince: 'Baja California', coordinates: { lat: 32.6519, lng: -115.4683 } },
  { id: 'mx-slp-leon', name: 'León', country: 'Mexico', stateProvince: 'Guanajuato', coordinates: { lat: 21.1619, lng: -101.3160 } },
  { id: 'mx-slp-san-luis-potosi', name: 'San Luis Potosí', country: 'Mexico', stateProvince: 'San Luis Potosí', coordinates: { lat: 22.1565, lng: -100.9855 } },
  { id: 'mx-chih-juarez', name: 'Ciudad Juárez', country: 'Mexico', stateProvince: 'Chihuahua', coordinates: { lat: 31.6904, lng: -106.4245 } },
  { id: 'mx-chih-chihuahua', name: 'Chihuahua', country: 'Mexico', stateProvince: 'Chihuahua', coordinates: { lat: 28.6353, lng: -106.0889 } },
  { id: 'mx-sin-culiacan', name: 'Culiacán', country: 'Mexico', stateProvince: 'Sinaloa', coordinates: { lat: 24.7994, lng: -107.4343 } },
  { id: 'mx-sin-mazatlan', name: 'Mazatlán', country: 'Mexico', stateProvince: 'Sinaloa', coordinates: { lat: 23.2494, lng: -106.4111 } },
  { id: 'mx-mty-torreon', name: 'Torreón', country: 'Mexico', stateProvince: 'Coahuila', coordinates: { lat: 25.5429, lng: -103.4068 } },
  { id: 'mx-mty-saltillo', name: 'Saltillo', country: 'Mexico', stateProvince: 'Coahuila', coordinates: { lat: 25.4233, lng: -101.0053 } },
  { id: 'mx-ags-ensenada', name: 'Ensenada', country: 'Mexico', stateProvince: 'Baja California', coordinates: { lat: 31.8669, lng: -116.5984 } },
  { id: 'mx-ver-veracruz', name: 'Veracruz', country: 'Mexico', stateProvince: 'Veracruz', coordinates: { lat: 19.1732, lng: -96.1342 } },
  { id: 'mx-mor-cuernavaca', name: 'Cuernavaca', country: 'Mexico', stateProvince: 'Morelos', coordinates: { lat: 18.6820, lng: -99.2077 } },
  { id: 'mx-mex-toluca', name: 'Toluca', country: 'Mexico', stateProvince: 'México', coordinates: { lat: 19.2830, lng: -99.6544 } },
  { id: 'mx-que-queretaro', name: 'Querétaro', country: 'Mexico', stateProvince: 'Querétaro', coordinates: { lat: 20.5888, lng: -100.3899 } },
  { id: 'mx-hgo-pachuca', name: 'Pachuca', country: 'Mexico', stateProvince: 'Hidalgo', coordinates: { lat: 20.1311, lng: -98.7588 } },
  { id: 'mx-tam-tampico', name: 'Tampico', country: 'Mexico', stateProvince: 'Tamaulipas', coordinates: { lat: 22.2555, lng: -97.8586 } },
  { id: 'mx-tam-reynosa', name: 'Reynosa', country: 'Mexico', stateProvince: 'Tamaulipas', coordinates: { lat: 26.0893, lng: -98.2960 } },
  { id: 'mx-tam-matamoros', name: 'Matamoros', country: 'Mexico', stateProvince: 'Tamaulipas', coordinates: { lat: 25.8686, lng: -97.5066 } },
  { id: 'mx-ags-san-luis-rio', name: 'San Luis Río Colorado', country: 'Mexico', stateProvince: 'Sonora', coordinates: { lat: 32.4561, lng: -114.7798 } },
  { id: 'mx-ags-nogales', name: 'Nogales', country: 'Mexico', stateProvince: 'Sonora', coordinates: { lat: 31.3018, lng: -110.9405 } },
  { id: 'mx-ags-hermosillo', name: 'Hermosillo', country: 'Mexico', stateProvince: 'Sonora', coordinates: { lat: 29.0729, lng: -110.9559 } },
  { id: 'mx-gro-acapulco', name: 'Acapulco', country: 'Mexico', stateProvince: 'Guerrero', coordinates: { lat: 16.8531, lng: -99.8197 } },
  { id: 'mx-oax-oaxaca', name: 'Oaxaca', country: 'Mexico', stateProvince: 'Oaxaca', coordinates: { lat: 17.0732, lng: -96.7266 } },
  { id: 'mx-chis-tuxtla', name: 'Tuxtla Gutiérrez', country: 'Mexico', stateProvince: 'Chiapas', coordinates: { lat: 16.7517, lng: -93.1137 } },
  { id: 'mx-yuc-merida', name: 'Mérida', country: 'Mexico', stateProvince: 'Yucatán', coordinates: { lat: 20.9674, lng: -89.5926 } },
  { id: 'mx-roi-cancun', name: 'Cancún', country: 'Mexico', stateProvince: 'Quintana Roo', coordinates: { lat: 21.1619, lng: -86.8515 } },
  { id: 'mx-cam-campeche', name: 'Campeche', country: 'Mexico', stateProvince: 'Campeche', coordinates: { lat: 19.8301, lng: -90.5349 } },
  { id: 'mx-tab-villahermosa', name: 'Villahermosa', country: 'Mexico', stateProvince: 'Tabasco', coordinates: { lat: 17.9892, lng: -92.9475 } }
]

export const getCitiesByCountry = (country: string) => {
  return cities.filter(city => city.country === country)
}

export const getCitiesByStateProvince = (country: string, stateProvince: string) => {
  return cities.filter(city => city.country === country && city.stateProvince === stateProvince)
}

export const getCityById = (id: string) => {
  return cities.find(city => city.id === id)
}

export const searchCities = (query: string) => {
  const lowerQuery = query.toLowerCase()
  return cities.filter(city => 
    city.name.toLowerCase().includes(lowerQuery) ||
    city.stateProvince.toLowerCase().includes(lowerQuery) ||
    city.country.toLowerCase().includes(lowerQuery)
  )
}
