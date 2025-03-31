export function suppressConsoleErrors() {
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    beforeAll(() => {
        console.error = jest.fn();
        console.warn = jest.fn();
    });
    
    afterAll(() => {
        console.error = originalConsoleError;
        console.warn = originalConsoleWarn;
    });
}