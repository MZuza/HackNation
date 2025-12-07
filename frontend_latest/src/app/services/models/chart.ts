export interface IChartBlueprint {
    chart_type: string;
    datasets: string[];
    labels: string;
    name?: string;
    sort: string;
}

export interface IChartResponse {
    attributes: {
        chart: IChartBlueprint;
        is_default: boolean;
        name?: string;
    };
    id: string;
    type: string;
}
