import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
type CopyFieldProps = { label?: string; value?: string; hideValue?: boolean };


export function CopyField({ label, value, hideValue }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>(0);

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  useEffect(() => {
    return () => clearTimeout(timer.current);
  }, []);

  return (
    <div className="flex items-center gap-2">
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
      {!hideValue && <strong className="text-primary">{value}</strong>}
      <Button className="cursor-pointer" type="button" onClick={handleCopy}>
        {copied ? 'Copied!' : 'Copy'}
      </Button>
    </div>
  );
}