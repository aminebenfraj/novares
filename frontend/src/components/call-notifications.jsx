"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, Loader2, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatTime, calculateProgress } from "@/apis/logistic/callApi";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { getCalls } from "@/apis/logistic/callApi";
import io from "socket.io-client";
import { jwtDecode } from "jwt-decode";

// Utility to format timestamp
const getTimestamp = () => new Date().toISOString();

// Singleton Socket.IO instance
let socketInstance = null;

const initializeSocket = () => {
  if (socketInstance) {
    console.log(`[${getTimestamp()}] Socket.IO already initialized`);
    return socketInstance;
  }

  const token = localStorage.getItem("accessToken");
  console.log(`[${getTimestamp()}] Socket.IO auth token:`, token ? `${token.slice(0, 10)}...` : "Missing");

  if (!token) {
    console.error(`[${getTimestamp()}] No access token found for Socket.IO connection`);
    return null;
  }

  let decoded;
  try {
    decoded = jwtDecode(token);
    console.log(`[${getTimestamp()}] Decoded JWT:`, {
      userId: decoded.id,
      roles: decoded.roles,
      exp: new Date(decoded.exp * 1000).toISOString(),
    });
  } catch (error) {
    console.error(`[${getTimestamp()}] Failed to decode JWT:`, {
      message: error.message,
      stack: error.stack,
    });
    return null;
  }

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  console.log(`[${getTimestamp()}] Connecting to Socket.IO at:`, apiUrl, {
    transports: ["websocket"],
    reconnectionAttempts: 5,
    path: "/socket.io",
  });

  socketInstance = io(apiUrl, {
    auth: { token },
    transports: ["websocket"],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    path: "/socket.io",
  });

  socketInstance.on("connect", () => {
    console.log(`[${getTimestamp()}] Socket.IO connected`);
    // Dynamically determine the room based on user roles
    const userRole = decoded.roles.includes("LOGISTICA") ? "LOGISTICA" : decoded.roles.includes("PRODUCCION") ? "PRODUCCION" : null;
    if (userRole) {
      socketInstance.emit("join", { role: userRole });
      console.log(`[${getTimestamp()}] Emitted join event for ${userRole} room`);
    } else {
      console.error(`[${getTimestamp()}] User has no relevant role for joining a room`, decoded.roles);
    }
  });

  socketInstance.on("disconnect", (reason) => {
    console.warn(`[${getTimestamp()}] Socket.IO disconnected:`, { reason });
  });

  socketInstance.on("reconnect_attempt", (attempt) => {
    console.log(`[${getTimestamp()}] Socket.IO reconnect attempt:`, attempt);
  });

  socketInstance.on("connect_error", (error) => {
    console.error(`[${getTimestamp()}] Socket.IO connection error:`, {
      message: error.message,
      type: error.type,
      description: error.description,
      context: error.context,
      stack: error.stack,
      headers: error.headers,
    });
  });

  socketInstance.on("error", (error) => {
    console.error(`[${getTimestamp()}] Socket.IO general error:`, {
      message: error.message,
      stack: error.stack,
    });
  });

  return socketInstance;
};

