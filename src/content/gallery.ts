/**
 * Photos for /gallery: life away from the keyboard. Shown without captions.
 * Put the image files in public/gallery/ and add one entry per photo, in the order they should appear.
 * width and height are the file's pixel size; they let the grid reserve space so nothing jumps while loading.
 * The Gallery link appears in the navigation once this list has at least one photo.
 */

export type GalleryCategory = "Campus" | "Outdoors" | "Everyday";

export type Photo = {
  src: string;
  width: number;
  height: number;
  /** What the photo shows, for screen readers. */
  alt: string;
  category: GalleryCategory;
  /** Optional, free text, e.g. "Aug 2025". */
  date?: string;
  place?: string;
};

const p = (name: string, width: number, height: number, category: GalleryCategory, alt: string): Photo => ({
  src: `/gallery/${name}.jpg`,
  width,
  height,
  category,
  alt,
});

export const gallery: Photo[] = [
  p("mountain-camp", 1920, 2560, "Outdoors", "Kurt in sunglasses on a grassy field, a green mountain and tents behind him"),
  p("between-classes", 2560, 1706, "Campus", "Kurt in his school uniform giving a thumbs-up outside a campus building"),
  p("sunset-ride", 1920, 2560, "Outdoors", "Kurt taking a selfie beside his motorcycle on a wide road at sunset"),
  p("lab-day", 1920, 2560, "Campus", "Kurt in a blue hoodie and school lanyard making shaka signs indoors"),
  p("waterfall", 1920, 2560, "Outdoors", "Kurt standing under a small waterfall surrounded by forest"),
  p("skateboard-wall", 1920, 2560, "Everyday", "Kurt photographing a wall of painted skateboard decks"),
  p("campus-uniform", 2560, 1706, "Campus", "Kurt in his school uniform and orange-tinted sunglasses near a campus gate"),
  p("camp-tents", 1920, 2560, "Outdoors", "Kurt standing on a field with tents and a cloud-topped mountain behind"),
  p("mall-day", 1421, 2560, "Everyday", "Kurt taking a mirror selfie inside a mall"),
  p("falls-rest", 1920, 2560, "Outdoors", "Kurt sitting on smooth rocks by a waterfall under palm trees"),
  p("campus-selfie", 1920, 2560, "Campus", "Close-up selfie of Kurt wearing a university lanyard"),
  p("garden-break", 960, 1280, "Outdoors", "Kurt sitting on a stone seat beside flowering shrubs"),
  p("gym-session", 1920, 2560, "Everyday", "Kurt taking a mirror selfie at the gym"),
  p("river-rocks", 1920, 2560, "Outdoors", "Kurt in sunglasses posing among large rocks along a river"),
  p("campus-gate", 2560, 1706, "Campus", "Kurt in his school uniform sitting on a motorcycle by a blue and yellow campus gate"),
  p("overcast-afternoon", 1920, 2560, "Outdoors", "Kurt in a black jacket standing on a street under a cloudy sky"),
  p("waterfall-day", 1920, 2560, "Outdoors", "Kurt sitting in a shallow cascade making hand signs, forest behind"),
  p("cloudy-street", 1920, 2560, "Outdoors", "Kurt in sunglasses standing on a village street under heavy clouds"),
  p("gym-again", 1920, 2560, "Everyday", "Kurt taking another mirror selfie at the gym"),
];
