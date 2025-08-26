import { Card, CardContent } from "./card";

interface ListingCardProps {
  title: string;
  area: string;
  price: string;
  imageUrl?: string;
}

export function ListingCard({
  title,
  area,
  price,
  imageUrl,
}: ListingCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition">
      {imageUrl ? (
        <img src={imageUrl} alt={title} className="h-28 w-full object-cover" />
      ) : (
        <div className="h-28 bg-gradient-to-br from-slate-200 to-slate-100" />
      )}
      <CardContent className="p-3">
        <div className="font-medium">{title}</div>
        <div className="text-sm text-slate-500">
          {area} • {price}/day
        </div>
      </CardContent>
    </Card>
  );
}
