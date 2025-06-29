export const useAuth = () => {
  const user = ref(null);
  const loading = ref(false);

  const login = async (email, password) => {
    loading.value = true;
    console.log('Attempting to log in with email:', email);
    console.log('Attempting to log in with password:', password);
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      console.log('Login response:', response);

      user.value = response.user;
      await navigateTo('/dashboard');
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.data?.message || 'Login faileeeeed',
      };
    } finally {
      loading.value = false;
    }
  };

  const register = async (email, password, name) => {
    loading.value = true;
    try {
      const response = await $fetch('/api/auth/register', {
        method: 'POST',
        body: { email, password, name },
      });

      user.value = response.user;
      await navigateTo('/dashboard');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error.data?.message ||
          error.statusMessage ||
          error.message ||
          'Registration failed',
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
    console.log('checkAuth: Checking authentication...');
    try {
      const response = await $fetch('/api/auth/me');
      console.log('checkAuth: Response from /api/auth/me:', response);
      user.value = response.user;
      return true;
    } catch (error) {
      console.error('checkAuth: Error occurred:', error);
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
