export interface UserDashboardData {
        subscriptions: {
            datasets: number,
            queries: number
        };
        academy: {
            planned: number,
            current: number,
            finished: number
        };
        lab: {
            analyses: number,
            researches: number
        };
        suggestions: {
            active: number,
            inactive: number
        };
        meetings: {
            planned: number,
            finished: number
        };
        fav_charts: {
            'slot-1': {
                name?: string,
                ident?: string,
                thumb_url?: string;
            },
            'slot-2': {
                name?: string,
                ident?: string,
                thumb_url?: string;
            }
        };
}
