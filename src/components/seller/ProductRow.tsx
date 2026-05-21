import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Clock,
  CheckCircle2,
  XCircle,
  Pause,
  Play,
  Trash2
} from "lucide-react";
import { SellerProduct } from "@/hooks/useSellerProducts";

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
  paused: "bg-gray-100 text-gray-800",
};

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="w-3 h-3" />,
  approved: <CheckCircle2 className="w-3 h-3" />,
  rejected: <XCircle className="w-3 h-3" />,
  paused: <Pause className="w-3 h-3" />,
};

interface ProductRowProps {
  product: SellerProduct;
  onToggleStatus: (productId: string, newStatus: "approved" | "paused") => Promise<boolean>;
  onDelete: (productId: string) => Promise<boolean>;
}

export function ProductRow({ product, onToggleStatus, onDelete }: ProductRowProps) {
  const [actionLoading, setActionLoading] = useState(false);

  const handleToggleStatus = async () => {
    setActionLoading(true);
    await onToggleStatus(
      product.id, 
      product.status === "approved" ? "paused" : "approved"
    );
    setActionLoading(false);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this product?")) {
      setActionLoading(true);
      await onDelete(product.id);
      setActionLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b border-border last:border-0">
      <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
        {product.product_url ? (
          <img 
            src={product.product_url} 
            alt={product.product_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-6 h-6 text-muted-foreground" />
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm text-foreground truncate">{product.product_name}</h3>
        <p className="text-xs text-muted-foreground">{product.brand}</p>
        <div className="flex items-center gap-2 mt-1">
          <Badge className={`text-xs ${statusColors[product.status]}`}>
            <span className="flex items-center gap-1">
              {statusIcons[product.status]}
              {product.status}
            </span>
          </Badge>
          <span className="text-sm font-semibold">${product.price.toFixed(2)}</span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-6 text-sm">
        <div className="text-center">
          <p className="font-semibold">{product.views}</p>
          <p className="text-xs text-muted-foreground">Views</p>
        </div>
        <div className="text-center">
          <p className="font-semibold">{product.sales_count}</p>
          <p className="text-xs text-muted-foreground">Sales</p>
        </div>
        <div className="text-center">
          <p className="font-semibold text-primary">${(product.revenue * 0.85).toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">Earnings</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {product.status !== "pending" && product.status !== "rejected" && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleToggleStatus}
            disabled={actionLoading}
            className="w-8 h-8"
          >
            {product.status === "paused" ? (
              <Play className="w-4 h-4" />
            ) : (
              <Pause className="w-4 h-4" />
            )}
          </Button>
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={handleDelete}
          disabled={actionLoading}
          className="w-8 h-8 text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
