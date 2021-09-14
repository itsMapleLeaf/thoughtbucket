import { ViewGridAddIcon } from "@heroicons/react/solid"
import type { User } from "@supabase/supabase-js"
import React from "react"
import { useQuery } from "react-query"
import { DocumentTitle } from "../dom/DocumentTitle"
import { solidButtonClass } from "../ui/button"
import { containerClass } from "../ui/container"
import { leftButtonIconClass } from "../ui/icon"
import { BucketSummaryCard } from "./BucketSummaryCard"
import { CreateBucketButton } from "./CreateBucketButton"
import { bucketQueryKey, getBuckets } from "./data"

export function BucketList({ user }: { user: User }) {
  const query = useQuery({
    queryKey: [bucketQueryKey],
    queryFn: () => getBuckets(),
  })

  return (
    <DocumentTitle title="buckets">
      <div className={containerClass}>
        {query.isLoading && <p>loading...</p>}
        <ul className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(16rem,1fr))]">
          {query.data?.map((bucket) => (
            <li key={bucket.id}>
              <BucketSummaryCard bucket={bucket} />
            </li>
          ))}
        </ul>
        {query.data?.length ? null : (
          <div className="py-12 text-center">
            <p className="mb-4 text-xl italic font-light opacity-60">
              no buckets found :(
            </p>
            <CreateBucketButton className={solidButtonClass} user={user}>
              <ViewGridAddIcon className={leftButtonIconClass} /> create a new
              one!
            </CreateBucketButton>
          </div>
        )}
      </div>
    </DocumentTitle>
  )
}
