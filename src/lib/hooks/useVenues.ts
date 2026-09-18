import { useQuery } from '@tanstack/react-query'
import { venuesApi } from '@/lib/api/resources'

export function useVenues() {
  return useQuery({ queryKey: ['venues'], queryFn: venuesApi.list })
}
