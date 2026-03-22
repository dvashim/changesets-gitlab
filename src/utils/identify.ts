export const identify = <T>(
  _: T
): _ is Exclude<
  T,
  '' | (T extends boolean ? false : boolean) | null | undefined
> => !!_
