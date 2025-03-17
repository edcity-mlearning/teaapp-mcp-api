import { fetchLteEvents, fetchLteEventSpeakers } from '../api/index.js';

async function testFetchLteEventSpeakers() {
    console.log('开始测试 fetchLteEventSpeakers...');

    try {
        // 先获取一个有效的event_id
        console.log('1. 先获取LTE展会列表，找到一个有效的event_id...');
        const events = await fetchLteEvents(2024, 0, 0, 1);

        if (!events || events.length === 0) {
            console.error('没有找到任何展会事件。无法测试演讲者API。');
            return;
        }

        const event = events[0];
        const eventId = event.schedule_ref;
        console.log(`找到事件: ID=${event.id}, schedule_ref=${eventId}, 主题=${event.topic_c}`);

        // 使用找到的有效event_id测试演讲者API
        console.log(`2. 使用event_id=${eventId}查询演讲者信息...`);
        const speakers = await fetchLteEventSpeakers(eventId, [], 0, 5);

        console.log('测试成功!');
        console.log(`获取到 ${speakers.length} 个演讲者`);

        // 打印演讲者信息
        if (speakers.length > 0) {
            console.log('演讲者信息:');
            speakers.forEach((speaker, index) => {
                console.log(`[${index + 1}] ID: ${speaker.id}, 姓名: ${speaker.name_c}, 职位: ${speaker.title_c}`);
            });
        } else {
            console.log('该事件没有演讲者信息。');
        }
    } catch (error: any) {
        console.error('测试失败!');
        console.error('错误信息:', error?.message || '未知错误');
        console.error('错误堆栈:', error?.stack);
    }
}

// 执行测试
testFetchLteEventSpeakers();