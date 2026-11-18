import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

// Draws a Chart.js chart on a canvas. The chart is rebuilt when the data changes.
// onClick (optional) gets the label of the slice or bar that was clicked.
export default function ChartCanvas({ type, data, options, onClick }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const chart = new Chart(canvasRef.current, {
      type,
      data,
      options: {
        ...options,
        onClick: (event, elements) => {
          if (onClick && elements.length > 0) {
            onClick(data.labels[elements[0].index])
          }
        },
      },
    })
    return () => chart.destroy()
  }, [type, data, options, onClick])

  return <canvas ref={canvasRef} />
}
