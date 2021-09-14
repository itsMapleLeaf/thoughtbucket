import type { ComponentPropsWithoutRef, ReactNode } from "react"
import React from "react"
import { textInputClass } from "./input"

type TextInputFieldProps = ComponentPropsWithoutRef<"input"> & {
  label: ReactNode
}

export function TextInputField({ label, ...props }: TextInputFieldProps) {
  return (
    <label className="block w-full">
      <div className="text-sm font-semibold">{label}</div>
      <input className={textInputClass} {...props} />
    </label>
  )
}

TextInputField.Email = function EmailField(
  props: Partial<TextInputFieldProps>,
) {
  return (
    <TextInputField
      label="email"
      type="email"
      placeholder="Email"
      autoComplete="email"
      {...props}
    />
  )
}

TextInputField.Password = function PasswordField({
  isNewPassword,
  ...props
}: Partial<TextInputFieldProps> & { isNewPassword: boolean }) {
  return (
    <TextInputField
      label="password"
      type="password"
      placeholder="Password"
      autoComplete={isNewPassword ? "new-password" : "current-password"}
      {...props}
    />
  )
}
