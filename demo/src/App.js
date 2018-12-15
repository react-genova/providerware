import React from "react";
import reduxlogger from 'redux-logger';
import { Provider } from "../../src";
import Counter from './components/Counter';
import AComponent from './components/AComponent';
import { loggerMiddleware, anotherLoggerMiddleware } from './loggerMiddlewares/loggerMiddlewares';
import * as styles from './App.styles';

const App = () => (
    <div style={styles.main}>
        <Provider middlewares={[loggerMiddleware, anotherLoggerMiddleware, reduxlogger]}>
            <AComponent color="green">
                <Counter name="First" />
            </AComponent>
            <AComponent color="blue">
                <AComponent color="black">
                    <Counter name="Nested One" />
                    <AComponent color="red">
                        <Counter name="Nested Two" />
                    </AComponent>
                </AComponent>
                <Counter name="Third" />
            </AComponent>
            <AComponent color="magenta">
                <Counter name="Fourth" />
            </AComponent>
        </Provider>
    </div>
);

export default App;
