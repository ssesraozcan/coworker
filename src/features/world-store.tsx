import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { decodeWorld, emptyWorld, WorldState } from "./world-model";
const Context = createContext<{
  world: WorldState;
  setWorld: React.Dispatch<React.SetStateAction<WorldState>>;
  ready: boolean;
  error: boolean;
}>({ world: emptyWorld, setWorld: () => {}, ready: false, error: false });
export function WorldProvider({ children }: { children: React.ReactNode }) {
  const [world, setWorld] = useState(emptyWorld),
    [ready, setReady] = useState(false),
    [error, setError] = useState(false),
    queue = useRef(Promise.resolve());
  useEffect(() => {
    AsyncStorage.getItem("coworkers:world:v2")
      .then((s) => setWorld(decodeWorld(s)))
      .catch(() => setError(true))
      .finally(() => setReady(true));
  }, []);
  useEffect(() => {
    if (ready)
      queue.current = queue.current
        .then(() =>
          AsyncStorage.setItem("coworkers:world:v2", JSON.stringify(world)),
        )
        .catch(() => setError(true));
  }, [world, ready]);
  return (
    <Context.Provider value={{ world, setWorld, ready, error }}>
      {children}
    </Context.Provider>
  );
}
export const useWorld = () => useContext(Context);
