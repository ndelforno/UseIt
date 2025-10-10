import { Card, CardImage } from "./card";
import { Link } from "react-router-dom";

interface ListingCardProps {
  title: string;
  area: string;
  price: string;
  imageUrl?: string;
  id?: string | number; // when provided, card is clickable
  actions?: React.ReactNode;
}

const normalizePrice = (price: string) =>
  price?.toLowerCase().includes("day") ? price : `${price}/day`;

export function ListingCard({ title, area, price, imageUrl, id, actions }: ListingCardProps) {
  const displayPrice = normalizePrice(price);

  const imageNode = imageUrl ? (
    <CardImage
      src={`${import.meta.env.VITE_API_BASE_URL}${imageUrl}`}
      alt={title}
      className="h-40 object-cover"
    />
  ) : (
    <div className="h-40 w-full rounded-t-xl bg-gradient-to-br from-slate-200 to-slate-100" />
  );

  const description = (
    <div className="space-y-1 px-6 py-4">
      <div className="text-base font-semibold text-slate-900">{title}</div>
      <div className="text-sm text-slate-600">
        {area} • {displayPrice}
      </div>
    </div>
  );

  const content = (
    <div className="flex h-full flex-col">
      {imageNode}
      {description}
      {actions && (
        <div className="flex justify-end gap-2 border-t border-slate-200 px-4 py-3 bg-white transition-colors group-hover/link:bg-white">
          {actions}
        </div>
      )}
    </div>
  );

  return (
    <Card
      className={`group/card overflow-hidden border border-slate-200 p-0 transition hover:border-amber-500 hover:shadow-md hover:translate-y-[-2px] ${
        id ? "cursor-pointer" : ""
      }`}
    >
      {id ? (
        <Link to={`/tool/${id}`} className="group/link block h-full">
          {content}
        </Link>
      ) : (
        content
      )}
    </Card>
  );
}
