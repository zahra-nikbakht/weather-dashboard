<script setup>
import { computed } from "vue"

const props = defineProps({
  forecast: {
    type: Array,
    default: () => [],
  },
})


const grouped = computed(() => {
  if (!props.forecast.length) return []

  const days = {}

  props.forecast.forEach((item) => {
    const date = new Date(item.dt * 1000)
    const day = date.toLocaleDateString("en-US", { weekday: "short" })

    if (!days[day]) {
      days[day] = {
        min: item.main.temp_min,
        max: item.main.temp_max,
        icon: item.weather[0].icon,
        dt: item.dt,
      }
    } else {
      days[day].min = Math.min(days[day].min, item.main.temp_min)
      days[day].max = Math.max(days[day].max, item.main.temp_max)
    }
  })

  return Object.entries(days)
    .slice(1, 7)
    .map(([day, obj]) => ({ day, ...obj }))
})
</script>

<template>
  <div class="w-full flex gap-4 mt-10 overflow-x-auto pb-4 flex-wrap justify-center md:justify-start">
    <div
      v-for="d in grouped"
      :key="d.dt"
      class="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col items-center min-w-[100px]"
    >
      <p class="text-sm text-gray-200">{{ d.day }}</p>

      <img
        :src="`https://openweathermap.org/img/wn/${d.icon}@2x.png`"
        class="w-12 h-12"
      />

      <p class="text-white text-sm mt-2">
        <span class="font-semibold">{{ Math.round(d.max) }}°</span>
        /
        <span class="text-gray-300">{{ Math.round(d.min) }}°</span>
      </p>
    </div>
  </div>
</template>
