import {
  AlertTriangle,
  CalendarDays,
  CloudSun,
  Compass,
  Eye,
  Flame,
  MapPinned,
  RefreshCw,
  Signal,
  Sparkles,
  Sunrise,
  Sunset,
  Timer,
  Wind
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchHenanGeoJsonMap } from "./api/henanGeoJson";
import {
  loadWanxiaData,
  type WanxiaDataLoadSource
} from "./api/openMeteo";
import {
  readHenanGeoJsonCache,
  readWanxiaDataCache,
  writeHenanGeoJsonCache,
  writeWanxiaDataCache
} from "./lib/cache";
import {
  collectionPath,
  featurePath,
  geoJsonBounds,
  projectGeo
} from "./model/mapProjection";
import {
  computeSunsetPrediction
} from "./model/scoring";
import type {
  CloudMap,
  CloudMapLayer,
  ForecastDay,
  HenanCityPrediction,
  HenanGeoJsonMap,
  HenanOverview,
  ObservationSignal,
  PredictionSelection,
  SolarEventType,
  SunsetPrediction,
  WanxiaData
} from "./model/types";

const REFRESH_INTERVAL_MS = 15 * 60 * 1000;
const GEO_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MAP_VIEWPORT = { width: 420, height: 430, padding: 18 };
const systemClock = () => new Date();

interface AppProps {
  clock?: () => Date;
}

