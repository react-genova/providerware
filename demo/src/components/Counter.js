import React, { useMemo, useCallback } from "react";
import PropTypes from 'prop-types';
import { useReducer } from "../../../src";
import * as styles from './Counter.styles';

const Counter = ({ name }) => {
    const [state, dispatch] = useReducer(
        (state, { type }) => (
            { 
                INC: { name, count: state.count + 1 },
                DEC: { name, count: Math.max(0, state.count - 1) }
            })[type] || state,
        { name, count: 0 }
    );
    const onClickPlus = useMemo(() => () => dispatch({ type: "INC" }), [dispatch]);
    const onClickMinus = useCallback(() => dispatch({ type: "DEC" }), [dispatch]);
    return (
        <div style={styles.main}>
            <div onClick={onClickMinus} style={styles.button}>-</div>
            <span style={styles.text}>{`${name}: ${state.count}`}</span>
            <div onClick={onClickPlus} style={styles.button}>+</div>
        </div>
    );
};

Counter.propTypes = {
    name: PropTypes.string.isRequired,
};

export default Counter;
