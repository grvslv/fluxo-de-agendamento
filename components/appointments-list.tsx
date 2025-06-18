"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useAppointments } from "@/hooks/use-appointments"
import { formatDisplayDate } from "@/utils/time-slots"
import { Calendar, Clock, Mail, Phone, User, Trash2, Eye } from "lucide-react"
import type { Appointment } from "@/types/appointment"

export function AppointmentsList() {
  const { appointments, deleteAppointment, updateAppointment } = useAppointments()
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`)
      const dateB = new Date(`${b.date}T${b.time}`)
      return dateA.getTime() - dateB.getTime()
    })
  }, [appointments])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmado"
      case "pending":
        return "Pendente"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum agendamento encontrado.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Meus Agendamentos</h2>

      {sortedAppointments.map((appointment) => (
        <Card key={appointment.id}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{appointment.name}</span>
                  <Badge className={getStatusColor(appointment.status)}>{getStatusText(appointment.status)}</Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDisplayDate(appointment.date)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {appointment.time}
                  </div>
                </div>

                <p className="text-sm font-medium">{appointment.service}</p>
              </div>

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedAppointment(appointment)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Detalhes do Agendamento</DialogTitle>
                    </DialogHeader>
                    {selectedAppointment && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Nome</Label>
                            <p className="font-medium">{selectedAppointment.name}</p>
                          </div>
                          <div>
                            <Label>Status</Label>
                            <Badge className={getStatusColor(selectedAppointment.status)}>
                              {getStatusText(selectedAppointment.status)}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Data</Label>
                            <p>{formatDisplayDate(selectedAppointment.date)}</p>
                          </div>
                          <div>
                            <Label>Horário</Label>
                            <p>{selectedAppointment.time}</p>
                          </div>
                        </div>

                        <div>
                          <Label>Serviço</Label>
                          <p>{selectedAppointment.service}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>E-mail</Label>
                            <p className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {selectedAppointment.email}
                            </p>
                          </div>
                          <div>
                            <Label>Telefone</Label>
                            <p className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {selectedAppointment.phone}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                          {selectedAppointment.status === "confirmed" && (
                            <Button
                              variant="outline"
                              onClick={() => {
                                updateAppointment(selectedAppointment.id, { status: "cancelled" })
                                setSelectedAppointment(null)
                              }}
                            >
                              Cancelar Agendamento
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteAppointment(appointment.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-sm font-medium text-muted-foreground">{children}</span>
}
