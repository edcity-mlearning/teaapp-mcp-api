import { fetchLteEvents, fetchLteEventsByDate } from '../api/index.js';

async function testFetchLteEvents() {
    console.log('开始测试 fetchLteEvents...');

    try {
        // 使用2024年作为测试参数
        const events = await fetchLteEvents(2024, 0, 0, 5);

        console.log('测试成功!');
        console.log(`获取到 ${events.length} 个展会事件`);

        // 打印第一个事件的简要信息(如果有)
        if (events.length > 0) {
            const firstEvent = events[0];
            console.log('第一个事件信息:');
            console.log(`- ID: ${firstEvent.id}`);
            console.log(`- 参考编号: ${firstEvent.schedule_ref}`);
            console.log(`- 主题: ${firstEvent.topic_c}`);
            console.log(`- 地点: ${firstEvent.location_c}`);
            console.log(`- 演讲者数量: ${firstEvent.speakers?.length || 0}`);
        }
    } catch (error: any) { // 使用类型断言解决error类型问题
        console.error('测试失败!');
        console.error('错误信息:', error?.message || '未知错误');

        // 如果是网络错误,打印更多细节
        if (error?.response) {
            console.error('服务器响应:', error.response.status, error.response.statusText);
            console.error('响应数据:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

async function testFetchLteEventsByDate() {
    console.log('开始测试 fetchLteEventsByDate...');

    try {
        // 使用一个有效的日期作为测试参数
        const validDate = "2024-12-11T00:00:00.000Z";
        console.log(`使用日期: ${validDate}`);

        const events = await fetchLteEventsByDate(validDate);

        console.log('测试成功!');
        console.log(`获取到 ${events.length} 个展会事件`);

        // 打印第一个事件的简要信息(如果有)
        if (events.length > 0) {
            const firstEvent = events[0];
            console.log('第一个事件信息:');
            console.log(`- 参考编号: ${firstEvent.schedule_ref}`);
            console.log(`- 日期: ${firstEvent.schedule_date}`);
            console.log(`- 时间: ${firstEvent.schedule_time}`);
            console.log(`- 语言: ${firstEvent.language_c}`);
            console.log(`- 主题(中): ${firstEvent.topic_c}`);
            console.log(`- 主题(英): ${firstEvent.topic_e}`);
        }

        // 测试错误处理 - 使用无效日期
        try {
            console.log('\n测试无效日期...');
            const invalidDate = "2024-01-01T00:00:00.000Z";
            await fetchLteEventsByDate(invalidDate);
            console.error('错误: 无效日期应该抛出错误，但没有');
        } catch (error: any) {
            console.log('无效日期测试成功，正确抛出错误:', error.message);
        }

    } catch (error: any) {
        console.error('测试失败!');
        console.error('错误信息:', error?.message || '未知错误');

        // 如果是网络错误，打印更多细节
        if (error?.response) {
            console.error('服务器响应:', error.response.status, error.response.statusText);
            console.error('响应数据:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

// 执行测试
// testFetchLteEvents();
testFetchLteEventsByDate();

