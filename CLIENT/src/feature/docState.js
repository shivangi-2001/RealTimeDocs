import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    docs: {
        id: -1,
        title: "",
        content: "",
        createdAt: "",
        updatedAt: ""
    }
}

export const docState = createSlice({
    name: "page",
    initialState,
    reducers: {
        setDocs: (state, action) => {
            state.docs = action.payload;
        }
    },
});

export const { setDocs } = docState.actions;

export default docState.reducer;
