import { Alert, Button, Snackbar } from "@mui/material";
import { useNotificationStore } from "../../store";

export const Notification = () => {
    const { isOpen, message, type, hideNotification, action } = useNotificationStore();

    const handleClose = (
        _event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if(reason === "clickaway") {
            return;
        }
        hideNotification();
    };

    const handleActionClick = () => {
        if(action?.onClick) {
            action.onClick();
        }
        hideNotification();
    }

    return(
        <Snackbar
            open={isOpen}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        >
            <Alert
                onClose={handleClose}
                severity={type}
                action={
                    action && (
                        <Button color="inherit" size="small" onClick={handleActionClick}>
                            {action.label}
                        </Button>
                    )
                }
            >
                {message}
            </Alert>
        </Snackbar>
    )
}