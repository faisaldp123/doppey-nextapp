import {
    createSlice,
  } from '@reduxjs/toolkit';

  
  // declaring the types for our state
 
  
  const initialState = {
    theme: "light"
  };
  
  export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
      setTheme: (state, action)  => {
        const mode = localStorage.getItem("mode");

        if (!mode) {
          state.theme = "light"
        }else{
          state.theme = mode
        }
      
 
        
      },
      toggleDarkMode: (state,action) => {
        
        if (!state.theme || state.theme === "light"){
          localStorage.setItem("mode", "dark");
          state.theme = "dark"
        }else{
          localStorage.setItem("mode", "light");
          state.theme = "light"
        }
        
      },
   
    },
  });
  export const {
    setTheme, 
    toggleDarkMode
  } = themeSlice.actions;
  
  
  export default themeSlice.reducer;

