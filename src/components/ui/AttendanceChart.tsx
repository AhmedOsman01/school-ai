"use client";

import { ResponsiveBar } from "@nivo/bar";
import { useTheme } from "next-themes";

const mockData = [
    { class: "Grade 10", present: 95, absent: 5 },
    { class: "Grade 11", present: 88, absent: 12 },
    { class: "Grade 12", present: 92, absent: 8 },
];

export function AttendanceChart() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const textColor = isDark ? "#94a3b8" : "#64748b";
    const gridColor = isDark ? "#334155" : "#e2e8f0";

    return (
        <div style={{ height: "300px", width: "100%" }}>
            <ResponsiveBar
                data={mockData}
                keys={["present", "absent"]}
                indexBy="class"
                margin={{ top: 20, right: 20, bottom: 50, left: 40 }}
                padding={0.3}
                valueScale={{ type: "linear" }}
                indexScale={{ type: "band", round: true }}
                colors={["#10b981", "#ef4444"]}
                borderRadius={4}
                borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 0,
                    tickPadding: 16,
                    tickRotation: 0,
                }}
                axisLeft={{
                    tickSize: 0,
                    tickPadding: 16,
                    tickRotation: 0,
                }}
                enableGridX={false}
                enableGridY={true}
                gridYValues={5}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor="#ffffff"
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
                            background: isDark ? "#1e293b" : "#ffffff",
                            color: isDark ? "#f8fafc" : "#0f172a",
                            fontSize: 12,
                            borderRadius: "8px",
                            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                            fontFamily: "var(--font-inter)",
                        },
                    },
                }}
                legends={[
                    {
                        dataFrom: "keys",
                        anchor: "bottom",
                        direction: "row",
                        justify: false,
                        translateX: 0,
                        translateY: 50,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: "left-to-right",
                        itemOpacity: 0.85,
                        symbolSize: 12,
                        effects: [
                            {
                                on: "hover",
                                style: {
                                    itemOpacity: 1,
                                },
                            },
                        ],
                    },
                ]}
            />
        </div>
    );
}
