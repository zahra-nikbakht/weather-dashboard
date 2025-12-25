<script setup>
import { Line } from "vue-chartjs"
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip
} from "chart.js"

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip)

const props = defineProps({
  hourly: Array
})


const labels = props.hourly.map(h => {
  const d = new Date(h.dt * 1000)
  return d.toLocaleTimeString([], { hour: "numeric" })
})


const temps = props.hourly.map(h => Math.round(h.main?.temp ?? h.temp))


const tempLabelPlugin = {
  id: "tempLabelPlugin",
  afterDraw(chart) {
    const { ctx } = chart
    ctx.save()
    ctx.font = "12px Inter, sans-serif"
    ctx.fillStyle = "white"
    ctx.textAlign = "center"

    const meta = chart.getDatasetMeta(0)
    meta.data.forEach((point, i) => {
      const value = temps[i] + "°"
      ctx.fillText(value, point.x, point.y - 12)
    })

    ctx.restore()
  }
}

const data = {
  labels,
  datasets: [
    {
      data: temps,
      borderWidth: 2,
      tension: 0.35,
      pointRadius: 5,
      pointBackgroundColor: "white",
      pointBorderColor: "#ffffffaa",
      borderColor: "#ffffffdd",
      fill: true,
      backgroundColor: (ctx) => {
        const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 160)
        g.addColorStop(0, "rgba(255,255,255,0.18)")
        g.addColorStop(1, "rgba(255,255,255,0)")
        return g
      }
    }
  ]
}

const options = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false }
  },
  scales: {
    x: {
      ticks: {
        color: "rgba(255,255,255,0.8)",
        font: { size: 11 },
      },
      grid: {
        color: "rgba(255,255,255,0.1)"
      }
    },
    y: {
      ticks: {
        color: "rgba(255,255,255,0.8)",
        font: { size: 11 },
        callback: (v) => v + "°"
      },
      grid: {
        color: "rgba(255,255,255,0.1)"
      }
    }
  }
}
</script>

<template>
  <div class="bg-white/10 p-5 rounded-2xl border border-white/10 flex justify-around h-[30%] flex items-center">
    <Line
      :data="data"
      :options="options"
      :plugins="[tempLabelPlugin]"
      height="130"
    />
  </div>
</template>
