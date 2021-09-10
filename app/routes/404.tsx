import type { MetaFunction } from "remix"

export let meta: MetaFunction = () => {
  return { title: "404" }
}

export default function FourOhFour() {
  return (
    <div>
      <h1>oops lol</h1>
      <p>nothing here!</p>
    </div>
  )
}
