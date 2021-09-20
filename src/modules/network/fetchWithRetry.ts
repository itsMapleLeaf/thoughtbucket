import type { Observable } from "rxjs"
import { catchError, merge, of, retry, switchMap } from "rxjs"
import { fromFetch } from "rxjs/fetch"
import { asError, raise } from "../../helpers"

type FetchState =
  | { status: "loading" }
  | { status: "success"; response: Response }
  | { status: "error"; error: Error }

export function fetchWithRetry(
  input: string | Request,
  init?: RequestInit,
): Observable<FetchState> {
  return merge(
    of({ status: "loading" as const }),
    fromFetch(input, init).pipe(
      switchMap(async (response) => {
        if (!response.ok) {
          raise(`${response.status} (${response.statusText})`)
        }
        return { status: "success" as const, response }
      }),
      retry(2),
      catchError((error) => [
        { status: "error" as const, error: asError(error) },
      ]),
    ),
  )
}
