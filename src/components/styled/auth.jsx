import { alpha, makeStyles, withStyles} from "@material-ui/core/styles";
import { Box, Button, TextField, Typography, InputBase } from '@material-ui/core';


export const LoginTextfield = withStyles((theme) => ({
    root: {
      'label + &': {
        marginTop: theme.spacing(3),
      },
      width: 250,
      height: 32, 
      margin: "4px 0 16px 0",
    },
    input: {
      borderRadius: 8,
      backgroundColor: "#E7E4F9",
      fontSize: 15,
      
      padding: '8px 8px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      '&:focus': {
        boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
        borderColor: theme.palette.primary.main,
      },
    },
  }))(InputBase);

  export const LoginButton = withStyles((theme) => ({
      root: {
          borderRadius: "100px", 
          width: 250, 
      }
  }))(Button)

  export const LoginFormSection = withStyles((theme) => ({
    root: {
        background: "#FFFFFF", 
        padding: "40px 50px", 
        width: 250, 
        borderRadius: "15px",
        position: "absolute", 
        left: "38%", 
        top: "20%",  
    }
}))(Box)

export const LoginBackground = withStyles((theme) => ({
    root: {
        backgroundImage:`url('/login_signup/background.png')`,
        height: "100vh", 
        width: "100vw", 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: "absolute", 
        left: 0, 
    }
}))(Box)