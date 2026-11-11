// IP-based City and State detection helper for Naukarix

export interface UserLocation {
  city: string;
  state: string;
  regionCode?: string;
  isDetected: boolean;
}

const DEFAULT_LOCATION: UserLocation = {
  city: 'Lucknow',
  state: 'Uttar Pradesh',
  regionCode: 'UP',
  isDetected: false,
};

export async function detectUserLocation(): Promise<UserLocation> {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCATION;
  }

  // 1. Check if user already manually selected a city
  const savedCity = localStorage.getItem('naukarix_user_city');
  const savedState = localStorage.getItem('naukarix_user_state');
  if (savedCity) {
    return {
      city: savedCity,
      state: savedState || 'Uttar Pradesh',
      isDetected: false,
    };
  }

  // 2. Query free IP geolocation service
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout

    const res = await fetch('https://ipapi.co/json/', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.city) {
        const detected = {
          city: data.city,
          state: data.region || 'Uttar Pradesh',
          regionCode: data.region_code,
          isDetected: true,
        };
        // Cache temporarily in session
        sessionStorage.setItem('naukarix_detected_city', data.city);
        sessionStorage.setItem('naukarix_detected_state', data.region || '');
        return detected;
      }
    }
  } catch (err) {
    // If IP detection timed out or blocked, try alternative or fallback
    const cachedCity = sessionStorage.getItem('naukarix_detected_city');
    const cachedState = sessionStorage.getItem('naukarix_detected_state');
    if (cachedCity) {
      return {
        city: cachedCity,
        state: cachedState || 'Uttar Pradesh',
        isDetected: true,
      };
    }
  }

  return DEFAULT_LOCATION;
}

export function saveSelectedLocation(city: string, state: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('naukarix_user_city', city);
    localStorage.setItem('naukarix_user_state', state);
  }
}
