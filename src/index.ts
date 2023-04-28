import express, { Application, NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import Validator from "validatorjs";

const app: Application = express();
const prisma = new PrismaClient();
const port = process.env.PORT;

const formValidation = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  let validated: boolean = false;
  const rules = {
    firstName: "required",
    lastName: "required",
    email: "required|email",
    password: "required",
  };

  if (["POST", "PUT"].includes(request.method)) {
    const validation = new Validator(request.body, rules);

    if (validation.fails()) {
      response.status(422).json(validation.errors.errors);
    } else {
      validated = true;
    }
  }

  if (validated) {
    next();
  }
};

app.use(bodyParser.json());

app.use(formValidation);

app.get("/", async (request: Request, response: Response) => {
  try {
    const users = await prisma.user.findMany();
    response.json({ data: users });
  } catch (error) {
    response.json({ message: "Something went wrong" });
  }
});

app.get("/:id", async (request: Request, response: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(request.params.id),
      },
    });

    response.json({ data: user });
  } catch (error) {
    response.json({ message: "Something went wrong" });
  }
});

app.post("/", async (request: Request, response: Response) => {
  try {
    const { firstName, lastName, email, password } = request.body;

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password,
      },
    });
    response.json({ data: user });
  } catch (error) {
    response.json({ message: "Something went wrong" });
  }
});

app.put("/:id", async (request: Request, response: Response) => {
  try {
    const { firstName, lastName, email } = request.body;

    const user = await prisma.user.update({
      where: {
        id: Number(request.params.id),
      },
      data: {
        firstName,
        lastName,
        email,
      },
    });

    response.json({ data: user });
  } catch (error) {
    response.json({ message: "Something went wrong" });
  }
});

app.delete("/:id", async (request: Request, response: Response) => {
  try {
    await prisma.user.delete({
      where: {
        id: Number(request.params.id),
      },
    });

    response.json({ message: "Successfully deleted" });
  } catch (error) {
    response.json({ message: "Record not found" });
  }
});

app.listen(port, () => {
  console.log(`runs on port ${port}`);
});
