import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface stateType {
    newPrescriptionAdded:boolean,
    editingClor:number,
    crntlyEditingPresCripData:{[key:string]:any},
    history:{[key:string]:any}[]
}

export const initialState:stateType = {
    newPrescriptionAdded:false,
    editingClor:0,
    crntlyEditingPresCripData:{},
    history:[]
}

export const PrescripHistorySlice = createSlice({
    name:'prescriphistory',
    initialState,
    reducers:{
        setNewPrescriptionAdded:(state)=>{
            state.newPrescriptionAdded = !state.newPrescriptionAdded
        },
        setEditingClor:(state,action:PayloadAction<number>)=>{
            state.editingClor = action.payload
        },
        setCrntlyEditingPresCripData:(state,action:PayloadAction<{[key:string]:any}>)=>{
            state.crntlyEditingPresCripData = action.payload
        },
        setCrntlyEditingPresCripDataToUndefined:(state)=>{
            let obj = {...state.crntlyEditingPresCripData};
            obj['t_id'] = undefined
            state.crntlyEditingPresCripData = obj
        },
        setHistory:(state,action:PayloadAction<{[key:string]:any}[]>)=>{
            state.history = action.payload
        }
    }
})

export const {setNewPrescriptionAdded,setEditingClor,setCrntlyEditingPresCripData,setCrntlyEditingPresCripDataToUndefined,setHistory} = PrescripHistorySlice.actions
export default PrescripHistorySlice.reducer