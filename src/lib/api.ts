import { invoke } from "@tauri-apps/api";

export async function openUrl(url: string) {
  await invoke("open_url", { url });
}
