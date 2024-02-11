import { getTodayDate } from '#/libs/helpers/getTodayDate';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeedEdge } from '../../libs/types/Products/FeedEdge.type';
import { Product } from '../../libs/types/Products/Product.type';
import { productsMock } from '../../mocks/productsMock';

type State = {
  products: FeedEdge[];
};

const initialState: State = {
  products: productsMock
};

const productSlice = createSlice({
  initialState,
  name: 'product',
  reducers: {
    likeProduct: (state, action: PayloadAction<Product>) => {
      const existingItem = state.products.find(({ node }) => node.id === action.payload.id);

      if (!existingItem?.node) {
        return;
      }

      existingItem.node.likes += 1;
      existingItem.node.isLiked = true;
    },
    unlikeProduct: (state, action: PayloadAction<Product>) => {
      const existingItem = state.products.find(({ node }) => node.id === action.payload.id);
      if (!existingItem?.node) {
        return;
      }

      existingItem.node.likes -= 1;
      existingItem.node.isLiked = false;
    },
    addComment: (state, action: PayloadAction<{ id: number; text: string; rating: number }>) => {
      const existingItem = state.products.find(({ node }) => node.id === action.payload.id);
      if (!existingItem?.node) {
        return;
      }
      existingItem.node.comments.unshift({
        id: Date.now(),
        from: 'user',
        rating: action.payload.rating,
        text: action.payload.text,
        date: getTodayDate()
      });
    }
  }
});

export const { likeProduct, unlikeProduct, addComment } = productSlice.actions;
export default productSlice.reducer;
