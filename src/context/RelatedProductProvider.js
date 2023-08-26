import React, { useReducer } from "react";
import RelatedProductContext from "./related-product";

const defaultRelatedState = {
    items: [],
    messages: null,
};

const relatedReducer = (state, action) => {
    if (action.type === "ADD") {
        const existingRelatedItemIndex = state.items.findIndex(
            (item) => item._id === action.item._id
        );

        const existingRelatedItem = state.items[existingRelatedItemIndex];
        let updatedItems;

        // array.splice(index, 1);

        if (existingRelatedItem) {
            updatedItems = [...state.items];
            updatedItems.splice(existingRelatedItemIndex, 1);
            updatedItems.unshift(existingRelatedItem);
        } else {
            // updatedItems = state.items.concat(action.item);
            updatedItems = [...state.items];
            updatedItems.unshift(action.item);
        }

        return {
            ...state,
            items: updatedItems.slice(0, 4),
        };
    }

    // if (action.type === "OPEN_MESSAGE") {
    //     return { ...state, message: action.message };
    // }
    // if (action.type === "CLOSE_MESSAGE") {
    //     return { ...state, message: null };
    // }

    return defaultRelatedState;
};

const RelatedProductProvider = ({ children }) => {
    const [relatedState, dispatchRelatedAction] = useReducer(
        relatedReducer,
        defaultRelatedState
    );

    const addItemToRelatedHandler = (item) => {
        dispatchRelatedAction({ type: "ADD", item: item });
    };

    // const openMessageHandler = (message) => {
    //     dispatchRelatedAction({ type: "OPEN_MESSAGE", message: message });
    // };
    // const closeMessageHandler = () => {
    //     dispatchRelatedAction({ type: "CLOSE_MESSAGE" });
    // };

    const relatedContext = {
        items: relatedState.items,
        addItem: addItemToRelatedHandler,
    };

    return (
        <RelatedProductContext.Provider value={relatedContext}>
            {children}
        </RelatedProductContext.Provider>
    );
};

export default RelatedProductProvider;
