'use client';

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Bell, Moon, Sun, Globe, Shield, Key, User, Mail, Phone, MapPin, Building } from 'lucide-react';

export default function Settings() {
  const { authenticated, user } = usePrivy();
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    trades: true,
    news: false,
  });
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    company: '',
  });

  if (!authenticated) {
    return (
      <div className="pt-24 text-center">
        <p className="text-xl">Please connect your wallet to access settings.</p>
      </div>
    );
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile update logic here
  };

  return (
    <div className="pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-8">Settings</h1>

        {/* Basic Settings */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
          <h2 className="text-xl font-semibold mb-6">Basic Settings</h2>
          
          <div className="space-y-6">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {darkMode ? <Moon className="h-5 w-5 text-indigo-400" /> : <Sun className="h-5 w-5 text-indigo-400" />}
                <span>Theme Mode</span>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-500/20"
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-indigo-500 transition ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Notification Settings */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <Bell className="h-5 w-5 text-indigo-400" />
                <span>Notifications</span>
              </div>
              
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between pl-8">
                  <span className="capitalize">{key} Notifications</span>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key] }))}
                    className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-500/20"
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-indigo-500 transition ${value ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              ))}
            </div>

            {/* Language Selection */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-indigo-400" />
                <span>Language</span>
              </div>
              <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>

            {/* Security Settings */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-indigo-400" />
                <span>Two-Factor Authentication</span>
              </div>
              <button className="px-4 py-2 bg-indigo-500 rounded-lg hover:bg-indigo-600 transition">
                Enable
              </button>
            </div>
          </div>
        </div>

        {/* Profile Settings */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold mb-6">Profile Details</h2>
          
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-white/40" />
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-white/40" />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-5 w-5 text-white/40" />
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Country</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-white/40" />
                  <input
                    type="text"
                    value={profile.country}
                    onChange={(e) => setProfile(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="United States"
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">City</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-white/40" />
                  <input
                    type="text"
                    value={profile.city}
                    onChange={(e) => setProfile(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="New York"
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Company</label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 h-5 w-5 text-white/40" />
                  <input
                    type="text"
                    value={profile.company}
                    onChange={(e) => setProfile(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Company Name"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-6 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-500 rounded-lg hover:bg-indigo-600 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}