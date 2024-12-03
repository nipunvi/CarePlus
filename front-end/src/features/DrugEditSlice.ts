import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface stateType{
    drugStatusUpdated:boolean,
    drugListStatic:{[key:string]:any}[],
    currentEditingDrugStaticName:string | undefined,
    drugNameChanged:boolean,
    crntEditingDrugName:string | undefined,
    crntEditingDrugClassName:string
} 
export const initialState:stateType = {
    drugStatusUpdated:false,
    drugListStatic:[],
    currentEditingDrugStaticName:undefined,
    drugNameChanged:false,
    crntEditingDrugName:undefined,
    crntEditingDrugClassName:'form-control'
}
export const DrugEditSlice = createSlice({
    name:'drugEdit',
    initialState,
    reducers:{
        setDrugStatusUpdate:(state)=>{
            state.drugStatusUpdated = !state.drugStatusUpdated 
        },
        setDrugListStatic:(state,action:PayloadAction<{[key:string]:any}[]>)=>{
            state.drugListStatic = action.payload
        },
        setCurrentEditingDrugStaticName:(state,action:PayloadAction<string>)=>{
            state.currentEditingDrugStaticName = action.payload
        },
        setDrugNameChanged:(state,action:PayloadAction<boolean>)=>{
            state.drugNameChanged = action.payload
        },
        setCrntEditingDrugName:(state,action:PayloadAction<string>)=>{
            state.crntEditingDrugName =  action.payload
        },
        setcrntEditingDrugClassName:(state,action:PayloadAction<string>)=>{
            state.crntEditingDrugClassName =  action.payload
        }
    }
})

export const {setDrugStatusUpdate,setDrugListStatic,setCurrentEditingDrugStaticName,setDrugNameChanged,setCrntEditingDrugName,setcrntEditingDrugClassName} = DrugEditSlice.actions
export default DrugEditSlice.reducer