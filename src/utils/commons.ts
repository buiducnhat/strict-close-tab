export const secToDuration = (secondInput: number) => {
  const hours = Math.floor(secondInput / (60 * 60));

  const divisor_for_minutes = secondInput % (60 * 60);
  const minutes = Math.floor(divisor_for_minutes / 60);

  const divisor_for_seconds = divisor_for_minutes % 60;
  const seconds = Math.ceil(divisor_for_seconds);

  const obj = {
    h: hours,
    m: minutes,
    s: seconds,
  };

  return obj;
};

export const formatDuration = ({ h, m, s }: { h: number; m: number; s: number }) => {
  return (
    h.toString().padStart(2, '0') +
    ':' +
    m.toString().padStart(2, '0') +
    ':' +
    s.toString().padStart(2, '0')
  );
};
