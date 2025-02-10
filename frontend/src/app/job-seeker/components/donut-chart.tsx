"use client"

import { useEffect, useRef } from "react"

interface ChartData {
  value: number
  label: string
  color: string
}

interface DonutChartProps {
  data: ChartData[]
}

export default function DonutChart({ data }: DonutChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    const total = data.reduce((sum, item) => sum + item.value, 0)
    let currentAngle = -0.5 * Math.PI // Start at top

    data.forEach((item) => {
      const sliceAngle = (2 * Math.PI * item.value) / total

      ctx.beginPath()
      ctx.arc(60, 60, 50, currentAngle, currentAngle + sliceAngle)
      ctx.lineTo(60, 60)
      ctx.fillStyle = item.color
      ctx.fill()

      currentAngle += sliceAngle
    })
  }, [data])

  return <canvas ref={canvasRef} width="120" height="120" />
}

