import { useMemo, useState } from 'react';
import { calculateAge, parseISODate, todayYMD, weekdayOf } from '../lib/calc/age.ts';
import { formatNumber } from '../lib/calc/format.ts';
import { ClearButton, CopyButton, ErrorNote, Grid, Note, Results, Stat } from '../components/ui';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function AgeCalculator() {
  const [dob, setDob] = useState('');
  const today = todayYMD();
  const max = `${today.y}-${String(today.m).padStart(2, '0')}-${String(today.d).padStart(2, '0')}`;

  const out = useMemo(() => {
    if (!dob) return null;
    const p = parseISODate(dob);
    if (!p) return { error: 'Please enter a valid date.' } as const;
    const r = calculateAge(p, todayYMD());
    return r.ok ? ({ age: r.value } as const) : ({ error: r.error } as const);
  }, [dob]);

  const age = out && 'age' in out ? out.age : null;
  const summary = age ? `${age.years} years, ${age.months} months, ${age.days} days (${formatNumber(age.totalDays)} days lived)` : '';

  return (
    <div>
      <div className="max-w-sm">
        <label htmlFor="dob" className="label">Date of birth</label>
        <input id="dob" type="date" className="input" value={dob} max={max} min="1900-01-01" onChange={(e) => setDob(e.target.value)} />
        <p className="mt-1 text-xs text-muted">Example: 1990-05-15. Age is calculated as of today ({max}).</p>
      </div>
      {out && 'error' in out && <ErrorNote message={out.error} />}
      {age && (
        <Results>
          <Stat big label="Your age" value={age.isBirthdayToday ? `${age.years} years old. Happy birthday! 🎂` : `${age.years} years, ${age.months} months, ${age.days} days`} />
          <Grid cols={3}>
            <Stat label="Total days lived" value={formatNumber(age.totalDays)} />
            <Stat label="Total months" value={formatNumber(age.totalMonths)} />
            <Stat label="Total weeks" value={formatNumber(age.totalWeeks)} />
          </Grid>
          <Stat
            label="Next birthday"
            value={age.isBirthdayToday ? 'Today!' : `in ${formatNumber(age.daysToNextBirthday)} day${age.daysToNextBirthday === 1 ? '' : 's'}`}
            sub={`${weekdayOf(age.nextBirthday)}, ${age.nextBirthday.d} ${MONTHS[age.nextBirthday.m - 1]} ${age.nextBirthday.y}`}
          />
          <div className="flex gap-2"><CopyButton text={summary} /><ClearButton onClick={() => setDob('')} /></div>
          {parseISODate(dob)?.m === 2 && parseISODate(dob)?.d === 29 && (
            <Note>Born on 29 February: in non-leap years the birthday is counted on 28 February.</Note>
          )}
        </Results>
      )}
      {!dob && <div className="mt-4"><ClearButton onClick={() => setDob('')} /></div>}
    </div>
  );
}
