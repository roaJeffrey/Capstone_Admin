import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import AccountDropdown from './AccountDropdown';
import { usePageContext } from './PageContext';

const SidebarLayout = () => {
    const { pageTitle, pageDescription } = usePageContext();

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="relative flex items-center justify-between p-5 bg-gray-100">
                    {/* Dynamic Page Title Section */}
                    <div>
                        <h1 className="text-2xl font-bold pl-5">{pageTitle}</h1>
                        <h3 className="text-gray-500 pl-5">{pageDescription}</h3>
                    </div>

                    {/* Account Dropdown */}
                    <AccountDropdown />

                    {/* Bottom Line */}
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-200 ml-5 mr-5"></span>
                </header>

                {/* Page Content */}
                <main className="flex-1 h-full overflow-hidden">
                    {/* Outlet renders the child routes */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default SidebarLayout;
