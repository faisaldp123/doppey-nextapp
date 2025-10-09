import {
    createSlice,
} from '@reduxjs/toolkit';

const initialState = {
    masterValues: {
        status: [{ label: 'active', value: 1 }, { value: 2, label: 'untouched' }, { label: 'cold', value: 3 }],
        source: [{ label: 'google', value: 1 }, { value: 2, label: 'facebook' }, { label: 'chatbot', value: 3 }],
        counsellor: [{ label: 'counsellor 1', value: 1 }, { value: 2, label: 'counsellor 2' }],
        manager: [{ label: 'manager 1', value: 1 }, { value: 2, label: 'manager 2' }],
    },
    selected: {
        status: null,
        source: null,
        counsellor: null,
        manager: null,
        created_on_start_date: null,
        created_on_end_date: null,
    }
};

export const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setMaster: (state, action) => {
            state.masterValues = action.payload
        },

        setSelected: (state, action) => {
            console.log(action.payload)
            const {key, value} = action.payload;
            state.selected[key] = value
        }
    },
});
export const {
    setMaster,
    setSelected
} = filterSlice.actions;


export default filterSlice.reducer;

