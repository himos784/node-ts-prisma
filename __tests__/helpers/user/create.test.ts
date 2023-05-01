import { prismaMock } from "../../../singleton";
import { createUser, exclude } from "../../../src/helpers/user";

describe("user helpers - create", () => {
  it("should create user", async () => {
    const data = {
      firstName: "Rich",
      lastName: "Guy",
      email: "hello@prisma.io",
      password: "just_hanging_around",
    };
    const createdData = { ...data, id: 1 };
    const createMock = prismaMock.user.create.mockResolvedValue(createdData);

    const returned = createUser(data);

    await expect(returned).resolves.toEqual(exclude(createdData, ["password"]));
    expect(createMock).toHaveBeenCalledTimes(1);
  });
});
