"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { generateTimeSlots, formatDisplayDate } from "@/utils/time-slots"
import { useAppointments } from "@/hooks/use-appointments"

interface TimeSlotPickerProps {
  selectedDate: string
  onTimeSelect: (time: string) => void
  selectedTime?: string
}

export function TimeSlotPicker({ selectedDate, onTimeSelect, selectedTime }: TimeSlotPickerProps) {
  const { appointments } = useAppointments()

  const availableSlots = useMemo(() => {
    const allSlots = generateTimeSlots()
    const bookedAppointments = appointments.filter((apt) => apt.date === selectedDate)
    const bookedTimes = bookedAppointments.map((apt) => apt.time)

    return allSlots.map((slot) => ({
      ...slot,
      available: !bookedTimes.includes(slot.time),
    }))
  }, [selectedDate, appointments])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Horários Disponíveis</CardTitle>
        <p className="text-sm text-muted-foreground">{formatDisplayDate(selectedDate)}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {availableSlots.map((slot) => (
            <Button
              key={slot.time}
              variant={selectedTime === slot.time ? "default" : "outline"}
              disabled={!slot.available}
              onClick={() => onTimeSelect(slot.time)}
              className="h-10"
            >
              {slot.time}
            </Button>
          ))}
        </div>
        {availableSlots.filter((slot) => slot.available).length === 0 && (
          <p className="text-center text-muted-foreground mt-4">Não há horários disponíveis para esta data.</p>
        )}
      </CardContent>
    </Card>
  )
}
