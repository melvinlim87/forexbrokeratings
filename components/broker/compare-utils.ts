// Utility for compare page selection state via query param or localStorage

export function setCompareSelection(brokerId: string) {
  if (typeof window !== 'undefined') {
    // Save to localStorage so compare page can read it
    localStorage.setItem('compare_broker_1', brokerId);
  }
}

export function getCompareSelection(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('compare_broker_1');
  }
  return null;
}

export function clearCompareSelection() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('compare_broker_1');
  }
}
