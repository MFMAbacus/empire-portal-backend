import {Request, Response} from 'express';
import ExcelJS from 'exceljs';

// eslint-disable-next-line max-len
export const excelHandler = async (request: Request, response: Response): Promise<void> => {
  const {data: rawData} = request.query;

  if (typeof rawData !== 'string') {
    response.status(400).send('Bad Request');
    return;
  }

  const data: string[][] = JSON.parse(rawData);

  if (!Array.isArray(data)) {
    response.status(400).send('Bad Request');
    return;
  }
  for (const row of data) {
    if (!Array.isArray(row)) {
      response.status(400).send('Bad Request');
      return;
    }

    for (const cell of row) {
      if (typeof cell !== 'string') {
        response.status(400).send('Bad Request');
        return;
      }
    }
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Main');

  data.forEach((row) => {
    worksheet.addRow(row);
  });

  // eslint-disable-next-line max-len
  response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  // eslint-disable-next-line max-len
  response.setHeader('Content-Disposition', 'attachment; filename=collections.xlsx');

  try {
    await workbook.xlsx.write(response);
    response.status(200).end();
  } catch (error: unknown) {
    console.error('Error sending Excel file:', error);
    response.status(500).send('Internal Server Error');
  }
};
