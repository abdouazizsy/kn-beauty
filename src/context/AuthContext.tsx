"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db, isFirebaseConfigured, phoneToSyntheticEmail } from "@/lib/firebase/client";
import { useMockStore } from "@/lib/mock/store";
import type { AppUser } from "@/types/user";

interface RegisterInput {
  name: string;
  phone: string;
  password: string;
  address?: string;
  district?: string;
}

interface AuthContextValue {
  profile: AppUser | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<AppUser>;
  registerCliente: (input: RegisterInput) => Promise<AppUser>;
  logout: () => Promise<void>;
  updateProfile: (patch: Partial<AppUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseProfile, setFirebaseProfile] = useState<AppUser | null>(null);
  const [firebaseLoading, setFirebaseLoading] = useState(true);

  const mockCurrentUserId = useMockStore((s) => s.currentUserId);
  const mockUsers = useMockStore((s) => s.users);
  const mockHasHydrated = useMockStore((s) => s.hasHydrated);

  // Real Firebase mode: listen to auth state and load the matching Firestore profile.
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsub = onAuthStateChanged(auth!, async (fbUser) => {
      if (!fbUser) {
        setFirebaseProfile(null);
        setFirebaseLoading(false);
        return;
      }
      const snap = await getDoc(doc(db!, "users", fbUser.uid));
      setFirebaseProfile(snap.exists() ? ({ id: snap.id, ...snap.data() } as AppUser) : null);
      setFirebaseLoading(false);
    });
    return unsub;
  }, []);

  // Mock mode: derive the profile from the local persisted store.
  const mockProfile = useMemo(
    () => (mockCurrentUserId ? mockUsers.find((u) => u.id === mockCurrentUserId) ?? null : null),
    [mockCurrentUserId, mockUsers]
  );

  const profile = isFirebaseConfigured ? firebaseProfile : mockProfile;
  const loading = isFirebaseConfigured ? firebaseLoading : !mockHasHydrated;

  const login = useCallback(async (phone: string, password: string) => {
    if (!isFirebaseConfigured) {
      const user = useMockStore.getState().checkCredential(phone, password);
      if (!user) throw new Error("Numéro ou mot de passe incorrect.");
      useMockStore.getState().setCurrentUser(user.id);
      return user;
    }
    const cred = await signInWithEmailAndPassword(auth!, phoneToSyntheticEmail(phone), password);
    const snap = await getDoc(doc(db!, "users", cred.user.uid));
    if (!snap.exists()) throw new Error("Profil introuvable.");
    return { id: snap.id, ...snap.data() } as AppUser;
  }, []);

  const registerCliente = useCallback(async (input: RegisterInput) => {
    const createdAt = new Date().toISOString();
    if (!isFirebaseConfigured) {
      const existing = useMockStore
        .getState()
        .users.find((u) => u.phone.replace(/[^\d]/g, "") === input.phone.replace(/[^\d]/g, ""));
      if (existing) throw new Error("Un compte existe déjà avec ce numéro.");
      const user: AppUser = {
        id: `cliente-${Date.now()}`,
        name: input.name,
        phone: input.phone,
        address: input.address,
        district: input.district,
        role: "cliente",
        createdAt,
      };
      useMockStore.getState().addUser(user, input.password);
      useMockStore.getState().setCurrentUser(user.id);
      return user;
    }
    const cred = await createUserWithEmailAndPassword(
      auth!,
      phoneToSyntheticEmail(input.phone),
      input.password
    );
    const user: AppUser = {
      id: cred.user.uid,
      name: input.name,
      phone: input.phone,
      address: input.address,
      district: input.district,
      role: "cliente",
      createdAt,
    };
    await setDoc(doc(db!, "users", cred.user.uid), user);
    return user;
  }, []);

  const logout = useCallback(async () => {
    if (!isFirebaseConfigured) {
      useMockStore.getState().setCurrentUser(null);
      return;
    }
    await signOut(auth!);
  }, []);

  const updateProfileFn = useCallback(
    async (patch: Partial<AppUser>) => {
      if (!profile) return;
      if (!isFirebaseConfigured) {
        useMockStore.getState().updateUser(profile.id, patch);
        return;
      }
      await updateDoc(doc(db!, "users", profile.id), patch);
      setFirebaseProfile({ ...profile, ...patch });
    },
    [profile]
  );

  const value = useMemo(
    () => ({ profile, loading, login, registerCliente, logout, updateProfile: updateProfileFn }),
    [profile, loading, login, registerCliente, logout, updateProfileFn]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans un AuthProvider.");
  return ctx;
}
