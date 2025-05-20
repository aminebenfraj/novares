"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, Loader2, Clock } from 'lucide-react'
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
  const navigate = useNavigate()
  const timerRef = useRef(null)
  const lastFetchRef = useRef(Date.now())
  const pendingCallsCountRef = useRef(0)

  // Fetch calls with debounce to prevent excessive API calls
  const fetchCalls = async (force = false) => {
    // Don't fetch if we've fetched recently (within 10 seconds) unless forced
    const now = Date.now()
    if (!force && now - lastFetchRef.current < 10000) {
      return
    }
    
    lastFetchRef.current = now
    
    try {
      setLoading(true)
      const callsData = await getCalls({ status: "Pendiente" })
      
      // Check if we have new pending calls
      const pendingCallsCount = callsData.filter(call => call.status === "Pendiente").length
      if (pendingCallsCount > pendingCallsCountRef.current) {
        setHasNewCalls(true)
      }
      pendingCallsCountRef.current = pendingCallsCount
      
      setCalls(callsData)
    } catch (error) {
      console.error("Error fetching calls:", error)
    } finally {
      setLoading(false)
    }
  }

  // Update remaining time locally without API calls
  const updateRemainingTime = () => {
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
  }

  // Initial fetch and setup timers
  useEffect(() => {
    // Initial fetch
    fetchCalls(true)
    
    // Set up timer to update remaining time every second
    timerRef.current = setInterval(updateRemainingTime, 1000)
    
    // Set up interval to fetch new data every 30 seconds
    const fetchInterval = setInterval(() => fetchCalls(), 30000)
    
    return () => {
      clearInterval(timerRef.current)
      clearInterval(fetchInterval)
    }
  }, [])

  // Reset new calls indicator when popover is opened
  useEffect(() => {
    if (open) {
      setHasNewCalls(false)
    }
  }, [open])

  // Handle click on a call
  const handleCallClick = (callId) => {
    setOpen(false)
    navigate("/call")
  }

  // Get pending calls count
  const pendingCallsCount = calls.filter(call => call.status === "Pendiente").length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
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
                {pendingCallsCount}
              </Badge>
            </motion.div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="p-0 w-80">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-medium">Call Notifications</h3>
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        </div>
        <Separator />
        <div className="max-h-[300px] overflow-auto">
          <AnimatePresence>
            {calls.length > 0 ? (
              calls
                .filter(call => call.status === "Pendiente")
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
                          {call.machines && call.machines[0]?.name 
                            ? call.machines[0].name 
                            : "Machine Call"}
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
