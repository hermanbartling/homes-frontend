import React from 'react';

function CommunicationError(props) {

    const {customHeader, customMessage} = props;

    let header = "Tyvärr, något gick fel i kommunikationen med servern";
    if (customHeader != null) {
        header = customHeader;
    }

    let message = "Ta gärna en skärmdump av denna sida, kontakta sedan supporten.";
    if (customMessage != null) {
        message = customMessage;
    }

    return (
        <div>
            <div className="alert alert-danger" role="alert">
                <h4>{header}</h4>
                <p>
                    {message}
                </p>
            </div>
            <div>{props.error.message}</div>
        </div>
    );
}

export default CommunicationError;