<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Products</h1>
        <p class="text-gray-600">Manage your inventory products</p>
      </div>
      <NuxtLink to="/dashboard/products/new" class="btn-primary">
        Add Product
      </NuxtLink>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="card bg-red-50 border-red-200">
      <h3 class="font-semibold text-red-800 mb-2">Error:</h3>
      <p class="text-red-700">{{ error }}</p>
    </div>

    <!-- Products List -->
    <div class="card">
      <div v-if="loading" class="text-center py-8">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"
        ></div>
        <p class="text-gray-500 mt-2">Loading products...</p>
      </div>

      <div v-else-if="products.length === 0" class="text-center py-8">
        <ArchiveBoxIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500 mb-4">
          No products found. Add your first product to get started!
        </p>
        <NuxtLink to="/dashboard/products/new" class="btn-primary">
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
                SKU
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
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in products" :key="product.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">
                    {{ product.name }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ product.description }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ product.sku || 'N/A' }}
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
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="
                    product.stock_quantity <= product.min_stock_level
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  "
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{
                    product.stock_quantity <= product.min_stock_level
                      ? 'Low Stock'
                      : 'In Stock'
                  }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <NuxtLink
                  :to="`/dashboard/products/${product.id}/edit`"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Edit
                </NuxtLink>
                <button
                  @click="deleteProduct(product.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArchiveBoxIcon } from '@heroicons/vue/24/outline';

const products = ref([]);
const loading = ref(true);
const error = ref('');

// Load products
const loadProducts = async () => {
  try {
    loading.value = true;
    const data = await $fetch('/api/products');
    products.value = data.products;
  } catch (err) {
    console.error('Error loading products:', err);
    error.value = `Failed to load products: ${err.message || err}`;
  } finally {
    loading.value = false;
  }
};

// Delete product
const deleteProduct = async (productId) => {
  if (!confirm('Are you sure you want to delete this product?')) {
    return;
  }

  try {
    await $fetch(`/api/products/${productId}`, { method: 'DELETE' });
    await loadProducts(); // Reload products
  } catch (err) {
    console.error('Error deleting product:', err);
    error.value = `Failed to delete product: ${err.message || err}`;
  }
};

onMounted(() => {
  loadProducts();
});

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
});

useHead({
  title: 'Products - Inventory Manager',
});
</script>
