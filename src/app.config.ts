export default defineAppConfig({
    title: 'BI Cloud',
    ui: {
        primary: 'indigo',
        gray: 'cool',
        button: {
            default: {
                loadingIcon: 'i-mdi-loading',
            },
        },
        table: {
            loadingState: {
                icon: 'i-mdi-loading',
                label: 'Loading',
            },
            emptyState: {
                icon: 'i-mdi-database-off-outline',
                label: 'No data found.',
            },
        },
    },
});