export function App({ clock = systemClock }: AppProps = {}) {
  const initialCache = readWanxiaDataCache();
  const initialGeoCache = readHenanGeoJsonCache();
  const [data, setData] = useState<WanxiaData | null>(() => initialCache?.data ?? null);
  const [geoMap, setGeoMap] = useState<HenanGeoJsonMap | null>(() => initialGeoCache?.map ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<string | null>(initialCache?.cachedAt ?? data?.fetchedAt ?? null);
  const [usingCache, setUsingCache] = useState(Boolean(initialCache));
  const [dataSource, setDataSource] = useState<WanxiaDataLoadSource | "local">(
    initialCache ? "local" : "backend"
  );
  const [activeSignals, setActiveSignals] = useState<ObservationSignal[]>([]);
  const [selectedDay, setSelectedDay] = useState<ForecastDay>("today");
  const [selectedEventType, setSelectedEventType] = useState<SolarEventType>("sunset");
  const selection = useMemo<PredictionSelection>(
    () => ({
      day: selectedDay,
      eventType: selectedEventType
    }),
    [selectedDay, selectedEventType]
  );
  const selectedGlowLabel = selectedEventType === "sunrise" ? "朝霞" : "晚霞";

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await loadWanxiaData(clock(), selection);
      setData(result.data);
      setLastRefresh(result.data.fetchedAt);
      setUsingCache(false);
      setDataSource(result.source);
      writeWanxiaDataCache(result.data);
    } catch (requestError) {
      const cached = readWanxiaDataCache();
      if (cached && sameSelection(cached.data.selection, selection)) {
        setData(cached.data);
        setLastRefresh(cached.cachedAt);
        setUsingCache(true);
        setDataSource("local");
      }
      setError(requestError instanceof Error ? requestError.message : "数据刷新失败");
    } finally {
      setLoading(false);
    }
  }, [clock, selection]);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), REFRESH_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [refresh]);

  useEffect(() => {
    const cachedMap = readHenanGeoJsonCache(GEO_TTL_MS);
    if (cachedMap) {
      setGeoMap(cachedMap.map);
      return;
    }
    let cancelled = false;
    void fetchHenanGeoJsonMap()
      .then((nextMap) => {
        if (cancelled) return;
        setGeoMap(nextMap);
        writeHenanGeoJsonCache(nextMap);
      })
      .catch((requestError) => {
        const staleMap = readHenanGeoJsonCache();
        if (staleMap && !cancelled) setGeoMap(staleMap.map);
        if (!staleMap && !cancelled) {
          setError(requestError instanceof Error ? requestError.message : "河南地图边界加载失败");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const prediction = useMemo<SunsetPrediction | null>(() => {
    if (!data) return null;
    if (!sameSelection(data.selection, selection)) return null;
    return computeSunsetPrediction(data.weatherBundle, clock(), activeSignals, selection);
  }, [activeSignals, data, clock, selection]);
  const skyState = useMemo(() => getSkyState(prediction), [prediction]);

  useEffect(() => {
    document.body.dataset.skyState = skyState.key;
    return () => {
      delete document.body.dataset.skyState;
    };
  }, [skyState.key]);

  function toggleSignal(signal: ObservationSignal) {
    setActiveSignals((signals) =>
      signals.includes(signal)
        ? signals.filter((item) => item !== signal)
        : [...signals, signal]
    );
  }

  return (
    <main className="app-shell">
      <section className="topbar" aria-label="郑州朝霞晚霞预测概览">
        <div className="brand-lockup">
          <p className="eyebrow">WANXIA OPS · HENAN GLOW CLOUD INTELLIGENCE</p>
          <h1>郑州朝霞 / 晚霞预测中心</h1>
          <div className="status-row" aria-label="数据状态">
            <span>{dataSourceLabel(dataSource, usingCache)}</span>
            <span>Open-Meteo</span>
            <span>{selectedDay === "today" ? "今日" : "明日"}{selectedGlowLabel}</span>
            <span>{skyState.label}</span>
            <span>{lastRefresh ? formatDateTime(lastRefresh) : "等待数据"}</span>
          </div>
          <div className="film-reel-meta" aria-hidden="true">
            <span>FRAME 4101</span>
            <span>ISO 200</span>
            <span>C-41 GLOW SCAN</span>
          </div>
        </div>
        <div className="top-actions">
          <div className="refresh-cadence">Read 15m · Build 1h</div>
          <button className="icon-button" type="button" onClick={() => void refresh()} disabled={loading}>
            <RefreshCw size={18} aria-hidden="true" className={loading ? "spin" : ""} />
            <span>{loading ? "刷新中" : "刷新数据"}</span>
          </button>
        </div>
      </section>

      <ModeStrip
        selectedDay={selectedDay}
        selectedEventType={selectedEventType}
        onDayChange={setSelectedDay}
        onEventTypeChange={setSelectedEventType}
      />

      {error ? (
        <div className="notice" role="status">
          <AlertTriangle size={18} aria-hidden="true" />
          <span>{usingCache ? `${error}，已显示缓存数据` : error}</span>
        </div>
      ) : null}

      {prediction && data ? (
        <Dashboard
          prediction={prediction}
          overview={data.henanOverview}
          cloudMap={data.cloudMap}
          geoMap={geoMap}
          lastRefresh={lastRefresh}
          usingCache={usingCache}
          dataSource={dataSource}
          activeSignals={activeSignals}
          onToggleSignal={toggleSignal}
        />
      ) : (
        <EmptyState loading={loading} />
      )}
    </main>
  );
}

interface DashboardProps {
  prediction: SunsetPrediction;
  overview: HenanOverview | null;
  cloudMap: CloudMap | null;
  geoMap: HenanGeoJsonMap | null;
  lastRefresh: string | null;
  usingCache: boolean;
  dataSource: WanxiaDataLoadSource | "local";
  activeSignals: ObservationSignal[];
  onToggleSignal: (signal: ObservationSignal) => void;
}

interface BurnForecast {
  level: "large" | "medium" | "small" | "weak" | "blocked";
  label: string;
  title: string;
  summary: string;
  spread: string;
  color: string;
  texture: string;
  camera: string;
  confidence: string;
  indicators: Array<{
    label: string;
    value: string;
    status: "good" | "watch" | "risk";
  }>;
  playbook: string[];
}

function Dashboard({
  prediction,
  overview,
  cloudMap,
  geoMap,
  lastRefresh,
  usingCache,
  dataSource,
  activeSignals,
  onToggleSignal
}: DashboardProps) {
  const grade = getGrade(prediction.probability, prediction.eventType);
  const windowLabels = timeWindowLabels(prediction.eventType);
  const burnForecast = buildBurnForecast(prediction);

  return (
    <div className="dashboard">
      <section className="score-band">
        <div className="film-stock" aria-hidden="true">
          <span>WANXIA NEGATIVE 01</span>
          <span>EV LIVE METER</span>
          <span>ZHENGZHOU / HENAN</span>
        </div>
        <div className="score-copy">
          <p className="eyebrow">{grade.label}</p>
          <h2>{prediction.strategy}</h2>
          <div className="meta-row">
            <Metric icon={<Flame size={18} />} label="大片火烧云" value={`${prediction.fireCloudProbability}%`} />
            <Metric icon={<Timer size={18} />} label={prediction.eventLabel} value={formatClock(prediction.eventTime)} />
            <Metric icon={<Compass size={18} />} label="主看方向" value={prediction.directionLabel} />
          </div>
        </div>
        <div className={`score-ring ${grade.className}`}>
          <span>{prediction.probability}%</span>
          <small>总体概率</small>
        </div>
      </section>

      <section className="window-strip">
        <TimePoint label={windowLabels.start} value={formatClock(prediction.observationWindow.start)} />
        <TimePoint label={windowLabels.peakStart} value={formatClock(prediction.observationWindow.peakStart)} active />
        <TimePoint label={windowLabels.peakEnd} value={formatClock(prediction.observationWindow.peakEnd)} active />
        <TimePoint label={windowLabels.end} value={formatClock(prediction.observationWindow.end)} />
      </section>

      <BurnForecastPanel forecast={burnForecast} prediction={prediction} />

      {overview && cloudMap && geoMap ? (
        <HenanCloudMap overview={overview} cloudMap={cloudMap} geoMap={geoMap} />
      ) : null}

      <section className="content-grid">
        <div className="panel factor-panel">
          <div className="panel-heading">
            <CloudSun size={20} aria-hidden="true" />
            <h3>模型因子</h3>
          </div>
          <div className="factor-list">
            {prediction.factorScores.map((factor) => (
              <article className="factor-row" key={factor.key}>
                <div className="factor-title">
                  <strong>{factor.label}</strong>
                  <span>{Math.round(factor.score)} / {factor.max}</span>
                </div>
                <div className="bar-track" aria-hidden="true">
                  <div
                    className={`bar-fill ${factor.status}`}
                    style={{ width: `${(factor.score / factor.max) * 100}%` }}
                  />
                </div>
                <p>{factor.summary}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="side-stack">
          <div className="panel">
            <div className="panel-heading">
              <Signal size={20} aria-hidden="true" />
              <h3>现场修正</h3>
              <span className={prediction.manualAdjustment >= 0 ? "delta good" : "delta risk"}>
                {prediction.manualAdjustment >= 0 ? "+" : ""}{prediction.manualAdjustment}
              </span>
            </div>
            <div className="signal-grid">
              {prediction.selectedSignals.map((signal) => {
                const active = activeSignals.includes(signal.signal);
                return (
                  <button
                    type="button"
                    className={active ? "signal active" : "signal"}
                    key={signal.signal}
                    onClick={() => onToggleSignal(signal.signal)}
                  >
                    <span>{signal.label}</span>
                    <small>{signal.delta > 0 ? "+" : ""}{signal.delta}</small>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="panel">
            <div className="panel-heading">
              <Eye size={20} aria-hidden="true" />
              <h3>加分与风险</h3>
            </div>
            <SummaryList
              boosts={prediction.majorBoosts}
              risks={prediction.majorRisks}
              cap={prediction.appliedCap}
            />
          </div>
        </div>
      </section>

      <section className="diagnostics">
        <DataChip icon={<CloudSun size={17} />} label="低/中/高云" value={`${prediction.diagnostics.weightedLowCloud}% / ${prediction.diagnostics.weightedMidCloud}% / ${prediction.diagnostics.weightedHighCloud}%`} />
        <DataChip icon={<Eye size={17} />} label="能见度" value={`${prediction.diagnostics.weightedVisibilityKm}km`} />
        <DataChip icon={<Sparkles size={17} />} label="AOD / PM2.5" value={`${prediction.diagnostics.aod} / ${prediction.diagnostics.pm25}`} />
        <DataChip icon={<Wind size={17} />} label="风" value={`${prediction.diagnostics.windDirectionDeg}° · ${prediction.diagnostics.windSpeedKmh}km/h`} />
      </section>

      <footer className="footer-row">
        <span>{dataSourceLabel(dataSource, usingCache)} · {lastRefresh ? formatDateTime(lastRefresh) : "等待刷新"}</span>
        <span>经验概率 · 后台每小时预热 · 本地持久化</span>
      </footer>
    </div>
  );
}

function BurnForecastPanel({
  forecast,
  prediction
}: {
  forecast: BurnForecast;
  prediction: SunsetPrediction;
}) {
  return (
    <section className={`panel burn-panel ${forecast.level}`} aria-label="烧度预报">
      <div className="burn-primary">
        <div className="panel-heading">
          <Flame size={20} aria-hidden="true" />
          <h3>烧度预报</h3>
          <span className={`burn-badge ${forecast.level}`}>{forecast.label}</span>
        </div>
        <h2>{forecast.title}</h2>
        <p>{forecast.summary}</p>
        <div className="burn-metrics">
          <Metric icon={<Sparkles size={18} />} label="颜色强度" value={forecast.color} />
          <Metric icon={<CloudSun size={18} />} label="成片范围" value={forecast.spread} />
          <Metric icon={<Eye size={18} />} label="可拍性" value={forecast.camera} />
        </div>
      </div>

      <div className="burn-detail">
        <div className="burn-indicators">
          {forecast.indicators.map((indicator) => (
            <div className={`burn-indicator ${indicator.status}`} key={indicator.label}>
              <span>{indicator.label}</span>
              <strong>{indicator.value}</strong>
            </div>
          ))}
        </div>
        <div className="burn-playbook">
          <div>
            <strong>{prediction.eventType === "sunrise" ? "朝霞策略" : "晚霞策略"}</strong>
            {forecast.playbook.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
          <div>
            <strong>判定口径</strong>
            <p>{forecast.texture}</p>
            <p>{forecast.confidence}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ModeStrip({
  selectedDay,
  selectedEventType,
  onDayChange,
  onEventTypeChange
}: {
  selectedDay: ForecastDay;
  selectedEventType: SolarEventType;
  onDayChange: (day: ForecastDay) => void;
  onEventTypeChange: (eventType: SolarEventType) => void;
}) {
  return (
    <section className="mode-strip" aria-label="预报选择">
      <div className="segment-group">
        <div className="segment-title">
          <CalendarDays size={17} aria-hidden="true" />
          <span>日期</span>
        </div>
        <div className="segment-control">
          <button
            className={selectedDay === "today" ? "segment-button active" : "segment-button"}
            type="button"
            onClick={() => onDayChange("today")}
          >
            今日
          </button>
          <button
            className={selectedDay === "tomorrow" ? "segment-button active" : "segment-button"}
            type="button"
            onClick={() => onDayChange("tomorrow")}
          >
            明日
          </button>
        </div>
      </div>
      <div className="segment-group">
        <div className="segment-title">
          {selectedEventType === "sunrise" ? <Sunrise size={17} aria-hidden="true" /> : <Sunset size={17} aria-hidden="true" />}
          <span>霞光类型</span>
        </div>
        <div className="segment-control">
          <button
            className={selectedEventType === "sunrise" ? "segment-button active" : "segment-button"}
            type="button"
            onClick={() => onEventTypeChange("sunrise")}
          >
            <Sunrise size={16} aria-hidden="true" />
            朝霞
          </button>
          <button
            className={selectedEventType === "sunset" ? "segment-button active" : "segment-button"}
            type="button"
            onClick={() => onEventTypeChange("sunset")}
          >
            <Sunset size={16} aria-hidden="true" />
            晚霞
          </button>
        </div>
      </div>
    </section>
  );
}

function HenanCloudMap({
  overview,
  cloudMap,
  geoMap
}: {
  overview: HenanOverview;
  cloudMap: CloudMap;
  geoMap: HenanGeoJsonMap;
}) {
  const strongest = overview.bestCities[0];
  const [layer, setLayer] = useState<CloudMapLayer>("potential");
  const mapGeometry = useMemo(() => {
    const bounds = geoJsonBounds(geoMap.province);
    return {
      bounds,
      provincePath: collectionPath(geoMap.province, bounds, MAP_VIEWPORT),
      cityPaths: geoMap.cities.features.map((feature) => ({
        name: feature.properties.name ?? "",
        path: featurePath(feature, bounds, MAP_VIEWPORT)
      }))
    };
  }, [geoMap]);
  const surfaceCells = useMemo(
    () => buildCloudSurfaceCells(cloudMap, layer, mapGeometry.bounds),
    [cloudMap, layer, mapGeometry.bounds]
  );
  const layerOptions: Array<{ value: CloudMapLayer; label: string }> = [
    { value: "potential", label: "火烧云潜力" },
    { value: "low", label: "低云遮挡" },
    { value: "canvas", label: "中高云画布" },
    { value: "precipitation", label: "降水风险" }
  ];

  return (
    <section className="panel map-panel" aria-label="河南省云图概览">
      <div className="map-copy">
        <div className="map-film-code" aria-hidden="true">CONTACT SHEET / HENAN CLOUD FIELD</div>
        <div className="panel-heading">
          <MapPinned size={20} aria-hidden="true" />
          <h3>河南云图概览</h3>
        </div>
        <p className="map-summary">{cloudMap.summary}</p>
        <div className="map-subline">
          <span>真实河南边界</span>
          <span>{cloudMap.rows}×{cloudMap.columns} 预报网格</span>
          <span>{formatClock(cloudMap.targetTime)} 目标窗口</span>
        </div>
        <div className="map-stats">
          <Metric icon={<Flame size={18} />} label="全省均值" value={`${overview.averageProbability}%`} />
          <Metric icon={<Sparkles size={18} />} label="大片云均值" value={`${overview.averageFireCloudProbability}%`} />
          <Metric
            icon={<Compass size={18} />}
            label="最强城市"
            value={strongest ? `${strongest.city.shortName} ${strongest.probability}%` : "--"}
          />
        </div>
        <div className="city-rank">
          {overview.bestCities.slice(0, 5).map((city) => (
            <CityRankItem city={city} key={city.city.id} />
          ))}
        </div>
      </div>

      <div className="henan-map-wrap">
        <div className="layer-tabs" role="tablist" aria-label="云图图层">
          {layerOptions.map((option) => (
            <button
              className={layer === option.value ? "layer-tab active" : "layer-tab"}
              key={option.value}
              type="button"
              onClick={() => setLayer(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <svg className="henan-map cloud-map" viewBox="0 0 420 430" role="img" aria-label="河南真实范围云图">
          <defs>
            <clipPath id="henan-cloud-clip">
              <path d={mapGeometry.provincePath} />
            </clipPath>
            <filter id="soft-cloud">
              <feGaussianBlur stdDeviation="9" />
            </filter>
            <filter id="continuous-surface">
              <feGaussianBlur stdDeviation="2.6" />
            </filter>
          </defs>
          <rect className="cloud-map-sky" x="0" y="0" width="420" height="430" />
          <g className="cloud-surface-layer" clipPath="url(#henan-cloud-clip)">
            {surfaceCells.map((cell) => {
              return (
                <rect
                  className="cloud-surface-cell"
                  fill={cloudLayerColor(cell.value, layer)}
                  height={cell.height}
                  key={cell.id}
                  opacity={cell.opacity}
                  width={cell.width}
                  x={cell.x}
                  y={cell.y}
                >
                  <title>{`${cloudLayerLabel(layer)} ${Math.round(cell.value)}`}</title>
                </rect>
              );
            })}
          </g>
          <path className="henan-outline" d={mapGeometry.provincePath} />
          {mapGeometry.cityPaths.map((city) => (
            <path className="henan-city-boundary" d={city.path} key={city.name} />
          ))}
          {overview.cities.map((city) => {
            const point = projectGeo(
              city.city.longitude,
              city.city.latitude,
              mapGeometry.bounds,
              MAP_VIEWPORT
            );
            return (
              <g className="city-node" key={city.city.id}>
                <circle cx={point.x} cy={point.y} r={3.4} className="city-pin" />
                <text
                  x={point.x + (city.city.labelDx ?? 10)}
                  y={point.y + (city.city.labelDy ?? -8)}
                  className="city-label"
                >
                  {city.city.shortName}
                </text>
                <title>{`${city.city.name}：${city.probability}% · ${city.reason}`}</title>
              </g>
            );
          })}
        </svg>
        <div className="map-legend" aria-label="概率图例">
          <span><i className="legend hot" />强</span>
          <span><i className="legend warm" />中</span>
          <span><i className="legend cool" />弱</span>
          <span>{cloudLayerLabel(layer)} · {formatClock(cloudMap.targetTime)}</span>
        </div>
      </div>
    </section>
  );
}

function CityRankItem({ city }: { city: HenanCityPrediction }) {
  return (
    <div className="city-rank-item">
      <strong>{city.city.shortName}</strong>
      <span>{city.probability}%</span>
      <small>{city.reason}</small>
    </div>
  );
}

interface CloudSurfaceCell {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
  opacity: number;
}

function buildCloudSurfaceCells(
  cloudMap: CloudMap,
  layer: CloudMapLayer,
  bounds: ReturnType<typeof geoJsonBounds>
): CloudSurfaceCell[] {
  const surfaceRows = 76;
  const surfaceColumns = 84;
  const cells: CloudSurfaceCell[] = [];
  const stepLongitude = (cloudMap.bounds.maxLongitude - cloudMap.bounds.minLongitude) / surfaceColumns;
  const stepLatitude = (cloudMap.bounds.maxLatitude - cloudMap.bounds.minLatitude) / surfaceRows;

  for (let row = 0; row < surfaceRows; row += 1) {
    for (let column = 0; column < surfaceColumns; column += 1) {
      const west = cloudMap.bounds.minLongitude + column * stepLongitude;
      const east = west + stepLongitude;
      const north = cloudMap.bounds.maxLatitude - row * stepLatitude;
      const south = north - stepLatitude;
      const centerLongitude = (west + east) / 2;
      const centerLatitude = (north + south) / 2;
      const value = interpolateCloudLayer(cloudMap, centerLongitude, centerLatitude, layer);
      const opacity = surfaceOpacity(value, layer);
      if (opacity <= 0) continue;

      const topLeft = projectGeo(west, north, bounds, MAP_VIEWPORT);
      const bottomRight = projectGeo(east, south, bounds, MAP_VIEWPORT);
      cells.push({
        id: `surface-${layer}-${row}-${column}`,
        x: topLeft.x - 0.8,
        y: topLeft.y - 0.8,
        width: Math.max(1, bottomRight.x - topLeft.x + 1.6),
        height: Math.max(1, bottomRight.y - topLeft.y + 1.6),
        value,
        opacity
      });
    }
  }

  return cells;
}

function interpolateCloudLayer(
  cloudMap: CloudMap,
  longitude: number,
  latitude: number,
  layer: CloudMapLayer
): number {
  const rowPosition =
    ((cloudMap.bounds.maxLatitude - latitude) /
      (cloudMap.bounds.maxLatitude - cloudMap.bounds.minLatitude)) *
    (cloudMap.rows - 1);
  const columnPosition =
    ((longitude - cloudMap.bounds.minLongitude) /
      (cloudMap.bounds.maxLongitude - cloudMap.bounds.minLongitude)) *
    (cloudMap.columns - 1);
  const row0 = Math.max(0, Math.min(cloudMap.rows - 1, Math.floor(rowPosition)));
  const row1 = Math.max(0, Math.min(cloudMap.rows - 1, row0 + 1));
  const column0 = Math.max(0, Math.min(cloudMap.columns - 1, Math.floor(columnPosition)));
  const column1 = Math.max(0, Math.min(cloudMap.columns - 1, column0 + 1));
  const rowT = row1 === row0 ? 0 : rowPosition - row0;
  const columnT = column1 === column0 ? 0 : columnPosition - column0;
  const top =
    layerValueAt(cloudMap, row0, column0, layer) * (1 - columnT) +
    layerValueAt(cloudMap, row0, column1, layer) * columnT;
  const bottom =
    layerValueAt(cloudMap, row1, column0, layer) * (1 - columnT) +
    layerValueAt(cloudMap, row1, column1, layer) * columnT;
  return top * (1 - rowT) + bottom * rowT;
}

function layerValueAt(
  cloudMap: CloudMap,
  row: number,
  column: number,
  layer: CloudMapLayer
): number {
  const cell = cloudMap.cells.find((item) => item.row === row && item.column === column);
  return cell ? cloudLayerValue(cell, layer) : 0;
}

function surfaceOpacity(value: number, layer: CloudMapLayer): number {
  if (layer === "potential") {
    if (value < 35) return 0;
    if (value >= 70) return 0.82;
    if (value >= 55) return 0.66;
    return 0.46;
  }
  if (layer === "canvas") return value < 18 ? 0 : 0.18 + value / 150;
  if (layer === "low" || layer === "precipitation") return value < 12 ? 0 : 0.2 + value / 135;
  return 0.5;
}

function cloudLayerValue(cell: CloudMap["cells"][number], layer: CloudMapLayer): number {
  if (layer === "low") return cell.blocker;
  if (layer === "canvas") return Math.min(100, cell.cloudCoverHigh * 0.7 + cell.cloudCoverMid * 0.3);
  if (layer === "precipitation") return cell.precipitationProbability;
  return cell.firePotential;
}

function cloudLayerLabel(layer: CloudMapLayer): string {
  if (layer === "low") return "低云遮挡";
  if (layer === "canvas") return "中高云画布";
  if (layer === "precipitation") return "降水风险";
  return "火烧云潜力";
}

function cloudLayerColor(value: number, layer: CloudMapLayer): string {
  if (layer === "low") return colorRamp(value, ["#d7e7e2", "#8ba39a", "#4f625e"]);
  if (layer === "canvas") return colorRamp(value, ["#ece8d7", "#d7b661", "#d95432"]);
  if (layer === "precipitation") return colorRamp(value, ["#eaf0e8", "#7da0ad", "#375d74"]);
  if (value >= 70) return "#d95432";
  if (value >= 55) return "#e1973f";
  if (value >= 35) return "#d7b661";
  return "#dfe8df";
}

function colorRamp(value: number, colors: [string, string, string]): string {
  const clamped = Math.max(0, Math.min(100, value));
  return clamped < 50
    ? mixHex(colors[0], colors[1], clamped / 50)
    : mixHex(colors[1], colors[2], (clamped - 50) / 50);
}

function mixHex(from: string, to: string, progress: number): string {
  const start = parseHex(from);
  const end = parseHex(to);
  const channel = (key: "r" | "g" | "b") =>
    Math.round(start[key] + (end[key] - start[key]) * progress);
  return `rgb(${channel("r")}, ${channel("g")}, ${channel("b")})`;
}

function parseHex(hex: string): { r: number; g: number; b: number } {
  return {
    r: Number.parseInt(hex.slice(1, 3), 16),
    g: Number.parseInt(hex.slice(3, 5), 16),
    b: Number.parseInt(hex.slice(5, 7), 16)
  };
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="metric">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function TimePoint({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return (
    <div className={active ? "time-point active" : "time-point"}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SummaryList({
  boosts,
  risks,
  cap
}: {
  boosts: string[];
  risks: string[];
  cap?: string;
}) {
  return (
    <div className="summary-list">
      <div>
        <strong>主要加分项</strong>
        {(boosts.length ? boosts : ["暂无明显加分项"]).map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
      <div>
        <strong>主要风险</strong>
        {[...(cap ? [cap] : []), ...(risks.length ? risks : ["暂无强风险项"])].map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </div>
  );
}

function DataChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="data-chip">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function EmptyState({ loading }: { loading: boolean }) {
  return (
    <div className="empty-state">
      <CloudSun size={36} aria-hidden="true" />
      <h2>{loading ? "正在拉取郑州云层和空气质量" : "暂无朝霞 / 晚霞预测数据"}</h2>
    </div>
  );
}

function buildBurnForecast(prediction: SunsetPrediction): BurnForecast {
  const diagnostics = prediction.diagnostics;
  const side = prediction.eventType === "sunrise" ? "东边" : "西边";
  const glow = prediction.eventType === "sunrise" ? "朝霞" : "晚霞";
  const canvasQuality = Math.min(
    100,
    diagnostics.weightedHighCloud * 0.72 + diagnostics.weightedMidCloud * 0.28
  );
  const blockerRisk =
    diagnostics.weightedLowCloud >= 75 ||
    diagnostics.weightedVisibilityKm < 5 ||
    diagnostics.weightedPrecipitationProbability >= 60 ||
    diagnostics.weightedPrecipitationMm >= 0.3;

  let level: BurnForecast["level"] = "blocked";
  if (blockerRisk) {
    level = "blocked";
  } else if (
    prediction.probability >= 78 &&
    prediction.fireCloudProbability >= 66 &&
    diagnostics.weightedLowCloud <= 28 &&
    canvasQuality >= 30 &&
    canvasQuality <= 82 &&
    diagnostics.weightedVisibilityKm >= 10
  ) {
    level = "large";
  } else if (
    prediction.probability >= 65 &&
    prediction.fireCloudProbability >= 52 &&
    diagnostics.weightedLowCloud <= 45 &&
    canvasQuality >= 22 &&
    diagnostics.weightedVisibilityKm >= 8
  ) {
    level = "medium";
  } else if (
    prediction.probability >= 50 &&
    prediction.fireCloudProbability >= 34 &&
    diagnostics.weightedLowCloud <= 62 &&
    diagnostics.weightedVisibilityKm >= 6
  ) {
    level = "small";
  } else if (prediction.probability >= 35) {
    level = "weak";
  }

  const copy = burnCopy(level, glow);
  const playbook = buildBurnPlaybook(level, side, prediction, canvasQuality);

  return {
    level,
    ...copy,
    indicators: [
      {
        label: "低云压制",
        value: `${diagnostics.weightedLowCloud}%`,
        status: diagnostics.weightedLowCloud <= 28 ? "good" : diagnostics.weightedLowCloud <= 55 ? "watch" : "risk"
      },
      {
        label: "中高云画布",
        value: `${Math.round(canvasQuality)}%`,
        status: canvasQuality >= 30 && canvasQuality <= 82 ? "good" : canvasQuality >= 18 ? "watch" : "risk"
      },
      {
        label: "大片概率",
        value: `${prediction.fireCloudProbability}%`,
        status: prediction.fireCloudProbability >= 66 ? "good" : prediction.fireCloudProbability >= 42 ? "watch" : "risk"
      },
      {
        label: "通透度",
        value: `${diagnostics.weightedVisibilityKm}km`,
        status: diagnostics.weightedVisibilityKm >= 10 ? "good" : diagnostics.weightedVisibilityKm >= 6 ? "watch" : "risk"
      },
      {
        label: "降水概率",
        value: `${diagnostics.weightedPrecipitationProbability}%`,
        status:
          diagnostics.weightedPrecipitationProbability <= 25
            ? "good"
            : diagnostics.weightedPrecipitationProbability <= 50
              ? "watch"
              : "risk"
      },
      {
        label: "风与实况",
        value: `${diagnostics.windDirectionDeg}° / ${diagnostics.windSpeedKmh}km/h`,
        status: prediction.factorScores.find((factor) => factor.key === "wind")?.status ?? "watch"
      }
    ],
    playbook
  };
}

function burnCopy(level: BurnForecast["level"], glow: string): Omit<BurnForecast, "level" | "indicators" | "playbook"> {
  if (level === "large") {
    return {
      label: "大烧",
      title: `大烧窗口成立，${glow}有成片铺开的机会`,
      summary: "低云压制小，中高云画布足，颜色和范围都有机会同时起来。",
      spread: "成片 / 半边天",
      color: "强橙红",
      texture: "更可能出现连续片状或带状火烧云，边缘层次会比较明显。",
      camera: "值得专门蹲",
      confidence: "判定依据：总体概率、大片概率、低云和能见度同时达标。"
    };
  }
  if (level === "medium") {
    return {
      label: "中烧",
      title: `${glow}条件较好，重点看局地条带和云边爆色`,
      summary: "主要机会在局部云带，颜色可能明显，但范围未必铺满。",
      spread: "局地 / 条带",
      color: "明显橙粉",
      texture: "更可能是云缝、云边、条带状区域变色，而不是整片天空同时爆燃。",
      camera: "可以安排观察",
      confidence: "判定依据：概率较高，但低云、画布或通透度仍有一项未到大烧标准。"
    };
  }
  if (level === "small") {
    return {
      label: "小烧",
      title: `${glow}有小范围上色机会，临场云缝决定上限`,
      summary: "可能有短时间橙黄或粉色边缘，适合顺路观察，不建议重投入。",
      spread: "小片 / 云边",
      color: "偏淡到中等",
      texture: "更依赖地平线附近开口，容易只在局部云底或远处云边出现颜色。",
      camera: "顺路观察",
      confidence: "判定依据：基础条件未死，但大片概率和稳定性不足。"
    };
  }
  if (level === "weak") {
    return {
      label: "弱烧",
      title: `${glow}偏弱，更多是淡色天空或灰粉云幕`,
      summary: "有颜色的可能性存在，但强度、范围和持续时间都偏保守。",
      spread: "零散 / 淡霞",
      color: "淡粉灰",
      texture: "可能只有乳白高云泛粉，或低空云缝短暂泛黄。",
      camera: "不建议专门蹲",
      confidence: "判定依据：总体概率偏低，只有少数因子提供支撑。"
    };
  }
  return {
    label: "难烧",
    title: `${glow}受压制，出现大面积火烧云的条件不足`,
    summary: "低云、降水或通透度存在硬伤，除非临场突然开口。",
    spread: "难成片",
    color: "灰暗或无色",
    texture: "主要风险是低角度光路被挡，颜色到不了可染色云层。",
    camera: "可撤",
    confidence: "判定依据：至少一个硬风险触发封顶。"
  };
}

function buildBurnPlaybook(
  level: BurnForecast["level"],
  side: string,
  prediction: SunsetPrediction,
  canvasQuality: number
): string[] {
  if (level === "large") {
    return [
      `${formatClock(prediction.observationWindow.peakStart)} 前到位，机位优先朝${side}开阔处。`,
      "保留广角构图，同时准备长焦拍云边纹理。",
      `${side}云边发亮或云底泛黄时，继续等到核心窗口结束。`
    ];
  }
  if (level === "medium") {
    return [
      `${formatClock(prediction.observationWindow.peakStart)} 到 ${formatClock(prediction.observationWindow.peakEnd)} 重点看${side}云缝。`,
      canvasQuality > 82 ? "高云偏满，预期更像粉灰云幕，降低爆燃预期。" : "寻找条带状中高云，局地颜色会比全景更强。",
      "若低空灰墙继续压住地平线，提前撤。"
    ];
  }
  if (level === "small") {
    return [
      `只在${side}有清晰云缝时出门观察。`,
      "优先拍局部云边、建筑剪影和低空橙黄带。",
      "核心窗口 10 分钟内没有云边发亮，可以撤。"
    ];
  }
  if (level === "weak") {
    return [
      `不建议专门蹲，除非已经在${side}开阔处。`,
      "可观察是否出现淡粉高云幕，按短窗口处理。",
      "没有明显泛黄或泛粉信号就不继续等待。"
    ];
  }
  return [
    `${side}低空若没有突然开口，直接按无火烧云处理。`,
    "如果出现雨幕、灰墙或能见度继续下降，可以撤。",
    "只保留临场意外：云边突然发亮才重新上调判断。"
  ];
}

function getGrade(probability: number, eventType: SolarEventType): { label: string; className: string } {
  const side = eventType === "sunrise" ? "东边" : "西边";
  if (probability >= 80) return { label: "高概率，值得专门蹲", className: "high" };
  if (probability >= 65) return { label: "中高概率，可以安排观察", className: "medium-high" };
  if (probability >= 50) return { label: "不确定，看临场云缝", className: "medium" };
  if (probability >= 35) return { label: `偏低，除非${side}开口`, className: "low" };
  return { label: "基本不值得等", className: "very-low" };
}

function getSkyState(prediction: SunsetPrediction | null): { key: string; label: string } {
  if (!prediction) return { key: "loading", label: "天空待机" };
  const diagnostics = prediction.diagnostics;
  if (
    diagnostics.weightedPrecipitationProbability >= 55 ||
    diagnostics.weightedPrecipitationMm >= 0.4 ||
    diagnostics.weightedLowCloud >= 72
  ) {
    return { key: "blocked", label: "低云压制" };
  }
  if (
    diagnostics.weightedVisibilityKm < 7 ||
    diagnostics.pm25 >= 75 ||
    diagnostics.aod >= 0.75
  ) {
    return { key: "haze", label: "霾光散射" };
  }
  if (prediction.probability >= 78 && prediction.fireCloudProbability >= 62) {
    return { key: "fire", label: prediction.eventType === "sunrise" ? "朝霞爆燃" : "火烧云天幕" };
  }
  if (prediction.probability >= 65) {
    return { key: "gold", label: "金色霞光" };
  }
  if (prediction.probability >= 50) {
    return { key: "mixed", label: "云缝待判" };
  }
  return { key: "muted", label: "淡色天空" };
}

function dataSourceLabel(
  source: WanxiaDataLoadSource | "local",
  usingCache: boolean
): string {
  if (usingCache || source === "local") return "本地备份";
  if (source === "backend") return "后台预热数据";
  return "实时兜底";
}

function timeWindowLabels(eventType: SolarEventType): {
  start: string;
  peakStart: string;
  peakEnd: string;
  end: string;
} {
  if (eventType === "sunrise") {
    return {
      start: "开始看东边",
      peakStart: "朝霞主窗口",
      peakEnd: "朝霞结束",
      end: "收益下降"
    };
  }
  return {
    start: "开始看西边",
    peakStart: "晚霞主窗口",
    peakEnd: "余晖结束",
    end: "收益下降"
  };
}

function sameSelection(
  left: PredictionSelection | undefined,
  right: PredictionSelection
): boolean {
  return left?.day === right.day && left.eventType === right.eventType;
}

function formatClock(time: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(new Date(time));
}

function formatDateTime(time: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(new Date(time));
}
