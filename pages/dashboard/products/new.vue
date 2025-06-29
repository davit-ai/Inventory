<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center">
      <NuxtLink to="/dashboard/products" class="text-gray-400 hover:text-gray-600 mr-4">
        <ArrowLeftIcon class="h-5 w-5" />
      </NuxtLink>
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p class="text-gray-600">Create a new product in your inventory</p>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="card bg-red-50 border-red-200">
      <h3 class="font-semibold text-red-800 mb-2">Error:</h3>
      <p class="text-red-700">{{ error }}</p>
    </div>

    <!-- Product Form -->
    <div class="card">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Product Name -->
          <div>
            <label class="label">Product Name *</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="input-field"
              placeholder="Enter product name"
            />
          </div>

          <!-- SKU -->
          <div>
            <label class="label">SKU (Optional)</label>
            <input
              v-model="form.sku"
              type="text"
              class="input-field"
              placeholder="Enter SKU"
            />
          </div>

          <!-- Category -->
          <div>
            <label class="label">Category</label>
            <select v-model="form.category_id" class="input-field">
              <option value="">Select a category</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <!-- Price -->
          <div>
            <label class="label">Price *</label>
            <input
              v-model="form.price"
              type="number"
              step="0.01"
              min="0"
              required
              class="input-field"
              placeholder="0.00"
            />
          </div>

          <!-- Stock Quantity -->
          <div>
            <label class="label">Stock Quantity *</label>
            <input
              v-model="form.stock_quantity"
              type="number"
              min="0"
              required
              class="input-field"
              placeholder="0"
            />
          </div>

          <!-- Minimum Stock Level -->
          <div>
            <label class="label">Minimum Stock Level</label>
            <input
              v-model="form.min_stock_level"
              type="number"
              min="0"
              class="input-field"
              placeholder="5"
            />
          </div>
        </div>

        <!-- Description -->
        <div>
          <label class="label">Description</label>
          <textarea
            v-model="form.description"
            rows="3"
            class="input-field"
            placeholder="Enter product description"
          ></textarea>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end space-x-3">
          <NuxtLink to="/dashboard/products" class="btn-secondary">
            Cancel
          </NuxtLink>
          <button
            type="submit"
            :disabled="loading"
            class="btn-primary"
          >
            {{ loading ? 'Creating...' : 'Create Product' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

const form = ref({
  name: '',
  description: '',
  price: '',
  stock_quantity: '',
  min_stock_level: 5,
  category_id: '',
  sku: ''
})

const categories = ref([])
const loading = ref(false)
const error = ref('')

// Load categories
onMounted(async () => {
  try {
    const data = await $fetch('/api/categories')
    categories.value = data.categories
  } catch (err) {
    console.error('Error loading categories:', err)
    error.value = `Failed to load categories: ${err.message || err}`
  }
})

// Handle form submission
const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''

    const productData = {
      name: form.value.name,
      description: form.value.description,
      price: parseFloat(form.value.price),
      stock_quantity: parseInt(form.value.stock_quantity),
      min_stock_level: parseInt(form.value.min_stock_level) || 5,
      category_id: form.value.category_id || null,
      sku: form.value.sku || null
    }

    await $fetch('/api/products', {
      method: 'POST',
      body: productData
    })

    // Redirect to products list
    await navigateTo('/dashboard/products')
  } catch (err) {
    console.error('Error creating product:', err)
    error.value = err.data?.message || err.message || 'Failed to create product'
  } finally {
    loading.value = false
  }
}

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard'
})

useHead({
  title: 'Add Product - Inventory Manager'
})
</script>