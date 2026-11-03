import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

/**
 * Renders plain-text content stored in the database:
 * blank-line-separated paragraphs, and lines starting with "- " become list items.
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

        return (
          <p key={i} className="leading-loose">
            {lines.join(" ")}
          </p>
        );
      })}
    </div>
  );
}
