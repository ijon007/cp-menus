/** Undefined/true = waiter features on; false = menu-only. */
export function isWaiterEnabled(business: { waiterEnabled?: boolean }): boolean {
  return business.waiterEnabled !== false;
}
