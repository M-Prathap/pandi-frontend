import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api, { unwrap } from '../services/api';

const SettingsContext = createContext(null);

const defaults = {
  logoUrl: '',
  brandName: 'PARA',
  brandSecondary: 'Creative Origin',
  tagline: 'Packaging & Branding Studio',
  footerText: '© PARA Creative Origin',
  contactEmail: '',
  contactPhone: '',
  socials: {},
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaults);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await api.get('/settings');
      const data = unwrap(res) || {};
      setSettings({ ...defaults, ...data, socials: { ...defaults.socials, ...(data.socials || {}) } });
    } catch {
      setSettings(defaults);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ settings, loading, refresh }),
    [settings, loading, refresh]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
