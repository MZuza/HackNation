import { AodCourseSession } from './AodCourseSession';

export interface AodCourse {
  id: number;
  type: string;
  attributes: {
    end: string;
    file_type: string;
    file_url: string;
    materials_file_type: string;
    materials_file_url: string;
    notes: string;
    participants_number: number;
    sessions: AodCourseSession[];
    start: string;
    state: string;
    state_name: string;
    title: string;
    venue: string;
  };
}
