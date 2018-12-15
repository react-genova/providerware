import React from "react";
import PropTypes from 'prop-types';
import * as styles from './AComponent.styles';

const AComponent = ({ color, children }) => (
    <div style={styles.main(color)}>{children}</div>
);

AComponent.propTypes = {
    color: PropTypes.string.isRequired,
    children: PropTypes.any,
};

export default AComponent;
