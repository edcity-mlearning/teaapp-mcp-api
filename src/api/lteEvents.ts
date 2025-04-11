import axios from 'axios';
import {Exhibitor, LteEvent, LteEventSpeaker, Programme, SimpleLteEvent} from './types.js';

// API基础URL
const API_BASE_URL = 'https://edcity-teacher-api-uat.edcity.hk/graphql';

/**
 * 从GraphQL API获取LTE展会信息
 *
 * @param year 年份
 * @param id 事件ID，默认为0表示全部
 * @param skip 跳过的记录数量
 * @param take 获取的记录数量
 * @param location 可选的地点筛选
 * @returns 展会事件数组
 */
export async function fetchAllLteEvents(
    year: number,
    id = 0,
    skip = 0,
    take = 20,
    location = ''
): Promise<LteEvent[]> {
    // 构建GraphQL查询，添加可选的location参数
    const locationParam = location ? `, location: "${location}"` : '';
    const query = `
    query LteEvents {
      LteEvents(id: ${id}, skip: ${skip}, take: ${take}, Year: ${year}${locationParam}) {
        id
        schedule_ref
        schedule_date
        schedule_time
        language_c
        language_e
        location_c
        location_e
        topic_c
        topic_e
        abstract_c
        abstract_e
        speakers {
          id
          year
          event_id
          name_c
          name_e
          title_c
          title_e
        }
      }
    }
  `;

    // 发送GraphQL请求
    const response = await axios.post(API_BASE_URL, { query });

    if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
    }

    return response.data.data.LteEvents;
}

/**
 * 从GraphQL API获取LTE展会演讲者信息
 *
 * @param eventId 事件ID
 * @param ids 可选的演讲者ID数组
 * @param skip 跳过的记录数量
 * @param take 获取的记录数量
 * @returns 演讲者数组
 */
/**
 * 从GraphQL API获取LTE展会演讲者信息
 */
export async function fetchLteEventSpeakers(
    eventId: string,
    ids: number[] = [],
    skip = 0,
    take = 20
): Promise<LteEventSpeaker[]> {
    // 构建ID参数
    const idParam = ids.length > 0 ? `id: [${ids.join(',')}], ` : '';

    // 修改查询名称，避免与字段名冲突
    const query = `
    query GetLteEventSpeakers {
      LteEventSpeakers(
        ${idParam}
        skip: ${skip},
        take: ${take},
        event_id: "${eventId}"
      ) {
        id
        year
        event_id
        name_c
        name_e
        title_c
        title_e
      }
    }
    `;

    console.log('发送GraphQL查询:', query);

    try {
        // 尝试多种参数格式
        const variables = {
            event_id: eventId,
            skip: skip,
            take: take,
            ...(ids.length > 0 ? { id: ids } : {})
        };

        // 两种方式发送请求
        let response;
        try {
            // 方式1：使用变量
            response = await axios.post(API_BASE_URL, {
                query,
                variables
            });
        } catch (err) {
            console.log('变量方式失败，尝试直接查询方式...');
            // 方式2：直接在查询中嵌入参数
            response = await axios.post(API_BASE_URL, { query });
        }

        console.log('GraphQL响应状态:', response.status);

        if (response.data.errors) {
            console.error('GraphQL错误:', JSON.stringify(response.data.errors, null, 2));
            throw new Error(`GraphQL错误: ${response.data.errors[0].message}`);
        }

        if (!response.data.data || !response.data.data.LteEventSpeakers) {
            console.error('响应数据无效:', JSON.stringify(response.data, null, 2));
            throw new Error('API响应中未找到LteEventSpeakers数据');
        }

        return response.data.data.LteEventSpeakers;
    } catch (error: any) {
        console.error('API请求失败:', error);
        if (error.response) {
            console.error('响应状态:', error.response.status);
            console.error('响应数据:', JSON.stringify(error.response.data, null, 2));
        }
        throw error;
    }
}

