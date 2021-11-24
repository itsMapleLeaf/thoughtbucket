import { nanoid } from "nanoid"
import { createTestUserCredentials } from "../support/helpers"
import { runWithReload } from "../support/persistenceCheck"

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
    cy.findByRole(/button|link/i, { name: /create/i })
      .click()
      .should("contain.text", "create bucket")
    cy.findByTestId("create-bucket-name").should("exist")

    // now type a name and create
    cy.findByTestId("create-bucket-name").type(bucketName)
    cy.findByRole(/button|link/i, { name: /create/i }).click()

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

    cy.findByRole(/button|link/i, { name: /rename/i }).click()
    cy.findByTestId("edit-bucket-form").within(() => {
      cy.findByLabelText("name").should("be.focused").clear().type(newName)
      cy.findByRole(/button|link/i, { name: /(save|submit|edit)/i }).click()
    })

    cy.findByRole("heading", { name: newName }).should("exist")

    // try again, to make sure we can edit multiple times
    cy.findByRole(/button|link/i, { name: /rename/i }).click()
    cy.findByTestId("edit-bucket-form").within(() => {
      cy.findByLabelText("name").should("be.focused").clear().type(oldName)
      cy.findByRole(/button|link/i, { name: /(save|submit|edit)/i }).click()
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

    cy.findByTestId("bucket-delete-confirm")
      .its("contents")
      .should("include", /delete/i)
    cy.findByTestId("bucket-delete-confirm").click()

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

    runWithReload(() => {
      cy.findByRole("heading", { name: columnName1 }).should("exist")
      cy.findByRole("heading", { name: columnName2 }).should("exist")
    })

    // editing by clicking done button
    const columnName3 = `column-${String(Math.random())}`
    cy.findAllByRole(/button|link/i, { name: /^edit this column$/i })
      .first()
      .click()
    cy.findAllByRole("textbox").contains(columnName1).clear().type(columnName3)
    cy.findAllByRole(/button|link/i, { name: /^save column name$/i })
      .first()
      .click()

    cy.wait(300) // temporary until we can wait for response

    runWithReload(() => {
      cy.findByRole("heading", { name: columnName3 }).should("exist")
    })

    // editing by unfocusing the input
    const columnName4 = `column-${String(Math.random())}`
    cy.findAllByRole(/button|link/i, { name: /^edit this column$/i })
      .first()
      .click()
    cy.findAllByRole("textbox")
      .contains(columnName3)
      .clear()
      .type(columnName4)
      .blur()

    cy.wait(300) // temporary until we can wait for response

    runWithReload(() => {
      cy.findByRole("heading", { name: columnName4 }).should("exist")
    })

    // delete all columns
    cy.findAllByRole("button", { name: /delete.*column/i }).click({
      multiple: true,
    })

    cy.wait(300) // temporary until we can wait for response

    runWithReload(() => {
      cy.findByRole("heading", { name: columnName1 }).should("not.exist")
      cy.findByRole("heading", { name: columnName2 }).should("not.exist")
    })
  })
})
