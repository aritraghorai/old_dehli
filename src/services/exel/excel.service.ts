import df, { DataFrame } from 'danfojs-node';

interface IReadExel {
  [key: string]: string[];
}

export const readEcexl = async (file: string): Promise<IReadExel> => {
  const exel = (await df.readExcel(file)) as DataFrame;
  return df.toJSON(exel, { format: 'row' }) as IReadExel;
};
