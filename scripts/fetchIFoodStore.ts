import dotenv from "dotenv";
import axios from "axios";
import * as fs from "fs";
import path from "path";
import blobStream from "blob-stream";
import FormData from "form-data";
import request from "request";

import connectToDatabase from "../lib/mongoose";
import Store, { IMenuSection } from "../models/Store";
import MenuItem from "../models/MenuItem";
import toPascalCase from "../lib/toPascalCase";

const CV_STORE_SLUG = "lorelay";
const STORE_URL =
  "https://wsloja.ifood.com.br/ifood-ws-v3/v1/merchants/13ef6042-6b9b-4dc9-bce7-a906b18c6742/catalog";
const IMAGES_BASE_URL = `https://static.ifood-static.com.br/image/upload/t_medium/pratos`;

dotenv.config();

const removeDuplicates = (arr, propName) => {
  let seenNames = {};
  return arr.filter((item) => {
    if (seenNames.hasOwnProperty(item[propName])) {
      return false;
    } else {
      seenNames[item[propName]] = true;
      return true;
    }
  });
};

const downloadImage = async (url: string, filename: string) => {
  const response = await axios({
    method: "GET",
    url: url,
    responseType: "stream",
  });

  const dir = path.dirname(filename);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  response.data.pipe(fs.createWriteStream(filename));

  return new Promise((resolve, reject) => {
    response.data.on("end", () => {
      resolve();
    });

    response.data.on("error", (err) => {
      reject(err);
    });
  });
};

async function uploadFile(url, id) {
  const fileStream = request(url);
  const formData = new FormData();
  formData.append("file", fileStream);

  const response = await axios.post(
    `http://localhost:3000/api/upload?id=${id}`,
    formData,
    {
      headers: {
        ...formData.getHeaders(),
      },
    }
  );

  return response.data;
}

async function run() {
  await connectToDatabase();

  const storeResponse = await axios.get(STORE_URL, {
    headers: {
      access_key: "69f181d5-0046-4221-b7b2-deef62bd60d5",
      secret_key: "9ef4fb4f-7a1d-4e0d-a9b1-9b82873297d8",
    },
  });

  const data = storeResponse.data.data;

  const previousStore = await Store.findOne({ slug: CV_STORE_SLUG });

  if (previousStore) {
    console.log("will delete previous store data");
    await MenuItem.deleteMany({ slug: previousStore._id });
    await Store.deleteOne({ _id: previousStore._id });
  }

  const createdStore = await Store.create({
    name: "Test",
    slug: CV_STORE_SLUG,
  });
  console.log("created store");

  const allIngredients = [];

  async function mapIFoodItemsBySection(ifoodSectionItems: any[]) {
    const result = [];
    for (const i of ifoodSectionItems) {
      console.log("creating item", i);

      const detailsSplit = i.details?.split(".") || [];

      const cvSectionIngredients = [];
      for (const detailItem of detailsSplit) {
        const ingredientsSplit = detailItem.split(/,| e /);
        for (const ingredientName of ingredientsSplit) {
          if (ingredientName.trim()) {
            const cvIngredient = {
              store: createdStore._id,
              itemType: "ingredient",
              name: toPascalCase(ingredientName.trim()),
              price: 0,
            };
            const found = await MenuItem.findOne(cvIngredient, null, {
              new: true,
            });
            if (!found) {
              cvSectionIngredients.push(await MenuItem.create(cvIngredient));
            } else {
              cvSectionIngredients.push(found);
            }
          }
        }
      }
      allIngredients.push(...cvSectionIngredients);

      const createdMenuItem = await MenuItem.create({
        store: createdStore._id,
        itemType: "product",
        name: i.description,
        nameDetail: i.details,
        price: i.unitPrice,
        composition: cvSectionIngredients.map((m) => ({
          section: "0",
          ingredient: m,
          quantity: 1,
          essential: true,
        })),
      });
      result.push(createdMenuItem);

      if (i.logoUrl) {
        const uploadResponse = await uploadFile(
          IMAGES_BASE_URL + "/" + i.logoUrl,
          createdMenuItem._id
        );
        console.log(uploadResponse);
        await MenuItem.updateOne(
          {
            _id: createdMenuItem._id,
          },
          {
            images: { main: uploadResponse._id },
          }
        );
      }
    }

    return result;
  }

  const sections: IMenuSection[] = [];
  for (const ifoodSection of data.menu) {
    const cvSection = {
      name: ifoodSection.name,
      items: await mapIFoodItemsBySection(ifoodSection.itens),
    } as IMenuSection;
    sections.push(cvSection);
  }

  console.log(sections);

  await Store.updateOne(
    { _id: createdStore._id },
    {
      ...createdStore.toObject(),
      menu: {
        sections: [
          {
            name: "Ingredientes",
            items: removeDuplicates(allIngredients, "name"),
          },
          ...sections,
        ],
      },
    }
  );
  console.log("done");
}

run();
