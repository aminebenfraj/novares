import { useState, useEffect } from "react"
import { Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getCalls, formatTime } from "@/apis/logistic/callApi"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function CallNotifications() {
  const [pendingCalls, setPendingCalls] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPendingCalls()
    
    // Set up interval to refresh calls every 30 seconds
    const interval = setInterval(() => {
      fetchPendingCalls(true)
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchPendingCalls = async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      
      // Use the existing getCalls function with status filter
      const callsData = await getCalls({ status: "Pendiente" })
      
      // Sort by remaining time (ascending)
      const sortedCalls = callsData.sort((a, b) => a.remainingTime - b.remainingTime)
      
      setPendingCalls(sortedCalls)
    } catch (error) {
      console.error("Error fetching pending calls:", error)
    } finally {
      setLoading(false)
    }
  }

  // Get machine names for display
  const getMachineNames = (call) => {
    if (!call.machines || call.machines.length === 0) return "Máquina desconocida"
    return call.machines.map((machine) => machine.name).join(", ")
  }

  // Get urgency class based on remaining time
  const getUrgencyClass = (remainingTime) => {
    if (remainingTime <= 300) return "bg-red-500" // Less than 5 minutes
    if (remainingTime <= 900) return "bg-amber-500" // Less than 15 minutes
    return "bg-blue-500" // Otherwise
  }

  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative w-8 h-8">
                <Bell className="w-4 h-4" />
                {pendingCalls.length > 0 && (
                  <Badge 
                    className={`absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 p-2 text-xs text-white ${
                      pendingCalls.some(call => call.remainingTime <= 300) 
                        ? "bg-red-500 animate-pulse" 
                        : pendingCalls.some(call => call.remainingTime <= 900)
                          ? "bg-amber-500"
                          : "bg-blue-500"
                    }`}
                  >
                    {pendingCalls.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Llamadas pendientes</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Llamadas Pendientes</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <span className="text-sm text-muted-foreground">Cargando...</span>
          </div>
        ) : pendingCalls.length === 0 ? (
          <div className="p-4 text-center">
            <span className="text-sm text-muted-foreground">No hay llamadas pendientes</span>
          </div>
        ) : (
          pendingCalls.map((call) => (
            <DropdownMenuItem key={call._id} className="flex flex-col items-start p-3 cursor-default">
              <div className="flex items-center justify-between w-full">
                <span className="font-medium">{getMachineNames(call)}</span>
                <Badge className={`${getUrgencyClass(call.remainingTime)} text-white`}>
                  {formatTime(call.remainingTime)}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                Llamada: {new Date(call.callTime).toLocaleTimeString()}
              </span>
            </DropdownMenuItem>
          ))
        )}
        
        {pendingCalls.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="justify-center text-sm text-primary"
              onClick={() => window.location.href = '/call'}
            >
              Ver todas las llamadas
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
