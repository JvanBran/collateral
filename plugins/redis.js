const Redis = require('ioredis');
//集群使用 redlock 
class RedisStore {
    constructor() {
        this.redis = new Redis({ 
            port: '6379',
            host: '172.18.5.171',
            family: 4, // 4 (IPv4) or 6 (IPv6)
            password: "",
            db: 0,
            retryStrategy(times) {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            reconnectOnError(err) {
                const targetError = "READONLY";
                    if (err.message.includes(targetError)) {
                        return true;
                    }
                }
         });
    }
}