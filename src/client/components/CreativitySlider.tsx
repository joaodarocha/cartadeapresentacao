export function convertToSliderValue(value: number): number {
  const newValue = value / 50;
  return Number(newValue.toFixed(1));
}

export function convertToSliderLabel(value: number): string {
  if (value < 17) {
    return 'mais padrão';
  } else if (value < 35) {
    return 'um pouco criativo';
  } else if (value < 55) {
    return 'mais criativo';
  } else if (value < 69) {
    return 'muito criativo';
  } else {
    return 'perigosamente criativo';
  }
}
