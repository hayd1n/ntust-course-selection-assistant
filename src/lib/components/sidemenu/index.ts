import type { Writable } from "svelte/store";
import SidemenuContent from "./sidemenu-content.svelte";
import SidemenuHeader from "./sidemenu-header.svelte";
import SidemenuTitle from "./sidemenu-title.svelte";
import Sidemenu from "./sidemenu.svelte";

const Root = Sidemenu;
const Title = SidemenuTitle;
const Header = SidemenuHeader;
const Content = SidemenuContent;

export const contextKey = {};
export interface Context {
  width: Writable<number>;
  minWidth: Writable<number>;
  maxWidth: Writable<number>;
}

export interface ResizingEvent {
  newWidth: number;
}

export { Root, Title, Header, Content };
