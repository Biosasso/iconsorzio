import { createContext, useState } from "react";

const NotificationsContext = createContext({
    show: false,
    title: null,
    message: null,
    valueId: null
})

export function NotificationContextProvider({ children }) {

    const [showSuccess, setShowSuccess] = useState(false);
    const [successTitle, setSuccessTitle] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const [showError, setShowError] = useState(false);
    const [errorTitle, setErrorTitle] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const [showWarning, setShowWarning] = useState(false);
    const [warningTitle, setWarningTitle] = useState('')
    const [warningMessage, setWarningMessage] = useState('')

    const [showLoading, setShowLoading] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertValueId, setAlertValueId] = useState();

    const [showAlert2, setShowAlert2] = useState(false);
    const [alert2Title, setAlert2Title] = useState('');
    const [alert2Message, setAlert2Message] = useState('');
    const [alert2ValueId, setAlert2ValueId] = useState();

    function setSuccess({ show, title, message }) {
        setShowSuccess(show ? show : true);
        setSuccessTitle(title);
        setSuccessMessage(message ? message : false);
        setShowLoading(false)
    }
    function setError({ show, title, message }) {
        setShowError(show ? show : true);
        setErrorTitle(title);
        setErrorMessage(message ? message : false);
        setShowLoading(false)
    }

    function setWarning({ show, title, message }) {
        setShowWarning(show ? show : true);
        setWarningTitle(title);
        setWarningMessage(message ? message : false);
        setShowLoading(false)
    }

    function setAlert1({ show, title, message, id }) {
        setAlertTitle(title);
        setAlertMessage(message ? message : false);
        setShowAlert(show ? show : true);
        setAlertValueId(id)
    }

    const context = {
        success: {
            show: showSuccess,
            setShow: setShowSuccess,
            title: successTitle,
            setTitle: setSuccessTitle,
            message: successMessage,
            setMessage: setSuccessMessage,
            set: setSuccess
        },
        error: {
            show: showError,
            setShow: setShowError,
            title: errorTitle,
            setTitle: setErrorTitle,
            message: errorMessage,
            setMessage: setErrorMessage,
            set: setError
        },
        warning: {
            show: showWarning,
            setShow: setShowWarning,
            title: warningTitle,
            setTitle: setWarningTitle,
            message: warningMessage,
            setMessage: setWarningMessage,
            set: setWarning
        },
        loading: {
            show: showLoading,
            setShow: setShowLoading
        },
        alert: {
            show: showAlert,
            setShow: setShowAlert,
            title: alertTitle,
            setTitle: setAlertTitle,
            message: alertMessage,
            setMessage: setAlertMessage,
            id: alertValueId,
            setId: setAlertValueId,
            set: setAlert1
        },
        alert2: {
            show: showAlert2,
            setShow: setShowAlert2,
            title: alert2Title,
            setTitle: setAlert2Title,
            message: alert2Message,
            setMessage: setAlert2Message,
            id: alert2ValueId,
            setId: setAlert2ValueId
        },

    }
    return <NotificationsContext.Provider value={context}>
        {children}
    </NotificationsContext.Provider>
}

export default NotificationsContext