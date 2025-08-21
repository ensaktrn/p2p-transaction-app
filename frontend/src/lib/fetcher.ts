import { authFetch } from "./authFetch";
export const swrFetcher = async (url: string) => (await authFetch(url)).json();
