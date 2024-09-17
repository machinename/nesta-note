import { AppProvider } from './AppProvider';
import { ThemeProvider } from './ThemeProvider';


const ProviderWrapper = ({ children }) => {
    return (
        <ThemeProvider>
            <AppProvider>
                {children}
            </AppProvider>
        </ThemeProvider>
    );
};

export default ProviderWrapper;