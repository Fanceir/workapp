import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface EmojiPopoverProps {
  children: React.ReactNode;
  hint?: string;
  onEmojiSelect: (emoji: any) => void;
}
const ChineseTranslation = {
  search: "搜索",
  search_no_results_1: "哦不！",
  search_no_results_2: "没有找到相关表情",
  pick: "选择一个表情…",
  add_custom: "添加自定义表情",
  categories: {
    activity: "活动",
    custom: "自定义",
    flags: "旗帜",
    foods: "食物与饮品",
    frequent: "最近使用",
    nature: "动物与自然",
    objects: "物品",
    people: "表情与角色",
    places: "旅行与景点",
    search: "搜索结果",
    symbols: "符号",
  },
  skins: {
    choose: "选择默认肤色",
    "1": "默认",
    "2": "白色",
    "3": "偏白",
    "4": "中等",
    "5": "偏黑",
    "6": "黑色",
  },
};

export const EmojiPopover = ({
  children,
  hint = "Emoji",
  onEmojiSelect,
}: EmojiPopoverProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const onSelect = (emoji: any) => {
    onEmojiSelect(emoji);
    setPopoverOpen(false);

    setTimeout(() => {
      setTooltipOpen(false);
    }, 500);
  };

  return (
    <TooltipProvider>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <Tooltip
          open={tooltipOpen}
          onOpenChange={setTooltipOpen}
          delayDuration={50}
        >
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent className="bg-black text-white border border-white/5">
            <p className="font-medium text-xs">{hint}</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent className="p-0 w-full border-none shadow-none">
          <Picker
            data={data}
            onEmojiSelect={onSelect}
            i18n={ChineseTranslation}
          />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};
