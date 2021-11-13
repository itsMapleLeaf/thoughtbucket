import { cypressEsbuildPreprocessor } from "cypress-esbuild-preprocessor"
import path = require("path")

const pluginConfig: Cypress.PluginConfig = (on, config) => {
  on(
    "file:preprocessor",
    cypressEsbuildPreprocessor({
      esbuildOptions: {
        // optional tsconfig for typescript support and path mapping (see https://github.com/evanw/esbuild for all options)
        tsconfig: path.resolve(__dirname, "../tsconfig.json"),
      },
    }),
  )

  return config
}

export = pluginConfig
