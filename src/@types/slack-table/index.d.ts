declare module 'slack-table' {
  interface Column {
    width: number
    title: string
    dataIndex: string
    align?: string
  }

  interface TableData {
    title?: string
    columns: Column[]
    dataSource: object
  }
  export default function slackTable(data: TableData): string
}
