import "./index.css";
import { useState, useEffect } from "react";
import PlaygroundEditorTheme from "./themes/PlaygroundEditorTheme";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";

import AutoEmbedPlugin from "./plugins/AutoEmbedPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import CollapsiblePlugin from "./plugins/CollapsiblePlugin";
import ComponentPickerPlugin from "./plugins/ComponentPickerPlugin";
import DragDropPaste from "./plugins/DragDropPastePlugin";
import DraggableBlockPlugin from "./plugins/DraggableBlockPlugin";
import FloatingLinkEditorPlugin from "./plugins/FloatingLinkEditorPlugin";
import FloatingTextFormatToolbarPlugin from "./plugins/FloatingTextFormatToolbarPlugin";
import { LayoutPlugin } from "./plugins/LayoutPlugin/LayoutPlugin";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import { MaxLengthPlugin } from "./plugins/MaxLengthPlugin";
import PageBreakPlugin from "./plugins/PageBreakPlugin";
import TabFocusPlugin from "./plugins/TabFocusPlugin";
import TableCellActionMenuPlugin from "./plugins/TableActionMenuPlugin";
import TableCellResizer from "./plugins/TableCellResizer";

import Placeholder from "./ui/Placeholder";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import EmojiPickerPlugin from "./plugins/EmojiPickerPlugin";
import EmojisPlugin from "./plugins/EmojisPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";

import {
  SharedHistoryContext,
  useSharedHistoryContext,
} from "./context/SharedHistoryContext";

import { useSettings, SettingsContext } from "./context/SettingsContext";

import { CAN_USE_DOM } from "./shared/canUseDOM";

import EquationsPlugin from "./plugins/EquationsPlugin";
import ExcalidrawPlugin from "./plugins/ExcalidrawPlugin";

import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { TableContext } from "./plugins/TablePlugin";
import SaveButton from "@/app/preventivo/[id]/components/SaveButton";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import LexicalClickableLinkPlugin from '@lexical/react/LexicalClickableLinkPlugin';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';

import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import useNewPreventiviStore from "@/app/preventivo/[id]/NewPreventivoStore";





const updatePage = (editor, activePageSerialized) => {
  console.log("Serialized Active Page:", activePageSerialized);
  const editorState = editor.parseEditorState(activePageSerialized);
  editor.setEditorState(editorState);
};


export default function Editor({ isLoadning, editMode, page }) {

  //const [editMode, setEditMode] = useState(true)

  const setPageContentById = useNewPreventiviStore((state) => state.setPageContentById);
  const activePage = useNewPreventiviStore((state) => state.activePage);
  const pagesContent = useNewPreventiviStore((state) => state.pagesContent)
  const activePageContent = pagesContent.find(p => p.id === page)?.content
  const templateReloadId = useNewPreventiviStore((state) => state.templateReloadId)

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    console.log("inside editor useEffect: ", page, activePage)
    if (editor) {
      if (activePageContent) {
        updatePage(editor, activePageContent);
      }
    }
  }, [editor, activePage, isLoadning, page, templateReloadId]);

  const { historyState } = useSharedHistoryContext();
  const {
    settings: {
      isCollab,
      isAutocomplete,
      isMaxLength,
      isCharLimit,
      isCharLimitUtf8,
      isRichText,
      showTreeView,
      showTableOfContents,
      shouldUseLexicalContextMenu,
      tableCellMerge,
      tableCellBackgroundColor,
    }
  } = useSettings();
  const isEditable = true;
  const text = isCollab
    ? "Enter some collaborative rich text..."
    : editMode
      ? "Enter some rich text..."
      : "Enter some plain text...";
  const placeholder = <Placeholder>{text}</Placeholder>;
  const [floatingAnchorElem, setFloatingAnchorElem] = useState(null);
  const [isSmallWidthViewport, setIsSmallWidthViewport] = useState(false);
  const [isLinkEditMode, setIsLinkEditMode] = useState(false);

  const onRef = (_floatingAnchorElem) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };



  useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport =
        CAN_USE_DOM && window.matchMedia("(max-width: 1025px)").matches;

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport);
      }
    };
    updateViewPortWidth();
    window.addEventListener("resize", updateViewPortWidth);

    return () => {
      window.removeEventListener("resize", updateViewPortWidth);
    };
  }, [isSmallWidthViewport]);

  return (
    <div className="editor-shell">
      <SettingsContext>

        <SharedHistoryContext>
          <TableContext>
            <>
              {editMode && (
                <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
              )}
              <div
                className={`editor-container ${showTreeView ? "tree-view" : ""} ${!editMode ? "plain-text pl-5" : ""
                  }`}
              >
                {isMaxLength && <MaxLengthPlugin maxLength={30} />}
                <DragDropPaste />
                <AutoFocusPlugin />
                <ComponentPickerPlugin />
                <EmojiPickerPlugin />
                <AutoEmbedPlugin />

                <EmojisPlugin />
                <AutoLinkPlugin />

                {editMode ? (
                  <>
                    <HistoryPlugin externalHistoryState={historyState} />

                    <RichTextPlugin
                      contentEditable={
                        <div className="editor-scroller">
                          <div className="editor" ref={onRef}>
                            <ContentEditable className="ContentEditable__root" />
                          </div>
                        </div>
                      }
                      placeholder={placeholder}
                      ErrorBoundary={LexicalErrorBoundary}
                    />
                    <ListPlugin />
                    <ListMaxIndentLevelPlugin maxDepth={7} />
                    <TablePlugin
                      hasCellMerge={tableCellMerge}
                      hasCellBackgroundColor={tableCellBackgroundColor}
                    />
                    <TableCellResizer />
                    <LinkPlugin />
                    {!isEditable && <LexicalClickableLinkPlugin />}
                    <HorizontalRulePlugin />
                    <EquationsPlugin />
                    <ExcalidrawPlugin />
                    <TabFocusPlugin />
                    <TabIndentationPlugin />
                    <CollapsiblePlugin />
                    <PageBreakPlugin />
                    <LayoutPlugin />
                    {floatingAnchorElem && !isSmallWidthViewport && (
                      <>
                        <DraggableBlockPlugin anchorElem={floatingAnchorElem} />

                        <FloatingLinkEditorPlugin
                          anchorElem={floatingAnchorElem}
                          isLinkEditMode={isLinkEditMode}
                          setIsLinkEditMode={setIsLinkEditMode}
                        />
                        <TableCellActionMenuPlugin
                          anchorElem={floatingAnchorElem}
                          cellMerge={true}
                        />
                        <FloatingTextFormatToolbarPlugin
                          anchorElem={floatingAnchorElem}
                        />
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <PlainTextPlugin
                      contentEditable={<ContentEditable />}
                      placeholder={placeholder}
                      ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin externalHistoryState={historyState} />
                  </>
                )}
                <OnChangePlugin onChange={() => {
                  const currentEditorState = JSON.stringify(editor.getEditorState().toJSON());
                  console.log("CurrentPageNEW :", page)
                  setPageContentById(page, currentEditorState);
                  console.log("CuurentEditor: ", currentEditorState)
                  console.log("CurrentPage: ", activePageContent)
                }} />
              </div>
            </>
          </TableContext>
        </SharedHistoryContext>
      </SettingsContext>
    </div>
  );
}
