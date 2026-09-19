import { Booking, CustomerFeedback, TourPackage } from '../types';
import { INITIAL_BOOKINGS, INITIAL_FEEDBACKS, INITIAL_TOUR_PACKAGES } from '../data/mockData';

const KEYS = {
  PACKAGES: 'voyage_tour_packages_v2_brochures',
  BOOKINGS: 'voyage_bookings_v1',
  FEEDBACKS: 'voyage_feedbacks_v2_real_fb'
};

export const getStoredPackages = (): TourPackage[] => {
  try {
    const data = localStorage.getItem(KEYS.PACKAGES);
    if (!data) {
      // Also check if v1 had user-created custom packages and merge them
      const v1Data = localStorage.getItem('voyage_tour_packages_v1');
      if (v1Data) {
        try {
          const parsedV1: TourPackage[] = JSON.parse(v1Data);
          const customPkgs = parsedV1.filter(p => !['pkg-01', 'pkg-02', 'pkg-03'].includes(p.id));
          const merged = [...INITIAL_TOUR_PACKAGES, ...customPkgs];
          localStorage.setItem(KEYS.PACKAGES, JSON.stringify(merged));
          return merged;
        } catch {
          // fallback
        }
      }
      return INITIAL_TOUR_PACKAGES;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error loading stored packages:', e);
    return INITIAL_TOUR_PACKAGES;
  }
};

export const savePackages = (packages: TourPackage[]) => {
  try {
    localStorage.setItem(KEYS.PACKAGES, JSON.stringify(packages));
  } catch (e) {
    console.error('Error saving packages:', e);
  }
};

export const getStoredBookings = (): Booking[] => {
  try {
    const data = localStorage.getItem(KEYS.BOOKINGS);
    return data ? JSON.parse(data) : INITIAL_BOOKINGS;
  } catch (e) {
    console.error('Error loading stored bookings:', e);
    return INITIAL_BOOKINGS;
  }
};

export const saveBookings = (bookings: Booking[]) => {
  try {
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
  } catch (e) {
    console.error('Error saving bookings:', e);
  }
};

export const getStoredFeedbacks = (): CustomerFeedback[] => {
  try {
    const data = localStorage.getItem(KEYS.FEEDBACKS);
    return data ? JSON.parse(data) : INITIAL_FEEDBACKS;
  } catch (e) {
    console.error('Error loading stored feedbacks:', e);
    return INITIAL_FEEDBACKS;
  }
};

export const saveFeedbacks = (feedbacks: CustomerFeedback[]) => {
  try {
    localStorage.setItem(KEYS.FEEDBACKS, JSON.stringify(feedbacks));
  } catch (e) {
    console.error('Error saving feedbacks:', e);
  }
};

export const resetAllData = () => {
  try {
    localStorage.removeItem(KEYS.PACKAGES);
    localStorage.removeItem(KEYS.BOOKINGS);
    localStorage.removeItem(KEYS.FEEDBACKS);
    localStorage.removeItem('voyage_feedbacks_v1');
  } catch (e) {
    console.error('Error resetting storage data:', e);
  }
};