export function CallNotifications() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [hasNewCalls, setHasNewCalls] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const navigate = useNavigate();
  const lastFetchRef = useRef(Date.now());
  const pendingCallsCountRef = useRef(0);
  const isMountedRef = useRef(false);

  const processCallsData = useCallback((callsData) => {
    const pendingCalls = callsData.filter(call => call.status === "Pendiente");
    console.log(`[${getTimestamp()}] Processing calls: ${pendingCalls.length} pending calls`);

    if (pendingCalls.length > pendingCallsCountRef.current) {
      setHasNewCalls(true);
      if (!document.hasFocus() || !open) {
        playNotificationSound();
      }
    }

    pendingCallsCountRef.current = pendingCalls.length;
    setCalls(callsData);
  }, [open]);

  const playNotificationSound = () => {
    console.log(`[${getTimestamp()}] Playing notification sound`);
    const audio = new Audio('/notification.mp3');
    audio.volume = 0.3;
    audio.play().catch(e => console.error(`[${getTimestamp()}] Audio play failed:`, e.message));
  };

  const fetchCalls = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && now - lastFetchRef.current < 15000) {
      console.log(`[${getTimestamp()}] Skipping fetch: within 15s cooldown`);
      return;
    }

    lastFetchRef.current = now;

    try {
      setLoading(true);
      console.log(`[${getTimestamp()}] Fetching calls with filters:`, { status: "Pendiente" });
      const callsData = await getCalls({ status: "Pendiente" });
      processCallsData(callsData);
    } catch (error) {
      console.error(`[${getTimestamp()}] Error fetching calls:`, {
        message: error.message,
        stack: error.stack,
      });
      setConnectionStatus('error');
    } finally {
      setLoading(false);
    }
  }, [processCallsData]);

  useEffect(() => {
    if (!isMountedRef.current) {
      console.log(`[${getTimestamp()}] Initializing CallNotifications component`);
      isMountedRef.current = true;

      // Initialize Socket.IO and set up event listeners
      const socket = initializeSocket();
      if (socket) {
        setConnectionStatus(socket.connected ? 'connected' : 'disconnected');

        socket.on("connect", () => {
          setConnectionStatus('connected');
        });

        socket.on("disconnect", () => {
          setConnectionStatus('disconnected');
        });

        socket.on("call-update", (data) => {
          console.log(`[${getTimestamp()}] Received call-update:`, {
            type: data.type,
            callId: data.call?._id,
            status: data.call?.status,
          });
          if (data.type === 'call-update') {
            setCalls(prev => {
              const existingIndex = prev.findIndex(c => c._id === data.call._id);
              if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = data.call;
                console.log(`[${getTimestamp()}] Updated existing call:`, data.call._id);
                return updated;
              }
              console.log(`[${getTimestamp()}] Added new call:`, data.call._id);
              return [data.call, ...prev];
            });

            if (data.call.status === "Pendiente") {
              setHasNewCalls(true);
              if (!document.hasFocus() || !open) {
                playNotificationSound();
              }
            }
          }
        });
      }

      fetchCalls(true);
    }

    const timeUpdateInterval = setInterval(() => {
      setCalls(prevCalls => {
        return prevCalls.map(call => {
          if (call.status === "Pendiente" && call.remainingTime > 0) {
            return {
              ...call,
              remainingTime: call.remainingTime - 1,
            };
          }
          return call;
        });
      });
    }, 1000);

    const pollInterval = setInterval(() => {
      if (connectionStatus !== 'connected') {
        console.log(`[${getTimestamp()}] Polling calls due to disconnected status`);
        fetchCalls();
      }
    }, 30000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log(`[${getTimestamp()}] Page visible, forcing call fetch`);
        fetchCalls(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      console.log(`[${getTimestamp()}] Cleaning up CallNotifications component`);
      clearInterval(timeUpdateInterval);
      clearInterval(pollInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Do not disconnect socket here; let it persist
    };
  }, [fetchCalls, open, connectionStatus]);

  useEffect(() => {
    if (open) {
      console.log(`[${getTimestamp()}] Popover opened, resetting new calls and fetching`);
      setHasNewCalls(false);
      fetchCalls(true);
    }
  }, [open, fetchCalls]);

  const handleCallClick = (callId) => {
    console.log(`[${getTimestamp()}] Navigating to call:`, callId);
    setOpen(false);
    navigate(`/call/${callId}`);
  };

  const pendingCalls = calls.filter(call => call.status === "Pendiente");
  const pendingCallsCount = pendingCalls.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <div className="relative">
            <Bell className="w-5 h-5" />
            {connectionStatus === 'error' && (
              <AlertCircle className="absolute w-3 h-3 text-red-500 -top-1 -right-1" />
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
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </div>
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        </div>
        <Separator />
        <div className="max-h-[300px] overflow-auto">
          <AnimatePresence>
            {pendingCalls.length > 0 ? (
              pendingCalls
                .sort((a, b) => a.remainingTime - b.remainingTime)
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
              setOpen(false);
              navigate("/call");
            }}
          >
            View All Calls
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}