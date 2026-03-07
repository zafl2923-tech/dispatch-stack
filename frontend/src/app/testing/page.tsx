'use client'

import { useState, useEffect } from 'react'
import { Clock, Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react'

interface TestTimerState {
  drivingTime: number // minutes
  onDutyTime: number // minutes
  offDutyTime: number // minutes
  cycleTime: number // minutes (70-hour/8-day cycle)
  isRunning: boolean
  lastReset: Date
  lastBreakTime: number // driving time when last 30-min break was taken
}

interface USMCAComplianceTest {
  elevenHourRule: boolean // Max 11 hours driving
  fourteenHourRule: boolean // Max 14 hours on-duty
  thirtyMinuteBreak: boolean // 30-min break after 8 hours driving
  seventyHourRule: boolean // Max 70 hours in 8 days
}

export default function TestingPage() {
  const [timer, setTimer] = useState<TestTimerState>({
    drivingTime: 0,
    onDutyTime: 0,
    offDutyTime: 0,
    cycleTime: 0,
    isRunning: false,
    lastReset: new Date(),
    lastBreakTime: 0
  })

  const [compliance, setCompliance] = useState<USMCAComplianceTest>({
    elevenHourRule: true,
    fourteenHourRule: true,
    thirtyMinuteBreak: true,
    seventyHourRule: true
  })

  const [manualInput, setManualInput] = useState({
    drivingMinutes: 0,
    onDutyMinutes: 0,
    offDutyMinutes: 0
  })

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (timer.isRunning) {
      interval = setInterval(() => {
        setTimer(prev => {
          const newDrivingTime = prev.drivingTime + 1
          const newOnDutyTime = prev.onDutyTime + 1
          const newCycleTime = prev.cycleTime + 1

          // Check USMCA compliance rules
          const newCompliance = {
            elevenHourRule: newDrivingTime < 660, // 11 hours = 660 minutes
            fourteenHourRule: newOnDutyTime < 840, // 14 hours = 840 minutes
            thirtyMinuteBreak: (newDrivingTime - prev.lastBreakTime) <= 480, // 30-min break after 8 hours since last break
            seventyHourRule: newCycleTime < 4200 // 70 hours = 4200 minutes
          }

          setCompliance(newCompliance)

          return {
            ...prev,
            drivingTime: newDrivingTime,
            onDutyTime: newOnDutyTime,
            cycleTime: newCycleTime
          }
        })
      }, 60000) // Update every minute (simulated)
    }

    return () => clearInterval(interval)
  }, [timer.isRunning])

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const toggleTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: !prev.isRunning }))
  }

  const resetTimer = () => {
    setTimer({
      drivingTime: 0,
      onDutyTime: 0,
      offDutyTime: 0,
      cycleTime: 0,
      isRunning: false,
      lastReset: new Date(),
      lastBreakTime: 0
    })
  }

  const addManualTime = (type: 'driving' | 'onDuty' | 'offDuty', minutes: number) => {
    setTimer(prev => {
      const newState = { ...prev }
      
      switch (type) {
        case 'driving':
          newState.drivingTime = Math.max(0, prev.drivingTime + minutes)
          newState.onDutyTime = Math.max(0, prev.onDutyTime + minutes)
          break
        case 'onDuty':
          newState.onDutyTime = Math.max(0, prev.onDutyTime + minutes)
          break
        case 'offDuty':
          newState.offDutyTime = Math.max(0, prev.offDutyTime + minutes)
          // If adding 30+ minutes of off-duty time, reset break timer
          if (minutes >= 30) {
            newState.lastBreakTime = newState.drivingTime
          }
          break
      }
      
      newState.cycleTime = Math.max(0, prev.cycleTime + minutes)
      
      // Update compliance status after manual time adjustment
      const newCompliance = {
        elevenHourRule: newState.drivingTime < 660, // 11 hours = 660 minutes
        fourteenHourRule: newState.onDutyTime < 840, // 14 hours = 840 minutes
        thirtyMinuteBreak: (newState.drivingTime - newState.lastBreakTime) <= 480, // 30-min break after 8 hours since last break
        seventyHourRule: newState.cycleTime < 4200 // 70 hours = 4200 minutes
      }
      setCompliance(newCompliance)
      
      return newState
    })
  }

  const takeThirtyMinuteBreak = () => {
    setTimer(prev => ({
      ...prev,
      offDutyTime: prev.offDutyTime + 30,
      cycleTime: prev.cycleTime + 30,
      lastBreakTime: prev.drivingTime
    }))
    
    // Update compliance after taking break
    setCompliance(prev => ({
      ...prev,
      thirtyMinuteBreak: true
    }))
  }

  const ComplianceCard = ({ title, isCompliant, rule }: { 
    title: string
    isCompliant: boolean
    rule: string 
  }) => (
    <div className={`p-4 rounded-lg border-2 ${isCompliant ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{rule}</p>
        </div>
        <div className={`w-4 h-4 rounded-full ${isCompliant ? 'bg-green-500' : 'bg-red-500'}`}></div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">USMCA Compliance Testing</h1>
          <p className="text-gray-600 mt-2">Test and validate Hours of Service compliance rules</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Timer Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Timer Simulation
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Driving Time</p>
                  <p className="text-2xl font-bold text-blue-600">{formatTime(timer.drivingTime)}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">On-Duty Time</p>
                  <p className="text-2xl font-bold text-orange-600">{formatTime(timer.onDutyTime)}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Off-Duty Time</p>
                  <p className="text-2xl font-bold text-green-600">{formatTime(timer.offDutyTime)}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">70-Hour Cycle</p>
                  <p className="text-2xl font-bold text-purple-600">{formatTime(timer.cycleTime)}</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={toggleTimer}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium ${
                    timer.isRunning 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {timer.isRunning ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </>
                  )}
                </button>
                <button
                  onClick={resetTimer}
                  className="flex items-center px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </button>
                <button
                  onClick={takeThirtyMinuteBreak}
                  className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Take 30-min Break
                </button>
              </div>
            </div>
          </div>

          {/* Manual Time Adjustment */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Manual Time Adjustment</h2>
            
            <div className="space-y-4">
              {[
                { key: 'driving', label: 'Driving Time', color: 'blue' },
                { key: 'onDuty', label: 'On-Duty Time', color: 'orange' },
                { key: 'offDuty', label: 'Off-Duty Time', color: 'green' }
              ].map(({ key, label, color }) => (
                <div key={key} className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700 w-32">{label}:</label>
                  <button
                    onClick={() => addManualTime(key as any, -30)}
                    className="p-2 bg-red-100 hover:bg-red-200 rounded-lg"
                  >
                    <Minus className="h-4 w-4 text-red-600" />
                  </button>
                  <button
                    onClick={() => addManualTime(key as any, -10)}
                    className="p-2 bg-red-100 hover:bg-red-200 rounded-lg"
                  >
                    <span className="text-red-600 font-medium">-10m</span>
                  </button>
                  <button
                    onClick={() => addManualTime(key as any, 10)}
                    className="p-2 bg-green-100 hover:bg-green-200 rounded-lg"
                  >
                    <span className="text-green-600 font-medium">+10m</span>
                  </button>
                  <button
                    onClick={() => addManualTime(key as any, 30)}
                    className="p-2 bg-green-100 hover:bg-green-200 rounded-lg"
                  >
                    <Plus className="h-4 w-4 text-green-600" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* USMCA Compliance Rules */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">USMCA Compliance Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ComplianceCard
              title="11-Hour Driving Rule"
              isCompliant={compliance.elevenHourRule}
              rule="Maximum 11 hours driving after 10 consecutive hours off-duty"
            />
            <ComplianceCard
              title="14-Hour On-Duty Rule"
              isCompliant={compliance.fourteenHourRule}
              rule="Maximum 14 hours on-duty after 10 consecutive hours off-duty"
            />
            <ComplianceCard
              title="30-Minute Break Rule"
              isCompliant={compliance.thirtyMinuteBreak}
              rule="30-minute break required after 8 hours of cumulative driving"
            />
            <ComplianceCard
              title="70-Hour/8-Day Rule"
              isCompliant={compliance.seventyHourRule}
              rule="Cannot drive after 70 hours on-duty in 8 consecutive days"
            />
          </div>
        </div>

        {/* Test Data Generation */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Scenarios</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                const newTimer = {
                  drivingTime: 480, // 8 hours
                  onDutyTime: 540, // 9 hours
                  offDutyTime: 0,
                  cycleTime: 2400, // 40 hours
                  isRunning: false,
                  lastReset: new Date(),
                  lastBreakTime: 0 // No break taken yet
                }
                setTimer(newTimer)
                
                // Update compliance status
                const newCompliance = {
                  elevenHourRule: newTimer.drivingTime < 660,
                  fourteenHourRule: newTimer.onDutyTime < 840,
                  thirtyMinuteBreak: (newTimer.drivingTime - newTimer.lastBreakTime) <= 480,
                  seventyHourRule: newTimer.cycleTime < 4200
                }
                setCompliance(newCompliance)
              }}
              className="p-4 bg-yellow-100 hover:bg-yellow-200 rounded-lg text-left"
            >
              <h3 className="font-semibold text-gray-900">Near Break Time</h3>
              <p className="text-sm text-gray-600 mt-1">8 hours driving - needs 30-min break soon</p>
            </button>

            <button
              onClick={() => {
                const newTimer = {
                  drivingTime: 660, // 11 hours
                  onDutyTime: 720, // 12 hours
                  offDutyTime: 0,
                  cycleTime: 3000, // 50 hours
                  isRunning: false,
                  lastReset: new Date(),
                  lastBreakTime: 0 // No break taken yet
                }
                setTimer(newTimer)
                
                // Update compliance status
                const newCompliance = {
                  elevenHourRule: newTimer.drivingTime < 660,
                  fourteenHourRule: newTimer.onDutyTime < 840,
                  thirtyMinuteBreak: (newTimer.drivingTime - newTimer.lastBreakTime) <= 480,
                  seventyHourRule: newTimer.cycleTime < 4200
                }
                setCompliance(newCompliance)
              }}
              className="p-4 bg-red-100 hover:bg-red-200 rounded-lg text-left"
            >
              <h3 className="font-semibold text-gray-900">Driving Limit Exceeded</h3>
              <p className="text-sm text-gray-600 mt-1">11+ hours driving - violation</p>
            </button>

            <button
              onClick={() => {
                const newTimer = {
                  drivingTime: 300, // 5 hours
                  onDutyTime: 360, // 6 hours
                  offDutyTime: 480, // 8 hours
                  cycleTime: 1800, // 30 hours
                  isRunning: false,
                  lastReset: new Date(),
                  lastBreakTime: 300 // Break taken after 5 hours
                }
                setTimer(newTimer)
                
                // Update compliance status
                const newCompliance = {
                  elevenHourRule: newTimer.drivingTime < 660,
                  fourteenHourRule: newTimer.onDutyTime < 840,
                  thirtyMinuteBreak: (newTimer.drivingTime - newTimer.lastBreakTime) <= 480,
                  seventyHourRule: newTimer.cycleTime < 4200
                }
                setCompliance(newCompliance)
              }}
              className="p-4 bg-green-100 hover:bg-green-200 rounded-lg text-left"
            >
              <h3 className="font-semibold text-gray-900">Fresh Start</h3>
              <p className="text-sm text-gray-600 mt-1">Well within all limits</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
