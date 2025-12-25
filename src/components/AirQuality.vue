<script setup>
import { computed } from "vue"

const props = defineProps({
  air: Object
})

// AQI mapping
const getAQIInfo = (aqi) => {
  switch (aqi) {
    case 1: return { label: "Good", color: "#22c55e", risk: "Air quality is good." }        // green
    case 2: return { label: "Fair", color: "#84cc16", risk: "Air is acceptable." }          // lime
    case 3: return { label: "Moderate", color: "#eab308", risk: "Sensitive groups be cautious." } // yellow
    case 4: return { label: "Poor", color: "#f97316", risk: "Unhealthy for sensitive people." }  // orange
    case 5: return { label: "Very Poor", color: "#ef4444", risk: "Unhealthy air. Avoid outdoor activity." } // red
    default: return { label: "Unknown", color: "#9ca3af", risk: "No air quality data." }
  }
}

const aqi = computed(() => props.air?.main?.aqi ?? null)
const aqiInfo = computed(() => getAQIInfo(aqi.value))


const pointerPos = computed(() => {
  if (!aqi.value) return 0
  return (aqi.value - 1) / 4 * 100 
})

const components = computed(() => props.air?.components ?? {})
</script>

<template>
  <div class="p-6 rounded-2xl border border-white/20 space-y-5">

    <!-- Title + AQI value -->
    <div class="flex justify-between items-end">
      <div>
        <h3 class="text-sm font-semibold opacity-80">Air Quality Index</h3>
        <p class="text-xs opacity-70 mt-1">{{ aqiInfo.risk }}</p>
      </div>
      <div class="text-right">
        <p class="text-4xl font-light leading-none">{{ aqi ?? "--" }}</p>
        <p class="text-xs opacity-70">{{ aqiInfo.label }}</p>
      </div>
    </div>

    <!-- Linear Gradient AQI Bar -->
    <div class="relative w-full h-4 rounded-full overflow-hidden bg-white/20">
      <!-- Gradient background -->
      <div
        class="absolute inset-0"
        style="
          background: linear-gradient(
            90deg, 
            #22c55e 0%,      /* Good */
            #84cc16 25%,     /* Fair */
            #eab308 50%,     /* Moderate */
            #f97316 75%,     /* Poor */
            #ef4444 100%     /* Very Poor */
          );
        "
      ></div>

      <!-- Pointer -->
      <div
        class="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 bg-white shadow-lg"
        :style="{
          left: `calc(${pointerPos}% - 10px)`,
          borderColor: aqiInfo.color,
          boxShadow: `0 0 10px ${aqiInfo.color}`
        }"
      ></div>
    </div>

    <!-- Pollutant values -->
    <div class="grid grid-cols-2 gap-2 text-xs opacity-90">
      <div>O₃:    <span class="font-semibold">{{ components.o3 ?? "--" }}</span></div>
      <div>NO₂:   <span class="font-semibold">{{ components.no2 ?? "--" }}</span></div>
      <div>SO₂:   <span class="font-semibold">{{ components.so2 ?? "--" }}</span></div>
      <div>CO:    <span class="font-semibold">{{ components.co ?? "--" }}</span></div>
    </div>

  </div>
</template>
