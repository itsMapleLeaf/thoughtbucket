import type { DataFunctionArgs } from "@remix-run/server-runtime"
import { json, redirect, useActionData, useLoaderData } from "remix"
import type { JsonValue } from "type-fest"
import type { Awaited, MaybePromise } from "~/modules/common/types"

export type ResponseTyped<Data> = Response & { __type: Data }

type DataFunction<Data extends JsonValue> = (
  args: DataFunctionArgs,
) => MaybePromise<ResponseTyped<Data> | Data | Response>

type DataFunctionResult<Fn extends DataFunction<JsonValue>> = TypeOfResponse<
  Awaited<ReturnType<Fn>>
>

type TypeOfResponse<Value> = Value extends ResponseTyped<infer Data>
  ? Data
  : Value extends Response
  ? unknown
  : Value

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

export function useLoaderDataTyped<Fn extends DataFunction<JsonValue>>() {
  return useLoaderData<DataFunctionResult<Fn>>()
}

export function useActionDataTyped<Fn extends DataFunction<JsonValue>>() {
  return useActionData<DataFunctionResult<Fn>>()
}
