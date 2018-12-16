import React, { Fragment } from "react";
import reduxlogger from 'redux-logger';
import { Provider } from "../../src";
import Counter from './components/Counter';
import AComponent from './components/AComponent';
import { loggerMiddleware, anotherLoggerMiddleware } from './loggerMiddlewares/loggerMiddlewares';
import * as styles from './App.styles';
import HistoryState from "./history/components/HistoryState";
import HistoryView from "./history/components/HistoryVIew";

const Components = () => {
    return (
        <Fragment>
            <div style={styles.counters}>
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
            </div>
            <HistoryView />
        </Fragment>
    );
};

const App = () => {
    return (
        <div style={styles.main}>
            <Provider middlewares={[loggerMiddleware, anotherLoggerMiddleware, reduxlogger]}>
                <HistoryState>
                    <Components />
                </HistoryState>
            </Provider>
        </div>
    );
};

export default App;
