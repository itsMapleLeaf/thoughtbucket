import { createTestUserCredentials } from "../support/helpers"

describe("feature: buckets", () => {
  it("allows managing buckets", () => {
    const bucketName = `testbucket-${String(Math.random())}`

    // bucket creation requires auth
    cy.request("POST", "/signup", createTestUserCredentials())
    cy.visit("/buckets")

    // creation flow
    cy.findByRole(/button|link/, { name: /new bucket/i }).click()
    cy.findByLabelText(/name/i).type(bucketName)
    cy.findByRole(/button/i, { name: /create/i }).click()

    // need to show the bucket name in a heading
    cy.findByRole("heading", { name: bucketName }).should("exist")
  })
})
