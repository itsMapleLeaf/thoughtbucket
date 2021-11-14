import type { Observable } from "rxjs"
import { catchError, delay, map, merge, retryWhen } from "rxjs"
import { fromFetch } from "rxjs/fetch"
import { raise, toError } from "../common/helpers"

export type FetchState =
  | { status: "loading" }
  | { status: "success"; response: Response }
  | { status: "error"; error: Error }

export function fetchWithRetry(
  input: string | Request,
  init?: RequestInit,
): Observable<FetchState> {
  return merge(
    [{ status: "loading" as const }],
    fromFetch(input, init).pipe(
      map((response) => {
        if (!response.ok) {
          raise(`${response.status} (${response.statusText})`)
        }
        return { status: "success" as const, response }
      }),
      retryWithDelay(1000),
      catchError((error) => [
        { status: "error" as const, error: toError(error) },
      ]),
    ),
  )
}

type JsonValue =
  | string
  | number
  | boolean
  | null
  | readonly JsonValue[]
  | { [key: string]: JsonValue | undefined }

export function fetchJsonWithRetry(options: {
  url: string
  data: JsonValue
  method: "get" | "post" | "patch" | "put" | "delete"
}): Observable<FetchState> {
  return fetchWithRetry(options.url, {
    method: options.method.toUpperCase(),
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options.data),
  })
}

function retryWithDelay<T>(delayMs: number) {
  return retryWhen<T>((errors) => errors.pipe(delay(delayMs)))
}
