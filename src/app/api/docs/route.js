import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { NextResponse } from "next/server";

const swaggerDocument = YAML.load(path.resolve(process.cwd(), "swagger.yaml"));

// karena Next.js API route pakai edge/serverless, kita perlu trik:
export async function GET() {
    return NextResponse.json({
        message:
            "Swagger UI hanya bisa diakses via middleware/express, gunakan deployment khusus",
    });
}
