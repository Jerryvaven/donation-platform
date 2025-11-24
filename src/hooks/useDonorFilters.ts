import { useState, useMemo } from 'react'
import type { Donor } from './useDonors'

export type SortOption = 'total_donated' | 'name' | 'created_at'
export type SortDirection = 'asc' | 'desc'

export const useDonorFilters = (donors: Donor[]) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('total_donated')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const states = useMemo(() => {
    const uniqueStates = new Set(donors.map(donor => donor.state).filter((state): state is string => Boolean(state)))
    return Array.from(uniqueStates).sort()
  }, [donors])

  const filteredAndSortedDonors = useMemo(() => {
    let filtered = donors.filter(donor => {
      const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesState = !selectedState || donor.state === selectedState
      return matchesSearch && matchesState
    })

    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'total_donated':
          // Map UI sort option 'total_donated' to actual donor field 'total_donated_value'
          aValue = a.total_donated_value
          bValue = b.total_donated_value
          break
        case 'created_at':
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [donors, searchTerm, selectedState, sortBy, sortDirection])

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(option)
      setSortDirection('desc')
    }
  }

  return {
    searchTerm,
    setSearchTerm,
    selectedState,
    setSelectedState,
    sortBy,
    sortDirection,
    states,
    filteredAndSortedDonors,
    handleSort
  }
}