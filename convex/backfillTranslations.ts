import { internalAction, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";

export const listSectionsWithoutTranslations = internalQuery({
  args: {},
  handler: async (ctx) => {
    const sections = await ctx.db.query("sections").collect();
    // Backfill all sections, even if they already have translations.
    // This lets us fix previously generated, low-quality or duplicate translations.
    return sections;
  },
});

export const listItemsWithoutTranslations = internalQuery({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("menuItems").collect();
    // Backfill all items, even if they already have translations.
    return items;
  },
});

export const backfillAll = internalAction({
  args: {},
  handler: async (ctx) => {
    const sections = await ctx.runQuery(internal.backfillTranslations.listSectionsWithoutTranslations);
    const { api } = await import("./_generated/api.js");

    for (const section of sections) {
      try {
        const nameTranslations = await ctx.runAction(api.translate.translateToAllLanguages, {
          text: section.name,
          sourceLanguage: "en",
        });
        await ctx.runMutation(internal.sections.patchNameTranslations, {
          sectionId: section._id,
          nameTranslations,
        });
      } catch (err) {
        console.error(`Backfill failed for section ${section._id}:`, err);
      }
    }

    const items = await ctx.runQuery(internal.backfillTranslations.listItemsWithoutTranslations);
    for (const item of items) {
      try {
        const nameTranslations = await ctx.runAction(api.translate.translateToAllLanguages, {
          text: item.name,
          sourceLanguage: "en",
        });
        const descriptionTranslations = item.description
          ? await ctx.runAction(api.translate.translateToAllLanguages, {
              text: item.description,
              sourceLanguage: "en",
            })
          : undefined;
        await ctx.runMutation(internal.menuItems.patchTranslations, {
          itemId: item._id,
          nameTranslations,
          descriptionTranslations,
        });
      } catch (err) {
        console.error(`Backfill failed for item ${item._id}:`, err);
      }
    }

    return { sectionsProcessed: sections.length, itemsProcessed: items.length };
  },
});
