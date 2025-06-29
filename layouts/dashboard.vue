<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <div class="w-64 bg-white shadow-sm border-r border-gray-200">
      <div class="p-6">
        <div class="flex items-center">
          <CubeIcon class="h-8 w-8 text-blue-600" />
          <h1 class="ml-2 text-xl font-bold text-gray-900">Inventory</h1>
        </div>
      </div>

      <nav class="mt-6">
        <div class="px-3">
          <NuxtLink
            to="/dashboard"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            :class="
              $route.path === '/dashboard'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700'
            "
          >
            <HomeIcon class="h-5 w-5 mr-3" />
            Dashboard
          </NuxtLink>

          <NuxtLink
            to="/dashboard/products"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            :class="
              $route.path.startsWith('/dashboard/products')
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700'
            "
          >
            <ArchiveBoxIcon class="h-5 w-5 mr-3" />
            Products
          </NuxtLink>

          <NuxtLink
            to="/dashboard/categories"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            :class="
              $route.path.startsWith('/dashboard/categories')
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700'
            "
          >
            <TagIcon class="h-5 w-5 mr-3" />
            Categories
          </NuxtLink>
        </div>
      </nav>

      <!-- User menu -->
      <div class="absolute bottom-0 w-64 p-4 border-t border-gray-200">
        <div class="flex items-center">
          <div
            class="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center"
          >
            <span class="text-white text-sm font-medium">{{
              userInitial
            }}</span>
          </div>
          <div class="ml-3 flex-1">
            <p class="text-sm font-medium text-gray-900">{{ userName }}</p>
            <button
              @click="handleSignOut"
              class="text-xs text-gray-500 hover:text-gray-700"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex-1 overflow-auto">
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import {
  CubeIcon,
  HomeIcon,
  ArchiveBoxIcon,
  TagIcon,
} from '@heroicons/vue/24/outline';

const { user, logout, checkAuth } = useAuth();

onMounted(() => {
  checkAuth();
});

const userName = computed(
  () => user.value?.name || user.value?.email || 'User'
);
const userInitial = computed(() => userName.value.charAt(0).toUpperCase());

const handleSignOut = async () => {
  await logout();
};
</script>
