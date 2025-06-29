<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Categories</h1>
        <p class="text-gray-600">Organize your products by categories</p>
      </div>
      <button @click="showAddForm = true" class="btn-primary">
        Add Category
      </button>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="card bg-red-50 border-red-200">
      <h3 class="font-semibold text-red-800 mb-2">Error:</h3>
      <p class="text-red-700">{{ error }}</p>
    </div>

    <!-- Add Category Form -->
    <div v-if="showAddForm" class="card">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Add New Category</h2>
      <form @submit.prevent="handleAddCategory" class="space-y-4">
        <div>
          <label class="label">Category Name *</label>
          <input
            v-model="newCategory.name"
            type="text"
            required
            class="input-field"
            placeholder="Enter category name"
          />
        </div>

        <div>
          <label class="label">Description</label>
          <textarea
            v-model="newCategory.description"
            rows="3"
            class="input-field"
            placeholder="Enter category description"
          ></textarea>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="cancelAdd"
            class="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="btn-primary"
          >
            {{ loading ? 'Adding...' : 'Add Category' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Categories List -->
    <div class="card">
      <div v-if="loading && !showAddForm" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="text-gray-500 mt-2">Loading categories...</p>
      </div>

      <div v-else-if="categories.length === 0" class="text-center py-8">
        <TagIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500 mb-4">No categories found. Add your first category to get started!</p>
        <button @click="showAddForm = true" class="btn-primary">
          Add Category
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="category in categories"
          :key="category.id"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-semibold text-gray-900">{{ category.name }}</h3>
            <span class="text-sm text-gray-500">{{ getProductCount(category.id) }} products</span>
          </div>
          <p class="text-gray-600 text-sm mb-3">{{ category.description || 'No description' }}</p>
          <div class="text-xs text-gray-400">
            Created: {{ formatDate(category.created_at) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { TagIcon } from '@heroicons/vue/24/outline'

const categories = ref([])
const products = ref([])
const loading = ref(true)
const error = ref('')
const showAddForm = ref(false)

const newCategory = ref({
  name: '',
  description: ''
})

// Load categories and products
const loadData = async () => {
  try {
    loading.value = true
    const [categoriesData, productsData] = await Promise.all([
      $fetch('/api/categories'),
      $fetch('/api/products')
    ])
    categories.value = categoriesData.categories
    products.value = productsData.products
  } catch (err) {
    console.error('Error loading data:', err)
    error.value = `Failed to load data: ${err.message || err}`
  } finally {
    loading.value = false
  }
}

// Get product count for a category
const getProductCount = (categoryId) => {
  return products.value.filter(product => product.category_id === categoryId).length
}

// Format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

// Handle add category
const handleAddCategory = async () => {
  try {
    loading.value = true
    error.value = ''

    await $fetch('/api/categories', {
      method: 'POST',
      body: {
        name: newCategory.value.name,
        description: newCategory.value.description
      }
    })

    // Reset form and reload data
    newCategory.value = { name: '', description: '' }
    showAddForm.value = false
    await loadData()
  } catch (err) {
    console.error('Error creating category:', err)
    error.value = err.data?.message || err.message || 'Failed to create category'
  } finally {
    loading.value = false
  }
}

// Cancel add form
const cancelAdd = () => {
  newCategory.value = { name: '', description: '' }
  showAddForm.value = false
  error.value = ''
}

onMounted(() => {
  loadData()
})

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard'
})

useHead({
  title: 'Categories - Inventory Manager'
})
</script>