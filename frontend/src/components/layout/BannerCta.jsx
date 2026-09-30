import { Link } from "react-router-dom";

export function BannerCta({ title, text, actionLabel, actionTo, actionHref }) {
  const className =
    "inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-plum-900 transition hover:bg-cream-100";
  return (
    <section className="mx-auto max-w-container px-4">
      <div className="flex flex-col items-start gap-6 rounded-card bg-plum-900 p-8 md:flex-row md:items-center md:justify-between md:p-10">
        <div>
          <h2 className="text-2xl text-white md:text-3xl">{title}</h2>
          <p className="mt-2 max-w-lg text-[15px] text-cream-50/80">{text}</p>
        </div>
        {actionHref ? (
          <a
            href={actionHref}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
          >
            {actionLabel}
          </a>
        ) : (
          <Link to={actionTo} className={className}>
            {actionLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
