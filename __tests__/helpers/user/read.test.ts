import { prismaMock } from "../../../singleton";
import { exclude, getUsers, getUser } from "../../../src/helpers/user";

describe("user helpers", () => {
  it("should retrieve all users in database", async () => {
    const createdData = [
      {
        id: 1,
        firstName: "Rich",
        lastName: "Guy",
        email: "hello@prisma.io",
        password: "just_hanging_around",
      },
      {
        id: 2,
        firstName: "Rich",
        lastName: "Guy2",
        email: "hello2@prisma.io",
        password: "just_hanging_around",
      },
      {
        id: 3,
        firstName: "Rich",
        lastName: "Guy3",
        email: "hello3@prisma.io",
        password: "just_hanging_around",
      },
    ];
    const getAllMock = prismaMock.user.findMany.mockResolvedValue(createdData);

    const returned = getUsers();
    const usersExcludedPassword = createdData.map((data) => {
      return exclude(data, ["password"]);
    });

    await expect(returned).resolves.toEqual(usersExcludedPassword);
    expect(getAllMock).toHaveBeenCalledTimes(1);
  });

  it("should return empty when users table empty", async () => {
    const getAllMock = prismaMock.user.findMany.mockResolvedValue([]);

    const returned = getUsers();

    await expect(returned).resolves.toEqual([]);
    expect(getAllMock).toHaveBeenCalledTimes(1);
  });

  it("should retrieve a specific user in database", async () => {
    const createdData = {
      id: 1,
      firstName: "Rich",
      lastName: "Guy",
      email: "hello@prisma.io",
      password: "just_hanging_around",
    };
    const getByIdMock =
      prismaMock.user.findUniqueOrThrow.mockResolvedValue(createdData);

    const returned = getUser(1);

    await expect(returned).resolves.toEqual(exclude(createdData, ["password"]));
    expect(getByIdMock).toHaveBeenCalledTimes(1);
  });

  it("should return empty object if user not found", async () => {
    const getByIdMock = prismaMock.user.findUniqueOrThrow.mockImplementation(
      () => {
        throw new Error("There was an error.");
      }
    );

    const returned = getUser(2);

    await expect(returned).rejects.toThrowError("There was an error");
    expect(getByIdMock).toHaveBeenCalledTimes(1);
  });
});
