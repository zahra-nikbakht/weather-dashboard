<script setup>
import SearchBar from "./SearchBar.vue"
import DailyForecast from "./DailyForecast.vue"
import { computed } from "vue"


const props = defineProps({
  weather: Object,
  forecast: Array,
  air: Object,
  city: String,
  loading: Boolean,
  error: String
})


const emit = defineEmits(["search-city"])

const localTime = computed(() => {
  if (!props.weather) return ""
  const now = Date.now() / 1000
  const offset = props.weather.timezone ?? 0
  return new Date((now + offset) * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  })
})

const formattedDateTime = computed(() => {
  if (!props.weather) return ""

  const now = Date.now() / 1000
  const offset = props.weather.timezone ?? 0
  const d = new Date((now + offset) * 1000)

  const weekday = d.toLocaleDateString("en-US", { weekday: "short" })
  const date = d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  })

  return `${weekday} , ${date} • ${localTime.value}`
})

const cityLine = computed(() => {
  if (!props.weather) return ""
  const name = props.weather.name
  const country = props.weather.sys?.country
  return [name, country].filter(Boolean).join(", ")
})

const longDescription = computed(() => {
  if (!props.weather) return ""

  const w = props.weather.weather[0].description
  const temp = Math.round(props.weather.main.temp)
  const feels = Math.round(props.weather.main.feels_like)
  const humidity = props.weather.main.humidity
  const wind = props.weather.wind.speed

  return `
    Today in ${props.weather.name}, conditions will be ${w}. 
    The temperature is around ${temp}°C but feels like ${feels}°C due to humidity at ${humidity}%. 
    Wind speeds remain around ${wind} m/s, which may increase the cold sensation.
    Throughout the day, weather is expected to stay similar with no major changes.
  `
})

</script>

<template>
  <div class="h-full flex flex-col justify-between p-8 text-white justify-between">

    <div class="text-l uppercase font-medium ">National Weather</div>
    


    <!-- INFO -->
    <div class="space-y-4 mt-10">

      <p class="text-sm text-gray-200">
        <span v-if="weather">
          Weather Forecast
        </span>
      </p>

      <h2 class="text-5xl font-light capitalize">
        {{ cityLine }}
      </h2>

        <p class="text-sm text-gray-200">
        <span v-if="weather">
            {{ formattedDateTime }}
        </span>
        </p>

        <div class="text-gray-200 leading-relaxed whitespace-pre-line">
        {{ longDescription }}
        </div>


    </div>



    <!-- DAILY FORECAST -->
    <div class="mt-8">
      <DailyForecast :forecast="forecast" />
    </div>

  </div>
</template>
