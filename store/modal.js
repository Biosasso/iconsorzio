import { createContext, useState } from "react";

const ModalContext = createContext({
    show: false,
    title: null,
    message: null,
    function: null,
})

export function ModalContextProvider({ children }) {

    const [showAlert, setShowAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertFunction, setAlertFunction] = useState(false);


    function setAlert(state, title, message) {
        setShowAlert(state);
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertFunction(clickFunction);
    }


    const context = {
        alert: {
            show: showAlert,
            setShow: setShowAlert,
            title: alertTitle,
            setTitle: setAlertTitle,
            message: alertMessage,
            setMessage: setAlertMessage,
            clickFunction: alertFunction,
            setClickFunction: setAlertFunction,
            set: setAlert
        },

    }
    return <ModalContext.Provider value={context}>
        {children}
    </ModalContext.Provider>
}

export default ModalContext