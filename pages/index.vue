<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"
  >
    <div class="max-w-md w-full mx-4">
      <div class="text-center mb-8">
        <div
          class="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4"
        >
          <CubeIcon class="h-8 w-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Inventory by D<span class="text-blue-900 text-5xl">A</span>v<span
            class="text-blue-900 text-5xl"
            >i</span
          >t
        </h1>
        <p class="text-gray-600">Manage your products and inventory stock</p>
      </div>

      <div class="card space-y-4">
        <h2 class="text-xl font-semibold text-gray-900 text-center">
          Get Started
        </h2>
        <p class="text-gray-600 text-center text-sm">
          Sign in to access your inventory dashboard and start managing your
          products.
        </p>

        <div class="space-y-3">
          <NuxtLink
            to="/auth/login"
            class="btn-primary w-full block text-center"
          >
            Sign In
          </NuxtLink>
          <NuxtLink
            to="/auth/register"
            class="btn-secondary w-full block text-center"
          >
            Register
          </NuxtLink>
        </div>
      </div>
      <!-- below this code consist of a grid layout for whatever u wanna add -->
      <!-- <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div class="bg-white/50 rounded-lg p-4">
          <ArchiveBoxIcon class="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <h3 class="font-medium text-gray-900">Product Management</h3>
          <p class="text-sm text-gray-600">Add and organize products</p>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { CubeIcon } from '@heroicons/vue/24/outline';

useHead({
  title: 'Inventory Manager - Home',
});
</script>
