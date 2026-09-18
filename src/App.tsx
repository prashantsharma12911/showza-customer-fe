import { Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { BookingConfirmedPage } from '@/pages/BookingConfirmedPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { HomePage } from '@/pages/HomePage'
import { MovieDetailsPage } from '@/pages/MovieDetailsPage'
import { MyBookingsPage } from '@/pages/MyBookingsPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { SeatSelectionPage } from '@/pages/SeatSelectionPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies/:id" element={<MovieDetailsPage />} />
        <Route path="/shows/:showId/seats" element={<SeatSelectionPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/bookings/confirmed" element={<BookingConfirmedPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}

export default App
