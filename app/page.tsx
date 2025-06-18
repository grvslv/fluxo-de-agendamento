"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TimeSlotPicker } from "@/components/time-slot-picker"
import { AppointmentForm } from "@/components/appointment-form"
import { AppointmentsList } from "@/components/appointments-list"
import { formatDate, isWeekend } from "@/utils/time-slots"
import { CalendarDays, Users } from "lucide-react"

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>()
  const [currentStep, setCurrentStep] = useState<"date" | "time" | "form">("date")
  const [activeTab, setActiveTab] = useState("schedule")

  const handleDateSelect = (date: Date | undefined) => {
    if (date && !isWeekend(date)) {
      setSelectedDate(date)
      setCurrentStep("time")
      setSelectedTime(undefined)
    }
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setCurrentStep("form")
  }

  const handleAppointmentSuccess = () => {
    setCurrentStep("date")
    setSelectedDate(undefined)
    setSelectedTime(undefined)
    setActiveTab("appointments")
  }

  const resetFlow = () => {
    setCurrentStep("date")
    setSelectedDate(undefined)
    setSelectedTime(undefined)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Sistema de Agendamento</h1>
          <p className="text-lg text-gray-600">Agende seus compromissos de forma rápida e fácil</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Novo Agendamento
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Meus Agendamentos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-6">
            {/* Indicador de Progresso */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`flex items-center gap-2 ${currentStep === "date" ? "text-blue-600" : currentStep === "time" || currentStep === "form" ? "text-green-600" : "text-gray-400"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === "date" ? "bg-blue-100" : currentStep === "time" || currentStep === "form" ? "bg-green-100" : "bg-gray-100"}`}
                    >
                      1
                    </div>
                    <span>Escolher Data</span>
                  </div>

                  <div
                    className={`flex items-center gap-2 ${currentStep === "time" ? "text-blue-600" : currentStep === "form" ? "text-green-600" : "text-gray-400"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === "time" ? "bg-blue-100" : currentStep === "form" ? "bg-green-100" : "bg-gray-100"}`}
                    >
                      2
                    </div>
                    <span>Escolher Horário</span>
                  </div>

                  <div
                    className={`flex items-center gap-2 ${currentStep === "form" ? "text-blue-600" : "text-gray-400"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === "form" ? "bg-blue-100" : "bg-gray-100"}`}
                    >
                      3
                    </div>
                    <span>Confirmar Dados</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seleção de Data */}
            {currentStep === "date" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    Escolha uma Data
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Selecione o dia desejado para seu agendamento (não atendemos aos finais de semana)
                  </p>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => date < new Date() || isWeekend(date)}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
            )}

            {/* Seleção de Horário */}
            {currentStep === "time" && selectedDate && (
              <div className="space-y-4">
                <Button variant="outline" onClick={resetFlow}>
                  ← Voltar para seleção de data
                </Button>
                <TimeSlotPicker
                  selectedDate={formatDate(selectedDate)}
                  onTimeSelect={handleTimeSelect}
                  selectedTime={selectedTime}
                />
                {selectedTime && (
                  <div className="flex justify-end">
                    <Button onClick={() => setCurrentStep("form")}>Continuar para dados pessoais →</Button>
                  </div>
                )}
              </div>
            )}

            {/* Formulário de Agendamento */}
            {currentStep === "form" && selectedDate && selectedTime && (
              <div className="space-y-4">
                <Button variant="outline" onClick={() => setCurrentStep("time")}>
                  ← Voltar para seleção de horário
                </Button>
                <AppointmentForm
                  selectedDate={formatDate(selectedDate)}
                  selectedTime={selectedTime}
                  onSuccess={handleAppointmentSuccess}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="appointments">
            <AppointmentsList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
