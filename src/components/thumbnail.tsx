import { DialogTitle } from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

/* eslint-disable @next/next/no-img-element */
interface ThumbnailProps {
  url: string | null | undefined;
}

const Thumbnail = ({ url }: ThumbnailProps) => {
  if (!url) return null;

  return (
    <Dialog>
      <DialogTitle className="hidden">Image</DialogTitle>
      <DialogTrigger>
        <div className="relative overflow-hidden max-w-[360px] border rounded-lg my-2 cursor-zoom-in">
          <img
            srcSet={`${url}?w=500 500w, ${url}?w=800 800w, ${url}?w=1200 1200w`}
            sizes="(max-width: 500px) 500px, (max-width: 800px) 800px, 1200px"
            src={url}
            alt="message image"
            loading="lazy"
            
            className="rounded-md object-cover size-full"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] border-none bg-transparent p-0 shadow-none">
        <img
          srcSet={`${url}?w=500 500w, ${url}?w=800 800w, ${url}?w=1200 1200w`}
          sizes="(max-width: 500px) 500px, (max-width: 800px) 800px, 1200px"
          src={url}
          alt="message image"
          className="rounded-md object-cover size-full"
          loading="lazy"
        />
      </DialogContent>
    </Dialog>
  );
};
export default Thumbnail;
