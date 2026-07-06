"use client";

import { useMemo } from "react";
import { geoMercator, geoPath, geoCentroid } from "d3-geo";
import type { Feature, Geometry } from "geojson";
import malaysiaGeo from "@/lib/data/malaysia-states.json";
import {
  getStateIdFromFeature,
  type MalaysiaFeatureCollection,
  type MalaysiaGeoProperties,
} from "@/lib/map/malaysia-map";
import { states } from "@/lib/data/states";

const geoData = malaysiaGeo as MalaysiaFeatureCollection;

const WIDTH = 820;
const HEIGHT = 540;
const MAP_PADDING = 28;

const SMALL_STATE_IDS = new Set(["kualalumpur", "labuan"]);
const EAST_STATE_IDS = new Set(["sabah", "sarawak", "labuan"]);

const MAP_FILL_DEFAULT = "#E2E8F0";
const MAP_FILL_HOVER = "#16A34A";
const MAP_FILL_SELECTED = "#0F766E";
const MAP_STROKE = "#FFFFFF";

interface MapPath {
  stateId: string;
  d: string;
  labelX: number;
  labelY: number;
  shortName: string;
  showLabel: boolean;
}

interface MalaysiaGeoMapProps {
  hoveredState: string | null;
  selectedState: string | null;
  onHover: (stateId: string | null) => void;
  onSelect: (stateId: string) => void;
}

function createProjection() {
  const projection = geoMercator();
  // Auto-fit all Malaysia DOSM features into the viewBox
  projection.fitExtent(
    [
      [MAP_PADDING, MAP_PADDING],
      [WIDTH - MAP_PADDING, HEIGHT - MAP_PADDING],
    ],
    geoData
  );
  return projection;
}

function computeMapPaths(): MapPath[] {
  const projection = createProjection();
  const pathGenerator = geoPath(projection);

  return geoData.features
    .map((feature: Feature<Geometry, MalaysiaGeoProperties>) => {
      const stateId = getStateIdFromFeature(feature);
      if (!stateId) return null;

      const d = pathGenerator(feature);
      if (!d) return null;

      const [lon, lat] = geoCentroid(feature);
      const projected = projection([lon, lat]);
      const stateMeta = states.find((s) => s.id === stateId);

      return {
        stateId,
        d,
        labelX: projected?.[0] ?? 0,
        labelY: projected?.[1] ?? 0,
        shortName: stateMeta?.shortName ?? stateId.toUpperCase(),
        showLabel: !SMALL_STATE_IDS.has(stateId),
      } satisfies MapPath;
    })
    .filter((p): p is MapPath => p !== null);
}

function computeRegionLabels(paths: MapPath[]) {
  const peninsular = paths.filter((p) => !EAST_STATE_IDS.has(p.stateId));
  const east = paths.filter((p) => EAST_STATE_IDS.has(p.stateId));

  const avg = (items: MapPath[], key: "labelX" | "labelY") =>
    items.reduce((sum, p) => sum + p[key], 0) / (items.length || 1);

  return {
    peninsular: { x: avg(peninsular, "labelX"), y: 32 },
    east: { x: avg(east, "labelX"), y: 32 },
  };
}

function getStateFill(stateId: string, hoveredState: string | null, selectedState: string | null) {
  if (hoveredState === stateId) return MAP_FILL_HOVER;
  if (selectedState === stateId) return MAP_FILL_SELECTED;
  return MAP_FILL_DEFAULT;
}

