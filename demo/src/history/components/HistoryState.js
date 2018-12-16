import React, { useCallback } from 'react';
import { useReducer, useAddMiddleware } from '../../../../src'
import { context } from '../context/context';
import historyMiddleware from '../middleware/historyMIddleware';

const HistoryState = ({ children }) => {
    const [{ actions }, dispatch] = useReducer((state, { type, payload: { action } }) => ({
        ADD_ACTION: { actions: [...state.actions, action]}
    })[type] || state, { actions: [] });

    const addAction = useCallback(action => dispatch({ type: 'ADD_ACTION', payload: { action }}));
    const middleware = useCallback(historyMiddleware(addAction), []);
    useAddMiddleware(middleware);
    return <context.Provider value={{ history: actions, middleware }}>{children}</context.Provider>
};

export default HistoryState;
