import React from 'react';

const Logout = () => {
    const handleLogout = () => {
        // Clear user session tokens or other relevant data
        localStorage.removeItem('userToken'); // For local storage
        // document.cookie = 'userToken=; Max-Age=-99999999;'; // For cookies

        // Redirect to Azure AD B2C logout URL to ensure complete sign-out
        const azureLogoutUrl = `https://73bc0c96-da02-4596-acb7-953c57ed55ac.b2clogin.com/73bc0c96-da02-4596-acb7-953c57ed55ac.onmicrosoft.com/oauth2/v2.0/logout?p=B2X_1_myfilebaby_sign_up&post_logout_redirect_uri=${encodeURIComponent(window.location.origin)}`;
        window.location.href = azureLogoutUrl;
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default Logout;
