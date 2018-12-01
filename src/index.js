import React, {
  createContext,
  useContext,
  useMemo,
  useReducer as useReactReducer
} from "react";

const context = createContext();

const hasMiddlewares = middlewares => middlewares && middlewares.length > 0;

const Provider = ({ middlewares, children }) => {
  const wrapReducer = useMemo(
      () => (state, dispatch) => {
          const wrappedDispatch = useMemo(() => action => {
              const midds = [...middlewares];
              const store = { getState: () => state, dispatch };
              const next = action =>
                  hasMiddlewares(midds)
                      ? midds.pop()(store)(next)(action)
                      : dispatch(action);
              next(action);
          }, [state]);
          return [state, wrappedDispatch];
      },
      [middlewares]
  );
  return <context.Provider value={wrapReducer}>{children}</context.Provider>;
};

const useReducer = (reducer, initialState) => {
  const [state, dispatch] = useReactReducer(reducer, initialState);
  const wrapReducer = useContext(context);
  return wrapReducer(state, dispatch);
};

export { Provider, useReducer };
