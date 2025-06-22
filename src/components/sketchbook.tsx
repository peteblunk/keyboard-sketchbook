'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookText, Trash2, Play, XCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export interface TranscriptEntry {
  id: number;
  content: string;
  type: 'note' | 'chord';
}

interface SketchbookProps {
  entries: TranscriptEntry[];
  onClearEntry: (id: number) => void;
  onClearAll: () => void;
  onPlayEntry: (entry: TranscriptEntry) => void;
}

export function Sketchbook({ entries, onClearEntry, onClearAll, onPlayEntry }: SketchbookProps) {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // This effect scrolls to the bottom of the list when new entries are added.
    const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [entries]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1.5">
          <CardTitle className="flex items-center gap-2">
            <BookText /> Composition Sketchbook
          </CardTitle>
          <CardDescription>Notes and chords you play will appear here. You can replay or delete them.</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={onClearAll} disabled={entries.length === 0}>
          <XCircle className="mr-2" />
          Clear All
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48 w-full rounded-md border" ref={scrollAreaRef}>
          <div className="p-4 space-y-2">
            {entries.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-16">Play some notes to get started...</p>
            ) : (
              entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                >
                  <span className={cn(
                    "font-mono text-sm",
                    entry.type === 'chord' && "font-bold"
                  )}>
                    {entry.content}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => onPlayEntry(entry)}
                    >
                      <Play className="h-4 w-4" />
                      <span className="sr-only">Play {entry.content}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => onClearEntry(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Clear entry</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
