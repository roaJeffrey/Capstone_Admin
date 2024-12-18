import React, { createContext, useContext, useState } from 'react';

// Create Context
const Pagecontext = createContext();

// Context Provider
export const PageProvider = ({ children }) => {
    const [pageTitle, setPageTitle] = useState('');
    const [pageDescription, setPageDescription] = useState('');

    return (
        <Pagecontext.Provider value={{ pageTitle, setPageTitle, pageDescription, setPageDescription }}>
            {children}
        </Pagecontext.Provider>
    );
};

// Custom Hook
export const usePagecontext = () => useContext(Pagecontext);
