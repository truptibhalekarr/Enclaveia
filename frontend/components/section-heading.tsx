import { Badge } from "@/components/ui/badge";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <Badge className="mb-4">{eyebrow}</Badge>
      <h2 className="font-display text-4xl font-bold text-ink sm:text-5xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-wine-700/78">{description}</p>
    </div>
  );
}
