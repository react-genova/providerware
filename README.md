# providerware

A first attempt to add middleware to a React application without redux, using React createContext and hooks.  
It's an attempt, because something is still missing. See last chapter of this readme to discover how you could contribute and improve this package.

## Introduction

React **Context** is now pretty cool. React **Hooks** are awesome. I'm in love with **redux middleware**.  
Last version of React Context allows us to create full web application dropping redux completely. I'm actually a big fan of redux. Despire some boilerplate codes, which does not bother me so much, the single store approch offers great advantages and redux is by nature incredibily easy to test. But it's still a third party library which add some strong mangles to che component based architecture. Anyway, this is not the place to discuss redux. I'd like to try to build a complete and complex (this is fundamental) web application without using redux. So, before starting coding without redux like a berserk, shouting at the world this is the best way to do thing, I began thinking of all the things I would have missed about redux. I ended up with a list of a couple of main features and what I would be missing more are redux middlewares. With a middleware we can add a functionality to an application without changing anything into the application code itself. This is a great plus. I have only to test my middleware and I would be sure not to break any other features. Think about adding analytics to your application. You write your analyticsMiddleare, post your stats to a server within your middleware when an action is fired, and change nothing in the rest of the code base. Moreover you can remove your middleware and the feature is gone, nothing to test.  
This is why I'm trying to bring middleware back into the game.

## React Hooks

Hooks just arrived, but they've already opened bright paths for a better future. They're moving React towards more functional programming, ReasonML paradigm and smarter code (why in the sake of God classes had been introduced in js?!). Moreover, they're going to standardize the way we manage the store within components and without redux: the powerfull **userReducer** hook. This hook and the standardization it introduces, allowed me to think about the chance to introduce a middleware, which can intercep each action dispatched to evey reducer of the application.  
To achieve that, I created another **useReducer** which contains the original React hook and wraps the dispatch function with my own controlled function.

```js
import { useContext, useReducer as useReactReducer } from "react";

const context = createContext();

const useReducer = (reducer, initialState) => {
    const reactReducer = useReactReducer(reducer, initialState);
    const wrapReducer = useContext(context); // we will explain this line later
    return wrapReducer(reactReducer);
};

export { useReducer };
```

Nothing special at all. Imported useReducer from react and wrapped with a method obtained from the context. So our new userReducer hook is a consumer of a context, provided somewhere else. Let's see what the provider does.

## React Context Provider

We use the React.createContext method to pass the **wrapReducer** method down to all the components using our new **useReducer** hook. The Provided receives the list of middlewares as a prop and creates a new dispatch function. This new dispatch function loops over the middlewares and invokes each middleware passing a typical **next** function, the current **state** and the original **dispatch** function as well. Actually I chosed to keep the same signature of redux middleware, so that theorically old redux middlewares will be compatibile with the new middleware approach. Finally the provider spreads a function to wrap the React useReducer hook down to the components tree as the value of the provider itself. This is why in our useReducer custom hook we invoked the **useContext** method to retrieve the wrapper function.  
And here's our provider. Actually Provider code has some more **useMemo** hooks, just to improve performance.

```js
import React, { createContext } from "react";

const context = createContext();

const hasMiddlewares = middlewares => middlewares && middlewares.length > 0;

const Provider = ({ middlewares, children }) => {
    const wrapReducer = (state, dispatch) => {
        const wrappedDispatch = action => {
            const midds = [...middlewares];
            const store = { getState: () => state, dispatch };
            const next = action => hasMiddlewares(midds)
                ? midds.pop()(store)(next)(action)
                : dispatch(action);
            next(action);
        };
        return [state, wrappedDispatch];
    };
    return <context.Provider value={wrapReducer}>{children}</context.Provider>;
};

export { Provider };
```

And here again, nothing special at all. All quite simple to understand. The **wrapReducer** function returns a new couple of state and dispatch, in which the dispatch method is another function: **wrappedDispatch**. The wrappedDispath loops over middlewares recursively, using the pop() and finally invokes the original dispatch method when no more middlewares remain or there's no middleware at all.

## Usage

Using this this packace is pretty simple. Let's create a classic Counter component and use it sever times in our main app.

### Counter

This is the component with the state. Instead of importing **useReducer** from the React package, we will import the userReducer hook from the **providerware** package.

```js
import React, { useMemo } from "react";
import { useReducer, Provider } from "providerware";

const Counter = ({ name }) => {
    const [state, dispatch] = useReducer(
        (state, { type }) => (
            { 
                INC: { name, count: state.count + 1 },
                DEC: { name, count: Math.max(0, state.count - 1) }
            })[type] || state,
        { name, count: 0 }
    );
    const onClickPlus = useMemo(() => () => dispatch({ type: "INC" }), [dispatch]); // note: see consideration below
    const onClickMinus = useMemo(() => () => dispatch({ type: "DEC" }), [dispatch]); // note: see consideration below
    return (
        <div>
            <div onClick={onClickMinus}>-</div>
            <span>{`${name}: ${state.count}`}</span>
            <div onClick={onClickPlus}>+</div>
        </div>
    );
};
```

I removed all styles from the component, so the code is clearer. As we can see, the code is nearly the same as it would be with the original useReducer hook. I said _nearly_ because the onClick callbacks, written with the useMemo hook, are not exactly as plain as all the remaining code. Infact I had to add the dispatch function as last paramenter of the useMemo hook, in order to force memoization to refresh when the dispatch function changes. With original useReducer hook the dispatch method never changes. Instead our dispatch changes every time the state changes, basically at every dispatch of an action.

### The Provider

The following code shows how to use the Provider and, mosto of all, how to create a middleware. In the example we can find just two different log middleare, plus the famous redux-logger middleare, which works well also with the providerware package.

```js
import React from "react";
import reduxlogger from 'redux-logger';
import { Provider } from "providerware";

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
        <div>
            <Provider middlewares={[loggerMiddleware, anotherLoggerMiddleware, reduxlogger]}>
                <Counter name="First" />
                <Counter name="Second" />
                <Counter name="Third" />
                <Counter name="Fourth" />
            </Provider>
        </div>
    );
};
```

## What's missing

There one huge thing missing here. I can read the state before the action is dispatched, but I cannot read the state after the action has been dispatched. The **getState** method always return the state before the modification appplied by the dispatched action :(  
This is a great problem. I dunno how to do it. Any idea? **I need your help!**