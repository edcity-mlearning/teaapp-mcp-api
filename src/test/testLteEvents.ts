import { fetchAllLteEvents, fetchFilteredLteEvents, fetchExhibitors, getUserPresetList } from '../api/index.js';

async function testFetchLteEvents() {
    console.log('开始测试 fetchLteEvents...');

    try {
        // 使用2024年作为测试参数
        const events = await fetchAllLteEvents(2024, 0, 0, 5);

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

async function testFetchFilteredLteEvents() {
    console.log('开始测试 fetchLteEventsByDate...');

    try {
        // 使用一个有效的日期作为测试参数
        const validDate = "2025-07-02T00:00:00.000Z";
        const location = "main stage"; // 可以是 "main stage" | "theatre" | "all"
        console.log(`使用日期: ${validDate}`);
        const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYXBpIiwicmVmcmVzaF90b2tlbiI6ImV5SmhiR2NpT2lKU1V6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUowZVhCbElqb2ljbVZtY21WemFDSXNJbkpsWm5KbGMyaGZkRzlyWlc0aU9pSWlMQ0pwWVhRaU9qRTNORFEyTWpVMk9UUXNJbTVpWmlJNk1UYzBORFl5TlRZNU5Dd2laWGh3SWpveE56WXdNVGMzTmprMExDSmhkV1FpT2lKdVpYUXVhR3RsWkdOcGRIa3VZWEJ3Y3k1bFpHTnBkSGwwWldGamFHVnlMblZoZENJc0ltbHpjeUk2SWtWa1EybDBlU0JVWldGamFHVnlJQ2hWUVZRcElpd2ljM1ZpSWpvaU5UWTNNVEUxTnpVMUluMC5KSi1LbG9JTkFDR0RyOG9lMDBBcVY0RDN3aEV4ak5DN1ZVRDI1akRieUhRTlp6eG1kM2tGcFdrMHJwbmhKZzBNTG51MWp4MXVmY05zSHJLMk94UDFzbHROWEhTOUtoM1dYUDJaVHhtNUU5VzF0bkl6Y25xZFpuVkVNMng0aXcyMUxjZERST0h0THBuel9TdWJrM0JOY2M4ei11S2t5THJoc2tvT3h4UlByUDZoMXk1N05NWHB0VDd0QkF6dE05emFkNG05ODc2VDJHMVJxS3Q1THJLV01xVE4wZ29lOXZOdnNBYjFoM2ZzQ2lPTFBTUm54MjhIUVV2YmFlcUFMY0NhYUE3eVJfcHZqTXMxT1E0d1VFY3NRZzFncWk2Y0tHV2xBd1dZeGQtMDhpSXgycVFEby1jNmoza2tZOG4xRFF0U2Z1MFB4eTR3U3B6b05RbDhyRXZILWE5Y0w5UEstVDltTkc4X0lEeDI3czFhampMaDNkVmQwc2R3dzVlV25GVWpDRGNKbFR1QU80aHF5SnVQRkZubk0xV0FyZ2hTQTA3em5OUlFqOGF1X3hlWURLbmVPVFFSR19BQ1puUVpCckdXZkJmRG9nNHR6MWVLR1dBdkZieTViV2xud1Q2TFN6NDVJSHdJbnNhcjRabjI4eFJWN0NpMDU2Nm1qVUdCYS1YWUlwX0lJdGN4dGg0cDVkMXEyeXR2bi1jVVN0V013TUNwRWZIaDVFa3VwOThmNFIzN0RIZnJaSkN2UmJoV0oxbXFpTlR3c01ZcVNDTTJzUTBOaE5WUUIwSWgwR29ERlhFcWZEeXVJY2g4X0NkRDJDQ2lFLUZqXzlYSmZFSlhrVkZLeUMzd09YZkEzTk42cGVlRFlfX0s2V2ctbUNaSFhZT3FySDFwTWtRR2lSOCIsImlhdCI6MTc0NDYyNTY5NCwibmJmIjoxNzQ0NjI1Njk0LCJleHAiOjE3NDQ2MjkyOTQsImF1ZCI6Im5ldC5oa2VkY2l0eS5hcHBzLmVkY2l0eXRlYWNoZXIudWF0IiwiaXNzIjoiRWRDaXR5IFRlYWNoZXIgKFVBVCkiLCJzdWIiOiI1NjcxMTU3NTUifQ.X2H1xlT8DjU-EWawNx58ty3G3M7Z43AxRMAe1yEGzkBZ-IO8d1olXmhE3rlOorez0Y7c5xSsYA7Zp3_0AdudSK9z2Y9eXQPAuejIdsED_bI6aNnmVNg0qMZrt3_tbhEBqpGW_Zowi-US-Z65NQyPoN1SL3iFnOVXBMrI048Ld5ohgduDELZs1bM6gtQ8jyejkTNAROd8eHAyhhsBDnn9Au6ansEJP1_Wghig052jD8eB4RxHedgqo0X7Ald99Cac2N91T0Yk0cqIYUq-r4hwcoUNti7Q1lZpY_Xvo5Slav7Hxn2NtJyvW2hnAaYki1ui9R4DeFWNwLr7A9wpTJKHVw-tjioQ9EvYgOMDqmgu6RUsB9CxETcBxo5pRENyNsEiVuYEiQ0zH0DaBMBl66IFB8VyTpCXbDMLrtcjnPm0HPvcogj-qr5kCUb7S54UT2AzKOxypuQVNMdoyd6gCuWveOCZj1yUf8Nr2So7uXwMR254KQWXat0b5G9TzCVmjoT3EIwNtVOWaxmdW-z4eObVUzTbKe41h6_HycJ0WlvKanVsF3kTnOSHtEl1pSmzAnL9vlTxw0E-pbkCmPuctWDOIa0v0dJRs9c34UX-FSPNLfXaPiOnEawQYqk_7jKI8Uw6mZv_QrDh69HaI-qB8h--oJ0WS5AUF1k8-qDrbJf1OKM";

        const events = await fetchFilteredLteEvents(validDate, location);
        const events_filter = await fetchFilteredLteEvents(validDate, location, token);

        console.log('测试成功!');
        console.log(`获取到 ${events.length} 个展会事件`);

        // 打印第一个事件的简要信息(如果有)
        if (events.length > 0) {
            const firstEvent = events[0];
        }

        // 测试错误处理 - 使用无效日期
        try {
            console.log('\n测试无效日期...');
            const invalidDate = "2024-01-01T00:00:00.000Z";
            await fetchFilteredLteEvents(invalidDate);
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

async function testFetchExhibitors() {
    console.log('开始测试 fetchExhibitors...');

    try {
        const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYXBpIiwicmVmcmVzaF90b2tlbiI6ImV5SmhiR2NpT2lKU1V6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUowZVhCbElqb2ljbVZtY21WemFDSXNJbkpsWm5KbGMyaGZkRzlyWlc0aU9pSWlMQ0pwWVhRaU9qRTNORFEyTWpVMk9UUXNJbTVpWmlJNk1UYzBORFl5TlRZNU5Dd2laWGh3SWpveE56WXdNVGMzTmprMExDSmhkV1FpT2lKdVpYUXVhR3RsWkdOcGRIa3VZWEJ3Y3k1bFpHTnBkSGwwWldGamFHVnlMblZoZENJc0ltbHpjeUk2SWtWa1EybDBlU0JVWldGamFHVnlJQ2hWUVZRcElpd2ljM1ZpSWpvaU5UWTNNVEUxTnpVMUluMC5KSi1LbG9JTkFDR0RyOG9lMDBBcVY0RDN3aEV4ak5DN1ZVRDI1akRieUhRTlp6eG1kM2tGcFdrMHJwbmhKZzBNTG51MWp4MXVmY05zSHJLMk94UDFzbHROWEhTOUtoM1dYUDJaVHhtNUU5VzF0bkl6Y25xZFpuVkVNMng0aXcyMUxjZERST0h0THBuel9TdWJrM0JOY2M4ei11S2t5THJoc2tvT3h4UlByUDZoMXk1N05NWHB0VDd0QkF6dE05emFkNG05ODc2VDJHMVJxS3Q1THJLV01xVE4wZ29lOXZOdnNBYjFoM2ZzQ2lPTFBTUm54MjhIUVV2YmFlcUFMY0NhYUE3eVJfcHZqTXMxT1E0d1VFY3NRZzFncWk2Y0tHV2xBd1dZeGQtMDhpSXgycVFEby1jNmoza2tZOG4xRFF0U2Z1MFB4eTR3U3B6b05RbDhyRXZILWE5Y0w5UEstVDltTkc4X0lEeDI3czFhampMaDNkVmQwc2R3dzVlV25GVWpDRGNKbFR1QU80aHF5SnVQRkZubk0xV0FyZ2hTQTA3em5OUlFqOGF1X3hlWURLbmVPVFFSR19BQ1puUVpCckdXZkJmRG9nNHR6MWVLR1dBdkZieTViV2xud1Q2TFN6NDVJSHdJbnNhcjRabjI4eFJWN0NpMDU2Nm1qVUdCYS1YWUlwX0lJdGN4dGg0cDVkMXEyeXR2bi1jVVN0V013TUNwRWZIaDVFa3VwOThmNFIzN0RIZnJaSkN2UmJoV0oxbXFpTlR3c01ZcVNDTTJzUTBOaE5WUUIwSWgwR29ERlhFcWZEeXVJY2g4X0NkRDJDQ2lFLUZqXzlYSmZFSlhrVkZLeUMzd09YZkEzTk42cGVlRFlfX0s2V2ctbUNaSFhZT3FySDFwTWtRR2lSOCIsImlhdCI6MTc0NDYyNTY5NCwibmJmIjoxNzQ0NjI1Njk0LCJleHAiOjE3NDQ2MjkyOTQsImF1ZCI6Im5ldC5oa2VkY2l0eS5hcHBzLmVkY2l0eXRlYWNoZXIudWF0IiwiaXNzIjoiRWRDaXR5IFRlYWNoZXIgKFVBVCkiLCJzdWIiOiI1NjcxMTU3NTUifQ.X2H1xlT8DjU-EWawNx58ty3G3M7Z43AxRMAe1yEGzkBZ-IO8d1olXmhE3rlOorez0Y7c5xSsYA7Zp3_0AdudSK9z2Y9eXQPAuejIdsED_bI6aNnmVNg0qMZrt3_tbhEBqpGW_Zowi-US-Z65NQyPoN1SL3iFnOVXBMrI048Ld5ohgduDELZs1bM6gtQ8jyejkTNAROd8eHAyhhsBDnn9Au6ansEJP1_Wghig052jD8eB4RxHedgqo0X7Ald99Cac2N91T0Yk0cqIYUq-r4hwcoUNti7Q1lZpY_Xvo5Slav7Hxn2NtJyvW2hnAaYki1ui9R4DeFWNwLr7A9wpTJKHVw-tjioQ9EvYgOMDqmgu6RUsB9CxETcBxo5pRENyNsEiVuYEiQ0zH0DaBMBl66IFB8VyTpCXbDMLrtcjnPm0HPvcogj-qr5kCUb7S54UT2AzKOxypuQVNMdoyd6gCuWveOCZj1yUf8Nr2So7uXwMR254KQWXat0b5G9TzCVmjoT3EIwNtVOWaxmdW-z4eObVUzTbKe41h6_HycJ0WlvKanVsF3kTnOSHtEl1pSmzAnL9vlTxw0E-pbkCmPuctWDOIa0v0dJRs9c34UX-FSPNLfXaPiOnEawQYqk_7jKI8Uw6mZv_QrDh69HaI-qB8h--oJ0WS5AUF1k8-qDrbJf1OKM";

        const exhibitors = await fetchExhibitors();
        const exhibitors_filter = await fetchExhibitors(token);

        console.log('测试成功!');
        console.log(`获取到 ${exhibitors.length} 个展示商`);

        // 打印第一个展示商的信息(如果有)
        if (exhibitors.length > 0) {
            const firstExhibitor = exhibitors[0];
            console.log('第一个展示商信息:');
            console.log(`- ID: ${firstExhibitor.id}`);
            console.log(`- 名称: ${firstExhibitor.name_e}`);
            console.log(`- 描述: ${firstExhibitor.description_e?.substring(0, 50)}${firstExhibitor.description_e?.length > 50 ? '...' : ''}`);
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

async function testGetUserPresetList() {
    console.log('开始测试 getUserPresetList...');

    const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYXBpIiwicmVmcmVzaF90b2tlbiI6ImV5SmhiR2NpT2lKU1V6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUowZVhCbElqb2ljbVZtY21WemFDSXNJbkpsWm5KbGMyaGZkRzlyWlc0aU9pSWlMQ0pwWVhRaU9qRTNORFEyTWpVMk9UUXNJbTVpWmlJNk1UYzBORFl5TlRZNU5Dd2laWGh3SWpveE56WXdNVGMzTmprMExDSmhkV1FpT2lKdVpYUXVhR3RsWkdOcGRIa3VZWEJ3Y3k1bFpHTnBkSGwwWldGamFHVnlMblZoZENJc0ltbHpjeUk2SWtWa1EybDBlU0JVWldGamFHVnlJQ2hWUVZRcElpd2ljM1ZpSWpvaU5UWTNNVEUxTnpVMUluMC5KSi1LbG9JTkFDR0RyOG9lMDBBcVY0RDN3aEV4ak5DN1ZVRDI1akRieUhRTlp6eG1kM2tGcFdrMHJwbmhKZzBNTG51MWp4MXVmY05zSHJLMk94UDFzbHROWEhTOUtoM1dYUDJaVHhtNUU5VzF0bkl6Y25xZFpuVkVNMng0aXcyMUxjZERST0h0THBuel9TdWJrM0JOY2M4ei11S2t5THJoc2tvT3h4UlByUDZoMXk1N05NWHB0VDd0QkF6dE05emFkNG05ODc2VDJHMVJxS3Q1THJLV01xVE4wZ29lOXZOdnNBYjFoM2ZzQ2lPTFBTUm54MjhIUVV2YmFlcUFMY0NhYUE3eVJfcHZqTXMxT1E0d1VFY3NRZzFncWk2Y0tHV2xBd1dZeGQtMDhpSXgycVFEby1jNmoza2tZOG4xRFF0U2Z1MFB4eTR3U3B6b05RbDhyRXZILWE5Y0w5UEstVDltTkc4X0lEeDI3czFhampMaDNkVmQwc2R3dzVlV25GVWpDRGNKbFR1QU80aHF5SnVQRkZubk0xV0FyZ2hTQTA3em5OUlFqOGF1X3hlWURLbmVPVFFSR19BQ1puUVpCckdXZkJmRG9nNHR6MWVLR1dBdkZieTViV2xud1Q2TFN6NDVJSHdJbnNhcjRabjI4eFJWN0NpMDU2Nm1qVUdCYS1YWUlwX0lJdGN4dGg0cDVkMXEyeXR2bi1jVVN0V013TUNwRWZIaDVFa3VwOThmNFIzN0RIZnJaSkN2UmJoV0oxbXFpTlR3c01ZcVNDTTJzUTBOaE5WUUIwSWgwR29ERlhFcWZEeXVJY2g4X0NkRDJDQ2lFLUZqXzlYSmZFSlhrVkZLeUMzd09YZkEzTk42cGVlRFlfX0s2V2ctbUNaSFhZT3FySDFwTWtRR2lSOCIsImlhdCI6MTc0NDYyNTY5NCwibmJmIjoxNzQ0NjI1Njk0LCJleHAiOjE3NDQ2MjkyOTQsImF1ZCI6Im5ldC5oa2VkY2l0eS5hcHBzLmVkY2l0eXRlYWNoZXIudWF0IiwiaXNzIjoiRWRDaXR5IFRlYWNoZXIgKFVBVCkiLCJzdWIiOiI1NjcxMTU3NTUifQ.X2H1xlT8DjU-EWawNx58ty3G3M7Z43AxRMAe1yEGzkBZ-IO8d1olXmhE3rlOorez0Y7c5xSsYA7Zp3_0AdudSK9z2Y9eXQPAuejIdsED_bI6aNnmVNg0qMZrt3_tbhEBqpGW_Zowi-US-Z65NQyPoN1SL3iFnOVXBMrI048Ld5ohgduDELZs1bM6gtQ8jyejkTNAROd8eHAyhhsBDnn9Au6ansEJP1_Wghig052jD8eB4RxHedgqo0X7Ald99Cac2N91T0Yk0cqIYUq-r4hwcoUNti7Q1lZpY_Xvo5Slav7Hxn2NtJyvW2hnAaYki1ui9R4DeFWNwLr7A9wpTJKHVw-tjioQ9EvYgOMDqmgu6RUsB9CxETcBxo5pRENyNsEiVuYEiQ0zH0DaBMBl66IFB8VyTpCXbDMLrtcjnPm0HPvcogj-qr5kCUb7S54UT2AzKOxypuQVNMdoyd6gCuWveOCZj1yUf8Nr2So7uXwMR254KQWXat0b5G9TzCVmjoT3EIwNtVOWaxmdW-z4eObVUzTbKe41h6_HycJ0WlvKanVsF3kTnOSHtEl1pSmzAnL9vlTxw0E-pbkCmPuctWDOIa0v0dJRs9c34UX-FSPNLfXaPiOnEawQYqk_7jKI8Uw6mZv_QrDh69HaI-qB8h--oJ0WS5AUF1k8-qDrbJf1OKM";

    try {
        // 测试获取展示商ID列表
        console.log('\n测试获取展示商ID列表...');
        const exhibitorIds = await getUserPresetList("exhibitor", token);
        console.log('展示商ID列表:', exhibitorIds);

        // 测试获取主舞台事件ID列表
        console.log('\n测试获取主舞台事件ID列表...');
        const mainStageEventIds = await getUserPresetList("mainStageEvent", token);
        console.log('主舞台事件ID列表:', mainStageEventIds);

        // 测试获取其他事件ID列表
        console.log('\n测试获取其他事件ID列表...');
        const otherEventIds = await getUserPresetList("otherEvent", token);
        console.log('其他事件ID列表:', otherEventIds);

        console.log('\n测试成功完成！');
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
// testFetchFilteredLteEvents();
// testFetchExhibitors();
// testGetUserPresetList();
testFetchFilteredLteEvents();