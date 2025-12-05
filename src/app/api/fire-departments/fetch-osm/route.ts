import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')

    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter is required' },
        { status: 400 }
      )
    }

    // Use OpenStreetMap Nominatim API for geocoding
    const encodedAddress = encodeURIComponent(address)
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`

    const response = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'Donation-Platform/1.0'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch from Nominatim API')
    }

    const data = await response.json()

    if (data.length === 0) {
      return NextResponse.json(
        { error: 'No coordinates found for this address' },
        { status: 404 }
      )
    }

    const result = data[0]
    const coordinates = {
      latitude: result.lat,
      longitude: result.lon,
      display_name: result.display_name
    }

    return NextResponse.json({ data: coordinates })
  } catch (error: any) {
    console.log('Exception in fetch-osm API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
