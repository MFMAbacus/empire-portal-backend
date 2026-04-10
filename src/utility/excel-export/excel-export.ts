interface ExcelExporterProps {
  tableName: string[];
  filters: string[][];
}

export const ExcelExporter = ({ tableName, filters }: ExcelExporterProps) => {
  try {
    console.log(tableName, filters);
  } catch (error) {
    console.log(error);
  }
};
