import {
  LogoutIcon,
  ViewGridAddIcon,
  ViewGridIcon,
} from "@heroicons/react/solid"
import clsx from "clsx"
import React from "react"
import { Form, Link } from "remix"
import { Button } from "~/modules/dom/Button"
import { CreateBucketButton } from "../bucket/CreateBucketButton"
import { fadedButtonClass, solidButtonClass } from "../ui/button"
import { containerClass } from "../ui/container"
import { inlineIconClass, leftButtonIconClass } from "../ui/icon"

export function AppHeader({ user }: { user: { name: string } | undefined }) {
  return (
    <div className="shadow bg-slate-800">
      <header
        className={clsx(
          containerClass,
          "flex flex-wrap items-center justify-between py-6 gap-x-8 gap-y-2",
        )}
      >
        <h1 className="text-4xl font-light">
          <Link to="/">
            <ViewGridIcon className="inline-block w-8 translate-y-[-2px] mr-[-4px]" />{" "}
            <span>thoughtbucket</span>
          </Link>
        </h1>

        {user && (
          <nav className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <p>hi, {user.name}!</p>
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
              <Form action="/logout" method="post">
                <Button type="submit" className={fadedButtonClass}>
                  <LogoutIcon className={inlineIconClass} /> log out
                </Button>
              </Form>
              <CreateBucketButton className={solidButtonClass}>
                <ViewGridAddIcon className={leftButtonIconClass} /> new bucket
              </CreateBucketButton>
            </div>
          </nav>
        )}
      </header>
    </div>
  )
}
