import { useRouter } from "next/router"
import React from "react"
import { Button, ButtonProps } from "../dom/Button"

export function CreateBucketButton({ ...props }: ButtonProps) {
  const router = useRouter()
  return (
    <Button
      {...props}
      onClick={() => {
        const name = window.prompt("name?")
        if (name) router.push(`/buckets/create?name=${name}`)
      }}
    />
  )
}
