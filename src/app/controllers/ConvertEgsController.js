import xls from "json2xls";
import fs from "fs";
import csv from "csvtojson";

class ConvertEgsController {
  async index(req, res) {
    return res.json({ teste: "teste" });
  }

  async store(req, res) {
    const { path } = await req.file;

    const jsonArr = await csv({
      delimiter: "auto"
    }).fromFile(path);

    fs.unlinkSync(path);

    const results = jsonArr.map(result => {
      const date = result.date;
      const rainCollected = result.v1;
      const level = result.v2;

      return {
        Data: date,
        Chuva: rainCollected,
        Nivel: level
      };
    });

    //const excel = xls(results);

    //fs.writeFileSync("convertedEgs.xlsx", excel, "binary");

    return res.json(results);
  }
}

export default new ConvertEgsController();