/**
 * 根据日期和场地获取LTE展会信息
 *
 * @param scheduleDate 展会日期
 * @param location 场地选项: "main stage" | "theatre" | "all"
 * @returns 展会节目数组
 */
export async function fetchFilteredLteEvents(
    scheduleDate: string,
    location: "main stage" | "theatre" | "all" = "all"
): Promise<Programme[]> {
    // Validation and query code remains the same
    const validDates = [
        "2025-07-02T00:00:00.000Z",
        "2025-07-03T00:00:00.000Z",
        "2025-07-04T00:00:00.000Z"
    ];

    if (!validDates.includes(scheduleDate)) {
        throw new Error(`无效的日期。请选择以下日期之一: ${validDates.join(', ')}`);
    }

    let query = '';

    if (location === "main stage") {
        query = `
        query MyQuery {
          programmes(date: "${scheduleDate}", location_code: "X00") {
            event_id
            topic_e
            language_e
            abstract_e
            schedule_time
            location_info {
              title_e
              location_code
            }
          }
        }
        `;
    } else {
        query = `
        query MyQuery {
          programmes(date: "${scheduleDate}") {
            event_id
            topic_e
            language_e
            abstract_e
            schedule_time
            location_info {
              title_e
              location_code
            }
          }
        }
        `;
    }

    const response = await axios.post(API_BASE_URL, { query });

    if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
    }

    let programmes = response.data.data.programmes;

    if (location === "theatre") {
        programmes = programmes.filter((programme: { location_info: { location_code: string; }; }) =>
            programme.location_info.location_code !== "X00"
        );
    }

    // Transform the data: rename event_id to id and add type field
    return programmes.map((programme: any) => {
        const { event_id, ...rest } = programme;
        return {
            id: event_id,
            type: "lte_event",
            ...rest
        };
    });
}

/**
 * 获取所有展示商信息
 *
 * @returns 展示商数组
 */
export async function fetchExhibitors(): Promise<Exhibitor[]> {
    const query = `
    query MyQuery {
      exhibitors {
        exhibitor_id
        description_e
        abstract_e
        name_e
      }
    }
  `;

    // 发送GraphQL请求
    const response = await axios.post(API_BASE_URL, { query });

    if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
    }

    // Transform the data: rename exhibitor_id to id and add type field
    return response.data.data.exhibitors.map((exhibitor: any) => {
        const { exhibitor_id, ...rest } = exhibitor;
        return {
            id: exhibitor_id,
            type: "lte_exhibitor",
            ...rest
        };
    });
}

// /**
//  * 根据日期获取LTE展会信息（简化版）
//  *
//  * @param scheduleDate 展会日期
//  * @returns 简化的展会事件数组
//  */
// export async function fetchLteEventsByDate(
//     scheduleDate: string
// ): Promise<SimpleLteEvent[]> {
//     // 验证日期是否是允许的选项之一
//     const validDates = [
//         "2025-07-02T00:00:00.000Z",
//         "2025-07-03T00:00:00.000Z",
//         "2025-07-04T00:00:00.000Z"
//     ];
//
//     if (!validDates.includes(scheduleDate)) {
//         throw new Error(`无效的日期。请选择以下日期之一: ${validDates.join(', ')}`);
//     }
//
//     const query = `
//     query LteEvents {
//       LteEvents(
//         id: 0
//         skip: 0
//         Year: 2025
//         take: 50
//         schedule_date: "${scheduleDate}"
//       ) {
//         schedule_time
//         schedule_date
//         schedule_ref
//         language_c
//         topic_c
//         topic_e
//       }
//     }
//     `;
//
//     // 发送GraphQL请求
//     const response = await axios.post(API_BASE_URL, { query });
//
//     if (response.data.errors) {
//         throw new Error(response.data.errors[0].message);
//     }
//
//     return response.data.data.LteEvents;
// }