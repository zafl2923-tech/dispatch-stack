'use client'

import { useState, useEffect, useRef } from 'react'
import { Truck, MapPin, Clock, Fuel, Play, Pause, Square, CheckCircle, AlertCircle } from 'lucide-react'

interface JourneyState {
  id: string
  origin: string
  originRegion?: string
  originCity?: string
  destination: string
  destinationRegion?: string
  destinationCity?: string
  originCountry: string
  destinationCountry: string
  distance: number
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled'
  startTime?: Date
  endTime?: Date
  fuelUsed: number
  fuelEconomy: number
  loadDescription: string
  loadWeight: number
  requiresPermit: boolean
  permitStatus?: string
  // Real GPS tracking (no map API)
  currentPosition?: { lat: number; lng: number; accuracy?: number; speed?: number; timestamp?: number }
  currentCountry?: string
  path?: { lat: number; lng: number; timestamp?: number; country?: string }[]
}

interface HOSState {
  drivingTime: number
  onDutyTime: number
  offDutyTime: number
  consecutiveOffDutyTime: number // Tracks consecutive off-duty time for restart
  lastBreakTime: number
  lastRestartTime: number
  currentActivity: 'driving' | 'on-duty' | 'off-duty' | 'sleeper'
  cycleTime: number // 70-hour/8-day cycle
}

interface ComplianceStatus {
  elevenHourRule: 'compliant' | 'warning' | 'violation'
  fourteenHourRule: 'compliant' | 'warning' | 'violation'
  thirtyMinuteBreak: 'compliant' | 'warning' | 'violation'
  seventyHourRule: 'compliant' | 'warning' | 'violation'
  journeyCompliance: 'compliant' | 'warning' | 'violation'
}

