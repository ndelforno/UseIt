import { Card, CardContent } from "./card";
import { Link } from "react-router-dom";

interface ListingCardProps {
  title: string;
  area: string;
  price: string;
  imageUrl?: string;
  id?: string | number; // when provided, card is clickable
}

export function ListingCard({ title, area, price, imageUrl, id }: ListingCardProps) {
  const content = (
    <>
      {imageUrl ? (
        <img
          src={`${import.meta.env.VITE_API_BASE_URL}${imageUrl}`}
          alt={title}
          className="h-28 w-full object-cover"
        />
      ) : (
        <div className="h-28 bg-gradient-to-br from-slate-200 to-slate-100" />
      )}
      <CardContent className="p-3">
        <div className="font-medium">{title}</div>
        <div className="text-sm text-slate-500">
          {area} • {price}/day
        </div>
      </CardContent>
    </>
  );
  return (
    <Card className={`overflow-hidden hover:shadow-md transition ${id ? "cursor-pointer" : ""}`}>
      {id ? <Link to={`/tool/${id}`}>{content}</Link> : content}
    </Card>
  );
}
