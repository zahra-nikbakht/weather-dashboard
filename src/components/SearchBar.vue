<script setup>
const props = defineProps({
  city: String,
  loading: Boolean
})

const emit = defineEmits(["search"])
</script>

<template>
  <div class="w-full">
    <form
    @submit.prevent="emit('search', $event.target.query.value)"
    class="relative flex items-center"
    >

    <svg
        class="absolute left-4 w-5 h-5 text-gray-300 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1.8"
    >
        <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m21 21-4.35-4.35m1.85-5.4a7.25 7.25 0 1 1-14.5 0 7.25 7.25 0 0 1 14.5 0z"
        />
    </svg>


    <input
        name="query"
        :value="city"
        :placeholder="loading ? 'Loading...' : 'Search location...'"
        class="w-full pl-11 pr-4 py-3 rounded-xl
            bg-white/10 border border-white/20
            text-white placeholder-gray-300
            focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    </form>

  </div>
</template>
