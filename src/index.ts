import express, { Application, NextFunction, Request, Response } from "express";
// import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import Validator from "validatorjs";
import { getUsers, getUser, createUser } from "helpers/user";

const app: Application = express();
// const prisma = new PrismaClient();
const port = process.env.PORT;

app.use(bodyParser.json());

const formValidation = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  let validated: boolean = true;
  const rules = {
    firstName: "required",
    lastName: "required",
    email: "required|email",
    password: "required",
  };

  if (["POST", "PUT"].includes(request.method)) {
    const validation = new Validator(request.body, rules);

    if (validation.fails()) {
      validated = false;
      response.status(422).json(validation.errors.errors);
    }
  }

  if (validated) {
    next();
  }
};

app.use(formValidation);

app.get("/", async (request: Request, response: Response) => {
  try {
    const users = await getUsers();
    response.json({ data: users });
  } catch (error) {
    response.json({ message: "Something went wrong" });
  }
});

app.get("/:id", async (request: Request, response: Response) => {
  try {
    const user = await getUser(Number(request.params.id));

    response.json({ data: user });
  } catch (error) {
    response.json({ message: "Something went wrong" });
  }
});

app.post("/", async (request: Request, response: Response) => {
  try {
    const { firstName, lastName, email, password } = request.body;

    const user = createUser({ firstName, lastName, email, password });

    response.json({ data: user });
  } catch (error) {
    response.json({ message: "Something went wrong" });
  }
});

// app.put("/:id", async (request: Request, response: Response) => {
//   try {
//     const { firstName, lastName, email } = request.body;

//     const user = await prisma.user.update({
//       where: {
//         id: Number(request.params.id),
//       },
//       data: {
//         firstName,
//         lastName,
//         email,
//       },
//     });

//     response.json({ data: user });
//   } catch (error) {
//     response.json({ message: "Something went wrong" });
//   }
// });

// app.delete("/:id", async (request: Request, response: Response) => {
//   try {
//     await prisma.user.delete({
//       where: {
//         id: Number(request.params.id),
//       },
//     });

//     response.json({ message: "Successfully deleted" });
//   } catch (error) {
//     response.json({ message: "Record not found" });
//   }
// });

app.listen(port, () => {
  console.log(`runs on port ${port}`);
});
