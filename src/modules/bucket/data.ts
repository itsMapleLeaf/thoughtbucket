import { supabaseQuery } from "../supabase/query"

export const bucketQueryKey = "bucket"

export function getBuckets() {
  return supabaseQuery("buckets").select(["id", "name"]).all()
}

export function getBucketDetails(id: string) {
  return supabaseQuery("buckets")
    .select(["id", "name", "createdAt"])
    .eq("id", id)
    .single()
}

export function createBucket(data: {
  name: string
  ownerId: string
}): Promise<{ id: string }> {
  return supabaseQuery("buckets").insert(data).select(["id"]).single()
}

export function deleteBucket(id: string) {
  return supabaseQuery("buckets").delete().eq("id", id).resolve()
}

export function renameBucket(args: { id: string; name: string }) {
  return supabaseQuery("buckets")
    .update({ name: args.name })
    .eq("id", args.id)
    .resolve()
}
