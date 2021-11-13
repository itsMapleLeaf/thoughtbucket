import type { MetaDescriptor } from "remix"
import { joinContentfulStrings } from "~/modules/common/helpers"

const titleSuffix = "thoughtbucket"

export function getAppMeta(title: string): MetaDescriptor {
  return {
    "title": joinContentfulStrings([title, titleSuffix], " | "),
    "description": "a nice and cozy bucket to put all of your thoughts (◕‿◕✿)",
    "theme-color": "#64748b",
  }
}
