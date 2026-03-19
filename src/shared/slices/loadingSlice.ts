import { createSlice } from "@reduxjs/toolkit";

export const loadingSlice = createSlice({
    name: "loading",
    initialState: {
        global: false,
    },
    reducers: {
        setLoading: (state, action) => {
            state.global = action.payload;
        }
    }
})

export const { setLoading } = loadingSlice.actions;

export default loadingSlice.reducer;