import { createTestUserCredentials } from "../support/helpers"

describe("feature: buckets", () => {
  it.only("allows managing buckets", () => {
    const bucketName = `testbucket-${String(Math.random())}`

    // bucket creation requires auth
    cy.request("POST", "/api/auth/signup", createTestUserCredentials())
    cy.visit("/buckets")

    // creation flow
    cy.findByRole(/button|link/, { name: /new bucket/i }).click()
    cy.findByLabelText(/name/i).type(bucketName)
    cy.findByRole("button", { name: /create/i }).click()

    // need to show the bucket name in a heading
    cy.findByRole("heading", { name: bucketName }).should("exist")
  })
})
