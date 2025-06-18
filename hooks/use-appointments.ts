"use client"

import { useState, useEffect, useCallback } from "react"
import type { Appointment } from "@/types/appointment"

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("appointments")
    if (stored) {
      setAppointments(JSON.parse(stored))
    }
  }, [])

  const saveAppointments = useCallback((newAppointments: Appointment[]) => {
    setAppointments(newAppointments)
    localStorage.setItem("appointments", JSON.stringify(newAppointments))
  }, [])

  const addAppointment = useCallback(
    (appointment: Omit<Appointment, "id" | "createdAt">) => {
      const newAppointment: Appointment = {
        ...appointment,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }
      const updated = [...appointments, newAppointment]
      saveAppointments(updated)
      return newAppointment
    },
    [appointments, saveAppointments],
  )

  const updateAppointment = useCallback(
    (id: string, updates: Partial<Appointment>) => {
      const updated = appointments.map((apt) => (apt.id === id ? { ...apt, ...updates } : apt))
      saveAppointments(updated)
    },
    [appointments, saveAppointments],
  )

  const deleteAppointment = useCallback(
    (id: string) => {
      const updated = appointments.filter((apt) => apt.id !== id)
      saveAppointments(updated)
    },
    [appointments, saveAppointments],
  )

  const getAppointmentsByDate = useCallback(
    (date: string) => {
      return appointments.filter((apt) => apt.date === date)
    },
    [appointments],
  )

  return {
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentsByDate,
  }
}
