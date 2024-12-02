import formatDate from './formatDate';
import dayjs from 'dayjs';

describe('formatDate Function', () => {
  it('formats future dates as relative time', () => {
    const futureDate = dayjs().add(1, 'day').toDate();
    const result = formatDate(futureDate);
    expect(result).toContain('a few seconds ago');
  });

  it('formats recent past dates as relative time', () => {
    const recentDate = dayjs().subtract(1, 'hour').toDate();
    const result = formatDate(recentDate);
    expect(result).toContain('ago');
  });

  it('formats dates within the last week with weekday and time', () => {
    const lastWeekDate = dayjs().subtract(3, 'day').toDate();
    const result = formatDate(lastWeekDate);
    expect(result).toMatch(/^[a-zA-Z]+, \d{2}:\d{2}$/);
  });

  it('formats dates older than a week with DD.MM.YYYY, HH:mm', () => {
    const olderDate = dayjs().subtract(8, 'day').toDate();
    const result = formatDate(olderDate);
    expect(result).toMatch(/^\d{2}\.\d{2}\.\d{4}, \d{2}:\d{2}$/);
  });
});
