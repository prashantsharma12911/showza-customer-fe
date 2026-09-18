export interface Ref {
  id: number
}

export type SeatType = 'REGULAR' | 'GOLD' | 'PREMIUM'
export type PriceTier = 'REGULAR' | 'PREMIUM' | 'WEEKEND'
export type ShowSeatStatus = 'AVAILABLE' | 'BOOKED'
export type Role = 'ADMIN' | 'CUSTOMER'
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'
export type PaymentStatus = 'PASS' | 'FAILED' | 'PENDING' | 'REFUNDED'

export interface City {
  id: number
  name: string
  state: string
  country: string
}

export interface Actor {
  id: number
  name: string
  description?: string
  profileImage?: string
}

export interface Movie {
  id: number
  name: string
  description?: string
  rating?: number
  duration: number
  actor: Actor
  banner?: string
}

export interface EventVenue {
  id: number
  venueName: string
  address: string
  city: City
}

export interface Screen {
  id: number
  eventVenue: EventVenue
  name: string
}

export interface Seat {
  id: number
  screen: Screen
  row: number
  col: number
  type: SeatType
}

export interface MovieShow {
  id: number
  movie: Movie
  screen: Screen
  startTime: string
  endTime: string
  startDate: string
}

export interface ShowSeat {
  id: number
  movieShow: MovieShow
  seat: Seat
  priceTier: PriceTier
  price: number
  status: ShowSeatStatus
}

export interface User {
  id: number
  name: string
  email: string
  phone?: string
  role: Role
}

export interface Offer {
  id: number
  code: string
  discountPercent?: number
  flatDiscount?: number
  maxDiscount?: number
  validFrom: string
  validTill: string
  createdBy: User
}

export interface BookingDetails {
  id: number
  user: User
  movieShow: MovieShow
  offer?: Offer
  status: BookingStatus
  amount: number
  showSeat: ShowSeat
  payment?: PaymentDetails
}

export interface PaymentDetails {
  id: number
  booking: Ref
  amount: number
  status: PaymentStatus
}

export interface ShowSeatInput {
  movieShow: Ref
  seat: Ref
  priceTier: PriceTier
  price: number
  status: ShowSeatStatus
}

export interface BookingInput {
  user: Ref
  movieShow: Ref
  showSeat: Ref
  offer?: Ref
  status: BookingStatus
  amount: number
}

export interface PaymentInput {
  booking: Ref
  amount: number
  status: PaymentStatus
}

export interface UserInput {
  name: string
  email: string
  phone?: string
  role: Role
}
