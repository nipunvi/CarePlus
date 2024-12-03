import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface stateType {
    name:string,
    age:string,
    displayNameDrop:string,
    displayNumberDrop:string,
    patientThatNeedsToBeAdded:{[key:string]:any}
}
export const initialState:stateType = {
    name:'',
    age:'',
    displayNameDrop:'none',
    displayNumberDrop:'none',
    patientThatNeedsToBeAdded:{name:"",age:""}
}
export const SearchCardSlice = createSlice({
    name:'SearchCard',
    initialState,
    reducers:{
        setName:(state,action:PayloadAction<string>)=>{
            state.name = action.payload
        },
        setAge:(state,action:PayloadAction<string>)=>{
            state.age = action.payload
        },
        setDisplayNameDrop:(state,action:PayloadAction<string>)=>{
            state.displayNameDrop = action.payload
        },
        setDisplayNumberDrop:(state,action:PayloadAction<string>)=>{
            state.displayNumberDrop = action.payload
        },
        setPatientThatNeedToBeAdded:(state)=>{
            let name = document.getElementById('floatingInputSearchPatient')
            let obj = {...state.patientThatNeedsToBeAdded}
            obj.name = name?.getAttribute('value')
            state.patientThatNeedsToBeAdded = obj
        },
        setPatientThatNeedToBeAddedToNormal:(state,action:PayloadAction<{[key:string]:any}>)=>{
            state.patientThatNeedsToBeAdded = action.payload
        }
    }
})

export const {setName,setAge,setDisplayNameDrop,setDisplayNumberDrop,setPatientThatNeedToBeAdded,setPatientThatNeedToBeAddedToNormal} = SearchCardSlice.actions
export default SearchCardSlice.reducer