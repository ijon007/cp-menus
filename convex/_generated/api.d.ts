/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as backfillTranslations from "../backfillTranslations.js";
import type * as backfillWaiterSessions from "../backfillWaiterSessions.js";
import type * as businessInfo from "../businessInfo.js";
import type * as http from "../http.js";
import type * as menuItems from "../menuItems.js";
import type * as publicMenu from "../publicMenu.js";
import type * as sections from "../sections.js";
import type * as translate from "../translate.js";
import type * as userAccess from "../userAccess.js";
import type * as waiterCalls from "../waiterCalls.js";
import type * as waiterNotes from "../waiterNotes.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  backfillTranslations: typeof backfillTranslations;
  backfillWaiterSessions: typeof backfillWaiterSessions;
  businessInfo: typeof businessInfo;
  http: typeof http;
  menuItems: typeof menuItems;
  publicMenu: typeof publicMenu;
  sections: typeof sections;
  translate: typeof translate;
  userAccess: typeof userAccess;
  waiterCalls: typeof waiterCalls;
  waiterNotes: typeof waiterNotes;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
