import emptyState from "../../assets/empty-state.svg";

export function EmptyState({ title, text, actionLabel, onAction }) {
  return (
    <div className="mx-auto max-w-sm py-12 text-center">
      <img src={emptyState} alt="" aria-hidden="true" className="mx-auto h-36 w-auto" />
      <h2 className="mt-4 text-xl">{title}</h2>
      <p className="mt-2 text-[15px] text-ink-muted">{text}</p>
      {actionLabel ? (
        <button type="button" className="btn-outline mt-5" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
