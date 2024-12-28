import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export type VideoLayout = 'side-by-side' | 'top-bottom' | 'picture-in-picture';

interface VideoLayoutControlsProps {
  layout: VideoLayout;
  setLayout: (layout: VideoLayout) => void;
  ratio: number;
  setRatio: (ratio: number) => void;
  pipPosition: { x: number; y: number };
  setPipPosition: (position: { x: number; y: number }) => void;
}

export const VideoLayoutControls = ({
  layout,
  setLayout,
  ratio,
  setRatio,
  pipPosition,
  setPipPosition,
}: VideoLayoutControlsProps) => {
  return (
    <div className="space-y-6 p-4 border rounded-lg">
      <div className="space-y-2">
        <h3 className="font-medium">Layout Style</h3>
        <RadioGroup
          value={layout}
          onValueChange={(value) => setLayout(value as VideoLayout)}
          className="grid grid-cols-3 gap-4"
        >
          <div>
            <RadioGroupItem value="side-by-side" id="side-by-side" className="peer sr-only" />
            <Label
              htmlFor="side-by-side"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="flex h-16 w-full items-center justify-center gap-2">
                <div className="h-full w-1/2 bg-muted-foreground/20"></div>
                <div className="h-full w-1/2 bg-muted-foreground/20"></div>
              </div>
              <span className="mt-2">Side by Side</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="top-bottom" id="top-bottom" className="peer sr-only" />
            <Label
              htmlFor="top-bottom"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="flex h-16 w-full flex-col items-center justify-center gap-2">
                <div className="h-1/2 w-full bg-muted-foreground/20"></div>
                <div className="h-1/2 w-full bg-muted-foreground/20"></div>
              </div>
              <span className="mt-2">Top Bottom</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="picture-in-picture" id="picture-in-picture" className="peer sr-only" />
            <Label
              htmlFor="picture-in-picture"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="relative h-16 w-full">
                <div className="absolute inset-0 bg-muted-foreground/20"></div>
                <div className="absolute bottom-2 right-2 h-8 w-8 bg-muted-foreground/40"></div>
              </div>
              <span className="mt-2">PiP</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {layout === 'picture-in-picture' && (
        <div className="space-y-4">
          <div>
            <Label>PiP Size (% of main video)</Label>
            <Slider
              value={[ratio * 100]}
              onValueChange={([value]) => setRatio(value / 100)}
              min={10}
              max={50}
              step={1}
              className="mt-2"
            />
          </div>
          <div>
            <Label>PiP Position</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <Label>X Position</Label>
                <Slider
                  value={[pipPosition.x * 100]}
                  onValueChange={([value]) => setPipPosition({ ...pipPosition, x: value / 100 })}
                  min={0}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Y Position</Label>
                <Slider
                  value={[pipPosition.y * 100]}
                  onValueChange={([value]) => setPipPosition({ ...pipPosition, y: value / 100 })}
                  min={0}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};