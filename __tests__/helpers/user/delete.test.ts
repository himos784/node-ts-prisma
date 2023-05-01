import { prismaMock } from "../../../singleton";
import { deleteUser, exclude } from "../../../src/helpers/user";

describe("user helpers - delete", () => {
  it("should delete user", async () => {
    const id = 1;
    const data = {
      firstName: "Rich",
      lastName: "Guy",
      email: "hello@prisma.io",
    };
    const createdData = { ...data, id, password: "just_hanging_around" };
    const deleteMock = prismaMock.user.delete.mockResolvedValue(createdData);

    const returned = deleteUser(id);

    await expect(returned).resolves.toEqual(exclude(createdData, ["password"]));
    expect(deleteMock).toHaveBeenCalledTimes(1);
  });

  it("should return error if record not found while deleting", async () => {
    const deleteMock = prismaMock.user.delete.mockImplementation(() => {
      throw new Error("There was an error.");
    });

    const returned = deleteUser(2);

    await expect(returned).rejects.toThrowError("There was an error");
    expect(deleteMock).toHaveBeenCalledTimes(1);
  });
});