export default function JourneySimulationPage() {
  const [journey, setJourney] = useState<JourneyState>({
    id: '',
    origin: '',
    originRegion: '',
    originCity: '',
    destination: '',
    destinationRegion: '',
    destinationCity: '',
    originCountry: 'United States',
    destinationCountry: 'Canada',
    distance: 0,
    status: 'planned',
    fuelUsed: 0,
    fuelEconomy: 6.5,
    loadDescription: '',
    loadWeight: 0,
    requiresPermit: false,
    permitStatus: ''
    ,
    currentPosition: undefined,
    path: []
  })

  // Regions (states/provinces/territories) mapped to popular cities. Nunavut intentionally omitted.
  const regionsByCountry: Record<string, Record<string, string[]>> = {
    'United States': {
      'Alabama': ['Birmingham', 'Montgomery', 'Mobile'],
      'Alaska': ['Anchorage', 'Fairbanks', 'Juneau'],
      'Arizona': ['Phoenix', 'Tucson', 'Mesa'],
      'Arkansas': ['Little Rock', 'Fayetteville', 'Fort Smith'],
      'California': ['Los Angeles', 'San Francisco', 'San Diego'],
      'Colorado': ['Denver', 'Colorado Springs', 'Aurora'],
      'Connecticut': ['Bridgeport', 'New Haven', 'Hartford'],
      'Delaware': ['Wilmington', 'Dover', 'Newark'],
      'Florida': ['Miami', 'Orlando', 'Tampa'],
      'Georgia': ['Atlanta', 'Savannah', 'Augusta'],
      'Hawaii': ['Honolulu', 'Hilo', 'Kailua'],
      'Idaho': ['Boise', 'Idaho Falls', 'Coeur d\'Alene'],
      'Illinois': ['Chicago', 'Springfield', 'Naperville'],
      'Indiana': ['Indianapolis', 'Fort Wayne', 'Evansville'],
      'Iowa': ['Des Moines', 'Cedar Rapids', 'Davenport'],
      'Kansas': ['Wichita', 'Topeka', 'Overland Park'],
      'Kentucky': ['Louisville', 'Lexington', 'Bowling Green'],
      'Louisiana': ['New Orleans', 'Baton Rouge', 'Shreveport'],
      'Maine': ['Portland', 'Augusta', 'Bangor'],
      'Maryland': ['Baltimore', 'Annapolis', 'Frederick'],
      'Massachusetts': ['Boston', 'Worcester', 'Springfield'],
      'Michigan': ['Detroit', 'Grand Rapids', 'Lansing'],
      'Minnesota': ['Minneapolis', 'St. Paul', 'Rochester'],
      'Mississippi': ['Jackson', 'Gulfport', 'Hattiesburg'],
      'Missouri': ['Kansas City', 'St. Louis', 'Springfield'],
      'Montana': ['Billings', 'Missoula', 'Bozeman'],
      'Nebraska': ['Omaha', 'Lincoln', 'Bellevue'],
      'Nevada': ['Las Vegas', 'Reno', 'Henderson'],
      'New Hampshire': ['Manchester', 'Concord', 'Nashua'],
      'New Jersey': ['Newark', 'Jersey City', 'Atlantic City'],
      'New Mexico': ['Albuquerque', 'Santa Fe', 'Las Cruces'],
      'New York': ['New York City', 'Buffalo', 'Rochester'],
      'North Carolina': ['Charlotte', 'Raleigh', 'Greensboro'],
      'North Dakota': ['Fargo', 'Bismarck', 'Grand Forks'],
      'Ohio': ['Columbus', 'Cleveland', 'Cincinnati'],
      'Oklahoma': ['Oklahoma City', 'Tulsa', 'Norman'],
      'Oregon': ['Portland', 'Eugene', 'Salem'],
      'Pennsylvania': ['Philadelphia', 'Pittsburgh', 'Harrisburg'],
      'Rhode Island': ['Providence', 'Newport', 'Warwick'],
      'South Carolina': ['Charleston', 'Columbia', 'Greenville'],
      'South Dakota': ['Sioux Falls', 'Rapid City', 'Aberdeen'],
      'Tennessee': ['Nashville', 'Memphis', 'Knoxville'],
      'Texas': ['Houston', 'Dallas', 'San Antonio'],
      'Utah': ['Salt Lake City', 'Provo', 'Ogden'],
      'Vermont': ['Burlington', 'Montpelier', 'Rutland'],
      'Virginia': ['Virginia Beach', 'Richmond', 'Norfolk'],
      'Washington': ['Seattle', 'Spokane', 'Tacoma'],
      'West Virginia': ['Charleston', 'Morgantown', 'Huntington'],
      'Wisconsin': ['Milwaukee', 'Madison', 'Green Bay'],
      'Wyoming': ['Cheyenne', 'Casper', 'Laramie'],
      'District of Columbia': ['Washington']
    },
    'Canada': {
      'Ontario': ['Toronto', 'Ottawa', 'London'],
      'Quebec': ['Montreal', 'Quebec City', 'Laval'],
      'Nova Scotia': ['Halifax', 'Sydney', 'Truro'],
      'New Brunswick': ['Fredericton', 'Moncton', 'Saint John'],
      'Manitoba': ['Winnipeg', 'Brandon', 'Thompson'],
      'British Columbia': ['Vancouver', 'Victoria', 'Kelowna'],
      'Prince Edward Island': ['Charlottetown', 'Summerside', 'Cornwall'],
      'Saskatchewan': ['Saskatoon', 'Regina', 'Prince Albert'],
      'Alberta': ['Calgary', 'Edmonton', 'Red Deer'],
      'Newfoundland and Labrador': ['St. John\'s', 'Corner Brook', 'Gander'],
      'Yukon': ['Whitehorse', 'Dawson City', 'Watson Lake'],
      'Northwest Territories': ['Yellowknife', 'Hay River', 'Inuvik']
    },
    'Mexico': {
      'Aguascalientes': ['Aguascalientes', 'Jesús María', 'Rincón de Romos'],
      'Baja California': ['Tijuana', 'Mexicali', 'Ensenada'],
      'Baja California Sur': ['La Paz', 'Cabo San Lucas', 'San José del Cabo'],
      'Campeche': ['Campeche', 'Ciudad del Carmen', 'Champotón'],
      'Chiapas': ['Tuxtla Gutiérrez', 'San Cristóbal de las Casas', 'Tapachula'],
      'Chihuahua': ['Chihuahua', 'Ciudad Juárez', 'Delicias'],
      'Coahuila': ['Saltillo', 'Torreón', 'Monclova'],
      'Colima': ['Colima', 'Manzanillo', 'Tecomán'],
      'Durango': ['Durango', 'Gómez Palacio', 'Lerdo'],
      'Guanajuato': ['Guanajuato', 'León', 'Irapuato'],
      'Guerrero': ['Acapulco', 'Chilpancingo', 'Iguala'],
      'Hidalgo': ['Pachuca', 'Tulancingo', 'Tizayuca'],
      'Jalisco': ['Guadalajara', 'Puerto Vallarta', 'Zapopan'],
      'México State': ['Toluca', 'Ecatepec', 'Naucalpan'],
      'Michoacán': ['Morelia', 'Uruapan', 'Lázaro Cárdenas'],
      'Morelos': ['Cuernavaca', 'Jiutepec', 'Cuautla'],
      'Nayarit': ['Tepic', 'Bahía de Banderas', 'Compostela'],
      'Nuevo León': ['Monterrey', 'San Nicolás', 'Guadalupe'],
      'Oaxaca': ['Oaxaca City', 'Salina Cruz', 'Juchitán'],
      'Puebla': ['Puebla City', 'Tehuacán', 'Atlixco'],
      'Querétaro': ['Querétaro City', 'Santiago de Querétaro', 'San Juan del Río'],
      'Quintana Roo': ['Cancún', 'Chetumal', 'Playa del Carmen'],
      'San Luis Potosí': ['San Luis Potosí', 'Ciudad Valles', 'Matehuala'],
      'Sinaloa': ['Culiacán', 'Mazatlán', 'Los Mochis'],
      'Sonora': ['Hermosillo', 'Ciudad Obregón', 'Nogales'],
      'Tabasco': ['Villahermosa', 'Cárdenas', 'Comalcalco'],
      'Tamaulipas': ['Victoria', 'Reynosa', 'Matamoros'],
      'Tlaxcala': ['Tlaxcala City', 'Apizaco', 'Chiautempan'],
      'Veracruz': ['Veracruz', 'Xalapa', 'Cordoba'],
      'Yucatán': ['Mérida', 'Valladolid', 'Progreso'],
      'Zacatecas': ['Zacatecas', 'Fresnillo', 'Guadalupe'],
      'Ciudad de México': ['Mexico City']
    }
  }

  const [originCityQuery, setOriginCityQuery] = useState('')
  const [destinationCityQuery, setDestinationCityQuery] = useState('')

  const originDropdownRef = useRef<HTMLDivElement | null>(null)
  const destinationDropdownRef = useRef<HTMLDivElement | null>(null)

  // GPS refs/state for real tracking
  const geoWatchIdRef = useRef<number | null>(null)
  const lastReceivedPositionRef = useRef<GeolocationPosition | null>(null)
  const gpsIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [borderAlert, setBorderAlert] = useState<string | null>(null)

  // Rough country bounding boxes for detection (US / Canada / Mexico)
  const getCountryFromCoords = (lat: number, lng: number): string => {
    // Canada bbox (approx)
    if (lat >= 42 && lat <= 83 && lng >= -141 && lng <= -52) return 'Canada'
    // United States bbox (approx, excludes territories)
    if (lat >= 24.5 && lat <= 49.5 && lng >= -125 && lng <= -66) return 'United States'
    // Mexico bbox (approx)
    if (lat >= 14.5 && lat <= 32.7 && lng >= -118.5 && lng <= -86.7) return 'Mexico'
    return 'Unknown'
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (originDropdownRef.current && !originDropdownRef.current.contains(target)) {
        // only clear query if it's not equal to selected city (keeping selected city visible in input)
        if (originCityQuery !== (journey.originCity || '')) setOriginCityQuery('')
      }
      if (destinationDropdownRef.current && !destinationDropdownRef.current.contains(target)) {
        if (destinationCityQuery !== (journey.destinationCity || '')) setDestinationCityQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [originCityQuery, destinationCityQuery, journey.originCity, journey.destinationCity])

  const [hos, setHos] = useState<HOSState>({
    drivingTime: 0,
    onDutyTime: 0,
    offDutyTime: 0,
    consecutiveOffDutyTime: 0,
    lastBreakTime: 0,
    lastRestartTime: 0,
    currentActivity: 'off-duty',
    cycleTime: 0
  })

  const [compliance, setCompliance] = useState<ComplianceStatus>({
    elevenHourRule: 'compliant',
    fourteenHourRule: 'compliant',
    thirtyMinuteBreak: 'compliant',
    seventyHourRule: 'compliant',
    journeyCompliance: 'compliant'
  })

  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationSpeed, setSimulationSpeed] = useState(1) // minutes per second

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isSimulating && journey.status === 'in-progress') {
      interval = setInterval(() => {
        setHos(prev => {
          const newState = { ...prev }
          
          switch (prev.currentActivity) {
            case 'driving':
              newState.drivingTime += simulationSpeed
              newState.onDutyTime += simulationSpeed
              newState.cycleTime += simulationSpeed
              newState.consecutiveOffDutyTime = 0 // Reset consecutive off-duty time
              break
            case 'on-duty':
              newState.onDutyTime += simulationSpeed
              newState.cycleTime += simulationSpeed
              newState.consecutiveOffDutyTime = 0 // Reset consecutive off-duty time
              break
            case 'off-duty':
              newState.offDutyTime += simulationSpeed
              newState.consecutiveOffDutyTime += simulationSpeed
              // Check for 34-hour restart after 10+ consecutive hours off-duty (600 minutes)
              if (newState.consecutiveOffDutyTime >= 600) {
                newState.lastRestartTime = newState.consecutiveOffDutyTime
                newState.drivingTime = 0
                newState.onDutyTime = 0
                newState.cycleTime = 0
                newState.lastBreakTime = 0
              }
              break
            case 'sleeper':
              newState.offDutyTime += simulationSpeed
              newState.consecutiveOffDutyTime += simulationSpeed
              // Check for 34-hour restart after 10+ consecutive hours in sleeper (600 minutes)
              if (newState.consecutiveOffDutyTime >= 600) {
                newState.lastRestartTime = newState.consecutiveOffDutyTime
                newState.drivingTime = 0
                newState.onDutyTime = 0
                newState.cycleTime = 0
                newState.lastBreakTime = 0
              }
              break
          }

          // Update compliance with warning thresholds
          const getComplianceStatus = (current: number, limit: number, warningThreshold: number = 0.9) => {
            if (current >= limit) return 'violation'
            if (current >= limit * warningThreshold) return 'warning'
            return 'compliant'
          }

          const newCompliance: ComplianceStatus = {
            elevenHourRule: getComplianceStatus(newState.drivingTime, 660), // 11 hours = 660 minutes
            fourteenHourRule: getComplianceStatus(newState.onDutyTime, 840), // 14 hours = 840 minutes
            thirtyMinuteBreak: getComplianceStatus(newState.drivingTime - newState.lastBreakTime, 480), // 8 hours = 480 minutes
            seventyHourRule: getComplianceStatus(newState.cycleTime, 4200), // 70 hours = 4200 minutes
            journeyCompliance: 'compliant'
          }
          setCompliance(newCompliance)

          return newState
        })
      }, 1000) // Update every second
    }

    return () => clearInterval(interval)
  }, [isSimulating, journey.status, simulationSpeed])

  // Start a geolocation watch and sample the latest position once per minute
  useEffect(() => {
    // Only active while a journey is in-progress
    if (journey.status !== 'in-progress') {
      // cleanup if necessary
      try {
        if (geoWatchIdRef.current !== null && 'geolocation' in navigator) {
          navigator.geolocation.clearWatch(geoWatchIdRef.current)
          geoWatchIdRef.current = null
        }
      } catch (e) {
        console.error(e)
      }

      if (gpsIntervalRef.current) {
        clearInterval(gpsIntervalRef.current)
        gpsIntervalRef.current = null
      }

      return
    }

    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      console.warn('Geolocation API not available in this environment')
      return
    }

    const success = (pos: GeolocationPosition) => {
      // store last received position; we will persist it on 1-minute ticks
      lastReceivedPositionRef.current = pos
    }

    const error = (err: GeolocationPositionError) => {
      console.error('Geolocation error', err)
    }

    const watchId = navigator.geolocation.watchPosition(success, error, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000
    })

    // store numeric id
    geoWatchIdRef.current = watchId as unknown as number

    // Sample the last received position every 10 seconds (reduced for testing)
    gpsIntervalRef.current = setInterval(() => {
      const p = lastReceivedPositionRef.current
      if (!p) return

      const posObj = { lat: p.coords.latitude, lng: p.coords.longitude, timestamp: p.timestamp }
      setJourney(prev => {
        const detectedCountry = getCountryFromCoords(posObj.lat, posObj.lng)
        const lastPathCountry = prev.path && prev.path.length ? prev.path[prev.path.length - 1].country : undefined
        const prevCountry = prev.currentCountry ?? lastPathCountry ?? undefined

        const nowTs = Date.now()

        // If crossing detected (previous known country and changed), create an alert and update permit status
        if (prevCountry && detectedCountry && detectedCountry !== 'Unknown' && detectedCountry !== prevCountry) {
          // use current time when we persist the update to reflect when UI was updated
          setBorderAlert(`Crossed into ${detectedCountry} at ${new Date(nowTs).toLocaleString()}`)
          // mark permit status if crossing into a different country than origin
          const permitStatus = prev.originCountry !== detectedCountry ? `Entered ${detectedCountry} - permit may be required` : prev.permitStatus

          // persist change and return
          return {
            ...prev,
            currentPosition: { lat: posObj.lat, lng: posObj.lng, accuracy: p.coords.accuracy, speed: p.coords.speed ?? undefined, timestamp: nowTs },
            currentCountry: detectedCountry,
            permitStatus,
            path: [...(prev.path || []), { ...posObj, country: detectedCountry }]
          }
        }

        // Normal update - no crossing
        return {
          ...prev,
          currentPosition: { lat: posObj.lat, lng: posObj.lng, accuracy: p.coords.accuracy, speed: p.coords.speed ?? undefined, timestamp: nowTs },
          currentCountry: detectedCountry,
          path: [...(prev.path || []), { ...posObj, country: detectedCountry }]
        }
      })
    }, 10000)

    // Cleanup when effect re-runs or component unmounts
    return () => {
      try {
        if (geoWatchIdRef.current !== null && 'geolocation' in navigator) {
          navigator.geolocation.clearWatch(geoWatchIdRef.current)
          geoWatchIdRef.current = null
        }
      } catch (e) {
        console.error(e)
      }

      if (gpsIntervalRef.current) {
        clearInterval(gpsIntervalRef.current)
        gpsIntervalRef.current = null
      }
      // clear border alert after stopping tracking
      setBorderAlert(null)
    }
  }, [journey.status])

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.floor(minutes % 60)
    return `${hours}h ${mins}m`
  }

  const startJourney = () => {
    // require selected origin/destination cities and distance
    if (!journey.originCity || !journey.destinationCity || journey.distance <= 0) {
      alert('Please select origin and destination cities and set distance')
      return
    }

    const newJourney = {
      ...journey,
      origin: journey.originCity,
      destination: journey.destinationCity,
      id: `J-${Date.now()}`,
      status: 'in-progress' as const,
      startTime: new Date(),
      requiresPermit: journey.originCountry !== journey.destinationCountry
    }

    setJourney(newJourney)
    setIsSimulating(true)
  }

  const endJourney = () => {
    const newJourney = {
      ...journey,
      status: 'completed' as const,
      endTime: new Date(),
      fuelUsed: journey.distance / journey.fuelEconomy
    }

    setJourney(newJourney)
    setIsSimulating(false)
  }

  const cancelJourney = () => {
    const reason = prompt('Reason for cancellation:')
    if (reason) {
      setJourney({
        ...journey,
        status: 'cancelled' as const,
        endTime: new Date()
      })
      setIsSimulating(false)
    }
  }

  const changeActivity = (activity: HOSState['currentActivity']) => {
    setHos(prev => ({ ...prev, currentActivity: activity }))
  }

  const takeBreak = () => {
    setHos(prev => ({
      ...prev,
      currentActivity: 'off-duty',
      lastBreakTime: prev.drivingTime
    }))
  }

  // Inject test coordinates (Fairbanks, AK) for testing country detection
  const injectTestCoordinatesFairbanks = () => {
    const lat = 64.8378
    const lng = -147.7164
    const timestamp = Date.now()
    const detectedCountry = getCountryFromCoords(lat, lng)

    setJourney(prev => ({
      ...prev,
      currentPosition: { lat, lng, accuracy: undefined, speed: undefined, timestamp },
      currentCountry: detectedCountry,
      path: [...(prev.path || []), { lat, lng, timestamp, country: detectedCountry }]
    }))

    setBorderAlert(`Test: set position to Fairbanks, AK (${detectedCountry})`)
  }

  const StatusBadge = ({ status }: { status: string }) => {
    const colors = {
      'planned': 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>
        {status.replace('-', ' ').toUpperCase()}
      </span>
    )
  }

  const ComplianceCard = ({ title, status, details }: { 
    title: string
    status: 'compliant' | 'warning' | 'violation'
    details: string 
  }) => {
    const getColorClasses = () => {
      switch (status) {
        case 'compliant':
          return 'border-green-500 bg-green-50'
        case 'warning':
          return 'border-orange-500 bg-orange-50'
        case 'violation':
          return 'border-red-500 bg-red-50'
      }
    }

    const getIndicatorColor = () => {
      switch (status) {
        case 'compliant':
          return 'bg-green-500'
        case 'warning':
          return 'bg-orange-500'
        case 'violation':
          return 'bg-red-500'
      }
    }

    return (
      <div className={`p-4 rounded-lg border-2 ${getColorClasses()}`}>
        <div className="flex items-start space-x-3">
          <div className={`w-5 h-5 rounded-full flex-shrink-0 mt-0.5 ${getIndicatorColor()}`}></div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{details}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Journey Simulation</h1>
          <p className="text-gray-600 mt-2">Complete USMCA-compliant journey simulation with real-time compliance tracking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Journey Planning */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Journey Details
            </h2>
            
            <div className="space-y-4">
              

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Origin Country</label>
                  <select
                    value={journey.originCountry}
                    onChange={(e) => setJourney(prev => ({ ...prev, originCountry: e.target.value, originRegion: '', originCity: '' }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border text-gray-900"
                    disabled={journey.status !== 'planned'}
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="Mexico">Mexico</option>
                  </select>
                </div>
              {/* GPS tracking (device) - updates every minute */}
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">GPS Tracking</h3>
                {journey.currentPosition ? (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-600">Latitude: {journey.currentPosition.lat.toFixed(6)}</p>
                    <p className="text-sm text-gray-600">Longitude: {journey.currentPosition.lng.toFixed(6)}</p>
                    <p className="text-sm text-gray-600">Country: {journey.currentCountry || 'N/A'}</p>
                    <p className="text-sm text-gray-600">Accuracy: {journey.currentPosition.accuracy ? `${journey.currentPosition.accuracy.toFixed(1)} m` : 'N/A'}</p>
                    <p className="text-sm text-gray-600">Speed: {journey.currentPosition.speed ? `${journey.currentPosition.speed.toFixed(1)} m/s` : 'N/A'}</p>
                    <p className="text-sm text-gray-600">Samples: {journey.path?.length || 0}</p>
                    {borderAlert && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-sm text-yellow-800">{borderAlert}</p>
                      </div>
                    )}
                    <div className="mt-2">
                      <button
                        onClick={injectTestCoordinatesFairbanks}
                        className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
                      >
                        Set Test Start: Fairbanks, AK
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600">Waiting for GPS fix or permission...</div>
                )}
              </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Destination Country</label>
                  <select
                    value={journey.destinationCountry}
                    onChange={(e) => setJourney(prev => ({ ...prev, destinationCountry: e.target.value, destinationRegion: '', destinationCity: '' }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border text-gray-900"
                    disabled={journey.status !== 'planned'}
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="Mexico">Mexico</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Origin Region</label>
                  <select
                    value={journey.originRegion}
                    onChange={(e) => { setJourney(prev => ({ ...prev, originRegion: e.target.value, originCity: '' })); setOriginCityQuery('') }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border text-gray-900"
                    disabled={journey.status !== 'planned'}
                  >
                    <option value="">Select region</option>
                    {(Object.keys(regionsByCountry[journey.originCountry] || {})).map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>

                  <label className="block text-sm font-medium text-gray-700 mt-3">Origin City (search)</label>
                    <div className="relative" ref={originDropdownRef}>
                    <input
                      type="text"
                      value={originCityQuery || journey.originCity || ''}
                      onChange={(e) => { setOriginCityQuery(e.target.value); setJourney(prev => ({ ...prev, originCity: '' })) }}
                      placeholder="Search city..."
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border text-gray-900 placeholder-gray-400"
                      disabled={journey.status !== 'planned' || !journey.originRegion}
                    />
                    {journey.originRegion && originCityQuery.length > 0 && originCityQuery !== (journey.originCity || '') && (
                      <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md max-h-48 overflow-auto text-gray-900">
                        {(regionsByCountry[journey.originCountry]?.[journey.originRegion] || [])
                          .filter(c => c.toLowerCase().includes(originCityQuery.toLowerCase()))
                          .slice(0, 20)
                          .map(city => (
                            <li
                              key={city}
                              onClick={() => { setJourney(prev => ({ ...prev, originCity: city })); setOriginCityQuery(city) }}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-900"
                            >
                              {city}
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Destination Region</label>
                  <select
                    value={journey.destinationRegion}
                    onChange={(e) => { setJourney(prev => ({ ...prev, destinationRegion: e.target.value, destinationCity: '' })); setDestinationCityQuery('') }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border text-gray-900"
                    disabled={journey.status !== 'planned'}
                  >
                    <option value="">Select region</option>
                    {(Object.keys(regionsByCountry[journey.destinationCountry] || {})).map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>

                  <label className="block text-sm font-medium text-gray-700 mt-3">Destination City (search)</label>
                    <div className="relative" ref={destinationDropdownRef}>
                    <input
                      type="text"
                      value={destinationCityQuery || journey.destinationCity || ''}
                      onChange={(e) => { setDestinationCityQuery(e.target.value); setJourney(prev => ({ ...prev, destinationCity: '' })) }}
                      placeholder="Search city..."
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border text-gray-900 placeholder-gray-400"
                      disabled={journey.status !== 'planned' || !journey.destinationRegion}
                    />
                    {journey.destinationRegion && destinationCityQuery.length > 0 && destinationCityQuery !== (journey.destinationCity || '') && (
                      <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md max-h-48 overflow-auto text-gray-900">
                        {(regionsByCountry[journey.destinationCountry]?.[journey.destinationRegion] || [])
                          .filter(c => c.toLowerCase().includes(destinationCityQuery.toLowerCase()))
                          .slice(0, 20)
                          .map(city => (
                            <li
                              key={city}
                              onClick={() => { setJourney(prev => ({ ...prev, destinationCity: city })); setDestinationCityQuery(city) }}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-900"
                            >
                              {city}
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Distance (miles)</label>
                <input
                  type="number"
                  value={journey.distance}
                  onChange={(e) => setJourney(prev => ({ ...prev, distance: Number(e.target.value) }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border text-gray-900"
                  placeholder="250"
                  disabled={journey.status !== 'planned'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Load Description</label>
                <input
                  type="text"
                  value={journey.loadDescription}
                  onChange={(e) => setJourney(prev => ({ ...prev, loadDescription: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border text-gray-900"
                  placeholder="General freight"
                  disabled={journey.status !== 'planned'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Load Weight (lbs)</label>
                <input
                  type="number"
                  value={journey.loadWeight}
                  onChange={(e) => setJourney(prev => ({ ...prev, loadWeight: Number(e.target.value) }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border text-gray-900"
                  placeholder="2000"
                  disabled={journey.status !== 'planned'}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={journey.requiresPermit}
                  onChange={(e) => setJourney(prev => ({ ...prev, requiresPermit: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  disabled={journey.status !== 'planned'}
                />
                <label className="text-sm font-medium text-gray-700">Requires Cross-Border Permit</label>
              </div>

              {journey.originCountry !== journey.destinationCountry && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    <strong>Cross-Border Journey:</strong> USMCA permit will be required for {journey.destinationCountry}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                onClick={startJourney}
                disabled={journey.status !== 'planned'}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Journey
              </button>
              <button
                onClick={endJourney}
                disabled={journey.status !== 'in-progress'}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Square className="h-4 w-4 mr-2" />
                End Journey
              </button>
              <button
                onClick={cancelJourney}
                disabled={journey.status !== 'in-progress'}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Cancel Journey
              </button>
            </div>
          </div>

          {/* Hours of Service Tracking */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Hours of Service
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Status</span>
                <StatusBadge status={journey.status} />
              </div>

              {journey.startTime && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Start Time</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {journey.startTime.toLocaleTimeString()}
                    </p>
                  </div>
                  {journey.endTime && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">End Time</p>
                      <p className="text-lg font-semibold text-green-600">
                        {journey.endTime.toLocaleTimeString()}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-4 gap-4">
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Driving Time</p>
                  <p className="text-lg font-semibold text-orange-600">
                    {formatTime(hos.drivingTime)}
                  </p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">On-Duty Time</p>
                  <p className="text-lg font-semibold text-purple-600">
                    {formatTime(hos.onDutyTime)}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Off-Duty Time</p>
                  <p className="text-lg font-semibold text-green-600">
                    {formatTime(hos.offDutyTime)}
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Consecutive Off-Duty</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {formatTime(hos.consecutiveOffDutyTime)}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Activity</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['driving', 'on-duty', 'off-duty', 'sleeper'] as const).map(activity => (
                    <button
                      key={activity}
                      onClick={() => changeActivity(activity)}
                      className={`px-3 py-2 rounded-md font-medium ${
                        hos.currentActivity === activity
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      disabled={journey.status !== 'in-progress'}
                    >
                      {activity.replace('-', ' ').toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => setIsSimulating(!isSimulating)}
                  disabled={journey.status !== 'in-progress'}
                  className={`px-4 py-2 rounded-md font-medium ${
                    isSimulating
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isSimulating ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause Simulation
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Simulation
                    </>
                  )}
                </button>
                <button
                  onClick={takeBreak}
                  disabled={journey.status !== 'in-progress'}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
                >
                  Take 30-min Break
                </button>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Simulation Speed</label>
                <select
                  value={simulationSpeed}
                  onChange={(e) => setSimulationSpeed(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border text-gray-900"
                >
                  <option value={0.1}>0.1x (Ultra Slow)</option>
                  <option value={0.5}>0.5x (Slow)</option>
                  <option value={1}>1x (Normal)</option>
                  <option value={2}>2x (Fast)</option>
                  <option value={5}>5x (Very Fast)</option>
                  <option value={10}>10x (Super Fast)</option>
                  <option value={20}>20x (Ultra Fast)</option>
                  <option value={60}>60x (Real-time Hour)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* USMCA Compliance Status */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            USMCA Compliance Status
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ComplianceCard
              title="11-Hour Driving Rule"
              status={compliance.elevenHourRule}
              details="Maximum 11 hours driving after 10 consecutive hours off-duty"
            />
            <ComplianceCard
              title="14-Hour On-Duty Rule"
              status={compliance.fourteenHourRule}
              details="Maximum 14 hours on-duty after 10 consecutive hours off-duty"
            />
            <ComplianceCard
              title="30-Minute Break Rule"
              status={compliance.thirtyMinuteBreak}
              details="30-minute break required after 8 hours of cumulative driving"
            />
            <ComplianceCard
              title="70-Hour/8-Day Rule"
              status={compliance.seventyHourRule}
              details="Maximum 70 hours of driving in 8 consecutive days"
            />
            <ComplianceCard
              title="Journey Compliance"
              status={compliance.journeyCompliance}
              details="All journey requirements and documentation complete"
            />
          </div>
        </div>

        {/* Journey Summary */}
        {journey.status === 'completed' && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Journey Summary
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Distance</p>
                <p className="text-lg font-semibold text-gray-900">
                  {journey.distance.toFixed(1)} miles
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Fuel Used</p>
                <p className="text-lg font-semibold text-blue-600">
                  {journey.fuelUsed.toFixed(1)} gallons
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Fuel Economy</p>
                <p className="text-lg font-semibold text-green-600">
                  {journey.fuelEconomy.toFixed(1)} mpg
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Duration</p>
                <p className="text-lg font-semibold text-purple-600">
                  {journey.startTime && journey.endTime && 
                    formatTime((journey.endTime.getTime() - journey.startTime.getTime()) / 60000)
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
