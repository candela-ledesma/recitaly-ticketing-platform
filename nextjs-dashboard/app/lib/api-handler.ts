// lib/api-handler.ts
import { NextResponse } from "next/server";
import { AppError } from "./errors";

type RouteHandler = (
    request: Request,
    context: { params: Record<string, string> }
) => Promise<Response>;

export function apiHandler(fn: RouteHandler): RouteHandler {
    return async (req, ctx) => {
        try {
        return await fn(req, ctx);
        } catch (err: any) {
        console.error(err); // → consola + monitor (Sentry, Logtail, etc.)

        const status = err instanceof AppError ? err.status : 500;
        const message =
            err instanceof AppError ? err.message : "Internal Server Error";

        return NextResponse.json(
            { error: message },
            { status, headers: { "Content-Type": "application/json" } }
        );
        }
    };
}
