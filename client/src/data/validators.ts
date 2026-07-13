/*
 * VALIDATOR LOCATIONS — collected via tools/validator-census.html
 * (getClusterNodes + getVoteAccounts + IP geolocation), July 12, 2026.
 * Coordinates are the datacenter city; the map fans out co-located
 * validators in screen space so markers never stack.
 */

export interface ValidatorLocation {
  identity: string;
  name?: string;
  lat: number | null;
  lon: number | null;
  city?: string;
  country?: string;
}

export const VALIDATORS_AS_OF = "Jul 12, 2026";

export const VALIDATORS: ValidatorLocation[] = [
  { identity: "4wHgybVzqEKn17HRh1MXdLDdaZDh6Y59atZrLtygmCew", name: "Cookiescan",    lat: 60.1714, lon: 24.9316,  city: "Helsinki", country: "Finland" },
  { identity: "DL9GPSXrhAEnU5Ads3HLhEJ9fCDLpnmmkzxoe712W4xP", name: "Oven",          lat: 60.1714, lon: 24.9316,  city: "Helsinki", country: "Finland" },
  { identity: "9MC7fLJmLVfLMAsACJ2g2nAbkzPggQGHvAq4Rr5LNBVi", name: "BakeYourStake", lat: 60.1714, lon: 24.9316,  city: "Helsinki", country: "Finland" },
  { identity: "8uY6sMQKqgHsb1S1trEYeH25974Zv93jHn1A46Hn6GaV", name: "Morsel",        lat: 41.8426, lon: -87.6306, city: "Chicago",  country: "United States" },
];
