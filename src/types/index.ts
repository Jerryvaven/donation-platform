// Shared types for the donation platform

export interface Product {
  id: string
  name: string
  category: string
  value: number
  description?: string
}

export interface FireDepartment {
  id: string
  name: string
  city?: string
  county?: string
  address?: string
  latitude?: string
  longitude?: string
}

export interface ProductDonation {
  id: string
  donor_id: string
  product_id: string
  fire_department_id?: string
  quantity: number
  donation_date: string
  matched: boolean
  status: string
  notes?: string
  created_at: string
  products?: Product
  fire_departments?: FireDepartment
}

export interface Donor {
  id: string
  name: string
  total_donated_value: number
  total_products_donated: number
  city?: string
  county?: string
  address?: string
  latitude?: string
  longitude?: string
  created_at: string
  updated_at?: string
  product_donations?: ProductDonation[]
}

export interface DashboardStats {
  totalDonatedValue: number
  totalProductsDonated: number
  totalDonors: number
  matchedProducts: number
  saunaDonated: number
  coldPlungeDonated: number
  fireDepartmentsReached: number
  todaysProducts: number
  newDonorsToday: number
  matchRate: number
}

export interface RecentProductDonation {
  id: string
  donorId: string
  donorName: string
  productName: string
  productValue: number
  fireDepartmentName: string
  city: string
  county: string
  date: string
  status: 'MATCHED' | 'PENDING'
}

export interface ActivityItem {
  id: string
  type: 'donation' | 'match' | 'update' | 'goal'
  message: string
  timestamp: string
  icon: string
  color: string
}

export interface MonthlyData {
  month: string
  donations: number
  matched: number
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}
