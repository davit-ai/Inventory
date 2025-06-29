export default defineNuxtRouteMiddleware(async (to, from) => {
  const { checkAuth } = useAuth();

  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    return navigateTo('/auth/login');
  }
});
