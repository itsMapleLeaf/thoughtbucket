import type { DataFunctionArgs } from "@remix-run/server-runtime"
import { json, redirect, useActionData, useLoaderData } from "remix"
import type { JsonValue } from "type-fest"
import type { MaybePromise } from "~/modules/common/types"

export type ResponseTyped<Data> = Response & { __type: Data }

export type DataFunction<Data> = (
  args: DataFunctionArgs,
) => MaybePromise<ResponseTyped<Data> | Data | Response>

export type DataFunctionData<Fn> = Fn extends DataFunction<infer Data>
  ? // if the actual data is a Response object (lol), we should un-infer it
    Response extends Data
    ? unknown
    : Data
  : unknown

export function responseTyped<Data = never>(
  data?: BodyInit,
  init?: ResponseInit | number,
): ResponseTyped<Data> {
  return new Response(
    data,
    typeof init === "number" ? { status: init } : init,
  ) as ResponseTyped<Data>
}

export function jsonTyped<Data extends JsonValue>(
  data: Data,
  init?: number | ResponseInit,
): ResponseTyped<Data> {
  return json(data, init) as ResponseTyped<Data>
}

export function redirectTyped(
  url: string,
  init?: number | ResponseInit | undefined,
) {
  return redirect(url, init) as ResponseTyped<never>
}

export function useLoaderDataTyped<Fn extends DataFunction<unknown>>() {
  return useLoaderData<DataFunctionData<Fn>>()
}

export function useActionDataTyped<Fn extends DataFunction<unknown>>() {
  return useActionData<DataFunctionData<Fn>>()
}
