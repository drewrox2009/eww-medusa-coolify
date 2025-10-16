import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
  updateProductCategoriesWorkflow,
} from "@medusajs/core-flows";
import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/utils";

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  // US States for tax regions
  const usStates = [
    "al",
    "ak",
    "az",
    "ar",
    "ca",
    "co",
    "ct",
    "de",
    "fl",
    "ga",
    "hi",
    "id",
    "il",
    "in",
    "ia",
    "ks",
    "ky",
    "la",
    "me",
    "md",
    "ma",
    "mi",
    "mn",
    "ms",
    "mo",
    "mt",
    "ne",
    "nv",
    "nh",
    "nj",
    "nm",
    "ny",
    "nc",
    "nd",
    "oh",
    "ok",
    "or",
    "pa",
    "ri",
    "sc",
    "sd",
    "tn",
    "tx",
    "ut",
    "vt",
    "va",
    "wa",
    "wv",
    "wi",
    "wy",
  ];

  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    // create the default sales channel
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: [
          {
            currency_code: "usd",
            is_default: true,
          },
          {
            currency_code: "eur",
          },
        ],
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });

  logger.info("Seeding region data...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "United States",
          currency_code: "usd",
          countries: ["us"],
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  });
  const region = regionResult[0];
  logger.info("Finished seeding regions.");

  logger.info("Seeding tax regions...");
  await createTaxRegionsWorkflow(container).run({
    input: usStates.map((province_code) => ({
      country_code: "us",
      province_code,
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
          name: "US Main Warehouse",
          address: {
            city: "New York",
            country_code: "US",
            address_1: "123 Research Blvd",
            postal_code: "10001",
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
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [
            {
              name: "Default Shipping Profile",
              type: "default",
            },
          ],
        },
      });
    shippingProfile = shippingProfileResult[0];
  }

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "US Main Warehouse delivery",
    type: "shipping",
    service_zones: [
      {
        name: "United States",
        geo_zones: [
          {
            country_code: "us",
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
        name: "Standard Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Ship in 5-7 business days.",
          code: "standard",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 15,
          },
          {
            currency_code: "eur",
            amount: 20,
          },
          {
            region_id: region.id,
            amount: 15,
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
        name: "Express Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Ship in 2-3 business days.",
          code: "express",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 35,
          },
          {
            currency_code: "eur",
            amount: 45,
          },
          {
            region_id: region.id,
            amount: 35,
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
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding publishable API key data...");
  const { result: publishableApiKeyResult } = await createApiKeysWorkflow(
    container
  ).run({
    input: {
      api_keys: [
        {
          title: "Research Chemicals Store",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  });
  const publishableApiKey = publishableApiKeyResult[0];

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding publishable API key data.");

  logger.info("Seeding product data...");

  // Create parent category first
  const { result: parentCategoryResult } =
    await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: [
          {
            name: "Research Chemicals",
            is_active: true,
          },
        ],
      },
    });

  const parentCategory = parentCategoryResult[0];

  // Create subcategories
  const { result: subcategoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        {
          name: "Psychedelic Compounds",
          is_active: true,
          parent_category_id: parentCategory.id,
        },
        {
          name: "Serotonergic Agents",
          is_active: true,
          parent_category_id: parentCategory.id,
        },
        {
          name: "Neurological Research",
          is_active: true,
          parent_category_id: parentCategory.id,
        },
        {
          name: "CNS Modulators",
          is_active: true,
          parent_category_id: parentCategory.id,
        },
      ],
    },
  });

  // Combine all categories
  const categoryResult = [...parentCategoryResult, ...subcategoryResult];

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Imidanezil",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Psychedelic Compounds")!
              .id,
          ],
          description:
            "Imidanezil is a novel research compound belonging to the imidazoline class of chemicals. This compound exhibits unique binding properties at imidazoline receptors and shows potential for neuropharmacological research. Imidanezil has demonstrated interesting effects on cognitive function and neuroprotection in preliminary studies. This compound is intended strictly for research purposes in controlled laboratory settings and should be handled with appropriate safety protocols.",
          handle: "imidanezil",
          weight: 100,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=131632928&t=l",
            },
          ],
          options: [
            {
              title: "Quantity",
              values: ["1g", "5g", "10g", "20g"],
            },
          ],
          variants: [
            {
              title: "1g",
              sku: "IMD-1G",
              options: {
                Quantity: "1g",
              },
              prices: [
                {
                  amount: 45,
                  currency_code: "usd",
                },
                {
                  amount: 55,
                  currency_code: "eur",
                },
              ],
            },
            {
              title: "5g",
              sku: "IMD-5G",
              options: {
                Quantity: "5g",
              },
              prices: [
                {
                  amount: 180,
                  currency_code: "usd",
                },
                {
                  amount: 220,
                  currency_code: "eur",
                },
              ],
            },
            {
              title: "10g",
              sku: "IMD-10G",
              options: {
                Quantity: "10g",
              },
              prices: [
                {
                  amount: 320,
                  currency_code: "usd",
                },
                {
                  amount: 390,
                  currency_code: "eur",
                },
              ],
            },
            {
              title: "20g",
              sku: "IMD-20G",
              options: {
                Quantity: "20g",
              },
              prices: [
                {
                  amount: 580,
                  currency_code: "usd",
                },
                {
                  amount: 710,
                  currency_code: "eur",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
        },
        {
          title: "Fenfluramine",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Serotonergic Agents")!
              .id,
          ],
          description:
            "Fenfluramine is a serotonergic agent that functions as a serotonin releasing agent and reuptake inhibitor. This compound has been extensively studied for its effects on serotonin neurotransmission and appetite regulation. Fenfluramine demonstrates high affinity for serotonin transporters and 5-HT2 receptors, making it valuable for research into serotonergic pathways. This compound is intended for research purposes only and should be handled with appropriate safety precautions in laboratory environments.",
          handle: "fenfluramine",
          weight: 100,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=3334&t=l",
            },
          ],
          options: [
            {
              title: "Quantity",
              values: ["1g", "5g", "10g", "20g"],
            },
          ],
          variants: [
            {
              title: "1g",
              sku: "FEN-1G",
              options: {
                Quantity: "1g",
              },
              prices: [
                {
                  amount: 35,
                  currency_code: "usd",
                },
                {
                  amount: 42,
                  currency_code: "eur",
                },
              ],
            },
            {
              title: "5g",
              sku: "FEN-5G",
              options: {
                Quantity: "5g",
              },
              prices: [
                {
                  amount: 140,
                  currency_code: "usd",
                },
                {
                  amount: 170,
                  currency_code: "eur",
                },
              ],
            },
            {
              title: "10g",
              sku: "FEN-10G",
              options: {
                Quantity: "10g",
              },
              prices: [
                {
                  amount: 250,
                  currency_code: "usd",
                },
                {
                  amount: 305,
                  currency_code: "eur",
                },
              ],
            },
            {
              title: "20g",
              sku: "FEN-20G",
              options: {
                Quantity: "20g",
              },
              prices: [
                {
                  amount: 450,
                  currency_code: "usd",
                },
                {
                  amount: 550,
                  currency_code: "eur",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
        },
        {
          title: "Irdabisant",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Neurological Research")!
              .id,
          ],
          description:
            "Irdabisant is a novel research compound that acts as a selective antagonist at specific neurotransmitter receptors. This compound has shown promise in neurological research for its ability to modulate neural signaling pathways. Irdabisant demonstrates high specificity for its target receptors with minimal off-target activity, making it valuable for mechanistic studies. This compound is intended strictly for in vitro research applications and should be handled following standard laboratory safety protocols.",
          handle: "irdabisant",
          weight: 100,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=118976548&t=l",
            },
          ],
          options: [
            {
              title: "Quantity",
              values: ["1g", "5g", "10g", "20g"],
            },
          ],
          variants: [
            {
              title: "1g",
              sku: "IRD-1G",
              options: {
                Quantity: "1g",
              },
              prices: [
                {
                  amount: 55,
                  currency_code: "usd",
                },
                {
                  amount: 67,
                  currency_code: "eur",
                },
              ],
            },
            {
              title: "5g",
              sku: "IRD-5G",
              options: {
                Quantity: "5g",
              },
              prices: [
                {
                  amount: 220,
                  currency_code: "usd",
                },
                {
                  amount: 270,
                  currency_code: "eur",
                },
              ],
            },
            {
              title: "10g",
              sku: "IRD-10G",
              options: {
                Quantity: "10g",
              },
              prices: [
                {
                  amount: 390,
                  currency_code: "usd",
                },
                {
                  amount: 475,
                  currency_code: "eur",
                },
              ],
            },
            {
              title: "20g",
              sku: "IRD-20G",
              options: {
                Quantity: "20g",
              },
              prices: [
                {
                  amount: 700,
                  currency_code: "usd",
                },
                {
                  amount: 855,
                  currency_code: "eur",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
        },
        {
          title: "SR-17018",
          category_ids: [
            categoryResult.find((cat) => cat.name === "CNS Modulators")!.id,
          ],
          description:
            "SR-17018 is a novel research compound that functions as a biased agonist at opioid receptors. This compound exhibits unique pharmacological properties, preferentially activating G-protein signaling pathways while minimizing β-arrestin recruitment. SR-17018 has shown potential for analgesic research with reduced side effects in preclinical studies. This compound is intended for research purposes only and should be handled with extreme caution following all applicable safety regulations.",
          handle: "sr-17018",
          weight: 100,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=129711842&t=l",
            },
          ],
          options: [
            {
              title: "Quantity",
              values: ["1g", "5g", "10g", "20g"],
            },
          ],
          variants: [
            {
              title: "1g",
              sku: "SR17018-1G",
              options: {
                Quantity: "1g",
              },
              prices: [
                {
                  amount: 65,
                  currency_code: "usd",
                },
                {
                  amount: 79,
                  currency_code: "eur",
                },
              ],
            },
            {
              title: "5g",
              sku: "SR17018-5G",
              options: {
                Quantity: "5g",
              },
              prices: [
                {
                  amount: 260,
                  currency_code: "usd",
                },
                {
                  amount: 318,
                  currency_code: "eur",
                },
              ],
            },
            {
              title: "10g",
              sku: "SR17018-10G",
              options: {
                Quantity: "10g",
              },
              prices: [
                {
                  amount: 460,
                  currency_code: "usd",
                },
                {
                  amount: 562,
                  currency_code: "eur",
                },
              ],
            },
            {
              title: "20g",
              sku: "SR17018-20G",
              options: {
                Quantity: "20g",
              },
              prices: [
                {
                  amount: 820,
                  currency_code: "usd",
                },
                {
                  amount: 1000,
                  currency_code: "eur",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
        },
        {
          title: "Seladepar",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Neurological Research")!
              .id,
          ],
          description:
            "Seladepar is a research compound that acts as a selective monoamine oxidase inhibitor (MAOI) with potential neuroprotective properties. This compound has demonstrated interesting effects on neurotransmitter metabolism and oxidative stress pathways in preliminary research. Seladepar shows promise for studies into neurodegenerative conditions and cognitive enhancement. This compound is intended strictly for research applications and should be handled following appropriate laboratory safety protocols.",
          handle: "seladepar",
          weight: 100,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=9838209&t=l",
            },
          ],
          options: [
            {
              title: "Quantity",
              values: ["1g", "5g", "10g", "20g"],
            },
          ],
          variants: [
            {
              title: "1g",
              sku: "SEL-1G",
              options: {
                Quantity: "1g",
              },
              prices: [
                {
                  amount: 50,
                  currency_code: "usd",
                },
                {
                  amount: 61,
                  currency_code: "eur",
                },
              ],
            },
            {
              title: "5g",
              sku: "SEL-5G",
              options: {
                Quantity: "5g",
              },
              prices: [
                {
                  amount: 200,
                  currency_code: "usd",
                },
                {
                  amount: 244,
                  currency_code: "eur",
                },
              ],
            },
            {
              title: "10g",
              sku: "SEL-10G",
              options: {
                Quantity: "10g",
              },
              prices: [
                {
                  amount: 350,
                  currency_code: "usd",
                },
                {
                  amount: 427,
                  currency_code: "eur",
                },
              ],
            },
            {
              title: "20g",
              sku: "SEL-20G",
              options: {
                Quantity: "20g",
              },
              prices: [
                {
                  amount: 620,
                  currency_code: "usd",
                },
                {
                  amount: 758,
                  currency_code: "eur",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
        },
        {
          title: "Esmirtazapine",
          category_ids: [
            categoryResult.find((cat) => cat.name === "CNS Modulators")!.id,
          ],
          description:
            "Esmirtazapine is a research compound that functions as an antagonist at multiple neurotransmitter receptors, including serotonergic and adrenergic receptors. This compound exhibits a unique pharmacological profile that makes it valuable for research into sleep regulation, mood disorders, and neurochemical pathways. Esmirtazapine has shown promise in preliminary studies for its effects on sleep architecture and circadian rhythms. This compound is intended for research purposes only and should be handled following standard laboratory safety procedures.",
          handle: "esmirtazapine",
          weight: 100,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=9838210&t=l",
            },
          ],
          options: [
            {
              title: "Quantity",
              values: ["1g", "5g", "10g", "20g"],
            },
          ],
          variants: [
            {
              title: "1g",
              sku: "ESM-1G",
              options: {
                Quantity: "1g",
              },
              prices: [
                {
                  amount: 42,
                  currency_code: "usd",
                },
                {
                  amount: 51,
                  currency_code: "eur",
                },
              ],
            },
            {
              title: "5g",
              sku: "ESM-5G",
              options: {
                Quantity: "5g",
              },
              prices: [
                {
                  amount: 168,
                  currency_code: "usd",
                },
                {
                  amount: 205,
                  currency_code: "eur",
                },
              ],
            },
            {
              title: "10g",
              sku: "ESM-10G",
              options: {
                Quantity: "10g",
              },
              prices: [
                {
                  amount: 295,
                  currency_code: "usd",
                },
                {
                  amount: 360,
                  currency_code: "eur",
                },
              ],
            },
            {
              title: "20g",
              sku: "ESM-20G",
              options: {
                Quantity: "20g",
              },
              prices: [
                {
                  amount: 520,
                  currency_code: "usd",
                },
                {
                  amount: 635,
                  currency_code: "eur",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
        },
        {
          title: "Vorinostat",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Research Chemicals")!.id,
          ],
          description:
            "Vorinostat is a histone deacetylase (HDAC) inhibitor that has been extensively studied for its effects on gene expression and cellular differentiation. This compound demonstrates potent inhibition of class I and II HDAC enzymes, making it valuable for epigenetics research and studies into transcriptional regulation. Vorinostat has shown particular promise in cancer research and studies of cellular differentiation pathways. This compound is intended for research purposes only and should be handled with appropriate safety precautions in laboratory settings.",
          handle: "vorinostat",
          weight: 100,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=5319&t=l",
            },
          ],
          options: [
            {
              title: "Quantity",
              values: ["1g", "5g", "10g", "20g"],
            },
          ],
          variants: [
            {
              title: "1g",
              sku: "VOR-1G",
              options: {
                Quantity: "1g",
              },
              prices: [
                {
                  amount: 38,
                  currency_code: "usd",
                },
                {
                  amount: 46,
                  currency_code: "eur",
                },
              ],
            },
            {
              title: "5g",
              sku: "VOR-5G",
              options: {
                Quantity: "5g",
              },
              prices: [
                {
                  amount: 152,
                  currency_code: "usd",
                },
                {
                  amount: 186,
                  currency_code: "eur",
                },
              ],
            },
            {
              title: "10g",
              sku: "VOR-10G",
              options: {
                Quantity: "10g",
              },
              prices: [
                {
                  amount: 265,
                  currency_code: "usd",
                },
                {
                  amount: 324,
                  currency_code: "eur",
                },
              ],
            },
            {
              title: "20g",
              sku: "VOR-20G",
              options: {
                Quantity: "20g",
              },
              prices: [
                {
                  amount: 470,
                  currency_code: "usd",
                },
                {
                  amount: 575,
                  currency_code: "eur",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
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

  const inventoryLevels: CreateInventoryLevelInput[] = [];
  for (const inventoryItem of inventoryItems) {
    const inventoryLevel = {
      location_id: stockLocation.id,
      stocked_quantity: 100000,
      inventory_item_id: inventoryItem.id,
    };
    inventoryLevels.push(inventoryLevel);
  }

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryLevels,
    },
  });

  logger.info("Finished seeding inventory levels data.");
}
