import { useQuery } from '@tanstack/react-query'
import { citiesApi } from '@/lib/api/resources'

export function useCities() {
  return useQuery({ queryKey: ['cities'], queryFn: citiesApi.list })
}
