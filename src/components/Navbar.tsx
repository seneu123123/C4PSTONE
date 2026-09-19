import React from 'react';
import { ViewMode, SubmoduleTab } from '../types';
import { 
  Compass, 
  UserCheck, 
  ShieldCheck, 
  Layers, 
  MapPin, 
  Calendar, 
  Hotel, 
  CreditCard, 
  Star, 
  Briefcase,
  Luggage,
  Sparkles,
  Settings as SettingsIcon
} from 'lucide-react';

interface NavbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  activeTab: SubmoduleTab;
  setActiveTab: (tab: SubmoduleTab) => void;
  onOpenCapstoneModal: () => void;
  bookingCount: number;
  pendingPaymentCount: number;
  companyName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  activeTab,
  setActiveTab,
  onOpenCapstoneModal,
  bookingCount,
  pendingPaymentCount,
  companyName = "Holiday Travelers Travel and Tours Inc"
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100 shadow-xl">
      {/* Top Banner / Capstone Identity */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent truncate max-w-[280px] sm:max-w-none">
                  {companyName}
                </span>
                <span className="hidden xl:inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  DOT Accredited
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Tour Operations & Customer Booking System
              </p>
            </div>
          </div>

          {/* Center: Perspective Switcher */}
          <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80">
            <button
              onClick={() => {
                setViewMode('customer');
                if (activeTab === 'overview' || activeTab === 'packages') {
                  setActiveTab('packages');
                }
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'customer'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Luggage className="w-4 h-4" />
              <span>Customer Portal</span>
            </button>
            <button
              onClick={() => {
                setViewMode('operator');
                if (activeTab === 'packages') setActiveTab('overview');
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'operator'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Tour Operator Portal</span>
              {pendingPaymentCount > 0 && (
                <span className="ml-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCapstoneModal}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/25 transition"
              title="View 6 Submodule Checklist"
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">6 Submodules</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Submodule Tabs Bar */}
      <div className="bg-slate-950/80 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center space-x-1 py-1.5 text-xs whitespace-nowrap">
          {viewMode === 'operator' && (
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition ${
                activeTab === 'overview'
                  ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Operations Overview</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('packages')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition ${
              activeTab === 'packages'
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Tour Package Management</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition ${
              activeTab === 'bookings'
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Booking & Passenger Manifest ({bookingCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('itineraries')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition ${
              activeTab === 'itineraries'
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Itinerary & Schedule Management</span>
          </button>

          <button
            onClick={() => setActiveTab('reservations')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition ${
              activeTab === 'reservations'
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Hotel className="w-3.5 h-3.5" />
            <span>Hotel & Transport Logistics</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition ${
              activeTab === 'payments'
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Payment & Invoice Management</span>
            {pendingPaymentCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-bold">
                {pendingPaymentCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition ${
              activeTab === 'feedback'
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span>Customer Feedback & Ratings</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition ${
              activeTab === 'settings'
                ? 'bg-slate-800 text-purple-400 border border-purple-500/30'
                : 'text-slate-400 hover:text-purple-300 hover:bg-slate-900'
            }`}
          >
            <SettingsIcon className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-semibold">Agency & System Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};
