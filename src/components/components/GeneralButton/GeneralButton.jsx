import React from "react"; 
import { StyledButton } from "./StyledButton";
import PropTypes from 'prop-types';


export const GeneralButton = ({children, variant, onClick, ...props}) => {
    return (
        <StyledButton variant={variant} onClick={onClick} {...props}>
            {children}
        </StyledButton>
    )
}

GeneralButton.propTypes = {
    /**
     * What variant should the button be?
     */
    variant: PropTypes.oneOf(['text', 'contained', 'outlined']),
    /**
     * Optional click handler
     */
    onClick: PropTypes.func,
    children: PropTypes.any
  };
  
  GeneralButton.defaultProps = {
    variant: 'contained',
    onClick: undefined,
    children: "Button Text"
  };