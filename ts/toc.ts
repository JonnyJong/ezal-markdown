import { IFlatToc, INormalToc, IToc, ITreeToc } from "../types/dev";

export class Toc implements IToc{
  #toc: IFlatToc[] = [];
  #ids: { [id: string]: number } = {};
  #setId(id: string): number {
    if (!this.#ids[id]) {
      this.#ids[id] = 1;
      return 0;
    }
    return this.#ids[id]++;
  };
  addTocItem(name: string, level: number, id?: string | undefined): string {
    if (typeof name !== 'string') {
      throw new Error('Require toc name.');
    }
    if (typeof level !== 'number' || level < 1 || isNaN(level) || level === Infinity) {
      throw new Error('Missing toc level or out of range.');
    }
    if (typeof id === 'string') {
      if (id === '') throw new Error(`Using empty id in "${name}".`);
      this.#setId(id);
    } else {
      let index = this.#setId(name);
      id = name;
      if (index > 0) id += '-' + index;
    }
    this.#toc.push({ name, level, id });
    return id;
  };
  addId(id: string): string {
    let index = this.#setId(id);
    if (index > 0) id += '-' + index;
    return id;
  };
  toNormal(): INormalToc {
    let flat: IFlatToc[] = [];
    let root: ITreeToc = { name:'', id: '', child: []};
    let treePath: ITreeToc[] = [root];
    for (const item of this.#toc) {
      treePath = treePath.slice(0, item.level);

      flat.push({
        name: item.name,
        id: item.id,
        level: treePath.length - 1,
      });
      
      let treeNode: ITreeToc = {
        name: item.name,
        id: item.id,
        child: [],
      };
      treePath[treePath.length - 1].child.push(treeNode);
      treePath.push(treeNode);
    }
    return { flat, tree: root.child };
  };
};