import { useTransition } from "remix"
import type { ButtonProps } from "~/modules/dom/Button"
import { Button } from "~/modules/dom/Button"

export function FormSubmitButton(props: ButtonProps) {
  const { state } = useTransition()
  return <Button type="submit" loading={state !== "idle"} {...props} />
}
