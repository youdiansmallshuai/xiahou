# 霞候 Xiahou

全国朝霞与晚霞实时预测仪表盘。项目用可解释规则模型评估全国与各省份的霞光机会，输出总体概率、大片火烧云概率、烧度分级、观察窗口、云图范围和现场策略。

> 霞候：看霞，也候霞。

## Features

- 默认全国视图，并支持按省份查看朝霞 / 晚霞。
- 全国主预测以北京为描述和天文窗口基准；省份主预测以省会 / 首府为基准。
- 支持今日 / 明日、朝霞 / 晚霞四种选择。
- 后台服务每小时预热两天四组数据，并持久化到本地 JSON 文件。
- 前端默认读取后台缓存，失败时才走实时兜底。
- 全国省界与省份真实边界地图上绘制连续火烧云潜力面。
- 输出大烧 / 中烧 / 小烧 / 弱烧 / 难烧分级。
- 展示低云、中高云、降水、能见度、气溶胶、风向等可解释因子。
- 无需 API key，使用 Open-Meteo Forecast 与 Air Quality 数据。

## Data Sources

- [Open-Meteo Forecast API](https://open-meteo.com/en/docs)
- [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api)
- 项目内置全国省界与各省地市边界 GeoJSON 作为前端地图底图。

## Model Overview

模型不是黑盒训练模型，而是经验规则评分：

```text
霞光概率 =
西方/东方光路是否通
+ 是否有可染色的中高云画布
+ 降水与能见度
+ 气溶胶散射
+ 风向趋势
+ 天文窗口与现场修正
```

核心输出包括：

- 总体概率
- 大片火烧云概率
- 大烧 / 中烧 / 小烧 / 弱烧 / 难烧
- 最佳观察窗口
- 主看方向
- 全国与省份云图概览
- 加分项、风险项和现场策略

更详细的模型说明见 [docs/model.md](docs/model.md)。

## Tech Stack

- Vite
- React
- TypeScript
- Vitest
- Node.js HTTP backend
- Nginx optional reverse proxy

## Quick Start

```bash
npm install
npm run dev
```

打开：

```text
http://127.0.0.1:5173/
```

本地开发时，如果没有启动后台缓存服务，前端会尝试实时请求 Open-Meteo。

## Backend Cache Service

构建后台服务：

```bash
npm run build:server
```

启动：

```bash
WANXIA_PORT=8787 \
WANXIA_CACHE_FILE=/tmp/wanxia-cache.json \
WANXIA_REFRESH_INTERVAL_MS=3600000 \
WANXIA_REGION_REFRESH_DELAY_MS=3000 \
node dist-server/wanxia-server.mjs
```

接口：

```text
GET /api/wanxia-data?day=today&eventType=sunset
GET /api/wanxia-cache/status
```

参数：

- `day`: `today` 或 `tomorrow`
- `eventType`: `sunrise` 或 `sunset`
- `regionId`: `china` 或省级行政区代码，例如 `410000`

部署说明见 [docs/deployment.md](docs/deployment.md)。

## Scripts

```bash
npm run dev          # Start Vite dev server
npm run test         # Run unit tests
npm run build        # Build frontend and backend bundle
npm run preview      # Preview production frontend locally
```

## Project Structure

```text
src/
  api/              Open-Meteo and map data loaders
  lib/              Browser localStorage cache helpers
  model/            Forecast scoring, geometry, cloud map model
  App.tsx           Main dashboard UI
  styles.css        Film-style dashboard visual system
server/
  wanxiaServer.ts   Hourly cache warmup backend
docs/
  model.md          Forecast model explanation
  deployment.md     Production deployment notes
```

## Caveats

- 预测概率是经验评分概率，不是经过历史样本校准的统计概率。
- 当前版本没有接入雷达、卫星云图或摄像头实况。
- Open-Meteo 免费接口偶尔会有网络波动，后台服务会保留最近一次成功缓存。
- 云图是预报网格插值结果，用于判断区域趋势，不等同于卫星云图。

## License

MIT
