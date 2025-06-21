import type { Context } from "hono";

export async function create(c: Context){
    await c.body()
}