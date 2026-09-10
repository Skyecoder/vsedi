import { InfoIcon } from '../icons/Info.icon';

type ConfirmModalProps = {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 border shadow-2xl bg-zinc-800 border-zinc-700 rounded-xl">
        <div className="flex items-start gap-3">
          <span className="flex items-center justify-center flex-shrink-0 border rounded-full w-9 h-9 bg-amber-900/40 border-amber-600/40">
            <InfoIcon className="text-amber-400" />
          </span>
          <div>
            <h3 className="text-base font-semibold text-slate-100">{title}</h3>
            <p className="mt-1.5 text-sm text-slate-400">{message}</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium transition-colors rounded-lg bg-zinc-700 hover:bg-zinc-600 text-slate-200"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-amber-600 hover:bg-amber-500"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
