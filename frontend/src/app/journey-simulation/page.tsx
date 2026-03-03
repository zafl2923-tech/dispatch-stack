'use client'

import { useState, useEffect } from 'react'
import { Truck, MapPin, Clock, Fuel, Play, Pause, Square, CheckCircle, AlertCircle } from 'lucide-react'

interface JourneyState {
  id: string
  origin: string
  destination: string
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
  elevenHourRule: boolean
  fourteenHourRule: boolean
  thirtyMinuteBreak: boolean
  seventyHourRule: boolean
  journeyCompliance: boolean
}

export default function JourneySimulationPage() {
  const [journey, setJourney] = useState<JourneyState>({
    id: '',
    origin: '',
    destination: '',
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
  })

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
    elevenHourRule: true,
    fourteenHourRule: true,
    thirtyMinuteBreak: true,
    seventyHourRule: true,
    journeyCompliance: true
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

          // Update compliance
          const newCompliance = {
            elevenHourRule: newState.drivingTime < 660,
            fourteenHourRule: newState.onDutyTime < 840,
            thirtyMinuteBreak: (newState.drivingTime - newState.lastBreakTime) <= 480,
            seventyHourRule: newState.cycleTime < 4200,
            journeyCompliance: true
          }
          setCompliance(newCompliance)

          return newState
        })
      }, 1000) // Update every second
    }

    return () => clearInterval(interval)
  }, [isSimulating, journey.status, simulationSpeed])

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.floor(minutes % 60)
    return `${hours}h ${mins}m`
  }

  const startJourney = () => {
    if (!journey.origin || !journey.destination || journey.distance <= 0) {
      alert('Please fill in journey details first')
      return
    }

    const newJourney = {
      ...journey,
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

  const ComplianceCard = ({ title, isCompliant, details }: { 
    title: string
    isCompliant: boolean
    details: string 
  }) => (
    <div className={`p-4 rounded-lg border-2 ${isCompliant ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
      <div className="flex items-start space-x-3">
        <div className={`w-5 h-5 rounded-full flex-shrink-0 mt-0.5 ${isCompliant ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{details}</p>
        </div>
      </div>
    </div>
  )

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
                  <label className="block text-sm font-medium text-gray-700">Origin</label>
                  <input
                    type="text"
                    value={journey.origin}
                    onChange={(e) => setJourney(prev => ({ ...prev, origin: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border text-gray-900"
                    placeholder="City, State"
                    disabled={journey.status !== 'planned'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Destination</label>
                  <input
                    type="text"
                    value={journey.destination}
                    onChange={(e) => setJourney(prev => ({ ...prev, destination: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border text-gray-900"
                    placeholder="City, State"
                    disabled={journey.status !== 'planned'}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Origin Country</label>
                  <select
                    value={journey.originCountry}
                    onChange={(e) => setJourney(prev => ({ ...prev, originCountry: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border text-gray-900"
                    disabled={journey.status !== 'planned'}
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="Mexico">Mexico</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Destination Country</label>
                  <select
                    value={journey.destinationCountry}
                    onChange={(e) => setJourney(prev => ({ ...prev, destinationCountry: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border text-gray-900"
                    disabled={journey.status !== 'planned'}
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="Mexico">Mexico</option>
                  </select>
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
              isCompliant={compliance.elevenHourRule}
              details="Maximum 11 hours driving after 10 consecutive hours off-duty"
            />
            <ComplianceCard
              title="14-Hour On-Duty Rule"
              isCompliant={compliance.fourteenHourRule}
              details="Maximum 14 hours on-duty after 10 consecutive hours off-duty"
            />
            <ComplianceCard
              title="30-Minute Break Rule"
              isCompliant={compliance.thirtyMinuteBreak}
              details="30-minute break required after 8 hours of cumulative driving"
            />
            <ComplianceCard
              title="70-Hour/8-Day Rule"
              isCompliant={compliance.seventyHourRule}
              details="Maximum 70 hours of driving in 8 consecutive days"
            />
            <ComplianceCard
              title="Journey Compliance"
              isCompliant={compliance.journeyCompliance}
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
