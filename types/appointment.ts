export interface Appointment {
  id: string
  name: string
  email: string
  phone: string
  service: string
  date: string
  time: string
  status: "confirmed" | "pending" | "cancelled"
  createdAt: string
}

export interface TimeSlot {
  time: string
  available: boolean
}
