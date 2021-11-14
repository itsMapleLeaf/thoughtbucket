const uniqueId = () => String(Math.random()).slice(2)

export function createTestUserCredentials() {
  return {
    name: `testificate-${uniqueId()}`,
    email: `${uniqueId()}@test.com`,
    password: "helloworld",
  }
}
