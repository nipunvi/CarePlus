import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface sliceType {
    drugShow:boolean,
    crntEditingDrugId:undefined | number,
    drugFieldClass:string,
    drugList:{[key:string]:any}[],
    crntDrug:string,
    drugAdded:boolean,
    showNav:boolean
}

export const initialState:sliceType = {
    drugShow:false,
    crntEditingDrugId:undefined,
    drugFieldClass:'form-control',
    drugList:[],
    crntDrug:'',
    drugAdded:false,
    showNav:false
    
}

export const DrugSlice = createSlice({
    name:'drug',
    initialState,
    reducers:{
        setDrugShow:(state,action:PayloadAction<boolean>)=>{
            state.drugShow = action.payload
        },
        setCrntEditingDrugId:(state,action:PayloadAction<number>)=>{
            state.crntEditingDrugId = action.payload
        },
        setDrugFieldClass:(state,action:PayloadAction<string>)=>{
            state.drugFieldClass = action.payload
        },
        setDrugList:(state,action:PayloadAction<{[key:string]:any}[]>)=>{
            state.drugList = action.payload
        },
        setCrntDrug:(state,action:PayloadAction<string>)=>{
            state.crntDrug = action.payload
        },
        setDrugAdded:(state)=>{
            state.drugAdded = !state.drugAdded
        },
        setshowNav:(state,action:PayloadAction<boolean>)=>{
            state.showNav = action.payload
        }
    }
})

export const {setDrugShow,setshowNav,setCrntEditingDrugId,setDrugFieldClass,setDrugList,setCrntDrug,setDrugAdded} = DrugSlice.actions
export default DrugSlice.reducer