import React from 'react';
import './App.css';
import TenantFileGallery from './TenantFileGallery';
import logo from './logo.png';
import FileUploadPage from './FileUploadPage';
import ManifestGenerator from "./ManifestGenerator";
import ManifestRetriever from "./ManifestRetriever";
import caifoj from "./cai-foj-800.png";
import { MsalProvider, useMsal, useIsAuthenticated } from "@azure/msal-react";
import msalInstance from "./authConfig";
import Logout from "./Logout";


function SignInButton() {
    const { instance } = useMsal();
    const handleLogin = () => {
        instance.loginRedirect().catch(e => {
            console.error(e);
        });
    };

    return <button onClick={handleLogin}>Sign In</button>;
}

function AppContent() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isAuthenticated = useIsAuthenticated();
    const { accounts } = useMsal();
    const userName = isDevelopment ? "kilroy@uark.edu" : accounts?.[0]?.username;

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} alt="my.file.baby... MINE!" className="responsive"/>
                {isAuthenticated || isDevelopment ? (
                    <p>
                        <ManifestRetriever />
                        <TenantFileGallery userName={userName} />
                        <ManifestGenerator />
                        <FileUploadPage userName={userName} />
                        <p className={"Logout"}><Logout /></p>
                    </p>
                ) : (
                    <p className={"SignIn"}><SignInButton /></p>
                )}
            </header>
            <footer className="footer">
                <p>
                    <a href="https://file.baby">About File Baby</a>
                </p>
                <p>
                    <img src={caifoj} alt="Friends of Justin" className="responsive" />
                </p>
                <p>
                    To inspect your content, use <a href="https://contentcredentials.org/verify" target="_blank" rel="noopener noreferrer">contentcredentials.org/verify</a>
                </p>
                <p>
                    &copy; 2023-2024, <a href="https://friendsofjustin.knowbots.org">Friends of Justin</a>
                </p>
            </footer>
        </div>
    );
}

function App() {
    return (
        <MsalProvider instance={msalInstance}>
            <AppContent />
        </MsalProvider>
    );
}

export default App;
