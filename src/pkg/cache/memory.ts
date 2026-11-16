import {ICacheProvider} from "./cache.interface";

interface Entry {
    value: string;
    expiresAt: number;
}

// development only: keeps the data in the server memory (it is lost when the server restarts)
export class MemoryCacheProvider implements ICacheProvider {
    private store = new Map<string, Entry>();

    private read(key: string): Entry | undefined {
        const entry = this.store.get(key);
        if (entry && entry.expiresAt <= Date.now()) {
            this.store.delete(key);
            return undefined;
        }
        return entry;
    }

    async get(key: string): Promise<string | null> {
        return this.read(key)?.value ?? null;
    }

    async set(key: string, value: string, ttl: number): Promise<string> {
        this.store.set(key, {value, expiresAt: Date.now() + ttl * 1000});
        return 'OK';
    }

    async del(key: string): Promise<number> {
        const existed = this.read(key) !== undefined;
        this.store.delete(key);
        return existed ? 1 : 0;
    }

    // same results as redis: -2 when the key does not exist
    async ttl(key: string): Promise<number> {
        const entry = this.read(key);
        if (!entry) return -2;
        return Math.ceil((entry.expiresAt - Date.now()) / 1000);
    }
}
