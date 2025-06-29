<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600">Overview of your inventory</p>
      </div>
      <NuxtLink to="/dashboard/products/new" class="btn-primary">
        Add Product
      </NuxtLink>
    </div>

    <!-- Debug Info (remove in production) -->
    <div v-if="debugInfo" class="card bg-yellow-50 border-yellow-200">
      <h3 class="font-semibold text-yellow-800 mb-2">Debug Information:</h3>
      <pre class="text-sm text-yellow-700">{{
        JSON.stringify(debugInfo, null, 2)
      }}</pre>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="card bg-red-50 border-red-200">
      <h3 class="font-semibold text-red-800 mb-2">Error:</h3>
      <p class="text-red-700">{{ error }}</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="card">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <CubeIcon class="h-6 w-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Products</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ stats.totalProducts }}
            </p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <ChartBarIcon class="h-6 w-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Stock</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ stats.totalStock }}
            </p>
          </div>
        </div>
      </div>

      <!-- <div class="card">
        <div class="flex items-center">
          <div class="p-2 bg-amber-100 rounded-lg">
            <ExclamationTriangleIcon class="h-6 w-6 text-amber-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Low Stock</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.lowStock }}</p>
          </div>
        </div>
      </div> -->

      <div class="card">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <TagIcon class="h-6 w-6 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Categories</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ stats.totalCategories }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Products -->
    <div class="card">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Recent Products</h2>
        <NuxtLink
          to="/dashboard/products"
          class="text-blue-600 hover:text-blue-700 text-sm"
        >
          View All
        </NuxtLink>
      </div>

      <div v-if="recentProducts.length === 0" class="text-center py-8">
        <CubeIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500">
          No products yet. Add your first product to get started!
        </p>
        <NuxtLink
          to="/dashboard/products/new"
          class="btn-primary mt-4 inline-block"
        >
          Add Product
        </NuxtLink>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Product
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Stock
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Price
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in recentProducts" :key="product.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ product.name }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
                >
                  {{ product.category_name || 'Uncategorized' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ product.stock_quantity }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">Rs {{ product.price }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  CubeIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  TagIcon,
} from '@heroicons/vue/24/outline';

const stats = ref({
  totalProducts: 0,
  totalStock: 0,
  lowStock: 0,
  totalCategories: 0,
});

const recentProducts = ref([]);
const error = ref('');
const debugInfo = ref(null);

// Load data
onMounted(async () => {
  try {
    // Test database connection first
    const dbTest = await $fetch('/api/test-db');
    debugInfo.value = dbTest;

    if (!dbTest.success) {
      error.value = `Database Error: ${dbTest.error}`;
      return;
    }

    // Load stats
    const statsData = await $fetch('/api/stats');
    stats.value = statsData;

    // Load recent products
    const productsData = await $fetch('/api/products');
    recentProducts.value = productsData.products.slice(0, 5); // Show only 5 recent products
  } catch (err) {
    console.error('Error loading dashboard data:', err);
    error.value = `Failed to load data: ${err.message || err}`;
  }
});

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
});

useHead({
  title: 'Dashboard - Inventory Manager',
});
</script>
