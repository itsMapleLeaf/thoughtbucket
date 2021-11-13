import type { ComponentPropsWithoutRef, ReactNode } from "react"
import React from "react"
import { textInputClass } from "./input"

type TextInputFieldProps = ComponentPropsWithoutRef<"input"> & {
  label: ReactNode
  inputRef?: React.Ref<HTMLInputElement>
}

export function TextInputField({
  label,
  inputRef,
  ...props
}: TextInputFieldProps) {
  return (
    <label className="block w-full">
      <div className="mb-0.5 text-sm font-semibold">{label}</div>
      <input className={textInputClass} {...props} ref={inputRef} />
    </label>
  )
}

TextInputField.Username = function UsernameField(
  props: Partial<TextInputFieldProps>,
) {
  return (
    <TextInputField
      label="username"
      type="text"
      placeholder="supercooluser123"
      autoComplete="name"
      {...props}
    />
  )
}

TextInputField.Email = function EmailField(
  props: Partial<TextInputFieldProps>,
) {
  return (
    <TextInputField
      label="email"
      type="email"
      placeholder="me@email.com"
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
      placeholder="••••••••"
      autoComplete={isNewPassword ? "new-password" : "current-password"}
      {...props}
    />
  )
}
