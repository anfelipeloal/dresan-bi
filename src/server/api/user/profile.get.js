export default eventHandler(async (event) => {
    const auth = await requireAuthSession(event);

    return {
        auth,
    };
});
