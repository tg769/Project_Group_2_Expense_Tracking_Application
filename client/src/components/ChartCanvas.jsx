import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

// Draws a Chart.js chart on a canvas. The chart is rebuilt when the data changes.
export default function ChartCanvas({ type, data, options }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const chart = new Chart(canvasRef.current, { type, data, options })
    return () => chart.destroy()
  }, [type, data, options])

  return <canvas ref={canvasRef} />
}
