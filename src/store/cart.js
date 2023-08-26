// find item in cart
export const findCartItem = (state, action) => {
    const cart = state.cart;

    const existingCartItemIndex = cart.items.findIndex(
        (item) => item._id === action.id
    );

    const existingCartItem = cart.items[existingCartItemIndex];
    return { cart, existingCartItemIndex, existingCartItem };
};
