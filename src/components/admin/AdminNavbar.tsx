import React, { useState } from 'react';
import { SubmoduleTab } from '../../types';
import { 
  Compass, 
  Layers, 
  MapPin, 
  Calendar, 
  Hotel, 
  CreditCard, 
  Star, 
  Briefcase, 
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Sparkles,
  Users,
  Shield,
  Receipt
} from 'lucide-react';
import { hasTabAccess, findStaffAccountByEmail, getRoleBadgeStyle } from '../../utils/rbac';
import { ActionConfirmModal } from '../common/ActionConfirmModal';

interface AdminNavbarProps {
  activeTab: SubmoduleTab;
  onTabChange: (tab: SubmoduleTab) => void;
  onOpenCapstoneModal: () => void;
  onLogout: () => void;
  bookingCount: number;
  pendingPaymentCount: number;
  adminEmail: string;
  adminRole: string;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenCapstoneModal,
  onLogout,
  bookingCount,
  pendingPaymentCount,
  adminEmail,
  adminRole
}) => {
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);
  const staffAccount = findStaffAccountByEmail(adminEmail);
  const userContext = staffAccount || { email: adminEmail, role: adminRole };
  const badgeStyle = getRoleBadgeStyle(adminRole);

  const canAccess = (tab: SubmoduleTab) => hasTabAccess(userContext, tab);
  const isSuperAdmin = adminRole === 'Super Admin' || adminEmail === 'karlljacob8@gmail.com';
  return (
    <header className="sticky top-0 z-40 bg-[#070B0E]/95 backdrop-blur-md border-b border-white/[0.08] text-ivory shadow-2xl">
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-3.5">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-colors"
              style={{ backgroundColor: 'var(--admin-accent, #F26A4F)' }}
            >
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-serif-display text-lg sm:text-xl text-ivory tracking-wide font-normal">
                  Holiday Travelers
                </span>
                <span 
                  className="px-2 py-0.5 text-[10px] font-sans-body font-semibold tracking-wider rounded-full uppercase border"
                  style={{
                    backgroundColor: 'rgba(var(--admin-accent-rgb, 242, 106, 79), 0.15)',
                    color: 'var(--admin-accent, #F26A4F)',
                    borderColor: 'rgba(var(--admin-accent-rgb, 242, 106, 79), 0.3)',
                  }}
                >
                  Operator Portal
                </span>
              </div>
              <p className="text-xs text-sand-muted font-sans-body font-light">
                Tour Operations Command & Integrated Submodules
              </p>
            </div>
          </div>

          {/* Right: Authenticated User & Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCapstoneModal}
              className="btn-pop hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/[0.08] text-xs text-ivory/90 font-sans-body tracking-wider transition-all cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" style={{ color: 'var(--admin-accent, #F26A4F)' }} />
              <span>Submodule Architecture</span>
            </button>

            <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 bg-[#0B1014] rounded-full border border-white/[0.08] text-xs font-sans-body">
              <div 
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
              >
                {adminRole.includes('Super') ? 'SA' : adminRole.includes('Finance') ? 'FO' : adminRole.includes('Guide') ? 'TG' : 'OP'}
              </div>
              <div className="text-left">
                <div className="font-medium text-ivory text-xs line-clamp-1">{adminEmail}</div>
                <div className={`text-[10px] font-medium ${badgeStyle.text}`}>{adminRole}</div>
              </div>
            </div>

            <button
              onClick={() => setIsExitConfirmOpen(true)}
              className="btn-pop flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-950/40 hover:bg-red-900/60 active:scale-95 border border-red-800/50 text-red-300 text-xs font-medium transition-all shadow-sm font-sans-body cursor-pointer"
              title="Return to Public Customer Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit to Customer Site</span>
            </button>
          </div>
        </div>
      </div>

      {/* Submodule Navigation Tabs with Proper Functional Names & RBAC Filtering */}
      <div className="bg-[#0B1014]/90 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-1.5 overflow-x-auto py-2.5 scrollbar-thin scrollbar-thumb-white/10">
            {/* Overview / Admin Dashboard */}
            {canAccess('overview') && (
              <button
                onClick={() => onTabChange('overview')}
                style={activeTab === 'overview' ? { backgroundColor: 'var(--admin-accent, #F26A4F)' } : {}}
                className={`btn-pop flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-sans-body tracking-wider whitespace-nowrap transition-all duration-300 active:scale-95 cursor-pointer ${
                  activeTab === 'overview'
                    ? 'text-white font-medium shadow-md shadow-black/40'
                    : 'text-sand-muted hover:text-ivory hover:bg-white/[0.05]'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Operations Dashboard</span>
              </button>
            )}

            {/* Field Guide Command (Dedicated Submodule for Tour Guides / Michael Baynosa) */}
            {canAccess('guide_command') && (
              <button
                onClick={() => onTabChange('guide_command')}
                style={activeTab === 'guide_command' ? { backgroundColor: 'var(--admin-accent, #F26A4F)' } : {}}
                className={`btn-pop flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-sans-body tracking-wider whitespace-nowrap transition-all duration-300 active:scale-95 cursor-pointer ${
                  activeTab === 'guide_command'
                    ? 'text-white font-medium shadow-md shadow-black/40'
                    : 'text-sand-muted hover:text-ivory hover:bg-white/[0.05]'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-sunset-coral" />
                <span>Field Guide Command</span>
              </button>
            )}

            {/* Tour Package Management */}
            {canAccess('packages') && (
              <button
                onClick={() => onTabChange('packages')}
                style={activeTab === 'packages' ? { backgroundColor: 'var(--admin-accent, #F26A4F)' } : {}}
                className={`btn-pop flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-sans-body tracking-wider whitespace-nowrap transition-all duration-300 active:scale-95 cursor-pointer ${
                  activeTab === 'packages'
                    ? 'text-white font-medium shadow-md shadow-black/40'
                    : 'text-sand-muted hover:text-ivory hover:bg-white/[0.05]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Tour Package Management</span>
              </button>
            )}

            {/* Passenger Manifest */}
            {canAccess('bookings') && (
              <button
                onClick={() => onTabChange('bookings')}
                style={activeTab === 'bookings' ? { backgroundColor: 'var(--admin-accent, #F26A4F)' } : {}}
                className={`btn-pop flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-sans-body tracking-wider whitespace-nowrap transition-all duration-300 active:scale-95 cursor-pointer ${
                  activeTab === 'bookings'
                    ? 'text-white font-medium shadow-md shadow-black/40'
                    : 'text-sand-muted hover:text-ivory hover:bg-white/[0.05]'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>
                  {adminRole.includes('Finance') 
                    ? 'Billing & Financial Manifest' 
                    : adminRole.includes('Guide') 
                    ? 'My Passenger Manifest' 
                    : 'Booking & Passenger Manifest'}
                </span>
                {bookingCount > 0 && (
                  <span 
                    className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/60 font-mono font-bold border border-white/10"
                    style={{ color: 'var(--admin-accent, #F26A4F)' }}
                  >
                    {bookingCount}
                  </span>
                )}
              </button>
            )}

            {/* Itineraries & Schedules */}
            {canAccess('itineraries') && (
              <button
                onClick={() => onTabChange('itineraries')}
                style={activeTab === 'itineraries' ? { backgroundColor: 'var(--admin-accent, #F26A4F)' } : {}}
                className={`btn-pop flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-sans-body tracking-wider whitespace-nowrap transition-all duration-300 active:scale-95 cursor-pointer ${
                  activeTab === 'itineraries'
                    ? 'text-white font-medium shadow-md shadow-black/40'
                    : 'text-sand-muted hover:text-ivory hover:bg-white/[0.05]'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{adminRole.includes('Guide') ? 'My Assigned Tours' : 'Itinerary & Schedule Management'}</span>
              </button>
            )}

            {/* Hotel & Transport Allocations */}
            {canAccess('reservations') && (
              <button
                onClick={() => onTabChange('reservations')}
                style={activeTab === 'reservations' ? { backgroundColor: 'var(--admin-accent, #F26A4F)' } : {}}
                className={`btn-pop flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-sans-body tracking-wider whitespace-nowrap transition-all duration-300 active:scale-95 cursor-pointer ${
                  activeTab === 'reservations'
                    ? 'text-white font-medium shadow-md shadow-black/40'
                    : 'text-sand-muted hover:text-ivory hover:bg-white/[0.05]'
                }`}
              >
                <Hotel className="w-3.5 h-3.5" />
                <span>Hotel & Transport Logistics</span>
              </button>
            )}

            {/* Payment Gate & Receipt Photo Audit (Finance Officer & Super Admin) */}
            {canAccess('payment_gate') && (
              <button
                onClick={() => onTabChange('payment_gate')}
                style={activeTab === 'payment_gate' ? { backgroundColor: 'var(--admin-accent, #F26A4F)' } : {}}
                className={`btn-pop flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-sans-body tracking-wider whitespace-nowrap transition-all duration-300 active:scale-95 cursor-pointer ${
                  activeTab === 'payment_gate'
                    ? 'text-white font-medium shadow-md shadow-black/40'
                    : 'text-sand-muted hover:text-ivory hover:bg-white/[0.05]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Payment Gate Audit</span>
                {pendingPaymentCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold font-mono">
                    {pendingPaymentCount}
                  </span>
                )}
              </button>
            )}

            {/* Payments & Invoices */}
            {canAccess('payments') && (
              <button
                onClick={() => onTabChange('payments')}
                style={activeTab === 'payments' ? { backgroundColor: 'var(--admin-accent, #F26A4F)' } : {}}
                className={`btn-pop flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-sans-body tracking-wider whitespace-nowrap transition-all duration-300 active:scale-95 cursor-pointer ${
                  activeTab === 'payments'
                    ? 'text-white font-medium shadow-md shadow-black/40'
                    : 'text-sand-muted hover:text-ivory hover:bg-white/[0.05]'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Payment & Invoice Management</span>
                {pendingPaymentCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                    {pendingPaymentCount}
                  </span>
                )}
              </button>
            )}

            {/* Fiscal Reconciliation & Payouts */}
            {canAccess('reconciliation') && (
              <button
                onClick={() => onTabChange('reconciliation')}
                style={activeTab === 'reconciliation' ? { backgroundColor: 'var(--admin-accent, #F26A4F)' } : {}}
                className={`btn-pop flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-sans-body tracking-wider whitespace-nowrap transition-all duration-300 active:scale-95 cursor-pointer ${
                  activeTab === 'reconciliation'
                    ? 'text-white font-medium shadow-md shadow-black/40'
                    : 'text-sand-muted hover:text-ivory hover:bg-white/[0.05]'
                }`}
              >
                <Receipt className="w-3.5 h-3.5 text-amber-300" />
                <span>Fiscal Reconciliation</span>
              </button>
            )}

            {/* Feedback & Ratings */}
            {canAccess('feedback') && (
              <button
                onClick={() => onTabChange('feedback')}
                style={activeTab === 'feedback' ? { backgroundColor: 'var(--admin-accent, #F26A4F)' } : {}}
                className={`btn-pop flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-sans-body tracking-wider whitespace-nowrap transition-all duration-300 active:scale-95 cursor-pointer ${
                  activeTab === 'feedback'
                    ? 'text-white font-medium shadow-md shadow-black/40'
                    : 'text-sand-muted hover:text-ivory hover:bg-white/[0.05]'
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                <span>Customer Feedback & Ratings</span>
              </button>
            )}

            {/* Settings */}
            {canAccess('settings') && (
              <button
                onClick={() => onTabChange('settings')}
                style={activeTab === 'settings' ? { backgroundColor: 'var(--admin-accent, #F26A4F)' } : {}}
                className={`btn-pop flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-sans-body tracking-wider whitespace-nowrap transition-all duration-300 active:scale-95 cursor-pointer ${
                  activeTab === 'settings'
                    ? 'text-white font-medium shadow-md shadow-black/40'
                    : 'text-sand-muted hover:text-ivory hover:bg-white/[0.05]'
                }`}
              >
                <SettingsIcon className="w-3.5 h-3.5" />
                <span>System & Agency Settings</span>
              </button>
            )}

            {/* Staff & RBAC Governance Center (Super Admin Clearance) */}
            {canAccess('rbac') && (
              <button
                onClick={() => onTabChange('rbac')}
                className={`btn-pop flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-sans-body tracking-wider whitespace-nowrap transition-all duration-300 active:scale-95 cursor-pointer ${
                  activeTab === 'rbac'
                    ? 'bg-rose-600 text-white font-medium shadow-md shadow-rose-900/50'
                    : 'text-rose-300/80 hover:text-rose-200 hover:bg-rose-500/10 border border-rose-500/20'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-rose-400" />
                <span>Staff & RBAC Governance</span>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-rose-500/20 text-rose-300 font-mono font-bold uppercase">
                  Admin
                </span>
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Safeguard Exit Confirmation Modal */}
      <ActionConfirmModal
        isOpen={isExitConfirmOpen}
        onClose={() => setIsExitConfirmOpen(false)}
        onConfirm={() => {
          setIsExitConfirmOpen(false);
          onLogout();
        }}
        title="Exit Operator Control Tower?"
        message="You are about to switch out of the administrative operations console and return to the public customer site. Unsaved form changes in active tabs will be cleared."
        details={[
          { label: 'Staff Account', value: adminEmail },
          { label: 'Security Role', value: adminRole },
          { label: 'Active Submodule', value: activeTab.toUpperCase() },
          { label: 'Pending Collections', value: `${pendingPaymentCount} Invoices` }
        ]}
        confirmText="Yes, Return to Guest Site"
        cancelText="Stay in Operator Tower"
        variant="warning"
        warningNote="To return to this console later, click 'Admin Portal' in the navigation bar or use staff credentials."
      />
    </header>
  );
};
