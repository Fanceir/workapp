import Quill, { Delta, Op, QuillOptions } from "quill";
import "quill/dist/quill.snow.css";
import hljs from "highlight.js";
import "highlight.js/styles/a11y-dark.css";
import "quill/dist/quill.core.css";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  MutableRefObject,
  useState,
} from "react";
import { Button } from "./ui/button";
import { PiTextAa } from "react-icons/pi";
import { MdSend } from "react-icons/md";
import { ImageIcon, Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import Hint from "./hint";
import { EmojiPopover } from "./emoji-popover";
type EditorValue = {
  body: string;
  image: File | null;
};
interface EditorProps {
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
  variant?: "create" | "update";
}

const Editor = ({
  variant = "create",
  onSubmit,
  placeholder = "写一些东西",
  defaultValue = [],
  disabled = false,
  innerRef,
}: EditorProps) => {
  const [text, setText] = useState("");
  const [isToolbarVisible, setToolbarVisible] = useState(false);
  const placeHoderRef = useRef(placeholder);
  const submitRef = useRef(onSubmit);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);
  useLayoutEffect(() => {
    placeHoderRef.current = placeholder;
    submitRef.current = onSubmit;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  }, [placeholder, onSubmit, defaultValue, disabled]);

  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );
    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeHoderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "strike"],
          ["link"],
          ["code-block"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
        syntax: { hljs },
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                //TODO: handle enter key
              },
            },
            "shift enter": {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quillRef.current?.insertText(
                  quillRef.current.getSelection()?.index || 0,
                  "\n"
                );
              },
            },
          },
        },
      },
    };
    if (typeof hljs !== "undefined") {
      const quill = new Quill(editorContainer, options);
      quillRef.current = quill;
      quillRef.current.focus();
      if (innerRef) {
        innerRef.current = quill;
      }
      quill.setContents(defaultValueRef.current);
      setText(quill.getText());
      quill.on(Quill.events.TEXT_CHANGE, () => {
        setText(quill.getText());
      });
      return () => {
        quill.off(Quill.events.TEXT_CHANGE);
        if (container) {
          container.innerHTML = "";
        }
        if (quillRef.current) {
          quillRef.current = null;
        }
        if (innerRef) {
          innerRef.current = null;
        }
      };
    }
  }, [innerRef]);

  const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0;
  const onEmojiSelect = (emoji: { native: string }) => {
    const quill = quillRef.current;
    quill?.insertText(quill?.getSelection()?.index || 0, emoji.native);
  };
  const toggleToolbar = () => {
    setToolbarVisible((prev) => !prev);
    const toolbarElement = document.querySelector(".ql-toolbar");
    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden");
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
        <div ref={containerRef} className="h-full ql-custom" />
        <div className="flex px-2 pb-2 z-[5]">
          <Hint label={isToolbarVisible ? "显示工具栏" : "隐藏工具栏"}>
            <Button
              disabled={disabled}
              onClick={toggleToolbar}
              size="iconSm"
              variant="ghost"
            >
              <PiTextAa className="size-4 " />
            </Button>
          </Hint>
          <EmojiPopover onEmojiSelect={onEmojiSelect}>
            <Button disabled={disabled} size="iconSm" variant="ghost">
              <Smile className="size-4" />
            </Button>
          </EmojiPopover>
          {variant == "create" && (
            <Hint label="图片">
              <Button
                disabled={disabled}
                onClick={() => {}}
                size="iconSm"
                variant="ghost"
              >
                <ImageIcon className="size-4 " />
              </Button>
            </Hint>
          )}
          {variant == "update" && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {}}
                disabled={disabled}
              >
                取消
              </Button>
              <Button
                size="sm"
                onClick={() => {}}
                disabled={disabled}
                className=" bg-[#007a5a] hover:[#007a5a]/80 text-white"
              >
                保存
              </Button>
            </div>
          )}
          {variant == "create" && (
            <Button
              size="iconSm"
              disabled={disabled || isEmpty}
              onClick={() => {}}
              className={cn(
                "ml-auto ",
                isEmpty
                  ? " bg-white hover:bg-white text-muted-foreground"
                  : " bg-[#007a5a] hover:[#007a5a]/80 text-white"
              )}
            >
              <MdSend className="size-4" />
            </Button>
          )}
        </div>
      </div>
      {variant == "create" && (
        <div
          className={cn(
            "p-2 text-[10px] text-muted-foreground flex justify-end",
            !isEmpty && "opacity-100"
          )}
        >
          <p> Shift+Enter 增加新的一行</p>
        </div>
      )}
    </div>
  );
};
export default Editor;
