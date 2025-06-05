import { createSlice } from "@reduxjs/toolkit";

// Define the shape of the state
interface BooleanState {
  value: boolean;
}

// Define the initial state
const initialState: BooleanState = {
  value: false,
};

const booleanSlice = createSlice({
  name: "boolean",
  initialState,
  reducers: {
    setTrue: (state) => {
      state.value = true;
    },
    setFalse: (state) => {
      state.value = false;
    },
    toggle: (state) => {
      state.value = !state.value;
    },
  },
});

// Export actions and reducer
export const { setTrue, setFalse, toggle } = booleanSlice.actions;
export default booleanSlice.reducer;
