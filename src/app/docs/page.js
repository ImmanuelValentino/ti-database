"use client";

import { useEffect } from "react";

export default function SwaggerPage() {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js";
        script.onload = () => {
            window.SwaggerUIBundle({
                url: "/swagger.yaml",
                dom_id: "#swagger-ui",
            });
        };
        document.body.appendChild(script);
    }, []);

    return (
        <div>
            <link
                rel="stylesheet"
                href="https://unpkg.com/swagger-ui-dist/swagger-ui.css"
            />
            <div id="swagger-ui" />
        </div>
    );
}
