/**
 * Proxies POST /api/compile from the browser to the FastAPI backend
 * running on the Google Cloud VM, so the VM's address never appears
 * in frontend code (spec section 19).
 *
 * Set MR_BACKEND_URL in your Vercel project's environment variables,
 * e.g.  MR_BACKEND_URL=http://<vm-external-ip>:8000
 * (or an internal/VPC address if you put the VM behind one).
 */

export const config = {
    runtime: "nodejs",
};

const REQUEST_TIMEOUT_MS = 15_000;

export default async function handler(req: any, res: any) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ message: "Method not allowed" });
    }

    const backendUrl = process.env.MR_BACKEND_URL;
    if (!backendUrl) {
        return res
            .status(503)
            .json({ message: "Compiler backend is not configured." });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const upstream = await fetch(`${backendUrl.replace(/\/$/, "")}/compile`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body ?? {}),
            signal: controller.signal,
        });

        const payload = await upstream.json().catch(() => ({}));
        return res.status(upstream.status).json(payload);
    } catch (error) {
        const isAbort = error instanceof Error && error.name === "AbortError";
        return res.status(502).json({
            message: isAbort
                ? "Compiler backend timed out."
                : "Could not reach the compiler backend.",
        });
    } finally {
        clearTimeout(timeout);
    }
}
