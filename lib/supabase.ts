import "react-native-url-polyfill/auto";

import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase env vars are missing. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env.",
  );
}

const memoryStore = new Map<string, string>();

const memoryStorage = {
  getItem: async (key: string) => memoryStore.get(key) ?? null,
  setItem: async (key: string, value: string) => {
    memoryStore.set(key, value);
  },
  removeItem: async (key: string) => {
    memoryStore.delete(key);
  },
};

const webStorage = {
  getItem: async (key: string) => {
    try {
      return globalThis.localStorage?.getItem(key) ?? null;
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      globalThis.localStorage?.setItem(key, value);
    } catch {
      memoryStore.set(key, value);
    }
  },
  removeItem: async (key: string) => {
    try {
      globalThis.localStorage?.removeItem(key);
    } catch {
      memoryStore.delete(key);
    }
  },
};

type AuthStorage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

type ResolvedAuthStorage = {
  storage: AuthStorage;
  persistent: boolean;
};

function withFallback(storage: AuthStorage): AuthStorage {
  return {
    getItem: async (key: string) => {
      try {
        return await storage.getItem(key);
      } catch {
        return memoryStorage.getItem(key);
      }
    },
    setItem: async (key: string, value: string) => {
      try {
        await storage.setItem(key, value);
      } catch {
        await memoryStorage.setItem(key, value);
      }
    },
    removeItem: async (key: string) => {
      try {
        await storage.removeItem(key);
      } catch {
        await memoryStorage.removeItem(key);
      }
    },
  };
}

function resolveAuthStorage(): ResolvedAuthStorage {
  if (Platform.OS === "web") {
    return { storage: withFallback(webStorage), persistent: true };
  }

  try {
    // Lazy require prevents runtime crashes when the native module is unavailable.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const AsyncStorage =
      require("@react-native-async-storage/async-storage").default;

    if (
      AsyncStorage?.getItem &&
      AsyncStorage?.setItem &&
      AsyncStorage?.removeItem
    ) {
      return {
        storage: withFallback(AsyncStorage as AuthStorage),
        persistent: true,
      };
    }
  } catch {
    return { storage: memoryStorage, persistent: false };
  }

  return { storage: memoryStorage, persistent: false };
}

const authStorage = resolveAuthStorage();

export const supabase = createClient(
  supabaseUrl ?? "https://placeholder.supabase.co",
  supabaseAnonKey ?? "placeholder-anon-key",
  {
    auth: {
      storage: authStorage.storage,
      autoRefreshToken: authStorage.persistent,
      persistSession: authStorage.persistent,
      detectSessionInUrl: false,
    },
  },
);
