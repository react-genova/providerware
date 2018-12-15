export const loggerMiddleware = ({ getState }) => (next) => (action) => {
    console.group(action.type);
    console.log("State", getState());
    console.log("Action", action);
    console.groupEnd();
    next(action);
};

export const anotherLoggerMiddleware = ({ getState }) => (next) => (action) => {
    console.log("Another custom log:", action.type, getState());
    next(action);
};