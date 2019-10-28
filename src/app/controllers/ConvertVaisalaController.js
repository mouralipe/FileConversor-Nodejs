import csv from "csvtojson";
import xls from "json2xls";
import fs from "fs";
import { format, parseISO, differenceInMinutes, subMinutes } from "date-fns";
import { resolve } from "path";

class ConvertVaisalaController {
  async index(req, res) {
    return res.json({ teste: "teste" });
  }

  async store(req, res) {
    const { path } = await req.file;

    const jsonArr = await csv({
      delimiter: "auto"
    }).fromFile(path);

    fs.unlinkSync(path);

    jsonArr.splice(0, 1);

    const formatResults = jsonArr.map(formatResult => {
      const date = formatResult.field1;
      const rain = formatResult.SParServer;
      const level = formatResult.NI_CM;

      const [dateOnly, hourOnly] = date.split(" ");

      let dateArray = String(dateOnly).split("/");
      let hourArray = String(hourOnly).split(":");

      dateArray[2] = `20${dateArray[2]}`;
      dateArray = dateArray.reverse();
      dateArray = dateArray.join("-");

      hourArray[2] = "00";
      hourArray = hourArray.join(":");

      const finalDate = `${dateArray}T${hourArray}-00:00`;
      const formatedDate = format(parseISO(finalDate), "dd/MM/yyyy HH:mm");
      const parsedDate = parseISO(finalDate);

      const rainNumber = parseFloat(rain);

      const levelMeter = parseFloat((level / 100).toFixed(2));

      return {
        parsedDate,
        formatedDate,
        rainNumber,
        levelMeter
      };
    });

    formatResults.map((item, index, array) => {
      const { parsedDate } = item;

      if (index !== 0) {
        const minuteDifference = differenceInMinutes(
          parsedDate,
          array[index - 1].parsedDate
        );

        if (minuteDifference !== 15) {
          const newParsedDate = subMinutes(parsedDate, 15);
          const newFormatedDate = format(newParsedDate, "dd/MM/yyyy HH:mm");

          array.splice(1, 0, {
            parsedDate: newParsedDate,
            formatedDate: newFormatedDate,
            rainNumber: "",
            levelMeter: ""
          });

          console.log(parsedDate);
        }
      }

      return;
    });

    const finalResults = formatResults.map(finalResult => {
      const { formatedDate, rainNumber, levelMeter } = finalResult;

      return {
        Data: formatedDate,
        Chuva: rainNumber,
        Nivel: levelMeter
      };
    });

    const excel = xls(finalResults);

    const wayToSave = resolve(
      __dirname,
      "..",
      "..",
      "..",
      "tmp",
      "downloads",
      "convertedVaisala.xlsx"
    );

    fs.writeFileSync(wayToSave, excel, "binary");

    return res.json(finalResults);
  }
}

export default new ConvertVaisalaController();
