import shingitaiLanguageLogo from "@/assets/shingitai-language-logo-transparent.png";
import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <img
      src={shingitaiLanguageLogo}
      alt="ShinGiTai Language"
      width={1254}
      height={1254}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      className={cn("block object-contain", className)}
    />
  );
}
