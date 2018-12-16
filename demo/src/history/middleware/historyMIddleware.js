const historyMiddleware = addAction => () => next => action => {
    addAction(action.type);
    next(action);
};

export default historyMiddleware;
