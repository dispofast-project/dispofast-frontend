import { configureStore } from "@reduxjs/toolkit";
import loadingReducer from "../slices/loadingSlice";

export default configureStore({
    reducer: {
        loading: loadingReducer,
    }
})