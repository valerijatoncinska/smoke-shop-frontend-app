import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
    isAdded: boolean;
}

const initialState: InitialState = {
    isAdded: false
}

const addNewProductSlice = createSlice({
    name: "addedNewProductSlice",
    initialState,
    reducers: {
        setIsAddedTrue (state){
            state.isAdded = true;
        },
        setIsAddedFalse (state){
            state.isAdded = false;
        }
    }
})

export const {setIsAddedFalse, setIsAddedTrue} = addNewProductSlice.actions

export default addNewProductSlice.reducer