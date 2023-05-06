import dotenv from "dotenv";
import axios from "axios";
import FormData from "form-data";
import request from "request";
import ColorThief from "colorthief";

import connectToDatabase from "../lib/mongoose";
import Store from "../models/Store";
import MenuItem from "../models/MenuItem";
import toPascalCase from "../lib/toPascalCase";
import { IMenuItemAdditionalsCategory } from "/models/types/MenuItem";
import { IMenuSection } from "/models/types/Store";

// const CV_STORE_SLUG = "reizinho-do-acai";
// const STORE_ID = "c2e77a0c-4fb2-4f86-97d6-5bc2a026e385";

const CV_STORE_SLUG = "black-cave";
const MERCHANT_ID = "75d517ad-f4ed-4f63-b422-29dec7c4cdac";

// const CV_STORE_SLUG = "setor-1";
// const MERCHANT_ID = "243ef5ae-7f07-4539-bd3c-fa291d744ddb";

// const CV_STORE_SLUG = "ho-good-burger";
// const MERCHANT_ID = "8cef2d65-e265-4124-aa9a-9ae4a95cfa11";

// const CV_STORE_SLUG = "forno-a-lenha-ristorante-e-pizzaria";
// const MERCHANT_ID = "2a8fc2e2-e8f4-4fa1-86e9-8c1f117a559b";

// const CV_STORE_SLUG = "slow-jow-bbq";
// const MERCHANT_ID = "4c1d3587-45a1-4d2e-8ad1-45727fbbd0d6";

const IFOOD_API_ACCESS_KEY = "69f181d5-0046-4221-b7b2-deef62bd60d5";
const IFOOD_API_SECRET_KEY = "9ef4fb4f-7a1d-4e0d-a9b1-9b82873297d8";
const STORE_CATALOG_URL = `https://wsloja.ifood.com.br/ifood-ws-v3/v1/merchants/${MERCHANT_ID}/catalog`;
const MENU_ITEM_IMAGES_BASE_URL = `https://static.ifood-static.com.br/image/upload/t_medium/pratos`;
const STORE_LOGO_IMAGES_BASE_URL = `https://static.ifood-static.com.br/image/upload/t_thumbnail/logosgde`;
const MERCHANT_URL = `https://marketplace.ifood.com.br/v1/merchant-info/graphql?latitude=-28.6829871&longitude=-49.36428369999999&channel=IFOOD`;
const MERCHANT_GRAPHQL_QUERY = {
  query:
    "query ($merchantId: String!) { merchant (merchantId: $merchantId, required: true) { available availableForScheduling contextSetup { catalogGroup context regionGroup } currency deliveryFee { originalValue type value } deliveryMethods { catalogGroup deliveredBy id maxTime minTime mode originalValue priority schedule { now shifts { dayOfWeek endTime interval startTime } timeSlots { availableLoad date endDateTime endTime id isAvailable originalPrice price startDateTime startTime } } subtitle title type value } deliveryTime distance features id mainCategory { code name } minimumOrderValue name paymentCodes preparationTime priceRange resources { fileName type } slug tags takeoutTime userRating } merchantExtra (merchantId: $merchantId, required: false) { address { city country district latitude longitude state streetName streetNumber timezone zipCode } categories { code description friendlyName } companyCode configs { bagItemNoteLength chargeDifferentToppingsMode nationalIdentificationNumberRequired orderNoteLength } deliveryTime description documents { CNPJ { type value } MCC { type value } } enabled features groups { externalId id name type } id locale mainCategory { code description friendlyName } merchantChain { externalId id name } metadata { ifoodClub { banner { action image priority title } } } minimumOrderValue name phoneIf priceRange resources { fileName type } shifts { dayOfWeek duration start } shortId tags takeoutTime test type userRatingCount } }",
  variables: { merchantId: MERCHANT_ID },
};

dotenv.config();

async function uploadFile(url: string, id: string) {
  const fileStream = request(url);
  const formData = new FormData();
  formData.append("file", fileStream);

  const response = await axios.post(
    `http://localhost:3000/api/upload`,
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

  const merchantResponse = await axios.post(
    MERCHANT_URL,
    MERCHANT_GRAPHQL_QUERY
  );
  const merchant = merchantResponse.data.data.merchant;
  const merchantExtra = merchantResponse.data.data.merchantExtra;

  const catalogResponse = await axios.get(STORE_CATALOG_URL, {
    headers: {
      access_key: IFOOD_API_ACCESS_KEY,
      secret_key: IFOOD_API_SECRET_KEY,
    },
  });

  const catalog = catalogResponse.data.data;

  const previousStore = await Store.findOne({
    slug: CV_STORE_SLUG,
  });

  if (previousStore?._id) {
    console.log("will delete previous store data");
    await MenuItem.deleteMany({ store: previousStore._id });
    await Store.deleteOne({ _id: previousStore._id });
  }

  const heroColor = await extractMainColor(
    STORE_LOGO_IMAGES_BASE_URL + "/" + merchant.resources[0].fileName
  );

  const createdStore = await Store.create({
    name: merchant.name,
    slug: CV_STORE_SLUG,
    listed: true,
    locations: [
      {
        address: merchantExtra.address.streetName,
        city: merchantExtra.address.city,
        neighborhood: merchantExtra.address.district,
        state: merchantExtra.address.state,
        number: merchantExtra.address.streetNumber,
        postalCode: merchantExtra.address.zipCode,
      },
    ],
    theme: {
      colors: {
        hero: heroColor,
      },
    },
  });
  await extractAndUpdateLogoImage(merchant, createdStore._id);

  console.log("created store");

  const allIngredients = [];

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
        MENU_ITEM_IMAGES_BASE_URL + "/" + ifoodItem.logoUrl,
        id
      );
      await MenuItem.updateOne(
        {
          _id: id,
        },
        {
          images: { main: uploadResponse.url },
        }
      );
    }
  }

  async function extractAndUpdateLogoImage(
    merchant: Record<string, any>,
    id: string
  ) {
    if (merchant.resources[0]) {
      const uploadResponse = await uploadFile(
        STORE_LOGO_IMAGES_BASE_URL + "/" + merchant.resources[0].fileName,
        id
      );
      await Store.updateOne(
        {
          _id: id,
        },
        {
          logo: uploadResponse.url,
        }
      );
    }
  }

  async function mapIFoodItemsBySection(ifoodSectionItems: any[]) {
    const result = [];
    for (const ifoodItem of ifoodSectionItems) {
      console.log("creating item", ifoodItem);

      const cvCustomCategories = await extractCustomization(ifoodItem);

      const createdMenuItem = await MenuItem.create({
        store: createdStore._id,
        itemType: "product",
        name: ifoodItem.description,
        price: ifoodItem.unitPrice,
        details: { short: ifoodItem.details },
        additionals: cvCustomCategories,
      });
      result.push(createdMenuItem);

      await extractAndUpdateHeroImage(ifoodItem, createdMenuItem._id);
    }

    return result;
  }

  const sections: IMenuSection[] = [];
  for (const ifoodSection of catalog.menu) {
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
            items: allIngredients,
          },
          ...sections,
        ],
      },
    }
  );
  console.log("done");
}

run();

async function extractMainColor(imageUrl: string) {
  // create a new instance of ColorThief

  // pass the image URL to the getColorAsync method
  const dominantColor = await ColorThief.getColor(imageUrl);
  // convert the RGB values to a hex string
  const hexColor = rgbToHex(
    dominantColor[0],
    dominantColor[1],
    dominantColor[2]
  );
  return hexColor;
}

// helper function to convert RGB values to a hex string
function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
