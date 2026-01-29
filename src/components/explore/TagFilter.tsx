"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { IconX } from "@tabler/icons-react";

interface Tag {
  id: string;
  name: string;
  slug: string;
  _count: { questions: number };
}

interface TagFilterProps {
  tags: Tag[];
}

export function TagFilter({ tags }: TagFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedTag = searchParams.get("tag");

  const handleTagClick = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedTag === slug) {
      params.delete("tag");
    } else {
      params.set("tag", slug);
    }
    router.push(`/explore?${params.toString()}`);
  };

  const clearTag = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("tag");
    router.push(`/explore?${params.toString()}`);
  };

  if (tags.length === 0) {
    return <p className="text-sm text-muted-foreground">No tags yet</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {selectedTag && (
        <button
          onClick={clearTag}
          className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground text-sm font-medium"
        >
          {tags.find(t => t.slug === selectedTag)?.name || selectedTag}
          <IconX size={14} stroke={2} />
        </button>
      )}
      {tags
        .filter(tag => tag.slug !== selectedTag)
        .slice(0, selectedTag ? 9 : 10)
        .map((tag) => (
          <button
            key={tag.id}
            onClick={() => handleTagClick(tag.slug)}
            className="group px-3 py-1.5 border-2 border-foreground text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
          >
            {tag.name}
            <span className="ml-1 text-muted-foreground group-hover:text-background">
              {tag._count.questions}
            </span>
          </button>
        ))}
    </div>
  );
}