export default function MalaysiaGeoMap({
  hoveredState,
  selectedState,
  onHover,
  onSelect,
}: MalaysiaGeoMapProps) {
  const paths = useMemo(() => computeMapPaths(), []);
  const regionLabels = computeRegionLabels(paths);

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full h-auto"
      style={{ minHeight: "300px" }}
      role="img"
      aria-label="Peta Malaysia — interactive map of Malaysian states"
    >
      <defs>
        <pattern
          id="mapTopoPattern"
          patternUnits="userSpaceOnUse"
          width="200"
          height="200"
        >
          <path
            d="M0 50 Q50 38 100 48 T200 46 M0 90 Q45 78 100 88 T200 84 M0 130 Q55 118 100 128 T200 124"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="0.4"
            opacity="0.35"
          />
        </pattern>
        <filter id="stateGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow
            dx="0"
            dy="1"
            stdDeviation="2"
            floodColor="#0F766E"
            floodOpacity="0.2"
          />
        </filter>
      </defs>

      {/* Warm linen canvas */}
      <rect x={0} y={0} width={WIDTH} height={HEIGHT} fill="#F5F5F3" />
      <rect
        x={0}
        y={0}
        width={WIDTH}
        height={HEIGHT}
        fill="url(#mapTopoPattern)"
        opacity={0.03}
      />

      {/* Region labels — positioned from fitted projection centroids */}
      <text
        x={regionLabels.peninsular.x}
        y={regionLabels.peninsular.y}
        textAnchor="middle"
        fill="#8A98B0"
        style={{
          fontSize: "9px",
          letterSpacing: "0.22em",
          fontFamily: "var(--font-poppins)",
          fontWeight: 500,
        }}
      >
        SEMENANJUNG MALAYSIA
      </text>
      <text
        x={regionLabels.east.x}
        y={regionLabels.east.y}
        textAnchor="middle"
        fill="#8A98B0"
        style={{
          fontSize: "9px",
          letterSpacing: "0.22em",
          fontFamily: "var(--font-poppins)",
          fontWeight: 500,
        }}
      >
        MALAYSIA TIMUR
      </text>

      {/* State paths */}
      {paths.map(({ stateId, d, labelX, labelY, shortName, showLabel }) => {
        const isHovered = hoveredState === stateId;
        const isSelected = selectedState === stateId;
        const isActive = isHovered || isSelected;
        const fill = getStateFill(stateId, hoveredState, selectedState);

        return (
          <g key={stateId}>
            <path
              d={d}
              fill={fill}
              stroke={MAP_STROKE}
              strokeWidth={isActive ? 1.5 : 1}
              strokeLinejoin="round"
              strokeLinecap="round"
              className="cursor-pointer"
              style={{
                transition: "fill 0.35s ease-out, stroke-width 0.3s ease-out, filter 0.3s ease-out",
              }}
              filter={isActive ? "url(#stateGlow)" : undefined}
              onMouseEnter={() => onHover(stateId)}
              onMouseLeave={() => onHover(null)}
              onClick={() => onSelect(stateId)}
            />
            {showLabel && (
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                pointerEvents="none"
                fill={isActive ? "#FFFFFF" : "#475569"}
                style={{
                  fontSize: stateId === "sabah" || stateId === "sarawak" ? "8px" : "6.5px",
                  fontFamily: "var(--font-poppins)",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  transition: "fill 0.35s ease-out",
                  textShadow: isActive ? "0 1px 3px rgba(0,0,0,0.25)" : "none",
                }}
              >
                {shortName}
              </text>
            )}
          </g>
        );
      })}

      {/* Federal territory markers */}
      {paths
        .filter((p) => SMALL_STATE_IDS.has(p.stateId))
        .map(({ stateId, labelX, labelY, shortName }) => {
          const isHovered = hoveredState === stateId;
          const isSelected = selectedState === stateId;
          const isActive = isHovered || isSelected;
          const fill = getStateFill(stateId, hoveredState, selectedState);

          return (
            <g
              key={`marker-${stateId}`}
              className="cursor-pointer"
              onMouseEnter={() => onHover(stateId)}
              onMouseLeave={() => onHover(null)}
              onClick={() => onSelect(stateId)}
            >
              <circle
                cx={labelX}
                cy={labelY}
                r={isActive ? 5 : 3.5}
                fill={fill}
                stroke={MAP_STROKE}
                strokeWidth={1.25}
                style={{ transition: "fill 0.35s ease-out, r 0.3s ease-out" }}
              />
              {isActive && (
                <text
                  x={labelX}
                  y={labelY - 10}
                  textAnchor="middle"
                  fill="#0F766E"
                  style={{
                    fontSize: "6px",
                    fontFamily: "var(--font-poppins)",
                    fontWeight: 700,
                  }}
                >
                  {shortName}
                </text>
              )}
            </g>
          );
        })}
    </svg>
  );
}
