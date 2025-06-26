export const useAuth = () => {
  const user = ref(null);
  const loading = ref(false);

  const login = async (email, password) => {
    loading.value = true;
    try {
      const { data } = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      });

      user.value = data.user;
      await navigateTo('/dashboard');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.data?.message || 'Login failed',
      };
    } finally {
      loading.value = false;
    }
  };

  const register = async (email, password, name) => {
    loading.value = true;
    try {
      const { data } = await $fetch('/api/auth/register', {
        method: 'POST',
        body: { email, password, name },
      });

      user.value = data.user;
      await navigateTo('/dashboard');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.data?.message || 'Registration failed',
      };
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' });
      user.value = null;
      await navigateTo('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const checkAuth = async () => {
    try {
      const { data } = await $fetch('/api/auth/me');
      user.value = data.user;
      return true;
    } catch (error) {
      user.value = null;
      return false;
    }
  };

  return {
    user: readonly(user),
    loading: readonly(loading),
    login,
    register,
    logout,
    checkAuth,
  };
};
