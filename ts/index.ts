import { registerExtensions as registerExtensions_ori } from "./extension";
import { createVariables, render as render_ori, renderLine as renderLine_ori } from "./renderer";

export const registerExtensions = registerExtensions_ori;
export async function render(source: string, options: any) {
  return render_ori(source, createVariables(options));
}
export async function renderLine(source: string, options: any) {
  return renderLine_ori(source, createVariables(options));
}
export const origin = {
  render: render_ori,
  renderLine: renderLine_ori,
};