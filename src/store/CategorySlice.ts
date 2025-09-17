import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICategoryState } from "./interfaces/ICategoryState";
import { ICategory } from "@/interfaces/ICategory";

const initialState: ICategoryState = {
  categories: [],
};


const CategorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        setCategories: (state:ICategoryState, action: PayloadAction<ICategory[]>) => {
            state.categories = action.payload
        }
    }
});

export const CategoryActions = CategorySlice.actions;

export default CategorySlice;