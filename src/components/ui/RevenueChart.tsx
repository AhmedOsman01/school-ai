"use client";

import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "next-themes";

const mockData = [
    {
        id: "revenue",
        color: "hsl(var(--color-indigo-500))",
        data: [
            { x: "Sep", y: 120000 },
            { x: "Oct", y: 145000 },
            { x: "Nov", y: 110000 },
            { x: "Dec", y: 180000 },
            { x: "Jan", y: 220000 },
            { x: "Feb", y: 195000 },
        ],
    }
];

export function RevenueChart() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const textColor = isDark ? "#94a3b8" : "#64748b";
    const gridColor = isDark ? "#334155" : "#e2e8f0";
    const tooltipColor = isDark ? "#1e293b" : "#ffffff";
    const tooltipText = isDark ? "#f8fafc" : "#0f172a";

    return (
        <div style={{ height: "300px", width: "100%" }}>
            <ResponsiveLine
                data={mockData}
                margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                xScale={{ type: "point" }}
                yScale={{
                    type: "linear",
                    min: "auto",
                    max: "auto",
                    stacked: false,
                    reverse: false,
                }}
                yFormat=" >-.2~f"
                curve="monotoneX"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 0,
                    tickPadding: 16,
                    tickRotation: 0,
                    legendOffset: 36,
                    legendPosition: "middle",
                }}
                axisLeft={{
                    tickSize: 0,
                    tickPadding: 16,
                    tickRotation: 0,
                    legendOffset: -40,
                    legendPosition: "middle",
                    format: (value) => `£${value / 1000}k`
                }}
                enableGridX={false}
                gridYValues={5}
                colors={["#4f46e5"]}
                lineWidth={3}
                pointSize={10}
                pointColor="#ffffff"
                pointBorderWidth={3}
                pointBorderColor={{ from: "serieColor" }}
                enablePointLabel={false}
                useMesh={true}
                crosshairType="x"
                theme={{
                    axis: {
                        ticks: {
                            text: { fontSize: 12, fill: textColor, fontFamily: "var(--font-inter)" },
                        },
                    },
                    grid: {
                        line: { stroke: gridColor, strokeWidth: 1, strokeDasharray: "4 4" },
                    },
                    tooltip: {
                        container: {
                            background: tooltipColor,
                            color: tooltipText,
                            fontSize: 12,
                            borderRadius: "8px",
                            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                            fontFamily: "var(--font-inter)",
                        },
                    },
                    crosshair: {
                        line: { stroke: "#94a3b8", strokeWidth: 1, strokeOpacity: 0.5, strokeDasharray: "4 4" }
                    }
                }}
            />
        </div>
    );
}
