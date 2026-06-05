import { writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const generatedDir = join(__dirname, "..", "src", "generated", "prisma");
const indexPath = join(generatedDir, "index.ts");

if (existsSync(join(generatedDir, "client.ts"))) {
  writeFileSync(
    indexPath,
    [
      'export { PrismaClient } from "./client"',
      'export type { User, Apostila, Concurso, Categoria, Banca, Orgao, SitemapSource, SitemapUrl, DetectedOpportunity, MonitorLog, Notification, TictoConfig, TictoWebhookLog, AuditLog, SiteConfig } from "./client"',
      'export * from "./enums"',
      '',
    ].join("\n")
  );
  console.log("✔ Created src/generated/prisma/index.ts");
}
