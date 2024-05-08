import React, { useState } from 'react';

interface SampleDialogProps {
    onClose: () => void;
}

const SampleDialog: React.FC<SampleDialogProps> = ({ onClose }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleButtonClick = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        onClose();
    };

    return (
        <div>
            <h1>I'm Dialog from remote app v13</h1>
            <button onClick={handleButtonClick}>Open Dialog</button>
            {isOpen && (
                <div>
                    <h2>Sample Dialog</h2>
                    <p>This is a sample dialog.</p>
                    <button onClick={handleClose}>Close</button>
                </div>
            )}
        </div>
    );
};

export default SampleDialog;