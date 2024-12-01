import React, { createContext, useContext, useState } from 'react';

// Create Context
const PageContext = createContext();

// Context Provider
export const PageProvider = ({ children }) => {
    const [pageTitle, setPageTitle] = useState('');
    const [pageDescription, setPageDescription] = useState('');

    return (
        <PageContext.Provider value={{ pageTitle, setPageTitle, pageDescription, setPageDescription }}>
            {children}
        </PageContext.Provider>
    );
};

// Custom Hook
export const usePageContext = () => useContext(PageContext);
