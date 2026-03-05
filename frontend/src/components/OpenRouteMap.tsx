'use client'

import { useEffect, useRef, useState } from 'react'

interface OpenRouteMapProps {
  origin?: { lat: number; lng: number }
  destination?: { lat: number; lng: number }
  waypoints?: { lat: number; lng: number }[]
  height?: string
  zoom?: number
  showRoute?: boolean
}

export default function OpenRouteMap({ 
  origin, 
  destination, 
  waypoints = [], 
  height = '400px', 
  zoom = 10,
  showRoute = true 
}: OpenRouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const containerIdRef = useRef<string>(`openroute-map-${Math.random().toString(36).slice(2,9)}`)
  const mapInstanceRef = useRef<any>(null)
  const routeLayerRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const waitForMapContainer = async (timeout = 5000) => {
      const start = Date.now()
      console.log('OpenRouteMap: waiting for map container', { timeout })
      while (mounted && !mapRef.current && Date.now() - start < timeout) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise(r => setTimeout(r, 50))
      }
      console.log('OpenRouteMap: mapRef current after wait', { current: mapRef.current })

      // Fallback: try to find by id in case ref wasn't attached yet
      if (mounted && !mapRef.current) {
        const el = document.getElementById(containerIdRef.current)
        if (el) {
          // attach fallback
          // @ts-ignore
          mapRef.current = el
          console.log('OpenRouteMap: found container by id fallback', { id: containerIdRef.current })
          return true
        }
      }

      return !!mapRef.current
    }

    const loadLeafletAssets = async () => {
      // Avoid loading assets multiple times in the page
      if (!document.querySelector('link[data-leaflet]')) {
        const leafletCss = document.createElement('link')
        leafletCss.rel = 'stylesheet'
        leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        leafletCss.setAttribute('data-leaflet', 'true')
        document.head.appendChild(leafletCss)
      }

      if (!window.L) {
        if (!(window as any).__leafletLoadingPromise) {
          (window as any).__leafletLoadingPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script')
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
            script.async = true
            script.onload = () => resolve(true)
            script.onerror = () => reject(new Error('Failed to load Leaflet'))
            document.head.appendChild(script)
          })
        }
        // Wait for the global promise
        // eslint-disable-next-line no-await-in-loop
        await (window as any).__leafletLoadingPromise
      }
    }

    const loadMap = async () => {
      try {
        console.log('OpenRouteMap: loadMap start', { origin, destination, waypoints, showRoute })
        const hasContainer = await waitForMapContainer()
        if (!hasContainer) {
          if (mounted) {
            console.error('OpenRouteMap: Map container not found after wait')
            setError('Map container not found')
          }
          return
        }

        await loadLeafletAssets()

        if (!mounted) return

        // If map already initialized, update markers/route instead of re-creating
        if (mapInstanceRef.current) {
          const map = mapInstanceRef.current
          if (showRoute && origin && destination) {
            addRoute(map, origin, destination, waypoints)
          }
          setIsLoaded(true)
          return
        }

        const map = window.L.map(mapRef.current as HTMLDivElement, {
          center: origin || [39.8283, -98.5795],
          zoom: zoom,
          zoomControl: true
        })

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map)

        mapInstanceRef.current = map
        setIsLoaded(true)

        if (showRoute && origin && destination) {
          addRoute(map, origin, destination, waypoints)
        }

        if (origin) {
          window.L.marker([origin.lat, origin.lng], { title: 'Origin' }).addTo(map)
        }

        if (destination) {
          window.L.marker([destination.lat, destination.lng], { title: 'Destination' }).addTo(map)
        }

        const bounds = window.L.latLngBounds([
          origin ? [origin.lat, origin.lng] : [39.8283, -98.5795],
          destination ? [destination.lat, destination.lng] : [39.8283, -98.5795],
          ...waypoints.map(wp => [wp.lat, wp.lng])
        ])
        map.fitBounds(bounds, { padding: [50, 50] })
        console.log('OpenRouteMap: map initialized and fit bounds')
      } catch (err) {
        if (mounted) setError('Failed to load map')
        console.error('OpenRouteMap loadMap error:', err)
      }
    }

    loadMap()

    return () => {
      mounted = false
      try {
        if (routeLayerRef.current && mapInstanceRef.current) {
          mapInstanceRef.current.removeLayer(routeLayerRef.current)
          routeLayerRef.current = null
        }
      } catch (e) {
        // ignore
      }
    }
  }, [origin, destination, waypoints, zoom, showRoute])

  const addRoute = async (map: any, origin: any, destination: any, waypoints: any[]) => {
    try {
      console.log('Getting route from OpenRouteService...')
      console.log('API Key:', process.env.NEXT_PUBLIC_OPENROUTESERVICE_API_KEY ? 'Set' : 'Not set')
      
      // Get route from OpenRouteService
      const coordinates = [
        [origin.lng, origin.lat],
        ...waypoints.map(wp => [wp.lng, wp.lat]),
        [destination.lng, destination.lat]
      ]
      
      console.log('Route coordinates:', coordinates)

      const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': process.env.NEXT_PUBLIC_OPENROUTESERVICE_API_KEY || 'YOUR_OPENROUTESERVICE_API_KEY'
        },
        body: JSON.stringify({
          coordinates: coordinates
        })
      })

      console.log('API Response status:', response.status)

      if (!response.ok) {
        console.error('API Response not ok:', response.status, response.statusText)
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('API Response data:', data)
      
      if (data.routes && data.routes[0] && data.routes[0].geometry) {
        console.log('Drawing route...')
        // Convert GeoJSON to Leaflet format
        const routeCoords = data.routes[0].geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]])
        
        // Add route line to map
        const routeLine = window.L.polyline(routeCoords, {
          color: '#3b82f6',
          weight: 4,
          opacity: 0.7
        }).addTo(map)

        routeLayerRef.current = routeLine
        console.log('Route drawn successfully')
      } else {
        console.log('No route data found, using fallback')
        throw new Error('No route data in response')
      }
    } catch (err) {
      console.error('Failed to get route:', err)
      console.log('Using fallback straight line...')
      // Draw straight line as fallback
      const straightLine = window.L.polyline([
        [origin.lat, origin.lng],
        [destination.lat, destination.lng]
      ], {
        color: '#3b82f6',
        weight: 4,
        opacity: 0.7,
        dashArray: '10, 10'
      }).addTo(map)
      
      routeLayerRef.current = straightLine
      console.log('Fallback line drawn')
    }
  }

  // Always render the map container so the ref is attached immediately.
  // Show loading or error overlays on top of the container.
  return (
    <div style={{ width: '100%', height }} className="rounded-lg border border-gray-300 relative">
      <div
        id={containerIdRef.current}
        ref={mapRef}
        style={{ width: '100%', height }}
        className="w-full h-full"
      />

      {(!isLoaded || error) && (
        <div className="absolute inset-0 flex items-center justify-center">
          {error ? (
            <div className="rounded-lg border border-gray-300 bg-red-50 p-4 text-center">
              <p className="text-red-600 font-medium">Map Error</p>
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading map...</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Add TypeScript declarations for Leaflet
declare global {
  interface Window {
    L: any
  }
}
