import { useNavigate } from "react-router-dom"
import type { ButtonProps } from "~/modules/dom/Button"
import { Button } from "~/modules/dom/Button"

export function BackButton(props: ButtonProps) {
  const navigate = useNavigate()
  return (
    <Button
      {...props}
      onClick={(event) => {
        props.onClick?.(event)
        if (event.defaultPrevented) return
        navigate(-1)
      }}
    />
  )
}
