import { type ComponentType } from "react";

export async function wrapLazy(
  importFn: () => Promise<{ default: ComponentType<any> }>,
) {
  const module = await importFn();
  return { Component: module.default };
}
