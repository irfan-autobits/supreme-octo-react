// project/src/utils/ImagePreview.tsx
export default function ImagePreview({
  src,
  onClose,
  className = "",
}: {
  src: string;
  onClose: () => void;
  className?: string;
}) {
  return (
    <div
      className={`fixed inset-0 bg-black/60 flex items-center justify-center ${className}`}
      onClick={onClose}
    >
      <img src={src} className="max-h-[90vh] max-w-[90vw] rounded-2xl" />
    </div>
  );
}
