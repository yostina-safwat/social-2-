import {RedisCacheProvider} from "../../pkg/cache/redis";
import {MemoryCacheProvider} from "../../pkg/cache/memory";
import {ICacheProvider} from "../../pkg/cache/cache.interface";
import {env} from "../config/env";

export const cacheProvider: ICacheProvider = env.cacheProvider === 'memory'
    ? new MemoryCacheProvider()
    : new RedisCacheProvider({
        host: env.redis.host,
        port: env.redis.port,
        password: env.redis.password
    });
