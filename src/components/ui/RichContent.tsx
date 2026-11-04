import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

/**
 * Renders plain-text content stored in the database:
 * blank-line-separated paragraphs, lines starting with "## " become
 * section headings, and lines starting with "- " become list items.
 */
export function RichContent({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const blocks = content.split(/\n{2,}/).filter(Boolean);

  return (
    <div className={cn("space-y-5", className)}>
      {blocks.map((block, i) => {
        const lines = block.split("\n").filter(Boolean);
        const isList = lines.every((line) => line.trimStart().startsWith("- "));

        if (isList) {
          return (
            <ul key={i} className="space-y-3">
              {lines.map((line, j) => (
                <li key={j} className="flex items-start gap-3">
                  <Icon
                    name="check"
                    className="mt-1 size-4 shrink-0 text-brass-500"
                  />
                  <span>{line.trimStart().slice(2)}</span>
                </li>
              ))}
            </ul>
          );
        }

        // Heading block: a line starting with "## " optionally followed
        // by a body paragraph.
        const headingLine = lines[0]?.trimStart();
        if (headingLine?.startsWith("## ")) {
          const heading = headingLine.slice(3).trim();
          const body = lines.slice(1).join(" ");
          return (
            <div key={i} className="space-y-2">
              <h2 className="pt-3 font-display text-xl font-semibold text-charcoal-900 sm:text-2xl">
                {heading}
              </h2>
              {body && <p className="leading-loose">{body}</p>}
            </div>
          );
        }

        return (
          <p key={i} className="leading-loose">
            {lines.join(" ")}
          </p>
        );
      })}
    </div>
  );
}
