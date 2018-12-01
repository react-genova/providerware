import React, { useMemo } from "react";
import reduxlogger from 'redux-logger';
import { useReducer, Provider } from "../../src";

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
    const onClickMinus = useMemo(() => () => dispatch({ type: "DEC" }), [dispatch]);
    return (
        <div style={{
            userSelect: "none",
            display: 'flex',
            fontWeight: "normal",
            color: "white",
            padding: "1em"
        }}>
            <div onClick={onClickMinus} style={{ padding: '0.1em 0.6em', cursor: "pointer" }}>-</div>
            <span style={{ flex: 1 }}>{`${name}: ${state.count}`}</span>
            <div onClick={onClickPlus} style={{ padding: '0.1em 0.6em', cursor: "pointer" }}>+</div>
        </div>
    );
};

const AComponent = ({ color: backgroundColor, children }) => (
    <div style={{ backgroundColor }}>{children}</div>
);

const loggerMiddleware = ({ getState }) => (next) => (action) => {
    console.group(action.type);
    console.log("State", getState());
    console.log("Action", action);
    console.groupEnd();
    next(action);
};

const anotherLoggerMiddleware = ({ getState }) => (next) => (action) => {
    console.log("Another custom log:", action.type, getState());
    next(action);
};

const App = () => {
    return (
        <div
            style={{
                width: "33%",
                fontSize: "1.5em",
                fontWeight: "bold",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
            }}
        >
            <Provider middlewares={[loggerMiddleware, anotherLoggerMiddleware, reduxlogger]}>
                <AComponent color="green">
                    <Counter name="First" />
                </AComponent>
                <AComponent color="blue">
                    <AComponent color="black">
                        <Counter name="Second" />
                    </AComponent>
                    <Counter name="Third" />
                </AComponent>
                <AComponent color="magenta">
                    <Counter name="Fourth" />
                </AComponent>
            </Provider>
        </div>
    );
};

export default App;
