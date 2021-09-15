import {
  LogoutIcon,
  ViewGridAddIcon,
  ViewGridIcon,
} from "@heroicons/react/solid"
import clsx from "clsx"
import Link from "next/link"
import React from "react"
import { CreateBucketButton } from "../bucket/CreateBucketButton"
import { fadedButtonClass, solidButtonClass } from "../ui/button"
import { containerClass } from "../ui/container"
import { inlineIconClass, leftButtonIconClass } from "../ui/icon"

export function AppHeader({ user }: { user: { name: string } | undefined }) {
  return (
    <div className="bg-gray-800 shadow">
      <header
        className={clsx(
          containerClass,
          "flex flex-wrap items-center justify-between py-6 gap-x-8 gap-y-2",
        )}
      >
        <h1 className="text-4xl font-light">
          <Link href="/">
            <a>
              <ViewGridIcon className="inline-block w-8 translate-y-[-2px] mr-[-4px]" />{" "}
              <span>thoughtbucket</span>
            </a>
          </Link>
        </h1>

        {user && (
          <nav className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <p>hi, {user.name}!</p>
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
              <Link href="/logout">
                <a className={fadedButtonClass}>
                  <LogoutIcon className={inlineIconClass} /> log out
                </a>
              </Link>
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
