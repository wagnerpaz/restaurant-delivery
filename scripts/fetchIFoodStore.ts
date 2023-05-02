import dotenv from "dotenv";
import axios from "axios";
import FormData from "form-data";
import request from "request";

import connectToDatabase from "../lib/mongoose";
import Store, { IMenuSection } from "../models/Store";
import MenuItem, { IMenuItemAdditionalsCategory } from "../models/MenuItem";
import toPascalCase from "../lib/toPascalCase";

// const CV_STORE_SLUG = "reizinho-do-acai";
// const STORE_ID = "c2e77a0c-4fb2-4f86-97d6-5bc2a026e385";

const CV_STORE_SLUG = "farm2go";
const STORE_ID = "11000cf9-fd12-4953-8a53-20a780a7e201";

const STORE_URL = `https://wsloja.ifood.com.br/ifood-ws-v3/v1/merchants/${STORE_ID}/catalog`;
const IMAGES_BASE_URL = `https://static.ifood-static.com.br/image/upload/t_medium/pratos`;

dotenv.config();

const removeDuplicates = (arr: Record<string, any>, propName: string) => {
  let seenNames: Record<string, any> = {};
  return arr.filter((item: any) => {
    if (seenNames.hasOwnProperty(item[propName])) {
      return false;
    } else {
      seenNames[item[propName]] = true;
      return true;
    }
  });
};

async function uploadFile(url: string, id: string) {
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
    await MenuItem.deleteMany({ slug: previousStore.slug });
    await Store.deleteOne({ _id: previousStore._id });
  }

  const createdStore = await Store.create({
    name: "Test",
    slug: CV_STORE_SLUG,
  });
  console.log("created store");

  const allIngredients = [];

  async function extractIngredients(ifoodItem) {
    const detailsSplit = ifoodItem.details?.split(".") || [];

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

    return cvSectionIngredients;
  }

  async function extractCustomization(ifoodItem: Record<string, any>) {
    console.log("extracting customization...");
    const cvCustomCategories: IMenuItemAdditionalsCategory[] = [];
    for (const choice of ifoodItem.choices || []) {
      const cvCustomItems = [];
      for (const gi of choice.garnishItens || []) {
        const toBeAdd = {
          store: createdStore._id,
          name: gi.description,
          itemType: "ingredient",
          price: gi.unitPrice,
        };
        const found = await MenuItem.findOne(toBeAdd, null, {
          new: true,
        });
        if (!found) {
          const cvCustomItem = await MenuItem.create(toBeAdd);
          await extractAndUpdateHeroImage(gi, cvCustomItem._id);
          cvCustomItems.push(cvCustomItem);
          allIngredients.push(cvCustomItem);
        } else {
          cvCustomItems.push(found);
        }
      }

      const cvCustomCategory = {
        categoryName: choice.name,
        min: choice.min,
        max: choice.max,
        items: cvCustomItems.map((m) => ({ ingredient: m, min: 0, max: 1 })),
      };

      cvCustomCategories.push(cvCustomCategory);
    }
    return cvCustomCategories;
  }

  async function extractAndUpdateHeroImage(
    ifoodItem: Record<string, any>,
    id: string
  ) {
    if (ifoodItem.logoUrl) {
      const uploadResponse = await uploadFile(
        IMAGES_BASE_URL + "/" + ifoodItem.logoUrl,
        id
      );
      await MenuItem.updateOne(
        {
          _id: id,
        },
        {
          images: { main: uploadResponse._id },
        }
      );
    }
  }

  async function mapIFoodItemsBySection(ifoodSectionItems: any[]) {
    const result = [];
    for (const ifoodItem of ifoodSectionItems) {
      console.log("creating item", ifoodItem);

      // const cvSectionIngredients = await extractIngredients(ifoodItem);
      const cvCustomCategories = await extractCustomization(ifoodItem);

      const createdMenuItem = await MenuItem.create({
        store: createdStore._id,
        itemType: "product",
        name: ifoodItem.description,
        nameDetail: ifoodItem.details,
        price: ifoodItem.unitPrice,
        // composition: cvSectionIngredients.map((m) => ({
        //   section: "0",
        //   ingredient: m,
        //   quantity: 1,
        //   essential: true,
        // })),
        details: { short: ifoodItem.details },
        additionals: cvCustomCategories,
      });
      result.push(createdMenuItem);

      await extractAndUpdateHeroImage(ifoodItem, createdMenuItem._id);
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
