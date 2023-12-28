
import React from 'react';

const Logout = () => {
    // Define your Azure AD tenant ID and the post logout redirect URI
    const tenantId = 'cecf9ab2-8682-4ad6-9f85-3812fe5efba0';
    const postLogoutRedirectUri = 'https://dev-my.file.baby'; // Adjust as needed

    // Define the function to handle the logout
    const handleLogout = () => {
        // Construct the Azure AD logout URL
        const logoutUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/logout?post_logout_redirect_uri=${encodeURIComponent(postLogoutRedirectUri)}`;
        // Redirect to the Azure AD logout endpoint
        window.location.href = logoutUrl;
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default Logout;

