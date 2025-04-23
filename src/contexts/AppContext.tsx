import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "@/components/ui/sonner";

type ThemeType = "light" | "dark" | "blue" | "pink";

type User = {
  id: string;
  name: string;
  email: string;
  role: "student";
  studentId: string;
  grade: string;
  section: string;
  avatar: string;
  joinedOn: string;
};

interface AppContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  isLoggedIn: boolean;
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    userData: Omit<User, "id" | "joinedOn"> & { password: string }
  ) => Promise<void>;
  isCompactMode: boolean;
  setIsCompactMode: (isCompact: boolean) => void;
  deleteAccount: () => Promise<void>;
}

const defaultContext: AppContextType = {
  theme: "dark",
  setTheme: () => {},
  isLoggedIn: false,
  currentUser: null,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  isCompactMode: false,
  setIsCompactMode: () => {},
  deleteAccount: async () => {},
};

const AppContext = createContext<AppContextType>(defaultContext);

export const useApp = () => useContext(AppContext);

// Initialize IndexedDB
const initializeDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("ArcSchoolDB", 1);

    request.onerror = (event) => {
      console.error("IndexedDB error:", event);
      reject("Error opening database");
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create users store if it doesn't exist
      if (!db.objectStoreNames.contains("users")) {
        const store = db.createObjectStore("users", { keyPath: "id" });
        store.createIndex("email", "email", { unique: true });
        store.createIndex("studentId", "studentId", { unique: true });
        console.log("Users store created");
      }
    };
  });
};

// Function to get users store
const getUsersStore = async (mode: IDBTransactionMode = "readonly") => {
  try {
    const db = await initializeDB();
    const transaction = db.transaction("users", mode);
    return transaction.objectStore("users");
  } catch (error) {
    console.error("Error getting users store:", error);
    throw error;
  }
};

// Mock users for demo
const mockUsers: User[] = [
  {
    id: "1",
    name: "Jane Doe",
    email: "jane@example.com",
    role: "student",
    studentId: "ST2023001",
    grade: "10",
    section: "A",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    joinedOn: "2023-08-15",
  },
];

interface AppProviderProps {
  children: ReactNode;
}

// Function to get initial theme from localStorage or default to 'light'
const getInitialTheme = (): ThemeType => {
  if (typeof window !== "undefined") {
    try {
      const savedTheme = localStorage.getItem("theme");
      console.log("Found saved theme:", savedTheme);

      // Verify it's a valid theme type
      if (
        savedTheme &&
        ["light", "dark", "blue", "pink"].includes(savedTheme)
      ) {
        return savedTheme as ThemeType;
      }
    } catch (e) {
      console.error("Error reading theme from localStorage:", e);
    }
  }
  return "dark";
};

// Function to get initial user from localStorage
const getInitialUser = (): { user: User | null; isLoggedIn: boolean } => {
  if (typeof window !== "undefined") {
    try {
      const savedUserData = localStorage.getItem("currentUser");
      console.log("Found saved user data:", savedUserData ? "Yes" : "No");

      if (savedUserData) {
        const user = JSON.parse(savedUserData);
        return { user, isLoggedIn: true };
      }
    } catch (e) {
      console.error("Error reading user from localStorage:", e);
    }
  }
  return { user: null, isLoggedIn: false };
};

// Function to get initial compact mode setting from localStorage
const getInitialCompactMode = (): boolean => {
  if (typeof window !== "undefined") {
    try {
      const savedMode = localStorage.getItem("compactMode");
      console.log("Found saved compact mode:", savedMode);

      return savedMode === "true";
    } catch (e) {
      console.error("Error reading compact mode from localStorage:", e);
    }
  }
  return false;
};

// Initialize users in IndexedDB
const initializeMockUsers = async () => {
  try {
    const store = await getUsersStore("readwrite");
    const countRequest = store.count();

    countRequest.onsuccess = () => {
      if (countRequest.result === 0) {
        // Only add mock users if the database is empty
        mockUsers.forEach((user) => {
          // Add mock password for the demo user
          const userWithPassword = {
            ...user,
            password: "password123", // Mock password for login
          };
          store.add(userWithPassword);
        });
        console.log("Mock users added to IndexedDB");
      } else {
        console.log(
          "Users already exist in IndexedDB, skipping initialization"
        );
      }
    };
  } catch (error) {
    console.error("Error initializing mock users:", error);
  }
};

