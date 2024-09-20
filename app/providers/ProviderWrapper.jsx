import { AppProvider } from './AppProvider';
import { AuthProvider } from './AuthProvider';
import { ThemeProvider } from './ThemeProvider';


const ProviderWrapper = ({ children }) => {
    return (
        <AuthProvider>
            <ThemeProvider>
                <AppProvider>
                    {children}
                </AppProvider>
            </ThemeProvider>
        </AuthProvider>
    );
};

export default ProviderWrapper;