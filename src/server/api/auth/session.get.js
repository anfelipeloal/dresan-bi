export default eventHandler(async (event) => {
    const sesion = await useAuthSession(event);
    return sesion.data;
});
