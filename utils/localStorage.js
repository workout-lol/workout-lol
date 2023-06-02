import { useState, useEffect } from'react'

export default function useLocalStorage(key) {
  const [value, setValue] = useState();

  // Initial fetch from storage
  useEffect(() => {
    const initValue = localStorage.getItem(key);
    setValue(initValue ? JSON.parse(initValue) : {});
  }, [key]);

  // Persist to storage
  useEffect(() => {
    // first render, don't override/destroy existing item value
    if (value !== undefined) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue];
}
