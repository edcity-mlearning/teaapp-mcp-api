// 添加一个简化的LTE事件类型，只包含需要的字段
export type SimpleLteEvent = {
    schedule_time: string;
    schedule_date: string;
    schedule_ref: string;
    language_c: string;
    topic_c: string;
    topic_e: string;
}

// API类型定义
export type LteEventSpeaker = {
    id: number;
    year: number;
    event_id: string;
    name_c: string;
    name_e: string;
    title_c: string;
    title_e: string;
}

export type LteEvent = {
    id: number;
    Year: number;
    schedule_ref: string;
    schedule_date: string;
    schedule_time: string;
    language_c: string;
    language_e: string;
    powered_c: string;
    powered_e: string;
    location_c: string;
    location_e: string;
    location_icon: string;
    topic_e: string;
    topic_c: string;
    abstract_c: string;
    abstract_e: string;
    speakers: LteEventSpeaker[];
}

// 需要添加到 types.js 文件中
export interface ProgrammeLocationInfo {
    title_e: string;
    location_code: string;
}

export interface Programme {
    id: number;
    type: string;
    topic_e: string;
    language_e: string;
    abstract_e: string;
    schedule_time: string;
    location_info: ProgrammeLocationInfo;
}

export interface Exhibitor {
    id: number;
    type: string;
    description_e: string;
    abstract_e: string;
    name_e: string;
}