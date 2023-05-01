import { exclude } from "../../../src/helpers/user";

describe("user helpers - exclude", () => {
  it("password should be undefined after exclude", async () => {
    const createdData = {
      id: 1,
      firstName: "Rich",
      lastName: "Guy",
      email: "hello@prisma.io",
      password: "just_hanging_around",
    };

    const user = exclude(createdData, ["password"]);

    expect(user.hasOwnProperty("password")).toBeFalsy();
  });
});
