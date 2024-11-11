export default defineEventHandler((event) => {
    if (event.path.includes('/api/')) {
        const request = {
            method: event.method,
            path: event.path,
        };

        console.info('Incomming API request: ', request);
    }
});
