import React from 'react';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';


const Alert = (props) => {
	  
	const handleClose = (event, reason) => {
		if (reason !== 'clickaway')
            props.closeAlert();
	};

    
    return (
        <Snackbar 
            open={props.alert.open} 
            autoHideDuration={3000} 
            onClose={handleClose} 
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right'}}
            message={props.alert.message}
        >
			<MuiAlert  variant="filled" onClose={props.closeAlert} severity={props.alert.type}>
				{props.alert.message}
			</MuiAlert>
      	</Snackbar>
    )    
}

export default Alert;