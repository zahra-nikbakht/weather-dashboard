<script setup>
import { onMounted, computed, ref, watch } from "vue"
import WeatherCard from "./components/WeatherCard.vue"
import WeatherDetails from "./components/WeatherDetails.vue"
import { useWeather } from "./composables/useWeather"


const store = useWeather()

const {
  city,
  weather,
  forecast,
  airQuality,
  loading,
  error,
  searchWeather,
  hourly,
  initialLoad,
  isReady,
  loadInitialWeather
} = store

// --- AUTO-LOAD LOCATION ---
onMounted(() => {
  loadInitialWeather()
})


const BASE = import.meta.env.BASE_URL


const loadingBgStyle = computed(() => ({
  backgroundImage: `url(${BASE}images/default.jpg)`,
  backgroundSize: "cover",
  backgroundPosition: "center",
}))


const backgroundImage = computed(() => {
  const file = (() => {
    if (!weather.value) return "default.jpg"

    const main = weather.value.weather?.[0]?.main?.toLowerCase() || ""

    if (main.includes("cloud")) return "cloudy.jpg"
    if (main.includes("rain") || main.includes("haze") || main.includes("fog")) return "rain.jpg"
    if (main.includes("snow")) return "snow.jpg"
    if (main.includes("clear")) return "clear.jpg"


    if (main.includes("storm") || main.includes("thunder")) return "storm.jpg"

    return "default.jpg"
  })()

  return `${BASE}images/${file}`
})

const backgroundStyle = computed(() => ({
  backgroundImage: `url(${backgroundImage.value})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
}))


const handleCitySearch = (newCity) => {
  city.value = newCity
  searchWeather()
}


const toast = ref({ show: false, message: "" })

const showToast = (msg) => {
  toast.value.message = msg
  toast.value.show = true
  setTimeout(() => {
    toast.value.show = false
  }, 4000)
}

watch(error, (val) => {
  if (val) showToast(val)
})
</script>

<template>

  <!-- LOADING -->
  <div
    v-if="initialLoad && !isReady"
    class="fixed inset-0 z-[9999] flex items-center justify-center"
  >
    <div
      class="absolute inset-0 loading-bg-blur"
      :style="loadingBgStyle"
    ></div>

    <div class="absolute inset-0 bg-black/10 backdrop-blur"></div>

    <div class="relative flex flex-col items-center gap-4">
      <div class="loader-ring"></div>
      <p class="loading-text text-l text-white/80 tracking-wide mt-2">
        Loading weather data...
      </p>
    </div>
  </div>


  <div v-else class="min-h-screen w-full" :style="backgroundStyle">
    <div class="min-h-screen bg-black/40 text-white flex flex-col items-center">
      <main class="w-full min-h-fit lg:h-screen flex flex-col md:flex-row items-stretch">
        <div class="md:basis-1/4" style="border-right: 1.5px solid #ffffff33;">
          <WeatherCard
            :weather="weather"
            :air="airQuality"
            :hourly="hourly"
            :city="city.value"
            :loading="loading"
            @search-city="handleCitySearch"
          />
        </div>

        <div class="md:basis-3/4 py-6 md:py-0">
          <div class="w-full h-full">
            <WeatherDetails
              :weather="weather"
              :forecast="forecast"
              :air="airQuality"
            />
          </div>
        </div>
      </main>

      <transition name="fade-slide">
        <div
          v-if="toast.show"
          class="fixed bottom-6 right-6 z-50
                bg-red-500/90 backdrop-blur
                border border-red-400/40
                text-white
                px-4 py-3
                rounded-xl
                min-w-[220px]
                text-base"
        >
          <p class="text-sm font-medium leading-relaxed">
            {{ toast.message }}
          </p>
        </div>
      </transition>
    </div>
  </div>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
}
</style>
