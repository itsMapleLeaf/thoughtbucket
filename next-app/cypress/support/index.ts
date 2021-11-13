import "@testing-library/cypress/add-commands"

before(() => {
  cy.exec("pnpx prisma migrate reset --force")
})

beforeEach(() => {
  cy.clearCookies()
})
