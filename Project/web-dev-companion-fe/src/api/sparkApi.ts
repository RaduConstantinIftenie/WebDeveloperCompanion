import axios from "axios";
import { RdfData, RdfQuery } from "../core/types/sparkApiTypes";

const url =
  "https://ucr0s0omdj.execute-api.eu-west-1.amazonaws.com/dev/api/v1/wed/sparql";
const apiKey = "azGBj7C9nraQw3Rx13w5y5dO0mkfHvXI1LhGGwDV";

export const queryRdfDb = async (args: RdfQuery): Promise<RdfData> =>
  await new Promise<RdfData>((resolve, reject) => {
    axios
      .post(
        `${url}/query`,
        args,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "x-api-key": apiKey,
          },
        }
      )
      .then((data) => resolve(data.data))
      .catch((error) => reject(error));
  });
