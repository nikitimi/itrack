import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "@/server/utils/uploadthing/core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,

  // Apply an (optional) custom config:
  // config: { ... },
});
