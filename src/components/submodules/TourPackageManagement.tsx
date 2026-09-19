import React, { useState } from 'react';
import { TourPackage, TourCategory, DayItinerary } from '../../types';
import { 
  Plus, 
  Search, 
  MapPin, 
  Clock, 
  Users, 
  DollarSign, 
  Edit3, 
  Trash2, 
  Copy, 
  Check, 
  X, 
  Eye, 
  Calendar,
  Layers,
  Sparkles,
  Tag,
  Star,
  ArrowUpRight
} from 'lucide-react';
import { ActionConfirmModal } from '../common/ActionConfirmModal';
import { dispatchAppNotification } from '../../utils/notifications';

interface TourPackageManagementProps {
  packages: TourPackage[];
  onSavePackage: (pkg: TourPackage) => void;
  onDeletePackage: (id: string) => void;
  onDuplicatePackage: (pkg: TourPackage) => void;
  isOperatorView: boolean;
  onSelectBookPackage?: (pkg: TourPackage) => void;
}

export const TourPackageManagement: React.FC<TourPackageManagementProps> = ({
  packages,
  onSavePackage,
  onDeletePackage,
  onDuplicatePackage,
  isOperatorView,
  onSelectBookPackage
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingPackage, setViewingPackage] = useState<TourPackage | null>(null);

  // Deletion Safeguard State
  const [packageToDelete, setPackageToDelete] = useState<TourPackage | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Form State for Create / Edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<TourPackage>>({
    code: '',
    title: '',
    destination: '',
    category: 'Island Hopping',
    durationDays: 3,
    durationNights: 2,
    pricePerPax: 5000,
    maxCapacity: 15,
    status: 'Active',
    bannerUrl: '/images/elnido.jpg',
    inclusions: ['Hotel Stay', 'Tour Guide', 'Buffet Breakfast'],
    exclusions: ['Airfare', 'Personal Expenses'],
    itinerary: []
  });

  const [inclusionInput, setInclusionInput] = useState('');
  const [exclusionInput, setExclusionInput] = useState('');

  const categories: string[] = ['All', 'Island Hopping', 'Adventure & Nature', 'Heritage & Culture', 'Luxury & Wellness', 'City Tour'];

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch = 
      pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || pkg.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      code: `PKG-NEW-${Math.floor(100 + Math.random() * 900)}`,
      title: '',
      destination: '',
      category: 'Island Hopping',
      durationDays: 3,
      durationNights: 2,
      pricePerPax: 8500,
      maxCapacity: 15,
      status: 'Active',
      featured: false,
      bannerUrl: '/images/elnido.jpg',
      inclusions: ['3-Night Hotel Accommodation', 'Daily Breakfast', 'Guided Island Hopping Tour', 'Airport Van Transfers'],
      exclusions: ['Airfare tickets', 'Personal Expenses'],
      itinerary: [
        {
          dayNumber: 1,
          title: 'Arrival & Welcome Orientation',
          description: 'Airport van pick-up and check-in to resort.',
          meals: 'Dinner included',
          activities: [
            { time: '14:00', activity: 'Airport Pick-up and Hotel Check-in' },
            { time: '18:00', activity: 'Welcome Dinner with Cultural Overview' }
          ]
        }
      ]
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (pkg: TourPackage) => {
    setEditingId(pkg.id);
    setFormData({
      ...pkg
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.destination || !formData.pricePerPax) return;

    const savedPackage: TourPackage = {
      id: editingId || `pkg-${Date.now()}`,
      code: formData.code || `PKG-00${packages.length + 1}`,
      title: formData.title || '',
      destination: formData.destination || '',
      category: (formData.category as TourCategory) || 'Island Hopping',
      durationDays: Number(formData.durationDays) || 1,
      durationNights: Number(formData.durationNights) || 0,
      pricePerPax: Number(formData.pricePerPax) || 0,
      maxCapacity: Number(formData.maxCapacity) || 10,
      status: formData.status || 'Active',
      featured: formData.featured || false,
      rating: formData.rating || 5.0,
      reviewCount: formData.reviewCount || 1,
      bannerUrl: formData.bannerUrl || '/images/elnido.jpg',
      inclusions: formData.inclusions || [],
      exclusions: formData.exclusions || [],
      itinerary: formData.itinerary || []
    };

    onSavePackage(savedPackage);
    setIsModalOpen(false);
  };

  const handleAddInclusion = () => {
    if (!inclusionInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      inclusions: [...(prev.inclusions || []), inclusionInput.trim()]
    }));
    setInclusionInput('');
  };

  const handleRemoveInclusion = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      inclusions: (prev.inclusions || []).filter((_, i) => i !== idx)
    }));
  };

  const handleAddExclusion = () => {
    if (!exclusionInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      exclusions: [...(prev.exclusions || []), exclusionInput.trim()]
    }));
    setExclusionInput('');
  };

  const handleRemoveExclusion = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      exclusions: (prev.exclusions || []).filter((_, i) => i !== idx)
    }));
  };

  return (
    <div className="space-y-8">
      {/* Submodule Header */}
      <div className="bg-[#0B1014] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sunset-coral text-xs font-sans-body tracking-[0.25em] uppercase font-medium">
              <Layers className="w-4 h-4" />
              <span>Tour Catalog & Packages</span>
            </div>
            <h1 className="font-serif-display text-3xl sm:text-4xl font-light text-ivory tracking-wide">
              Tour Package & Catalog Management
            </h1>
            <p className="text-xs sm:text-sm text-sand-muted max-w-2xl font-light leading-relaxed">
              Maintain the tour catalog, establish pricing per pax, define detailed inclusions, set pax capacity, and publish new destinations.
            </p>
          </div>

          {isOperatorView && (
            <button
              onClick={handleOpenCreateModal}
              className="btn-pop btn-shimmer-wrap flex items-center gap-2 px-5 py-2.5 bg-sunset-coral hover:bg-[#D95339] active:scale-95 text-white text-xs font-medium tracking-wider rounded-full shadow-lg shadow-sunset-coral/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Tour Package</span>
            </button>
          )}
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-8 flex flex-col md:flex-row gap-4 pt-6 border-t border-white/[0.08] items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-sand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search package code, title, or destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#070B0E] border border-white/[0.08] rounded-full pl-10 pr-4 py-2 text-xs text-ivory placeholder-sand-muted/50 focus:outline-none focus:border-sunset-coral"
            />
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-1.5 items-center w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn-pop px-3.5 py-1.5 rounded-full text-xs font-sans-body tracking-wider transition-all duration-300 active:scale-95 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-sunset-coral text-white font-medium shadow-md shadow-sunset-coral/20'
                    : 'bg-white/[0.04] text-sand-muted hover:text-ivory hover:bg-white/[0.08]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((pkg) => {
          const price = pkg.pricePerPax ?? 0;
          return (
            <div
              key={pkg.id}
              className="bg-[#0B1014] border border-white/[0.06] hover:border-white/20 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Card Banner */}
              <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
                <img
                  src={pkg.bannerUrl}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80';
                  }}
                  alt={`${pkg.title} (${pkg.destination}) tour package cover`}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover img-editorial-card"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1014] via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                  <span className="bg-black/70 backdrop-blur-md text-ivory text-[11px] font-mono tracking-wider px-3 py-1 rounded-full border border-white/10">
                    {pkg.code}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wider uppercase ${
                      pkg.status === 'Active'
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                        : 'bg-sand-muted/20 text-sand-muted border border-white/10'
                    }`}
                  >
                    {pkg.status}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3.5 text-xs text-sand-muted flex items-center gap-2 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-sunset-coral" />
                  <span>{pkg.destination}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-sand-muted">
                    <span className="text-sunset-coral font-medium uppercase tracking-wider text-[11px]">
                      {pkg.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-sand-muted" />
                      {pkg.durationDays}D / {pkg.durationNights}N
                    </span>
                  </div>

                  <h3 className="font-serif-display text-xl sm:text-2xl text-ivory group-hover:text-white transition-colors leading-snug">
                    {pkg.title}
                  </h3>

                  {pkg.inclusions && pkg.inclusions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {pkg.inclusions.slice(0, 2).map((inc, i) => (
                        <span
                          key={i}
                          className="text-[11px] text-sand-muted bg-white/[0.03] border border-white/[0.06] px-2.5 py-0.5 rounded-full font-light line-clamp-1"
                        >
                          {inc}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-sans-body tracking-wider text-sand-muted">
                      Price / Pax
                    </span>
                    <div className="font-serif-display text-xl text-ivory">
                      ₱{Number(price).toLocaleString()}
                    </div>
                  </div>

                  {isOperatorView ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(pkg)}
                        className="btn-pop p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] active:scale-90 text-sand-muted hover:text-ivory border border-white/10 transition cursor-pointer"
                        title="Edit Package"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDuplicatePackage(pkg)}
                        className="btn-pop p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] active:scale-90 text-sand-muted hover:text-ivory border border-white/10 transition cursor-pointer"
                        title="Duplicate Package"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setPackageToDelete(pkg);
                          setIsDeleteConfirmOpen(true);
                        }}
                        className="btn-pop p-2 rounded-full bg-red-950/40 hover:bg-red-900/60 active:scale-90 text-red-300 border border-red-800/40 transition cursor-pointer"
                        title="Delete Package"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onSelectBookPackage && onSelectBookPackage(pkg)}
                      className="btn-pop btn-shimmer-wrap px-4 py-2 bg-sunset-coral hover:bg-[#D95339] active:scale-95 text-white text-xs font-medium rounded-full transition cursor-pointer shadow-md shadow-sunset-coral/20"
                    >
                      Book Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0B1014] border border-white/10 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-xs font-sans-body tracking-[0.2em] uppercase text-sunset-coral font-medium">
                  {editingId ? 'Edit Package' : 'New Package'}
                </span>
                <h2 className="font-serif-display text-2xl sm:text-3xl text-ivory">
                  {editingId ? 'Update Tour Package' : 'Create Tour Package'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full text-sand-muted hover:text-ivory hover:bg-white/5 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans-body uppercase tracking-wider text-sand-muted mb-1.5">
                    Package Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-ivory focus:outline-none focus:border-sunset-coral font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans-body uppercase tracking-wider text-sand-muted mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as TourCategory })}
                    className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-ivory focus:outline-none focus:border-sunset-coral"
                  >
                    {categories.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans-body uppercase tracking-wider text-sand-muted mb-1.5">
                  Package Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. El Nido Karst Lagoon Expedition"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-ivory focus:outline-none focus:border-sunset-coral"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-sans-body uppercase tracking-wider text-sand-muted mb-1.5">
                    Destination
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.destination || ''}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-ivory focus:outline-none focus:border-sunset-coral"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans-body uppercase tracking-wider text-sand-muted mb-1.5">
                    Duration Days
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.durationDays || 1}
                    onChange={(e) => setFormData({ ...formData, durationDays: Number(e.target.value) })}
                    className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-ivory focus:outline-none focus:border-sunset-coral"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans-body uppercase tracking-wider text-sand-muted mb-1.5">
                    Duration Nights
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.durationNights || 0}
                    onChange={(e) => setFormData({ ...formData, durationNights: Number(e.target.value) })}
                    className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-ivory focus:outline-none focus:border-sunset-coral"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans-body uppercase tracking-wider text-sand-muted mb-1.5">
                    Price Per Pax (₱)
                  </label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={formData.pricePerPax || 0}
                    onChange={(e) => setFormData({ ...formData, pricePerPax: Number(e.target.value) })}
                    className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-ivory focus:outline-none focus:border-sunset-coral font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans-body uppercase tracking-wider text-sand-muted mb-1.5">
                    Banner Photo Path / URL
                  </label>
                  <input
                    type="text"
                    value={formData.bannerUrl || ''}
                    placeholder="/images/elnido.jpg"
                    onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                    className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-ivory focus:outline-none focus:border-sunset-coral"
                  />
                </div>
              </div>

              {/* Inclusions Builder */}
              <div>
                <label className="block text-xs font-sans-body uppercase tracking-wider text-sand-muted mb-1.5">
                  Package Inclusions
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add inclusion (e.g. Island Hopping Boat with Crew)..."
                    value={inclusionInput}
                    onChange={(e) => setInclusionInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddInclusion();
                      }
                    }}
                    className="flex-1 bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-ivory focus:outline-none focus:border-sunset-coral"
                  />
                  <button
                    type="button"
                    onClick={handleAddInclusion}
                    className="px-4 py-2 bg-white/[0.08] hover:bg-sunset-coral text-ivory hover:text-white rounded-xl text-xs transition"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {(formData.inclusions || []).map((inc, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 text-xs bg-white/[0.04] border border-white/[0.08] text-ivory px-3 py-1 rounded-full"
                    >
                      <span>{inc}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveInclusion(i)}
                        className="text-sand-muted hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-pop px-5 py-2 rounded-full text-xs text-sand-muted hover:text-ivory bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-pop btn-shimmer-wrap px-6 py-2 rounded-full text-xs font-medium tracking-wider bg-sunset-coral hover:bg-[#D95339] active:scale-95 text-white shadow-lg shadow-sunset-coral/20 transition cursor-pointer"
                >
                  Save Tour Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deletion Safeguard Modal */}
      <ActionConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setPackageToDelete(null);
        }}
        onConfirm={() => {
          if (packageToDelete) {
            onDeletePackage(packageToDelete.id);
            dispatchAppNotification({
              title: 'Tour Package Deleted',
              message: `${packageToDelete.title} (${packageToDelete.code}) was removed from the active catalog.`,
              type: 'info'
            });
            setPackageToDelete(null);
            setIsDeleteConfirmOpen(false);
          }
        }}
        title="Permanently Delete Tour Package?"
        message="This action removes the tour package from the active catalog. Any historical customer bookings referencing this package code will remain securely recorded in the ledger."
        details={[
          { label: 'Package Code', value: packageToDelete?.code || '' },
          { label: 'Expedition Title', value: packageToDelete?.title || '' },
          { label: 'Destination', value: packageToDelete?.destination || '' },
          { label: 'Standard Rate', value: `₱${(packageToDelete?.pricePerPax || 0).toLocaleString()} / Pax` },
          { label: 'Max Capacity', value: `${packageToDelete?.maxCapacity || 0} Pax` },
        ]}
        confirmText="Yes, Delete Package"
        cancelText="No, Keep Package"
        variant="danger"
        warningNote="This cannot be undone. Any brochures or direct links referencing this package will become unavailable."
      />
    </div>
  );
};
