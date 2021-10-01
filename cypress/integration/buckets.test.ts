import { nanoid } from "nanoid"
import { createTestUserCredentials } from "../support/helpers"
import { persistenceCheck } from "../support/persistenceCheck"

describe("buckets", () => {
  it("has a ui to create buckets", { retries: 1 }, () => {
    const bucketName = `testbucket-${String(Math.random())}`

    // bucket creation requires auth
    cy.request("POST", "/signup", createTestUserCredentials())
    cy.visit("/buckets")

    // creation flow
    cy.findByRole(/button|link/, { name: /new bucket/i }).click()

    // test that we can't continue without a name
    cy.findByTestId("create-bucket-name").clear()
    cy.findByRole(/button/i, { name: /create/i })
      .click()
      .should("contain.text", "create bucket")
    cy.findByTestId("create-bucket-name").should("exist")

    // now type a name and create
    cy.findByTestId("create-bucket-name").type(bucketName)
    cy.findByRole(/button/i, { name: /create/i }).click()

    // need to show the bucket name in a heading
    cy.findByRole("heading", { name: bucketName }).should("exist")
  })

  it("supports renaming", () => {
    const oldName = `testbucket-${nanoid()}`
    const newName = `testbucket-${nanoid()}`

    cy.request("POST", "/signup", createTestUserCredentials())
    cy.visit("/buckets", {
      method: "POST",
      body: { name: oldName },
      headers: { "Content-Type": "application/json" },
    })

    cy.findByRole("heading", { name: oldName }).should("exist")

    cy.findByRole(/button/i, { name: /rename/i }).click()
    cy.findByTestId("edit-bucket-form").within(() => {
      cy.findByLabelText("name").should("be.focused").clear().type(newName)
      cy.findByRole(/button/i, { name: /(save|submit|edit)/i }).click()
    })

    cy.findByRole("heading", { name: newName }).should("exist")

    // try again, to make sure we can edit multiple times
    cy.findByRole(/button/i, { name: /rename/i }).click()
    cy.findByTestId("edit-bucket-form").within(() => {
      cy.findByLabelText("name").should("be.focused").clear().type(oldName)
      cy.findByRole(/button/i, { name: /(save|submit|edit)/i }).click()
    })

    cy.findByRole("heading", { name: oldName }).should("exist")
  })

  it("lists created buckets", () => {
    const bucketNames = [
      `testbucket-${String(Math.random())}`,
      `testbucket-${String(Math.random())}`,
      `testbucket-${String(Math.random())}`,
    ]

    // bucket creation requires auth
    cy.request("POST", "/signup", createTestUserCredentials())

    // create some buckets
    for (const name of bucketNames) {
      cy.request("POST", "/buckets", { name })
    }

    // check that all buckets are listed and lead to their detail pages
    for (const name of bucketNames) {
      cy.visit("/buckets")
      cy.findByRole("link", { name: (n) => n.includes(name) }).click()
      cy.location("pathname").should("match", /\/buckets\/\w+$/)
    }
  })

  it("supports deletion from detail page", () => {
    const bucketName = `bucket-${String(Math.random())}`

    cy.request("POST", "/signup", createTestUserCredentials())
    cy.visit({ method: "POST", url: "/buckets", body: { name: bucketName } })

    cy.findByTestId("bucket-page-delete")
      .click()
      .its("contents")
      .should("include", /delete/i)

    cy.findByRole("button", { name: /delete/i }).click()
    cy.location("pathname").should("eq", "/buckets")
    cy.findByText(bucketName).should("not.exist")
  })

  it("supports managing columns", { retries: 1 }, () => {
    const bucketName = `bucket-${String(Math.random())}`

    cy.request("POST", "/signup", createTestUserCredentials())
    cy.visit({ method: "POST", url: "/buckets", body: { name: bucketName } })

    // submit by pressing enter
    const columnName1 = `column-${String(Math.random())}`
    cy.findByPlaceholderText(/new column/i).type(`${columnName1}{enter}`)

    // submit by clicking the submit button
    const columnName2 = `column-${String(Math.random())}`
    cy.findByPlaceholderText(/new column/i).type(`${columnName2}`)
    cy.findByRole("button", { name: /add column/i }).click()

    persistenceCheck(() => {
      cy.findByRole("heading", { name: columnName1 }).should("exist")
      cy.findByRole("heading", { name: columnName2 }).should("exist")
    })

    // delete all columns
    cy.findAllByRole("button", { name: /delete.*column/i }).click({
      multiple: true,
    })

    persistenceCheck(() => {
      cy.findByRole("heading", { name: columnName1 }).should("not.exist")
      cy.findByRole("heading", { name: columnName2 }).should("not.exist")
    })
  })

  it("supports managing thoughts", () => {
    const bucketName = `bucket-${String(Math.random())}`
    const thought1 = `thought-text-${String(Math.random())}`
    const thought2 = `thought-text-${String(Math.random())}`

    cy.request("POST", "/signup", createTestUserCredentials())
    cy.visit({ method: "POST", url: "/buckets", body: { name: bucketName } })

    cy.findByPlaceholderText(/new column/i).type(`column{enter}`)

    cy.findByPlaceholderText(/new thought/i).type(thought1)
    cy.findByRole("button", { name: /add thought/i }).click()
    cy.findByPlaceholderText(/new thought/i).type(thought2)
    cy.findByRole("button", { name: /add thought/i }).click()

    // check that the last thought is at the top
    persistenceCheck(() => {
      cy.findAllByText(/thought-text/i).should("have.length", 2)
      cy.findAllByText(/thought-text/i)
        .first()
        .should("contain", thought2)
      cy.findAllByText(/thought-text/i)
        .eq(1)
        .should("contain", thought1)
    })

    // delete all of the thoughts
    cy.findAllByRole("button", { name: /delete.*thought/i }).click({
      multiple: true,
    })

    persistenceCheck(() => {
      cy.findByText(thought1).should("not.exist")
      cy.findByText(thought2).should("not.exist")
    })
  })
})
