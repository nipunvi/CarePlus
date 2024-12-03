import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface stateType {
    drugName:string,
    drugAdded:boolean,
    filteredDrugList:{[key: string]: string}[],
    filteredDrugListByStatus:{[key: string]: string}[]
}
export const initialState:stateType = {
    drugName:'',
    drugAdded:false,
    filteredDrugList:[],
    filteredDrugListByStatus:[]
} 
export const PrescripDrugSlice = createSlice({
    name:'prescripDrugs',
    initialState,
    reducers:{
        setDrugName:(state,action:PayloadAction<string>)=>{
            state.drugName = action.payload
        },
        setDrugAdded:(state,action:PayloadAction<boolean>)=>{
            state.drugAdded = action.payload
        },
        setFilteredDrugList:(state,action:PayloadAction<{[key: string]: string}[]>)=>{
            state.filteredDrugList = action.payload
        },
        setFilteredDrugListByStatus:(state,action:PayloadAction<{[key: string]: string}[]>)=>{
            state.filteredDrugListByStatus = action.payload
        }

    }
})

export const {setDrugName,setDrugAdded,setFilteredDrugList,setFilteredDrugListByStatus} = PrescripDrugSlice.actions
export default PrescripDrugSlice.reducer