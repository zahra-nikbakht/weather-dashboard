<script setup>
import AirQuality from "./AirQuality.vue"
import HourlyTempChart from ".//HourlyTempChart.vue"
import SearchBar from "./SearchBar.vue"
import { computed } from "vue"

const props = defineProps({
  weather: Object,
  air: Object,
  hourly: Array,
  city: String,
  loading: Boolean,
  error: String
})

const emit = defineEmits(["search-city"])


</script>


<template>
  <section
    class="w-full h-full lg:h-screen bg-white/10 backdrop-blur-xl p-8 flex flex-col gap-6 shadow-xl border border-white/10 justify-between py-10 md:py-8"
  >

    <!-- SEARCH BAR -->
    <SearchBar
      :city="city"
      :loading="loading"
      :error="error"
      @search="(newCity) => emit('search-city', newCity)"
    />
  
    <!-- Temperature -->
    <div class="mt-2">
      <h2 class="text-6xl font-light">
        {{ weather ? Math.round(weather.main.temp) + "°C" : "---" }}
      </h2>
      <p class="text-xl opacity-80">
        {{ weather?.weather?.[0]?.description }}
      </p>

        <!-- Weather details -->
        <div class="grid grid-cols-2 gap-2 text-sm opacity-90 mt-8">
        <div>Feels like: {{ weather ? weather.main.feels_like + "°C" : "--" }}</div>
        <div>Humidity: {{ weather ? weather.main.humidity + "%" : "--" }}</div>
        <div>Wind: {{ weather ? weather.wind.speed + " m/s" : "--" }}</div>
        <div>Pressure: {{ weather ? weather.main.pressure + " hPa" : "--" }}</div>
        </div>
    </div>




    <AirQuality class="mt-2" :air="air" />

    <HourlyTempChart v-if="hourly && hourly.length" :hourly="hourly"/>

  </section>
</template>
