import { prismaMock } from "../../../singleton";
import { exclude, updateUser } from "../../../src/helpers/user";

describe("user helpers - update", () => {
  it("should update user", async () => {
    const id = 1;
    const data = {
      firstName: "Rich",
      lastName: "Guy",
      email: "hello@prisma.io",
    };
    const createdData = { ...data, id, password: "just_hanging_around" };
    const updateMock = prismaMock.user.update.mockResolvedValue(createdData);

    const returned = updateUser(id, data);

    await expect(returned).resolves.toEqual(exclude(createdData, ["password"]));
    expect(updateMock).toHaveBeenCalledTimes(1);
  });

  it("should return error if record not found while updating", async () => {
    const updateMock = prismaMock.user.update.mockImplementation(() => {
      throw new Error("There was an error.");
    });

    const returned = updateUser(2, {
      firstName: "Rich",
      lastName: "Guy",
      email: "hello@prisma.io",
    });

    await expect(returned).rejects.toThrowError("There was an error");
    expect(updateMock).toHaveBeenCalledTimes(1);
  });
});
