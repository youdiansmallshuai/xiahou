# Deployment

霞候可以作为纯前端页面运行，也可以配合 Node 后台缓存服务运行。生产建议使用后台服务，让所有用户优先读取服务器预热数据，避免每次打开页面都请求第三方天气接口。

## Build

```bash
npm install
npm run build
```

构建结果：

```text
dist/                         # 前端静态文件
dist-server/wanxia-server.mjs # 后台缓存服务 bundle
```

## Backend Service

```bash
WANXIA_PORT=8787 \
WANXIA_CACHE_FILE=/var/lib/wanxia/cache.json \
WANXIA_REFRESH_INTERVAL_MS=3600000 \
WANXIA_REGION_REFRESH_DELAY_MS=3000 \
node /opt/wanxia/server/wanxia-server.mjs
```

环境变量：

| Name | Default | Description |
|---|---:|---|
| `WANXIA_PORT` | `8787` | 后台服务监听端口，只监听 `127.0.0.1` |
| `WANXIA_CACHE_FILE` | `/tmp/wanxia-cache.json` | 持久化缓存文件 |
| `WANXIA_REFRESH_INTERVAL_MS` | `3600000` | 预热间隔 |
| `WANXIA_FAILED_REFRESH_COOLDOWN_MS` | `300000` | 失败后请求触发刷新冷却 |
| `WANXIA_REGION_REFRESH_DELAY_MS` | `3000` | 全量预热时每个区域之间的串行等待时间 |

后台会默认预热全国 + 全部省级区域的四组数据，并在区域之间串行等待，避免短时间集中请求第三方接口：

```text
{china + 34 provinces}/today/sunrise
{china + 34 provinces}/today/sunset
{china + 34 provinces}/tomorrow/sunrise
{china + 34 provinces}/tomorrow/sunset
```

已有缓存会优先返回；如果缓存过期，后台异步刷新，不阻塞用户请求。遇到 429 或 rate-limit 类错误时，本轮刷新会停止并进入失败冷却。

## systemd Example

```ini
[Unit]
Description=Xiahou hourly sunrise and sunset cache service
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
WorkingDirectory=/opt/wanxia/server
ExecStart=/usr/bin/node /opt/wanxia/server/wanxia-server.mjs
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=TZ=Asia/Shanghai
Environment=WANXIA_PORT=8787
Environment=WANXIA_CACHE_FILE=/var/lib/wanxia/cache.json
Environment=WANXIA_REFRESH_INTERVAL_MS=3600000
Environment=WANXIA_REGION_REFRESH_DELAY_MS=3000

[Install]
WantedBy=multi-user.target
```

## Nginx Example

```nginx
server {
    listen 8080;
    server_name _;

    root /var/www/xiahou/current;
    index index.html;

    location = /api/wanxia-data {
        proxy_pass http://127.0.0.1:8787;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_read_timeout 180s;
        add_header Cache-Control "no-store" always;
    }

    location /api/wanxia-cache/ {
        proxy_pass http://127.0.0.1:8787;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_read_timeout 180s;
        add_header Cache-Control "no-store" always;
    }

    location /api/open-meteo/ {
        resolver 223.5.5.5 1.1.1.1 ipv6=off valid=300s;
        set $open_meteo_host historical-forecast-api.open-meteo.com;
        rewrite ^/api/open-meteo/(.*)$ /$1 break;
        proxy_pass https://$open_meteo_host;
        proxy_ssl_server_name on;
        proxy_ssl_name $open_meteo_host;
        proxy_set_header Host $open_meteo_host;
        proxy_set_header Accept-Encoding "";
        add_header Cache-Control "public, max-age=900" always;
    }

    location /api/air-quality/ {
        resolver 223.5.5.5 1.1.1.1 ipv6=off valid=300s;
        set $air_quality_host air-quality-api.open-meteo.com;
        rewrite ^/api/air-quality/(.*)$ /$1 break;
        proxy_pass https://$air_quality_host;
        proxy_ssl_server_name on;
        proxy_ssl_name $air_quality_host;
        proxy_set_header Host $air_quality_host;
        proxy_set_header Accept-Encoding "";
        add_header Cache-Control "public, max-age=900" always;
    }

    location /assets/ {
        try_files $uri =404;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }
}
```

## Verification

```bash
curl http://127.0.0.1:8787/api/wanxia-cache/status
curl 'http://127.0.0.1:8787/api/wanxia-data?day=today&eventType=sunset'
npm test
```
