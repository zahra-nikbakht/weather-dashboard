import { ref, computed, watch } from "vue"

export function useWeather() {
  const DEFAULT_CITY = "Tehran"
  const LAST_CITY_KEY = "lastCity"

  // --- state ---
  const city = ref("")
  const weather = ref(null)
  const forecast = ref([])
  const hourly = ref([])
  const airQuality = ref(null)

  const loading = ref(false)
  const error = ref("")

  const initialLoad = ref(true)

  const API_KEY = "27baa003d2c452b615bfd88885b584c8"

  // --- helpers ---
  const getLastCity = () => localStorage.getItem(LAST_CITY_KEY) || ""
  const setLastCity = (name) => {
    if (name && name.trim()) localStorage.setItem(LAST_CITY_KEY, name.trim())
  }

  const isNetworkError = (e) => {
    const msg = (e?.message || "").toLowerCase()
    return (
      msg.includes("failed to fetch") ||
      msg.includes("networkerror") ||
      msg.includes("network") ||
      msg.includes("timeout")
    )
  }


  const isReady = computed(() => {
    return !!weather.value && forecast.value.length > 0 && !!airQuality.value
  })


  watch(
    isReady,
    (ready) => {
      if (ready) initialLoad.value = false
    },
    { immediate: true }
  )


  // Fetch current weather by city (old data stays if fail)
  const fetchWeatherByCity = async (name) => {
    const q = (name || "").trim()
    if (!q) return

    loading.value = true
    error.value = ""

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          q
        )}&appid=${API_KEY}&units=metric`
      )

      if (res.status === 404) throw new Error("City not found")
      if (!res.ok) throw new Error("Failed to fetch weather")

      const data = await res.json()

      weather.value = data
      city.value = data.name
      setLastCity(data.name)


      await fetchAirQuality(data.coord.lat, data.coord.lon)
      await fetchForecast(data.name)
    } catch (e) {
      error.value = isNetworkError(e)
        ? "Connection problem. Check VPN/Internet and try again."
        : e.message || "Failed to fetch weather"
    } finally {
      loading.value = false
    }
  }

  // Forecast
  const fetchForecast = async (cityName) => {
    if (!cityName) return

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
          cityName
        )}&appid=${API_KEY}&units=metric`
      )

      if (!res.ok) throw new Error("Failed to fetch forecast")

      const data = await res.json()
      forecast.value = data.list || []
      hourly.value = forecast.value.slice(0, 6)
    } catch (e) {
      console.error("Forecast error:", e)
    }
  }


  // Air quality
  const fetchAirQuality = async (lat, lon) => {
    if (!lat || !lon) return

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      )

      if (!res.ok) throw new Error("Failed to fetch air quality")

      const data = await res.json()
      airQuality.value = data.list?.[0] || null
    } catch (e) {
      console.error("Air quality error:", e)
    }
  }


  const searchWeather = async () => {
    await fetchWeatherByCity(city.value)
  }


  const loadInitialWeather = async () => {
    const last = getLastCity()
    if (last) {
      city.value = last
      await fetchWeatherByCity(last)
      return
    }

    await loadWeatherByLocation()
  }


  const loadWeatherByLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        city.value = DEFAULT_CITY
        fetchWeatherByCity(DEFAULT_CITY).finally(resolve)
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude
          const lon = pos.coords.longitude

          loading.value = true
          error.value = ""

          try {
            const res = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
            )

            if (!res.ok) throw new Error("Failed to fetch location weather")

            const data = await res.json()

            weather.value = data
            city.value = data.name
            setLastCity(data.name)

            await fetchAirQuality(lat, lon)
            await fetchForecast(data.name)
          } catch (e) {
            error.value = isNetworkError(e)
              ? "Connection problem. Check VPN/Internet and try again."
              : e.message || "Failed to load weather for your location"

            if (!weather.value) {
              city.value = DEFAULT_CITY
              await fetchWeatherByCity(DEFAULT_CITY)
            }
          } finally {
            loading.value = false
            resolve()
          }
        },
        async (err) => {
          console.error("Geolocation error:", err)

          error.value = "Location permission denied. Showing default city."

          if (!weather.value) {
            const last = getLastCity()
            const fallback = last || DEFAULT_CITY
            city.value = fallback
            await fetchWeatherByCity(fallback)
          }

          resolve()
        }
      )
    })
  }

  return {
    city,
    weather,
    forecast,
    hourly,
    airQuality,
    loading,
    error,
    initialLoad, 
    isReady,     
    searchWeather,
    loadWeatherByLocation,
    loadInitialWeather,
    fetchWeatherByCity,
  }
}
