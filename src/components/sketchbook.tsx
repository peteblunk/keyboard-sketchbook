'use client';

import * as React from 'react'; // Keep React import as it's used for hooks
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookText, Trash2, Play, XCircle, PlusCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export interface TranscriptEntry {
  id: number;
  content: string;
  type: 'note' | 'chord';
}

export interface SketchbookRow {
  id: number;
  entries: TranscriptEntry[];
}

interface SketchbookProps {
  rows: SketchbookRow[];
  onClearEntry: (rowId: number, entryId: number) => void;
  onClearAll: () => void;
  onAddRow: () => void;
  onPlayEntry: (entry: TranscriptEntry) => void;
}

export function Sketchbook({ rows, onClearEntry, onClearAll, onAddRow, onPlayEntry }: SketchbookProps) {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Scroll to the bottom when a new row is added
    const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [rows.length]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1.5">
          <CardTitle className="flex items-center gap-2">
            <BookText /> Keyboard Sketchbook
          </CardTitle>
          <CardDescription>A grid to sketch out musical ideas. Add new rows for different parts.</CardDescription>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onAddRow}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Row
            </Button>
            <Button variant="outline" size="sm" onClick={onClearAll} disabled={rows.length === 1 && rows[0].entries.length === 0}>
              <XCircle className="mr-2 h-4 w-4" />
              Clear All
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 w-full rounded-md border" ref={scrollAreaRef}>
          <div className="p-1 space-y-1">
            {rows.map((row, rowIndex) => (
              <div
                key={row.id}
                className={cn(
                  "flex flex-wrap items-center gap-2 p-2 rounded-md min-h-[44px]",
                  rowIndex < rows.length -1 && "border-b"
                )}
              >
                {row.entries.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic px-2">Play notes or chords to add them to this line...</p>
                ) : (
                  row.entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-1 pl-2 rounded-md bg-muted/60 hover:bg-muted transition-colors group"
                    >
                      <span className={cn(
                        "font-mono text-sm",
                        entry.type === 'chord' && "font-bold"
                      )}>
                        {entry.content}
                      </span>
                      <div className="flex items-center opacity-50 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-foreground"
                          onClick={() => onPlayEntry(entry)}
                        >
                          <Play className="h-3 w-3" />
                          <span className="sr-only">Play {entry.content}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => onClearEntry(row.id, entry.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                          <span className="sr-only">Clear entry</span>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
