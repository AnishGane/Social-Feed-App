import type { RootState } from "@/store/store";
import { createSlice } from "@reduxjs/toolkit";

type SearchState = {
  open: boolean;
};

const initialState: SearchState = {
  open: false,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    openSearch: (state) => {
      state.open = true;
    },
    closeSearch: (state) => {
      state.open = false;
    },
    toggleSearch: (state) => {
      state.open = !state.open;
    },
  },
});

export const selectSearchOpen = (state: RootState) => state.search.open;

export const { openSearch, closeSearch, toggleSearch } = searchSlice.actions;
export default searchSlice.reducer;
