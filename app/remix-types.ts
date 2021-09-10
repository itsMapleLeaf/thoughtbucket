import { Params } from "react-router-dom"
import { AppLoadContext, json, redirect } from "remix"
import { Awaitable } from "./types"

export type TypedLoaderFunction<Data> = (args: {
  request: Request
  context: AppLoadContext
  params: Params
}) => Awaitable<TypedResponse<Data> | Data>

export type TypedResponse<Data> = Response & { __data: Data }

export const typedJson = <Data>(data: Data, init?: RequestInit | number) =>
  json(data, init) as TypedResponse<Data>

export const typedRedirect = (url: string, options?: RequestInit | number) =>
  redirect(url, options) as TypedResponse<never>
