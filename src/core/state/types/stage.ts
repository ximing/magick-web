export type Node = {
  [id: string]: {
    id: string;
    type: string;
    attrs: Record<string, any>;
  };
};

export type Child = {
  id: string;
  children: Child[];
};

export type Root = {
  version: number;
  id: string;
  attrs: Record<string, any>;
  children: Child[];
  node: Node;
};
