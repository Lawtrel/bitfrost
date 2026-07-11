export function calculateCarouselProgress(
    selectedIndex: number,
    slideCount: number
    ) {
    if (slideCount <= 1) {
    return 100;
    }

  return ((selectedIndex + 1) / slideCount) * 100;
}