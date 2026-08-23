export interface StorageDriver {
  put(params: { key: string; data: Buffer; contentType: string }): Promise<{ key: string }>;
  getUrl(key: string): Promise<string> | string;
  read(key: string): Promise<{ data: Buffer; contentType: string }>;
  delete(key: string): Promise<void>;
}