export const AppProvider = ({ children }: AppProviderProps) => {
  // Initialize state from localStorage during initial render
  const [theme, setThemeState] = useState<ThemeType>(getInitialTheme);
  const initialUserState = getInitialUser();
  const [isLoggedIn, setIsLoggedIn] = useState(initialUserState.isLoggedIn);
  const [currentUser, setCurrentUser] = useState<User | null>(
    initialUserState.user
  );
  const [isCompactMode, setIsCompactModeState] = useState<boolean>(
    getInitialCompactMode
  );

  // Initialize IndexedDB on component mount
  useEffect(() => {
    const setup = async () => {
      try {
        await initializeDB();
        await initializeMockUsers();
      } catch (error) {
        console.error("Database setup error:", error);
      }
    };

    setup();
  }, []);

  // Custom setTheme function that updates both state and localStorage
  const setTheme = (newTheme: ThemeType) => {
    console.log("Setting theme to:", newTheme);
    setThemeState(newTheme);

    // Save to localStorage
    try {
      localStorage.setItem("theme", newTheme);
      console.log("Theme saved to localStorage");
    } catch (e) {
      console.error("Error saving theme to localStorage:", e);
    }
  };

  // Custom setIsCompactMode function that updates both state and localStorage
  const setIsCompactMode = (isCompact: boolean) => {
    console.log("Setting compact mode to:", isCompact);
    setIsCompactModeState(isCompact);

    // Save to localStorage
    try {
      localStorage.setItem("compactMode", isCompact.toString());
      console.log("Compact mode saved to localStorage");
    } catch (e) {
      console.error("Error saving compact mode to localStorage:", e);
    }
  };

  // Apply theme to document whenever theme changes
  useEffect(() => {
    console.log("Applying theme:", theme);
    const root = window.document.documentElement;
    root.classList.remove("light", "dark", "blue", "pink");
    root.classList.add(theme);
  }, [theme]);

  // Apply compact mode to document whenever isCompactMode changes
  useEffect(() => {
    console.log("Applying compact mode:", isCompactMode);
    const root = window.document.documentElement;

    if (isCompactMode) {
      root.classList.add("compact");
    } else {
      root.classList.remove("compact");
    }
  }, [isCompactMode]);

  const login = async (email: string, password: string) => {
    // Implement IndexedDB login
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const store = await getUsersStore();
      const emailIndex = store.index("email");
      const request = emailIndex.get(email);

      return new Promise<void>((resolve, reject) => {
        request.onsuccess = (event) => {
          const user = request.result;

          if (!user) {
            toast.error("Invalid credentials");
            reject(new Error("Invalid credentials"));
            return;
          }

          // Check password (in a real app, you'd use bcrypt or similar)
          if (user.password !== password) {
            toast.error("Invalid credentials");
            reject(new Error("Invalid credentials"));
            return;
          }

          // Remove password from user object before storing in state/localStorage
          const { password: _, ...safeUserData } = user;

          setCurrentUser(safeUserData);
          setIsLoggedIn(true);
          localStorage.setItem("currentUser", JSON.stringify(safeUserData));
          console.log("User logged in and saved to localStorage");

          toast.success("Logged in successfully");
          resolve();
        };

        request.onerror = (event) => {
          console.error("Error retrieving user:", event);
          toast.error("Login failed");
          reject(new Error("Login failed"));
        };
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("currentUser");
    console.log("User logged out and removed from localStorage");
  };

  const register = async (
    userData: Omit<User, "id" | "joinedOn"> & { password: string }
  ) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const store = await getUsersStore("readwrite");

      // Check if email already exists
      const emailCheckPromise = new Promise<boolean>((resolve, reject) => {
        const emailIndex = store.index("email");
        const emailRequest = emailIndex.get(userData.email);

        emailRequest.onsuccess = () => {
          resolve(!!emailRequest.result);
        };

        emailRequest.onerror = (event) => {
          console.error("Error checking email:", event);
          reject(new Error("Registration failed"));
        };
      });

      // Check if studentId already exists
      const studentIdCheckPromise = new Promise<boolean>((resolve, reject) => {
        const studentIdIndex = store.index("studentId");
        const studentIdRequest = studentIdIndex.get(userData.studentId);

        studentIdRequest.onsuccess = () => {
          resolve(!!studentIdRequest.result);
        };

        studentIdRequest.onerror = (event) => {
          console.error("Error checking studentId:", event);
          reject(new Error("Registration failed"));
        };
      });

      const [emailExists, studentIdExists] = await Promise.all([
        emailCheckPromise,
        studentIdCheckPromise,
      ]);

      if (emailExists) {
        toast.error("Email already in use");
        throw new Error("Email already in use");
      }

      if (studentIdExists) {
        toast.error("Student ID already in use");
        throw new Error("Student ID already in use");
      }

      // Create new user with generated ID
      const newUser: User & { password: string } = {
        id: Date.now().toString(),
        ...userData,
        joinedOn: new Date().toISOString().split("T")[0],
      };

      return new Promise<void>((resolve, reject) => {
        const addRequest = store.add(newUser);

        addRequest.onsuccess = () => {
          // Remove password from user object before storing in state/localStorage
          const { password: _, ...safeUserData } = newUser;

          setCurrentUser(safeUserData);
          setIsLoggedIn(true);
          localStorage.setItem("currentUser", JSON.stringify(safeUserData));
          console.log("User registered and saved to localStorage");

          toast.success("Registration successful");
          resolve();
        };

        addRequest.onerror = (event) => {
          console.error("Error adding user:", event);
          toast.error("Registration failed");
          reject(new Error("Registration failed"));
        };
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Registration failed"
      );
      throw error;
    }
  };

  // Delete account function - removes user from IndexedDB and clears session
  const deleteAccount = async () => {
    if (!currentUser) {
      toast.error("No user account to delete");
      return;
    }

    try {
      // Get the user store for writing
      const store = await getUsersStore("readwrite");

      // Delete the user from IndexedDB
      const deleteRequest = store.delete(currentUser.id);

      return new Promise<void>((resolve, reject) => {
        deleteRequest.onsuccess = () => {
          // Clear local storage
          localStorage.removeItem("currentUser");

          // Update state
          setCurrentUser(null);
          setIsLoggedIn(false);

          // Show success message
          toast.success("Account deleted successfully", {
            description: "Your account and personal data have been removed",
          });
          resolve();
        };

        deleteRequest.onerror = (event) => {
          console.error("Error deleting user account:", event);
          toast.error("Failed to delete account");
          reject(new Error("Failed to delete account"));
        };
      });
    } catch (error) {
      toast.error("Error occurred while deleting account");
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        isLoggedIn,
        currentUser,
        login,
        logout,
        register,
        isCompactMode,
        setIsCompactMode,
        deleteAccount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
