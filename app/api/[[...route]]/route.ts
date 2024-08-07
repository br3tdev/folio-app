import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { z } from "zod";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app
  .get("/hello", clerkMiddleware(), (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" });
    }

    return c.json({
      message: "Hello Next.js!",
      userId: auth.userId,
    });
  })
  .get(
    "/hello/:test",
    zValidator(
      "param",
      z.object({
        test: z.number(),
      })
    ),
    (c) => {
      const { test } = c.req.valid("param");

      return c.json({
        message: "Hello Next.js!",
        test: test,
      });
    }
  )
  .post(
    "/hello/user",
    zValidator(
      "json",
      z.object({
        name: z.string(),
        userId: z.number(),
      })
    ),
    (c) => {
      const { name, userId } = c.req.valid("json");

      return c.json({});
    }
  );

export const GET = handle(app);
export const POST = handle(app);
