'use client';

import { useState, useEffect } from 'react';

interface Ride {
  id: number;
  date: Date;
  time: string;
  pickup: string;
  destination: string;
  customerName: string;
  price: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

interface NewRide {
  date: string;
  time: string;
  pickup: string;
  destination: string;
  customerName: string;
  price: string;
  status: 'scheduled';
}

export default function PlanningContent() {
  const [selectedDate] = useState(new Date());
  const [openDialog, setOpenDialog] = useState(false);
  const [rides, setRides] = useState<Ride[]>([]);
  const [newRide, setNewRide] = useState<NewRide>({
    date: '',
    time: '',
    pickup: '',
    destination: '',
    customerName: '',
    price: '',
    status: 'scheduled'
  });

  useEffect(() => {
    // Mock data load
    setRides([
      {
        id: 1,
        date: new Date(),
        time: '09:00',
        pickup: 'Paris CDG',
        destination: '16e Arrondissement',
        customerName: 'M. Dupont',
        price: 85.50,
        status: 'scheduled'
      },
      {
        id: 2,
        date: new Date(Date.now() + 86400000),
        time: '14:30',
        pickup: 'Gare du Nord',
        destination: 'La Défense',
        customerName: 'Mme Martin',
        price: 45.00,
        status: 'scheduled'
      },
      {
        id: 3,
        date: new Date(Date.now() + 2 * 86400000),
        time: '11:15',
        pickup: 'Orly Airport',
        destination: 'Champs-Élysées',
        customerName: 'M. Bernard',
        price: 75.00,
        status: 'in_progress'
      }
    ]);
  }, []);

  const handleAddRide = () => {
    setOpenDialog(true);
    setNewRide({
      date: selectedDate.toISOString().split('T')[0],
      time: '',
      pickup: '',
      destination: '',
      customerName: '',
      price: '',
      status: 'scheduled'
    });
  };

  const handleSaveRide = () => {
    if (!newRide.time || !newRide.pickup || !newRide.destination || !newRide.customerName || !newRide.price) {
      return;
    }

    const ride: Ride = {
      ...newRide,
      id: rides.length + 1,
      date: new Date(newRide.date),
      price: parseFloat(newRide.price)
    };
    setRides([...rides, ride]);
    setOpenDialog(false);
  };

  const handleDeleteRide = (rideId: number) => {
    setRides(rides.filter(ride => ride.id !== rideId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Planifiée';
      case 'in_progress':
        return 'En cours';
      case 'completed':
        return 'Terminée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  const todayRides = rides.filter(ride => 
    ride.date.toDateString() === new Date().toDateString()
  );

  const upcomingRides = rides.filter(ride => 
    ride.date.toDateString() !== new Date().toDateString() && ride.date > new Date()
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">📅 Planning</h1>
          <button 
            onClick={handleAddRide}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            ➕ Nouvelle course
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">📅</span>
              </div>
              <h3 className="text-lg font-semibold">Aujourd&apos;hui</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{todayRides.length}</p>
            <p className="text-blue-600 text-sm">courses planifiées</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">🚗</span>
              </div>
              <h3 className="text-lg font-semibold">En cours</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {rides.filter(r => r.status === 'in_progress').length}
            </p>
            <p className="text-green-600 text-sm">courses actives</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">⏰</span>
              </div>
              <h3 className="text-lg font-semibold">À venir</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{upcomingRides.length}</p>
            <p className="text-purple-600 text-sm">prochaines courses</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">💰</span>
              </div>
              <h3 className="text-lg font-semibold">Revenus prévus</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {rides.reduce((sum, ride) => sum + ride.price, 0).toFixed(0)}€
            </p>
            <p className="text-orange-600 text-sm">total planifié</p>
          </div>
        </div>

        {/* Today's Rides */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Courses d&apos;aujourd&apos;hui</h2>
          {todayRides.length > 0 ? (
            <div className="space-y-4">
              {todayRides.map((ride) => (
                <div key={ride.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="font-semibold text-lg">{ride.time}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ride.status)}`}>
                          {getStatusText(ride.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <span>📍</span>
                        <span>{ride.pickup} → {ride.destination}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>👤 {ride.customerName}</span>
                        <span>💰 {ride.price}€</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 p-2">
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDeleteRide(ride.id)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl mb-4 block">📅</span>
              <p>Aucune course prévue aujourd&apos;hui</p>
            </div>
          )}
        </div>

        {/* Upcoming Rides */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Prochaines courses</h2>
          {upcomingRides.length > 0 ? (
            <div className="space-y-4">
              {upcomingRides.map((ride) => (
                <div key={ride.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="font-semibold text-lg">
                          {ride.date.toLocaleDateString('fr-FR')} - {ride.time}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ride.status)}`}>
                          {getStatusText(ride.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <span>📍</span>
                        <span>{ride.pickup} → {ride.destination}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>👤 {ride.customerName}</span>
                        <span>💰 {ride.price}€</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 p-2">
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDeleteRide(ride.id)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl mb-4 block">🗓️</span>
              <p>Aucune course programmée</p>
            </div>
          )}
        </div>

        {/* Add Ride Dialog */}
        {openDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-semibold mb-4">Nouvelle course</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newRide.date}
                    onChange={(e) => setNewRide({...newRide, date: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                  <input
                    type="time"
                    value={newRide.time}
                    onChange={(e) => setNewRide({...newRide, time: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Point de départ</label>
                  <input
                    type="text"
                    placeholder="Adresse de départ"
                    value={newRide.pickup}
                    onChange={(e) => setNewRide({...newRide, pickup: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                  <input
                    type="text"
                    placeholder="Adresse de destination"
                    value={newRide.destination}
                    onChange={(e) => setNewRide({...newRide, destination: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom du client</label>
                  <input
                    type="text"
                    placeholder="Nom du client"
                    value={newRide.customerName}
                    onChange={(e) => setNewRide({...newRide, customerName: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newRide.price}
                    onChange={(e) => setNewRide({...newRide, price: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setOpenDialog(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveRide}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}