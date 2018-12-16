import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer as useReactReducer,
  useState
} from "react";

const context = createContext();

const hasMiddlewares = middlewares => middlewares && middlewares.length > 0;

const Provider = ({ middlewares, children }) => {
  const [dynamicMiddlewares, setDynamicMiddlewares] = useState([]);
  const addMiddleware = useCallback(
    middleware => setDynamicMiddlewares([...dynamicMiddlewares, middleware]),
    [dynamicMiddlewares]);
  const wrapReducer = useCallback(
    (state, dispatch) => {
      const wrappedDispatch = useCallback(
        action => {
          const midds = [...middlewares, ...dynamicMiddlewares];
          const store = { getState: () => state, dispatch };
          const next = action =>
            hasMiddlewares(midds)
              ? midds.pop()(store)(next)(action)
              : dispatch(action);
          next(action);
        },
        [state, dynamicMiddlewares]
      );
      return [state, wrappedDispatch];
    },
    [middlewares, dynamicMiddlewares]
  );
  return <context.Provider value={{wrapReducer, addMiddleware}}>{children}</context.Provider>;
};

const useReducer = (reducer, initialState) => {
  const [state, dispatch] = useReactReducer(reducer, initialState);
  const {wrapReducer} = useContext(context);
  return wrapReducer(state, dispatch);
};

const useAddMiddleware = middleware => {
    const { addMiddleware } = useContext(context);
    useEffect(() => addMiddleware(middleware), []);
    return addMiddleware;
};

export { Provider, useAddMiddleware, useReducer };
