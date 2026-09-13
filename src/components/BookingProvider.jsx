import { createContext, useContext, useMemo, useState } from 'react'
import BookingModal, { hasBooking } from './BookingModal'

/**
 * One booking dialog for the whole app.
 *
 * The header sits outside the router, so the modal cannot live on the contact
 * page if a button in the bar is to open it from anywhere. Mounting it once here
 * also means there is only ever a single instance, rather than one per page that
 * happens to want one.
 */
const BookingContext = createContext({ openBooking: () => {}, bookingAvailable: false })

export function useBooking() {
  return useContext(BookingContext)
}

export default function BookingProvider({ children }) {
  const [open, setOpen] = useState(false)

  const value = useMemo(
    () => ({ openBooking: () => setOpen(true), bookingAvailable: hasBooking() }),
    []
  )

  return (
    <BookingContext.Provider value={value}>
      {children}
      <BookingModal open={open} onClose={() => setOpen(false)} />
    </BookingContext.Provider>
  )
}
