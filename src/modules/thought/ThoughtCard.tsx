import React from "react"

export function ThoughtCard({ thought }: { thought: { text: string } }) {
  return (
    <div className="p-2 bg-gray-700 border-l-4 border-indigo-400 rounded-sm shadow">
      {thought.text}
    </div>
  )
}
