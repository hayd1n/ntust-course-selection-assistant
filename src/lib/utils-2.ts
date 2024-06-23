export function getCopyNumber(str: string): number | null {
  // matches the end of "copy" and may have a number.
  const regex = /copy(?:\s(\d+))?$/;
  const match = str.match(regex);
  if (match)
    // returns the number if there is a number part, otherwise returns 1.
    return match[1] ? parseInt(match[1], 10) : 1;

  return null;
}

export function replaceCopyNumber(str: string, newNumber: number): string {
  // the regular expression matches the "copy" ending, which may be followed by a number.
  const regex = /copy(\s\d+)?$/;
  if (regex.test(str)) {
    // use the replace method to replace the matched part
    return str.replace(regex, `copy ${newNumber}`);
  }
  return str; // if there is no match, return the original string
}
