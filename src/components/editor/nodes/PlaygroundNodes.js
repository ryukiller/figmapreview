
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { MarkNode } from "@lexical/mark";
import { OverflowNode } from "@lexical/overflow";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";

import { CollapsibleContainerNode } from "../plugins/CollapsiblePlugin/CollapsibleContainerNode";
import { CollapsibleContentNode } from "../plugins/CollapsiblePlugin/CollapsibleContentNode";
import { CollapsibleTitleNode } from "../plugins/CollapsiblePlugin/CollapsibleTitleNode";
import { AutocompleteNode } from "./AutocompleteNode";
import { EmojiNode } from "./EmojiNode";
import { EquationNode } from "./EquationNode";
import { ExcalidrawNode } from "./ExcalidrawNode";
import { KeywordNode } from "./KeywordNode";
import { LayoutContainerNode } from "./LayoutContainerNode";
import { LayoutItemNode } from "./LayoutItemNode";
import { PageBreakNode } from "./PageBreakNode";
import { StickyNode } from "./StickyNode";

const PlaygroundNodes = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  TableNode,
  TableCellNode,
  TableRowNode,
  AutoLinkNode,
  LinkNode,
  OverflowNode,
  StickyNode,
  EmojiNode,
  ExcalidrawNode,
  EquationNode,
  AutocompleteNode,
  KeywordNode,
  HorizontalRuleNode,
  MarkNode,
  CollapsibleContainerNode,
  CollapsibleContentNode,
  CollapsibleTitleNode,
  PageBreakNode,
  LayoutContainerNode,
  LayoutItemNode,
];

export default PlaygroundNodes;
