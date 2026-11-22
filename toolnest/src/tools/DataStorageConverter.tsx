import { useState } from 'react';
import { convertData, dataUnits, unitName, type DataBase, type DataUnit } from '../lib/calc/datastorage.ts';
import { formatNumber } from '../lib/calc/format.ts';
import { parseNumber } from '../lib/calc/result.ts';
import { ClearButton, CopyButton, ErrorNote, Grid, Note, NumberInput, Results, Segmented, SelectField, Stat } from '../components/ui';

export default function DataStorageConverter() {
  const [base, setBase] = useState<DataBase>('decimal');
  const [value, setValue] = useState('1');
  const [from, setFrom] = useState<DataUnit>('GB');
  const n = parseNumber(value);
  const opts = dataUnits.map((u) => ({ value: u, label: `${unitName(u, base)}${u === 'B' ? ' (bytes)' : ''}` }));
  const results = n === null ? null : dataUnits.map((u) => ({ u, r: convertData(n, from, u, base) }));
  const err = results?.find((x) => !x.r.ok);

  return (
    <div>
      <Segmented label="Unit standard" value={base} onChange={setBase}
        options={[{ value: 'decimal', label: 'Decimal (1 KB = 1000 B)' }, { value: 'binary', label: 'Binary (1 KiB = 1024 B)' }]} />
      <div className="mt-4">
        <Grid>
          <NumberInput label="Size" value={value} onChange={setValue} placeholder="e.g. 1" />
          <SelectField label="Unit" value={from} onChange={setFrom} options={opts} />
        </Grid>
      </div>
      <ErrorNote message={value.trim() !== '' && n === null ? 'Please enter a valid number.' : err && !err.r.ok ? err.r.error : null} />
      {results && !err && (
        <Results>
          <Grid cols={3}>
            {results.map((x) => x.r.ok && <Stat key={x.u} big={x.u !== from} label={unitName(x.u, base)} value={formatNumber(x.r.value, 8)} />)}
          </Grid>
          <div className="flex gap-2"><CopyButton text={results.map((x) => (x.r.ok ? `${formatNumber(x.r.value, 8)} ${unitName(x.u, base)}` : '')).join(' = ')} /><ClearButton onClick={() => setValue('')} /></div>
        </Results>
      )}
      <Note>Decimal units (KB, MB, GB) use powers of 1000 and are used by drive makers and most networks. Binary units (KiB, MiB, GiB) use powers of 1024 and are how many operating systems measure memory and files. That is why a “1 TB” drive shows as about 931 GiB.</Note>
    </div>
  );
}
