import { neon } from "@neondatabase/serverless";
import jwt from "jsonwebtoken";

const sql = neon(process.env.DATABASE_URL!);

function randomAvatar() {
  const avatars = [
    "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/biahaze.jpg",
    "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/elon.png",
    "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/graham.jpg",
    "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/jeff.jpeg",
    "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/vadim.jpg",
    "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/vadim1.JPG",
    "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/vadim.png",
    "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/zuck.jpeg",
  ];
  return avatars[Math.floor(Math.random() * avatars.length)];
}

export async function POST(request: Request) {
  const { handle } = await request.json();

  let user;

  [user] = await sql`SELECT * FROM users WHERE handle = ${handle}`;

  if (!user) {
    [user] =
      await sql`INSERT INTO users (handle, name, avatar) VALUES (${handle}, ${handle}, ${randomAvatar()}) RETURNING *`;
  }

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });

  console.log({ user, accessToken });

  return Response.json({ user, accessToken });
}
