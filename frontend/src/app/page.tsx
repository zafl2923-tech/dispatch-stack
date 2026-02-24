'use client'

import { useState, useEffect } from 'react'
import { Truck, Fuel, Clock, MapPin } from 'lucide-react'

interface TruckStats {
  distanceToday: number
  distanceJob: number
  fuelEconomy: number
  timeUntilBreak: number
  timeUntilEndOfDay: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<TruckStats>({
    distanceToday: 0,
    distanceJob: 0,
    fuelEconomy: 0,
    timeUntilBreak: 0,
    timeUntilEndOfDay: 0
  })

  useEffect(() => {
    // Mock data - replace with actual API calls
    setStats({
      distanceToday: 342.5,
      distanceJob: 1250.8,
      fuelEconomy: 7.2,
      timeUntilBreak: 45, // minutes
      timeUntilEndOfDay: 3.5 // hours
    })
  }, [])

  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}m`
    }
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const StatCard = ({ 
    icon: Icon, 
    title, 
    value, 
    unit, 
    color = "blue" 
  }: { 
    icon: any, 
    title: string, 
    value: number | string, 
    unit: string, 
    color?: string 
  }) => {
    const colorClasses = {
      blue: 'border-blue-500 text-blue-600 text-blue-500',
      green: 'border-green-500 text-green-600 text-green-500',
      yellow: 'border-yellow-500 text-yellow-600 text-yellow-500',
      orange: 'border-orange-500 text-orange-600 text-orange-500',
      purple: 'border-purple-500 text-purple-600 text-purple-500'
    }
    
    const colorClassMap = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue
    const [borderClass, textClass, iconClass] = colorClassMap.split(' ')
    
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${borderClass}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`text-2xl font-bold ${textClass}`}>
              {value} <span className="text-sm font-normal text-gray-500">{unit}</span>
            </p>
          </div>
          <Icon className={`h-8 w-8 ${iconClass}`} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Trucking Dashboard</h1>
          <p className="text-gray-600 mt-2">USMCA-Compliant Fleet Statistics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            icon={MapPin}
            title="Distance Today"
            value={stats.distanceToday.toFixed(1)}
            unit="miles"
            color="green"
          />
          
          <StatCard
            icon={MapPin}
            title="Job Distance"
            value={stats.distanceJob.toFixed(1)}
            unit="miles"
            color="blue"
          />
          
          <StatCard
            icon={Fuel}
            title="Fuel Economy"
            value={stats.fuelEconomy.toFixed(1)}
            unit="mpg"
            color="yellow"
          />
          
          <StatCard
            icon={Clock}
            title="Time Until Break"
            value={formatTime(stats.timeUntilBreak)}
            unit=""
            color="orange"
          />
          
          <StatCard
            icon={Clock}
            title="Time Until End of Day"
            value={formatTime(stats.timeUntilEndOfDay * 60)}
            unit=""
            color="purple"
          />
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Compliance Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Hours of Service: Compliant</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Fuel Log: Current</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Break Required Soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
