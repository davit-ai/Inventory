<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full mx-4">
      <div class="card">
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Register</h2>
          <p class="text-gray-600 mt-2">Access your inventory dashboard</p>
        </div>

        <!-- Registration Form -->
        <form
          @submit.prevent="handleSignUp"
          class="space-y-4 mt-6 pt-6 border-t border-gray-200"
        >
          <h3 class="text-lg font-semibold text-gray-900">Create Account</h3>

          <div>
            <label class="label">Full Name (Optional)</label>
            <input
              v-model="name"
              type="text"
              class="input-field"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label class="label">Email Address</label>
            <input
              v-model="registerEmail"
              type="email"
              required
              class="input-field"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label class="label">Password</label>
            <input
              v-model="registerPassword"
              type="password"
              required
              minlength="6"
              class="input-field"
              placeholder="Enter your password (min 6 characters)"
            />
          </div>

          <button type="submit" :disabled="loading" class="btn-primary w-full">
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>

        <div
          v-if="error"
          class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { login, register, loading } = useAuth();

const email = ref('');
const password = ref('');
const name = ref('');
const registerEmail = ref('');
const registerPassword = ref('');
const error = ref('');

const handleSignUp = async () => {
  error.value = '';
  const result = await register(
    registerEmail.value,
    registerPassword.value,
    name.value
  );
  if (!result.success) {
    error.value = result.error;
  } else {
    // Optionally, you can auto-login after registration
    email.value = registerEmail.value;
    password.value = registerPassword.value;
    await handleSignIn();
  }
};

useHead({
  title: 'Register - Inventory Manager',
});
</script>
