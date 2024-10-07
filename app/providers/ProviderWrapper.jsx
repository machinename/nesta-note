// ProviderWrapper.js
import { AppProvider } from './AppProvider';

const ProviderWrapper = ({ children }) => {
    return (
        <AppProvider>
            {children}
        </AppProvider>
    );
};

export default ProviderWrapper;
