import { promises as fs } from "fs";
import path from "path";
import type { StorageDriver } from "@/lib/storage/types";

const EXT_TO_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

function mimeForExt(key: string): string {
  const ext = path.extname(key).toLowerCase();
  return EXT_TO_MIME[ext] ?? "application/octet-stream";
}

export function createLocalFsDriver(root: string): StorageDriver {
  function resolvePath(key: string): string {
    const normalized = path.normalize(key).replace(/^([./\\]+)/, "");
    return path.join(root, normalized);
  }

  return {
    async put({ key, data }) {
      const filePath = resolvePath(key);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, data);
      return { key };
    },

    getUrl(key: string) {
      return `/api/files/${key.split(path.sep).join("/")}`;
    },

    async read(key: string) {
      const filePath = resolvePath(key);
      const data = await fs.readFile(filePath);
      return { data, contentType: mimeForExt(key) };
    },

    async delete(key: string) {
      const filePath = resolvePath(key);
      await fs.rm(filePath, { force: true });
    },
  };
}
