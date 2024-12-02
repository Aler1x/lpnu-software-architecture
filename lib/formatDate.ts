
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localeData from 'dayjs/plugin/localeData';

dayjs.extend(relativeTime);
dayjs.extend(localeData);

const formatDate = function (date: Date) {
  const ts = dayjs(date)
  const daysDiff = dayjs().diff(ts, 'day');

  if (daysDiff < 2) {
    const now = dayjs();
    return ts.isAfter(now) ? now.fromNow() : ts.fromNow();
  } else if (daysDiff < 7) {
    return ts.format('dddd, HH:mm');
  } else {
    return ts.format('DD.MM.YYYY, HH:mm');
  }
};

export default formatDate;

