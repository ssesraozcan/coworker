import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import { decode, finish, initialState, State } from './model';
const KEY = 'coworkers:v1';
const Context = createContext<{ state: State; update: (fn: (s: State) => State) => void; ready: boolean; storageError: boolean }>({ state: initialState, update: () => {}, ready: false, storageError: false });
export function Store({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initialState), [ready, setReady] = useState(false), [storageError, setError] = useState(false);
  const queue = useRef(Promise.resolve());
  useEffect(() => { AsyncStorage.getItem(KEY).then(raw => setState(finish(decode(raw)))).catch(() => setError(true)).finally(() => setReady(true)); }, []);
  useEffect(() => { if (!ready) return; const raw = JSON.stringify({ version: 1, state }); queue.current = queue.current.then(() => AsyncStorage.setItem(KEY, raw)).catch(() => setError(true)); }, [state, ready]);
  useEffect(() => { const tick = () => setState(s => finish(s)); const interval = setInterval(tick, 1000); const sub = AppState.addEventListener('change', value => { if (value === 'active') tick(); }); return () => { clearInterval(interval); sub.remove(); }; }, []);
  return <Context.Provider value={{ state, update: setState, ready, storageError }}>{children}</Context.Provider>;
}
export const useGame = () => useContext(Context);
