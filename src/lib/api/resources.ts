import { apiClient } from './client'
import type {
  BookingDetails,
  BookingInput,
  City,
  EventVenue,
  Movie,
  MovieShow,
  PaymentDetails,
  PaymentInput,
  Ref,
  Screen,
  Seat,
  ShowSeat,
  ShowSeatInput,
  User,
  UserInput,
} from './types'

function crud<T, TInput = Partial<T>>(path: string) {
  return {
    list: async () => (await apiClient.get<T[]>(path)).data,
    get: async (id: number) => (await apiClient.get<T>(`${path}/${id}`)).data,
    create: async (payload: TInput) => (await apiClient.post<T>(path, payload)).data,
    update: async (id: number, payload: TInput) =>
      (await apiClient.put<T>(`${path}/${id}`, payload)).data,
    remove: async (id: number) => {
      await apiClient.delete(`${path}/${id}`)
    },
  }
}

export const moviesApi = crud<Movie>('/movies')
export const citiesApi = crud<City>('/cities')
export const venuesApi = crud<EventVenue>('/venues')
export const screensApi = crud<Screen>('/screens')
export const seatsApi = crud<Seat>('/seats')
export const movieShowsApi = crud<MovieShow>('/movie-shows')
export const showSeatsApi = crud<ShowSeat, ShowSeatInput>('/show-seats')
export const bookingsApi = crud<BookingDetails, BookingInput>('/bookings')
export const paymentsApi = crud<PaymentDetails, PaymentInput>('/payments')
export const usersApi = crud<User, UserInput>('/users')

export function ref(id: number): Ref {
  return { id }
}
