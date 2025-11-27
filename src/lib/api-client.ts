// API client functions for making requests to the backend

const API_BASE = '/api'

export async function fetchDonors() {
  const response = await fetch(`${API_BASE}/donors`)
  if (!response.ok) {
    throw new Error('Failed to fetch donors')
  }
  return response.json()
}

export async function fetchProducts() {
  const response = await fetch(`${API_BASE}/products`)
  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }
  return response.json()
}

export async function fetchFireDepartments() {
  const response = await fetch(`${API_BASE}/fire-departments`)
  if (!response.ok) {
    throw new Error('Failed to fetch fire departments')
  }
  return response.json()
}

export async function fetchDonations(limit?: number) {
  const url = limit ? `${API_BASE}/donations?limit=${limit}` : `${API_BASE}/donations`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch donations')
  }
  return response.json()
}

export async function updateDonor(data: { id: string; name?: string; city?: string; state?: string; address?: string }) {
  const response = await fetch(`${API_BASE}/donors`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update donor')
  }
  
  return response.json()
}

export async function fetchStats() {
  const response = await fetch(`${API_BASE}/stats`)
  if (!response.ok) {
    throw new Error('Failed to fetch stats')
  }
  return response.json()
}

export async function fetchMonthlyData() {
  const response = await fetch(`${API_BASE}/monthly-data`)
  if (!response.ok) {
    throw new Error('Failed to fetch monthly data')
  }
  return response.json()
}

export async function fetchActivity(lastCheck?: string) {
  const url = lastCheck 
    ? `${API_BASE}/activity?lastCheck=${encodeURIComponent(lastCheck)}` 
    : `${API_BASE}/activity`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch activity')
  }
  return response.json()
}

export async function addDonation(data: {
  donorName: string
  city?: string
  state?: string
  address?: string
  productId: string
  quantity: number
  matched?: boolean
  fireDepartmentId?: string
}) {
  const response = await fetch(`${API_BASE}/donations/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to add donation')
  }
  
  return response.json()
}

export async function updateDonation(id: string, data: {
  product_id?: string
  quantity?: number
  donation_date?: string
  notes?: string
  matched?: boolean
  fire_department_id?: string
}) {
  const response = await fetch(`${API_BASE}/donations/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update donation')
  }
  
  return response.json()
}

export async function deleteDonation(id: string) {
  const response = await fetch(`${API_BASE}/donations/${id}`, {
    method: 'DELETE'
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete donation')
  }
  
  return response.json()
}

export async function addProduct(data: {
  name: string
  category: string
  value: number
  description?: string
  image_url?: string
}) {
  const response = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to add product')
  }
  
  return response.json()
}

export async function updateProduct(id: string, data: {
  name?: string
  category?: string
  value?: number
  description?: string
  image_url?: string
}) {
  const response = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update product')
  }
  
  return response.json()
}

export async function deleteProduct(id: string) {
  const response = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE'
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete product')
  }
  
  return response.json()
}

export async function addFireDepartment(data: {
  name: string
  city?: string
  county?: string
  address?: string
  latitude?: string
  longitude?: string
}) {
  const response = await fetch(`${API_BASE}/fire-departments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to add fire department')
  }
  
  return response.json()
}

export async function updateFireDepartment(id: string, data: {
  name?: string
  city?: string
  county?: string
  address?: string
  latitude?: string
  longitude?: string
}) {
  const response = await fetch(`${API_BASE}/fire-departments/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update fire department')
  }
  
  return response.json()
}

export async function deleteFireDepartment(id: string) {
  const response = await fetch(`${API_BASE}/fire-departments/${id}`, {
    method: 'DELETE'
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete fire department')
  }
  
  return response.json()
}

export async function fetchCoordinates(address: string) {
  const response = await fetch(`${API_BASE}/fire-departments/fetch-osm?address=${encodeURIComponent(address)}`)
  if (!response.ok) {
    throw new Error('Failed to fetch coordinates')
  }
  return response.json()
}

// Admin API functions
export async function fetchAdmins() {
  const response = await fetch(`${API_BASE}/admins`)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch admins')
  }
  return response.json()
}

export async function addAdminUser(data: { email: string; password: string }) {
  const response = await fetch(`${API_BASE}/admins/add-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to add admin user')
  }
  
  return response.json()
}

export async function deleteAdminUser(userId: string) {
  const response = await fetch(`${API_BASE}/admins/${userId}`, {
    method: 'DELETE'
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete admin user')
  }
  
  return response.json()
}
