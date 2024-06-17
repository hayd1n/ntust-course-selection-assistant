import { Store } from "tauri-plugin-store-api";

const store = new Store("state.json");

export async function setStateSidemenuWidth(width: number) {
  await store.set("uiSidemenuWidth", width);
}

export async function getStateSidemenuWidth() {
  return await store.get<number>("uiSidemenuWidth");
}
