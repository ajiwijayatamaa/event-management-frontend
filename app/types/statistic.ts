export interface StatisticsSummary {
  activeEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
}

export interface ChartData {
  label: string;
  revenue: number;
  tickets: number;
}

export interface StatisticsResponse {
  summary: StatisticsSummary;
  chartData: ChartData[];
}
