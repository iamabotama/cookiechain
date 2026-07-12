/*
 * VALIDATOR LOCATIONS — populate to activate the front-page world map.
 * The map section renders only when at least one entry has lat/lon.
 *
 * To collect (browser-agent task):
 *   1. POST https://rpc.cookiescan.io  {"jsonrpc":"2.0","id":1,"method":"getClusterNodes"}
 *   2. Geolocate each gossip IP (ipinfo.io or ip-api.com)
 *   3. Fill entries below and update VALIDATORS_AS_OF.
 */

export interface ValidatorLocation {
  identity: string;          // validator identity pubkey
  name?: string;             // optional display name
  lat: number | null;
  lon: number | null;
  city?: string;
  country?: string;
}

export const VALIDATORS_AS_OF = "Jul 12, 2026";

export const VALIDATORS: ValidatorLocation[] = [
  // { identity: "…", name: "Validator 1", lat: 50.11, lon: 8.68, city: "Frankfurt", country: "DE" },
];
