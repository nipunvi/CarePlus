import { configureStore } from "@reduxjs/toolkit";
import DrugSlice from "../features/DrugSlice";
import SearchCardSlice from "../features/SearchCardSlice";
import DrugEditSlice from "../features/DrugEditSlice";
import PrescripHistorySlice from "../features/PrescripHistorySlice";

export const store = configureStore({
    reducer:{
       drugSlice : DrugSlice,
       searchCardSlice : SearchCardSlice,
       drugEditSlice : DrugEditSlice,
       prescriptHistorySlice:PrescripHistorySlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch