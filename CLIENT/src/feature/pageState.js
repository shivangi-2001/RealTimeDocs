import { createSlice } from "@reduxjs/toolkit";


// export const fetchClients = createAsyncThunk("fetchProjects", async () =>{
//     const response = await fetch(`${import.meta.env.VITE_API_URL}/docs`, {
//         method: 'POST'
//     })
//     return (await response).json()
// })


const initialState = {
    pageCounter: 0,
    pageTitle: "Untitled document",
    activeState: {
        underline: false,
        bold: false,
        italic: false
    },
    singleActiveState: {
        left: false,
        right: false,
        center: false
    }
}

export const pageState = createSlice({
    name: "page",
    initialState,
    reducers:{
        setPageTitle:(state, action) => {
            if (state.pageCounter > 1)
                state.pageTitle = `Untitled document ${state.pageCounter}`
        },
        setPageCounter: (state, action) => {
            state.pageCounter += 1
        },
        setActiveState: (state, action) => {
            state.activeState[action.payload] = !state.activeState[action.payload]
        },
        setSingleActiveState: (state, action) => {
            Object.keys(state.singleActiveState).forEach(key => {
                state.singleActiveState[key] = false;
            });
            state.singleActiveState[action.payload] = true;
        }
    },
})

export const { setPageCounter, setPageTitle, setActiveState, setSingleActiveState } = pageState.actions;

export default pageState.reducer