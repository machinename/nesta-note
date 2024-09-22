// ProviderWrapper.js
import { AppProvider } from './AppProvider';
import { AuthProvider } from './AuthProvider';
import { ThemeProvider } from './ThemeProvider';
import { CookieProvider } from './CookieProvider';

const ProviderWrapper = ({ children }) => {
    return (
        <AuthProvider>
            <ThemeProvider>
                <CookieProvider>
                    <AppProvider>
                        {children}
                    </AppProvider>
                </CookieProvider>
            </ThemeProvider>
        </AuthProvider>
    );
};

export default ProviderWrapper;
