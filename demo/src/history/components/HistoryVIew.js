import React, { useContext } from 'react';
import { context } from '../context/context';
import * as styles from './HistoryView.styles';

const filler = Array(10).fill("");

/**
 * Shows only last ten actions fired 
 */
const HistoryView = () => {
    const { history } = useContext(context);
    return (
        <div style={styles.main}>
            <div style={styles.title}>Last 10 actions</div>
            <div style={styles.actions}>
                {[...[...history].reverse(), ...filler].slice(0, 10).map((action, index) => <span key={index} style={styles.action}>{`${index}: ${action}`}</span>)}
            </div>
        </div>
    );
};

export default HistoryView;