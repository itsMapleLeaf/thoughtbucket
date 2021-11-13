import { nanoid } from "nanoid"
import { createTestUserCredentials } from "../support/helpers"

describe("drag n drop", { retries: 2 }, () => {
  it("supports drag n drop with columns", () => {
    const thoughtNames = [`thought-text-1`, `thought-text-2`, `thought-text-3`]

    cy.request("POST", "/signup", createTestUserCredentials())

    cy.visit({
      method: "POST",
      url: "/buckets",
      body: { name: `bucket-${nanoid()}` },
    })

    cy.location("pathname").then((path) => {
      cy.request("PATCH", path, {
        columns: [
          {
            id: nanoid(),
            name: "column-1",
            thoughts: thoughtNames.map((name) => ({
              id: nanoid(),
              text: name,
            })),
          },
          {
            id: nanoid(),
            name: "column-2",
            thoughts: [],
          },
        ],
      })
    })

    cy.reload()

    cy.findAllByTestId("column-card").eq(0).contains("column-1")
    cy.findAllByTestId("column-card").eq(1).contains("column-2")

    drag({
      target: () =>
        cy.findAllByTestId("column-card").eq(0).findByText("column-1"),
      destination: () => cy.findAllByTestId("column-card").eq(1),
    })

    cy.findAllByTestId("column-card").eq(0).contains("column-2")
    cy.findAllByTestId("column-card").eq(1).contains("column-1")

    drag({
      target: () => cy.findByText("column-2"),
      destination: () => cy.findAllByTestId("column-card").eq(1),
    })

    cy.findAllByTestId("column-card").eq(0).contains("column-1")
    cy.findAllByTestId("column-card").eq(1).contains("column-2")

    drag({
      target: () => cy.findByText("column-2"),
      destination: () => cy.findByText("column-1"),
    })

    cy.findAllByTestId("column-card").eq(0).contains("column-2")
    cy.findAllByTestId("column-card").eq(1).contains("column-1")
  })

  it("supports drag n drop with thought cards", () => {
    const bucketName = `bucket-${nanoid()}`

    const initialThoughts = [
      `thought-text-1`,
      `thought-text-2`,
      `thought-text-3`,
    ]

    cy.request("POST", "/signup", createTestUserCredentials())
    cy.visit({ method: "POST", url: "/buckets", body: { name: bucketName } })

    function setupColumns() {
      cy.location("pathname").then((path) => {
        cy.request("PATCH", path, {
          name: bucketName,
          columns: [
            {
              id: nanoid(),
              name: "column-1",
              thoughts: initialThoughts.map((text) => ({
                id: nanoid(),
                text,
              })),
            },
            {
              id: nanoid(),
              name: "column-2",
              thoughts: [],
            },
          ],
        })
      })
      cy.reload()
    }

    function assertThoughtTexts(columns: string[][]) {
      cy.findAllByTestId("column-card").each((column, index) => {
        cy.wrap(column).within(() => {
          const thoughtTexts = columns[index]

          cy.findAllByTestId("thought-card").should(
            "have.length",
            thoughtTexts.length,
          )

          for (const [index, text] of thoughtTexts.entries()) {
            cy.findAllByTestId("thought-card")
              .eq(index)
              .should("include.text", text)
          }
        })
      })
    }

    setupColumns()

    assertThoughtTexts([initialThoughts, []])

    drag({
      target: () => cy.findAllByTestId("thought-card").eq(0),
      destination: () => cy.findAllByTestId("column-card").eq(1),
      offsetX: -50,
    })

    assertThoughtTexts([initialThoughts.slice(1), [initialThoughts[0]]])

    drag({
      target: () => cy.findAllByTestId("thought-card").eq(2),
      destination: () => cy.findAllByTestId("column-card").eq(0),
      offsetY: 100,
    })

    assertThoughtTexts([[...initialThoughts.slice(1), initialThoughts[0]], []])

    setupColumns()

    drag({
      target: () => cy.findAllByTestId("thought-card").eq(0),
      destination: () => cy.findAllByTestId("thought-card").eq(2),
    })

    assertThoughtTexts([
      [initialThoughts[1], initialThoughts[2], initialThoughts[0]],
      [],
    ])

    drag({
      target: () => cy.findAllByTestId("thought-card").eq(1),
      destination: () => cy.findAllByTestId("thought-card").eq(0),
    })

    assertThoughtTexts([
      [initialThoughts[2], initialThoughts[1], initialThoughts[0]],
      [],
    ])

    drag({
      target: () => cy.findAllByTestId("thought-card").eq(2),
      destination: () => cy.findAllByTestId("thought-card").eq(0),
    })

    assertThoughtTexts([
      [initialThoughts[0], initialThoughts[2], initialThoughts[1]],
      [],
    ])

    // dropping on top of itself shouldn't change order
    drag({
      target: () => cy.findAllByTestId("thought-card").eq(0),
      destination: () => cy.findAllByTestId("thought-card").eq(0),
    })

    assertThoughtTexts([
      [initialThoughts[0], initialThoughts[2], initialThoughts[1]],
      [],
    ])
  })
})

function drag({
  target,
  destination,
  offsetX = 0,
  offsetY = 0,
}: {
  target: () => Cypress.Chainable<JQuery<HTMLElement>>
  destination: () => Cypress.Chainable<JQuery<HTMLElement>>
  offsetX?: number
  offsetY?: number
}) {
  destination().then((targetElement) => {
    const clientX =
      targetElement.position().left + targetElement.width()! / 2 + offsetX
    const clientY =
      targetElement.position().top + targetElement.height()! / 2 + offsetY

    target()
      .trigger("mousedown", { button: 0 })
      .trigger("mousemove", { button: 0, clientX, clientY })
    cy.document()
      .its("body")
      .trigger("mousemove", { button: 0, clientX, clientY })
      .trigger("mouseup", { button: 0, clientX, clientY })
  })
}
