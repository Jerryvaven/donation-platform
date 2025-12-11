'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { LatLngExpression } from 'leaflet';
import type { Donor, FireDepartment, ProductDonation } from '@/hooks/useDonors';
import { fetchFireDepartments } from '@/lib/api-client';
import { formatCurrency } from '@/lib/utils';
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
import 'leaflet/dist/leaflet.css';
interface FireStationWithDonations {
    fireDepartment: FireDepartment;
    donations: Array<{
        donorName: string;
        productName: string;
        productValue: number;
        quantity: number;
        donationDate: string;
    }>;
    totalValue: number;
}
const getFireStationCoordinates = (fireDept: FireDepartment): LatLngExpression | null => {
    if (fireDept.latitude && fireDept.longitude) {
        return [parseFloat(fireDept.latitude), parseFloat(fireDept.longitude)];
    }
    return null;
};
interface DonorMapProps {
    donors: Donor[];
    darkMode?: boolean;
}
export default function DonorMap({ donors, darkMode = false }: DonorMapProps) {
    const [isClient, setIsClient] = useState(false);
    const [allFireDepartments, setAllFireDepartments] = useState<FireDepartment[]>([]);
    const [redIcon, setRedIcon] = useState<any>(null);
    const [greenIcon, setGreenIcon] = useState<any>(null);
    useEffect(() => {
        const loadFireDepartments = async () => {
            try {
                const response = await fetchFireDepartments();
                if (response.data) {
                    setAllFireDepartments(response.data);
                }
            }
            catch (error) {
                console.log('Failed to fetch fire departments:', error);
            }
        };
        loadFireDepartments();
    }, []);
    useEffect(() => {
        setIsClient(true);
        if (typeof window !== 'undefined') {
            const L = require('leaflet');
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });
            const redMarkerIcon = new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
            const greenMarkerIcon = new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
            setRedIcon(redMarkerIcon);
            setGreenIcon(greenMarkerIcon);
        }
    }, []);
    if (!isClient) {
        return (<div className={`p-6 rounded-lg shadow-sm border ${darkMode ? 'bg-[#242424] border-[#333333]' : 'bg-white border-gray-200'}`}>
        <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Fire Station Locations Map
        </h3>
        <div className={`h-96 w-full rounded-lg flex items-center justify-center ${darkMode ? 'bg-[#1E1E1E]' : 'bg-gray-100'}`}>
          <span className={darkMode ? 'text-[#B3B3B3]' : 'text-gray-500'}>Loading map...</span>
        </div>
      </div>);
    }
    const fireStationsMap = new Map<string, FireStationWithDonations>();
    donors.forEach(donor => {
        donor.product_donations?.forEach(donation => {
            if (donation.fire_departments && donation.matched) {
                const fdId = donation.fire_departments.id;
                if (!fireStationsMap.has(fdId)) {
                    fireStationsMap.set(fdId, {
                        fireDepartment: donation.fire_departments,
                        donations: [],
                        totalValue: 0
                    });
                }
                const station = fireStationsMap.get(fdId)!;
                const productValue = donation.products?.value || 0;
                const totalValue = productValue * donation.quantity;
                station.donations.push({
                    donorName: donor.name,
                    productName: donation.products?.name || 'Unknown Product',
                    productValue: productValue,
                    quantity: donation.quantity,
                    donationDate: donation.donation_date
                });
                station.totalValue += totalValue;
            }
        });
    });
    const fireDepartmentsWithDonations = new Set(fireStationsMap.keys());
    const allFireStationsWithCoords = allFireDepartments
        .filter(fd => fd.latitude && fd.longitude)
        .map(fd => {
        const hasDonations = fireDepartmentsWithDonations.has(fd.id);
        return {
            fireDepartment: fd,
            hasDonations,
            donationInfo: hasDonations ? fireStationsMap.get(fd.id) : null
        };
    });
    const locationGroups: Record<string, typeof allFireStationsWithCoords> = {};
    allFireStationsWithCoords.forEach((station) => {
        const coordinates = getFireStationCoordinates(station.fireDepartment);
        if (!coordinates)
            return;
        const coordArray = coordinates as [
            number,
            number
        ];
        const key = `${coordArray[0]},${coordArray[1]}`;
        if (!locationGroups[key]) {
            locationGroups[key] = [];
        }
        locationGroups[key].push(station);
    });
    return (<div className={`p-6 rounded-lg shadow-sm border ${darkMode ? 'bg-[#242424] border-[#333333]' : 'bg-white border-gray-200'}`}>
      <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Fire Station Locations Map
      </h3>
      <div className="h-96 w-full rounded-lg overflow-hidden">
        <MapContainer center={[36.7783, -119.4179]} zoom={6} style={{ height: '100%', width: '100%' }}>
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
          {Object.entries(locationGroups)
            .filter(([coordKey, groupStations]) => groupStations.some(station => station.hasDonations))
            .map(([coordKey, groupStations]) => {
            const [latStr, lngStr] = coordKey.split(',');
            const coordinates: LatLngExpression = [parseFloat(latStr), parseFloat(lngStr)];
            const hasAnyDonations = groupStations.some(station => station.hasDonations);
            const icon = hasAnyDonations ? greenIcon : redIcon;
            const mainStation = groupStations[0];
            const totalStationsCount = groupStations.length;
            return (<Marker key={coordKey} position={coordinates} icon={icon}>
                <Popup>
                  <div className="text-sm max-w-64">
                    <div className="font-medium text-red-600 mb-1">{mainStation.fireDepartment.name}</div>
                    {totalStationsCount > 1 && (<div className="text-xs text-gray-500 mb-2">
                        (+{totalStationsCount - 1} more at this location)
                      </div>)}
                    <div className="text-xs text-gray-600 mb-2">
                      {mainStation.fireDepartment.city && mainStation.fireDepartment.county
                    ? `${mainStation.fireDepartment.city}, ${mainStation.fireDepartment.county}`
                    : mainStation.fireDepartment.county || mainStation.fireDepartment.city}
                    </div>
                    {mainStation.hasDonations && mainStation.donationInfo ? (<>
                        <div className="text-green-600 font-semibold mb-1">
                          Total Value: {formatCurrency(mainStation.donationInfo.totalValue, 2)}
                        </div>
                        <div className="text-xs space-y-1">
                          {mainStation.donationInfo.donations.slice(0, 3).map((donation, dIndex) => (<div key={dIndex} className="border-l-2 border-blue-400 pl-2">
                              <div className="font-medium">{donation.productName}</div>
                              <div className="text-gray-600">
                                From: {donation.donorName}
                              </div>
                              <div className="text-gray-600">
                                Qty: {donation.quantity} × {formatCurrency(donation.productValue, 2)}
                              </div>
                            </div>))}
                          {mainStation.donationInfo.donations.length > 3 && (<div className="text-gray-500 italic">
                              +{mainStation.donationInfo.donations.length - 3} more donation(s)
                            </div>)}
                        </div>
                      </>) : (<div className="text-gray-500 text-xs italic">
                        No donations yet
                      </div>)}
                  </div>
                </Popup>
              </Marker>);
        })}
        </MapContainer>
      </div>
      <div className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
        Showing {Object.entries(locationGroups).filter(([coordKey, groupStations]) => groupStations.some(station => station.hasDonations)).length} locations with donations
        <div className="mt-1 flex gap-4">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
            Fire stations with donations ({allFireStationsWithCoords.filter(s => s.hasDonations).length})
          </span>
        </div>
      </div>
    </div>);
}
