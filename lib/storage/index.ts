import path from "path";
import type { StorageDriver } from "@/lib/storage/types";
import { createLocalFsDriver } from "@/lib/storage/local-fs-driver";

function buildDriver(): StorageDriver {
  const driver = process.env.STORAGE_DRIVER ?? "local";
  switch (driver) {
    case "local":
    default:
      return createLocalFsDriver(path.resolve(process.env.STORAGE_LOCAL_ROOT ?? "./storage"));
  }
}

export const storage: StorageDriver = buildDriver();
