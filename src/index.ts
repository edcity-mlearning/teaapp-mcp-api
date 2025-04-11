#!/usr/bin/env node

/**
 * 一个MCP服务器，用于提供LTE展会相关的API服务
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  fetchAllLteEvents,
  fetchLteEventSpeakers,
  fetchFilteredLteEvents,
  fetchExhibitors
} from './api/index.js';

/**
 * 创建一个具有工具功能的MCP服务器
 */
const server = new Server(
    {
      name: "teaapp-mcp-api",
      version: "0.1.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
);

/**
 * 处理工具列表请求
 * 提供LTE展会查询相关的工具
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "query_lte_events",
        description: "Retrieves Learning & Teaching Expo (LTE) 2025 events scheduled for a specific date and filtered by venue location. Returns programme information with: id (unique ID), type, topic_e (topic), language_e (presentation language), abstract_e (abstract), schedule_time, and location_info (containing title_e and location_code).",
        inputSchema: {
          type: "object",
          properties: {
            date: {
              type: "string",
              description: "Event date in YYYY-MM-DD format. Only the three official expo dates are supported.",
              enum: ["2025-07-02", "2025-07-03", "2025-07-04"]
            },
            location: {
              type: "string",
              description: "Venue filter option: 'main stage' (shows only events located at the main stage), 'theatre' (shows only events located at theatre venues), or 'all' (shows all LTE events regardless of location, including both main stage and theatre events).",
              enum: ["main stage", "theatre", "all"],
              default: "all"
            }
          },
          required: ["date"]
        }
      },
      {
        name: "query_lte_exhibitors",
        description: "Retrieves all exhibitors participating in the Learning & Teaching Expo (LTE) 2025. Returns an array of exhibitor information with: id (unique ID), type, name_e (name), description_e (description), and abstract_e (abstract).",
        inputSchema: {
          type: "object",
          properties: {},
          required: []
        }
      }
    ]
  };
});

/**
 * 处理工具调用请求
 * 实现LTE展会查询功能
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "query_lte_events": {
      const date = request.params.arguments?.date;
      const location = request.params.arguments?.location || "all";

      if (!date) {
        throw new Error("Date parameter is required");
      }

      // Convert to API required format
      const fullDate = `${date}T00:00:00.000Z`;

      try {
        // Pass both date and location parameters
        const events = await fetchFilteredLteEvents(fullDate, location as "main stage" | "theatre" | "all");
        return {
          content: [{
            type: "text",
            text: JSON.stringify(events, null, 2)
          }]
        };
      } catch (error: any) {
        throw new Error(`Failed to fetch LTE events: ${error?.message || 'Unknown error'}`);
      }
    }

    case "query_lte_exhibitors": {
      try {
        const exhibitors = await fetchExhibitors();
        return {
          content: [{
            type: "text",
            text: JSON.stringify(exhibitors, null, 2)
          }]
        };
      } catch (error: any) {
        throw new Error(`Failed to fetch LTE exhibitors: ${error?.message || 'Unknown error'}`);
      }
    }

    default:
      throw new Error("Unknown tool");
  }
});

/**
 * 启动服务器，使用标准输入/输出流进行通信
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("服务器错误:", error);
  process.exit(1);
});
