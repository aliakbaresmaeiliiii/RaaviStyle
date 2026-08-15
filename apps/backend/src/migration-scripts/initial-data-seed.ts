import { MedusaContainer } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductOptionsWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createStoresWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function initial_data_seed({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(
    ModuleRegistrationName.FULFILLMENT
  );

  const countries = ["gb", "de", "dk", "se", "fr", "es", "it"];

  logger.info("Seeding store data...");
  const {
    result: [defaultSalesChannel],
  } = await createSalesChannelsWorkflow(container).run({
    input: {
      salesChannelsData: [
        {
          name: "فروشگاه راوی‌استایل",
          description: "کانال فروش فروشگاه راوی‌استایل",
        },
      ],
    },
  });

  const {
    result: [publishableApiKey],
  } = await createApiKeysWorkflow(container).run({
    input: {
      api_keys: [
        {
          title: "Default Publishable API Key",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  });

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel.id],
    },
  });

  const {
    result: [store],
  } = await createStoresWorkflow(container).run({
    input: {
      stores: [
        {
          name: "راوی‌استایل",
          supported_currencies: [
            {
              currency_code: "irr",
              is_default: true,
            },
            {
              currency_code: "eur",
              is_default: false,
            },
            {
              currency_code: "usd",
              is_default: false,
            },
          ],
          default_sales_channel_id: defaultSalesChannel.id,
        },
      ],
    },
  });

  logger.info("Seeding region data...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "ایران",
          currency_code: "irr",
          countries,
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  });
  const region = regionResult[0];
  logger.info("Finished seeding regions.");

  logger.info("Seeding tax regions...");
  await createTaxRegionsWorkflow(container).run({
    input: countries.map((country_code) => ({
      country_code,
      provider_id: "tp_system",
    })),
  });
  logger.info("Finished seeding tax regions.");

  logger.info("Seeding stock location data...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "انبار تهران",
          address: {
            city: "تهران",
            country_code: "DK",
            address_1: "",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  logger.info("Seeding fulfillment data...");
  // This is created by a migration script in core.
  const { data: shippingProfileResult } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  });
  const shippingProfile = shippingProfileResult[0];

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "ارسال از انبار تهران",
    type: "shipping",
    service_zones: [
      {
        name: "ایران",
        geo_zones: [
          {
            country_code: "gb",
            type: "country",
          },
          {
            country_code: "de",
            type: "country",
          },
          {
            country_code: "dk",
            type: "country",
          },
          {
            country_code: "se",
            type: "country",
          },
          {
            country_code: "fr",
            type: "country",
          },
          {
            country_code: "es",
            type: "country",
          },
          {
            country_code: "it",
            type: "country",
          },
        ],
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  });

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "ارسال عادی",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "عادی",
          description: "ارسال در ۲ تا ۳ روز.",
          code: "standard",
        },
        prices: [
          {
            currency_code: "irr",
            amount: 490000,
          },
          {
            currency_code: "usd",
            amount: 10,
          },
          {
            currency_code: "eur",
            amount: 10,
          },
          {
            region_id: region.id,
            amount: 490000,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "ارسال سریع",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "سریع",
          description: "ارسال تا ۲۴ ساعت.",
          code: "express",
        },
        prices: [
          {
            currency_code: "irr",
            amount: 490000,
          },
          {
            currency_code: "usd",
            amount: 10,
          },
          {
            currency_code: "eur",
            amount: 10,
          },
          {
            region_id: region.id,
            amount: 490000,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  });
  logger.info("Finished seeding fulfillment data.");

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel.id],
    },
  });
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding product data...");

  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        {
          name: "بگ",
          is_active: true,
        },
        {
          name: "مام‌استایل",
          is_active: true,
        },
        {
          name: "کارگو",
          is_active: true,
        },
        {
          name: "راسته",
          is_active: true,
        },
      ],
    },
  });

  const { result: productOptionsResult } = await createProductOptionsWorkflow(
    container
  ).run({
    input: {
      product_options: [
        {
          title: "سایز",
          values: ["۳۸", "۴۰", "۴۲", "۴۴"],
        },
        {
          title: "رنگ",
          values: ["مشکی", "سفید"],
        },
      ],
    },
  });
  const sizeOption = productOptionsResult.find((o) => o.title === "سایز")!;
  const colorOption = productOptionsResult.find((o) => o.title === "رنگ")!;

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "شلوار بگ نخی",
          category_ids: [
            categoryResult.find((cat) => cat.name === "بگ")!.id,
          ],
          description:
            "شلوار بگ نخی سبک، مناسب روزمره. دوخت ایران.",
          handle: "t-shirt",
          weight: 400,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-back.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-front.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-back.png",
            },
          ],
          options: [
            { id: sizeOption.id },
            { id: colorOption.id },
          ],
          variants: [
            {
              title: "۳۸ / مشکی",
              sku: "SHIRT-S-BLACK",
              options: {
                سایز: "۳۸",
                رنگ: "مشکی",
              },
              prices: [
                {
                  amount: 1500000,
                  currency_code: "irr",
                },
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "۳۸ / سفید",
              sku: "SHIRT-S-WHITE",
              options: {
                سایز: "۳۸",
                رنگ: "سفید",
              },
              prices: [
                {
                  amount: 1500000,
                  currency_code: "irr",
                },
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "۴۰ / مشکی",
              sku: "SHIRT-M-BLACK",
              options: {
                سایز: "۴۰",
                رنگ: "مشکی",
              },
              prices: [
                {
                  amount: 1500000,
                  currency_code: "irr",
                },
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "۴۰ / سفید",
              sku: "SHIRT-M-WHITE",
              options: {
                سایز: "۴۰",
                رنگ: "سفید",
              },
              prices: [
                {
                  amount: 1500000,
                  currency_code: "irr",
                },
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "۴۲ / مشکی",
              sku: "SHIRT-L-BLACK",
              options: {
                سایز: "۴۲",
                رنگ: "مشکی",
              },
              prices: [
                {
                  amount: 1500000,
                  currency_code: "irr",
                },
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "۴۲ / سفید",
              sku: "SHIRT-L-WHITE",
              options: {
                سایز: "۴۲",
                رنگ: "سفید",
              },
              prices: [
                {
                  amount: 1500000,
                  currency_code: "irr",
                },
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "۴۴ / مشکی",
              sku: "SHIRT-XL-BLACK",
              options: {
                سایز: "۴۴",
                رنگ: "مشکی",
              },
              prices: [
                {
                  amount: 1500000,
                  currency_code: "irr",
                },
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "۴۴ / سفید",
              sku: "SHIRT-XL-WHITE",
              options: {
                سایز: "۴۴",
                رنگ: "سفید",
              },
              prices: [
                {
                  amount: 1500000,
                  currency_code: "irr",
                },
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel.id,
            },
          ],
        },
        {
          title: "شلوار مام‌استایل کتان",
          category_ids: [
            categoryResult.find((cat) => cat.name === "مام‌استایل")!.id,
          ],
          description:
            "مام‌استایل با کمر راحت و پارچه کتان.",
          handle: "sweatshirt",
          weight: 400,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-back.png",
            },
          ],
          options: [{ id: sizeOption.id }],
          variants: [
            {
              title: "۳۸",
              sku: "SWEATSHIRT-S",
              options: {
                سایز: "۳۸",
              },
              prices: [
                {
                  amount: 1500000,
                  currency_code: "irr",
                },
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "۴۰",
              sku: "SWEATSHIRT-M",
              options: {
                سایز: "۴۰",
              },
              prices: [
                {
                  amount: 1500000,
                  currency_code: "irr",
                },
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "۴۲",
              sku: "SWEATSHIRT-L",
              options: {
                سایز: "۴۲",
              },
              prices: [
                {
                  amount: 1500000,
                  currency_code: "irr",
                },
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "۴۴",
              sku: "SWEATSHIRT-XL",
              options: {
                سایز: "۴۴",
              },
              prices: [
                {
                  amount: 1500000,
                  currency_code: "irr",
                },
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel.id,
            },
          ],
        },
        {
          title: "شلوار کارگو",
          category_ids: [
            categoryResult.find((cat) => cat.name === "کارگو")!.id,
          ],
          description:
            "کارگو با جیب و جزئیات برای استفاده روزانه.",
          handle: "sweatpants",
          weight: 400,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-back.png",
            },
          ],
          options: [{ id: sizeOption.id }],
          variants: [
            {
              title: "۳۸",
              sku: "SWEATPANTS-S",
              options: {
                سایز: "۳۸",
              },
              prices: [
                {
                  amount: 1500000,
                  currency_code: "irr",
                },
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "۴۰",
              sku: "SWEATPANTS-M",
              options: {
                سایز: "۴۰",
              },
              prices: [
                {
                  amount: 1500000,
                  currency_code: "irr",
                },
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "۴۲",
              sku: "SWEATPANTS-L",
              options: {
                سایز: "۴۲",
              },
              prices: [
                {
                  amount: 1500000,
                  currency_code: "irr",
                },
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "۴۴",
              sku: "SWEATPANTS-XL",
              options: {
                سایز: "۴۴",
              },
              prices: [
                {
                  amount: 1500000,
                  currency_code: "irr",
                },
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel.id,
            },
          ],
        },
        {
          title: "شلوار راسته کتان",
          category_ids: [
            categoryResult.find((cat) => cat.name === "راسته")!.id,
          ],
          description:
            "راسته کلاسیک با قد استاندارد و پارچه کتان.",
          handle: "shorts",
          weight: 400,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-front.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-back.png",
            },
          ],
          options: [{ id: sizeOption.id }],
          variants: [
            {
              title: "۳۸",
              sku: "SHORTS-S",
              options: {
                سایز: "۳۸",
              },
              prices: [
                {
                  amount: 1500000,
                  currency_code: "irr",
                },
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "۴۰",
              sku: "SHORTS-M",
              options: {
                سایز: "۴۰",
              },
              prices: [
                {
                  amount: 1500000,
                  currency_code: "irr",
                },
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "۴۲",
              sku: "SHORTS-L",
              options: {
                سایز: "۴۲",
              },
              prices: [
                {
                  amount: 1500000,
                  currency_code: "irr",
                },
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "۴۴",
              sku: "SHORTS-XL",
              options: {
                سایز: "۴۴",
              },
              prices: [
                {
                  amount: 1500000,
                  currency_code: "irr",
                },
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel.id,
            },
          ],
        },
      ],
    },
  });
  logger.info("Finished seeding product data.");

  logger.info("Seeding inventory levels.");

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryItems.map((item) => ({
        location_id: stockLocation.id,
        stocked_quantity: 1000000,
        inventory_item_id: item.id,
      })),
    },
  });

  logger.info("Finished seeding inventory levels data.");
}
