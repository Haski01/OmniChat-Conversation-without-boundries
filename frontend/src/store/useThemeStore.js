// zustand global store
// also create local storage so when we load page theme could not be change..

import { create } from "zustand";

export const useThemeStore = create((set) => ({
  // check is there any value of theme in local storage finding with the key of omniChat-theme if yes then set theme value could be that otherwise "forest"
  theme: localStorage.getItem("omniChat-theme") || "forest",

  setTheme: (theme) => {
    // storing theme value in localStorage..
    localStorage.setItem("omniChat-theme", theme);
    set({ theme });
  },
}));

// code before implementing local storage
/*
export const useThemeStore = create((set) => ({
  theme: "forest",
  setTheme: (theme) => set({ theme }),
}));
*/
