"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Bell, Loader2, Clock, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatTime, calculateProgress } from "@/apis/logistic/callApi"
import { Progress } from "@/components/ui/progress"
import { useNavigate } from "react-router-dom"
import { getCalls } from "@/apis/logistic/callApi"

export function CallNotifications() {
  const [calls, setCalls] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [hasNewCalls, setHasNewCalls] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('connecting')
  const navigate = useNavigate()
  const wsRef = useRef(null)
  const lastFetchRef = useRef(Date.now())
  const pendingCallsCountRef = useRef(0)

  // Process incoming calls data
  const processCallsData = useCallback((callsData) => {
    const pendingCalls = callsData.filter(call => call.status === "Pendiente")
    
    // Check if we have new pending calls
    if (pendingCalls.length > pendingCallsCountRef.current) {
      setHasNewCalls(true)
      
      // Play notification sound if not focused or popover is closed
      if (!document.hasFocus() || !open) {
        playNotificationSound()
      }
    }
    
    pendingCallsCountRef.current = pendingCalls.length
    setCalls(callsData)
  }, [open])

  // Play a subtle notification sound
  const playNotificationSound = () => {
    const audio = new Audio('/notification.mp3') // Add a short notification sound file
    audio.volume = 0.3
    audio.play().catch(e => console.log("Audio play failed:", e))
  }

  // Fetch calls with debounce
  const fetchCalls = useCallback(async (force = false) => {
    // Don't fetch if we've fetched recently (within 15 seconds) unless forced
    const now = Date.now()
    if (!force && now - lastFetchRef.current < 15000) {
      return
    }
    
    lastFetchRef.current = now
    
    try {
      setLoading(true)
      const callsData = await getCalls({ status: "Pendiente" })
      processCallsData(callsData)
    } catch (error) {
      console.error("Error fetching calls:", error)
      setConnectionStatus('error')
    } finally {
      setLoading(false)
    }
  }, [processCallsData])

  // Initialize WebSocket connection
  const initWebSocket = useCallback(() => {
    if (wsRef.current) return

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.host
    const wsUrl = `${protocol}//${host}/ws/calls`
    
    try {
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        setConnectionStatus('connected')
        console.log('WebSocket connected')
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.type === 'call-update') {
          setCalls(prev => {
            const existingIndex = prev.findIndex(c => c._id === data.call._id)
            if (existingIndex >= 0) {
              const updated = [...prev]
              updated[existingIndex] = data.call
              return updated
            }
            return [data.call, ...prev]
          })
          
          if (data.call.status === "Pendiente") {
            setHasNewCalls(true)
            if (!document.hasFocus() || !open) {
              playNotificationSound()
            }
          }
        }
      }

      ws.onclose = () => {
        setConnectionStatus('disconnected')
        console.log('WebSocket disconnected')
        // Attempt reconnect after delay
        setTimeout(initWebSocket, 5000)
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setConnectionStatus('error')
        ws.close()
      }
    } catch (error) {
      console.error('WebSocket initialization error:', error)
      setConnectionStatus('error')
    }
  }, [open])

  // Update remaining time locally
  const updateRemainingTime = useCallback(() => {
    setCalls(prevCalls => {
      return prevCalls.map(call => {
        if (call.status === "Pendiente" && call.remainingTime > 0) {
          return {
            ...call,
            remainingTime: call.remainingTime - 1
          }
        }
        return call
      })
    })
  }, [])

  // Initial setup
  useEffect(() => {
    // Initial fetch
    fetchCalls(true)
    
    // Initialize WebSocket
    initWebSocket()
    
    // Set up timer to update remaining time every second
    const timeUpdateInterval = setInterval(updateRemainingTime, 1000)
    
    // Set up polling as fallback every 30 seconds
    const pollInterval = setInterval(() => {
      if (connectionStatus !== 'connected') {
        fetchCalls()
      }
    }, 30000)
    
    // Handle visibility changes to refresh when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchCalls(true)
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
      clearInterval(timeUpdateInterval)
      clearInterval(pollInterval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [fetchCalls, initWebSocket, updateRemainingTime, connectionStatus])

  // Reset new calls indicator when popover is opened
  useEffect(() => {
    if (open) {
      setHasNewCalls(false)
      // Refresh data when opening
      fetchCalls(true)
    }
  }, [open, fetchCalls])

  const handleCallClick = (callId) => {
    setOpen(false)
    navigate(`/call/${callId}`) // Navigate to specific call
  }

  const pendingCalls = calls.filter(call => call.status === "Pendiente")
  const pendingCallsCount = pendingCalls.length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <div className="relative">
            <Bell className="w-5 h-5" />
            {connectionStatus === 'error' && (
              <AlertCircle className="absolute -top-1 -right-1 w-3 h-3 text-red-500" />
            )}
          </div>
          {pendingCallsCount > 0 && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-1 -right-1"
            >
              <Badge 
                variant="destructive" 
                className={`flex items-center justify-center w-5 h-5 p-0 text-xs rounded-full ${hasNewCalls ? 'animate-pulse' : ''}`}
              >
                {pendingCallsCount > 9 ? '9+' : pendingCallsCount}
              </Badge>
            </motion.div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="p-0 w-80">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">Call Notifications</h3>
            {connectionStatus === 'connected' && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            )}
            {connectionStatus === 'error' && (
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
            )}
          </div>
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        </div>
        <Separator />
        <div className="max-h-[300px] overflow-auto">
          <AnimatePresence>
            {pendingCalls.length > 0 ? (
              pendingCalls
                .sort((a, b) => a.remainingTime - b.remainingTime) // Sort by urgency
                .map((call, index) => (
                  <motion.div
                    key={call._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3 border-b cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800/50"
                    onClick={() => handleCallClick(call._id)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">
                          {call.machines?.[0]?.name || "Machine Call"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(call.callTime).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1 text-amber-500" />
                        <span className="text-xs font-medium">
                          {formatTime(call.remainingTime)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Progress 
                        value={calculateProgress(call.remainingTime, call.duration)} 
                        className="h-1.5"
                        indicatorClassName={
                          call.remainingTime < 300 
                            ? "bg-red-500" 
                            : call.remainingTime < 900 
                              ? "bg-amber-500" 
                              : "bg-emerald-500"
                        }
                      />
                    </div>
                  </motion.div>
                ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>No active calls</p>
              </div>
            )}
          </AnimatePresence>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-zinc-800/50">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => {
              setOpen(false)
              navigate("/call")
            }}
          >
            View All Calls
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}