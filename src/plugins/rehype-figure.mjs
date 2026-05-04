import { visit } from "unist-util-visit";

export function rehypeFigure() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "img" || !node.properties.title || !parent) return;

      parent.children.splice(index, 1, {
        type: "element",
        tagName: "figure",
        properties: {},
        children: [
          node,
          {
            type: "element",
            tagName: "figcaption",
            properties: {},
            children: [{ type: "text", value: node.properties.title }],
          },
        ],
      });
    });
  };
}
