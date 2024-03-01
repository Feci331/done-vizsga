import express, { Request, Response } from "express";
import cors from "cors";
import { z } from "zod";
import { promises as fsPromises } from "fs";

const { readFile, writeFile } = fsPromises;
const app = express();

app.use(cors());
app.use(express.json());

type User = {
  email: string;
  password: string;
};

const UserSchema = z.object({
  email: z.string(),
  password: z.string(),
});

const loadDB = async (filename: string): Promise<User[] | null> => {
  try {
    const rawData = await readFile(
      `${__dirname}/../database/${filename}.json`,
      "utf-8"
    );
    const data = JSON.parse(rawData);
    return data as User[];
  } catch (error) {
    console.error("Error loading database:", error);
    return null;
  }
};

const saveDB = async (filename: string, data: User[]): Promise<boolean> => {
  try {
    const fileContent = JSON.stringify(data);
    await writeFile(`${__dirname}/../database/${filename}.json`, fileContent);
    return true;
  } catch (error) {
    console.error("Error saving database:", error);
    return false;
  }
};

app.get("/api/register", async (req: Request, res: Response) => {
  try {
    const result = await loadDB(`User`);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: "User data not found" });
    }
  } catch (error) {
    console.error("An error occurred while fetching User data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching User data" });
  }
});

app.post("/api/register", async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  try {
    const users = await loadDB("User");
    if (!users) {
      res.status(500).json({ error: "Database not available" });
      return;
    }
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      res.status(400).json({ error: "This email address is already in use" });
      return;
    }

    const newUser: User = { email, password };
    users.push(newUser);
    const saveResult = await saveDB("User", users);
    if (!saveResult) {
      res.status(500).json({ error: "Registration failed" });
      return;
    }
    res.status(200).json({ message: "Successful registration" });
  } catch (error) {
    console.error("An error occurred during registration:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

/* const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
 */
app.listen(3000);
